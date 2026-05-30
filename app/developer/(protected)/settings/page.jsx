import { getDeveloperSettingsOverview } from '@/lib/developer-data'

export const metadata = {
  title: 'Developer Settings | Character Before Carrier Farms',
}

function statusClass(configured) {
  return configured
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
}

export default function DeveloperSettingsPage() {
  const settings = getDeveloperSettingsOverview()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
        <h1 className="mt-2 font-mono text-4xl text-slate-100">Read-only Environment Settings</h1>
        <p className="mt-2 text-sm text-slate-400">
          This page only shows whether variables are configured. Secret values are never displayed.
        </p>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 pr-3">Environment Variable</th>
                <th className="py-2 pr-3">Configured</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(item => (
                <tr key={item.name} className="border-b border-slate-800/60">
                  <td className="py-3 pr-3 font-mono text-slate-200">{item.name}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(
                        item.configured,
                      )}`}
                    >
                      {item.configured ? 'true' : 'false'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
