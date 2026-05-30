import Link from 'next/link'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import {
  deleteProductAction,
  toggleProductActiveAction,
} from '@/app/admin/(protected)/products/actions'
import { getAdminProducts } from '@/lib/admin-data'

export const metadata = {
  title: 'Admin Products | Character Before Carrier Farms',
}

function getBanner(searchParams) {
  const success = typeof searchParams?.success === 'string' ? searchParams.success : ''
  const error = typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorMessage =
    typeof searchParams?.error_message === 'string'
      ? searchParams.error_message
      : ''

  if (success === 'created') {
    return { type: 'success', message: 'Product created successfully.' }
  }
  if (success === 'updated') {
    return { type: 'success', message: 'Product updated successfully.' }
  }
  if (success === 'deleted') {
    return { type: 'success', message: 'Product deleted successfully.' }
  }
  if (success === 'deactivated') {
    return { type: 'success', message: 'Product deactivated successfully.' }
  }
  if (success === 'activated') {
    return { type: 'success', message: 'Product activated successfully.' }
  }

  if (error === 'config') {
    return { type: 'error', message: 'Admin database access is not configured.', detail: errorMessage }
  }
  if (error === 'create_failed') {
    return { type: 'error', message: 'Could not create product.', detail: errorMessage }
  }
  if (error === 'update_failed') {
    return { type: 'error', message: 'Could not update product.', detail: errorMessage }
  }
  if (error === 'delete_failed') {
    return { type: 'error', message: 'Could not delete product.', detail: errorMessage }
  }
  if (error === 'active_toggle_failed') {
    return { type: 'error', message: 'Could not update product active state.', detail: errorMessage }
  }
  if (error === 'missing_fields') {
    return { type: 'error', message: 'Please fill all required fields.' }
  }
  if (error === 'invalid_id') {
    return { type: 'error', message: 'Invalid product id.' }
  }
  if (error === 'invalid_state') {
    return { type: 'error', message: 'Invalid product active state requested.' }
  }

  return null
}

export default async function AdminProductsPage({ searchParams }) {
  const result = await getAdminProducts()
  const banner = getBanner(searchParams)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Products</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">Product Management</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light"
        >
          Add New Product
        </Link>
      </div>

      {banner && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            banner.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {banner.message}
          {banner.detail && (
            <p className="mt-1">{banner.detail}</p>
          )}
        </div>
      )}

      {!result.isConfigured && (
        <AdminConfigAlert
          missingEnvVars={result.missingEnvVars}
          runtimeError={result.runtimeError || ''}
        />
      )}

      <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
        {result.products.length === 0 ? (
          <p className="text-sm text-charcoal/70">No products found in Supabase.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-forest/10 text-charcoal/65">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Active</th>
                  <th className="py-2 pr-3">Featured</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.products.map(product => (
                  <tr key={product.id} className="border-b border-forest/5 align-top">
                    <td className="py-3 pr-3 font-medium text-charcoal">{product.name}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{product.category}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{product.price_per_kg || 'Price on request'}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{product.active ? 'Yes' : 'No'}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{product.featured ? 'Yes' : 'No'}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-forest/20 px-3 py-1 text-xs font-semibold text-forest"
                        >
                          Edit
                        </Link>
                        <form action={toggleProductActiveAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <input
                            type="hidden"
                            name="nextActive"
                            value={product.active ? 'false' : 'true'}
                          />
                          <button
                            type="submit"
                            className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800"
                          >
                            {product.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </form>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}
