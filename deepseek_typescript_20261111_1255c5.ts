// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.create({
    data: { name: 'Outerwear', slug: 'outerwear' }
  })

  const product = await prisma.product.create({
    data: {
      name: 'Oversized Blazer',
      slug: 'oversized-blazer',
      description: 'A modern oversized blazer with premium fabric, perfect for casual or formal look.',
      price: 599000,
      categoryId: category.id,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop', // Ganti dengan URL asli
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'
      ],
      variants: {
        create: [
          { size: 'S', color: 'Beige', stock: 10, sku: 'BLZ-BEI-S' },
          { size: 'M', color: 'Beige', stock: 15, sku: 'BLZ-BEI-M' },
          { size: 'L', color: 'Black', stock: 5, sku: 'BLZ-BLK-L' },
        ]
      }
    }
  })
  
  console.log({ product })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })