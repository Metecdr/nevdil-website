import { readPhoto } from "@/lib/gallery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const photo = await readPhoto((await params).id);
    if (!photo) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    return new Response(new Uint8Array(photo), { headers: {
      "Content-Type": "image/webp", "Content-Length": String(photo.length),
      "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store",
      "Content-Disposition": "inline", "Cross-Origin-Resource-Policy": "same-origin",
    } });
  } catch {
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
