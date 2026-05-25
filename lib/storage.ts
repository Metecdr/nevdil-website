/**
 * Form kayıtlarını dosya sistemine yazar (NDJSON formatı).
 * Her kayıt ayrı satırda JSON olarak saklanır — append-only, concurrency-safe.
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "registrations.ndjson");

export type Registration = {
  id: number;
  timestamp: string;
  name: string;
  phone: string;
  program: string;
  ageGroup: string;
  email: string;
  message: string;
  ip: string;
};

/** Yeni kayıt ekler */
export function saveRegistration(data: Omit<Registration, "id" | "timestamp">): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const entry: Registration = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    fs.appendFileSync(FILE, JSON.stringify(entry) + "\n", "utf-8");
  } catch (err) {
    console.error("💾 Kayıt dosyaya yazılamadı:", err);
  }
}

/** Tüm kayıtları okur, en yeniden başlar */
export function getRegistrations(): Registration[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return fs
      .readFileSync(FILE, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Registration)
      .reverse();
  } catch {
    return [];
  }
}
