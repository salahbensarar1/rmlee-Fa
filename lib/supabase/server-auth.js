import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getPublicSupabaseConfig } from '@/lib/supabase-config'

export function createSupabaseAuthServerClient() {
  const config = getPublicSupabaseConfig()

  if (!config.isConfigured) {
    const error = new Error(
      `Supabase auth is not configured. Missing env vars: ${config.missing.join(', ')}`,
    )
    error.name = 'SUPABASE_AUTH_CONFIG_ERROR'
    throw error
  }

  const cookieStore = cookies()

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (_error) {
          // In some Server Component contexts, setting cookies is not available.
          // Middleware / route handlers should handle cookie refresh when needed.
        }
      },
    },
  })
}
