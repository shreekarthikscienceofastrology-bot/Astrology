'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getConsultationWhatsAppLink } from '@/lib/siteConfig'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#e8d38a]/70 bg-white/95 shadow-[0_4px_24px_rgba(120,92,24,0.07)] backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8d38a] bg-[#fff9e8] font-serif text-lg font-bold text-[#a67400]" aria-hidden="true">K</span>
            <div>
              <span className="block truncate text-base font-bold leading-tight text-[#272315] sm:text-lg">Shree Karthik</span>
              <span className="block truncate text-[11px] font-medium text-[#92701c] sm:text-xs">Science of Astrology</span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          <div className="flex items-center gap-7 text-sm font-medium text-slate-700">
            <Link href="/" className="transition-colors hover:text-[#a67400]">Home</Link>
            <Link href="/#about" className="transition-colors hover:text-[#a67400]">About</Link>
            <Link href="/products" className="transition-colors hover:text-[#a67400]">Products</Link>
            <Link href="/#contact" className="transition-colors hover:text-[#a67400]">Contact</Link>
          </div>
          <a
            href={getConsultationWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#e2bd42] px-5 py-2.5 text-sm font-semibold text-[#211b0a] shadow-sm transition-colors hover:bg-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a67400] focus-visible:ring-offset-2"
          >
            Book Consultation
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={getConsultationWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#e2bd42] px-3 py-2 text-xs font-semibold text-[#211b0a]"
          >
            Book
          </a>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d38a] text-[#806016] transition-colors hover:bg-[#fff9e8]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-[#e8d38a]/70 bg-white px-5 py-4 shadow-lg md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1 text-sm font-medium text-slate-700">
              <Link href="/" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 transition-colors hover:bg-[#fff9e8] hover:text-[#a67400]">Home</Link>
              <Link href="/#about" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 transition-colors hover:bg-[#fff9e8] hover:text-[#a67400]">About</Link>
              <Link href="/products" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 transition-colors hover:bg-[#fff9e8] hover:text-[#a67400]">Products</Link>
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-3 transition-colors hover:bg-[#fff9e8] hover:text-[#a67400]">Contact</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
