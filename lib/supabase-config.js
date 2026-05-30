const REQUIRED_PUBLIC_SUPABASE_VARS = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
const REQUIRED_SERVICE_SUPABASE_VARS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

function listMissingEnvVars(requiredVars) {
  return requiredVars.filter(name => !process.env[name])
}

export function getPublicSupabaseConfig() {
  const missing = listMissingEnvVars(REQUIRED_PUBLIC_SUPABASE_VARS)

  if (missing.length > 0) {
    return {
      isConfigured: false,
      missing,
      url: null,
      anonKey: null,
    }
  }

  return {
    isConfigured: true,
    missing: [],
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  }
}

export function getServiceSupabaseConfig() {
  const missing = listMissingEnvVars(REQUIRED_SERVICE_SUPABASE_VARS)

  if (missing.length > 0) {
    return {
      isConfigured: false,
      missing,
      url: null,
      serviceRoleKey: null,
    }
  }

  return {
    isConfigured: true,
    missing: [],
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export function isPublicSupabaseConfigured() {
  return getPublicSupabaseConfig().isConfigured
}

export function isServiceSupabaseConfigured() {
  return getServiceSupabaseConfig().isConfigured
}
