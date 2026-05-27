import Image from 'next/image'
import Link from 'next/link'
import { formatPricePerKg } from '@/lib/products'

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-premium">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white">
          {product.category}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-charcoal">{product.name}</h3>
          <p className="mt-2 text-sm text-charcoal/70">{product.shortDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-cream p-3 text-sm">
          <div>
            <p className="text-charcoal/60">Price per kg</p>
            <p className="font-semibold text-forest">{formatPricePerKg(product.pricePerKg)}</p>
          </div>
          <div>
            <p className="text-charcoal/60">MOQ</p>
            <p className="font-semibold text-forest">{product.minimumOrderQuantity}</p>
          </div>
        </div>

        <p className="text-sm text-charcoal/70">{product.availability}</p>

        <div className="flex gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest/5"
          >
            View Details
          </Link>
          <Link
            href="/contact"
            className="inline-flex flex-1 items-center justify-center rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-light"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </article>
  )
}
