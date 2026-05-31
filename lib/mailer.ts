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
  const from = process.env.FROM_EMAIL
    ? `Nev-Dil <${process.env.FROM_EMAIL}>`
    : "Nev-Dil <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY || !to) {
    console.log("📧 [Mailer] E-posta gönderilmedi (RESEND_API_KEY veya NOTIFICATION_EMAIL eksik)");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const tarih = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  });

  const waNumber = (() => {
    const c = data.phone.replace(/\D/g, "");
    if (c.startsWith("90") && c.length === 12) return c;
    if (c.startsWith("0") && c.length === 11) return "9" + c;
    if (c.length === 10) return "90" + c;
    return c;
  })();

  const waText = encodeURIComponent(
    `Merhaba ${data.name}, Nev-Dil Yabancı Dil Kursu ön kaydınızı aldık. En kısa sürede sizi bilgilendireceğiz.`
  );

  await resend.emails.send({
    from,
    to,
    subject: `🎓 Yeni Ön Kayıt: ${data.name} — ${data.program}`,
    html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Logo / Başlık -->
        <tr>
          <td style="background:#EAB308;border-radius:16px 16px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:3px;color:#000000aa;text-transform:uppercase;">Nev-Dil Yabancı Dil Kursu</p>
                  <h1 style="margin:6px 0 0;font-size:22px;font-weight:900;color:#000;">🎓 Yeni Ön Kayıt Başvurusu</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Bilgiler -->
        <tr>
          <td style="background:#1a1a1a;padding:0 32px;">

            <!-- Ad -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:18px 0 14px;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">Ad Soyad</td>
                <td style="padding:18px 0 14px;color:#fff;font-size:16px;font-weight:700;">${data.name}</td>
              </tr>
            </table>

            <!-- Telefon -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:14px 0;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">Telefon</td>
                <td style="padding:14px 0;">
                  <a href="tel:${data.phone}" style="color:#EAB308;font-size:18px;font-weight:800;text-decoration:none;">${data.phone}</a>
                </td>
              </tr>
            </table>

            <!-- Program -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:14px 0;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">Program</td>
                <td style="padding:14px 0;"><span style="background:#EAB308;color:#000;font-size:12px;font-weight:800;padding:4px 10px;border-radius:6px;">${data.program}</span></td>
              </tr>
            </table>

            ${data.ageGroup ? `
            <!-- Yaş / Sınıf -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:14px 0;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">Yaş / Sınıf</td>
                <td style="padding:14px 0;color:#ccc;font-size:14px;">${data.ageGroup}</td>
              </tr>
            </table>` : ""}

            ${data.email ? `
            <!-- E-posta -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:14px 0;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;">E-posta</td>
                <td style="padding:14px 0;color:#ccc;font-size:14px;">${data.email}</td>
              </tr>
            </table>` : ""}

            ${data.message ? `
            <!-- Mesaj -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #2a2a2a;">
              <tr>
                <td style="padding:14px 0;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;width:120px;vertical-align:top;">Mesaj</td>
                <td style="padding:14px 0;color:#aaa;font-size:14px;line-height:1.6;font-style:italic;">"${data.message}"</td>
              </tr>
            </table>` : ""}

            <!-- Tarih -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:14px 0 20px;color:#555;font-size:12px;">📅 ${tarih}</td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Butonlar -->
        <tr>
          <td style="background:#111;border-radius:0 0 16px 16px;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:12px;">
                  <a href="https://wa.me/${waNumber}?text=${waText}"
                     style="display:inline-block;background:#22c55e;color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">
                    💬 WhatsApp ile Yanıtla
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <a href="https://nevdil.com/nvd-panel"
                     style="display:inline-block;background:#EAB308;color:#000;font-weight:800;font-size:13px;padding:12px 28px;border-radius:50px;text-decoration:none;">
                    📋 Tüm Kayıtları Gör
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;color:#333;font-size:11px;">Nev-Dil Yabancı Dil Kursu · nevdil.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
}
