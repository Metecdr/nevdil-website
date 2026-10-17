import { GalleryError } from "./gallery-store";

export function assertSameOrigin(request: Request) {
  // SITE_URL is the explicit production trust boundary; never trust X-Forwarded-Host from a client.
  const expected = process.env.NODE_ENV === "production"
    ? new URL(process.env.SITE_URL || "https://nevdil.com").origin
    : new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin !== expected || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new GalleryError("İstek doğrulanamadı. Paneli kendi adresinden tekrar açın.", 403);
  }
}

export async function limitedBody(request: Request, limit: number): Promise<Buffer> {
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit)) throw new GalleryError("Dosya veya istek çok büyük.", 413);
  if (!request.body) throw new GalleryError("Boş istek.");
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new GalleryError("Dosya veya istek çok büyük.", 413); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(parts);
}
