import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Yetkilendirme gerekiyor." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if ((session.user as { role?: string }).role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Bu işlem için yönetici olmanız gerekiyor." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Tüm alanlar zorunludur." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminCount = await prisma.user.count();
  if (adminCount >= 5) {
    return new Response(JSON.stringify({ error: "Zaten 5 yönetici hesabı mevcut. Yeni hesap oluşturamazsınız." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Bu e-posta zaten kullanımda." }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
