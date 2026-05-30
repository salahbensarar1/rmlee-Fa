import { redirect } from 'next/navigation'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server-auth'
import { getAdminUsersConfig, isAdminEmailAllowed } from '@/lib/admin-users'

async function signOutIfPossible(supabase) {
  try {
    await supabase.auth.signOut()
  } catch (_error) {
    // Best effort sign-out when access checks fail.
  }
}

export async function requireAdminUser() {
  let supabase

  try {
    supabase = createSupabaseAuthServerClient()
  } catch (_error) {
    redirect('/admin/login?error=config')
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  const adminUsersConfig = getAdminUsersConfig()

  if (!adminUsersConfig.isConfigured) {
    await signOutIfPossible(supabase)
    redirect('/admin/login?error=admin_setup')
  }

  if (!isAdminEmailAllowed(user.email)) {
    await signOutIfPossible(supabase)
    redirect('/admin/login?error=unauthorized')
  }

  return { user, supabase, adminUsersConfig }
}

export async function getCurrentAdminUser() {
  try {
    const supabase = createSupabaseAuthServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) return null
    if (!user) return null
    const adminUsersConfig = getAdminUsersConfig()
    if (!adminUsersConfig.isConfigured) return null
    if (!isAdminEmailAllowed(user.email)) return null
    return user
  } catch (_error) {
    return null
  }
}
