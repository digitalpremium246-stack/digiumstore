// src/app/(admin)/admin/page.tsx
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // Menarik data riil dari database
  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: 'PAID' }
  });
  
  const totalOrders = await prisma.order.count();
  const tryOnJobs = await prisma.virtualTryOnJob.count();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p>
          <p className="text-3xl font-bold mt-2">Rp {(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Pesanan</p>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500 font-medium">AI Try-On Digunakan</p>
          <p className="text-3xl font-bold mt-2">{tryOnJobs} kali</p>
        </div>
      </div>
    </div>
  );
}