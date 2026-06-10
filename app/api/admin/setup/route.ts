import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Tüm alanlar zorunludur." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminCount = await prisma.user.count();
  if (adminCount > 0) {
    return new Response(JSON.stringify({ error: "Zaten bir yönetici var. Yeni yönetici oluşturulamaz." }), {
      status: 403,
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
