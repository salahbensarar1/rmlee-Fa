'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/catalog/ProductCard'

export default function ProductCatalogue({
  products,
  categories,
  initialSearchTerm = '',
  initialCategory = 'All Categories',
}) {
  const validInitialCategory =
    initialCategory === 'All Categories' || categories.includes(initialCategory)
      ? initialCategory
      : 'All Categories'

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [activeCategory, setActiveCategory] = useState(validInitialCategory)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        activeCategory === 'All Categories' || product.category === activeCategory

      const search = searchTerm.trim().toLowerCase()

      const matchesSearch =
        search.length === 0 ||
        product.name.toLowerCase().includes(search) ||
        product.shortDescription.toLowerCase().includes(search) ||
        product.longDescription.toLowerCase().includes(search)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm, products])

  return (
    <section className="relative overflow-hidden bg-cream py-14 sm:py-16">
      <div className="absolute inset-0 pattern-afro opacity-15" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-7 lg:px-8">
        <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-charcoal">Search products</span>
              <input
                type="text"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Search by product name or keyword"
                className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-forest/25"
              />
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-charcoal">Filter by category</p>
              <div className="flex flex-wrap gap-2">
                {['All Categories', ...categories].map(category => {
                  const isActive = activeCategory === category

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-forest text-white'
                          : 'border border-forest/20 bg-white text-forest hover:bg-forest/5'
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-charcoal/70">
          <p>
            Showing <span className="font-semibold text-charcoal">{filteredProducts.length}</span> products
          </p>
          <p className="hidden sm:block">Catalog updates support expanding supply lines.</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-forest/10 bg-white p-10 text-center shadow-soft">
            <h3 className="text-xl font-semibold text-charcoal">No matching products found</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Try another keyword or clear your category filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
