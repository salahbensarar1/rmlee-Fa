import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const REQUIRED_ENV_VARS = [
  'RESEND_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar])
}

function getDeveloperInstructionsForMissingEnv(missingVars) {
  const instructions = [
    'Create a `.env.local` file in the project root.',
    'Add the missing environment variables and restart `npm run dev`.',
  ]

  if (missingVars.includes('RESEND_API_KEY')) {
    instructions.push('Set `RESEND_API_KEY` from your Resend dashboard API keys.')
  }

  if (
    missingVars.includes('SUPABASE_URL') ||
    missingVars.includes('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    instructions.push('Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project settings.')
  }

  instructions.push(
    'Optional: set `QUOTE_FROM_EMAIL` (defaults to onboarding@resend.dev for testing).',
  )

  return instructions
}

function validatePayload(payload) {
  const errors = {}

  if (!payload || typeof payload !== 'object') {
    return {
      isValid: false,
      errors: { form: 'Invalid request body.' },
      normalized: null,
    }
  }

  const normalized = {
    name: payload.name?.trim() || '',
    company: payload.company?.trim() || '',
    buyerType: payload.buyerType?.trim() || '',
    email: payload.email?.trim() || '',
    phone: payload.phone?.trim() || '',
    productInterest: payload.productInterest?.trim() || '',
    deliveryLocation: payload.deliveryLocation?.trim() || '',
    quantityMessage: payload.quantityMessage?.trim() || '',
  }

  if (!normalized.name) errors.name = 'Name is required.'
  if (!normalized.productInterest) errors.productInterest = 'Product interest is required.'
  if (!normalized.quantityMessage) errors.quantityMessage = 'Quantity or message is required.'

  if (!normalized.email && !normalized.phone) {
    errors.contactMethod = 'Provide either an email or phone number.'
  }

  if (
    normalized.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)
  ) {
    errors.email = 'Invalid email format.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized,
  }
}

function createPlainTextEmail(quote) {
  return [
    'New Quote Request - Character Before Carrier Farms',
    '',
    `Name: ${quote.name}`,
    `Company: ${quote.company || 'N/A'}`,
    `Buyer Type: ${quote.buyerType || 'N/A'}`,
    `Email: ${quote.email || 'N/A'}`,
    `Phone: ${quote.phone || 'N/A'}`,
    `Product Interest: ${quote.productInterest}`,
    `Delivery Location: ${quote.deliveryLocation || 'N/A'}`,
    '',
    'Quantity / Message:',
    quote.quantityMessage,
    '',
    `Submitted At: ${quote.submittedAt}`,
  ].join('\n')
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function createHtmlEmail(quote) {
  const safeMessage = escapeHtml(quote.quantityMessage).replace(/\n/g, '<br />')

  return `
    <h2>New Quote Request - Character Before Carrier Farms</h2>
    <p><strong>Name:</strong> ${escapeHtml(quote.name)}</p>
    <p><strong>Company:</strong> ${escapeHtml(quote.company) || 'N/A'}</p>
    <p><strong>Buyer Type:</strong> ${escapeHtml(quote.buyerType) || 'N/A'}</p>
    <p><strong>Email:</strong> ${escapeHtml(quote.email) || 'N/A'}</p>
    <p><strong>Phone:</strong> ${escapeHtml(quote.phone) || 'N/A'}</p>
    <p><strong>Product Interest:</strong> ${escapeHtml(quote.productInterest)}</p>
    <p><strong>Delivery Location:</strong> ${escapeHtml(quote.deliveryLocation) || 'N/A'}</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(quote.submittedAt)}</p>
    <hr />
    <p><strong>Quantity / Message</strong></p>
    <p>${safeMessage}</p>
  `
}

function getQuoteTableInstructions() {
  return [
    'Create the `quote_requests` table in Supabase before sending requests.',
    'Run SQL from `supabase/quote_requests.sql` in your Supabase SQL editor.',
  ]
}

export async function POST(request) {
  try {
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

    const validation = validatePayload(payload)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please correct the highlighted fields.',
          errors: validation.errors,
        },
        { status: 422 },
      )
    }

    const missingEnvVars = getMissingEnvVars()

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'configuration_missing',
          message: 'Quote service is not configured yet.',
          missingEnvVars,
          developerInstructions: getDeveloperInstructionsForMissingEnv(missingEnvVars),
        },
        { status: 503 },
      )
    }

    const submittedAt = new Date().toISOString()

    const quote = {
      ...validation.normalized,
      submittedAt,
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
        },
      },
    )

    const resend = new Resend(process.env.RESEND_API_KEY)

    const dbInsertPromise = supabase
      .from('quote_requests')
      .insert([
        {
          name: quote.name,
          company: quote.company || null,
          buyer_type: quote.buyerType || null,
          email: quote.email || null,
          phone: quote.phone || null,
          product_interest: quote.productInterest,
          delivery_location: quote.deliveryLocation || null,
          quantity_message: quote.quantityMessage,
          submitted_at: quote.submittedAt,
        },
      ])
      .select('id')
      .single()

    const emailSendPromise = resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL || 'Character Before Carrier Farms <onboarding@resend.dev>',
      to: ['richardafriyie22@gmail.com'],
      replyTo: quote.email || undefined,
      subject: `New Quote Request: ${quote.productInterest}`,
      text: createPlainTextEmail(quote),
      html: createHtmlEmail(quote),
    })

    const [dbResult, emailResult] = await Promise.all([dbInsertPromise, emailSendPromise])

    if (dbResult.error) {
      throw new Error(`SUPABASE_INSERT_FAILED: ${dbResult.error.message}`)
    }

    if (emailResult.error) {
      throw new Error(`RESEND_SEND_FAILED: ${emailResult.error.message}`)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Quote request submitted successfully.',
        quoteId: dbResult.data?.id || null,
        whatsappLink:
          'https://wa.me/233242728984?text=Hello%20Character%20Before%20Carrier%20Farms%2C%20I%20just%20submitted%20a%20quote%20request.',
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown quote submission error'

    if (errorMessage.includes('SUPABASE_INSERT_FAILED')) {
      const missingTable =
        errorMessage.includes('relation "quote_requests" does not exist') ||
        errorMessage.includes('Could not find the table')

      return NextResponse.json(
        {
          success: false,
          message: missingTable
            ? 'Supabase is connected, but `quote_requests` table is missing.'
            : 'Could not store quote request in Supabase.',
          developerInstructions: missingTable ? getQuoteTableInstructions() : [],
        },
        { status: 500 },
      )
    }

    if (errorMessage.includes('RESEND_SEND_FAILED')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Quote request was received but email notification failed.',
          developerInstructions: [
            'Check `RESEND_API_KEY` and sender domain setup in Resend.',
            'For testing, use onboarding@resend.dev as sender in `QUOTE_FROM_EMAIL`.',
          ],
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected server error while submitting quote request.',
      },
      { status: 500 },
    )
  }
}
