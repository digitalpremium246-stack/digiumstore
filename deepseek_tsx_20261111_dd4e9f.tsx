// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter">DIGIUMSTORE</div>
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <Link href="/shop">Shop</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/try-on">Try-On</Link>
          <Link href="/stylist">AI Stylist</Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/cart" className="text-sm font-medium">Cart (0)</Link>
          <Link href="/login" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-up">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none">
            Your Style.<br />
            Your AI Assistant.
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Discover a new way to shop. Try on, customize, and find your perfect look with AI.
          </p>
          <div className="flex space-x-4">
            <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link href="/try-on" className="border border-black text-black px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Sparkles size={18} /> Try Your Look
            </Link>
          </div>
        </div>
        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden bg-gray-200">
           {/* Ganti dengan gambar model asli */}
           <Image 
            src="/hero-model.jpg" 
            alt="AI Fashion Model" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-8 py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "AI Virtual Try-On", desc: "Lihat pakaian di tubuh Anda" },
            { title: "3D Avatar Studio", desc: "Kustomisasi avatar virtual" },
            { title: "AI Stylist", desc: "Rekomendasi outfit personal" },
            { title: "Secure Payment", desc: "Transaksi aman & terenkripsi" },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}