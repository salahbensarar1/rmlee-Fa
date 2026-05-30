'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildReplyTemplate, REPLY_TEMPLATE_TYPES } from '@/lib/quote-request-utils'

const TEMPLATE_LABELS = {
  accept_quote_available: 'Accept / quote available',
  need_more_details: 'Need more details',
  refuse_unavailable: 'Refuse / unavailable',
  custom_message: 'Custom message',
}

export default function QuoteReplyForm({ quoteRequest }) {
  const router = useRouter()
  const [templateType, setTemplateType] = useState('accept_quote_available')

  const initialTemplate = useMemo(
    () => buildReplyTemplate({ templateType: 'accept_quote_available', quoteRequest }),
    [quoteRequest],
  )

  const [subject, setSubject] = useState(initialTemplate.subject)
  const [body, setBody] = useState(initialTemplate.body)
  const [status, setStatus] = useState(initialTemplate.suggestedStatus)
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState(null)

  const applyTemplate = nextTemplateType => {
    setTemplateType(nextTemplateType)

    const template = buildReplyTemplate({
      templateType: nextTemplateType,
      quoteRequest,
    })

    setSubject(template.subject)
    setBody(template.body)
    setStatus(template.suggestedStatus)
  }

  const handleSend = async event => {
    event.preventDefault()

    if (!subject.trim() || !body.trim()) {
      setResult({ type: 'error', message: 'Subject and message are required.' })
      return
    }

    if (!quoteRequest.email) {
      setResult({ type: 'error', message: 'Buyer email is missing. Cannot send reply email.' })
      return
    }

    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/quote-requests/${quoteRequest.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateType,
          subject,
          body,
          status,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        setResult({
          type: 'error',
          message: payload.message || 'Could not send reply email.',
        })
        return
      }

      setResult({
        type: 'success',
        message: 'Reply email sent and quote request updated.',
      })

      router.refresh()
    } catch (_error) {
      setResult({ type: 'error', message: 'Network error while sending reply.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <article className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft sm:p-7">
      <h2 className="font-serif text-3xl text-charcoal">Reply to Buyer</h2>
      <p className="mt-2 text-sm text-charcoal/70">
        Use a template, customize the message, and send the email through Resend.
      </p>
      <p className="mt-2 text-xs text-charcoal/60">
        Testing note: with <span className="font-semibold">onboarding@resend.dev</span>, Resend test mode only sends to your verified account email unless you verify a domain.
      </p>

      {result && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            result.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSend} className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Template</span>
          <select
            value={templateType}
            onChange={event => applyTemplate(event.target.value)}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            {REPLY_TEMPLATE_TYPES.map(type => (
              <option key={type} value={type}>
                {TEMPLATE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={event => setSubject(event.target.value)}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Reply body</span>
          <textarea
            value={body}
            onChange={event => setBody(event.target.value)}
            rows={10}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Status after reply</span>
          <select
            value={status}
            onChange={event => setStatus(event.target.value)}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            <option value="new">new</option>
            <option value="reviewing">reviewing</option>
            <option value="accepted">accepted</option>
            <option value="refused">refused</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSending}
          className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Sending Reply...' : 'Send Reply Email'}
        </button>
      </form>
    </article>
  )
}
