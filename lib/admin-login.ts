import path from "node:path";
import { createHash } from "node:crypto";
import { atomicJson, galleryDirectory, readJson, withFileLock } from "./file-store";
import { safeEqual } from "./admin-session";

// Shared by both PM2 processes. A single owner account needs a single persisted attempt budget.
type Attempts = { version: 1; buckets: Record<string, { count: number; resetAt: number }> };

export async function checkLogin(username: string, password: string, clientAddress = "unknown"): Promise<"ok" | "invalid" | "limited"> {
  const directory = path.join(galleryDirectory(), "auth");
  return withFileLock(directory, async (assertOwned) => {
    const file = path.join(directory, "attempts.json");
    const now = Date.now();
    const previous = await readJson<Attempts>(file, { version: 1, buckets: {} });
    const buckets = previous.version === 1 && previous.buckets && typeof previous.buckets === "object" ? previous.buckets : {};
    for (const [key, value] of Object.entries(buckets)) {
      if (!value || value.resetAt <= now || !Number.isInteger(value.count)) delete buckets[key];
    }
    // Hash addresses so the persisted anti-abuse file does not retain visitors' raw IP addresses.
    const key = createHash("sha256").update(clientAddress.slice(0, 128)).digest("hex");
    const state = buckets[key] || { count: 0, resetAt: now + 15 * 60_000 };
    if (state.count >= 10) return "limited";
    const configured = process.env.ADMIN_PASSWORD;
    const valid = !!configured && safeEqual(username, process.env.ADMIN_USER || "admin") && safeEqual(password, configured);
    if (valid) delete buckets[key];
    else buckets[key] = { ...state, count: state.count + 1 };
    // Bound disk use even under distributed attempts.
    const bounded = Object.fromEntries(Object.entries(buckets).sort((a, b) => b[1].resetAt - a[1].resetAt).slice(0, 500));
    assertOwned();
    await atomicJson(file, { version: 1, buckets: bounded });
    return valid ? "ok" : "invalid";
  });
}
