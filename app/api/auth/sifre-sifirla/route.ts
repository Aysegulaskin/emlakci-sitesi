import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { token, sifre } = await request.json();

  if (!token || !sifre) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (sifre.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: "Link geçersiz veya süresi dolmuş." }, { status: 400 });
  }

  const hashedSifre = await bcrypt.hash(sifre, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedSifre },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}
