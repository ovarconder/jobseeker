'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, FileText, BarChart3, BookOpen, MapPin, Camera } from 'lucide-react'

export default function CompanyDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [credits, setCredits] = useState<{ creditsRemaining: number; currentPackageName: string | null }>({
    creditsRemaining: 0,
    currentPackageName: null,
  })
  const [stats, setStats] = useState({
    applicationsByApplicants: 0,
    savedApplications: 0,
    applicationViewHistory: 0,
    resumeMatching: 0,
    jobViews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [profileRes, creditsRes, statsRes] = await Promise.all([
        fetch('/api/company/profile'),
        fetch('/api/company/credits'),
        fetch('/api/company/stats'),
      ])
      if (profileRes.ok) setProfile(await profileRes.json())
      if (creditsRes.ok) setCredits(await creditsRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const lastLogin = profile?.user?.lastLoginAt
    ? new Date(profile.user.lastLoginAt).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">แนะนำการใช้งาน</h1>
        <p className="text-sm text-gray-600">
          เข้าสู่ระบบล่าสุด {lastLogin}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: ข้อมูลบริษัท + แพ็คเกจ */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ข้อมูลบริษัท</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8">
                {profile?.logo ? (
                  <Image
                    src={profile.logo}
                    alt="Logo"
                    width={160}
                    height={160}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Camera className="h-12 w-12" />
                    <span className="text-center text-sm">Logo 626 x 626 pixel</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                  <Link href="/company/profile">สร้าง/แก้ไขข้อมูล</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/company/profile/view">ดูโปรไฟล์</Link>
                </Button>
              </div>
              {profile?.name && (
                <div className="flex items-start gap-2 text-sm">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                  <span>{profile.name}</span>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                  <span>{profile.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">ข้อมูลแพ็คเกจ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                แพ็คเกจปัจจุบัน : <strong>{credits.currentPackageName || '-'}</strong>
              </p>
              <ul className="list-inside list-disc text-sm text-gray-600">
                <li>สั่งซื้อแพ็คเกจ</li>
              </ul>
              <p className="text-sm text-gray-600">
                ใช้งานสะดวก เพียงจ่ายผ่านเครดิต
                <br />
                คงเหลือ <strong>{credits.creditsRemaining} เครดิต</strong>
              </p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/company/packages">สั่งซื้อ</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Right: ฟังก์ชันจัดการ + ใบสมัคร + สถิติ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-5 w-5 text-red-600" />
                ฟังก์ชันจัดการตำแหน่งงาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/company/jobs/new">ประกาศงาน</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/company/jobs">อัปเดต/แก้ไขตำแหน่งงาน</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/company/seekers">ค้นหาประวัติ</Link>
                </Button>
                <Button variant="secondary" size="lg" disabled>
                  คู่มือการใช้งาน
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-red-600" />
                การเปิดดู และคัดเลือกผู้สมัครในตำแหน่งงานของคุณ และการดูใบสมัครงานที่ปกปิด
              </CardTitle>
              <CardDescription>
                จัดการข้อมูลใบสมัครงาน (iCMS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button variant="link" asChild className="p-0">
                  <Link href="/company/applications">ดูทั้งหมด &gt;</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/company/applications" className="flex w-full items-center justify-between">
                    <span className="text-left">ใบสมัครโดยผู้สมัคร</span>
                    <span className="text-2xl font-bold">{stats.applicationsByApplicants}</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/company/applications?saved=1" className="flex w-full items-center justify-between">
                    <span className="text-left">ใบสมัครที่บันทึก</span>
                    <span className="text-2xl font-bold">{stats.savedApplications}</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/company/applications?viewHistory=1" className="flex w-full items-center justify-between">
                    <span className="text-left">ประวัติการเปิดใบสมัคร</span>
                    <span className="text-2xl font-bold">{stats.applicationViewHistory}</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/company/seekers" className="flex w-full items-center justify-between">
                    <span className="text-left">Resume Matching</span>
                    <span className="text-2xl font-bold">{stats.resumeMatching}</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-red-600" />
                การดูรายงานสถิติการสมัครงาน การเปิดดูตำแหน่งงานของคุณ
              </CardTitle>
              <CardDescription>
                รายงานสถิติ ประจําเดือน {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled>
                  ดาวน์โหลด
                </Button>
                <Button variant="link" size="sm" className="p-0" disabled>
                  ดูสถิติทั้งหมด &gt;
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">จำนวนการสมัครงาน</p>
                    <p className="text-2xl font-bold">{stats.applicationsByApplicants}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">จำนวนเปิดดูตำแหน่งงาน</p>
                    <p className="text-2xl font-bold">{stats.jobViews}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600">จำนวนการเปิดใบสมัคร</p>
                    <p className="text-2xl font-bold">{stats.applicationViewHistory}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
