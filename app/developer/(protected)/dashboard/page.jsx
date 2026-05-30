import { getDeveloperDashboardData } from '@/lib/developer-data'

export const metadata = {
  title: 'Developer Dashboard | Character Before Carrier Farms',
}

function formatBoolean(value) {
  return value ? 'true' : 'false'
}

function statusClasses(value) {
  return value
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    : 'border-red-500/30 bg-red-500/10 text-red-200'
}

export default async function DeveloperDashboardPage() {
  const data = await getDeveloperDashboardData()

  const rows = [
    { label: 'Supabase URL configured', value: data.supabaseUrlConfigured },
    { label: 'Supabase anon key configured', value: data.supabaseAnonKeyConfigured },
    { label: 'Supabase service role configured', value: data.supabaseServiceRoleConfigured },
    { label: 'Resend configured', value: data.resendConfigured },
    { label: 'Quote from email configured', value: data.quoteFromEmailConfigured },
    { label: 'Quote to email configured', value: data.quoteToEmailConfigured },
    { label: 'Test email override configured', value: data.testEmailOverrideConfigured },
    { label: 'Storage bucket product-images reachable', value: data.productImagesBucketReachable },
    { label: 'Products table reachable', value: data.productsTableReachable },
    { label: 'Quote requests table reachable', value: data.quoteRequestsTableReachable },
  ]

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Dashboard</p>
          <h1 className="mt-2 font-mono text-4xl text-slate-100">System Configuration Overview</h1>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Current Environment</p>
          <p className="font-mono text-lg font-semibold text-cyan-100">{data.environment}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(item => (
          <article key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-300">{item.label}</p>
            <p
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClasses(item.value)}`}
            >
              {formatBoolean(item.value)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
