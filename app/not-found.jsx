import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-cream px-5 pb-20 pt-36 md:px-7 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-forest/10 bg-white p-8 text-center shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">404</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Page not found</h1>
        <p className="mt-3 text-sm text-charcoal/70">
          The page you requested could not be located. Please return to the homepage or browse the product catalogue.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white">
            Go Home
          </Link>
          <Link href="/products" className="rounded-full border border-forest/20 px-6 py-2.5 text-sm font-semibold text-forest">
            View Products
          </Link>
        </div>
      </div>
    </main>
  )
}
