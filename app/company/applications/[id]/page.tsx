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
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [])

  const fetchApplication = async () => {
    try {
      const res = await fetch(`/api/applications/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch application')
      const data = await res.json()
      setApplication(data)
      setSaved(!!data.saved)
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async () => {
    if (!application?.id) return
    setSaving(true)
    try {
      if (saved) {
        await fetch(`/api/company/saved-applications/${application.id}`, { method: 'DELETE' })
        setSaved(false)
        toast({ title: 'ยกเลิกการบันทึกแล้ว' })
      } else {
        await fetch('/api/company/saved-applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: application.id }),
        })
        setSaved(true)
        toast({ title: 'บันทึกใบสมัครแล้ว' })
      }
    } catch {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setSaving(false)
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
      OPENED: 'outline',
      REVIEWING: 'secondary',
      INTERVIEW_SCHEDULED: 'warning',
      ACCEPTED: 'success',
      REJECTED: 'destructive',
      WITHDRAWN: 'outline',
    }
    const labels: Record<string, string> = {
      PENDING: 'รอพิจารณา',
      OPENED: 'เปิดอ่านแล้ว',
      REVIEWING: 'กำลังพิจารณา',
      INTERVIEW_SCHEDULED: 'นัดสัมภาษณ์',
      ACCEPTED: 'ผ่าน',
      REJECTED: 'ไม่ผ่าน',
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
          <CardDescription>อัปเดตสถานะใบสมัคร: เปิดอ่านแล้ว → นัดสัมภาษณ์ → ผ่าน/ไม่ผ่าน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={toggleSave}
            disabled={saving}
          >
            {saved ? 'ยกเลิกการบันทึก' : 'บันทึกใบสมัคร'}
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => updateStatus('OPENED')}
              disabled={updating || application.status === 'OPENED'}
            >
              เปิดอ่านแล้ว
            </Button>
            <Button
              variant="outline"
              onClick={() => updateStatus('INTERVIEW_SCHEDULED')}
              disabled={updating || application.status === 'INTERVIEW_SCHEDULED'}
            >
              นัดสัมภาษณ์
            </Button>
            <Button
              variant="default"
              onClick={() => updateStatus('ACCEPTED')}
              disabled={updating || application.status === 'ACCEPTED'}
            >
              ผ่าน
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus('REJECTED')}
              disabled={updating || application.status === 'REJECTED'}
            >
              ไม่ผ่าน
            </Button>
            {(application.status === 'PENDING' || application.status === 'REVIEWING') && (
              <Button
                variant="outline"
                onClick={() => updateStatus('REVIEWING')}
                disabled={updating || application.status === 'REVIEWING'}
              >
                กำลังพิจารณา
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
