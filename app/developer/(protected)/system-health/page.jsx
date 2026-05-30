import { getDeveloperSystemHealthData } from '@/lib/developer-data'

export const metadata = {
  title: 'Developer System Health | Character Before Carrier Farms',
}

function classesForResult(passed) {
  return passed
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    : 'border-red-500/30 bg-red-500/10 text-red-200'
}

export default async function DeveloperSystemHealthPage() {
  const data = await getDeveloperSystemHealthData()

  const checks = [
    {
      id: 'database_connection',
      label: 'Database connection',
      result: data.checks.databaseConnection,
    },
    {
      id: 'products_table_read',
      label: 'Products table read',
      result: data.checks.productsTable,
    },
    {
      id: 'quote_requests_table_read',
      label: 'Quote requests table read',
      result: data.checks.quoteRequestsTable,
    },
    {
      id: 'product_images_bucket',
      label: 'product-images bucket exists',
      result: data.checks.productImagesBucket,
    },
    {
      id: 'resend_configuration',
      label: 'Resend configuration check',
      result: data.checks.resend,
    },
  ]

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
        <h1 className="mt-2 font-mono text-4xl text-slate-100">System Health</h1>
        <p className="mt-2 text-sm text-slate-400">
          Health checks run server-side with privileged access where required.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {checks.map(check => (
          <article key={check.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm font-semibold text-slate-100">{check.label}</p>
            <p
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${classesForResult(
                check.result.passed,
              )}`}
            >
              {check.result.passed ? 'Pass' : 'Fail'}
            </p>
            <p className="mt-3 text-sm text-slate-300">{check.result.detail}</p>
          </article>
        ))}
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Resend Note</p>
        <p className="mt-2 text-sm text-slate-300">
          Resend is tested with a non-sending API check where possible. No customer email is sent from this page.
        </p>
      </article>
    </section>
  )
}
