import { NextResponse } from 'next/server'

import { isAdminAuthenticated } from '@/lib/adminAuth'
import { Product, readProducts, writeProducts } from '@/lib/productStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  const products = await readProducts()
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const payload = await request.json()
  const { name, description, price, category, stock, status, image, specifications } = payload

  if (!name || !description || !category || !price || !image) {
    return NextResponse.json({ error: 'Please complete all required product fields.' }, { status: 400 })
  }

  const numericPrice = Number(price)
  const numericStock = Number(stock || 0)
  const validStatus = status === 'Out of Stock' ? 'Out of Stock' : 'Available'

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return NextResponse.json({ error: 'Please enter a valid product price.' }, { status: 400 })
  }

  if (!Number.isInteger(numericStock) || numericStock < 0) {
    return NextResponse.json({ error: 'Please enter a valid stock quantity.' }, { status: 400 })
  }

  const products = await readProducts()
  const newProduct: Product = {
    id: `${Date.now()}-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: String(name).trim(),
    category: String(category).trim(),
    description: String(description).trim(),
    price: numericPrice,
    stock: numericStock,
    status: validStatus,
    image: String(image).trim(),
    specifications: Array.isArray(specifications) ? specifications.map((item: string) => String(item).trim()).filter(Boolean) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedProducts = [newProduct, ...products]
  await writeProducts(updatedProducts)

  return NextResponse.json(newProduct)
}
