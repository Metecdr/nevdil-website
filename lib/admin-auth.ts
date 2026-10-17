/**
 * Admin kimlik doğrulama yardımcıları.
 * proxy.ts, giriş action'ı ve silme action'ı bu tek kaynağı kullanır (DRY).
 */
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "./admin-session";

/**
 * İsteğin geçerli admin oturumuna sahip olup olmadığını kontrol eder.
 * Server action'larda defense-in-depth için kullanılır (proxy'ye ek olarak).
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifySession(token);
}
