/**
 * Basit in-memory rate limiter.
 * Aynı IP'den 10 dakikada maksimum MAX_REQUESTS form gönderimi izin verir.
 */

const MAX_REQUESTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 dakika

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Süresi dolan girdileri periyodik temizle — bellek sızıntısını önler.
// (Nginx birincil rate-limit; bu ikincil katmanın hijyeni.)
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 10 * 60 * 1000; // 10 dakika

function sweepExpired(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [ip, entry] of store) {
    if (now > entry.resetAt) store.delete(ip);
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  sweepExpired(now);
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
