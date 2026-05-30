import Link from 'next/link'
import AdminConfigAlert from '@/components/admin/AdminConfigAlert'
import AdminDebugPanel from '@/components/admin/AdminDebugPanel'
import { requireAdminUser } from '@/lib/admin-auth'
import { getAdminDashboardData } from '@/lib/admin-data'
import { getAdminUsersConfig, isAdminEmailAllowed } from '@/lib/admin-users'
import { prettifyStatus } from '@/lib/quote-request-utils'

export const metadata = {
  title: 'Admin Dashboard | Character Before Carrier Farms',
}

export default async function AdminDashboardPage() {
  const [{ user }, data] = await Promise.all([
    requireAdminUser(),
    getAdminDashboardData(),
  ])

  const adminUsersConfig = getAdminUsersConfig()
  const showDebugPanel = process.env.NODE_ENV === 'development'

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Dashboard</p>
        <h1 className="mt-2 font-serif text-4xl text-charcoal">Operations Overview</h1>
      </div>

      {!data.isConfigured && (
        <AdminConfigAlert
          missingEnvVars={data.missingEnvVars}
          runtimeError={data.runtimeError || ''}
        />
      )}

      {showDebugPanel && (
        <AdminDebugPanel
          loggedInEmail={user?.email || ''}
          parsedAdminEmails={adminUsersConfig.parsedEmails}
          isAdmin={isAdminEmailAllowed(user?.email || '')}
          supabaseUrlConfigured={Boolean(process.env.SUPABASE_URL)}
          serviceRoleConfigured={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
        />
      )}

      {data.stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-forest/10 bg-white p-5 shadow-soft">
            <p className="text-sm text-charcoal/70">Total Quote Requests</p>
            <p className="mt-2 text-3xl font-semibold text-forest">{data.stats.totalQuotes}</p>
          </article>
          <article className="rounded-2xl border border-forest/10 bg-white p-5 shadow-soft">
            <p className="text-sm text-charcoal/70">New Requests</p>
            <p className="mt-2 text-3xl font-semibold text-forest">{data.stats.newQuotes}</p>
          </article>
          <article className="rounded-2xl border border-forest/10 bg-white p-5 shadow-soft">
            <p className="text-sm text-charcoal/70">Active Products</p>
            <p className="mt-2 text-3xl font-semibold text-forest">{data.stats.activeProducts}</p>
          </article>
          <article className="rounded-2xl border border-forest/10 bg-white p-5 shadow-soft">
            <p className="text-sm text-charcoal/70">Total Products</p>
            <p className="mt-2 text-3xl font-semibold text-forest">{data.stats.totalProducts}</p>
          </article>
        </div>
      )}

      <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-3xl text-charcoal">Recent Quote Requests</h2>
          <Link href="/admin/quote-requests" className="text-sm font-semibold text-forest hover:text-cocoa">
            View all requests
          </Link>
        </div>

        {data.recentQuoteRequests.length === 0 ? (
          <p className="text-sm text-charcoal/70">No quote requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-forest/10 text-charcoal/65">
                  <th className="py-2 pr-3">Buyer</th>
                  <th className="py-2 pr-3">Product Interest</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Submitted</th>
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentQuoteRequests.map(request => (
                  <tr key={request.id} className="border-b border-forest/5">
                    <td className="py-3 pr-3 font-medium text-charcoal">{request.name}</td>
                    <td className="py-3 pr-3 text-charcoal/80">{request.product_interest}</td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full border border-forest/20 px-3 py-1 text-xs font-semibold text-forest">
                        {prettifyStatus(request.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-charcoal/70">
                      {request.submitted_at
                        ? new Date(request.submitted_at).toLocaleString('en-GB')
                        : 'N/A'}
                    </td>
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/quote-requests/${request.id}`}
                        className="text-sm font-semibold text-forest hover:text-cocoa"
                      >
                        Open
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
