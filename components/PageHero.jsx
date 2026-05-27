export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden bg-forest pb-16 pt-32 text-white sm:pb-20">
      <div className="pattern-afro absolute inset-0 opacity-35" />
      <div className="absolute -right-20 top-8 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-cocoa/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base text-white/80 sm:text-lg">{description}</p>
      </div>
    </section>
  )
}
