"use server";

import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { filterContent } from "@/lib/profanity";
import { sendRegistrationEmail } from "@/lib/mailer";
import { sanitizeFormData } from "@/lib/sanitize";

export type FormState = {
  success: boolean;
  message: string;
} | null;

// ─── Yardımcı: IP al ───────────────────────────────────────────────────────
async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// ─── Ön Kayıt (Ana form) ───────────────────────────────────────────────────
export async function submitOnKayit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Honeypot kontrolü — bot tuzağı
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    // Bot yakalandı — başarılıymış gibi göster, alarm verme
    return { success: true, message: "Başvurunuz alındı!" };
  }

  // 2. Rate limiting
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return {
      success: false,
      message: "Çok fazla deneme yaptınız. Lütfen 10 dakika bekleyin.",
    };
  }

  // 3. Alanları al ve sanitize et
  const kvkk = formData.get("kvkk")?.toString();
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    program: formData.get("program")?.toString() ?? "Belirtilmedi",
    ageGroup: formData.get("ageGroup")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  };
  const { name, phone, program, ageGroup, email, message } = sanitizeFormData(raw);

  // 4. Temel doğrulama
  if (!name || name.length < 2) {
    return { success: false, message: "Lütfen geçerli bir ad soyad girin." };
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return { success: false, message: "Lütfen geçerli bir telefon numarası girin." };
  }
  if (!program || program === "") {
    return { success: false, message: "Lütfen bir program seçin." };
  }
  if (!kvkk) {
    return { success: false, message: "Devam etmek için KVKK onayı gereklidir." };
  }

  // 5. İçerik filtresi
  const filter = filterContent({ name, message, phone });
  if (!filter.ok) {
    return { success: false, message: filter.reason };
  }

  // 6. Log
  console.log("🟡 Yeni Ön Kayıt:", {
    ad_soyad: name,
    telefon: phone,
    program,
    yas_sinif: ageGroup || "—",
    eposta: email || "—",
    mesaj: message || "—",
    tarih: new Date().toLocaleString("tr-TR"),
    ip,
  });

  // 7. E-posta bildirimi (hata olursa form yine de başarılı döner)
  try {
    await sendRegistrationEmail({ name, phone, program, ageGroup, email, message });
  } catch (err) {
    console.error("📧 E-posta gönderilemedi:", err);
  }

  return { success: true, message: "Başvurunuz alındı!" };
}

// ─── Genel İletişim Formu ──────────────────────────────────────────────────
export async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Honeypot
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    return { success: true, message: "Başvurunuz alındı! En kısa sürede sizi arayacağız. 🎉" };
  }

  // 2. Rate limiting
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return {
      success: false,
      message: "Çok fazla deneme yaptınız. Lütfen 10 dakika bekleyin.",
    };
  }

  const { name, phone, email, program, message } = sanitizeFormData({
    name: formData.get("name")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    program: formData.get("program")?.toString() ?? "Belirtilmedi",
    ageGroup: formData.get("ageGroup")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  });

  if (!name || name.length < 2) {
    return { success: false, message: "Lütfen geçerli bir ad soyad girin." };
  }
  if (!phone || phone.length < 10) {
    return { success: false, message: "Lütfen geçerli bir telefon numarası girin." };
  }

  const filter = filterContent({ name, message, phone });
  if (!filter.ok) {
    return { success: false, message: filter.reason };
  }

  console.log("🟡 Yeni İletişim Başvurusu:", {
    ad_soyad: name,
    telefon: phone,
    eposta: email || "—",
    program,
    mesaj: message || "—",
    tarih: new Date().toLocaleString("tr-TR"),
    ip,
  });

  return {
    success: true,
    message: "Başvurunuz alındı! En kısa sürede sizi arayacağız. 🎉",
  };
}
