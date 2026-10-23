'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Product } from '@/lib/productStore'
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser'
import AdminNavigation from '@/components/AdminNavigation'

const emptyProduct = {
  id: '',
  name: '',
  category: '',
  description: '',
  price: 0,
  stock: 0,
  status: 'Available',
  image: '',
  specifications: [''],
}

async function uploadImageLocally(file: File): Promise<string> {
  const body = new FormData()
  body.set('image', file)
  const response = await fetch('/api/admin/product-image', { method: 'POST', body })
  const responseText = await response.text()
  let payload: { url?: string; error?: string } = {}

  try {
    payload = responseText ? JSON.parse(responseText) as typeof payload : {}
  } catch {
    throw new Error(`Image upload failed (${response.status}): ${responseText.slice(0, 180)}`)
  }

  if (!response.ok) {
    throw new Error(payload.error || `Unable to upload product image (${response.status}).`)
  }

  if (!payload.url) {
    throw new Error('Image upload completed without returning an image URL.')
  }

  return payload.url
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyProduct)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [status, setStatus] = useState('')

  async function loadProducts() {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Unable to fetch products.')
      }
      const data = (await response.json()) as Product[]
      setProducts(data)
    } catch {
      setStatus('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function verifyAdmin() {
      try {
        const response = await fetch('/api/admin/prediction')
        if (!response.ok) {
          router.replace('/update')
          return
        }

        setAuthorized(true)
        await loadProducts()
      } catch {
        router.replace('/update')
      }
    }

    verifyAdmin()
  }, [router])

  function resetForm() {
    setForm(emptyProduct)
  }

  function updateForm<T extends keyof typeof form>(field: T, value: typeof form[T]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploadingImage(true)
    setStatus('Uploading product image...')

    try {
      const supabase = getSupabaseBrowserClient()
      let imageUrl: string

      if (supabase) {
        const response = await fetch('/api/admin/product-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: file.type }),
        })

        if (!response.ok) {
          const payload = await response.json() as { error?: string }
          throw new Error(payload.error || `Unable to prepare image upload (${response.status}).`)
        }

        const payload = await response.json() as {
          storage: 'local' | 'supabase'
          path?: string
          token?: string
          url?: string
          error?: string
        }

        if (payload.storage === 'local') {
          imageUrl = await uploadImageLocally(file)
        } else {
          if (!payload.path || !payload.token || !payload.url) {
            throw new Error('Supabase did not return the required image upload details.')
          }

          const { error } = await supabase.storage
            .from('product-images')
            .uploadToSignedUrl(payload.path, payload.token, file, { contentType: file.type })

          if (error) throw new Error(`Image upload failed: ${error.message}`)
          imageUrl = payload.url
        }
      } else {
        imageUrl = await uploadImageLocally(file)
      }

      if (!imageUrl) throw new Error('Image upload completed without returning an image URL.')
      updateForm('image', imageUrl)
      setStatus('Image uploaded. Complete the product details and save.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to upload product image.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setStatus('')

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        specifications: form.specifications.filter(Boolean),
      }

      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? `/api/products/${form.id}` : '/api/products'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      let data: { error?: string } = {}
      try {
        data = responseText ? JSON.parse(responseText) as typeof data : {}
      } catch {
        throw new Error(`Unable to save product (${response.status}): ${responseText.slice(0, 180) || response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(data.error || `Unable to save product (${response.status}).`)
      }

      resetForm()
      setStatus(form.id ? 'Product updated successfully.' : 'Product added successfully.')
      await loadProducts()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setStatus('')
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const responseText = await response.text()
      let payload: { error?: string } = {}
      try {
        payload = responseText ? JSON.parse(responseText) as typeof payload : {}
      } catch {
        throw new Error(`Unable to delete product (${response.status}): ${responseText.slice(0, 180) || response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(payload.error || `Unable to delete product (${response.status}).`)
      }

      setStatus('Product deleted successfully.')
      setForm(emptyProduct)
      await loadProducts()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to delete product.')
    }
  }

  function handleEdit(product: Product) {
    setForm({
      ...product,
      specifications: product.specifications.length > 0 ? product.specifications : [''],
    })
  }

  if (!authorized || loading) {
    return <main className="min-h-screen bg-white px-4 pb-20 pt-32 text-center text-slate-600">Checking admin access...</main>
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8a5e00]">Admin</p>
            <h1 className="mt-2 text-4xl font-bold text-[#111827]">Product Management</h1>
          </div>
          <button type="button" onClick={resetForm} className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-[#8a5e00] hover:bg-gold hover:text-[#111827]">
            New Product
          </button>
        </div>

        <form onSubmit={handleSave} className="mb-12 rounded-[28px] border border-gold/20 bg-[#fffaf0] p-6 shadow-[0_18px_40px_rgba(212,175,55,0.08)]">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Product Name
              <input
                value={form.name}
                onChange={(event) => updateForm('name', event.target.value)}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Category / Gemstone Type
              <input
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value)}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateForm('description', event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Price (₹)
              <input
                type="number"
                min={1}
                value={form.price}
                onChange={(event) => updateForm('price', Number(event.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Stock Quantity
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => updateForm('stock', Number(event.target.value) || 0)}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Product Status
              <select
                value={form.status}
                onChange={(event) => updateForm('status', event.target.value as Product['status'])}
                className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </label>

            <div className="grid gap-5 md:col-span-2 md:grid-cols-[minmax(0,1fr)_220px]">
              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="product-image-upload">
                  Product Image
                </label>
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="mt-2 block w-full cursor-pointer rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-[#1f1b13]"
                />
                <p className="mt-2 text-xs text-slate-500">JPEG, PNG, or WebP, up to 5 MB.</p>
                <label className="mt-4 block text-sm font-semibold text-slate-700">
                  Or use an image URL
                  <input
                    type="url"
                    value={form.image.startsWith('data:') ? '' : form.image}
                    onChange={(event) => updateForm('image', event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                    placeholder="https://example.com/product-image.jpg"
                  />
                </label>
              </div>
              <div className="flex min-h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gold/40 bg-white">
                {form.image ? (
                  <img src={form.image} alt="Product image preview" className="h-44 w-full object-contain" />
                ) : (
                  <span className="px-4 text-center text-sm text-slate-500">Image preview appears here</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">Specifications</label>
            <div className="mt-2 space-y-3">
              {form.specifications.map((spec, index) => (
                <input
                  key={index}
                  value={spec}
                  onChange={(event) => {
                    const next = [...form.specifications]
                    next[index] = event.target.value
                    setForm({ ...form, specifications: next })
                  }}
                  className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                  placeholder="Add a specification"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, specifications: [...form.specifications, ''] })}
              className="mt-3 rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm font-semibold text-[#8a5e00]"
            >
              Add specification
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button type="submit" disabled={saving || uploadingImage || !form.image} className="rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-[#1f1b13] hover:bg-[#d4a900] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
              {saving ? 'Saving...' : form.id ? 'Update Product' : 'Add Product'}
            </button>
            {status && <span className="text-sm text-slate-600">{status}</span>}
          </div>
        </form>

        <div className="rounded-[28px] border border-gold/20 bg-white p-6 shadow-[0_18px_40px_rgba(212,175,55,0.08)]">
          <h2 className="mb-6 text-2xl font-bold text-[#111827]">All Products</h2>
          {loading ? (
            <p className="text-slate-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-slate-600">No products available.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-gold/20 bg-[#fffaf0] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-gold/20 bg-white">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#111827]">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.category}</p>
                      <p className="text-sm text-slate-600">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <button type="button" onClick={() => handleEdit(product)} className="rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm font-semibold text-[#8a5e00] hover:bg-gold hover:text-[#111827]">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)} className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
