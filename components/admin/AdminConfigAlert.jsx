export default function AdminConfigAlert({ missingEnvVars = [], runtimeError = '' }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-semibold">Admin database access is not configured.</p>
      {missingEnvVars.length > 0 && (
        <p className="mt-2">
          Missing environment variables: <span className="font-semibold">{missingEnvVars.join(', ')}</span>
        </p>
      )}
      <p className="mt-2">
        Add missing variables in Vercel Project Settings -&gt; Environment Variables, then redeploy.
      </p>
      {runtimeError && (
        <p className="mt-2">
          Runtime error: <span className="font-semibold">{runtimeError}</span>
        </p>
      )}
    </div>
  )
}
