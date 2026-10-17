import { NextRequest, NextResponse } from "next/server";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin-session";

export function proxy(request: NextRequest) {
  // Panel rotası dışındaki her şey serbest
  if (!request.nextUrl.pathname.startsWith("/nvd-panel")) {
    return NextResponse.next();
  }

  // Login sayfasına her zaman erişim serbest
  if (request.nextUrl.pathname === "/nvd-panel/giris") {
    return NextResponse.next();
  }

  // Cookie kontrolü
  const sessionCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!verifySession(sessionCookie)) {
    return NextResponse.redirect(new URL("/nvd-panel/giris", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/nvd-panel", "/nvd-panel/:path*"],
};
