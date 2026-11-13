// src/app/stylist/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, Sparkles, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  variants: { id: string; size: string; color: string; stock: number }[];
};

type Message = {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
};

export default function StylistPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Halo! Saya AI Stylist Anda. Mau cari outfit untuk acara apa hari ini? Sebutkan juga budget Anda ya!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kirim history chat (kecuali produk, hanya butuh role & content untuk konteks AI)
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) 
        }),
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: data.message, products: data.products }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Maaf, sepertinya koneksi saya sedang terganggu. Coba lagi sebentar ya." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = (products: Product[]) => {
    products.forEach(product => {
      // Pilih varian pertama yang ada stoknya
      const defaultVariant = product.variants.find(v => v.stock > 0);
      if (defaultVariant) {
        addItem({
          variantId: defaultVariant.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size: defaultVariant.size,
          color: defaultVariant.color,
          quantity: 1,
        });
      }
    });
    alert("Semua rekomendasi berhasil ditambahkan ke keranjang!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-purple-600" /> AI Personal Stylist
        </h1>
        <p className="text-sm text-gray-500">Rekomendasi outfit personal sesuai budget dan kebutuhan Anda.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 overflow-y-auto mb-4 shadow-sm">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === "user" 
                  ? "bg-black text-white rounded-br-none" 
                  : "bg-gray-100 text-black rounded-bl-none"
              }`}>
                {/* Teks Pesan */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {/* Render Produk Jika Ada */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {msg.products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                          <div className="relative aspect-square rounded-md overflow-hidden mb-2">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                          <p className="text-xs font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleAddAllToCart(msg.products!)}
                      className="w-full mt-2 bg-black text-white text-sm py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800"
                    >
                      <ShoppingBag size={16} /> Tambah Semua ke Keranjang
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 rounded-bl-none flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin" size={16} /> Stylist sedang memilihkan outfit...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Contoh: Saya mau outfit casual kerja budget 500rb..."
          className="w-full bg-white border border-gray-300 rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}