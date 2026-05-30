import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import AdminProductForm from '@/components/admin/AdminProductForm'
import { updateProductAction } from '@/app/admin/(protected)/products/actions'
import { getAdminProductById } from '@/lib/admin-data'
import { getAllCategories } from '@/lib/products'

export const metadata = {
  title: 'Edit Product | Admin',
}

function getErrorMessage(searchParams) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorDetail =
    typeof searchParams?.error_message === 'string'
      ? searchParams.error_message
      : ''

  if (error === 'missing_fields') return 'Please complete required fields.'
  if (error === 'update_failed') return errorDetail || 'Could not update product. Check Supabase table setup and try again.'
  if (error === 'config') return `Admin database access is not configured.${errorDetail ? ` ${errorDetail}` : ''}`
  return ''
}

export default async function AdminEditProductPage({ params, searchParams }) {
  const result = await getAdminProductById(params.id)
  const errorMessage = getErrorMessage(searchParams)
  const categories = await getAllCategories()

  if (result.isConfigured && !result.product) {
    notFound()
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Products</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">Edit Product</h1>
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

      {!result.isConfigured && (
        <AdminConfigAlert
          missingEnvVars={result.missingEnvVars}
          runtimeError={result.runtimeError || ''}
        />
      )}

      {result.product && (
        <AdminProductForm
          action={updateProductAction}
          submitLabel="Save Product Changes"
          categories={categories}
          product={result.product}
        />
      )}
    </section>
  )
}
