import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata = {
  metadataBase: new URL('https://characterbeforecarrierfarms.com'),
  title: {
    default: 'Character Before Carrier Farms | Ghana Agribusiness and B2B Supply',
    template: '%s | Character Before Carrier Farms',
  },
  description:
    'Character Before Carrier Farms is a legally registered Ghanaian mixed farming agribusiness supplying traceable crop commodities, poultry, eggs, livestock products, feeds, value-added food products, and advisory services.',
  keywords: [
    'Ghana agribusiness',
    'Ghana farm supplier',
    'maize and grains supplier',
    'poultry and eggs supply Ghana',
    'B2B agricultural supply',
    'Accra farm products',
    'institutional food supply Ghana',
  ],
  openGraph: {
    title: 'Character Before Carrier Farms',
    description:
      'Premium B2B agricultural supplier website for mixed farming and institutional supply from Ghana.',
    type: 'website',
    locale: 'en_GH',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream text-charcoal antialiased">
        <Navigation />
        <SpeedInsights/>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
