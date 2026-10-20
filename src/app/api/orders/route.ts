import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

import { isAdminAuthenticated } from '@/lib/adminAuth'
import { Order, readOrders, writeOrders } from '@/lib/orderStore'
import { ProductStatus, readProducts, writeProducts } from '@/lib/productStore'

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const orders = await readOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const { productId, customerName, phone, email, address, quantity, message } = payload

  if (!productId || !customerName || !phone || !email || !address) {
    return NextResponse.json({ error: 'Please complete all required order details.' }, { status: 400 })
  }

  const numericQuantity = Number(quantity || 0)
  if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
    return NextResponse.json({ error: 'Please enter a valid order quantity.' }, { status: 400 })
  }

  const products = await readProducts()
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return NextResponse.json({ error: 'Selected product was not found.' }, { status: 404 })
  }

  if (product.stock <= 0 || product.status === 'Out of Stock') {
    return NextResponse.json({ error: 'This product is currently out of stock.' }, { status: 400 })
  }

  if (numericQuantity > product.stock) {
    return NextResponse.json({ error: 'Requested quantity exceeds available stock.' }, { status: 400 })
  }

  const orders = await readOrders()
  const newOrder: Order = {
    id: `${Date.now()}-${String(customerName).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    customerName: String(customerName).trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    address: String(address).trim(),
    quantity: numericQuantity,
    message: message ? String(message).trim() : '',
    totalPrice: product.price * numericQuantity,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }

  orders.unshift(newOrder)
  await writeOrders(orders)

  const updatedProducts = products.map((item) => {
    if (item.id !== product.id) return item
    const stock = Math.max(0, item.stock - numericQuantity)
    const status: ProductStatus = stock > 0 ? 'Available' : 'Out of Stock'

    return {
      ...item,
      stock,
      status,
      updatedAt: new Date().toISOString(),
    }
  })

  await writeProducts(updatedProducts)

  const smtpUser = process.env.SMTP_USER
  const smtpAppPassword = process.env.SMTP_APP_PASSWORD
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || smtpUser
  const fromName = process.env.MAIL_FROM_NAME || 'Shree Karthik Astrology'
  let emailSent = false

  if (smtpUser && smtpAppPassword && notificationEmail) {
    const emailText = [
      'A new gemstone order was submitted.',
      `Order ID: ${newOrder.id}`,
      `Product: ${newOrder.productName}`,
      `Unit price: INR ${newOrder.productPrice.toLocaleString('en-IN')}`,
      `Quantity: ${newOrder.quantity}`,
      `Total: INR ${newOrder.totalPrice.toLocaleString('en-IN')}`,
      '',
      `Customer name: ${newOrder.customerName}`,
      `Phone: ${newOrder.phone}`,
      `Email: ${newOrder.email}`,
      `Delivery address: ${newOrder.address}`,
      `Customer message: ${newOrder.message || 'None'}`,
    ].join('\n')

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpAppPassword.replace(/\s/g, ''),
        },
      })

      await transporter.sendMail({
        from: { name: fromName, address: smtpUser },
        to: notificationEmail,
        replyTo: newOrder.email,
        subject: `New gemstone order: ${newOrder.productName}`,
        text: emailText,
      })
      emailSent = true
    } catch (error) {
      console.error('Order email delivery failed:', error)
    }
  }

  return NextResponse.json({
    order: newOrder,
    notification: {
      emailConfigured: Boolean(smtpUser && smtpAppPassword && notificationEmail),
      emailSent,
    },
  })
}

export async function PUT(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const payload = await request.json()
  const { id, status } = payload

  if (!id || !status) {
    return NextResponse.json({ error: 'Order ID and status are required.' }, { status: 400 })
  }

  const orders = await readOrders()
  const orderIndex = orders.findIndex((order) => order.id === id)

  if (orderIndex === -1) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 })
  }

  orders[orderIndex] = { ...orders[orderIndex], status }
  await writeOrders(orders)

  return NextResponse.json(orders[orderIndex])
}
