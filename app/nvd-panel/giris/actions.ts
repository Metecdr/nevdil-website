"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { makeToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass || username !== adminUser || password !== adminPass) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, makeToken(adminPass), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: "/",
  });

  redirect("/nvd-panel");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/nvd-panel/giris");
}
