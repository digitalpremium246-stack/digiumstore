// src/app/(admin)/admin/marketing/page.tsx
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function MarketingPage() {
  const contents = await prisma.promoContent.findMany({
    include: { advertiser: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Marketing & Ads Management</h2>
      
      {/* Tabel Performa Iklan */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Konten / Iklan</th>
              <th className="px-6 py-4">Pemasang</th>
              <th className="px-6 py-4">Penempatan</th>
              <th className="px-6 py-4">Impresi (Views)</th>
              <th className="px-6 py-4">Klik</th>
              <th className="px-6 py-4">CTR (%)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contents.map(c => {
              const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00";
              return (
                <tr key={c.id}>
                  <td className="px-6 py-4 font-medium">{c.title} <span className="text-xs text-gray-400 ml-2">({c.type})</span></td>
                  <td className="px-6 py-4">{c.advertiser ? c.advertiser.companyName : "Digium Internal"}</td>
                  <td className="px-6 py-4 text-xs font-mono bg-gray-100 rounded">{c.placement}</td>
                  <td className="px-6 py-4">{c.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4">{c.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{ctr}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}