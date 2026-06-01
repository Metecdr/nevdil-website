import { NextRequest, NextResponse } from "next/server";
import { makeToken, ADMIN_COOKIE } from "@/lib/admin-auth";

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

  const sessionCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (sessionCookie !== makeToken(adminPass)) {
    return NextResponse.redirect(new URL("/nvd-panel/giris", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/nvd-panel", "/nvd-panel/:path*"],
};
