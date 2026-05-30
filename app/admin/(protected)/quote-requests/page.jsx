import Link from 'next/link'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import { getAdminQuoteRequests } from '@/lib/admin-data'
import { prettifyStatus } from '@/lib/quote-request-utils'

export const metadata = {
  title: 'Admin Quote Requests | Character Before Carrier Farms',
}

function getBanner(searchParams) {
  const error = typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorMessage =
    typeof searchParams?.error_message === 'string'
      ? searchParams.error_message
      : ''

  if (error === 'invalid_id') {
    return 'Invalid quote request id.'
  }
  if (error === 'config') {
    return `Admin database access is not configured.${errorMessage ? ` ${errorMessage}` : ''}`
  }

  return ''
}

export default async function AdminQuoteRequestsPage({ searchParams }) {
  const result = await getAdminQuoteRequests()
  const banner = getBanner(searchParams)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Quote Requests</p>
        <h1 className="mt-2 font-serif text-4xl text-charcoal">Buyer Requests</h1>
      </div>

      {banner && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {banner}
        </div>
      )}

      {!result.isConfigured && (
        <AdminConfigAlert
          missingEnvVars={result.missingEnvVars}
          runtimeError={result.runtimeError || ''}
        />
      )}

      <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
        {result.quoteRequests.length === 0 ? (
          <p className="text-sm text-charcoal/70">No quote requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-forest/10 text-charcoal/65">
                  <th className="py-2 pr-3">Buyer Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Product Interest</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Submitted</th>
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.quoteRequests.map(item => (
                  <tr key={item.id} className="border-b border-forest/5 align-top">
                    <td className="py-3 pr-3 font-medium text-charcoal">{item.name}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{item.email || 'N/A'}</td>
                    <td className="py-3 pr-3 text-charcoal/75">{item.product_interest}</td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full border border-forest/20 px-3 py-1 text-xs font-semibold text-forest">
                        {prettifyStatus(item.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-charcoal/70">
                      {item.submitted_at
                        ? new Date(item.submitted_at).toLocaleString('en-GB')
                        : 'N/A'}
                    </td>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/quote-requests/${item.id}`}
                        className="text-sm font-semibold text-forest hover:text-cocoa"
                      >
                        View
                      </Link>
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
