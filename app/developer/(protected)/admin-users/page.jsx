import { getDeveloperAdminUsersOverview } from '@/lib/developer-data'

export const metadata = {
  title: 'Developer Admin Users | Character Before Carrier Farms',
}

function renderEmails(emails) {
  if (!emails || emails.length === 0) {
    return <p className="text-sm text-slate-400">No emails configured.</p>
  }

  return (
    <ul className="space-y-2 text-sm">
      {emails.map(email => (
        <li key={email} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200">
          {email}
        </li>
      ))}
    </ul>
  )
}

export default function DeveloperAdminUsersPage() {
  const { adminUsersConfig, developerUsersConfig } = getDeveloperAdminUsersOverview()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
        <h1 className="mt-2 font-mono text-4xl text-slate-100">Allowed Access Emails</h1>
        <p className="mt-2 text-sm text-slate-400">
          Access lists are controlled by environment variables only.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">ADMIN_USER_EMAILS</p>
          <p className="mt-2 text-xs text-slate-400">
            Configured: <span className="font-semibold text-slate-200">{String(adminUsersConfig.isConfigured)}</span>
          </p>
          <div className="mt-4">{renderEmails(adminUsersConfig.parsedEmails)}</div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">DEVELOPER_USER_EMAILS</p>
          <p className="mt-2 text-xs text-slate-400">
            Configured: <span className="font-semibold text-slate-200">{String(developerUsersConfig.isConfigured)}</span>
          </p>
          <div className="mt-4">{renderEmails(developerUsersConfig.parsedEmails)}</div>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200">Update Instructions</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Open Vercel Project Settings.</li>
          <li>Go to Environment Variables.</li>
          <li>Update `ADMIN_USER_EMAILS` and/or `DEVELOPER_USER_EMAILS`.</li>
          <li>Redeploy the project so changes take effect.</li>
        </ol>
      </article>
    </section>
  )
}
