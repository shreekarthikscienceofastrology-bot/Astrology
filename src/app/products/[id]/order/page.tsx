'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { Product } from '@/lib/productStore'
import { getOrderWhatsAppLink } from '@/lib/siteConfig'

export default function ProductOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailWarning, setEmailWarning] = useState('')
  const [whatsAppLink, setWhatsAppLink] = useState('')
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    quantity: 1,
    message: '',
  })

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const data = (await response.json()) as Product
        setProduct(data)
      } catch {
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!product) return

    setSubmitting(true)
    setError('')
    setSuccess('')
    setEmailWarning('')
    setWhatsAppLink('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          ...form,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to place order.')
      }

      const order = payload.order
      setSuccess(`Order ${order.id} was placed successfully.`)
      setEmailWarning(
        payload.notification?.emailSent
          ? 'An order notification was emailed to the shop.'
          : 'The order is saved, but shop email notifications are not configured or could not be sent. You can send the order details on WhatsApp below.',
      )
      setWhatsAppLink(getOrderWhatsAppLink(order))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to place order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-white px-4 pb-20 pt-32 text-center text-slate-600">Loading product details...</main>
  }

  if (!product) {
    return <main className="min-h-screen bg-white px-4 pb-20 pt-32 text-center text-slate-600">Product not found.</main>
  }

  const totalPrice = product.price * form.quantity

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-gold/20 bg-white p-6 shadow-[0_18px_50px_rgba(212,175,55,0.08)] md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8a5e00]">Order form</p>
            <h1 className="mt-2 text-3xl font-bold text-[#111827] md:text-4xl">Place your order</h1>
          </div>
          <Link href="/products" className="text-sm font-semibold text-[#8a5e00] hover:text-[#724d00]">
            ← Back to products
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-2xl border border-gold/20 bg-[#fffaf0] p-5">
            <div className="mb-4 overflow-hidden rounded-xl">
              <div className="relative h-60 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">{product.name}</h2>
            <p className="mt-2 text-slate-600">{product.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-gold/20 pt-4">
              <span className="text-sm uppercase tracking-[0.18em] text-[#8a5e00]">Price</span>
              <span className="text-2xl font-bold text-[#111827]">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Current stock</span>
              <span>{product.stock} available</span>
            </div>
            <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
              <p className="font-semibold text-[#111827]">Total</p>
              <p className="mt-1 text-xl font-bold text-[#8a5e00]">₹{totalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gold/20 bg-white p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Name
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Phone Number
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                Address
                <textarea
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Quantity
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) || 1 })}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                  required
                />
              </label>

              <div className="rounded-xl border border-gold/20 bg-[#fffaf0] p-4 text-sm text-slate-700">
                <p className="font-semibold uppercase tracking-[0.18em] text-[#8a5e00]">Order total</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">₹{totalPrice.toLocaleString('en-IN')}</p>
              </div>

              <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
                Optional message
                <textarea
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gold/30 bg-[#fffaf0] px-4 py-3 text-slate-800 outline-none ring-0 transition focus:border-gold"
                />
              </label>
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {success && (
              <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <p>{success}</p>
                <p>{emailWarning}</p>
                {whatsAppLink && (
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-4 py-2 font-semibold text-white transition hover:bg-[#1ebe5d]"
                  >
                    Send order details on WhatsApp
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || product.stock <= 0 || Boolean(success)}
              className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-5 py-3 text-base font-semibold text-[#1f1b13] transition-all duration-300 hover:bg-[#d4a900] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {submitting ? 'Placing Order...' : product.stock <= 0 ? 'Out of Stock' : 'Submit Order'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
