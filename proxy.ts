import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Sadece /admin rotasını koru
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");

  if (auth && isValidAuth(auth)) {
    return NextResponse.next();
  }

  // Yetkisiz — tarayıcıda native şifre kutusu açılır
  return new NextResponse("Yetkisiz erişim.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Nev-Dil Admin"',
    },
  });
}

function isValidAuth(auth: string): boolean {
  try {
    const [type, credentials] = auth.split(" ");
    if (type !== "Basic" || !credentials) return false;

    const decoded = Buffer.from(credentials, "base64").toString("utf-8");
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) return false;

    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass) return false; // Şifre ayarlanmamışsa erişim yok

    return username === adminUser && password === adminPass;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
