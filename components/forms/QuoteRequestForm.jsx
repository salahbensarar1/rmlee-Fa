'use client'

import { useMemo, useState } from 'react'

const buyerTypes = [
  'Wholesale Distributor',
  'Supermarket',
  'Hotel',
  'Restaurant',
  'School / Feeding System',
  'Feed Mill',
  'Processing Mill',
  'Other Institutional Buyer',
]

function buildInitialFormState(initialProductInterest = '') {
  return {
    name: '',
    company: '',
    buyerType: '',
    email: '',
    phone: '',
    productInterest: initialProductInterest,
    deliveryLocation: '',
    quantityMessage: '',
  }
}

function normalizeProductOptions(productOptions) {
  const unique = new Map()

  for (const option of productOptions) {
    if (typeof option === 'string') {
      const value = option.trim()
      if (!value || unique.has(value)) continue
      unique.set(value, { value, label: value })
      continue
    }

    if (!option || typeof option !== 'object') continue

    const value = String(option.value || option.name || '').trim()
    const label = String(option.label || option.name || value).trim()

    if (!value || !label || unique.has(value)) continue

    unique.set(value, { value, label })
  }

  return Array.from(unique.values())
}

export default function QuoteRequestForm({
  productOptions = [],
  initialProductInterest = '',
}) {
  const normalizedProductOptions = useMemo(
    () => normalizeProductOptions(productOptions),
    [productOptions],
  )

  const initialState = useMemo(
    () => buildInitialFormState(initialProductInterest),
    [initialProductInterest],
  )

  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleChange = event => {
    const { name, value } = event.target

    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name] || errors.contactMethod) {
      setErrors(prev => ({ ...prev, [name]: '', contactMethod: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) nextErrors.name = 'Name is required.'
    if (!formData.productInterest.trim()) nextErrors.productInterest = 'Product interest is required.'
    if (!formData.quantityMessage.trim()) nextErrors.quantityMessage = 'Quantity or message is required.'

    const hasEmail = formData.email.trim().length > 0
    const hasPhone = formData.phone.trim().length > 0

    if (!hasEmail && !hasPhone) {
      nextErrors.contactMethod = 'Provide at least one contact method: email or phone.'
    }

    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = await response.json()

      if (!response.ok) {
        const isConfigMissing = payload?.error === 'configuration_missing'
        const missingEnvVars = Array.isArray(payload?.missingEnvVars)
          ? payload.missingEnvVars
          : []

        const configMessage =
          isConfigMissing && missingEnvVars.length > 0
            ? `Quote service is not configured on the server. Missing environment variables: ${missingEnvVars.join(', ')}. Add them in Vercel Project Settings \u2192 Environment Variables, then redeploy.`
            : null

        setResult({
          type: 'error',
          message:
            configMessage ||
            payload.message ||
            'We could not submit your request right now. Please try again or contact us directly.',
          developerInstructions: payload.developerInstructions || [],
        })
        return
      }

      setResult({
        type: 'success',
        message: 'Quote request submitted successfully. Our team will contact you shortly.',
        whatsappLink:
          payload.whatsappLink ||
          'https://wa.me/233242728984?text=Hello%20Character%20Before%20Carrier%20Farms%2C%20I%20just%20submitted%20a%20quote%20request.',
      })
      setFormData(initialState)
      setErrors({})
    } catch (_error) {
      setResult({
        type: 'error',
        message: 'Network error while submitting your request. Please try again shortly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-forest/15 bg-white p-6 shadow-soft sm:p-8">
      {result?.type === 'success' && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">{result.message}</p>
          <a
            href={result.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            Continue on WhatsApp (+233 24 272 8984)
          </a>
        </div>
      )}

      {result?.type === 'error' && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">{result.message}</p>
          {result.developerInstructions?.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {result.developerInstructions.map(instruction => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Name *</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25 ${
                errors.name ? 'border-red-300' : 'border-forest/20'
              }`}
              placeholder="Your full name"
            />
            {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Company</span>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="Company name"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25 ${
                errors.email ? 'border-red-300' : 'border-forest/20'
              }`}
              placeholder="name@company.com"
            />
            {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="+233..."
            />
          </label>
        </div>

        {errors.contactMethod && (
          <p className="text-xs font-medium text-red-600">{errors.contactMethod}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Buyer type</span>
            <select
              name="buyerType"
              value={formData.buyerType}
              onChange={handleChange}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
            >
              <option value="">Select buyer type</option>
              {buyerTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Delivery location</span>
            <input
              type="text"
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleChange}
              className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="City / region"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Product interest *</span>
          <select
            name="productInterest"
            value={formData.productInterest}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25 ${
              errors.productInterest ? 'border-red-300' : 'border-forest/20'
            }`}
          >
            <option value="">Select product or category</option>
            {normalizedProductOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.productInterest && <span className="mt-1 block text-xs text-red-600">{errors.productInterest}</span>}
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Quantity / message *</span>
          <textarea
            name="quantityMessage"
            value={formData.quantityMessage}
            onChange={handleChange}
            rows={5}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-charcoal placeholder-charcoal/45 focus:outline-none focus:ring-2 focus:ring-forest/25 ${
              errors.quantityMessage ? 'border-red-300' : 'border-forest/20'
            }`}
            placeholder="Tell us your quantity, frequency, packaging, and timeline."
          />
          {errors.quantityMessage && (
            <span className="mt-1 block text-xs text-red-600">{errors.quantityMessage}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting Request...' : 'Send Request'}
        </button>
      </form>
    </div>
  )
}
