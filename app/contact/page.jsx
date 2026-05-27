import PageHero from '@/components/PageHero'
import QuoteRequestForm from '@/components/forms/QuoteRequestForm'
import { productCategories, products } from '@/data/products'

export const metadata = {
  title: 'Contact and Quote Requests | Character Before Carrier Farms',
  description:
    'Submit a quote request for maize, grains, poultry, eggs, feeds, and value-added products from Character Before Carrier Farms.',
}

export default function ContactPage({ searchParams }) {
  const options = Array.from(new Set([...productCategories, ...products.map(product => product.name)]))

  const requestedProduct = typeof searchParams?.product === 'string' ? searchParams.product : ''
  const initialProductInterest = options.includes(requestedProduct) ? requestedProduct : ''

  return (
    <main>
      <PageHero
        eyebrow="Contact Supplier"
        title="Submit a Serious Quote Request"
        description="Tell us your product requirements, quantity, and location. We will respond with availability and supply guidance."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <aside className="space-y-5">
            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Quote Request Requirements</p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
                <li>- Name</li>
                <li>- Email or phone</li>
                <li>- Product interest</li>
                <li>- Quantity or message</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Operational Contact</p>
              <p className="mt-3 text-sm text-charcoal/75">Greater Accra, Ghana</p>
              <p className="mt-1 text-sm text-charcoal/75">WhatsApp: +233 24 272 8984</p>
              <p className="mt-1 text-sm text-charcoal/75">Email notifications route to: richardafriyie22@gmail.com</p>
            </article>

            <article className="rounded-3xl bg-forest p-6 text-white shadow-premium">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">Business Philosophy</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Character Before Carrier means every quote response is handled with integrity, realistic commitments,
                and responsible follow-through.
              </p>
            </article>
          </aside>

          <QuoteRequestForm
            productOptions={options}
            initialProductInterest={initialProductInterest}
          />
        </div>
      </section>
    </main>
  )
}
