// src/components/storefront/HeroVideo.tsx
"use client";
import { useEffect, useState } from "react";

export function HeroVideo() {
  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    fetch('/api/ads/serve?placement=HOMEPAGE_HERO')
      .then(res => res.json())
      .then(data => {
        // Filter yang tipenya VIDEO
        const vid = data.data.find((d: any) => d.type === 'VIDEO');
        if (vid) setVideo(vid);
      });
  }, []);

  if (!video) return null;

  return (
    <div className="relative w-full h-[70vh] bg-black overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="w-full h-full object-cover opacity-70"
      >
        <source src={video.mediaUrl} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl font-bold mb-4">{video.title}</h1>
        {video.linkUrl && (
          <a href={`/api/ads/click/${video.id}`} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
            Lihat Promo
          </a>
        )}
      </div>
    </div>
  );
}