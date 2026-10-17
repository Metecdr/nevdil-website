import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import lockfile from "proper-lockfile";

// Separate from the existing registration store. Never place uploads inside .next/public.
export function galleryDirectory() {
  // Runtime data is supplied on the VPS, never bundled into a deployment artifact.
  return path.resolve(/* turbopackIgnore: true */ process.env.GALLERY_DATA_DIR || path.join(process.cwd(), "data", "gallery"));
}

export async function readJson<T>(file: string, initial: T): Promise<T> {
  try { return JSON.parse(await readFile(file, "utf8")) as T; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return initial;
    throw error; // A corrupt manifest must never be replaced with an empty one.
  }
}

export async function atomicJson(file: string, data: unknown) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(data), { mode: 0o600, flag: "wx" });
    await rename(temporary, file);
  } finally {
    await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") console.error("[gallery] Temporary file cleanup failed.");
    });
  }
}

// mkdir-based lock + heartbeat works across both PM2 workers; stale locks recover after crashes.
export async function withFileLock<T>(directory: string, action: (assertOwned: () => void) => Promise<T>): Promise<T> {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  let compromised: Error | undefined;
  const release = await lockfile.lock(directory, {
    realpath: true, stale: 60_000, update: 10_000,
    retries: { retries: 8, minTimeout: 100, maxTimeout: 500, randomize: true },
    onCompromised: (error) => { compromised = error; },
  });
  const assertOwned = () => { if (compromised) throw compromised; };
  try { return await action(assertOwned); }
  finally { await release(); }
}
