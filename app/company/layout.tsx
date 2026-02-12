'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'COMPANY') {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading' || !session) {
    return <div>Loading...</div>
  }

  if (session.user.status === 'PENDING') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">รอการอนุมัติ</h1>
          <p className="mt-2 text-gray-600">
            บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-8">
            <Link href="/company/dashboard" className="text-xl font-bold">
              Job Matching
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/company/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                แดชบอร์ด
              </Link>
              <Link
                href="/company/jobs"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                งานทั้งหมด
              </Link>
              <Link
                href="/company/applications"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Applicant Management
              </Link>
              <Link
                href="/company/seekers"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                ดูเรซูเม่
              </Link>
              <Link
                href="/company/packages"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                แพ็คเกจ
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
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
