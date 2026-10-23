'use client'

import Link from 'next/link'

import { WHATSAPP_BASE_URL } from '@/lib/siteConfig'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[#f3d86a]/60 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-[#111827] gradient-text">Shree Karthik Science of Astrology</h3>
            <p className="text-sm leading-6 text-slate-600">
              Professional astrology services dedicated to guiding your life through ancient wisdom and modern understanding.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#8a5e00]">Services</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/#services" className="transition hover:text-[#8a5e00]">Birth Chart Reading</Link></li>
              <li><Link href="/#services" className="transition hover:text-[#8a5e00]">Horoscope Consultation</Link></li>
              <li><Link href="/#services" className="transition hover:text-[#8a5e00]">Numerology</Link></li>
              <li><Link href="/#services" className="transition hover:text-[#8a5e00]">Vastu Consultation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#8a5e00]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/products" className="transition hover:text-[#8a5e00]">Products</Link></li>
              <li><Link href="/#about" className="transition hover:text-[#8a5e00]">About Us</Link></li>
              <li><Link href="/#contact" className="transition hover:text-[#8a5e00]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#8a5e00]">Contact Us</h4>
            <p className="mb-2 text-sm text-slate-600">📧 Email: shreekarthikastrology@gmail.com</p>
            <a href={`${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hello Shree Karthik Science of Astrology')}`} target="_blank" rel="noopener noreferrer" className="mb-2 block text-sm text-slate-600 transition hover:text-[#8a5e00]">📱 WhatsApp: +91 96553 75550</a>
            <p className="text-sm text-slate-600">📍 Location: Coimbatore, Tamil Nadu</p>
          </div>
        </div>

        <div className="border-t border-[#f3d86a]/60 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div>
              <p className="text-center text-sm text-slate-600 md:text-left">
                © {currentYear} Shree Karthik Science of Astrology. All rights reserved.
              </p>
              <div className="mt-2 text-center md:text-left">
                <p className="text-xs text-slate-500">
                  Developed by{' '}
                  <Link href="https://www.netcraftstudios.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#8a5e00] hover:text-[#724d00]">
                    Netcraft Studio
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link href="#" className="text-sm text-[#8a5e00] hover:text-[#724d00]">Privacy Policy</Link>
              <Link href="#" className="text-sm text-[#8a5e00] hover:text-[#724d00]">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
