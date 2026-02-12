'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, User, FileText } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'ยังไม่เปิดดู',
  OPENED: 'เปิดอ่านแล้ว',
  REVIEWING: 'กำลังพิจารณา',
  INTERVIEW_SCHEDULED: 'นัดสัมภาษณ์',
  ACCEPTED: 'ผ่านการประเมิน',
  REJECTED: 'ไม่ผ่านการประเมิน',
  WITHDRAWN: 'ถอนการสมัคร',
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  OPENED: 'outline',
  REVIEWING: 'secondary',
  INTERVIEW_SCHEDULED: 'outline',
  ACCEPTED: 'default',
  REJECTED: 'destructive',
  WITHDRAWN: 'outline',
}

const CHANNEL_LABELS: Record<string, string> = {
  SELF_APPLIED: 'ส่งใบสมัครเอง',
  HR_SAVED: 'HR กดบันทึก',
}

export default function ApplicantManagementPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [jobFilter, setJobFilter] = useState<string>('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, jobFilter])

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?status=ACTIVE')
      const data = await res.json()
      setJobs(Array.isArray(data) ? data.map((j: { id: string; title: string }) => ({ id: j.id, title: j.title })) : [])
    } catch {
      setJobs([])
    }
  }

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (jobFilter !== 'all') params.set('jobId', jobFilter)
      const res = await fetch(`/api/applications?${params.toString()}`)
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear() + 543
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applicant Management</h1>
        <p className="mt-2 text-gray-600">
          จัดการใบสมัคร / ผู้สมัครเข้าตำแหน่งทั้งหมดที่องค์กรออกประกาศใน Job Posting
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">ตำแหน่ง:</span>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="ทุกตำแหน่ง" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกตำแหน่ง</SelectItem>
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">สถานะ:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="PENDING">ยังไม่เปิดดู</SelectItem>
                <SelectItem value="OPENED">เปิดอ่านแล้ว</SelectItem>
                <SelectItem value="REVIEWING">กำลังพิจารณา</SelectItem>
                <SelectItem value="INTERVIEW_SCHEDULED">นัดสัมภาษณ์</SelectItem>
                <SelectItem value="ACCEPTED">ผ่านการประเมิน</SelectItem>
                <SelectItem value="REJECTED">ไม่ผ่านการประเมิน</SelectItem>
                <SelectItem value="WITHDRAWN">ถอนการสมัคร</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800 hover:bg-slate-800">
                <TableHead className="w-16 text-white">ลำดับที่</TableHead>
                <TableHead className="text-white">ชื่อ-นามสกุล</TableHead>
                <TableHead className="text-white">ตำแหน่ง</TableHead>
                <TableHead className="text-white">วันที่สมัคร</TableHead>
                <TableHead className="text-white">ช่องทางการสมัคร</TableHead>
                <TableHead className="text-white">ดูโปรไฟล์</TableHead>
                <TableHead className="text-white">ดาวน์โหลด Resume</TableHead>
                <TableHead className="text-white">สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    ไม่พบใบสมัคร
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    className={index % 2 === 1 ? 'bg-slate-50' : ''}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{app.seeker?.displayName || 'ไม่ระบุ'}</TableCell>
                    <TableCell>{app.job?.title || '-'}</TableCell>
                    <TableCell>{formatDate(app.createdAt)}</TableCell>
                    <TableCell>
                      {CHANNEL_LABELS[app.applicationChannel || 'SELF_APPLIED'] ?? app.applicationChannel ?? 'ส่งใบสมัครเอง'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={app.seeker?.id ? `/company/seekers/${app.seeker.id}` : `/company/applications/${app.id}`}
                          className="inline-flex items-center gap-1"
                        >
                          <User className="h-4 w-4" />
                          Click
                        </Link>
                      </Button>
                      <span className="text-gray-400 text-xs ml-1">|</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/company/applications/${app.id}`}>
                          แก้ไขสถานะ
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {app.seeker?.resumeUrl ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={app.seeker.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[app.status] ?? 'secondary'}>
                        {STATUS_LABELS[app.status] ?? app.status}
                      </Badge>
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
