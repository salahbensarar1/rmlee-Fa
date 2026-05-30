import { redirect } from 'next/navigation'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server-auth'
import {
  getDeveloperUsersConfig,
  isDeveloperEmailAllowed,
} from '@/lib/developer-users'

async function signOutIfPossible(supabase) {
  try {
    await supabase.auth.signOut()
  } catch (_error) {
    // Best effort sign-out when access checks fail.
  }
}

export async function requireDeveloperUser() {
  let supabase

  try {
    supabase = createSupabaseAuthServerClient()
  } catch (_error) {
    redirect('/developer/login?error=config')
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/developer/login')
  }

  const developerUsersConfig = getDeveloperUsersConfig()

  if (!developerUsersConfig.isConfigured) {
    await signOutIfPossible(supabase)
    redirect('/developer/login?error=developer_setup')
  }

  if (!isDeveloperEmailAllowed(user.email)) {
    await signOutIfPossible(supabase)
    redirect('/developer/login?error=unauthorized')
  }

  return { user, supabase, developerUsersConfig }
}

export async function getCurrentDeveloperUser() {
  try {
    const supabase = createSupabaseAuthServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) return null
    if (!user) return null

    const developerUsersConfig = getDeveloperUsersConfig()
    if (!developerUsersConfig.isConfigured) return null
    if (!isDeveloperEmailAllowed(user.email)) return null

    return user
  } catch (_error) {
    return null
  }
}
