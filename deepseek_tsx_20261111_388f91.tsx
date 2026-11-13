// src/app/(admin)/admin/ai-management/page.tsx
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function AIManagementPage() {
  const tokenLogs = await prisma.aITokenLog.aggregate({
    _sum: { cost: true, tokensIn: true, tokensOut: true },
  });

  const models = await prisma.aIModelConfig.findMany();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">AI Cost & Routing Management</h2>
      
      {/* Statistik Biaya */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Total Biaya API AI</p>
          <p className="text-2xl font-bold mt-2">${Number(tokenLogs._sum.cost || 0).toFixed(4)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Total Token Masuk</p>
          <p className="text-2xl font-bold mt-2">{tokenLogs._sum.tokensIn?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">Total Token Keluar</p>
          <p className="text-2xl font-bold mt-2">{tokenLogs._sum.tokensOut?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Tabel Konfigurasi Model */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Model Name</th>
              <th className="px-6 py-4">Tier (Routing)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {models.map(m => (
              <tr key={m.id}>
                <td className="px-6 py-4 uppercase font-medium">{m.provider}</td>
                <td className="px-6 py-4">{m.modelName}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold">{m.tier}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {m.isActive ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}