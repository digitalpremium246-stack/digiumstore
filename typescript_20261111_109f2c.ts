// src/app/actions/product.actions.ts
"use server"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true, variants: true },
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: { variants: true, category: true }
  });
}