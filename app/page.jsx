import Hero from '@/components/Hero'
import Products from '@/components/Products'
import ExportProcess from '@/components/ExportProcess'
import Quality from '@/components/Quality'
import Stats from '@/components/Stats'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Products />
      <ExportProcess />
      <Quality />
      <Stats />
      <Contact />
    </main>
  )
}
