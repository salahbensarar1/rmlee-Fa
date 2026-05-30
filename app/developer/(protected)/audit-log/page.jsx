export const metadata = {
  title: 'Developer Audit Log | Character Before Carrier Farms',
}

const futureAuditEvents = [
  'admin login',
  'product created',
  'product updated',
  'quote replied',
  'quote status changed',
]

export default function DeveloperAuditLogPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
        <h1 className="mt-2 font-mono text-4xl text-slate-100">Audit Log</h1>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-300">
          Audit logging is planned. This page will show system-level activity history when event tracking is enabled.
        </p>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">
          Planned Events
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {futureAuditEvents.map(eventName => (
            <li key={eventName} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono">
              {eventName}
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
