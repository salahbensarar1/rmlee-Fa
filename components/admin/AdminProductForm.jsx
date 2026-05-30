import ProductPricingFields from '@/components/admin/ProductPricingFields'
import { parsePricePerKg } from '@/lib/product-pricing'

export default function AdminProductForm({
  action,
  submitLabel,
  categories,
  product = null,
}) {
  const parsedPrice = parsePricePerKg(product?.price_per_kg || '')

  const defaults = {
    id: product?.id || '',
    slug: product?.slug || '',
    name: product?.name || '',
    category: product?.category || categories[0] || '',
    shortDescription: product?.short_description || '',
    longDescription: product?.long_description || '',
    image: product?.image || '',
    legacyPricePerKg: parsedPrice.legacyPriceText,
    priceCurrency: parsedPrice.currency,
    priceAmount: parsedPrice.amount,
    priceUnit: parsedPrice.unit,
    priceOnRequest: parsedPrice.priceOnRequest,
    manualPriceText: parsedPrice.manualPriceText,
    minimumOrderQuantity: product?.minimum_order_quantity || '',
    packagingOptions: Array.isArray(product?.packaging_options)
      ? product.packaging_options.join('\n')
      : '',
    availability: product?.availability || '',
    certifications: Array.isArray(product?.certifications)
      ? product.certifications.join('\n')
      : '',
    supplyCapacity: product?.supply_capacity || '',
    suitableBuyers: Array.isArray(product?.suitable_buyers)
      ? product.suitable_buyers.join('\n')
      : '',
    featured: product?.featured || false,
    active: product?.active !== false,
  }

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="space-y-4 rounded-3xl border border-forest/10 bg-white p-6 shadow-soft"
    >
      {defaults.id && <input type="hidden" name="id" defaultValue={defaults.id} />}
      <input type="hidden" name="existingImage" defaultValue={defaults.image} />
      <input type="hidden" name="legacyPricePerKg" defaultValue={defaults.legacyPricePerKg} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Product Name</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaults.name}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Slug (optional)</span>
          <input
            type="text"
            name="slug"
            defaultValue={defaults.slug}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
            placeholder="auto-generated-from-name"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Category</span>
          <select
            name="category"
            required
            defaultValue={defaults.category}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-forest/10 bg-cream/60 p-4 text-sm">
          <p className="font-semibold text-charcoal">Product Image</p>
          <p className="mt-1 text-xs text-charcoal/70">
            Upload an image to Supabase Storage bucket <span className="font-semibold">product-images</span>.
          </p>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            className="mt-3 block w-full rounded-xl border border-forest/20 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
          <label className="mt-3 block text-sm">
            <span className="mb-2 block font-semibold text-charcoal">Optional Image URL Override</span>
            <input
              type="url"
              name="image"
              defaultValue={defaults.image}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
              placeholder="https://..."
            />
          </label>
          {defaults.image && (
            <p className="mt-2 break-all text-xs text-charcoal/70">
              Current image URL: {defaults.image}
            </p>
          )}
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">Short Description</span>
        <textarea
          name="shortDescription"
          rows={3}
          defaultValue={defaults.shortDescription}
          className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">Long Description</span>
        <textarea
          name="longDescription"
          rows={5}
          defaultValue={defaults.longDescription}
          className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProductPricingFields
          defaultCurrency={defaults.priceCurrency}
          defaultAmount={defaults.priceAmount}
          defaultUnit={defaults.priceUnit}
          defaultPriceOnRequest={defaults.priceOnRequest}
          defaultManualPriceText={defaults.manualPriceText}
        />

        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Minimum Order Quantity</span>
          <input
            type="text"
            name="minimumOrderQuantity"
            defaultValue={defaults.minimumOrderQuantity}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">Packaging Options (one per line)</span>
        <textarea
          name="packagingOptions"
          rows={4}
          defaultValue={defaults.packagingOptions}
          className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">Availability</span>
        <textarea
          name="availability"
          rows={2}
          defaultValue={defaults.availability}
          className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-charcoal">Certifications (one per line)</span>
        <textarea
          name="certifications"
          rows={4}
          defaultValue={defaults.certifications}
          className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Supply Capacity</span>
          <input
            type="text"
            name="supplyCapacity"
            defaultValue={defaults.supplyCapacity}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-semibold text-charcoal">Suitable Buyers (one per line)</span>
          <textarea
            name="suitableBuyers"
            rows={4}
            defaultValue={defaults.suitableBuyers}
            className="w-full rounded-xl border border-forest/20 px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/25"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaults.featured}
            className="h-4 w-4 rounded border-forest/20"
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaults.active}
            className="h-4 w-4 rounded border-forest/20"
          />
          Active
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-light"
      >
        {submitLabel}
      </button>
    </form>
  )
}
