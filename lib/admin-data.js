import 'server-only'

import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getServiceSupabaseConfig } from '@/lib/supabase-config'
import { normalizeStatus } from '@/lib/quote-request-utils'

function missingConfigResponse() {
  const config = getServiceSupabaseConfig()
  return {
    isConfigured: config.isConfigured,
    missingEnvVars: config.missing,
  }
}

export async function getAdminDashboardData() {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    return {
      ...missingConfigResponse(),
      stats: null,
      recentQuoteRequests: [],
    }
  }

  try {
    const supabase = createSupabaseAdminClient()

    const [
      totalQuotesResult,
      newQuotesResult,
      activeProductsResult,
      allProductsResult,
      recentQuotesResult,
    ] = await Promise.all([
      supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new'),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('quote_requests')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(8),
    ])

    return {
      isConfigured: true,
      missingEnvVars: [],
      stats: {
        totalQuotes: totalQuotesResult.count || 0,
        newQuotes: newQuotesResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        totalProducts: allProductsResult.count || 0,
      },
      recentQuoteRequests: (recentQuotesResult.data || []).map(item => ({
        ...item,
        status: normalizeStatus(item.status),
      })),
    }
  } catch (error) {
    return {
      ...missingConfigResponse(),
      runtimeError: error instanceof Error ? error.message : 'Unknown admin dashboard error',
      stats: null,
      recentQuoteRequests: [],
    }
  }
}

export async function getAdminProducts() {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    return {
      ...missingConfigResponse(),
      products: [],
    }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      return {
        isConfigured: true,
        missingEnvVars: [],
        runtimeError: error.message,
        products: [],
      }
    }

    return {
      isConfigured: true,
      missingEnvVars: [],
      products: data || [],
    }
  } catch (error) {
    return {
      ...missingConfigResponse(),
      runtimeError: error instanceof Error ? error.message : 'Unknown products query error',
      products: [],
    }
  }
}

export async function getAdminProductById(id) {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    return {
      ...missingConfigResponse(),
      product: null,
    }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return {
        isConfigured: true,
        missingEnvVars: [],
        runtimeError: error.message,
        product: null,
      }
    }

    return {
      isConfigured: true,
      missingEnvVars: [],
      product: data,
    }
  } catch (error) {
    return {
      ...missingConfigResponse(),
      runtimeError: error instanceof Error ? error.message : 'Unknown product query error',
      product: null,
    }
  }
}

export async function getAdminQuoteRequests() {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    return {
      ...missingConfigResponse(),
      quoteRequests: [],
    }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      return {
        isConfigured: true,
        missingEnvVars: [],
        runtimeError: error.message,
        quoteRequests: [],
      }
    }

    return {
      isConfigured: true,
      missingEnvVars: [],
      quoteRequests: (data || []).map(item => ({
        ...item,
        status: normalizeStatus(item.status),
      })),
    }
  } catch (error) {
    return {
      ...missingConfigResponse(),
      runtimeError: error instanceof Error ? error.message : 'Unknown quote request query error',
      quoteRequests: [],
    }
  }
}

export async function getAdminQuoteRequestById(id) {
  const config = getServiceSupabaseConfig()

  if (!config.isConfigured) {
    return {
      ...missingConfigResponse(),
      quoteRequest: null,
    }
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return {
        isConfigured: true,
        missingEnvVars: [],
        runtimeError: error.message,
        quoteRequest: null,
      }
    }

    return {
      isConfigured: true,
      missingEnvVars: [],
      quoteRequest: {
        ...data,
        status: normalizeStatus(data.status),
      },
    }
  } catch (error) {
    return {
      ...missingConfigResponse(),
      runtimeError: error instanceof Error ? error.message : 'Unknown quote request detail query error',
      quoteRequest: null,
    }
  }
}
