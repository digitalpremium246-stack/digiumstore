// src/app/pricing/page.tsx (Konsep UI)
export default function PricingPage() {
  const plans = [
    { name: "Free", price: "Rp 0", credits: "1 Try-On (Trial)", features: ["Akses Katalog", "AI Stylist Basic"] },
    { name: "Pro Stylist", price: "Rp 99.000/bln", credits: "30 Try-On / bln", features: ["Unlimited AI Stylist", "Prioritas AI Heavy Model", "Simpan Wardrobe"] },
    { name: "Enterprise", price: "Rp 299.000/bln", credits: "150 Try-On / bln", features: ["Semua Fitur Pro", "Akses 3D Studio Premium", "Konsultasi Stylist Manusia"] },
  ];

  return (
    <div className="max-w-7xl mx-auto py-20 px-8">
      <h1 className="text-4xl font-bold text-center mb-4">Upgrade Your Style Experience</h1>
      <p className="text-center text-gray-500 mb-12">Dapatkan akses ke Virtual Try-On dan AI Stylist tanpa batas.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan.name} className={`p-8 rounded-2xl border ${plan.name === 'Pro Stylist' ? 'border-black shadow-lg relative' : 'border-gray-200'}`}>
            {plan.name === 'Pro Stylist' && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 text-xs rounded-full">MOST POPULAR</span>}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-3xl font-bold mt-4">{plan.price}</p>
            <p className="text-sm text-gray-500 mt-2">{plan.credits}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map(f => <li key={f} className="text-sm flex items-center gap-2">✓ {f}</li>)}
            </ul>
            <button className="w-full mt-8 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800">
              Pilih Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}