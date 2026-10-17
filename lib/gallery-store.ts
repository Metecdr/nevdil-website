import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { atomicJson, galleryDirectory, readJson, withFileLock } from "./file-store";
import { MAX_CAPTION_LENGTH, MAX_PHOTOS, MAX_UPLOAD_BYTES, type Gallery, type GalleryPhoto } from "./gallery-types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const MAX_STORED_BYTES = 120 * 1024 * 1024;
export class GalleryError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const isPhotoId = (id: string) => UUID.test(id);
const manifestPath = () => path.join(galleryDirectory(), "gallery.json");

export async function getGallery(): Promise<Gallery> {
  const gallery = await readJson<Gallery>(manifestPath(), { version: 1, revision: "empty", photos: [] });
  const ids = new Set<string>();
  if (gallery.version !== 1 || typeof gallery.revision !== "string" || !Array.isArray(gallery.photos) ||
    gallery.photos.length > MAX_PHOTOS || gallery.photos.some((p) => {
      if (!p || !isPhotoId(p.id) || ids.has(p.id)) return true;
      ids.add(p.id);
      return typeof p.caption !== "string" || !p.caption.trim() || p.caption.length > MAX_CAPTION_LENGTH ||
        /[\u0000-\u001f\u007f]/.test(p.caption) || !Number.isInteger(p.bytes) || p.bytes < 1 || p.bytes > 2 * 1024 * 1024 ||
        !Number.isInteger(p.width) || p.width < 1 || p.width > 1600 || !Number.isInteger(p.height) || p.height < 1 || p.height > 1600 ||
        typeof p.createdAt !== "string" || !Number.isFinite(Date.parse(p.createdAt));
    })) {
    throw new Error("Invalid gallery manifest");
  }
  return gallery;
}

export function validateCaption(value: unknown): string {
  if (typeof value !== "string") throw new GalleryError("Fotoğraf için kısa bir açıklama yazın.");
  const caption = value.trim();
  if (!caption || caption.length > MAX_CAPTION_LENGTH || /[\u0000-\u001f\u007f]/.test(caption)) {
    throw new GalleryError(`Açıklama 1–${MAX_CAPTION_LENGTH} karakter olmalıdır.`);
  }
  return caption;
}

async function save(gallery: Gallery, assertOwned: () => void) {
  assertOwned();
  const next = { ...gallery, revision: randomUUID() };
  await atomicJson(manifestPath(), next);
  return next;
}

// Also cleans files left by a process crash between writing an image and committing its manifest.
async function removeOrphans(gallery: Gallery) {
  const active = new Set(gallery.photos.map((p) => `${p.id}.webp`));
  for (const file of await readdir(galleryDirectory())) {
    if ((file.endsWith(".webp") && isPhotoId(file.slice(0, -5)) && !active.has(file)) ||
        /^gallery\.json\.[0-9a-f-]+\.tmp$/.test(file)) {
      await unlink(path.join(galleryDirectory(), file));
    }
  }
}

export async function addPhoto(input: Buffer, captionInput: unknown, mime: string): Promise<Gallery> {
  if (!input.length || input.length > MAX_UPLOAD_BYTES) throw new GalleryError("Fotoğraf en fazla 8 MB olabilir.", 413);
  if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) throw new GalleryError("JPG, PNG veya WebP fotoğraf seçin.");
  const magicMatches = (mime === "image/jpeg" && input.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) ||
    (mime === "image/png" && input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (mime === "image/webp" && input.toString("ascii", 0, 4) === "RIFF" && input.toString("ascii", 8, 12) === "WEBP");
  if (!magicMatches) throw new GalleryError("Dosya içeriği fotoğraf biçimiyle eşleşmiyor.");
  const caption = validateCaption(captionInput);
  return withFileLock(galleryDirectory(), async (assertOwned) => {
    const gallery = await getGallery();
    if (gallery.photos.length >= MAX_PHOTOS) throw new GalleryError("Galeri dolu. Yeni fotoğraf için önce bir fotoğraf silin.", 409);
    if (gallery.photos.filter((p) => Date.now() - Date.parse(p.createdAt) < 60_000).length >= 10)
      throw new GalleryError("Çok hızlı yüklüyorsunuz. Bir dakika sonra tekrar deneyin.", 429);
    await removeOrphans(gallery);
    let result;
    try {
      const image = sharp(input, { limitInputPixels: 20_000_000, failOn: "warning", sequentialRead: true });
      const meta = await image.metadata();
      if (!["jpeg", "png", "webp"].includes(meta.format || "") || (meta.pages || 1) !== 1) throw new Error("Unsupported image");
      // Re-encoding removes EXIF (including GPS), embedded payloads and original file names.
      result = await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 3 }).timeout({ seconds: 15 }).toBuffer({ resolveWithObject: true });
    } catch {
      throw new GalleryError("Fotoğraf okunamadı. Hareketli olmayan, en fazla 20 megapiksel JPG, PNG veya WebP kullanın.");
    }
    if (result.data.length > 2 * 1024 * 1024) throw new GalleryError("Fotoğraf çok ayrıntılı. Daha küçük bir kopyasını yükleyin.");
    if (gallery.photos.reduce((sum, p) => sum + p.bytes, 0) + result.data.length > MAX_STORED_BYTES)
      throw new GalleryError("Galeri depolama sınırına ulaştı.", 409);
    const photo: GalleryPhoto = { id: randomUUID(), caption, width: result.info.width, height: result.info.height,
      bytes: result.data.length, createdAt: new Date().toISOString() };
    const file = path.join(galleryDirectory(), `${photo.id}.webp`);
    assertOwned();
    await writeFile(file, result.data, { mode: 0o600, flag: "wx" });
    try { return await save({ ...gallery, photos: [...gallery.photos, photo] }, assertOwned); }
    catch (error) { await unlink(file).catch(() => {}); throw error; }
  });
}

export async function editGallery(command: unknown): Promise<Gallery> {
  if (!command || typeof command !== "object") throw new GalleryError("Geçersiz işlem.");
  const data = command as Record<string, unknown>;
  return withFileLock(galleryDirectory(), async (assertOwned) => {
    const gallery = await getGallery();
    if (data.revision !== gallery.revision) throw new GalleryError("Galeri başka bir pencerede değişti. Liste yenilendi; işlemi tekrar deneyin.", 409);
    if (data.action === "reorder") {
      const ids = data.ids;
      if (!Array.isArray(ids) || ids.length !== gallery.photos.length || new Set(ids).size !== ids.length ||
        ids.some((id) => !gallery.photos.some((p) => p.id === id))) throw new GalleryError("Geçersiz fotoğraf sırası.");
      return save({ ...gallery, photos: ids.map((id) => gallery.photos.find((p) => p.id === id)!) }, assertOwned);
    }
    const photo = gallery.photos.find((p) => p.id === data.id);
    if (!photo) throw new GalleryError("Fotoğraf bulunamadı.", 404);
    if (data.action === "caption") {
      const caption = validateCaption(data.caption);
      return save({ ...gallery, photos: gallery.photos.map((p) => p.id === photo.id ? { ...p, caption } : p) }, assertOwned);
    }
    if (data.action === "delete") {
      const next = await save({ ...gallery, photos: gallery.photos.filter((p) => p.id !== photo.id) }, assertOwned);
      await unlink(path.join(galleryDirectory(), `${photo.id}.webp`)).catch(() => {
        console.error("[gallery] Deleted photo file will be cleaned on the next upload.");
      });
      return next;
    }
    throw new GalleryError("Geçersiz işlem.");
  });
}

export async function readPhoto(id: string) {
  if (!isPhotoId(id)) return null;
  const gallery = await getGallery();
  if (!gallery.photos.some((p) => p.id === id)) return null;
  try { return await readFile(path.join(galleryDirectory(), `${id}.webp`)); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
