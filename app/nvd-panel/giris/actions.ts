"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, ADMIN_COOKIE, SESSION_SECONDS } from "@/lib/admin-session";
import { checkLogin } from "@/lib/admin-login";
import { headers } from "next/headers";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string" || username.length > 100 || password.length > 256) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }
  try {
    const requestHeaders = await headers();
    // Nginx replaces X-Real-IP with the connecting address in production.
    const clientAddress = requestHeaders.get("x-real-ip") || requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const result = await checkLogin(username.trim(), password, clientAddress);
    if (result === "limited") return { error: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." };
    if (result !== "ok") return { error: "Kullanıcı adı veya şifre hatalı." };
  } catch {
    console.error("[admin] Login check unavailable.");
    return { error: "Giriş şu anda yapılamıyor. Biraz sonra tekrar deneyin." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_SECONDS,
    path: "/",
  });

  redirect("/nvd-panel");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/nvd-panel/giris");
}
