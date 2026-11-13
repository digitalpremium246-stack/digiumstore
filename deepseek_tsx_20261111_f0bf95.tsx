// src/app/3d-studio/page.tsx
"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, useProgress } from "@react-three/drei";
import { Avatar } from "@/components/3d/Avatar";
import { Loader2 } from "lucide-react";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="text-sm font-medium text-black">{progress.toFixed(0)}% Loaded</p>
      </div>
    </Html>
  );
}

export default function ThreeDStudioPage() {
  // State Kustomisasi
  const [gender, setGender] = useState<"male" | "female">("male");
  const [skinColor, setSkinColor] = useState("#F3C5A3");
  const [clothingColor, setClothingColor] = useState("#1A1A1A");

  const skinTones = ["#F3C5A3", "#E0AC69", "#C68642", "#8D5524", "#FFDBAC"];
  const clothingColors = ["#1A1A1A", "#FFFFFF", "#4A5568", "#2B6CB0", "#9B2C2C", "#D69E2E"];

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">3D Avatar Studio</h1>
        <p className="text-gray-500">Kustomisasi avatar Anda dan coba berbagai pakaian secara virtual.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
        
        {/* PANEL KIRI: KONTROL UI */}
        <div className="lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-gray-200 h-fit">
          
          {/* Gender Selector */}
          <div className="space-y-3">
             <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Avatar</h3>
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${gender === "male" ? "bg-white shadow text-black" : "text-gray-500"}`}
                > Pria </button>
                <button 
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${gender === "female" ? "bg-white shadow text-black" : "text-gray-500"}`}
                > Wanita </button>
             </div>
          </div>

          {/* Skin Tone Selector */}
          <div className="space-y-3">
             <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Warna Kulit</h3>
             <div className="flex gap-3 flex-wrap">
               {skinTones.map(color => (
                 <button
                   key={color}
                   onClick={() => setSkinColor(color)}
                   className={`w-10 h-10 rounded-full border-2 transition-all ${skinColor === color ? "border-black scale-110" : "border-transparent"}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
          </div>

          {/* Clothing Selector */}
          <div className="space-y-3 border-t pt-6">
             <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Pakaian & Warna</h3>
             
             {/* Simulasi Pilihan Produk */}
             <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="border-2 border-black rounded-lg p-2 text-center text-sm font-medium cursor-pointer bg-gray-50">
                  Utility Jacket
                </div>
                <div className="border border-gray-200 rounded-lg p-2 text-center text-sm font-medium text-gray-400 cursor-not-allowed">
                  Cargo Pants
                </div>
             </div>

             <div className="flex gap-3 flex-wrap">
               {clothingColors.map(color => (
                 <button
                   key={color}
                   onClick={() => setClothingColor(color)}
                   className={`w-8 h-8 rounded-full border-2 transition-all ${clothingColor === color ? "border-black scale-110" : "border-gray-200"}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
          </div>
          
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-4">
            Simpan Look
          </button>
        </div>

        {/* PANEL KANAN: KANVAS 3D */}
        <div className="lg:col-span-2 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative">
          <Canvas shadows camera={{ position: [0, 2, 4], fov: 45 }}>
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <directionalLight position={[-10, 5, -10]} intensity={0.5} />
              
              {/* Environment memberikan refleksi realistis */}
              <Environment preset="city" />
              
              {/* Kontrol Interaktif: Rotasi 360 & Zoom */}
              <OrbitControls 
                enablePan={false} 
                minDistance={2} 
                maxDistance={6} 
                maxPolarAngle={Math.PI / 2} // Mencegah kamera masuk ke bawah lantai
              />
              
              <Avatar 
                skinColor={skinColor} 
                clothingColor={clothingColor} 
                gender={gender} 
              />
              
              {/* Bayangan di bawah avatar */}
              <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />
            </Suspense>
          </Canvas>
          
          {/* Overlay UI Info */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <span className="bg-white/80 backdrop-blur text-xs font-medium px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
              Drag untuk Rotasi 360°
            </span>
            <span className="bg-white/80 backdrop-blur text-xs font-medium px-3 py-1.5 rounded-full shadow-sm pointer-events-auto">
              Scroll untuk Zoom
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}