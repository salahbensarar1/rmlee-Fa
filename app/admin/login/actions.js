'use server'

import { redirect } from 'next/navigation'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server-auth'
import { getPublicSupabaseConfig } from '@/lib/supabase-config'
import { getAdminUsersConfig, isAdminEmailAllowed } from '@/lib/admin-users'

function redirectWithError(code) {
  redirect(`/admin/login?error=${encodeURIComponent(code)}`)
}

export async function loginAdmin(formData) {
  const email = formData.get('email')?.toString().trim() || ''
  const password = formData.get('password')?.toString() || ''

  if (!email || !password) {
    redirectWithError('missing_credentials')
  }

  const publicConfig = getPublicSupabaseConfig()

  if (!publicConfig.isConfigured) {
    redirectWithError('config')
  }

  const adminUsersConfig = getAdminUsersConfig()

  if (!adminUsersConfig.isConfigured) {
    redirectWithError('admin_setup')
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

  if (!isAdminEmailAllowed(signedInEmail)) {
    await supabase.auth.signOut()
    redirectWithError('unauthorized')
  }

  redirect('/admin/dashboard')
}

export async function logoutAdmin() {
  try {
    const supabase = createSupabaseAuthServerClient()
    await supabase.auth.signOut()
  } catch (_error) {
    // Best effort logout.
  }

  redirect('/admin/login')
}
