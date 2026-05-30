import 'server-only'

const REQUIRED_ADMIN_ENV_VAR = 'ADMIN_USER_EMAILS'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function parseAdminUserEmails(rawValue = '') {
  return String(rawValue)
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean)
}

export function getAdminUsersConfig() {
  const raw = process.env.ADMIN_USER_EMAILS || ''
  const parsedEmails = parseAdminUserEmails(raw)
  const isConfigured = parsedEmails.length > 0

  if (!isConfigured) {
    return {
      isConfigured: false,
      missingEnvVars: [REQUIRED_ADMIN_ENV_VAR],
      parsedEmails: [],
    }
  }

  return {
    isConfigured: true,
    missingEnvVars: [],
    parsedEmails,
  }
}

export function isAdminEmailAllowed(email) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return false

  const config = getAdminUsersConfig()

  if (!config.isConfigured) {
    return false
  }

  return config.parsedEmails.includes(normalizedEmail)
}
