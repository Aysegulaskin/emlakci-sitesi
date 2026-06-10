import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface HosgeldinMesajiParams {
  ad: string;
  email?: string;
  telefon?: string;
  konu: string;
}

export async function hosgeldinMesajiGonder({
  ad,
  email,
  telefon,
  konu,
}: HosgeldinMesajiParams) {
  const sonuclar: { email?: string; telefon?: string; hatalar: string[] } = {
    hatalar: [],
  };

  // E-posta gönder
  if (email) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "EmlakPro <noreply@emlakpro.com.tr>",
        to: email,
        subject: `Merhaba ${ad}, Mesajınızı Aldık — EmlakPro`,
        html: `
          <!DOCTYPE html>
          <html lang="tr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:#1d4ed8;padding:32px 40px;text-align:center;">
                        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                          🏠 EmlakPro
                        </h1>
                        <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">
                          Güvenilir Emlak Portali
                        </p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">
                        <h2 style="margin:0 0 16px;color:#1e293b;font-size:20px;">
                          Merhaba ${ad}, 👋
                        </h2>
                        <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
                          Mesajınızı aldık. Size nasıl yardımcı olabileceğimizi öğrenmek için çok heyecanlıyız!
                        </p>
                        <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                          <strong style="color:#1e293b;">Konu:</strong> ${konu}
                        </p>

                        <!-- Info box -->
                        <div style="background:#eff6ff;border-left:4px solid #1d4ed8;border-radius:8px;padding:20px;margin:0 0 24px;">
                          <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.6;">
                            Uzman danışmanlarımız en kısa sürede sizinle iletişime geçecek. 
                            Ortalama yanıt süremiz <strong>2 saat</strong> içindedir.
                          </p>
                        </div>

                        <p style="margin:0 0 8px;color:#475569;font-size:14px;">
                          Acil bir durumunuz varsa bize doğrudan ulaşabilirsiniz:
                        </p>
                        <p style="margin:0 0 4px;color:#1e293b;font-size:14px;">
                          📞 <strong>0850 123 45 67</strong>
                        </p>
                        <p style="margin:0 0 32px;color:#1e293b;font-size:14px;">
                          ✉️ <strong>info@emlakpro.com.tr</strong>
                        </p>

                        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/ilanlar"
                          style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;">
                          İlanları İncele →
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                        <p style="margin:0;color:#94a3b8;font-size:12px;">
                          Bu e-posta EmlakPro iletişim formu aracılığıyla gönderilmiştir.<br/>
                          © 2024 EmlakPro. Tüm hakları saklıdır.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `Merhaba ${ad},\n\nMesajınızı aldık. Size nasıl yardımcı olabileceğimizi öğrenmek için çok heyecanlıyız!\n\nKonu: ${konu}\n\nUzman danışmanlarımız en kısa sürede sizinle iletişime geçecek.\n\nAcil durumlar için: 0850 123 45 67\n\nEmlakPro`,
      });
      sonuclar.email = email;
    } catch (err) {
      console.error("E-posta gönderilemedi:", err);
      sonuclar.hatalar.push("email");
    }
  }

  // Telefon varsa — SMS entegrasyonu için buraya eklenebilir
  // Şu an sadece logluyoruz
  if (telefon) {
    console.log(`📱 SMS gönderilecek: ${telefon} — Merhaba ${ad}, mesajınızı aldık. Nasıl yardımcı olabiliriz?`);
    sonuclar.telefon = telefon;
    // TODO: Netgsm veya başka bir SMS servisi entegre edilebilir
    // Örnek:
    // await netgsmSmsGonder(telefon, `Merhaba ${ad}, mesajınızı aldık. Nasıl yardımcı olabiliriz? - EmlakPro`);
  }

  return sonuclar;
}
