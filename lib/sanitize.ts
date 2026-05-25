/**
 * Input sanitizasyon — form girdilerinden tehlikeli içerik temizlenir.
 * XSS, HTML injection ve null-byte saldırılarına karşı koruma.
 */

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_PHONE_LENGTH = 20;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

/** HTML tag ve tehlikeli karakterleri temizler */
function stripHtml(input: string): string {
  return input
    .replace(/\0/g, "")                          // null byte
    .replace(/<[^>]*>/g, "")                     // HTML tagları
    .replace(/[<>]/g, "")                        // kalan < >
    .replace(/javascript:/gi, "")               // javascript: protokolü
    .replace(/on\w+\s*=/gi, "")                 // onclick=, onload= vb.
    .replace(/\s+/g, " ")                        // çoklu boşlukları birleştir
    .trim();
}

export type SanitizedForm = {
  name: string;
  phone: string;
  program: string;
  ageGroup: string;
  email: string;
  message: string;
};

export function sanitizeFormData(raw: {
  name: string;
  phone: string;
  program: string;
  ageGroup: string;
  email: string;
  message: string;
}): SanitizedForm {
  return {
    name: stripHtml(raw.name).slice(0, MAX_NAME_LENGTH),
    phone: raw.phone.replace(/[^\d\s\+\-\(\)]/g, "").slice(0, MAX_PHONE_LENGTH),
    program: stripHtml(raw.program).slice(0, 100),
    ageGroup: stripHtml(raw.ageGroup).slice(0, 100),
    email: raw.email.replace(/[^a-zA-Z0-9@._\-+]/g, "").slice(0, MAX_EMAIL_LENGTH),
    message: stripHtml(raw.message).slice(0, MAX_MESSAGE_LENGTH),
  };
}
