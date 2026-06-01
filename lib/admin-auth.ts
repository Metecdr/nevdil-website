/**
 * Admin kimlik doğrulama yardımcıları.
 * proxy.ts, giriş action'ı ve silme action'ı bu tek kaynağı kullanır (DRY).
 */
import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "nevdil_admin";

/** Şifreden deterministik oturum token'ı üretir. */
export function makeToken(pass: string): string {
  return createHash("sha256")
    .update("nevdil_admin_salt_" + pass)
    .digest("hex");
}

/**
 * İsteğin geçerli admin oturumuna sahip olup olmadığını kontrol eder.
 * Server action'larda defense-in-depth için kullanılır (proxy'ye ek olarak).
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return token === makeToken(adminPass);
}
