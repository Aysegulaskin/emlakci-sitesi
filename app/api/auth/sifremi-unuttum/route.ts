import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "E-posta gereklidir." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Güvenlik: kullanıcı bulunsun ya da bulunmasın aynı mesajı ver
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 saat

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expiresAt },
      create: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/sifre-sifirla?token=${token}`;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "EmlakPro <noreply@emlakpro.com.tr>",
        to: email,
        subject: "Şifre Sıfırlama — EmlakPro",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e2e8f0;">
            <h2 style="color:#1e293b;margin-bottom:16px;">🏠 EmlakPro — Şifre Sıfırlama</h2>
            <p style="color:#475569;">Merhaba ${user.name},</p>
            <p style="color:#475569;">Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link <strong>1 saat</strong> geçerlidir.</p>
            <a href="${resetUrl}" style="display:inline-block;margin:24px 0;background:#1d4ed8;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
              Şifremi Sıfırla
            </a>
            <p style="color:#94a3b8;font-size:12px;">Bu işlemi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Şifre sıfırlama maili gönderilemedi:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
