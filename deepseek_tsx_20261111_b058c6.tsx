// src/app/try-on/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, Loader2, Sparkles, Download } from "lucide-react";

export default function VirtualTryOnPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dummy Product ID (Di aplikasi nyata, ini diambil dari halaman detail produk)
  const DUMMY_PRODUCT_ID = "GANTI_DENGAN_ID_PRODUK_DARI_DATABASE"; 

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResultImage(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxFiles: 1 
  });

  const handleGenerate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("productId", DUMMY_PRODUCT_ID);

    try {
      const res = await fetch("/api/try-on", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal memproses Try-On");
      
      setResultImage(data.resultImageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Virtual Try-On Studio</h1>
        <p className="text-gray-500">Upload foto Anda dan lihat bagaimana pakaian ini terlihat pada Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* KOLOM KIRI: Upload / Before */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">1. Upload Foto Anda</h2>
          
          {!preview ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-black'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="font-medium">Klik atau drag & drop foto Anda</p>
              <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG. Maksimal 5MB.</p>
              <p className="text-xs text-gray-400 mt-4">Pastikan wajah dan tubuh terlihat jelas.</p>
            </div>
          ) : (
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image src={preview} alt="User Upload" fill className="object-cover" />
              <button 
                onClick={() => { setPreview(null); setFile(null); setResultImage(null); }}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-white"
              >
                Ganti Foto
              </button>
            </div>
          )}
          
          {file && !resultImage && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <><Loader2 className="animate-spin" /> Memproses AI...</>
              ) : (
                <><Sparkles /> Generate Try-On</>
              )}
            </button>
          )}
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        {/* KOLOM KANAN: Hasil / After */}
        <div className="space-y-4">
           <h2 className="font-semibold text-lg border-b pb-2">2. Hasil (After)</h2>
           
           <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
             {isProcessing ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 text-sm animate-pulse">AI sedang bekerja...</p>
                </div>
             ) : resultImage ? (
                <>
                  <Image src={resultImage} alt="AI Result" fill className="object-cover" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                     <button 
                       onClick={() => window.open(resultImage, '_blank')}
                       className="flex-1 bg-white/90 backdrop-blur text-black py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-white"
                     >
                       <Download size={18} /> Unduh
                     </button>
                     <button className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800">
                       Tambah ke Keranjang
                     </button>
                  </div>
                </>
             ) : (
                <div className="text-center text-gray-400 p-8">
                  <p>Hasil Try-On akan muncul di sini.</p>
                </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}