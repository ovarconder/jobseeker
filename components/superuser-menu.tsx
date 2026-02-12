'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, LayoutDashboard } from 'lucide-react'

export function SuperuserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-emerald-700"
        >
          <LayoutDashboard className="h-4 w-4" />
          เมนู Superuser
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <>
            <div className="absolute bottom-full right-0 mb-1 w-72 rounded-lg border bg-white py-2 shadow-xl">
              <div className="border-b px-3 py-1.5 text-xs font-semibold uppercase text-amber-600">
                ส่วนของคนสมัคร
              </div>
              <Link
                href="/"
                className="block px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                หน้าหางาน
              </Link>
              <div className="border-b px-3 py-1.5 text-xs font-semibold uppercase text-blue-600">
                แอดมินบริษัท
              </div>
              <Link href="/company/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>แดชบอร์ดบริษัท</Link>
              <Link href="/company/jobs" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>งานของบริษัท</Link>
              <Link href="/company/applications" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>ใบสมัคร</Link>
              <Link href="/company/seekers" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>ค้นหาประวัติ</Link>
              <Link href="/company/packages" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>แพ็คเกจ</Link>
              <Link href="/company/profile" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>โปรไฟล์บริษัท</Link>
              <div className="border-b px-3 py-1.5 text-xs font-semibold uppercase text-emerald-600">
                แอดมินใหญ่
              </div>
              <Link href="/admin/dashboard" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>แดชบอร์ดแอดมิน</Link>
              <Link href="/admin/companies" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>บริษัทที่สมัคร</Link>
              <Link href="/admin/jobs" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>งานทั้งหมด</Link>
              <Link href="/admin/applications" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>ใบสมัครงาน</Link>
              <Link href="/admin/applications?filter=interview" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>สถานะสัมภาษณ์</Link>
              <Link href="/admin/packages" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>แพ็คเกจราคา</Link>
              <Link href="/admin/users" className="block px-3 py-2 text-sm hover:bg-gray-100" onClick={() => setOpen(false)}>ผู้ใช้</Link>
            </div>
            <button
              type="button"
              className="fixed inset-0"
              aria-label="ปิดเมนู"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  )
}
