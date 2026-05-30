import Link from 'next/link'
import { logoutDeveloper } from '@/app/developer/login/actions'
import { requireDeveloperUser } from '@/lib/developer-auth'

const developerLinks = [
  { href: '/developer/dashboard', label: 'Developer Dashboard' },
  { href: '/developer/admin-users', label: 'Admin Users' },
  { href: '/developer/system-health', label: 'System Health' },
  { href: '/developer/settings', label: 'Settings' },
  { href: '/developer/audit-log', label: 'Audit Log' },
  { href: '/admin/dashboard', label: 'Back to Admin' },
  { href: '/', label: 'Back to Website' },
]

export default async function DeveloperProtectedLayout({ children }) {
  const { user } = await requireDeveloperUser()

  return (
    <div className="min-h-screen bg-slate-950 lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-900 lg:flex lg:flex-col lg:justify-between">
        <div className="px-6 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
          <p className="mt-1 font-mono text-lg font-semibold text-slate-100">System Back Office</p>

          <nav className="mt-6 space-y-2">
            {developerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/70 hover:text-cyan-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 px-6 py-5">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="mt-1 break-all text-sm font-semibold text-slate-100">{user.email}</p>
          <form action={logoutDeveloper} className="mt-4">
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Panel</p>
              <p className="font-mono text-base font-semibold text-slate-100">System Back Office</p>
              <p className="mt-1 text-xs text-slate-400">{user.email}</p>
            </div>

            <form action={logoutDeveloper}>
              <button
                type="submit"
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                Logout
              </button>
            </form>
          </div>

          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-4 md:px-7">
            {developerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/70 hover:text-cyan-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 pb-14 pt-8 md:px-7 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
