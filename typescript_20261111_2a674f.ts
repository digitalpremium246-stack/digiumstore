// src/app/actions/admin.actions.ts
"use server"
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
const prisma = new PrismaClient();

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = formData.get('imageUrl') as string; // Di real app, ini adalah hasil upload file ke R2

  await prisma.product.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      price,
      description,
      categoryId,
      images: [imageUrl],
      variants: {
        create: [{ size: 'M', color: 'Black', stock: 10, sku: `SKU-${Date.now()}` }] // Default varian
      }
    }
  });

  revalidatePath('/admin/products'); // Refresh data di tabel admin
  revalidatePath('/shop'); // Refresh data di toko utama
}