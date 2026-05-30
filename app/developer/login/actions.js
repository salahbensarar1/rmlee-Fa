'use server'

import { redirect } from 'next/navigation'
import { getPublicSupabaseConfig } from '@/lib/supabase-config'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server-auth'
import {
  getDeveloperUsersConfig,
  isDeveloperEmailAllowed,
} from '@/lib/developer-users'

function redirectWithError(code) {
  redirect(`/developer/login?error=${encodeURIComponent(code)}`)
}

export async function loginDeveloper(formData) {
  const email = formData.get('email')?.toString().trim() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email || !password) {
    redirectWithError('missing_credentials')
  }

  const publicConfig = getPublicSupabaseConfig()

  if (!publicConfig.isConfigured) {
    redirectWithError('config')
  }

  const developerUsersConfig = getDeveloperUsersConfig()

  if (!developerUsersConfig.isConfigured) {
    redirectWithError('developer_setup')
  }

  let supabase

  try {
    supabase = createSupabaseAuthServerClient()
  } catch (_error) {
    redirectWithError('config')
  }

  const {
    data: signInData,
    error,
  } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirectWithError('invalid_credentials')
  }

  const signedInEmail = signInData?.user?.email || email

  if (!isDeveloperEmailAllowed(signedInEmail)) {
    await supabase.auth.signOut()
    redirectWithError('unauthorized')
  }

  redirect('/developer/dashboard')
}

export async function logoutDeveloper() {
  try {
    const supabase = createSupabaseAuthServerClient()
    await supabase.auth.signOut()
  } catch (_error) {
    // Best effort logout.
  }

  redirect('/developer/login')
}
