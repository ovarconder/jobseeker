'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, GraduationCap, DollarSign, MapPin, Phone, Mail } from 'lucide-react'

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'งานประจำ',
  PART_TIME: 'งาน part-time',
  CONTRACT: 'สัญญาจ้าง',
  INTERNSHIP: 'ฝึกงาน',
}

export default function SeekerPreviewPage() {
  const params = useParams()
  const [seeker, setSeeker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/seekers/${params.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then(setSeeker)
        .finally(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    )
  }

  if (!seeker) {
    return (
      <div className="p-8">
        <p className="text-gray-500">ไม่พบประวัติ</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/company/seekers">← กลับไปค้นหาประวัติ</Link>
        </Button>
      </div>
    )
  }

  const preferredJobTypes = (() => {
    try {
      const arr = JSON.parse(seeker.preferredJobTypes || '[]')
      return Array.isArray(arr) ? arr.map((t: string) => JOB_TYPE_LABELS[t] || t) : []
    } catch {
      return []
    }
  })()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-4 py-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/company/seekers">← กลับไปค้นหาประวัติ</Link>
        </Button>
        <h1 className="mt-2 text-2xl font-bold">Preview Resume</h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center pt-6">
                {seeker.pictureUrl ? (
                  <img
                    src={seeker.pictureUrl}
                    alt=""
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 text-3xl font-medium text-gray-500">
                    {seeker.displayName?.charAt(0) || '?'}
                  </div>
                )}
                <p className="mt-3 font-medium">{seeker.displayName}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  เงินเดือนที่ต้องการ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-lg font-medium">
                  {seeker.expectedSalaryMin != null || seeker.expectedSalaryMax != null
                    ? `${seeker.expectedSalaryMin?.toLocaleString() ?? '-'} - ${seeker.expectedSalaryMax?.toLocaleString() ?? '-'} บาท`
                    : '-'}
                </p>
              </CardContent>
            </Card>

            <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
              <p className="mb-3 text-sm text-gray-700">
                กรุณา ล็อคอิน เพื่อดูข้อมูลการติดต่อ เรซูเม่
              </p>
              <Button
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setShowContact(true)}
              >
                คลิก
              </Button>
              {showContact && (
                <div className="mt-3 space-y-1 border-t border-amber-200 pt-3 text-sm">
                  {seeker.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {seeker.phone}
                    </p>
                  )}
                  {seeker.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {seeker.email}
                    </p>
                  )}
                  {seeker.resumeUrl && (
                    <a
                      href={seeker.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-red-600 hover:underline"
                    >
                      ดาวน์โหลดเรซูเม่
                    </a>
                  )}
                  {!seeker.phone && !seeker.email && !seeker.resumeUrl && (
                    <p className="text-gray-500">ไม่มีข้อมูลการติดต่อ</p>
                  )}
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-red-600" />
                  งานที่ต้องการ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {seeker.skills && (
                  <p>
                    <span className="text-gray-500">สาขาอาชีพ/ทักษะ:</span> {seeker.skills}
                  </p>
                )}
                {seeker.preferredArea && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    พื้นที่ที่ต้องการทำงาน: {seeker.preferredArea}
                  </p>
                )}
                {preferredJobTypes.length > 0 && (
                  <p>
                    <span className="text-gray-500">รูปแบบงาน:</span> {preferredJobTypes.join(', ')}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-4 w-4 text-red-600" />
                  ประวัติการศึกษา
                </CardTitle>
              </CardHeader>
              <CardContent>
                {seeker.education ? (
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{seeker.education}</p>
                ) : (
                  <p className="text-sm text-gray-500">- ไม่ระบุ</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-red-600" />
                  ประวัติการทำงาน/ประสบการณ์
                </CardTitle>
              </CardHeader>
              <CardContent>
                {seeker.experience ? (
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{seeker.experience}</p>
                ) : (
                  <p className="text-sm text-gray-500">- ไม่ระบุ</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
