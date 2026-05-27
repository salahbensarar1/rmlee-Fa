const buyers = [
  {
    title: 'Wholesale Distributors',
    detail: 'Bulk procurement partners seeking dependable stock flow and volume consistency.',
  },
  {
    title: 'Supermarkets',
    detail: 'Retail chains requiring quality packaging and scheduled replenishment cycles.',
  },
  {
    title: 'Hotels & Restaurants',
    detail: 'Hospitality buyers demanding reliable fresh and processed supply options.',
  },
  {
    title: 'Schools / Feeding Systems',
    detail: 'Institutional feeding programs requiring stable supply and delivery discipline.',
  },
  {
    title: 'Feed Mills',
    detail: 'Input-focused buyers sourcing grains and feed products in commercial quantities.',
  },
  {
    title: 'Processing Mills',
    detail: 'Processors needing traceable commodities for consistent production throughput.',
  },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-cream py-20" id="buyers">
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-leaf/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            Target Buyers
          </p>
          <h2 className="mt-5 font-serif text-4xl text-charcoal sm:text-5xl">Who We Supply</h2>
          <p className="mt-4 text-base text-charcoal/70 sm:text-lg">
            Our commercial systems are designed for recurring institutional and B2B procurement.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buyers.map((buyer, index) => (
            <article
              key={buyer.title}
              className="rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-premium"
            >
              <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-xl bg-forest text-xs font-semibold text-white">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-semibold text-charcoal">{buyer.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{buyer.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
