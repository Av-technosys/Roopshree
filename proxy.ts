import { NextResponse, type NextRequest } from 'next/server'
import { authCookieNames } from '@/lib/auth-token'

const protectedRoutes = ['/dashboard', '/admin']
const authRoutes = ['/auth']

function hasSessionCookie(request: NextRequest) {
  return Boolean(request.cookies.get(authCookieNames.refreshToken)?.value)
}

function startsWithRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  // const isLoggedIn = hasSessionCookie(request)

  // if (startsWithRoute(pathname, protectedRoutes) && !isLoggedIn) {
  //   const signInUrl = request.nextUrl.clone()
  //   signInUrl.pathname = '/auth'
  //   signInUrl.searchParams.set('callbackUrl', request.nextUrl.href)

  //   return NextResponse.redirect(signInUrl)
  // }

  // if (startsWithRoute(pathname, authRoutes) && isLoggedIn) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth'],
}
