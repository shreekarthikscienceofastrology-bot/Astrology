import { promises as fs } from 'fs'
import path from 'path'
import { getSupabaseServerClient } from '@/lib/supabaseServer'

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface Order {
  id: string
  productId: string
  productName: string
  productPrice: number
  customerName: string
  phone: string
  email: string
  address: string
  quantity: number
  message?: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
}

const orderPath = path.join(process.cwd(), 'data', 'orders.json')

export async function readOrders(): Promise<Order[]> {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    const { data, error } = await supabase.from('orders').select('id,payload').order('created_at', { ascending: false })
    if (error) throw new Error(`Unable to read orders from Supabase: ${error.message}`)

    if (data.length > 0) {
      return data.map((row) => row.payload as Order)
    }

    const legacyOrders = await readOrdersFromJson()
    if (legacyOrders.length > 0) {
      await writeOrdersToSupabase(supabase, legacyOrders)
    }
    return legacyOrders
  }

  return readOrdersFromJson()
}

async function readOrdersFromJson(): Promise<Order[]> {
  try {
    const content = await fs.readFile(orderPath, 'utf8')
    const parsed = JSON.parse(content) as Order[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    await fs.mkdir(path.dirname(orderPath), { recursive: true })
    await fs.writeFile(orderPath, '[]\n', 'utf8')
    return []
  }
}

export async function writeOrders(orders: Order[]) {
  const supabase = getSupabaseServerClient()

  if (supabase) {
    await writeOrdersToSupabase(supabase, orders)
    return
  }

  await fs.mkdir(path.dirname(orderPath), { recursive: true })
  await fs.writeFile(orderPath, `${JSON.stringify(orders, null, 2)}\n`, 'utf8')
}

async function writeOrdersToSupabase(
  supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>,
  orders: Order[],
) {
  if (orders.length > 0) {
    const { error } = await supabase.from('orders').upsert(
      orders.map((order) => ({
        id: order.id,
        payload: order,
        created_at: order.createdAt,
      })),
    )
    if (error) throw new Error(`Unable to save orders to Supabase: ${error.message}`)
  }

  const { data: existingOrders, error: readError } = await supabase.from('orders').select('id')
  if (readError) throw new Error(`Unable to reconcile orders in Supabase: ${readError.message}`)

  const retainedIds = new Set(orders.map((order) => order.id))
  const removedIds = existingOrders.map((order) => order.id).filter((id) => !retainedIds.has(id))

  if (removedIds.length > 0) {
    const { error } = await supabase.from('orders').delete().in('id', removedIds)
    if (error) throw new Error(`Unable to remove orders from Supabase: ${error.message}`)
  }
}
