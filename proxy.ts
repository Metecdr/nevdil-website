import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function makeToken(pass: string): string {
  return createHash("sha256")
    .update("nevdil_admin_salt_" + pass)
    .digest("hex");
}

export function proxy(request: NextRequest) {
  // Panel rotası dışındaki her şey serbest
  if (!request.nextUrl.pathname.startsWith("/nvd-panel")) {
    return NextResponse.next();
  }

  // Login sayfasına her zaman erişim serbest
  if (request.nextUrl.pathname.startsWith("/nvd-panel/giris")) {
    return NextResponse.next();
  }

  // Cookie kontrolü
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) {
    return NextResponse.redirect(new URL("/nvd-panel/giris", request.url));
  }

  const sessionCookie = request.cookies.get("nevdil_admin")?.value;
  const expectedToken = makeToken(adminPass);

  if (sessionCookie !== expectedToken) {
    const loginUrl = new URL("/nvd-panel/giris", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/nvd-panel", "/nvd-panel/:path*"],
};
