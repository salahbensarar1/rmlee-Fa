import PageHero from '@/components/PageHero'
import ProductCatalogue from '@/components/catalog/ProductCatalogue'
import { getAllCategories, getAllProducts } from '@/lib/products'

export const metadata = {
  title: 'Products | Character Before Carrier Farms',
  description:
    'Browse maize, grains, vegetables, poultry, eggs, livestock products, feeds, packaged foodstuffs, and advisory services from Character Before Carrier Farms.',
}

export default async function ProductsPage({ searchParams }) {
  const products = await getAllProducts({ activeOnly: true })
  const categories = await getAllCategories()

  const initialCategory =
    typeof searchParams?.category === 'string' ? searchParams.category : 'All Categories'
  const initialSearchTerm =
    typeof searchParams?.search === 'string' ? searchParams.search : ''

  return (
    <main>
      <PageHero
        eyebrow="B2B Product Catalogue"
        title="Source Commercial Farm Products with Confidence"
        description="Search and filter our supply portfolio by category, then request a quote with your required quantity and delivery needs."
      />
      <ProductCatalogue
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialSearchTerm={initialSearchTerm}
      />
    </main>
  )
}
