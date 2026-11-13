// src/app/api/try-on/route.ts
import { aiRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // ... kode sebelumnya ...
  
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await aiRateLimit.limit(`tryon_${ip}`);
  
  if (!success) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
  }
  
  // ... lanjutkan proses upload ...
}