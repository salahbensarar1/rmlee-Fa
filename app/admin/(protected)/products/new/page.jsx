import Link from 'next/link'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import AdminProductForm from '@/components/admin/AdminProductForm'
import { createProductAction } from '@/app/admin/(protected)/products/actions'
import { getAllCategories } from '@/lib/products'
import { getServiceSupabaseConfig } from '@/lib/supabase-config'

export const metadata = {
  title: 'Add Product | Admin',
}

function getErrorMessage(searchParams) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorDetail =
    typeof searchParams?.error_message === 'string'
      ? searchParams.error_message
      : ''

  if (error === 'config') return `Admin database access is not configured.${errorDetail ? ` ${errorDetail}` : ''}`
  if (error === 'missing_fields') return 'Please complete required fields.'
  if (error === 'create_failed') return errorDetail || 'Could not create product. Check Supabase table setup and try again.'
  return ''
}

export default async function AdminNewProductPage({ searchParams }) {
  const config = getServiceSupabaseConfig()
  const errorMessage = getErrorMessage(searchParams)
  const categories = await getAllCategories()

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Products</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">Create Product</h1>
        </div>
        <Link href="/admin/products" className="text-sm font-semibold text-forest hover:text-cocoa">
          Back to products
        </Link>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {errorMessage}
        </div>
      )}

      {!config.isConfigured && (
        <AdminConfigAlert missingEnvVars={config.missing} />
      )}

      <AdminProductForm
        action={createProductAction}
        submitLabel="Create Product"
        categories={categories}
      />
    </section>
  )
}
