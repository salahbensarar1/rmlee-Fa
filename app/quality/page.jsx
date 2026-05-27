import PageHero from '@/components/PageHero'

export const metadata = {
  title: 'Quality and Traceability | Character Before Carrier Farms',
  description:
    'Understand our traceability, quality control, chemical safety, and handling standards for commercial agricultural supply.',
}

const qualityPillars = [
  {
    title: 'Traceability',
    detail:
      'Product lots are tracked through sourcing, sorting, packaging, and dispatch stages to support buyer-level accountability.',
  },
  {
    title: 'Quality Control',
    detail:
      'We apply practical quality checks for cleanliness, consistency, packaging integrity, and order conformity before release.',
  },
  {
    title: 'Chemical Safety',
    detail:
      'Input use and handling controls follow safe-use practices with procurement transparency where required by buyers.',
  },
  {
    title: 'Handling Standards',
    detail:
      'Storage, loading, and transport coordination are managed to preserve quality throughout the supply chain.',
  },
]

const certifications = [
  'Registered Ghanaian business operations',
  'Traceable sourcing and lot-level documentation practices',
  'Batch quality checks prior to dispatch',
  'Buyer-requested quality notes and handling records',
]

export default function QualityPage() {
  return (
    <main>
      <PageHero
        eyebrow="Quality Assurance"
        title="Quality, Safety, and Traceability Built Into Every Supply Line"
        description="Our credibility comes from operational discipline, clear documentation, and buyer-centered standards."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {qualityPillars.map(item => (
              <article key={item.title} className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Quality Pillar</p>
                <h2 className="mt-2 text-2xl font-semibold text-charcoal">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <article className="rounded-3xl border border-forest/10 bg-cream p-6 shadow-soft sm:p-7">
            <h2 className="font-serif text-3xl text-charcoal">Certifications and Compliance Area</h2>
            <p className="mt-4 text-sm text-charcoal/75">
              We provide quality documentation support aligned with buyer requirements and product category expectations.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
              {certifications.map(item => (
                <li key={item} className="rounded-xl bg-white px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl bg-forest p-6 text-white shadow-premium sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">Registered Business Credibility</p>
            <h2 className="mt-3 font-serif text-3xl">Confidence for Institutional Buyers</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Character Before Carrier Farms operates as a legally registered Ghanaian agribusiness with structured
              supply governance, procurement responsiveness, and transparent operating principles.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              We are committed to sustained buyer trust through responsible communication, practical standards, and
              reliable delivery execution.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
