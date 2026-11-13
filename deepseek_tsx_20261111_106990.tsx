// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerDetails: form,
          totalAmount: getTotalPrice()
        })
      });

      const data = await res.json();
      
      if (data.token) {
        clearCart();
        // Redirect ke halaman pembayaran Midtrans Snap
        window.location.href = data.redirect_url;
      } else {
        alert("Gagal membuat pesanan: " + data.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) return <div className="p-20 text-center">Keranjang Anda kosong.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-2xl font-bold mb-6">Informasi Pengiriman</h1>
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
          <input required placeholder="Nama Lengkap" className="w-full border p-3 rounded-md" 
            onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Nomor WhatsApp" className="w-full border p-3 rounded-md" 
            onChange={e => setForm({...form, phone: e.target.value})} />
          <input required type="email" placeholder="Email" className="w-full border p-3 rounded-md" 
            onChange={e => setForm({...form, email: e.target.value})} />
          <textarea required placeholder="Alamat Lengkap" rows={4} className="w-full border p-3 rounded-md" 
            onChange={e => setForm({...form, address: e.target.value})} />
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
        <div className="bg-gray-50 p-6 rounded-xl border space-y-4">
          {items.map(item => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name} ({item.size})</span>
              <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
          </div>
          <button 
            form="checkout-form"
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-full font-medium mt-4 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Lanjut ke Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
}