import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ favori: false });

  const userId = (session.user as { id?: string }).id!;
  const ilanId = request.nextUrl.searchParams.get("ilanId");
  if (!ilanId) return NextResponse.json({ favori: false });

  const favori = await prisma.favori.findUnique({
    where: { userId_ilanId: { userId, ilanId } },
  });

  return NextResponse.json({ favori: !!favori });
}
