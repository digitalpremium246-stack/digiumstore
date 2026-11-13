// src/app/shop/page.tsx
import { getProducts } from "../actions/product.actions";
import Link from "next/link";
import Image from "next/image";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">
      {/* Sidebar Filter (Simplified for Phase 2) */}
      <aside className="w-full md:w-64 space-y-6">
        <h2 className="text-xl font-bold tracking-tight">Filter</h2>
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Category</h3>
          <ul className="space-y-2">
            <li className="font-medium">All Items</li>
            <li className="text-gray-500 hover:text-black cursor-pointer">Outerwear</li>
            <li className="text-gray-500 hover:text-black cursor-pointer">Tops</li>
            <li className="text-gray-500 hover:text-black cursor-pointer">Bottoms</li>
          </ul>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-500">Showing {products.length} products</p>
          <select className="border border-gray-300 rounded-md p-2 text-sm">
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={`/product/${product.slug}`} key={product.id} className="group">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm">{product.name}</h3>
                <p className="text-sm text-gray-500">Rp {product.price.toLocaleString('id-ID')}</p>
                <div className="flex space-x-1 mt-2">
                  {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                    <div key={color} className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.toLowerCase() }} />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}