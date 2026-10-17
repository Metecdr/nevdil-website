import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { addPhoto, editGallery, getGallery, readPhoto } from "../lib/gallery-store";
import { createSession, verifySession, SESSION_SECONDS } from "../lib/admin-session";
import { assertSameOrigin, limitedBody } from "../lib/gallery-http";
import { checkLogin } from "../lib/admin-login";

test("owner gallery: storage, hostile files, concurrency and authentication", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "nevdil-gallery-test-"));
  process.env.GALLERY_DATA_DIR = path.join(temporary, "gallery");
  process.env.ADMIN_USER = "test-owner";
  process.env.ADMIN_PASSWORD = "isolated-test-password-not-for-deployment";
  try {
    const image = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: "#eab308" } }).jpeg().toBuffer();
    await t.test("re-encodes to bounded WebP and persists across reads", async () => {
      const gallery = await addPhoto(image, "Sınıfta etkinlik", "image/jpeg");
      assert.equal(gallery.photos.length, 1);
      assert.equal(gallery.photos[0].width, 1600);
      const encoded = await readPhoto(gallery.photos[0].id);
      assert.ok(encoded);
      const metadata = await sharp(encoded).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.exif, undefined);
      assert.equal((await getGallery()).revision, gallery.revision);
    });
    await t.test("rejects forged MIME, SVG, huge payload, blank caption and traversal", async () => {
      await assert.rejects(addPhoto(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>"), "Bad", "image/png"));
      await assert.rejects(addPhoto(Buffer.from("not an image"), "Bad", "image/jpeg"));
      await assert.rejects(addPhoto(Buffer.alloc(8 * 1024 * 1024 + 1), "Big", "image/jpeg"));
      await assert.rejects(addPhoto(image, "   ", "image/jpeg"));
      const huge = await sharp({ create: { width: 5000, height: 5000, channels: 3, background: "white" } }).png().toBuffer();
      await assert.rejects(addPhoto(huge, "Too many pixels", "image/png"));
      assert.equal(await readPhoto("../../.env.local"), null);
      assert.equal((await getGallery()).photos.length, 1);
    });
    await t.test("independent processes cannot lose simultaneous uploads", async () => {
      const run = promisify(execFile);
      await Promise.all(["red", "green", "blue"].map((color) => run(process.execPath,
        ["--import", "tsx", "tests/helpers/gallery-writer.ts", color], { env: process.env, timeout: 30_000 })));
      assert.equal((await getGallery()).photos.length, 4);
    });
    await t.test("reorders, edits and rejects stale or invalid updates", async () => {
      let gallery = await getGallery();
      const previous = gallery.revision;
      const ids = gallery.photos.map((p) => p.id).reverse();
      gallery = await editGallery({ action: "reorder", revision: previous, ids });
      assert.deepEqual(gallery.photos.map((p) => p.id), ids);
      await assert.rejects(editGallery({ action: "delete", revision: previous, id: ids[0] }));
      await assert.rejects(editGallery({ action: "reorder", revision: gallery.revision, ids: [ids[0], ids[0]] }));
      gallery = await editGallery({ action: "caption", revision: gallery.revision, id: ids[0], caption: "Güncel açıklama" });
      assert.equal(gallery.photos[0].caption, "Güncel açıklama");
      await editGallery({ action: "delete", revision: gallery.revision, id: ids[0] });
      assert.equal(await readPhoto(ids[0]), null);
      assert.equal((await getGallery()).photos.length, 3);
    });
    await t.test("corrupt manifest fails closed without erasing original data", async () => {
      const file = path.join(process.env.GALLERY_DATA_DIR!, "gallery.json");
      const original = await readFile(file);
      await writeFile(file, "broken");
      await assert.rejects(getGallery());
      await assert.rejects(addPhoto(image, "Must not save", "image/jpeg"));
      assert.equal(await readFile(file, "utf8"), "broken");
      await writeFile(file, original);
    });
    await t.test("session expires on server and password change; tampering rejected", () => {
      const now = Date.now();
      const token = createSession(now);
      assert.ok(verifySession(token, now));
      assert.notEqual(createSession(now), token);
      assert.equal(verifySession(token, now + SESSION_SECONDS * 1000), false);
      assert.equal(verifySession(token + "x", now), false);
      assert.equal(verifySession(undefined), false);
      process.env.ADMIN_PASSWORD += "changed";
      assert.equal(verifySession(token, now), false);
    });
    await t.test("login attempts share a per-client persisted limit without locking other owners out", async () => {
      assert.equal(await checkLogin("test-owner", process.env.ADMIN_PASSWORD!, "192.0.2.10"), "ok");
      for (let index = 0; index < 10; index++) assert.equal(await checkLogin("wrong", "wrong", "192.0.2.20"), "invalid");
      assert.equal(await checkLogin("test-owner", process.env.ADMIN_PASSWORD!, "192.0.2.20"), "limited");
      assert.equal(await checkLogin("test-owner", process.env.ADMIN_PASSWORD!, "192.0.2.21"), "ok");
    });
    await t.test("rejects cross-site/missing origins and chunked oversized bodies", async () => {
      const base = "http://localhost:4317";
      assertSameOrigin(new Request(base, { headers: { origin: base } }));
      assert.throws(() => assertSameOrigin(new Request(base, { headers: { origin: "https://attacker.invalid" } })));
      assert.throws(() => assertSameOrigin(new Request(base)));
      const request = new Request(base, { method: "POST", body: "123456" });
      await assert.rejects(limitedBody(request, 5));
      assert.equal((await limitedBody(new Request(base, { method: "POST", body: "123" }), 5)).toString(), "123");
    });
    await t.test("backup includes manifest and every live photo", async () => {
      const backupDir = path.join(temporary, "backups");
      await promisify(execFile)(process.execPath, ["scripts/backup-gallery.mjs"], {
        env: { ...process.env, GALLERY_BACKUP_DIR: backupDir }, timeout: 30_000,
      });
      const folders = await readdir(backupDir);
      assert.equal(folders.length, 1);
      const snapshot = path.join(backupDir, folders[0]);
      const manifest = JSON.parse(await readFile(path.join(snapshot, "gallery.json"), "utf8"));
      assert.equal(manifest.photos.length, 3);
      for (const photo of manifest.photos) assert.ok((await readFile(path.join(snapshot, `${photo.id}.webp`))).length);
    });
  } finally {
    // Only the unique test directory created above is removed.
    assert.equal(path.dirname(temporary), tmpdir());
    assert.ok(path.basename(temporary).startsWith("nevdil-gallery-test-"));
    await rm(temporary, { recursive: true, force: true });
  }
});
