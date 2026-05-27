import Link from 'next/link'
import { productCategories } from '@/data/products'

const categorySummaries = {
  'Maize & Grains': 'Commercial-grade maize and grain lines for processing and wholesale channels.',
  'Organic Seasonal Vegetables': 'Seasonal vegetable supply with practical freshness and handling controls.',
  'Poultry & Eggs': 'Broiler and table egg supply for retailers, institutions, and food service buyers.',
  'Livestock Products': 'Contract-ready livestock product channels for bulk and institutional procurement.',
  'Fine-Milled Grains': 'Clean, consistent flour options for supermarkets and processing buyers.',
  'Farm Feeds': 'Balanced feed lines for poultry and livestock operations at scale.',
  'Packaged Foodstuffs': 'Value-added food packs designed for retail and distribution.',
  'Agribusiness Advisory': 'Advisory services for farm planning, supply strategy, and growth execution.',
}

export default function Products() {
  return (
    <section id="products" className="relative overflow-hidden bg-cream py-20">
      <div className="absolute inset-0 pattern-afro opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            Product Categories
          </p>
          <h2 className="mt-5 font-serif text-4xl text-charcoal sm:text-5xl">Structured for Scale and Reliability</h2>
          <p className="mt-4 text-base text-charcoal/70 sm:text-lg">
            Explore our supplier categories built for current contracts and future catalogue expansion.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {productCategories.map((category, index) => (
            <article
              key={category}
              className="group rounded-3xl bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-premium"
            >
              <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-2xl bg-forest text-sm font-semibold text-white">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-semibold text-charcoal">{category}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{categorySummaries[category]}</p>
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="mt-5 inline-flex text-sm font-semibold text-forest transition group-hover:text-cocoa"
              >
                Browse Category {'->'}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
