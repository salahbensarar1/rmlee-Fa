'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function RootShell({ children }) {
  const pathname = usePathname() || ''
  const isAdminRoute = pathname.startsWith('/admin')
  const isDeveloperRoute = pathname.startsWith('/developer')

  if (isAdminRoute || isDeveloperRoute) {
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
