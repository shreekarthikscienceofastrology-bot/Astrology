export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919655375550'

export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export function getWhatsAppLink(productName: string) {
  const text = `Hello, I would like to get more information about the ${productName}. Please share the details, price, availability, and other information.`
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`
}

export interface WhatsAppOrderDetails {
  orderId: string
  productName: string
  productPrice: number
  quantity: number
  totalPrice: number
  customerName: string
  phone: string
  email: string
  address: string
  message?: string
}

export function getOrderWhatsAppLink(order: WhatsAppOrderDetails) {
  const lines = [
    'Hello, I would like to confirm this gemstone order:',
    `Order ID: ${order.orderId}`,
    `Product: ${order.productName}`,
    `Unit price: INR ${order.productPrice.toLocaleString('en-IN')}`,
    `Quantity: ${order.quantity}`,
    `Total: INR ${order.totalPrice.toLocaleString('en-IN')}`,
    '',
    `Customer name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Delivery address: ${order.address}`,
  ]

  if (order.message) {
    lines.push(`Customer message: ${order.message}`)
  }

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(lines.join('\n'))}`
}
