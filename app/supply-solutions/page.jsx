import PageHero from '@/components/PageHero'
import Link from 'next/link'

export const metadata = {
  title: 'Supply Solutions | Character Before Carrier Farms',
  description:
    'B2B supply solutions for wholesalers, supermarkets, hotels, restaurants, schools, feed mills, and processing mills.',
}

const solutions = [
  {
    title: 'Wholesalers',
    detail: 'Bulk commodity allocations, recurring restock windows, and clear commercial communication.',
  },
  {
    title: 'Supermarkets',
    detail: 'Packaged and raw supply channels designed for shelf continuity and procurement predictability.',
  },
  {
    title: 'Hotels',
    detail: 'Food service-aligned delivery plans for eggs, poultry, grains, and value-added food lines.',
  },
  {
    title: 'Restaurants',
    detail: 'Reliable ingredient supply with practical order planning and quality handling support.',
  },
  {
    title: 'Schools',
    detail: 'Institutional procurement support for stable feeding programs and planned delivery cycles.',
  },
  {
    title: 'Feed Mills',
    detail: 'Consistent supply of grains and feed-ready inputs with scalable volume options.',
  },
  {
    title: 'Processing Mills',
    detail: 'Traceable commodity sourcing for milling and downstream product manufacturing workflows.',
  },
]

export default function SupplySolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="B2B Supply Solutions"
        title="Commercial Supply Programs for Institutional Buyers"
        description="We align products, logistics, and communication to the realities of recurring procurement operations."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {solutions.map((solution, index) => (
              <article key={solution.title} className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
                <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-forest text-xs font-semibold text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h2 className="text-2xl font-semibold text-charcoal">{solution.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{solution.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[1fr_1fr] lg:px-8">
          <article className="rounded-3xl border border-forest/10 bg-cream p-6 shadow-soft sm:p-7">
            <h2 className="font-serif text-3xl text-charcoal">How We Structure Supply</h2>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
              <li>- Requirement mapping by product line and buyer profile</li>
              <li>- Forecast planning by quantity, frequency, and seasonality</li>
              <li>- Quality and packaging alignment with buyer standards</li>
              <li>- Coordinated dispatch and supply continuity tracking</li>
            </ul>
          </article>

          <article className="rounded-3xl bg-forest p-6 text-white shadow-premium sm:p-7">
            <h2 className="font-serif text-3xl">Need a Custom Supply Plan?</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Share your demand profile and we will build a practical supply proposal covering product mix, pricing
              structure, and delivery cadence.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-bright"
            >
              Request Supply Proposal
            </Link>
          </article>
        </div>
      </section>
    </main>
  )
}
