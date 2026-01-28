'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CompanyDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [jobsRes, applicationsRes] = await Promise.all([
        fetch('/api/jobs?status=ACTIVE'),
        fetch('/api/applications'),
      ])

      const jobs = await jobsRes.json()
      const applications = await applicationsRes.json()

      const pendingApps = applications.filter((app: any) => 
        app.status === 'PENDING' || app.status === 'REVIEWING'
      )

      setStats({
        activeJobs: jobs.length,
        totalApplications: applications.length,
        pendingApplications: pendingApps.length,
      })

      setRecentApplications(applications.slice(0, 5))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: 'secondary',
      REVIEWING: 'warning',
      ACCEPTED: 'success',
      REJECTED: 'destructive',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
        <p className="mt-2 text-gray-600">ภาพรวมของงานและใบสมัคร</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>งานที่เปิดรับ</CardTitle>
            <CardDescription>จำนวนงานที่เปิดรับสมัคร</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ใบสมัครทั้งหมด</CardTitle>
            <CardDescription>จำนวนใบสมัครทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>รอพิจารณา</CardTitle>
            <CardDescription>ใบสมัครที่รอพิจารณา</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingApplications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">ใบสมัครล่าสุด</h2>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/company/jobs/new">โพสต์งานใหม่</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/company/applications">ดูทั้งหมด</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้สมัคร</TableHead>
                <TableHead>ตำแหน่ง</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    ไม่มีใบสมัคร
                  </TableCell>
                </TableRow>
              ) : (
                recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.seeker?.displayName || 'ไม่ระบุ'}</TableCell>
                    <TableCell>{app.job?.title}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/company/applications/${app.id}`}>ดูรายละเอียด</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
