'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [])

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch application')
      const data = await res.json()
      setApplication(data)
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      toast({ title: 'อัปเดตสถานะสำเร็จ' })
      fetchApplication()
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setUpdating(false)
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

  if (!application) {
    return <div className="p-8">ไม่พบใบสมัคร</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← กลับ
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลผู้สมัคร</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">ชื่อ</p>
              <p className="font-medium">{application.seeker?.displayName || 'ไม่ระบุ'}</p>
            </div>
            {application.seeker?.email && (
              <div>
                <p className="text-sm text-gray-600">อีเมล</p>
                <p className="font-medium">{application.seeker.email}</p>
              </div>
            )}
            {application.seeker?.phone && (
              <div>
                <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                <p className="font-medium">{application.seeker.phone}</p>
              </div>
            )}
            {application.seeker?.resumeUrl && (
              <div>
                <p className="text-sm text-gray-600">เรซูเม่</p>
                <Button variant="outline" asChild>
                  <a href={application.seeker.resumeUrl} target="_blank" rel="noopener noreferrer">
                    ดาวน์โหลด
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลงาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">ตำแหน่ง</p>
              <p className="font-medium">{application.job?.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">บริษัท</p>
              <p className="font-medium">{application.job?.company?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">สถานะ</p>
              {getStatusBadge(application.status)}
            </div>
            <div>
              <p className="text-sm text-gray-600">วันที่สมัคร</p>
              <p className="font-medium">
                {new Date(application.createdAt).toLocaleDateString('th-TH')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {application.coverLetter && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>จดหมายสมัครงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{application.coverLetter}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>การจัดการ</CardTitle>
          <CardDescription>อัปเดตสถานะใบสมัคร</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => updateStatus('REVIEWING')}
              disabled={updating || application.status === 'REVIEWING'}
            >
              กำลังพิจารณา
            </Button>
            <Button
              variant="default"
              onClick={() => updateStatus('ACCEPTED')}
              disabled={updating || application.status === 'ACCEPTED'}
            >
              รับเข้าทำงาน
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus('REJECTED')}
              disabled={updating || application.status === 'REJECTED'}
            >
              ปฏิเสธ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
