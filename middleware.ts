import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const MAINTENANCE_MODE = true

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 준비중 모드
  if (MAINTENANCE_MODE &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as never)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const protectedPaths = ['/my', '/admin']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
