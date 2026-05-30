'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminUser } from '@/lib/admin-auth'
import { buildPricePerKgText } from '@/lib/product-pricing'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getServiceSupabaseConfig } from '@/lib/supabase-config'

const PRODUCT_IMAGE_BUCKET = 'product-images'

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function parseStringArray(value) {
  return value
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean)
}

function booleanFromForm(formData, key) {
  return formData.get(key) === 'on'
}

function getUploadedFile(formData, key) {
  const file = formData.get(key)

  if (!file || typeof file === 'string') return null
  if (typeof file.arrayBuffer !== 'function') return null
  if (typeof file.size === 'number' && file.size <= 0) return null

  return file
}

function sanitizePathPart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function resolveFileExtension(file) {
  const fileName = String(file?.name || '')
  const fromName = fileName.includes('.') ? fileName.split('.').pop() : ''
  const fromType = String(file?.type || '').split('/').pop()
  const extension = sanitizePathPart(fromName || fromType || '')
  return extension || 'bin'
}

async function uploadProductImageIfProvided({ supabase, file, slug }) {
  if (!file) return null

  const mimeType = String(file.type || '')
  if (!mimeType.startsWith('image/')) {
    throw new Error('Image upload failed: file must be an image.')
  }

  const extension = resolveFileExtension(file)
  const safeSlug = sanitizePathPart(slug || 'product-image') || 'product-image'
  const path = `${safeSlug}/${Date.now()}-${crypto.randomUUID()}.${extension}`

  const fileBuffer = new Uint8Array(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, fileBuffer, {
      contentType: mimeType || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path)

  if (!publicUrlData?.publicUrl) {
    throw new Error('Image upload failed: public URL could not be generated.')
  }

  return publicUrlData.publicUrl
}

function normalizeProductInput(formData) {
  const name = formData.get('name')?.toString().trim() || ''
  const providedSlug = formData.get('slug')?.toString().trim() || ''
  const generatedSlug = toSlug(providedSlug || name)
  const manualImage = formData.get('image')?.toString().trim() || ''
  const existingImage = formData.get('existingImage')?.toString().trim() || ''
  const priceOnRequest = booleanFromForm(formData, 'priceOnRequest')
  const priceCurrency = formData.get('priceCurrency')?.toString().trim() || 'GHS'
  const priceAmount = formData.get('priceAmount')?.toString().trim() || ''
  const priceUnit = formData.get('priceUnit')?.toString().trim() || 'kg'
  const manualPriceText = formData.get('manualPriceText')?.toString().trim() || ''
  const legacyPricePerKg = formData.get('legacyPricePerKg')?.toString().trim() || ''
  const pricePerKg = buildPricePerKgText({
    priceOnRequest,
    currency: priceCurrency,
    amount: priceAmount,
    unit: priceUnit,
    manualPriceText,
    legacyPriceText: legacyPricePerKg,
  })

  return {
    slug: generatedSlug,
    name,
    category: formData.get('category')?.toString().trim() || '',
    short_description: formData.get('shortDescription')?.toString().trim() || null,
    long_description: formData.get('longDescription')?.toString().trim() || null,
    image: manualImage || existingImage || null,
    price_per_kg: pricePerKg,
    minimum_order_quantity:
      formData.get('minimumOrderQuantity')?.toString().trim() || null,
    packaging_options: parseStringArray(
      formData.get('packagingOptions')?.toString().trim() || '',
    ),
    availability: formData.get('availability')?.toString().trim() || null,
    certifications: parseStringArray(
      formData.get('certifications')?.toString().trim() || '',
    ),
    supply_capacity: formData.get('supplyCapacity')?.toString().trim() || null,
    suitable_buyers: parseStringArray(
      formData.get('suitableBuyers')?.toString().trim() || '',
    ),
    featured: booleanFromForm(formData, 'featured'),
    active: booleanFromForm(formData, 'active'),
  }
}

function revalidateProductPaths(slug) {
  revalidatePath('/products')
  revalidatePath('/admin/products')
  revalidatePath('/')

  if (slug) {
    revalidatePath(`/products/${slug}`)
  }
}

function toSafeErrorMessage(error, fallbackMessage) {
  const message =
    (error && typeof error === 'object' && 'message' in error && error.message) ||
    fallbackMessage

  if (!message) return ''

  return String(message)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240)
}

function redirectWithError(path, code, errorMessage = '') {
  const params = new URLSearchParams()
  params.set('error', code)

  if (errorMessage) {
    params.set('error_message', errorMessage)
  }

  redirect(`${path}?${params.toString()}`)
}

export async function createProductAction(formData) {
  await requireAdminUser()

  const config = getServiceSupabaseConfig()
  if (!config.isConfigured) {
    redirectWithError(
      '/admin/products/new',
      'config',
      `Missing environment variables: ${config.missing.join(', ')}`,
    )
  }

  const product = normalizeProductInput(formData)

  if (!product.name || !product.category || !product.slug) {
    redirectWithError('/admin/products/new', 'missing_fields')
  }

  let insertErrorMessage = ''

  try {
    const supabase = createSupabaseAdminClient()
    const imageFile = getUploadedFile(formData, 'imageFile')
    const uploadedImageUrl = await uploadProductImageIfProvided({
      supabase,
      file: imageFile,
      slug: product.slug,
    })

    const { error } = await supabase.from('products').insert([
      {
        ...product,
        image: uploadedImageUrl || product.image,
      },
    ])
    if (error) {
      insertErrorMessage = toSafeErrorMessage(error, 'Could not create product.')
    }
  } catch (error) {
    insertErrorMessage = toSafeErrorMessage(error, 'Could not create product.')
  }

  if (insertErrorMessage) {
    redirectWithError('/admin/products/new', 'create_failed', insertErrorMessage)
  }

  revalidateProductPaths(product.slug)
  redirect('/admin/products?success=created')
}

export async function updateProductAction(formData) {
  await requireAdminUser()

  const config = getServiceSupabaseConfig()
  if (!config.isConfigured) {
    redirectWithError(
      '/admin/products',
      'config',
      `Missing environment variables: ${config.missing.join(', ')}`,
    )
  }

  const id = formData.get('id')?.toString().trim() || ''

  if (!id) {
    redirectWithError('/admin/products', 'invalid_id')
  }

  const product = normalizeProductInput(formData)

  if (!product.name || !product.category || !product.slug) {
    redirectWithError(`/admin/products/${id}/edit`, 'missing_fields')
  }

  let updateErrorMessage = ''

  try {
    const supabase = createSupabaseAdminClient()
    const imageFile = getUploadedFile(formData, 'imageFile')
    const uploadedImageUrl = await uploadProductImageIfProvided({
      supabase,
      file: imageFile,
      slug: product.slug,
    })
    const { error } = await supabase
      .from('products')
      .update({
        ...product,
        image: uploadedImageUrl || product.image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      updateErrorMessage = toSafeErrorMessage(error, 'Could not update product.')
    }
  } catch (error) {
    updateErrorMessage = toSafeErrorMessage(error, 'Could not update product.')
  }

  if (updateErrorMessage) {
    redirectWithError(
      `/admin/products/${id}/edit`,
      'update_failed',
      updateErrorMessage,
    )
  }

  revalidateProductPaths(product.slug)
  redirect('/admin/products?success=updated')
}

export async function deleteProductAction(formData) {
  await requireAdminUser()

  const config = getServiceSupabaseConfig()
  if (!config.isConfigured) {
    redirectWithError(
      '/admin/products',
      'config',
      `Missing environment variables: ${config.missing.join(', ')}`,
    )
  }

  const id = formData.get('id')?.toString().trim() || ''

  if (!id) {
    redirectWithError('/admin/products', 'invalid_id')
  }

  let deleteErrorMessage = ''
  let existingSlug = ''

  try {
    const supabase = createSupabaseAdminClient()

    const { data: existing } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single()

    existingSlug = existing?.slug || ''

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      deleteErrorMessage = toSafeErrorMessage(error, 'Could not delete product.')
    }
  } catch (error) {
    deleteErrorMessage = toSafeErrorMessage(error, 'Could not delete product.')
  }

  if (deleteErrorMessage) {
    redirectWithError('/admin/products', 'delete_failed', deleteErrorMessage)
  }

  revalidateProductPaths(existingSlug)
  redirect('/admin/products?success=deleted')
}

export async function toggleProductActiveAction(formData) {
  await requireAdminUser()

  const config = getServiceSupabaseConfig()
  if (!config.isConfigured) {
    redirectWithError(
      '/admin/products',
      'config',
      `Missing environment variables: ${config.missing.join(', ')}`,
    )
  }

  const id = formData.get('id')?.toString().trim() || ''
  const nextActiveRaw = formData.get('nextActive')?.toString().trim() || ''

  if (!id) {
    redirectWithError('/admin/products', 'invalid_id')
  }

  if (!['true', 'false'].includes(nextActiveRaw)) {
    redirectWithError('/admin/products', 'invalid_state')
  }

  const nextActive = nextActiveRaw === 'true'
  let updateErrorMessage = ''
  let existingSlug = ''

  try {
    const supabase = createSupabaseAdminClient()

    const { data: existing } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single()

    existingSlug = existing?.slug || ''

    const { error } = await supabase
      .from('products')
      .update({
        active: nextActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      updateErrorMessage = toSafeErrorMessage(
        error,
        nextActive ? 'Could not activate product.' : 'Could not deactivate product.',
      )
    }
  } catch (error) {
    updateErrorMessage = toSafeErrorMessage(
      error,
      nextActive ? 'Could not activate product.' : 'Could not deactivate product.',
    )
  }

  if (updateErrorMessage) {
    redirectWithError('/admin/products', 'active_toggle_failed', updateErrorMessage)
  }

  revalidateProductPaths(existingSlug)
  redirect(`/admin/products?success=${nextActive ? 'activated' : 'deactivated'}`)
}
