export default function AdminDebugPanel({
  loggedInEmail = '',
  parsedAdminEmails = [],
  isAdmin = false,
  supabaseUrlConfigured = false,
  serviceRoleConfigured = false,
}) {
  return (
    <article className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-semibold">Admin Debug (Development Only)</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p>
          <span className="font-semibold">Logged-in email:</span> {loggedInEmail || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">isAdmin:</span> {String(isAdmin)}
        </p>
        <p>
          <span className="font-semibold">Supabase URL configured:</span>{' '}
          {String(supabaseUrlConfigured)}
        </p>
        <p>
          <span className="font-semibold">Service role configured:</span>{' '}
          {String(serviceRoleConfigured)}
        </p>
      </div>
      <p className="mt-3 font-semibold">ADMIN_USER_EMAILS parsed list</p>
      <p className="mt-1 break-all">
        {parsedAdminEmails.length > 0 ? parsedAdminEmails.join(', ') : 'none'}
      </p>
    </article>
  )
}
