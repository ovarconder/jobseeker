'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export default function AdminJobsPage() {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      toast({ title: 'อัปเดตสถานะสำเร็จ' })
      fetchJobs()
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

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">จัดการงานทั้งหมด</h1>
        <p className="mt-2 text-gray-600">อนุมัติและจัดการงาน</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่องาน</TableHead>
                <TableHead>บริษัท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จำนวนใบสมัคร</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    ไม่พบงาน
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company?.name}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{job._count?.applications || 0}</TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {job.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateJobStatus(job.id, 'ACTIVE')}
                            >
                              อนุมัติ
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateJobStatus(job.id, 'REJECTED')}
                            >
                              ปฏิเสธ
                            </Button>
                          </>
                        )}
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
