// src/lib/ai/provider.ts
export interface TryOnRequest {
  userImageUrl: string;
  productImageUrl: string;
}

export interface TryOnResponse {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
}

export interface VirtualTryOnProvider {
  generate(request: TryOnRequest): Promise<TryOnResponse>;
}

// 1. DEMO PROVIDER (Fallback)
export class DemoProvider implements VirtualTryOnProvider {
  async generate(request: TryOnRequest): Promise<TryOnResponse> {
    // Simulasi waktu proses AI (3 detik)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      // Kita gunakan placeholder yang jelas-jelas berlabel DEMO
      resultImageUrl: `https://placehold.co/600x800/eeeeee/333333?text=DEMO+TRY-ON+RESULT\n\nUser+Image+%2B+Product`,
    };
  }
}

// 2. REAL PROVIDER (Fashn.ai Example)
export class FashnAIProvider implements VirtualTryOnProvider {
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.FASHN_AI_API_KEY || "";
  }
  
  async generate(request: TryOnRequest): Promise<TryOnResponse> {
    if (!this.apiKey) {
      throw new Error("FASHN_AI_API_KEY is missing in environment variables.");
    }

    try {
      // CATATAN: Ini adalah contoh struktur request ke Fashn.ai. 
      // Sesuaikan dengan dokumentasi API terbaru dari provider yang Anda pilih.
      /*
      const response = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model_image: request.userImageUrl,
          garment_image: request.productImageUrl,
          category: "auto" // Bisa disesuaikan (tops, bottoms, one-pieces)
        })
      });
      const data = await response.json();
      // Asumsi API mengembalikan URL gambar langsung atau ID job yang perlu di-polling
      return { success: true, resultImageUrl: data.output[0] };
      */

      // Untuk sementara kita lempar error agar masuk ke catch, 
      // menandakan API nyata belum dikonfigurasi dengan benar
      throw new Error("Real API implementation pending configuration.");
      
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export function getAIProvider(): VirtualTryOnProvider {
  if (process.env.FASHN_AI_API_KEY) {
    return new FashnAIProvider();
  }
  return new DemoProvider(); // Otomatis fallback ke Demo jika tidak ada API Key
}