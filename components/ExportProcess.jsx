import Link from 'next/link'
import ProductCard from '@/components/catalog/ProductCard'
import { getFeaturedProducts } from '@/lib/products'

const supplySolutions = [
  'Bulk contract supply for distributors and supermarket chains',
  'Institutional procurement scheduling with planned delivery windows',
  'Flexible packaging options for retail, warehouse, or processing needs',
  'Accra-Pokuase logistics coordination and buyer dispatch support',
]

export default function ExportProcess() {
  const featuredProducts = getFeaturedProducts().slice(0, 4)

  return (
    <section id="featured-products" className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0 pattern-afro opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-forest/20 bg-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              Featured Products / Hot Supply
            </p>
            <h2 className="mt-5 font-serif text-4xl text-charcoal sm:text-5xl">Reliable Volumes for Serious Buyers</h2>
            <p className="mt-4 text-base text-charcoal/70 sm:text-lg">
              Catalogue-style product visibility with buyer-ready details and transparent quote pathways.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-forest-light"
          >
            View Full Catalogue
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <aside className="rounded-3xl bg-gradient-to-br from-forest to-forest-light p-7 text-white shadow-premium">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">Supply Solutions</p>
            <h3 className="mt-3 font-serif text-3xl leading-tight">Institutional Supply Structured Around Demand</h3>
            <p className="mt-4 text-sm text-white/80">
              Our team aligns supply plans to buyer forecasts, operating calendars, and quality standards.
            </p>

            <ul className="mt-6 space-y-3">
              {supplySolutions.map(point => (
                <li key={point} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/70">Buyer Focus</p>
              <p className="mt-1 text-lg font-semibold">Wholesalers, Hotels, Schools, Feed and Processing Mills</p>
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-gold-bright"
            >
              Contact Supplier
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
