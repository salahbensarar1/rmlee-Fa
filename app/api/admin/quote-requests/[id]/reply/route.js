import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createSupabaseAuthServerClient } from '@/lib/supabase/server-auth'
import { getAdminUsersConfig, isAdminEmailAllowed } from '@/lib/admin-users'
import {
  normalizeStatus,
  REPLY_TEMPLATE_TYPES,
  buildReplyTemplate,
} from '@/lib/quote-request-utils'

const REQUIRED_ENV_VARS = [
  'RESEND_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter(name => !process.env[name])
}

function logMissingEnvVars(missingVars) {
  if (missingVars.length === 0) return
  console.error(`[admin-reply-api] Missing environment variables: ${missingVars.join(', ')}`)
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function toHtmlBody(textBody) {
  return `<p>${escapeHtml(textBody).replace(/\n/g, '<br />')}</p>`
}

function isSupportedTemplateType(templateType) {
  return REPLY_TEMPLATE_TYPES.includes(templateType)
}

function getReplyRecipientEmail(buyerEmail) {
  const testOverride = (process.env.TEST_EMAIL_OVERRIDE || '').trim()
  if (testOverride) return testOverride
  return buyerEmail
}

function getAdminReplyToEmail() {
  const configuredReplyTo = (process.env.QUOTE_TO_EMAIL || '').trim()
  return configuredReplyTo || undefined
}

function isResendTestingModeError(message) {
  const normalized = String(message || '').toLowerCase()

  return (
    normalized.includes('you can only send testing emails to your own email address') ||
    normalized.includes('resend.dev domain is only available for testing') ||
    normalized.includes('verify a domain')
  )
}

export async function POST(request, { params }) {
  try {
    const missingEnvVars = getMissingEnvVars()

    if (missingEnvVars.length > 0) {
      logMissingEnvVars(missingEnvVars)
      return NextResponse.json(
        {
          success: false,
          error: 'configuration_missing',
          message: 'Admin reply service is not configured on the server.',
          missingEnvVars,
        },
        { status: 503 },
      )
    }

    let authClient

    try {
      authClient = createSupabaseAuthServerClient()
    } catch (_error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin authentication is not configured.',
        },
        { status: 503 },
      )
    }

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Please sign in as admin.',
        },
        { status: 401 },
      )
    }

    const adminUsersConfig = getAdminUsersConfig()

    if (!adminUsersConfig.isConfigured) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin setup error: ADMIN_USER_EMAILS is missing or empty.',
          missingEnvVars: adminUsersConfig.missingEnvVars,
        },
        { status: 503 },
      )
    }

    if (!isAdminEmailAllowed(user.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are signed in, but this email is not listed in ADMIN_USER_EMAILS.',
        },
        { status: 403 },
      )
    }

    let payload

    try {
      payload = await request.json()
    } catch (_error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON payload.',
        },
        { status: 400 },
      )
    }

    const templateType = String(payload.templateType || 'custom_message')
    const requestedStatusRaw =
      typeof payload.status === 'string' ? payload.status.trim() : ''
    const requestedStatus = requestedStatusRaw
      ? normalizeStatus(requestedStatusRaw)
      : ''

    if (!isSupportedTemplateType(templateType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported reply template type.',
        },
        { status: 422 },
      )
    }

    const id = params?.id

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote request id is required.',
        },
        { status: 400 },
      )
    }

    const supabase = createSupabaseAdminClient()

    const { data: quoteRequest, error: quoteError } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (quoteError || !quoteRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote request not found.',
        },
        { status: 404 },
      )
    }

    if (!quoteRequest.email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Buyer email is missing. Cannot send reply email.',
        },
        { status: 422 },
      )
    }

    const generatedTemplate = buildReplyTemplate({
      templateType,
      quoteRequest,
    })

    const subject = String(payload.subject || generatedTemplate.subject).trim()
    const body = String(payload.body || generatedTemplate.body).trim()

    if (!subject || !body) {
      return NextResponse.json(
        {
          success: false,
          message: 'Reply subject and body are required.',
        },
        { status: 422 },
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const recipientEmail = getReplyRecipientEmail(quoteRequest.email)

    const emailResult = await resend.emails.send({
      from:
        process.env.QUOTE_FROM_EMAIL ||
        'Character Before Carrier Farms <onboarding@resend.dev>',
      to: [recipientEmail],
      subject,
      text: body,
      html: toHtmlBody(body),
      replyTo: getAdminReplyToEmail(),
    })

    if (emailResult.error) {
      const safeResendMessage = String(emailResult.error.message || '').trim()
      console.error(`[admin-reply-api] Resend send failed: ${safeResendMessage}`)

      if (isResendTestingModeError(safeResendMessage)) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Resend test mode only allows sending to your verified account email. Use that email for testing or verify a domain in Resend.',
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: `Reply email failed: ${safeResendMessage}`,
        },
        { status: 500 },
      )
    }

    const finalStatus = requestedStatus || generatedTemplate.suggestedStatus || 'reviewing'

    const { error: updateError } = await supabase
      .from('quote_requests')
      .update({
        status: finalStatus,
        reply_subject: subject,
        reply_body: body,
        replied_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: `Reply sent but database update failed: ${updateError.message}`,
        },
        { status: 500 },
      )
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/quote-requests')
    revalidatePath(`/admin/quote-requests/${id}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Reply email sent and quote request updated.',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Unexpected error while replying to quote request.',
      },
      { status: 500 },
    )
  }
}
