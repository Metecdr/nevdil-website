/**
 * Türkçe küfür ve spam/anlamsız içerik filtresi.
 */

const PROFANITY_LIST = [
  "sik", "orospu", "piç", "pic", "amk", "amına", "amina", "göt", "got",
  "yarrak", "yarak", "oç", "oc", "pezevenk", "ibne", "götveren", "gotveren",
  "bok", "sıktır", "siktir", "orosbuçocuğu", "kahpe", "kaltak", "sürtük",
  "surtuk", "puşt", "pust", "gavat", "oğlancı", "oglanci", "mükemmel değil",
  "fuck", "shit", "bitch", "bastard", "asshole", "dick", "pussy",
];

/** Metinde küfür var mı diye kontrol eder */
function containsProfanity(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .replace(/[ığüşöçİĞÜŞÖÇ]/g, (c) =>
      ({ ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c", İ: "i", Ğ: "g", Ü: "u", Ş: "s", Ö: "o", Ç: "c" }[c] ?? c)
    );

  return PROFANITY_LIST.some((word) => normalized.includes(word));
}

/** Anlamsız / spam içerik tespiti:
 *  - 4+ tekrarlayan aynı karakter (aaaa, 1111)
 *  - Sadece sayı ve boşluktan oluşan isim
 *  - Çok kısa veya çok uzun */
function isNonsense(text: string): boolean {
  if (/(.)\1{3,}/.test(text)) return true; // 4+ tekrar
  if (/^[\d\s\W]+$/.test(text)) return true; // sadece rakam/sembol
  return false;
}

export type FilterResult =
  | { ok: true }
  | { ok: false; reason: string };

export function filterContent(fields: {
  name?: string;
  message?: string;
  phone?: string;
}): FilterResult {
  const { name = "", message = "", phone = "" } = fields;

  if (containsProfanity(name) || containsProfanity(message)) {
    return { ok: false, reason: "Lütfen uygun bir dil kullanın." };
  }

  if (isNonsense(name)) {
    return { ok: false, reason: "Lütfen gerçek adınızı girin." };
  }

  if (message && isNonsense(message)) {
    return { ok: false, reason: "Mesajınız anlaşılır değil. Lütfen tekrar yazın." };
  }

  // Telefon: sadece rakam, boşluk, +, - kabul
  if (phone && /[a-zA-ZğüşöçıİĞÜŞÖÇ]/.test(phone)) {
    return { ok: false, reason: "Telefon numarası geçersiz." };
  }

  return { ok: true };
}
