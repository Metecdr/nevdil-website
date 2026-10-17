import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addPhoto, editGallery, GalleryError, getGallery } from "@/lib/gallery-store";
import { assertSameOrigin, limitedBody } from "@/lib/gallery-http";
import { MAX_UPLOAD_BYTES } from "@/lib/gallery-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers });
function failure(error: unknown) {
  if (error instanceof GalleryError) return json({ error: error.message }, error.status);
  console.error("[gallery] Request failed:", error instanceof Error ? error.message : "unknown");
  return json({ error: "İşlem tamamlanamadı. Listeyi yenileyip tekrar deneyin." }, 503);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try { return json(await getGallery()); } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try {
    assertSameOrigin(request);
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data;")) throw new GalleryError("Geçersiz yükleme biçimi.", 415);
    const body = await limitedBody(request, MAX_UPLOAD_BYTES + 64 * 1024);
    let form: FormData;
    try { form = await new Response(new Uint8Array(body), { headers: { "Content-Type": contentType } }).formData(); }
    catch { throw new GalleryError("Yükleme okunamadı. Dosyayı tekrar seçin."); }
    const file = form.get("photo");
    if (!(file instanceof File) || form.getAll("photo").length !== 1) throw new GalleryError("Tek bir fotoğraf seçin.");
    if (form.get("consent") !== "yes") throw new GalleryError("Fotoğrafı yayınlama iznini onaylayın.");
    return json(await addPhoto(Buffer.from(await file.arrayBuffer()), form.get("caption"), file.type), 201);
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try {
    assertSameOrigin(request);
    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new GalleryError("Geçersiz istek biçimi.", 415);
    const body = await limitedBody(request, 8192);
    let command: unknown;
    try { command = JSON.parse(body.toString("utf8")); } catch { throw new GalleryError("Geçersiz istek."); }
    return json(await editGallery(command));
  } catch (error) { return failure(error); }
}
