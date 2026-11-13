// src/app/(admin)/admin/products/page.tsx
import { PrismaClient } from '@prisma/client';
import { createProduct } from '@/app/actions/admin.actions';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true } });
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Produk</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabel Produk */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Produk</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                    {p.name}
                  </td>
                  <td className="px-6 py-4">{p.category.name}</td>
                  <td className="px-6 py-4">Rp {p.price.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Tambah Produk */}
        <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
          <h3 className="font-bold mb-4">Tambah Produk Baru</h3>
          <form action={createProduct} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Nama Produk</label>
              <input name="name" required className="w-full mt-1 border p-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Harga (Rp)</label>
              <input name="price" type="number" required className="w-full mt-1 border p-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Kategori</label>
              <select name="categoryId" required className="w-full mt-1 border p-2 rounded-md text-sm">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">URL Gambar (Sementara)</label>
              <input name="imageUrl" placeholder="https://..." required className="w-full mt-1 border p-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Deskripsi</label>
              <textarea name="description" required className="w-full mt-1 border p-2 rounded-md text-sm" rows={3} />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800">
              Simpan Produk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}