/**
 * Form kayıtlarını dosya sistemine yazar (NDJSON formatı).
 * Her kayıt ayrı satırda JSON olarak saklanır — append-only.
 * UUID ID kullanılır, bozuk satırlar atlanır (veri kaybı değil, izolasyon).
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "registrations.ndjson");

export type Registration = {
  id: string;           // UUID — çakışma yok
  timestamp: string;
  name: string;
  phone: string;
  program: string;
  ageGroup: string;
  email: string;
  message: string;
  ip: string;
};

/** Yeni kayıt ekler. true = başarılı, false = dosyaya yazılamadı */
export function saveRegistration(
  data: Omit<Registration, "id" | "timestamp">
): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const entry: Registration = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    fs.appendFileSync(FILE, JSON.stringify(entry) + "\n", "utf-8");
    return true;
  } catch (err) {
    console.error("💾 [storage] Kayıt dosyaya yazılamadı:", err);
    return false;
  }
}

/**
 * Tüm kayıtları okur.
 * Bozuk satırlar sessizce atlanır — tek bir hatalı satır tüm listeyi mahvetmez.
 */
export function getRegistrations(): Registration[] {
  try {
    if (!fs.existsSync(FILE)) return [];

    const lines = fs
      .readFileSync(FILE, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean);

    const results: Registration[] = [];
    for (const line of lines) {
      try {
        results.push(JSON.parse(line) as Registration);
      } catch {
        console.warn("💾 [storage] Bozuk satır atlandı:", line.slice(0, 80));
      }
    }

    return results.reverse();
  } catch (err) {
    console.error("💾 [storage] Dosya okunamadı:", err);
    return [];
  }
}

/** Toplam kayıt sayısını döndürür (satır sayar, parse etmez — hızlı) */
export function getRegistrationCount(): number {
  try {
    if (!fs.existsSync(FILE)) return 0;
    const content = fs.readFileSync(FILE, "utf-8");
    return content.trim().split("\n").filter(Boolean).length;
  } catch {
    return 0;
  }
}
