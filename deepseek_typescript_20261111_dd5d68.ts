// src/app/api/try-on/route.ts (Update V2)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // 1. Validasi Autentikasi (Gunakan NextAuth session)
  // const session = await getServerSession();
  // if (!session) return NextResponse.json({ error: "Harap login untuk menggunakan fitur ini" }, { status: 401 });
  const userId = "DUMMY_USER_ID"; // Ganti dengan session.user.id

  // 2. Cek Subscription & Kredit
  const subscription = await prisma.userSubscription.findUnique({
    where: { userId },
    include: { plan: true }
  });

  if (!subscription || subscription.status !== 'ACTIVE') {
    return NextResponse.json({ 
      error: "Fitur ini khusus Member. Silakan berlangganan.",
      action: "UPGRADE_REQUIRED" 
    }, { status: 403 });
  }

  if (subscription.tryOnCredits <= 0) {
    return NextResponse.json({ 
      error: "Kuota Try-On Anda habis. Silakan top-up atau upgrade plan.",
      action: "TOPUP_REQUIRED" 
    }, { status: 403 });
  }

  // 3. Potong Kredit (Deduct Credit)
  await prisma.userSubscription.update({
    where: { userId },
    data: { tryOnCredits: { decrement: 1 } }
  });

  // ... Lanjutkan proses upload & AI Try-On (Phase 3) ...
}