import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ilan = await prisma.ilan.findUnique({
    where: { id },
    include: {
      resimler: { orderBy: { sira: "asc" } },
      ozellikler: true,
    },
  });

  if (!ilan) {
    return NextResponse.json({ error: "İlan bulunamadı" }, { status: 404 });
  }

  // Görüntüleme sayısını artır
  await prisma.ilan.update({
    where: { id },
    data: { goruntuleme: { increment: 1 } },
  });

  return NextResponse.json(ilan);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { resimler, ozellikler, ...ilanData } = body;

  const data: Record<string, unknown> = {
    ...ilanData,
  };

  if (resimler !== undefined) {
    await prisma.resim.deleteMany({ where: { ilanId: id } });
    data.resimler = {
      create: resimler.map((url: string, i: number) => ({
        url,
        sira: i,
      })),
    };
  }

  if (ozellikler !== undefined) {
    await prisma.ilanOzellik.deleteMany({ where: { ilanId: id } });
    data.ozellikler = {
      create: ozellikler.map((ad: string) => ({ ad })),
    };
  }

  const ilan = await prisma.ilan.update({
    where: { id },
    data,
    include: { resimler: true, ozellikler: true },
  });

  return NextResponse.json(ilan);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.ilan.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
