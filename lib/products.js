import { productCategories, products } from '@/data/products'

export function getAllProducts() {
  return products
}

export function getFeaturedProducts() {
  return products.filter(product => product.featured)
}

export function getProductBySlug(slug) {
  return products.find(product => product.slug === slug)
}

export function getRelatedProducts(slug, limit = 3) {
  const current = getProductBySlug(slug)

  if (!current) return []

  const sameCategory = products.filter(
    product => product.slug !== slug && product.category === current.category,
  )

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const fallback = products.filter(
    product => product.slug !== slug && product.category !== current.category,
  )

  return [...sameCategory, ...fallback].slice(0, limit)
}

export function getAllCategories() {
  return productCategories
}

export function formatPricePerKg(pricePerKg) {
  if (pricePerKg == null) return 'Price on request'

  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 2,
  }).format(pricePerKg)
}
