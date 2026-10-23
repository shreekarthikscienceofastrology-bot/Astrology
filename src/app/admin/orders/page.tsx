'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { Order } from '@/lib/orderStore'
import AdminNavigation from '@/components/AdminNavigation'

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [message, setMessage] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders')
      if (response.status === 401) {
        router.replace('/update')
        return
      }
      if (!response.ok) {
        throw new Error('Unable to fetch orders.')
      }
      const data = (await response.json()) as Order[]
      setOrders(data)
      setAuthorized(true)
    } catch {
      setAuthorized(true)
      setMessage('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  async function handleStatusChange(id: string, value: string) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: value }),
    })

    if (!response.ok) {
      setMessage('Unable to update order status.')
      return
    }

    setMessage('Order status updated successfully.')
    await loadOrders()
  }

  if (!authorized || loading) {
    return <main className="min-h-screen bg-white px-4 pb-20 pt-32 text-center text-slate-600">Checking admin access...</main>
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        <AdminNavigation />
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8a5e00]">Admin</p>
          <h1 className="mt-2 text-4xl font-bold text-[#111827]">Order Management</h1>
        </div>

        {message && <p className="mb-6 rounded-lg border border-gold/20 bg-[#fffaf0] px-4 py-3 text-sm text-slate-700">{message}</p>}

        <div className="rounded-[28px] border border-gold/20 bg-white p-6 shadow-[0_18px_40px_rgba(212,175,55,0.08)]">
          {loading ? (
            <p className="text-slate-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-600">No orders have been placed yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-gold/20 bg-[#fffaf0] p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5e00]">{order.productName}</p>
                      <h3 className="mt-1 text-2xl font-bold text-[#111827]">{order.customerName}</h3>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        <p>Phone: {order.phone}</p>
                        <p>Email: {order.email}</p>
                        <p>Address: {order.address}</p>
                        {order.message && <p>Message: {order.message}</p>}
                      </div>
                    </div>

                    <div className="min-w-[220px]">
                      <p className="text-sm text-slate-600">Quantity: {order.quantity}</p>
                      <p className="text-sm text-slate-600">Total: ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                      <label className="mt-3 block text-sm font-semibold text-slate-700">
                        Status
                        <select
                          value={order.status}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          className="mt-2 w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-slate-800 outline-none focus:border-gold"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                    </div>
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
