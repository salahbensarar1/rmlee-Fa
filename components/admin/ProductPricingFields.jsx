'use client'

import { useState } from 'react'
import {
  SUPPORTED_PRICE_CURRENCIES,
  SUPPORTED_PRICE_UNITS,
} from '@/lib/product-pricing'

export default function ProductPricingFields({
  defaultCurrency = 'GHS',
  defaultAmount = '',
  defaultUnit = 'kg',
  defaultPriceOnRequest = false,
  defaultManualPriceText = '',
}) {
  const [priceOnRequest, setPriceOnRequest] = useState(Boolean(defaultPriceOnRequest))

  return (
    <section className="space-y-4 rounded-2xl border border-forest/10 bg-cream/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-charcoal">Pricing</p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="priceOnRequest"
            defaultChecked={defaultPriceOnRequest}
            onChange={event => setPriceOnRequest(event.target.checked)}
            className="h-4 w-4 rounded border-forest/20"
          />
          Price on request
        </label>
      </div>

      {priceOnRequest && (
        <p className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs font-semibold text-forest">
          Price on request
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Currency</span>
          <select
            name="priceCurrency"
            defaultValue={defaultCurrency}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            {SUPPORTED_PRICE_CURRENCIES.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Price</span>
          <input
            type="number"
            min="0"
            step="0.01"
            name="priceAmount"
            defaultValue={defaultAmount}
            disabled={priceOnRequest}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25 disabled:cursor-not-allowed disabled:bg-charcoal/5"
            placeholder="0.00"
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Unit</span>
          <select
            name="priceUnit"
            defaultValue={defaultUnit}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            {SUPPORTED_PRICE_UNITS.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">
          Manual Price Text (Optional Advanced Override)
        </span>
        <input
          type="text"
          name="manualPriceText"
          defaultValue={defaultManualPriceText}
          className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          placeholder="e.g. Contract pricing based on volume"
        />
      </label>
    </section>
  )
}
