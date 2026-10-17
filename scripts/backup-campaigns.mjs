import { mkdir, copyFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lockfile from "proper-lockfile";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(process.env.CAMPAIGN_DATA_DIR || path.join(root, "data", "campaigns"));
const backups = path.join(root, "data", "campaign-backups");
const manifest = path.join(source, "campaigns.json");
const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15);

async function main() {
  await mkdir(source, { recursive: true, mode: 0o700 });
  await mkdir(backups, { recursive: true, mode: 0o700 });
  const release = await lockfile.lock(source, {
    realpath: true, stale: 60_000, update: 10_000,
    retries: { retries: 8, minTimeout: 100, maxTimeout: 500, randomize: true },
  });
  try {
    try { await copyFile(manifest, path.join(backups, `campaigns-${stamp}.json`)); }
    catch (error) {
      if (error.code === "ENOENT") { console.log("Kayıt dönemi verisi henüz yok; yedek atlandı."); return; }
      throw error;
    }
  } finally { await release(); }

  const files = (await readdir(backups)).filter((name) => /^campaigns-\d{8}T\d{6}\.json$/.test(name)).sort().reverse();
  for (const name of files.slice(30)) await rm(path.join(backups, name));
  console.log(`Kayıt dönemleri yedeklendi: campaigns-${stamp}.json`);
}

main().catch((error) => { console.error("Kayıt dönemleri yedeklenemedi:", error.message); process.exitCode = 1; });

