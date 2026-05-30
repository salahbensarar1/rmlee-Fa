import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginDeveloper } from '@/app/developer/login/actions'
import { getCurrentDeveloperUser } from '@/lib/developer-auth'

export const metadata = {
  title: 'Developer Login | Character Before Carrier Farms',
  description: 'Protected developer access for Character Before Carrier Farms.',
}

function getErrorMessage(errorCode) {
  if (errorCode === 'missing_credentials') return 'Please enter both email and password.'
  if (errorCode === 'invalid_credentials') return 'Invalid email or password.'
  if (errorCode === 'unauthorized') {
    return 'You are signed in, but this email is not listed in DEVELOPER_USER_EMAILS.'
  }
  if (errorCode === 'developer_setup') {
    return 'Developer setup error: DEVELOPER_USER_EMAILS is missing or empty. Add it in environment variables, then redeploy.'
  }
  if (errorCode === 'config') {
    return 'Developer authentication is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY, then redeploy.'
  }
  return ''
}

export default async function DeveloperLoginPage({ searchParams }) {
  const user = await getCurrentDeveloperUser()

  if (user) {
    redirect('/developer/dashboard')
  }

  const errorCode =
    typeof searchParams?.error === 'string' ? searchParams.error : ''
  const errorMessage = getErrorMessage(errorCode)

  return (
    <main className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 md:px-7 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Developer Access</p>
        <h1 className="mt-3 font-mono text-3xl text-slate-100">Developer Sign In</h1>
        <p className="mt-2 text-sm text-slate-400">
          Authenticate with your Supabase Auth developer account.
        </p>

        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <form action={loginDeveloper} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-200">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
              placeholder="developer@company.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-200">Password</span>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-600/50"
              placeholder="Your password"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Back to website
          </Link>
          <Link href="/admin/login" className="font-semibold text-slate-300 hover:text-slate-100">
            Go to admin login
          </Link>
        </div>
      </div>
    </main>
  )
}
