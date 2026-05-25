"use server";

export type FormState = {
  success: boolean;
  message: string;
} | null;

export async function submitOnKayit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const program = formData.get("program")?.toString() || "Belirtilmedi";
  const ageGroup = formData.get("ageGroup")?.toString() || "Belirtilmedi";
  const email = formData.get("email")?.toString().trim() || "—";
  const message = formData.get("message")?.toString().trim() || "—";

  if (!name || name.length < 2) {
    return { success: false, message: "Lütfen geçerli bir ad soyad girin." };
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return { success: false, message: "Lütfen geçerli bir telefon numarası girin." };
  }
  if (!program || program === "") {
    return { success: false, message: "Lütfen bir program seçin." };
  }

  console.log("🟡 Yeni Ön Kayıt:", {
    ad_soyad: name,
    telefon: phone,
    program,
    yas_sinif: ageGroup,
    eposta: email,
    mesaj: message,
    tarih: new Date().toLocaleString("tr-TR"),
  });

  return { success: true, message: "Başvurunuz alındı!" };
}

export async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const program = formData.get("program")?.toString() || "Belirtilmedi";
  const message = formData.get("message")?.toString().trim();

  // Zorunlu alanlar
  if (!name || name.length < 2) {
    return { success: false, message: "Lütfen geçerli bir ad soyad girin." };
  }
  if (!phone || phone.length < 10) {
    return { success: false, message: "Lütfen geçerli bir telefon numarası girin." };
  }

  // Burada e-posta gönderimi veya veritabanı kaydı eklenebilir.
  // Şimdilik sunucu loguna yazıyoruz.
  console.log("🟡 Yeni Ön Kayıt Başvurusu:", {
    ad_soyad: name,
    telefon: phone,
    eposta: email || "—",
    program,
    mesaj: message || "—",
    tarih: new Date().toLocaleString("tr-TR"),
  });

  return {
    success: true,
    message: "Başvurunuz alındı! En kısa sürede sizi arayacağız. 🎉",
  };
}
