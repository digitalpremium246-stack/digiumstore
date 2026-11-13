// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import midtransClient from 'midtrans-client';

const prisma = new PrismaClient();
const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerDetails, totalAmount } = body;

    // 1. Simpan Order ke Database
    const order = await prisma.order.create({
      data: {
        totalAmount,
        shippingAddress: customerDetails,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          }))
        }
      }
    });

    // 2. Buat Transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: totalAmount
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email || 'guest@digiumstore.com',
        phone: customerDetails.phone
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // 3. Update Order dengan Midtrans ID
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransOrderId: order.id }
    });

    return NextResponse.json({ 
      success: true, 
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: order.id
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}