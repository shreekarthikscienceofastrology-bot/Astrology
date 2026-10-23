'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminLinks = [
  { href: '/update', label: 'Content prediction' },
  { href: '/update/products', label: 'Manage products' },
  { href: '/update/orders', label: 'Manage orders' },
]

export default function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin navigation" className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-gold/20 bg-white p-2 shadow-sm">
      {adminLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive ? 'bg-gold text-[#111827]' : 'text-slate-700 hover:bg-[#fff8e5] hover:text-[#8a5e00]'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
