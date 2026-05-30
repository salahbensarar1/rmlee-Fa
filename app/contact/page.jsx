import PageHero from '@/components/PageHero'
import QuoteRequestForm from '@/components/forms/QuoteRequestForm'
import {
  getFallbackProductCategories,
  getSupabaseManagedProducts,
} from '@/lib/products'

export const metadata = {
  title: 'Contact and Quote Requests | Character Before Carrier Farms',
  description:
    'Submit a quote request for maize, grains, poultry, eggs, feeds, and value-added products from Character Before Carrier Farms.',
}

function buildProductOption(product) {
  const name = product?.name?.trim()
  const category = product?.category?.trim()
  const id = product?.id != null ? String(product.id).trim() : ''

  if (!name || !category) return null

  return {
    id,
    name,
    category,
    label: `${name} — ${category}`,
    value: id ? `${name} [ID: ${id}]` : name,
  }
}

function normalizeOptions(options) {
  const unique = new Map()

  for (const option of options) {
    if (!option?.value || !option?.label) continue
    if (!unique.has(option.value)) {
      unique.set(option.value, option)
    }
  }

  return Array.from(unique.values())
}

export default async function ContactPage({ searchParams }) {
  const supabaseProducts = await getSupabaseManagedProducts({ activeOnly: true })
  const supabaseOptions = normalizeOptions(
    supabaseProducts
      .filter(product => product.active !== false)
      .map(buildProductOption)
      .filter(Boolean),
  )

  const fallbackCategoryOptions = getFallbackProductCategories().map(category => ({
    id: '',
    name: category,
    category,
    label: category,
    value: category,
  }))

  const productOptions =
    supabaseOptions.length > 0
      ? supabaseOptions
      : fallbackCategoryOptions

  const requestedInterest =
    typeof searchParams?.productInterest === 'string'
      ? searchParams.productInterest.trim()
      : ''
  const requestedProductId =
    typeof searchParams?.productId === 'string'
      ? searchParams.productId.trim()
      : ''
  const requestedProductName =
    typeof searchParams?.product === 'string' ? searchParams.product.trim() : ''
  const requestedCategory =
    typeof searchParams?.category === 'string' ? searchParams.category.trim() : ''

  let initialProductInterest = ''

  if (requestedInterest) {
    const byDirectValue = productOptions.find(
      option => option.value === requestedInterest,
    )
    initialProductInterest = byDirectValue?.value || ''
  }

  if (!initialProductInterest && requestedProductId) {
    const byId = productOptions.find(option => option.id === requestedProductId)
    initialProductInterest = byId?.value || ''
  }

  if (!initialProductInterest && requestedProductName) {
    const requestedNameLower = requestedProductName.toLowerCase()
    const byName = productOptions.find(option => option.name.toLowerCase() === requestedNameLower)
    if (byName) {
      initialProductInterest = byName.value
    } else {
      const byValue = productOptions.find(option => option.value === requestedProductName)
      initialProductInterest = byValue?.value || ''
    }
  }

  if (!initialProductInterest && requestedCategory) {
    const byCategory = productOptions.find(option => option.value === requestedCategory)
    initialProductInterest = byCategory?.value || ''
  }

  return (
    <main>
      <PageHero
        eyebrow="Contact Supplier"
        title="Submit a Serious Quote Request"
        description="Tell us your product requirements, quantity, and location. We will respond with availability and supply guidance."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <aside className="space-y-5">
            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Quote Request Requirements</p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
                <li>- Name</li>
                <li>- Email or phone</li>
                <li>- Product interest</li>
                <li>- Quantity or message</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Operational Contact</p>
              <p className="mt-3 text-sm text-charcoal/75">Greater Accra, Ghana</p>
              <p className="mt-1 text-sm text-charcoal/75">WhatsApp: +233 24 272 8984</p>
              <p className="mt-1 text-sm text-charcoal/75">Email notifications are routed to the business inbox.</p>
            </article>

            <article className="rounded-3xl bg-forest p-6 text-white shadow-premium">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">Business Philosophy</p>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Character Before Carrier means every quote response is handled with integrity, realistic commitments,
                and responsible follow-through.
              </p>
            </article>
          </aside>

          <QuoteRequestForm
            productOptions={productOptions}
            initialProductInterest={initialProductInterest}
          />
        </div>
      </section>
    </main>
  )
}
