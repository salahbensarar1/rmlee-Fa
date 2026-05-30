import { createClient } from '@supabase/supabase-js'
import { getServiceSupabaseConfig } from '@/lib/supabase-config'

export function createSupabaseAdminClient() {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    const error = new Error(
      `Supabase service client is not configured. Missing env vars: ${config.missing.join(', ')}`,
    )
    error.name = 'SUPABASE_SERVICE_CONFIG_ERROR'
    throw error
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
