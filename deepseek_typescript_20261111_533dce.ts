// src/app/api/stylist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Definisikan Tools yang bisa digunakan AI
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Mencari produk fashion di database berdasarkan kategori, budget maksimal, atau warna.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Kata kunci pencarian (misal: 'kemeja', 'jaket')" },
          maxPrice: { type: "number", description: "Budget maksimal dalam Rupiah" },
          category: { type: "string", description: "Kategori spesifik (misal: 'Outerwear', 'Tops')" }
        },
        required: ["maxPrice"]
      }
    }
  }
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // 2. Panggil OpenAI dengan instruksi ketat (System Prompt)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Menggunakan model yang cepat dan murah
      messages: [
        {
          role: "system",
          content: `Anda adalah AI Personal Stylist untuk Digiumstore. 
          Tugas Anda adalah memberikan rekomendasi outfit (atasan, bawahan, sepatu jika relevan) berdasarkan permintaan user.
          ATURAN KETAT:
          1. Anda WAJIB menggunakan fungsi 'search_products' untuk mencari produk nyata di database. JANGAN mengarang produk.
          2. Jika user menyebutkan budget, pastikan total harga rekomendasi TIDAK MELEBIHI budget tersebut.
          3. Setelah mendapatkan data dari fungsi, berikan penjelasan singkat, hangat, dan bergaya (seperti stylist profesional) mengapa outfit ini cocok.
          4. Format respon Anda dalam teks santai. Produk akan ditampilkan secara otomatis oleh sistem di bawah pesan Anda.`
        },
        ...messages
      ],
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;

    // 3. Cek apakah AI memutuskan untuk memanggil fungsi pencarian
    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      
      if (toolCall.function.name === 'search_products') {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Query ke Database Prisma (Data Nyata)
        const products = await prisma.product.findMany({
          where: {
            price: { lte: args.maxPrice },
            OR: [
              { name: { contains: args.query || '', mode: 'insensitive' } },
              { category: { name: { contains: args.category || '', mode: 'insensitive' } } }
            ]
          },
          take: 4, // Batasi maksimal 4 item
          include: { variants: true }
        });

        // 4. Kirim hasil query kembali ke OpenAI untuk dirangkai menjadi kalimat
        const secondResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            ...messages,
            responseMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(products.map(p => ({ name: p.name, price: p.price })))
            }
          ],
        });

        return NextResponse.json({
          message: secondResponse.choices[0].message.content,
          products: products // Kirim data produk lengkap ke frontend
        });
      }
    }

    // Jika AI menjawab tanpa memanggil tool (misal: sapaan)
    return NextResponse.json({
      message: responseMessage.content,
      products: []
    });

  } catch (error: any) {
    console.error("AI Stylist Error:", error);
    return NextResponse.json({ error: 'Gagal menghubungi AI Stylist' }, { status: 500 });
  }
}