import { isAdminAuthenticated } from "@/lib/admin-auth";
import { addCampaign, CampaignError, editCampaign, getCampaignStore } from "@/lib/campaign-store";
import { assertSameOrigin, limitedBody } from "@/lib/gallery-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const responseHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: responseHeaders });

function failure(error: unknown) {
  if (error instanceof CampaignError) return json({ error: error.message }, error.status);
  console.error("[campaigns] Request failed:", error instanceof Error ? error.message : "unknown");
  return json({ error: "İşlem tamamlanamadı. Listeyi yenileyip tekrar deneyin." }, 503);
}

async function readCommand(request: Request) {
  assertSameOrigin(request);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") throw new CampaignError("Geçersiz istek biçimi.", 415);
  const body = await limitedBody(request, 16 * 1024);
  try { return JSON.parse(body.toString("utf8")) as unknown; }
  catch { throw new CampaignError("Geçersiz istek."); }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try { return json(await getCampaignStore()); } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try { return json(await addCampaign(await readCommand(request)), 201); } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return json({ error: "Oturumunuz sona erdi. Yeniden giriş yapın." }, 401);
  try { return json(await editCampaign(await readCommand(request))); } catch (error) { return failure(error); }
}

