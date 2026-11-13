// src/app/api/ads/click/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const ad = await prisma.promoContent.findUnique({ where: { id: params.id } });
  
  if (ad && ad.linkUrl) {
    // Catat klik
    await prisma.promoContent.update({
      where: { id: ad.id },
      data: { clicks: { increment: 1 } }
    });
    // Redirect ke link tujuan
    return NextResponse.redirect(ad.linkUrl);
  }
  
  return NextResponse.redirect(new URL('/', req.url));
}