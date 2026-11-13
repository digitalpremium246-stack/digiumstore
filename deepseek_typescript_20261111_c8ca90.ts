// src/app/api/ads/serve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placement = searchParams.get('placement') || 'HOMEPAGE_HERO';
  const now = new Date();

  // Ambil konten yang aktif, dalam rentang tanggal, dan sesuai placement
  const ads = await prisma.promoContent.findMany({
    where: {
      placement,
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: { gte: now } }
      ]
    },
    include: { advertiser: true },
    take: 5 // Maksimal 5 banner per slot
  });

  // Catat Impresi (View) secara Asynchronous (tidak memblokir response)
  // Di production, ini sebaiknya menggunakan Redis Queue agar tidak membebani DB
  if (ads.length > 0) {
    const adIds = ads.map(a => a.id);
    prisma.promoContent.updateMany({
      where: { id: { in: adIds } },
      data: { impressions: { increment: 1 } }
    }).catch(console.error);
  }

  return NextResponse.json({ data: ads });
}