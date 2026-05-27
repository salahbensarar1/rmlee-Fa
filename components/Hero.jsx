import Image from 'next/image'
import Link from 'next/link'

const trustBadges = [
  'Registered Business',
  'Traceable Supply',
  'Quality Controlled',
  'B2B Ready',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest text-white" id="home">
      <div className="pattern-afro absolute inset-0 opacity-45" />
      <div className="grid-fine absolute inset-0 opacity-35" />
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cocoa/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-28 md:px-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24">
        <div>
          <span className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright">
            Ghana Mixed Farming and B2B Supply Network
          </span>

          <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Trusted Farm Products from Ghana, Grown with Integrity.
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            Character Before Carrier Farms supplies maize, grains, vegetables, poultry, eggs, livestock products,
            feeds, and value-added food lines for wholesalers, supermarkets, processors, and institutional buyers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex justify-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-gold-bright"
            >
              View Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex justify-center rounded-full border border-white/50 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Request a Quote
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {trustBadges.map(badge => (
              <span
                key={badge}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[460px] overflow-hidden rounded-[30px] ring-1 ring-white/20 shadow-premium-lg">
            <Image
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1400&q=80"
              alt="Agricultural field and produce supply"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-forest/10 to-transparent" />
          </div>

          <div className="absolute -left-4 bottom-6 w-64 rounded-2xl bg-cream p-4 text-charcoal shadow-premium md:-left-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest/70">Core Supply</p>
            <p className="mt-1 text-lg font-semibold">Maize, Eggs, Feeds</p>
            <p className="mt-1 text-sm text-charcoal/70">Contract-ready supply windows and buyer support.</p>
          </div>

          <div className="absolute -right-3 top-6 w-52 rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md md:-right-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Response Window</p>
            <p className="mt-1 text-3xl font-semibold text-white">24h</p>
            <p className="text-sm text-white/75">Procurement follow-up</p>
            <Link href="/contact" className="mt-3 inline-flex text-xs font-semibold text-gold-bright">
              Contact Supplier
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
