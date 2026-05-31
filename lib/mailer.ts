import { Resend } from "resend";

export type RegistrationData = {
  name: string;
  phone: string;
  program: string;
  ageGroup: string;
  email: string;
  message: string;
};

export async function sendRegistrationEmail(data: RegistrationData): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.FROM_EMAIL || "onboarding@resend.dev";

  // API key veya hedef e-posta yoksa sadece log'a yaz
  if (!process.env.RESEND_API_KEY || !to) {
    console.log("📧 [Mailer] E-posta gönderilmedi (RESEND_API_KEY veya NOTIFICATION_EMAIL eksik)");
    return;
  }

  // Client'ı key varlığı doğrulandıktan sonra oluştur
  const resend = new Resend(process.env.RESEND_API_KEY);

  const tarih = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  });

  await resend.emails.send({
    from,
    to,
    subject: `🎓 Yeni Ön Kayıt: ${data.name} — ${data.program}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: #EAB308; padding: 24px 28px;">
          <h1 style="margin: 0; color: #000; font-size: 20px; font-weight: 900;">🎓 Yeni Ön Kayıt Başvurusu</h1>
          <p style="margin: 6px 0 0; color: #000000aa; font-size: 13px;">Nev-Dil Yabancı Dil Kursu</p>
        </div>
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #999; font-size: 13px; width: 130px;">Ad Soyad</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px; font-weight: 600;">${data.name}</td>
            </tr>
            <tr style="border-top: 1px solid #222;">
              <td style="padding: 10px 0; color: #999; font-size: 13px;">Telefon</td>
              <td style="padding: 10px 0; color: #EAB308; font-size: 14px; font-weight: 700;">${data.phone}</td>
            </tr>
            <tr style="border-top: 1px solid #222;">
              <td style="padding: 10px 0; color: #999; font-size: 13px;">Program</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.program}</td>
            </tr>
            <tr style="border-top: 1px solid #222;">
              <td style="padding: 10px 0; color: #999; font-size: 13px;">Yaş / Sınıf</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.ageGroup || "—"}</td>
            </tr>
            <tr style="border-top: 1px solid #222;">
              <td style="padding: 10px 0; color: #999; font-size: 13px;">E-posta</td>
              <td style="padding: 10px 0; color: #fff; font-size: 14px;">${data.email || "—"}</td>
            </tr>
            ${data.message ? `
            <tr style="border-top: 1px solid #222;">
              <td style="padding: 10px 0; color: #999; font-size: 13px; vertical-align: top;">Mesaj</td>
              <td style="padding: 10px 0; color: #ccc; font-size: 14px; line-height: 1.5;">${data.message}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 24px; padding: 14px; background: #111; border-radius: 10px; border-left: 3px solid #EAB308;">
            <p style="margin: 0; color: #666; font-size: 12px;">📅 ${tarih}</p>
          </div>
          <div style="margin-top: 16px; text-align: center;">
            <a href="https://nevdil.com/admin" style="display: inline-block; background: #EAB308; color: #000; font-weight: 900; font-size: 14px; padding: 12px 28px; border-radius: 50px; text-decoration: none;">
              Admin Paneline Git →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}
