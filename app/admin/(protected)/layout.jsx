import Link from 'next/link'
import { logoutAdmin } from '@/app/admin/login/actions'
import { requireAdminUser } from '@/lib/admin-auth'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/products/new', label: 'Add Product' },
  { href: '/admin/quote-requests', label: 'Quote Requests' },
  { href: '/', label: 'Back to Website' },
]

export default async function AdminProtectedLayout({ children }) {
  const { user } = await requireAdminUser()

  return (
    <div className="min-h-screen bg-cream lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-forest/10 bg-white lg:flex lg:flex-col lg:justify-between">
        <div className="px-6 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Panel</p>
          <p className="mt-1 text-lg font-semibold text-charcoal">Character Before Carrier Farms</p>

          <nav className="mt-6 space-y-2">
            {adminLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl border border-forest/10 px-4 py-2.5 text-sm font-semibold text-forest transition hover:bg-forest/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-forest/10 px-6 py-5">
          <p className="text-xs text-charcoal/60">Signed in as</p>
          <p className="mt-1 break-all text-sm font-semibold text-charcoal">{user.email}</p>
          <form action={logoutAdmin} className="mt-4">
            <button
              type="submit"
              className="w-full rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-light"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-forest/10 bg-white/95 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Panel</p>
              <p className="text-base font-semibold text-charcoal">Character Before Carrier Farms</p>
              <p className="mt-1 text-xs text-charcoal/60">{user.email}</p>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-light"
              >
                Logout
              </button>
            </form>
          </div>

          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-4 md:px-7">
            {adminLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest/5"
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
