const reasons = [
  {
    title: 'Strategic Accra-Pokuase Logistics Location',
    detail:
      'Our operational positioning supports practical dispatch routes and predictable delivery planning for B2B buyers.',
  },
  {
    title: 'Traceable Production',
    detail:
      'Supply lines are mapped from farm source to buyer handover with documentation available for procurement confidence.',
  },
  {
    title: 'Quality-Controlled Supply',
    detail:
      'Sorting, handling, and packaging checks are integrated into our delivery workflow before shipment.',
  },
  {
    title: 'Ethical Business Philosophy',
    detail:
      'Our \"Character Before Carrier\" principle guides integrity in communication, pricing, and long-term partnerships.',
  },
  {
    title: 'B2B and Institutional Buyer Focus',
    detail:
      'We build recurring supply programs for wholesalers, supermarkets, schools, hospitality, and processors.',
  },
]

export default function Quality() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0 pattern-afro opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-forest/20 bg-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            Why Choose Us
          </p>
          <h2 className="mt-5 font-serif text-4xl text-charcoal sm:text-5xl">Built for Trust, Scale, and Continuity</h2>
          <p className="mt-4 text-base text-charcoal/70 sm:text-lg">
            We are structured to serve professional procurement teams, not one-off transactions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map(item => (
            <article
              key={item.title}
              className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-premium"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">Assurance</p>
              <h3 className="mt-2 text-xl font-semibold text-charcoal">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
