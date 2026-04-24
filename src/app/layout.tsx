import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartSidebar } from '@/components/shop/CartSidebar'
import { SITE } from '@/constants/site'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { default: `ISKINZ — ${SITE.tagline}`, template: '%s | ISKINZ' },
  description: SITE.description,
  keywords: ['아이스킨즈', 'ISKINZ', '메디컬 에스테틱', '스킨부스터', 'Fillmed', '의료기기', 'B2B'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE.url,
    siteName: 'ISKINZ',
    title: `ISKINZ — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: SITE.url },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let isApproved = false
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .single()
      isApproved = profile?.approved === true
    }
  } catch {}
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
      </head>
      <body style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif" }}>
        <Navbar isApproved={isApproved} />
        <CartSidebar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
