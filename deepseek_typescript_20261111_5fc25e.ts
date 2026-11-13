// src/app/api/webhook/midtrans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, status_code, gross_amount, signature_key } = body;

    // Verifikasi Signature (Keamanan)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest('hex');
    
    if (hash !== signature_key) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    // Update status pesanan
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: 'PAID' }
      });
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: 'CANCELLED' }
      });
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}