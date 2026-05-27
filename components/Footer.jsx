import Link from 'next/link'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Supply Solutions', href: '/supply-solutions' },
  { label: 'Quality', href: '/quality' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const supplyLines = [
  'Maize & Grains',
  'Poultry & Eggs',
  'Fine-Milled Grains',
  'Farm Feeds',
  'Packaged Foodstuffs',
  'Agribusiness Advisory',
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal pb-10 pt-16 text-white">
      <div className="pattern-afro absolute inset-0 opacity-15" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-gold to-cocoa text-sm font-bold text-white">
                CBC
              </div>
              <div>
                <p className="font-semibold">Character Before Carrier Farms</p>
                <p className="text-xs text-white/70">Ghana Mixed Farming and B2B Supply</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Integrity-driven agribusiness delivering traceable products and dependable institutional supply.
            </p>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">Quick Links</p>
            <ul className="space-y-2 text-sm text-white/70">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-gold-bright">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">Supply Portfolio</p>
            <ul className="space-y-2 text-sm text-white/70">
              {supplyLines.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-lg font-semibold">Operations</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Greater Accra, Ghana</li>
              <li>Accra-Pokuase logistics access</li>
              <li>Institutional and export-ready support</li>
              <li>WhatsApp: +233 24 272 8984</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-7 text-sm text-white/60">
          <p>(c) 2026 Character Before Carrier Farms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
