import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tip = searchParams.get("tip");
  const kategori = searchParams.get("kategori");
  const il = searchParams.get("il");
  const minFiyat = searchParams.get("minFiyat");
  const maxFiyat = searchParams.get("maxFiyat");
  const minM2 = searchParams.get("minMetrekare");
  const maxM2 = searchParams.get("maxMetrekare");
  const odaSayisi = searchParams.get("odaSayisi");
  const q = searchParams.get("q");
  const oneCikan = searchParams.get("oneCikan");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const andKosullar: Record<string, unknown>[] = [{ aktif: true }];

  if (tip) andKosullar.push({ tip });
  if (kategori) andKosullar.push({ kategori });
  if (il) andKosullar.push({ il });
  if (odaSayisi) andKosullar.push({ odaSayisi });
  if (oneCikan === "true") andKosullar.push({ one_cikan: true });

  if (minFiyat || maxFiyat) {
    andKosullar.push({
      fiyat: {
        ...(minFiyat ? { gte: parseFloat(minFiyat) } : {}),
        ...(maxFiyat ? { lte: parseFloat(maxFiyat) } : {}),
      },
    });
  }

  if (minM2 || maxM2) {
    andKosullar.push({
      metrekare: {
        ...(minM2 ? { gte: parseInt(minM2) } : {}),
        ...(maxM2 ? { lte: parseInt(maxM2) } : {}),
      },
    });
  }

  if (q && q.trim()) {
    andKosullar.push({
      OR: [
        { baslik: { contains: q.trim() } },
        { aciklama: { contains: q.trim() } },
        { il: { contains: q.trim() } },
        { ilce: { contains: q.trim() } },
        { adres: { contains: q.trim() } },
      ],
    });
  }

  const where = { AND: andKosullar };

  const [ilanlar, total] = await Promise.all([
    prisma.ilan.findMany({
      where,
      include: { resimler: { orderBy: { sira: "asc" } }, ozellikler: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.ilan.count({ where }),
  ]);

  return NextResponse.json({ ilanlar, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { resimler, ozellikler, ...ilanData } = body;

  const ilan = await prisma.ilan.create({
    data: {
      ...ilanData,
      resimler: resimler
        ? {
            create: resimler.map((url: string, i: number) => ({
              url,
              sira: i,
            })),
          }
        : undefined,
      ozellikler: ozellikler
        ? {
            create: ozellikler.map((ad: string) => ({ ad })),
          }
        : undefined,
    },
    include: { resimler: true, ozellikler: true },
  });

  return NextResponse.json(ilan, { status: 201 });
}
