import 'server-only'

const REQUIRED_DEVELOPER_ENV_VAR = 'DEVELOPER_USER_EMAILS'

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function parseDeveloperUserEmails(rawValue = '') {
  return String(rawValue)
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean)
}

export function getDeveloperUsersConfig() {
  const raw = process.env.DEVELOPER_USER_EMAILS || ''
  const parsedEmails = parseDeveloperUserEmails(raw)
  const isConfigured = parsedEmails.length > 0

  if (!isConfigured) {
    return {
      isConfigured: false,
      missingEnvVars: [REQUIRED_DEVELOPER_ENV_VAR],
      parsedEmails: [],
    }
  }

  return {
    isConfigured: true,
    missingEnvVars: [],
    parsedEmails,
  }
}

export function isDeveloperEmailAllowed(email) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return false

  const config = getDeveloperUsersConfig()

  if (!config.isConfigured) {
    return false
  }

  return config.parsedEmails.includes(normalizedEmail)
}
