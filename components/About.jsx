'use client'

import Image from 'next/image'

const pillars = [
  'Legally registered Ghanaian agribusiness operation',
  'Mixed farming model spanning crops, poultry, and livestock lines',
  'Integrated handling from production to packaged delivery',
  'Built on ethical trade, reliability, and accountable partnerships',
]

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-sand py-20">
      <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-leaf/10 blur-3xl" />
      <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 md:px-7 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] shadow-premium">
          <div className="relative h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80"
              alt="Agricultural operations in Ghana"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-charcoal/10 to-transparent" />
          </div>
          <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest/75">Head Office</p>
            <p className="text-sm font-semibold text-charcoal">Greater Accra, Ghana</p>
          </div>
        </div>

        <div>
          <p className="inline-flex rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            Company Overview
          </p>
          <h2 className="mt-5 font-serif text-4xl text-charcoal sm:text-5xl">Character Before Carrier Farms</h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/75 sm:text-lg">
            Character Before Carrier Farms is headquartered in Greater Accra, Ghana and operates as a mixed farming
            agribusiness supplying local, institutional, and export-facing buyers.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/75 sm:text-lg">
            We combine practical farm operations with professional supply structures to deliver traceable products,
            consistent quality, and dependable commercial partnerships.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {pillars.map(item => (
              <li key={item} className="rounded-2xl bg-white px-4 py-4 text-sm text-charcoal shadow-soft">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
