import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/catalog/ProductCard'
import {
  formatPricePerKg,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/products'

export async function generateStaticParams() {
  return getAllProducts().map(product => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found | Character Before Carrier Farms',
    }
  }

  return {
    title: `${product.name} | Character Before Carrier Farms`,
    description: product.shortDescription,
  }
}

export default function ProductDetailPage({ params }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.slug, 3)

  return (
    <main>
      <section className="relative overflow-hidden bg-forest pb-12 pt-32 text-white sm:pb-16">
        <div className="pattern-afro absolute inset-0 opacity-35" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <Link href="/products" className="inline-flex text-sm font-semibold text-gold-bright hover:text-white">
            Back to Products
          </Link>
          <p className="mt-4 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">
            {product.category}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">{product.shortDescription}</p>
        </div>
      </section>

      <section className="bg-cream py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-soft">
            <div className="relative h-[360px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-cream p-4">
                <p className="text-charcoal/60">Price per kg</p>
                <p className="mt-1 text-base font-semibold text-forest">{formatPricePerKg(product.pricePerKg)}</p>
              </div>
              <div className="rounded-2xl bg-cream p-4">
                <p className="text-charcoal/60">Minimum Order Quantity</p>
                <p className="mt-1 text-base font-semibold text-forest">{product.minimumOrderQuantity}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest/70">Availability / Seasonality</p>
              <p className="mt-2 text-sm text-charcoal/75">{product.availability}</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest/70">Supply Capacity</p>
              <p className="mt-2 text-sm text-charcoal/75">{product.supplyCapacity}</p>
            </div>

            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="font-serif text-3xl text-charcoal">Product Overview</h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{product.longDescription}</p>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest/70">Packaging Options</p>
                <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                  {product.packagingOptions.map(option => (
                    <li key={option} className="rounded-xl bg-cream px-4 py-2">
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="font-serif text-3xl text-charcoal">Compliance and Buyer Fit</h2>

              <div className="mt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest/70">Certifications / Quality Notes</p>
                <ul className="mt-3 space-y-2 text-sm text-charcoal/75">
                  {product.certifications.map(note => (
                    <li key={note} className="rounded-xl bg-cream px-4 py-2">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-forest/70">Suitable Buyers</p>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {product.suitableBuyers.map(buyer => (
                    <li key={buyer} className="rounded-full border border-forest/20 bg-cream px-3 py-1 text-charcoal/80">
                      {buyer}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
                Related Products
              </p>
              <h2 className="mt-4 font-serif text-3xl text-charcoal sm:text-4xl">You May Also Need</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-forest hover:text-cocoa">
              Explore all products
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map(related => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
