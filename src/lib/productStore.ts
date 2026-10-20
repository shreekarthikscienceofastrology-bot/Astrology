import { promises as fs } from 'fs'
import path from 'path'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export type ProductStatus = 'Available' | 'Out of Stock'

export interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
  status: ProductStatus
  image: string
  specifications: string[]
  createdAt: string
  updatedAt: string
}

const productPath = path.join(process.cwd(), 'data', 'products.json')

const defaultProducts: Product[] = [
  {
    id: 'ruby-gemstone',
    name: 'Ruby Gemstone',
    category: 'Ruby',
    description: 'Premium natural ruby gemstone with vivid red brilliance and powerful energy.',
    price: 28500,
    stock: 6,
    status: 'Available',
    image: '/images/gemstones/ruby.jpg',
    specifications: ['Natural ruby', 'Fine cut', 'Certified quality', 'Suitable for astrological use'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pearl-gemstone',
    name: 'Pearl Gemstone',
    category: 'Pearl',
    description: 'Lustrous pearl gemstone known for calming energy and emotional balance.',
    price: 18500,
    stock: 8,
    status: 'Available',
    image: '/images/gemstones/pearl.jpg',
    specifications: ['Natural freshwater pearl', 'Polished finish', 'Elegant shine', 'Comfortable for daily wear'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'emerald-gemstone',
    name: 'Emerald Gemstone',
    category: 'Emerald',
    description: 'Elegant emerald gemstone that enhances communication, wisdom, and clarity.',
    price: 32000,
    stock: 4,
    status: 'Available',
    image: '/images/gemstones/emerald.jpg',
    specifications: ['Vivid green tone', 'Premium cut', 'High clarity', 'Astrological gemstone'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'yellow-sapphire',
    name: 'Yellow Sapphire',
    category: 'Yellow Sapphire',
    description: 'Bright yellow sapphire prized for prosperity, wisdom, and positive fortune.',
    price: 42000,
    stock: 3,
    status: 'Available',
    image: '/images/gemstones/yellow-sapphire.jpg',
    specifications: ['Natural yellow sapphire', 'Rich golden shade', 'Premium finish', 'Recommended for Jupiter'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'blue-sapphire',
    name: 'Blue Sapphire',
    category: 'Blue Sapphire',
    description: 'Rare blue sapphire gemstone with a premium royal blue finish and powerful energy.',
    price: 52000,
    stock: 2,
    status: 'Available',
    image: '/images/gemstones/blue-sapphire.jpg',
    specifications: ['Deep blue hue', 'Excellent brilliance', 'strong astrological value', 'Carefully selected stone'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'diamond-gemstone',
    name: 'Diamond Gemstone',
    category: 'Diamond',
    description: 'Sparkling diamond gemstone celebrated for luxury, elegance, and prosperity.',
    price: 61000,
    stock: 1,
    status: 'Available',
    image: '/images/gemstones/diamond.jpg',
    specifications: ['High clarity diamond', 'Precision cut', 'Classic brilliance', 'Premium luxury choice'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function readProducts(): Promise<Product[]> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    const { data, error } = await supabase.from('products').select('id,payload').order('created_at')
    if (error) throw new Error(`Unable to read products from Supabase: ${error.message}`)

    if (data.length > 0) {
      const originalProducts = data.map((row) => row.payload as Product)
      const products = originalProducts
        .map(normalizeProductImage)
        .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt))

      const originalImages = new Map(originalProducts.map((product) => [product.id, product.image]))
      const correctedProducts = products.filter((product) => product.image !== originalImages.get(product.id))
      if (correctedProducts.length > 0) {
        const { error: correctionError } = await supabase.from('products').upsert(
          correctedProducts.map((product) => ({ id: product.id, payload: product, created_at: product.createdAt })),
        )
        if (correctionError) throw new Error(`Unable to update legacy product images: ${correctionError.message}`)
      }

      return products
    }

    const legacyProducts = await readProductsFromJson()
    await writeProductsToSupabase(supabase, legacyProducts)
    return legacyProducts
  }

  return readProductsFromJson()
}

async function readProductsFromJson(): Promise<Product[]> {
  try {
    const content = await fs.readFile(productPath, 'utf8')
    const parsed = JSON.parse(content) as Product[]
    return (Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts).map(normalizeProductImage)
  } catch {
    await fs.mkdir(path.dirname(productPath), { recursive: true })
    await fs.writeFile(productPath, `${JSON.stringify(defaultProducts, null, 2)}\n`, 'utf8')
    return defaultProducts
  }
}

function normalizeProductImage(product: Product): Product {
  const localImages: Record<string, string> = {
    'ruby-gemstone': '/images/gemstones/ruby.jpg',
    'pearl-gemstone': '/images/gemstones/pearl.jpg',
    'emerald-gemstone': '/images/gemstones/emerald.jpg',
    'yellow-sapphire': '/images/gemstones/yellow-sapphire.jpg',
    'blue-sapphire': '/images/gemstones/blue-sapphire.jpg',
    'diamond-gemstone': '/images/gemstones/diamond.jpg',
  }

  if (product.image.includes('photo-1617038220319-276d3cfab534')) {
    return { ...product, image: localImages[product.id] || '/images/gemstones/ruby.jpg' }
  }

  return product
}

export async function writeProducts(products: Product[]) {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    await writeProductsToSupabase(supabase, products)
    return
  }

  await fs.mkdir(path.dirname(productPath), { recursive: true })
  await fs.writeFile(productPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8')
}

async function writeProductsToSupabase(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  products: Product[],
) {
  if (products.length > 0) {
    const { error } = await supabase.from('products').upsert(
      products.map((product) => ({
        id: product.id,
        payload: product,
        created_at: product.createdAt,
      })),
    )
    if (error) throw new Error(`Unable to save products to Supabase: ${error.message}`)
  }

  const { data: existingProducts, error: readError } = await supabase.from('products').select('id')
  if (readError) throw new Error(`Unable to reconcile products in Supabase: ${readError.message}`)

  const retainedIds = new Set(products.map((product) => product.id))
  const removedIds = existingProducts.map((product) => product.id).filter((id) => !retainedIds.has(id))

  if (removedIds.length > 0) {
    const { error } = await supabase.from('products').delete().in('id', removedIds)
    if (error) throw new Error(`Unable to remove products from Supabase: ${error.message}`)
  }
}

export async function getProductById(id: string) {
  const products = await readProducts()
  return products.find((product) => product.id === id) ?? null
}
