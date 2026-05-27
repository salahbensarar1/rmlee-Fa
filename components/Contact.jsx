import Link from 'next/link'

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-white" id="request-quote">
      <div className="pattern-afro absolute inset-0 opacity-35" />
      <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center md:px-7 lg:px-8">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">
          Request Quote
        </p>
        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">Ready to Source from Character Before Carrier Farms?</h2>
        <p className="mt-4 text-base text-white/80 sm:text-lg">
          Submit your requirements and our team will respond with pricing, availability, and supply recommendations.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-bright"
          >
            Request a Quote
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            View Product Catalogue
          </Link>
        </div>
      </div>
    </section>
  )
}
