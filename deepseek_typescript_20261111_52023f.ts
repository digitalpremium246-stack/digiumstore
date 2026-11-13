// src/app/api/webhook/midtrans/route.ts (V2 Update)
// ... import ...
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, transaction_status, status_code, gross_amount, signature_key } = body;

  // 1. Signature Verification
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const hash = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest('hex');
  if (hash !== signature_key) return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });

  // 2. IDEMPOTENCY CHECK
  const existingOrder = await prisma.order.findUnique({ where: { id: order_id } });
  if (existingOrder?.status === 'PAID' || existingOrder?.status === 'COMPLETED') {
    // Jika sudah PAID, abaikan request duplikat
    return NextResponse.json({ status: 'OK', message: 'Already processed' });
  }

  // 3. Update Status & Log
  if (transaction_status === 'settlement' || transaction_status === 'capture') {
    await prisma.$transaction([
      prisma.order.update({ where: { id: order_id }, data: { status: 'PAID' } }),
      prisma.auditLog.create({ data: { action: 'PAYMENT_SUCCESS', entity: 'Order', entityId: order_id } })
    ]);
  }
  // ... handling cancel/expire ...
  return NextResponse.json({ status: 'OK' });
}