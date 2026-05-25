/**
 * Basit in-memory rate limiter.
 * Aynı IP'den 10 dakikada maksimum MAX_REQUESTS form gönderimi izin verir.
 */

const MAX_REQUESTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 dakika

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
