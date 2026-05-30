import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginAdmin } from '@/app/admin/login/actions'
import { getCurrentAdminUser } from '@/lib/admin-auth'

export const metadata = {
  title: 'Admin Login | Character Before Carrier Farms',
  description: 'Secure admin login for Character Before Carrier Farms.',
}

function getErrorMessage(errorCode) {
  if (errorCode === 'missing_credentials') return 'Please enter both email and password.'
  if (errorCode === 'invalid_credentials') return 'Invalid email or password.'
  if (errorCode === 'unauthorized') {
    return 'You are signed in, but this email is not listed in ADMIN_USER_EMAILS.'
  }
  if (errorCode === 'admin_setup') {
    return 'Admin setup error: ADMIN_USER_EMAILS is missing or empty. Add it in environment variables, then redeploy.'
  }
  if (errorCode === 'config') {
    return 'Admin authentication is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY, then redeploy.'
  }
  return ''
}

export default async function AdminLoginPage({ searchParams }) {
  const user = await getCurrentAdminUser()

  if (user) {
    redirect('/admin/dashboard')
  }

  const errorCode =
    typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorMessage = getErrorMessage(errorCode)

  return (
    <main className="min-h-screen bg-cream px-5 pb-20 pt-28 md:px-7 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-forest/10 bg-white p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest/70">Admin Access</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Sign In</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Use your Supabase Auth admin account credentials.
        </p>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <form action={loginAdmin} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="admin@company.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Password</span>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light"
          >
            Sign In
          </button>
        </form>

        <Link href="/" className="mt-4 inline-flex text-sm font-semibold text-forest hover:text-cocoa">
          Back to website
        </Link>
      </div>
    </main>
  )
}
