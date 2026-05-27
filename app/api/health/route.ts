import { getRegistrationCount } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = getRegistrationCount();

  return Response.json(
    {
      status: "ok",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      registrations: count,
    },
    {
      status: 200,
      headers: {
        // Cache'lenmemeli — her seferinde taze veri
        "Cache-Control": "no-store",
      },
    }
  );
}
