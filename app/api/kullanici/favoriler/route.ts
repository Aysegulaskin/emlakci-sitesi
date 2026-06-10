import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const favoriler = await prisma.favori.findMany({
    where: { userId },
    include: {
      ilan: { include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favoriler.map((f) => f.ilan));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const userId = (session.user as { id?: string }).id!;
  const { ilanId } = await request.json();

  const mevcut = await prisma.favori.findUnique({
    where: { userId_ilanId: { userId, ilanId } },
  });

  if (mevcut) {
    await prisma.favori.delete({ where: { userId_ilanId: { userId, ilanId } } });
    return NextResponse.json({ favori: false });
  }

  await prisma.favori.create({ data: { userId, ilanId } });
  return NextResponse.json({ favori: true });
}
