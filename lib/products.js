import 'server-only'

import { productCategories as fallbackCategories, products as fallbackProducts } from '@/data/products'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { isServiceSupabaseConfigured } from '@/lib/supabase-config'

let hasLoggedSupabaseProductsFallback = false

function logProductsFallback(reason) {
  if (hasLoggedSupabaseProductsFallback) return

  hasLoggedSupabaseProductsFallback = true
  console.warn(`[products] Falling back to local product data: ${reason}`)
}

function normalizeFallbackProduct(product) {
  return {
    ...product,
    active: true,
  }
}

function normalizeSupabaseProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description || '',
    longDescription: row.long_description || '',
    image: row.image || '',
    pricePerKg: row.price_per_kg || null,
    minimumOrderQuantity: row.minimum_order_quantity || '',
    packagingOptions: Array.isArray(row.packaging_options) ? row.packaging_options : [],
    availability: row.availability || '',
    certifications: Array.isArray(row.certifications) ? row.certifications : [],
    supplyCapacity: row.supply_capacity || '',
    suitableBuyers: Array.isArray(row.suitable_buyers) ? row.suitable_buyers : [],
    featured: Boolean(row.featured),
    active: row.active !== false,
  }
}

async function loadSupabaseProducts({ activeOnly = true } = {}) {
  if (!isServiceSupabaseConfigured()) {
    logProductsFallback('Supabase service environment variables are missing')
    return {
      status: 'not_configured',
      products: [],
    }
  }

  try {
    const supabase = createSupabaseAdminClient()

    let query = supabase.from('products').select('*').order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) {
      logProductsFallback(error.message)
      return {
        status: 'error',
        products: [],
      }
    }

    return {
      status: 'ok',
      products: (data || []).map(normalizeSupabaseProduct),
    }
  } catch (error) {
    logProductsFallback(error instanceof Error ? error.message : 'Unknown Supabase error')
    return {
      status: 'error',
      products: [],
    }
  }
}

export async function getSupabaseManagedProducts({ activeOnly = true } = {}) {
  const result = await loadSupabaseProducts({ activeOnly })

  if (result.status !== 'ok') {
    return []
  }

  return result.products
}

export async function getAllProducts({ activeOnly = true } = {}) {
  const supabaseResult = await loadSupabaseProducts({ activeOnly })

  if (supabaseResult.status === 'ok' && supabaseResult.products.length > 0) {
    return supabaseResult.products
  }

  if (supabaseResult.status === 'ok' && supabaseResult.products.length === 0) {
    logProductsFallback('Supabase products table is empty')
  }

  const fallback = fallbackProducts.map(normalizeFallbackProduct)

  if (activeOnly) {
    return fallback.filter(product => product.active !== false)
  }

  return fallback
}

export async function getFeaturedProducts() {
  const products = await getAllProducts({ activeOnly: true })
  return products.filter(product => product.featured)
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts({ activeOnly: true })
  return products.find(product => product.slug === slug)
}

export async function getProductById(id) {
  const products = await getAllProducts({ activeOnly: false })
  return products.find(product => String(product.id) === String(id))
}

export async function getRelatedProducts(slug, limit = 3) {
  const products = await getAllProducts({ activeOnly: true })
  const current = products.find(product => product.slug === slug)

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

export async function getAllCategories() {
  const products = await getAllProducts({ activeOnly: true })
  const dynamicCategories = Array.from(
    new Set(products.map(product => product.category).filter(Boolean)),
  )

  if (dynamicCategories.length > 0) {
    return dynamicCategories
  }

  return fallbackCategories
}

export function getFallbackProductCategories() {
  return fallbackCategories
}

export function formatPricePerKg(pricePerKg) {
  if (pricePerKg == null || pricePerKg === '') return 'Price on request'

  if (typeof pricePerKg === 'number') {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 2,
    }).format(pricePerKg)
  }

  return String(pricePerKg)
}
