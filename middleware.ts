import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = await auth()

  // Public routes
  if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/liff') || path.startsWith('/api/line')) {
    return NextResponse.next()
  }

  // Protected routes
  if (path.startsWith('/admin') || path.startsWith('/company')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Admin routes
    if (path.startsWith('/admin')) {
      if (session.user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Company routes
    if (path.startsWith('/company')) {
      if (session.user?.role !== 'COMPANY') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/company/:path*'],
}
