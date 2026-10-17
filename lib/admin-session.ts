import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "nevdil_admin";
export const SESSION_SECONDS = 12 * 60 * 60;

function signingKey() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(JSON.stringify([
    "nevdil-owner-session-v1", process.env.ADMIN_USER || "admin", password,
  ])).digest();
}

export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export function createSession(now = Date.now()): string {
  const key = signingKey();
  if (!key) throw new Error("Admin account is not configured");
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${createHmac("sha256", key).update(payload).digest("hex")}`;
}

export function verifySession(token: string | undefined, now = Date.now()): boolean {
  const key = signingKey();
  if (!key || !token || !/^\d{10}\.[0-9a-f]{48}\.[0-9a-f]{64}$/.test(token)) return false;
  const [expiry, nonce, signature] = token.split(".");
  const seconds = Math.floor(now / 1000);
  if (Number(expiry) <= seconds || Number(expiry) > seconds + SESSION_SECONDS) return false;
  return safeEqual(signature, createHmac("sha256", key).update(`${expiry}.${nonce}`).digest("hex"));
}
