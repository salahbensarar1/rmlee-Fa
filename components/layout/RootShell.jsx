'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function RootShell({ children }) {
  const pathname = usePathname() || ''
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return children
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
