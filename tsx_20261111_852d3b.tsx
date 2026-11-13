// src/components/storefront/AdBannerSlot.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export function AdBannerSlot({ placement }: { placement: string }) {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/ads/serve?placement=${placement}`)
      .then(res => res.json())
      .then(data => {
        const imgs = data.data.filter((d: any) => d.type === 'BANNER');
        setBanners(imgs);
      });
  }, [placement]);

  if (banners.length === 0) return null;

  return (
    <div className="w-full py-8">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
        {banners.map(banner => (
          <a 
            key={banner.id} 
            href={`/api/ads/click/${banner.id}`}
            className="relative flex-shrink-0 w-full md:w-[48%] aspect-[2/1] rounded-xl overflow-hidden snap-center group"
          >
            <Image src={banner.mediaUrl} alt={banner.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            {banner.advertiser && (
              <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                Sponsored by {banner.advertiser.companyName}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}