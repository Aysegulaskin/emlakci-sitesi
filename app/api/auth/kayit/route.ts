import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { ad, email, sifre } = await request.json();

  if (!ad || !email || !sifre) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  }

  if (sifre.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
  }

  const mevcut = await prisma.user.findUnique({ where: { email } });
  if (mevcut) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  const hashedSifre = await bcrypt.hash(sifre, 10);
  await prisma.user.create({
    data: { name: ad, email, password: hashedSifre, role: "USER" },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
