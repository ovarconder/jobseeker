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
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
                Super Admin
              </Link>
              <div className="flex items-center gap-1">
                {/* ——— ส่วนของคนสมัคร (ผู้หางาน) ——— */}
                <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  ส่วนของคนสมัคร
                </span>
                <span className="text-gray-300">|</span>
                <Link
                  href="/"
                  className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  หน้าหางาน
                </Link>
                <span className="text-gray-300">|</span>
                {/* ——— ส่วนของแอดมินบริษัท ——— */}
                <span className="ml-2 mr-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  แอดมินบริษัท
                </span>
                <Link
                  href="/company/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  แดชบอร์ดบริษัท
                </Link>
                <Link
                  href="/company/jobs"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  งานของบริษัท
                </Link>
                <Link
                  href="/company/applications"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ใบสมัคร
                </Link>
                <Link
                  href="/company/seekers"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ค้นหาประวัติ
                </Link>
                <Link
                  href="/company/packages"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  แพ็คเกจ
                </Link>
                <Link
                  href="/company/profile"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  โปรไฟล์บริษัท
                </Link>
                <span className="text-gray-300">|</span>
                {/* ——— ส่วนของแอดมินใหญ่ ——— */}
                <span className="ml-2 mr-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  แอดมินใหญ่
                </span>
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  แดชบอร์ด
                </Link>
                <Link
                  href="/admin/companies"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  บริษัทที่สมัคร
                </Link>
                <Link
                  href="/admin/jobs"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  งานทั้งหมด
                </Link>
                <Link
                  href="/admin/applications"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ใบสมัครงาน
                </Link>
                <Link
                  href="/admin/applications?filter=interview"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  สถานะสัมภาษณ์
                </Link>
                <Link
                  href="/admin/packages"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  แพ็คเกจราคา
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  ผู้ใช้
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{session.user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
