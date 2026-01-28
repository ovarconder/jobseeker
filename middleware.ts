import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Company routes
    if (path.startsWith('/company')) {
      if (token?.role !== 'COMPANY') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public routes
        if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/liff') || path.startsWith('/api/line')) {
          return true
        }

        // Protected routes require token
        if (path.startsWith('/admin') || path.startsWith('/company')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/company/:path*'],
}
