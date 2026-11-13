// src/app/product/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { getProductBySlug } from "@/app/actions/product.actions";

// Note: Untuk production sesungguhnya, fetching data sebaiknya di Server Component. 
// Untuk simplifikasi interaksi state di tutorial ini, kita fetch di client.
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    getProductBySlug(params.slug).then((data) => {
      setProduct(data);
      if (data) {
        setSelectedColor(data.variants[0]?.color || "");
        setSelectedSize(data.variants[0]?.size || "");
      }
    });
  }, [params.slug]);

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  const availableColors = Array.from(new Set(product.variants.map((v: any) => v.color)));
  const availableSizes = product.variants.filter((v: any) => v.color === selectedColor).map((v: any) => v.size);
  const currentVariant = product.variants.find((v: any) => v.color === selectedColor && v.size === selectedSize);

  const handleAddToCart = () => {
    if (!currentVariant) return alert("Silakan pilih ukuran dan warna");
    if (currentVariant.stock <= 0) return alert("Stok habis");

    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
    alert("Berhasil ditambahkan ke keranjang!");
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img: string, i: number) => (
             <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer">
               <Image src={img} alt="Thumbnail" fill className="object-cover" />
             </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold">Rp {Number(product.price).toLocaleString('id-ID')}</p>
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Color Selector */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Color: <span className="text-gray-500">{selectedColor}</span></h3>
          <div className="flex space-x-3">
            {availableColors.map((color: any) => (
              <button 
                key={color}
                onClick={() => { setSelectedColor(color); setSelectedSize(""); }}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-medium text-sm">Size</h3>
             <button className="text-sm underline text-gray-500">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size: any) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 border text-sm font-medium rounded-md transition-colors ${
                  selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
          
          {/* Integrasi AI Try-On (Mockup Link) */}
          <button className="w-full border border-black text-black py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Virtual Try-On di Kamu
          </button>
        </div>

        {/* Accordion Info (Material, dll) */}
        <div className="border-t border-gray-200 pt-6 space-y-4">
           <details className="group cursor-pointer">
             <summary className="font-medium flex justify-between items-center list-none">
               Material & Care
               <span className="transition group-open:rotate-180">↓</span>
             </summary>
             <p className="text-sm text-gray-500 mt-2">100% Premium Cotton. Machine wash cold.</p>
           </details>
           <details className="group cursor-pointer">
             <summary className="font-medium flex justify-between items-center list-none">
               Shipping & Returns
               <span className="transition group-open:rotate-180">↓</span>
             </summary>
             <p className="text-sm text-gray-500 mt-2">Free shipping on orders over Rp 1.000.000. 30-day return policy.</p>
           </details>
        </div>
      </div>
    </div>
  );
}