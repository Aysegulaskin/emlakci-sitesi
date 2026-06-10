import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hosgeldinMesajiGonder } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const mesajlar = await prisma.mesaj.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(mesajlar);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ad, email, telefon, konu, mesaj } = body;

  if (!ad || !email || !konu || !mesaj) {
    return NextResponse.json(
      { error: "Tüm zorunlu alanları doldurun" },
      { status: 400 }
    );
  }

  // Veritabanına kaydet
  const yeniMesaj = await prisma.mesaj.create({
    data: { ad, email, telefon, konu, mesaj },
  });

  // Karşılama mesajı gönder (e-posta ve/veya SMS)
  // Hata olursa yine de 201 dönüyoruz — mesaj kaydedildi
  try {
    await hosgeldinMesajiGonder({ ad, email, telefon, konu });
  } catch (err) {
    console.error("Karşılama mesajı gönderilemedi:", err);
  }

  return NextResponse.json(yeniMesaj, { status: 201 });
}
