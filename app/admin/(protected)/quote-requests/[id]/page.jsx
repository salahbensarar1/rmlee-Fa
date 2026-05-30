import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import QuoteReplyForm from '@/components/admin/QuoteReplyForm'
import { updateQuoteRequestAction } from '@/app/admin/(protected)/quote-requests/actions'
import { getAdminQuoteRequestById } from '@/lib/admin-data'
import { QUOTE_REQUEST_STATUSES, prettifyStatus } from '@/lib/quote-request-utils'

export const metadata = {
  title: 'Quote Request Detail | Admin',
}

function getBanner(searchParams) {
  const success = typeof searchParams?.success === 'string' ? searchParams.success : ''
  const error = typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorMessage =
    typeof searchParams?.error_message === 'string'
      ? searchParams.error_message
      : ''

  if (success === 'updated') {
    return { type: 'success', message: 'Quote request updated successfully.' }
  }

  if (error === 'update_failed') {
    return { type: 'error', message: errorMessage || 'Could not update quote request.' }
  }

  if (error === 'config') {
    return {
      type: 'error',
      message: `Admin database access is not configured.${errorMessage ? ` ${errorMessage}` : ''}`,
    }
  }

  if (error === 'reply_failed') {
    return { type: 'error', message: 'Could not send reply email.' }
  }

  return null
}

export default async function AdminQuoteRequestDetailPage({ params, searchParams }) {
  const result = await getAdminQuoteRequestById(params.id)
  const banner = getBanner(searchParams)

  if (result.isConfigured && !result.quoteRequest) {
    notFound()
  }

  const request = result.quoteRequest

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Quote Request</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">Request #{params.id}</h1>
        </div>
        <Link href="/admin/quote-requests" className="text-sm font-semibold text-forest hover:text-cocoa">
          Back to requests
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
        </div>
      )}

      {!result.isConfigured && (
        <AdminConfigAlert
          missingEnvVars={result.missingEnvVars}
          runtimeError={result.runtimeError || ''}
        />
      )}

      {request && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="font-serif text-3xl text-charcoal">Buyer Information</h2>
              <div className="mt-4 space-y-3 text-sm text-charcoal/75">
                <p><span className="font-semibold text-charcoal">Name:</span> {request.name}</p>
                <p><span className="font-semibold text-charcoal">Company:</span> {request.company || 'N/A'}</p>
                <p><span className="font-semibold text-charcoal">Email:</span> {request.email || 'N/A'}</p>
                <p><span className="font-semibold text-charcoal">Phone:</span> {request.phone || 'N/A'}</p>
                <p><span className="font-semibold text-charcoal">Buyer Type:</span> {request.buyer_type || 'N/A'}</p>
                <p><span className="font-semibold text-charcoal">Delivery Location:</span> {request.delivery_location || 'N/A'}</p>
              </div>
            </article>

            <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="font-serif text-3xl text-charcoal">Request Details</h2>
              <div className="mt-4 space-y-3 text-sm text-charcoal/75">
                <p><span className="font-semibold text-charcoal">Product Interest:</span> {request.product_interest}</p>
                <p><span className="font-semibold text-charcoal">Current Status:</span> {prettifyStatus(request.status)}</p>
                <p><span className="font-semibold text-charcoal">Submitted At:</span> {request.submitted_at ? new Date(request.submitted_at).toLocaleString('en-GB') : 'N/A'}</p>
                <p><span className="font-semibold text-charcoal">Replied At:</span> {request.replied_at ? new Date(request.replied_at).toLocaleString('en-GB') : 'Not yet replied'}</p>
              </div>

              <div className="mt-4 rounded-2xl bg-cream p-4 text-sm text-charcoal/80">
                <p className="font-semibold text-charcoal">Quantity / Message</p>
                <p className="mt-2 whitespace-pre-wrap">{request.quantity_message}</p>
              </div>
            </article>
          </div>

          <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
            <h2 className="font-serif text-3xl text-charcoal">Update Status and Notes</h2>
            <form action={updateQuoteRequestAction} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={request.id} />

              <label className="block text-sm">
                <span className="mb-2 block font-semibold text-charcoal">Status</span>
                <select
                  name="status"
                  defaultValue={request.status}
                  className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
                >
                  {QUOTE_REQUEST_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-semibold text-charcoal">Admin Notes</span>
                <textarea
                  name="adminNotes"
                  rows={5}
                  defaultValue={request.admin_notes || ''}
                  className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
                />
              </label>

              <button
                type="submit"
                className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light"
              >
                Save Status and Notes
              </button>
            </form>
          </article>

          <QuoteReplyForm quoteRequest={request} />
        </>
      )}
    </section>
  )
}
