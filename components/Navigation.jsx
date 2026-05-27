'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/supply-solutions', label: 'Supply Solutions' },
  { href: '/quality', label: 'Quality' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isHome = pathname === '/'
  const useTransparentMode = isHome && !isScrolled

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        useTransparentMode ? 'bg-transparent' : 'border-b border-forest/10 bg-cream/95 shadow-soft backdrop-blur-lg'
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-7 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-gold to-cocoa text-sm font-bold text-white shadow-soft">
            CBC
          </div>
          <div className="leading-tight">
            <p
              className={`text-sm font-semibold md:text-base ${
                useTransparentMode ? 'text-white' : 'text-forest'
              }`}
            >
              Character Before Carrier Farms
            </p>
            <p className={`text-xs ${useTransparentMode ? 'text-white/75' : 'text-forest/70'}`}>
              Ghana Agribusiness Supplier
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map(link => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? useTransparentMode
                      ? 'text-gold-bright'
                      : 'text-forest'
                    : useTransparentMode
                      ? 'text-white/90 hover:text-gold-bright'
                      : 'text-charcoal hover:text-forest'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <Link
          href="/contact"
          className="hidden rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-forest-light lg:inline-flex"
        >
          Request Quote
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(prev => !prev)}
          className={`text-2xl lg:hidden ${useTransparentMode ? 'text-white' : 'text-forest'}`}
        >
          {isOpen ? 'X' : 'MENU'}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-forest/10 bg-cream/95 backdrop-blur-xl transition-all lg:hidden ${
          isOpen ? 'max-h-[460px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-6 pt-5">
          {navLinks.map(link => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold ${isActive ? 'text-forest' : 'text-charcoal'}`}
              >
                {link.label}
              </Link>
            )
          })}

          <Link
            href="/contact"
            className="inline-flex justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}
