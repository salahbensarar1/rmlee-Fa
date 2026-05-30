import 'server-only'

import { Resend } from 'resend'
import { getAdminUsersConfig } from '@/lib/admin-users'
import { getDeveloperUsersConfig } from '@/lib/developer-users'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getPublicSupabaseConfig, getServiceSupabaseConfig } from '@/lib/supabase-config'

const PRODUCT_IMAGES_BUCKET = 'product-images'

const TRACKED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'QUOTE_FROM_EMAIL',
  'QUOTE_TO_EMAIL',
  'TEST_EMAIL_OVERRIDE',
  'ADMIN_USER_EMAILS',
  'DEVELOPER_USER_EMAILS',
]

function isEnvConfigured(name) {
  return String(process.env[name] || '').trim().length > 0
}

function getCurrentEnvironment() {
  return process.env.NODE_ENV || 'development'
}

function normalizeErrorMessage(error, fallback = 'Unknown error') {
  const message =
    (error && typeof error === 'object' && 'message' in error && error.message) ||
    fallback

  return String(message).replace(/\s+/g, ' ').trim().slice(0, 240)
}

async function testTableRead(supabase, tableName) {
  try {
    const { error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        passed: false,
        dbResponded: true,
        detail: `Read failed: ${error.message}`,
      }
    }

    return {
      passed: true,
      dbResponded: true,
      detail:
        typeof count === 'number'
          ? `Read successful (rows: ${count}).`
          : 'Read successful.',
    }
  } catch (error) {
    return {
      passed: false,
      dbResponded: false,
      detail: `Read failed: ${normalizeErrorMessage(error)}`,
    }
  }
}

async function testProductImagesBucket(supabase) {
  try {
    const { data, error } = await supabase.storage.getBucket(PRODUCT_IMAGES_BUCKET)

    if (error) {
      return {
        passed: false,
        detail: `Bucket check failed: ${error.message}`,
      }
    }

    if (!data || data.id !== PRODUCT_IMAGES_BUCKET) {
      return {
        passed: false,
        detail: 'Bucket check failed: product-images bucket was not found.',
      }
    }

    return {
      passed: true,
      detail: 'Bucket exists and is reachable.',
    }
  } catch (error) {
    return {
      passed: false,
      detail: `Bucket check failed: ${normalizeErrorMessage(error)}`,
    }
  }
}

async function testResendConfiguration() {
  if (!isEnvConfigured('RESEND_API_KEY')) {
    return {
      passed: false,
      detail: 'RESEND_API_KEY is not configured.',
    }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.domains.list()

    if (result?.error) {
      return {
        passed: false,
        detail: `Resend API check failed: ${result.error.message}`,
      }
    }

    const domainCount = Array.isArray(result?.data) ? result.data.length : 0

    return {
      passed: true,
      detail: `Resend API reachable (domains listed: ${domainCount}).`,
    }
  } catch (error) {
    return {
      passed: false,
      detail: `Resend API check failed: ${normalizeErrorMessage(error)}`,
    }
  }
}

export function getDeveloperSettingsOverview() {
  return TRACKED_ENV_VARS.map(name => ({
    name,
    configured: isEnvConfigured(name),
  }))
}

export function getDeveloperAdminUsersOverview() {
  const adminUsersConfig = getAdminUsersConfig()
  const developerUsersConfig = getDeveloperUsersConfig()

  return {
    adminUsersConfig,
    developerUsersConfig,
  }
}

export async function getDeveloperSystemHealthData() {
  const publicConfig = getPublicSupabaseConfig()
  const serviceConfig = getServiceSupabaseConfig()

  const checks = {
    databaseConnection: {
      passed: false,
      detail: serviceConfig.isConfigured
        ? 'Database test did not run yet.'
        : `Missing environment variables: ${serviceConfig.missing.join(', ')}`,
    },
    productsTable: {
      passed: false,
      detail: serviceConfig.isConfigured
        ? 'Products table test did not run yet.'
        : `Missing environment variables: ${serviceConfig.missing.join(', ')}`,
    },
    quoteRequestsTable: {
      passed: false,
      detail: serviceConfig.isConfigured
        ? 'Quote requests table test did not run yet.'
        : `Missing environment variables: ${serviceConfig.missing.join(', ')}`,
    },
    productImagesBucket: {
      passed: false,
      detail: serviceConfig.isConfigured
        ? 'Storage bucket test did not run yet.'
        : `Missing environment variables: ${serviceConfig.missing.join(', ')}`,
    },
    resend: await testResendConfiguration(),
  }

  if (serviceConfig.isConfigured) {
    try {
      const supabase = createSupabaseAdminClient()

      const [productsTable, quoteRequestsTable, productImagesBucket] = await Promise.all([
        testTableRead(supabase, 'products'),
        testTableRead(supabase, 'quote_requests'),
        testProductImagesBucket(supabase),
      ])

      checks.productsTable = {
        passed: productsTable.passed,
        detail: productsTable.detail,
      }

      checks.quoteRequestsTable = {
        passed: quoteRequestsTable.passed,
        detail: quoteRequestsTable.detail,
      }

      checks.productImagesBucket = {
        passed: productImagesBucket.passed,
        detail: productImagesBucket.detail,
      }

      checks.databaseConnection = {
        passed: Boolean(productsTable.dbResponded || quoteRequestsTable.dbResponded),
        detail:
          productsTable.dbResponded || quoteRequestsTable.dbResponded
            ? 'Database responded to at least one table read operation.'
            : 'Database did not respond to table read operations.',
      }
    } catch (error) {
      const safeMessage = normalizeErrorMessage(error)

      checks.databaseConnection = {
        passed: false,
        detail: `Database connection failed: ${safeMessage}`,
      }

      checks.productsTable = {
        passed: false,
        detail: `Products table check failed: ${safeMessage}`,
      }

      checks.quoteRequestsTable = {
        passed: false,
        detail: `Quote requests table check failed: ${safeMessage}`,
      }

      checks.productImagesBucket = {
        passed: false,
        detail: `Storage bucket check failed: ${safeMessage}`,
      }
    }
  }

  return {
    environment: getCurrentEnvironment(),
    env: {
      supabaseUrlConfigured: isEnvConfigured('SUPABASE_URL'),
      supabaseAnonKeyConfigured: isEnvConfigured('SUPABASE_ANON_KEY'),
      supabaseServiceRoleConfigured: isEnvConfigured('SUPABASE_SERVICE_ROLE_KEY'),
      resendConfigured: isEnvConfigured('RESEND_API_KEY'),
      quoteFromEmailConfigured: isEnvConfigured('QUOTE_FROM_EMAIL'),
      quoteToEmailConfigured: isEnvConfigured('QUOTE_TO_EMAIL'),
      testEmailOverrideConfigured: isEnvConfigured('TEST_EMAIL_OVERRIDE'),
      publicSupabaseConfigured: publicConfig.isConfigured,
      serviceSupabaseConfigured: serviceConfig.isConfigured,
    },
    checks,
  }
}

export async function getDeveloperDashboardData() {
  const health = await getDeveloperSystemHealthData()

  return {
    environment: health.environment,
    supabaseUrlConfigured: health.env.supabaseUrlConfigured,
    supabaseAnonKeyConfigured: health.env.supabaseAnonKeyConfigured,
    supabaseServiceRoleConfigured: health.env.supabaseServiceRoleConfigured,
    resendConfigured: health.env.resendConfigured,
    quoteFromEmailConfigured: health.env.quoteFromEmailConfigured,
    quoteToEmailConfigured: health.env.quoteToEmailConfigured,
    testEmailOverrideConfigured: health.env.testEmailOverrideConfigured,
    productImagesBucketReachable: health.checks.productImagesBucket.passed,
    productsTableReachable: health.checks.productsTable.passed,
    quoteRequestsTableReachable: health.checks.quoteRequestsTable.passed,
  }
}
