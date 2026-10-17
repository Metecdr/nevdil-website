import { mkdir, readFile, copyFile, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import lockfile from "proper-lockfile";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(process.env.GALLERY_DATA_DIR || path.join(root, "data", "gallery"));
const backups = path.resolve(process.env.GALLERY_BACKUP_DIR || path.join(root, "data", "gallery-backups"));
const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);
const name = `gallery-${stamp}-${randomUUID()}`;
const staging = path.join(backups, `.${name}.tmp`);

async function main() {
  await mkdir(source, { recursive: true, mode: 0o700 });
  await mkdir(backups, { recursive: true, mode: 0o700 });
  let compromised = false;
  const release = await lockfile.lock(source, { realpath: true, stale: 60_000, update: 10_000,
    retries: { retries: 8, minTimeout: 100, maxTimeout: 500, randomize: true }, onCompromised: () => { compromised = true; } });
  try {
    let gallery;
    try { gallery = JSON.parse(await readFile(path.join(source, "gallery.json"), "utf8")); }
    catch (error) { if (error.code === "ENOENT") { console.log("Galeri henüz yok; yedek atlandı."); return; } throw error; }
    await mkdir(staging, { mode: 0o700 });
    for (const photo of gallery.photos) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(photo.id)) throw new Error("Invalid photo ID");
      await copyFile(path.join(source, `${photo.id}.webp`), path.join(staging, `${photo.id}.webp`));
    }
    await copyFile(path.join(source, "gallery.json"), path.join(staging, "gallery.json"));
    if (compromised) throw new Error("Backup lock lost");
    await rename(staging, path.join(backups, name));
    console.log(`Galeri yedeklendi: ${gallery.photos.length} fotoğraf — ${name}`);
  } finally {
    await release();
    await rm(staging, { recursive: true, force: true });
  }
  // Keep seven complete snapshots; never delete unrelated folders or registration backups.
  const completed = (await readdir(backups, { withFileTypes: true })).filter((item) => item.isDirectory() &&
    /^gallery-\d{8}T\d{6}-[0-9a-f-]{36}$/.test(item.name)).map((item) => item.name).sort().reverse();
  for (const obsolete of completed.slice(7)) {
    const target = path.resolve(backups, obsolete);
    if (path.dirname(target) !== backups) throw new Error("Invalid backup path");
    await rm(target, { recursive: true });
  }
}
main().catch((error) => { console.error("Galeri yedeği alınamadı:", error.message); process.exitCode = 1; });
