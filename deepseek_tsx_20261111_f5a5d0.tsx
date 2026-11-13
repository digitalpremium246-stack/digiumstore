// src/app/page.tsx (Update)
import { HeroVideo } from "@/components/storefront/HeroVideo";
import { AdBannerSlot } from "@/components/storefront/AdBannerSlot";

export default function Home() {
  return (
    <main>
      {/* Video Promosi Utama (Full Screen) */}
      <HeroVideo />
      
      {/* Konten Digium */}
      <section className="max-w-7xl mx-auto px-8 py-12">
         <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
         {/* ... Grid produk Digium ... */}
      </section>

      {/* Slot Iklan Pemasang (Banner) */}
      <section className="max-w-7xl mx-auto px-8 py-12 border-t">
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sponsored Partners</h3>
         <AdBannerSlot placement="HOMEPAGE_MIDDLE" />
      </section>
    </main>
  );
}