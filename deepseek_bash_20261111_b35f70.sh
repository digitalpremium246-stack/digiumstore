# SIMPAN SEBAGAI setup-digiumstore.sh (Mac/Linux) atau setup.ps1 (Windows)

echo "🚀 Membuat struktur folder Digiumstore..."
mkdir -p src/app/actions src/app/api/checkout src/app/api/stylist src/app/api/try-on src/app/api/webhook/midtrans
mkdir -p "src/app/(admin)/admin/products"
mkdir -p src/app/shop src/app/product/[slug] src/app/checkout src/app/try-on src/app/3d-studio src/app/stylist
mkdir -p src/components/3d src/lib/ai src/store prisma public/models public/uploads

echo "📦 Membuat file konfigurasi dasar..."

# 1. Package.json
cat << 'EOF' > package.json
{
  "name": "digiumstore",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "@react-three/drei": "^9.99.0",
    "@react-three/fiber": "^8.15.16",
    "@upstash/ratelimit": "^1.0.1",
    "@upstash/redis": "^1.28.4",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.3",
    "lucide-react": "^0.323.0",
    "midtrans-client": "^1.3.1",
    "next": "14.1.0",
    "openai": "^4.28.0",
    "react": "^18",
    "react-dom": "^18",
    "react-dropzone": "^14.2.3",
    "tailwind-merge": "^2.2.1",
    "three": "^0.161.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/three": "^0.161.2",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "prisma": "^5.10.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
EOF

# 2. Prisma Schema
cat << 'EOF' > prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model User {
  id String @id @default(uuid())
  email String @unique
  name String?
  role Role @default(CUSTOMER)
  orders Order[]
  tryOnJobs VirtualTryOnJob[]
}
enum Role { CUSTOMER ADMIN SUPER_ADMIN }

model Category {
  id String @id @default(uuid())
  name String
  slug String @unique
  products Product[]
}

model Product {
  id String @id @default(uuid())
  name String
  slug String @unique
  description String
  price Decimal @db.Decimal(10, 2)
  images String[]
  categoryId String
  isFeatured Boolean @default(false)
  createdAt DateTime @default(now())
  category Category @relation(fields: [categoryId], references: [id])
  variants ProductVariant[]
  tryOnJobs VirtualTryOnJob[]
}

model ProductVariant {
  id String @id @default(uuid())
  productId String
  size String
  color String
  stock Int @default(0)
  sku String @unique
  product Product @relation(fields: [productId], references: [id])
}

model Order {
  id String @id @default(uuid())
  userId String?
  totalAmount Decimal @db.Decimal(12, 2)
  status OrderStatus @default(PENDING)
  shippingAddress Json
  midtransOrderId String? @unique
  createdAt DateTime @default(now())
  user User? @relation(fields: [userId], references: [id])
  items OrderItem[]
}
enum OrderStatus { PENDING PAID SHIPPED COMPLETED CANCELLED }

model OrderItem {
  id String @id @default(uuid())
  orderId String
  productId String
  name String
  price Decimal @db.Decimal(12, 2)
  quantity Int
  size String
  color String
  order Order @relation(fields: [orderId], references: [id])
}

model VirtualTryOnJob {
  id String @id @default(uuid())
  userId String?
  productId String
  userImageUrl String
  productImageUrl String
  status JobStatus @default(PENDING)
  resultImageUrl String?
  errorMessage String?
  provider String
  createdAt DateTime @default(now())
  user User? @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}
enum JobStatus { PENDING PROCESSING COMPLETED FAILED }
EOF

# 3. Environment Variables Template
cat << 'EOF' > .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/digiumstore"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# AI Keys (Opsional)
FASHN_AI_API_KEY=""
OPENAI_API_KEY=""

# Payment (Midtrans Sandbox)
MIDTRANS_SERVER_KEY=""
MIDTRANS_CLIENT_KEY=""

# Rate Limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
EOF

# 4. Config Tailwind & Next
cat << 'EOF' > tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { background: "#FAFAFA", foreground: "#0A0A0A" } } },
  plugins: [],
};
export default config;
EOF

cat << 'EOF' > next.config.mjs
const nextConfig = { output: 'standalone' };
export default nextConfig;
EOF

echo "✅ Struktur folder dan file konfigurasi berhasil dibuat!"
echo "👉 Langkah selanjutnya:"
echo "1. Jalankan: npm install"
echo "2. Copy file .env.example menjadi .env dan isi DATABASE_URL"
echo "3. Jalankan: npx prisma db push"
echo "4. Copy kode UI/API dari chat history ke folder src/app/ yang sesuai."