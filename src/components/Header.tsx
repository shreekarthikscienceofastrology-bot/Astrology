'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#f3d86a]/70 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <h1 className="text-2xl font-bold leading-tight text-[#111827] gradient-text">Shree Karthik<br />Science of Astrology</h1>
              <p className="text-xs text-[#8a5e00]">Professional Astrology Services</p>
            </div>
          </Link>

          <button
            className="text-[#8a5e00] md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden items-center space-x-8 text-sm font-medium text-slate-700 md:flex">
            <Link href="/" className="transition hover:text-[#8a5e00]">Home</Link>
            <Link href="#about" className="transition hover:text-[#8a5e00]">About</Link>
            <Link href="/products" className="transition hover:text-[#8a5e00]">Products</Link>
            <Link href="#contact" className="transition hover:text-[#8a5e00]">Contact</Link>
          </div>
        </div>

        {isOpen && (
          <div id="mobile-navigation" className="mt-4 space-y-4 pb-2 text-slate-700 md:hidden">
            <Link href="/" onClick={() => setIsOpen(false)} className="block transition hover:text-[#8a5e00]">Home</Link>
            <Link href="#about" onClick={() => setIsOpen(false)} className="block transition hover:text-[#8a5e00]">About</Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className="block transition hover:text-[#8a5e00]">Products</Link>
            <Link href="#contact" onClick={() => setIsOpen(false)} className="block transition hover:text-[#8a5e00]">Contact</Link>
          </div>
        )}
      </nav>
    </header>
  )
}
