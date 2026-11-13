// src/lib/ai/router.ts
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Inisialisasi Provider (Bisa menggunakan OpenRouter untuk multi-model, atau SDK masing-masing)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // Contoh provider lain

export type AITask = "CHAT_LIGHT" | "CHAT_HEAVY" | "TRY_ON";

export async function routeAITask(task: AITask, payload: any, userId?: string) {
  // 1. Tentukan Model Berdasarkan Task
  let modelsToTry: string[] = [];

  if (task === "CHAT_LIGHT") {
    // Untuk sapaan atau pertanyaan ringan: Gunakan model murah/Free Tier
    modelsToTry = ["gpt-4o-mini", "llama-3-8b-8192"]; // Fallback ke Llama via Groq
  } else if (task === "CHAT_HEAVY") {
    // Untuk analisis outfit kompleks: Gunakan model reasoning kelas berat
    modelsToTry = ["gpt-4o", "claude-3-opus"]; 
  } else if (task === "TRY_ON") {
    // Khusus Try-On, provider berbeda (Fashn.ai / Replicate)
    return await handleTryOn(payload);
  }

  // 2. Auto-Roll / Fallback Mechanism
  for (const modelName of modelsToTry) {
    try {
      const start = Date.now();
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: payload.messages,
        tools: payload.tools,
      });

      // 3. Token & Cost Tracking
      const tokensIn = response.usage?.prompt_tokens || 0;
      const tokensOut = response.usage?.completion_tokens || 0;
      
      await logTokenUsage(modelName, task, tokensIn, tokensOut, userId);

      return response;
    } catch (error: any) {
      console.warn(`Model ${modelName} gagal (${error.message}). Auto-rolling ke model berikutnya...`);
      // Jika error (misal rate limit), loop akan lanjut ke model selanjutnya
    }
  }

  throw new Error("Semua AI Provider gagal merespons. Silakan coba lagi nanti.");
}

// Fungsi Logging Biaya
async function logTokenUsage(modelName: string, taskType: string, tokensIn: number, tokensOut: number, userId?: string) {
  const modelConfig = await prisma.aIModelConfig.findFirst({ where: { modelName } });
  if (!modelConfig) return;

  const cost = (tokensIn / 1000 * Number(modelConfig.costPer1kInput)) + 
               (tokensOut / 1000 * Number(modelConfig.costPer1kOutput));

  await prisma.aITokenLog.create({
    data: { modelId: modelConfig.id, userId, taskType, tokensIn, tokensOut, cost }
  });
}

async function handleTryOn(payload: any) {
  // Logika Try-On dari Phase 3
  return { success: true, url: "..." }; 
}