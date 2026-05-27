import Image from 'next/image'
import PageHero from '@/components/PageHero'

export const metadata = {
  title: 'About Us | Character Before Carrier Farms',
  description:
    'Learn about Character Before Carrier Farms, our mission, vision, values, and integrity-first agribusiness philosophy in Greater Accra, Ghana.',
}

const values = [
  'Integrity in every transaction and supply commitment',
  'Traceability from source to buyer delivery point',
  'Quality consistency through controlled handling',
  'Long-term partnerships with buyers and growers',
]

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Character Before Carrier Farms"
        title="A Ghanaian Agribusiness Built on Character"
        description="We operate as a mixed farming and supply company focused on trust, reliability, and commercial delivery discipline for institutional buyers."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[1fr_1fr] lg:px-8">
          <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
            <h2 className="font-serif text-3xl text-charcoal">Company Overview</h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              Character Before Carrier Farms is headquartered in Greater Accra, Ghana, and operates as a mixed farming
              agribusiness serving local and institutional markets. Our operations cover crops, poultry, eggs,
              livestock-related products, value-added food lines, and advisory support.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              We are structured for practical supply execution with clear communication, dependable volumes, and
              procurement-focused service standards.
            </p>
          </article>

          <div className="relative overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-soft">
            <div className="relative h-full min-h-[320px]">
              <Image
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80"
                alt="Farm operations and agricultural teams"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-3 text-sm font-semibold text-charcoal">
              Operational Base: Greater Accra, Ghana
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-forest/10 bg-cream p-6 shadow-soft">
              <h3 className="font-serif text-3xl text-charcoal">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                To deliver traceable, quality-controlled agricultural products and supply solutions that help buyers
                source reliably and grow sustainably.
              </p>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-cream p-6 shadow-soft">
              <h3 className="font-serif text-3xl text-charcoal">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                To be a respected Ghanaian agribusiness partner known across local and regional markets for integrity,
                consistency, and professional B2B service.
              </p>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-cream p-6 shadow-soft">
              <h3 className="font-serif text-3xl text-charcoal">Values</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-charcoal/75">
                {values.map(value => (
                  <li key={value}>- {value}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-white">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-7 lg:px-8">
          <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">
            Founder Message
          </p>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">Character Before Carrier</h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Our name reflects our operating standard: character first, logistics second. We believe supply reliability
            starts with honesty, accountability, and disciplined execution. Every order is treated as a long-term
            relationship, not a one-off transaction.
          </p>
        </div>
      </section>
    </main>
  )
}
