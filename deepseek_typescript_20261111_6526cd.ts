// src/lib/ai/virtual-tryon-provider.ts

export interface TryOnRequest {
  userImageUrl: string;
  productImageUrl: string;
  category: "tops" | "bottoms" | "one-pieces";
}

export interface TryOnResponse {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
  providerJobId?: string;
}

export interface VirtualTryOnProvider {
  generate(request: TryOnRequest): Promise<TryOnResponse>;
  checkStatus(jobId: string): Promise<TryOnResponse>;
}

// Contoh Implementasi Dummy (Untuk Development)
export class DemoProvider implements VirtualTryOnProvider {
  async generate(request: TryOnRequest): Promise<TryOnResponse> {
    // Simulasi delay API
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      success: true,
      resultImageUrl: "https://placehold.co/600x800?text=DEMO+TRY-ON+RESULT",
    };
  }
  async checkStatus(jobId: string): Promise<TryOnResponse> {
    return { success: true, resultImageUrl: "https://placehold.co/600x800?text=DEMO" };
  }
}

// Contoh Implementasi Nyata (Fashn.ai) - Siap diaktifkan jika API Key tersedia
export class FashnAIProvider implements VirtualTryOnProvider {
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.FASHN_AI_API_KEY || "";
  }
  
  async generate(request: TryOnRequest): Promise<TryOnResponse> {
    if (!this.apiKey) throw new Error("Fashn.ai API Key missing");
    
    // Logika fetch ke API Fashn.ai
    // ...
    return { success: true, resultImageUrl: "..." };
  }
  
  async checkStatus(jobId: string): Promise<TryOnResponse> {
    // Logika cek status
    return { success: true, resultImageUrl: "..." };
  }
}

// Factory untuk memilih provider
export const getAIProvider = (): VirtualTryOnProvider => {
  const provider = process.env.AI_PROVIDER || "demo";
  if (provider === "fashn") return new FashnAIProvider();
  return new DemoProvider(); // Fallback aman
};