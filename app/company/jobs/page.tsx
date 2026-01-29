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
import { useToast } from '@/components/ui/use-toast'

export default function JobsPage() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchJobs()
  }, [statusFilter])

  const fetchJobs = async () => {
    try {
      const url = statusFilter === 'all' 
        ? '/api/jobs' 
        : `/api/jobs?status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?')) return

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'ลบงานสำเร็จ' })
        fetchJobs()
      }
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    }
  }

  const handleToggleStatus = async (job: any) => {
    const newStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        toast({ title: 'อัปเดตสถานะสำเร็จ' })
        fetchJobs()
      }
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: 'secondary',
      ACTIVE: 'success',
      CLOSED: 'default',
      REJECTED: 'destructive',
    }
    const labels: Record<string, string> = {
      PENDING: 'รออนุมัติ',
      ACTIVE: 'เปิดรับ',
      CLOSED: 'ปิดรับ',
      REJECTED: 'ปฏิเสธ',
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">งานทั้งหมด</h1>
          <p className="mt-2 text-gray-600">จัดการงานที่โพสต์</p>
        </div>
        <Button asChild>
          <Link href="/company/jobs/new">โพสต์งานใหม่</Link>
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder="ค้นหาชื่องาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="PENDING">รออนุมัติ</SelectItem>
                <SelectItem value="ACTIVE">เปิดรับ</SelectItem>
                <SelectItem value="CLOSED">ปิดรับ</SelectItem>
                <SelectItem value="REJECTED">ปฏิเสธ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จำนวนใบสมัคร</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    ไม่พบงาน
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{job._count?.applications || 0}</TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/company/jobs/${job.id}/edit`}>แก้ไข</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(job)}
                        >
                          {job.status === 'ACTIVE' ? 'ปิดรับ' : 'เปิดรับ'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                        >
                          ลบ
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/company/applications?jobId=${job.id}`}>
                            ดูใบสมัคร
                          </Link>
                        </Button>
                      </div>
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
