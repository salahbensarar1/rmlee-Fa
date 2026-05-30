export const QUOTE_REQUEST_STATUSES = [
  'new',
  'reviewing',
  'accepted',
  'refused',
  'completed',
]

export function isValidQuoteRequestStatus(status) {
  return QUOTE_REQUEST_STATUSES.includes(status)
}

export function normalizeStatus(status) {
  if (!status) return 'new'
  const normalized = String(status).trim().toLowerCase()
  return isValidQuoteRequestStatus(normalized) ? normalized : 'new'
}

export function prettifyStatus(status) {
  const normalized = normalizeStatus(status)
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export const REPLY_TEMPLATE_TYPES = [
  'accept_quote_available',
  'need_more_details',
  'refuse_unavailable',
  'custom_message',
]

export function buildReplyTemplate({ templateType, quoteRequest }) {
  const buyerName = quoteRequest.name || 'Valued Buyer'
  const productInterest = quoteRequest.product_interest || quoteRequest.productInterest || 'your requested product'
  const companyName = quoteRequest.company || 'your company'
  const quantityMessage = quoteRequest.quantity_message || quoteRequest.quantityMessage || 'Not specified'

  const sharedContext = [
    `Buyer Name: ${buyerName}`,
    `Company: ${companyName}`,
    `Product Interest: ${productInterest}`,
    `Quantity / Message: ${quantityMessage}`,
    '',
    'Business Contact Information:',
    'Character Before Carrier Farms',
    'Greater Accra, Ghana',
    'WhatsApp: +233 24 272 8984',
    'Email: Business inbox (configured in QUOTE_TO_EMAIL)',
  ].join('\n')

  if (templateType === 'accept_quote_available') {
    return {
      subject: `Quote Available: ${productInterest}`,
      body: [
        `Dear ${buyerName},`,
        '',
        `Thank you for your interest in ${productInterest}. We are pleased to confirm availability and we can proceed with a formal quote for your requested volume.`,
        '',
        'Please reply with your preferred delivery schedule and packaging specification so we can finalize pricing and dispatch terms.',
        '',
        sharedContext,
      ].join('\n'),
      suggestedStatus: 'accepted',
    }
  }

  if (templateType === 'need_more_details') {
    return {
      subject: `More Details Needed: ${productInterest}`,
      body: [
        `Dear ${buyerName},`,
        '',
        `Thank you for your request for ${productInterest}. To prepare an accurate quote, we need a few additional details.`,
        '',
        'Please share your required delivery timeline, packaging format, and destination location.',
        '',
        sharedContext,
      ].join('\n'),
      suggestedStatus: 'reviewing',
    }
  }

  if (templateType === 'refuse_unavailable') {
    return {
      subject: `Supply Update: ${productInterest}`,
      body: [
        `Dear ${buyerName},`,
        '',
        `Thank you for your request for ${productInterest}. At this time, we are unable to fulfill this order under the requested terms.`,
        '',
        'If you are open to alternatives (quantity, timeline, or product variant), we can recommend the closest available supply option.',
        '',
        sharedContext,
      ].join('\n'),
      suggestedStatus: 'refused',
    }
  }

  return {
    subject: `Reply to Your Quote Request: ${productInterest}`,
    body: [
      `Dear ${buyerName},`,
      '',
      'Thank you for contacting Character Before Carrier Farms. Please find our response below.',
      '',
      sharedContext,
    ].join('\n'),
    suggestedStatus: 'reviewing',
  }
}
