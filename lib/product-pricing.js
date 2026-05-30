const SUPPORTED_PRICE_CURRENCIES = ['GHS', 'USD', 'EUR', 'GBP']
const SUPPORTED_PRICE_UNITS = ['kg', 'ton', 'bag', 'crate', 'carton', 'piece']

function normalizeText(value) {
  return String(value || '').trim()
}

function normalizeCurrency(value) {
  const raw = normalizeText(value).toUpperCase()
  return SUPPORTED_PRICE_CURRENCIES.includes(raw) ? raw : 'GHS'
}

function normalizeUnit(value) {
  const raw = normalizeText(value).toLowerCase()
  return SUPPORTED_PRICE_UNITS.includes(raw) ? raw : 'kg'
}

function normalizeAmount(value) {
  const raw = normalizeText(value).replace(',', '.')
  const parsed = Number(raw)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return ''
  }

  return String(Number(parsed.toFixed(2)))
}

export function parsePricePerKg(rawPricePerKg) {
  const legacyPriceText = normalizeText(rawPricePerKg)

  if (!legacyPriceText) {
    return {
      currency: 'GHS',
      amount: '',
      unit: 'kg',
      priceOnRequest: false,
      manualPriceText: '',
      legacyPriceText: '',
    }
  }

  if (/^price\s+on\s+request$/i.test(legacyPriceText)) {
    return {
      currency: 'GHS',
      amount: '',
      unit: 'kg',
      priceOnRequest: true,
      manualPriceText: '',
      legacyPriceText,
    }
  }

  const structuredMatch = legacyPriceText.match(
    /^(GHS|USD|EUR|GBP)\s*([0-9]+(?:[.,][0-9]+)?)\s*\/\s*(kg|ton|bag|crate|carton|piece)$/i,
  )

  if (structuredMatch) {
    return {
      currency: normalizeCurrency(structuredMatch[1]),
      amount: normalizeAmount(structuredMatch[2]),
      unit: normalizeUnit(structuredMatch[3]),
      priceOnRequest: false,
      manualPriceText: '',
      legacyPriceText,
    }
  }

  if (/^[0-9]+(?:[.,][0-9]+)?$/.test(legacyPriceText)) {
    return {
      currency: 'GHS',
      amount: normalizeAmount(legacyPriceText),
      unit: 'kg',
      priceOnRequest: false,
      manualPriceText: '',
      legacyPriceText,
    }
  }

  return {
    currency: 'GHS',
    amount: '',
    unit: 'kg',
    priceOnRequest: false,
    manualPriceText: legacyPriceText,
    legacyPriceText,
  }
}

export function buildPricePerKgText({
  priceOnRequest,
  currency,
  amount,
  unit,
  manualPriceText,
  legacyPriceText,
}) {
  if (priceOnRequest) {
    return 'Price on request'
  }

  const manual = normalizeText(manualPriceText)
  if (manual) {
    return manual
  }

  const normalizedAmount = normalizeAmount(amount)

  if (normalizedAmount) {
    return `${normalizeCurrency(currency)} ${normalizedAmount} / ${normalizeUnit(unit)}`
  }

  const legacy = normalizeText(legacyPriceText)
  return legacy || null
}

export { SUPPORTED_PRICE_CURRENCIES, SUPPORTED_PRICE_UNITS }
