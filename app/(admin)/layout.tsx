'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin Panel
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                แดชบอร์ด
              </Link>
              <Link
                href="/admin/companies"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                บริษัท
              </Link>
              <Link
                href="/admin/jobs"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                งานทั้งหมด
              </Link>
              <Link
                href="/admin/applications"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ใบสมัครงาน
              </Link>
              <Link
                href="/admin/users"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ผู้ใช้
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{session.user.name}</span>
            <Button variant="outline" onClick={() => signOut()}>
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
