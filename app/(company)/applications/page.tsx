'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const fetchApplications = async () => {
    try {
      const url = statusFilter === 'all' 
        ? '/api/applications' 
        : `/api/applications?status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
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
    const labels: Record<string, string> = {
      PENDING: 'รอพิจารณา',
      REVIEWING: 'กำลังพิจารณา',
      ACCEPTED: 'รับแล้ว',
      REJECTED: 'ปฏิเสธ',
      WITHDRAWN: 'ถอนการสมัคร',
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ใบสมัครทั้งหมด</h1>
        <p className="mt-2 text-gray-600">จัดการใบสมัครงาน</p>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="PENDING">รอพิจารณา</SelectItem>
              <SelectItem value="REVIEWING">กำลังพิจารณา</SelectItem>
              <SelectItem value="ACCEPTED">รับแล้ว</SelectItem>
              <SelectItem value="REJECTED">ปฏิเสธ</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

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
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    ไม่พบใบสมัคร
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
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
