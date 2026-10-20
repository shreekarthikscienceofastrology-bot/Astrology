import ProductCard from '@/components/ProductCard'
import { readProducts } from '@/lib/productStore'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await readProducts()

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#8a5e00]">Luxury gemstones</p>
          <h1 className="text-4xl font-bold text-[#111827] md:text-5xl">Premium Gemstone Collection</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Discover authentic, high-quality gemstones designed to elevate your style and spiritual journey.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold/60 bg-[#fffaf0] p-12 text-center text-slate-600">
            No products available right now. Please check back soon.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
