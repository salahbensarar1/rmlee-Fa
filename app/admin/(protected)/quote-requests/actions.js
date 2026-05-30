'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminUser } from '@/lib/admin-auth'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getServiceSupabaseConfig } from '@/lib/supabase-config'
import { normalizeStatus } from '@/lib/quote-request-utils'

function toSafeErrorMessage(error, fallbackMessage) {
  const message =
    (error && typeof error === 'object' && 'message' in error && error.message) ||
    fallbackMessage

  if (!message) return ''

  return String(message)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240)
}

function redirectWithError(id, code, errorMessage = '') {
  const params = new URLSearchParams()
  params.set('error', code)

  if (errorMessage) {
    params.set('error_message', errorMessage)
  }

  redirect(`/admin/quote-requests/${id}?${params.toString()}`)
}

export async function updateQuoteRequestAction(formData) {
  await requireAdminUser()

  const config = getServiceSupabaseConfig()
  const id = formData.get('id')?.toString().trim() || ''

  if (!config.isConfigured) {
    const configMessage = `Missing environment variables: ${config.missing.join(', ')}`
    if (!id) {
      redirect(`/admin/quote-requests?error=config&error_message=${encodeURIComponent(configMessage)}`)
    }
    redirectWithError(id, 'config', configMessage)
  }

  if (!id) {
    redirect('/admin/quote-requests?error=invalid_id')
  }

  const status = normalizeStatus(formData.get('status')?.toString().trim() || 'new')
  const adminNotes = formData.get('adminNotes')?.toString().trim() || null

  let updateErrorMessage = ''

  try {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('quote_requests')
      .update({
        status,
        admin_notes: adminNotes,
      })
      .eq('id', id)

    if (error) {
      updateErrorMessage = toSafeErrorMessage(error, 'Could not update quote request.')
    }
  } catch (error) {
    updateErrorMessage = toSafeErrorMessage(error, 'Could not update quote request.')
  }

  if (updateErrorMessage) {
    redirectWithError(id, 'update_failed', updateErrorMessage)
  }

  revalidatePath('/admin/quote-requests')
  revalidatePath(`/admin/quote-requests/${id}`)
  revalidatePath('/admin/dashboard')

  redirect(`/admin/quote-requests/${id}?success=updated`)
}
