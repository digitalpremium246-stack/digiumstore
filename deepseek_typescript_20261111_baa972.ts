// src/app/api/try-on/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { saveFileLocally } from '@/lib/storage';
import { getAIProvider } from '@/lib/ai/provider';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const productId = formData.get('productId') as string;

    if (!file || !productId) {
      return NextResponse.json({ error: 'Image and Product ID are required' }, { status: 400 });
    }

    // 1. Ambil data produk dari DB
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // 2. Simpan foto user
    const userImageUrl = await saveFileLocally(file);

    // 3. Buat Job di Database (Status: PROCESSING)
    const job = await prisma.virtualTryOnJob.create({
      data: {
        productId,
        userImageUrl,
        productImageUrl: product.images[0],
        status: 'PROCESSING',
        provider: process.env.FASHN_AI_API_KEY ? 'fashn' : 'demo'
      }
    });

    // 4. Panggil AI Provider
    const provider = getAIProvider();
    const aiResult = await provider.generate({
      userImageUrl,
      productImageUrl: product.images[0]
    });

    // 5. Update status Job berdasarkan hasil AI
    if (aiResult.success && aiResult.resultImageUrl) {
      await prisma.virtualTryOnJob.update({
        where: { id: job.id },
        data: { 
          status: 'COMPLETED', 
          resultImageUrl: aiResult.resultImageUrl 
        }
      });
      return NextResponse.json({ success: true, jobId: job.id, resultImageUrl: aiResult.resultImageUrl });
    } else {
      await prisma.virtualTryOnJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', errorMessage: aiResult.error }
      });
      return NextResponse.json({ error: aiResult.error || 'AI processing failed' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Try-On Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}