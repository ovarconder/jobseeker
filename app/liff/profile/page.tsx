'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { TRANSIT_LINES, parseTransitLineColors, serializeTransitLineColors } from '@/lib/transit-lines'

const JOB_TYPES = [
  { id: 'FULL_TIME', label: 'งานเต็มเวลา' },
  { id: 'PART_TIME', label: 'งาน part-time' },
  { id: 'CONTRACT', label: 'สัญญาจ้าง' },
  { id: 'INTERNSHIP', label: 'ฝึกงาน' },
] as const

declare global {
  interface Window {
    liff: any
  }
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [liffReady, setLiffReady] = useState(false)
  const [lineProfile, setLineProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    age: '',
    education: '',
    experience: '',
    skills: '',
    preferredArea: '',
    transitLineIds: [] as string[],
    preferredJobTypeIds: [] as string[],
    expectedSalaryMin: '',
    expectedSalaryMax: '',
  })

  useEffect(() => {
    // Initialize LIFF
    if (typeof window !== 'undefined' && window.liff) {
      window.liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' })
        .then(() => {
          setLiffReady(true)
          window.liff.getProfile().then((profile: any) => {
            setLineProfile(profile)
            fetchProfile(profile.userId)
          })
        })
        .catch((err: any) => {
          console.error('LIFF initialization failed', err)
        })
    }
  }, [])

  const fetchProfile = async (lineUserId: string) => {
    try {
      const res = await fetch(`/api/liff/profile?lineUserId=${lineUserId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          phone: data.phone || '',
          email: data.email || '',
          age: data.age?.toString() || '',
          education: data.education || '',
          experience: data.experience || '',
          skills: data.skills || '',
          preferredArea: data.preferredArea || '',
          transitLineIds: parseTransitLineColors(data.transitLineColors),
          preferredJobTypeIds: (() => {
            try {
              const arr = JSON.parse(data.preferredJobTypes || '[]')
              return Array.isArray(arr) ? arr : []
            } catch {
              return []
            }
          })(),
          expectedSalaryMin: data.expectedSalaryMin != null ? String(data.expectedSalaryMin) : '',
          expectedSalaryMax: data.expectedSalaryMax != null ? String(data.expectedSalaryMax) : '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/liff/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineUserId: lineProfile?.userId,
          phone: formData.phone,
          email: formData.email || '',
          age: formData.age ? parseInt(formData.age) : null,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
          preferredArea: formData.preferredArea || null,
          transitLineColors: formData.transitLineIds.length > 0 ? serializeTransitLineColors(formData.transitLineIds) : null,
          preferredJobTypes: formData.preferredJobTypeIds.length > 0 ? JSON.stringify(formData.preferredJobTypeIds) : null,
          expectedSalaryMin: formData.expectedSalaryMin !== '' ? parseInt(formData.expectedSalaryMin, 10) : null,
          expectedSalaryMax: formData.expectedSalaryMax !== '' ? parseInt(formData.expectedSalaryMax, 10) : null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Update failed')
      }

      toast({ title: 'อัปเดตโปรไฟล์สำเร็จ' })
      
      // Close LIFF window
      if (window.liff) {
        window.liff.closeWindow()
      }
    } catch (error: any) {
      toast({
        title: 'อัปเดตไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!liffReady || fetching) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>แก้ไขโปรไฟล์</CardTitle>
          <CardDescription>
            อัปเดตข้อมูลส่วนตัวของคุณ
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">ชื่อ</Label>
              <Input
                id="displayName"
                value={lineProfile?.displayName || ''}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">อายุ</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">การศึกษา</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">ประสบการณ์</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">ทักษะ</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredArea">พื้นที่ที่สนใจ / อยู่ใกล้</Label>
              <Input
                id="preferredArea"
                value={formData.preferredArea}
                onChange={(e) => setFormData({ ...formData, preferredArea: e.target.value })}
                placeholder="เช่น สุขุมวิท, พระราม 4, ลาดพร้าว"
              />
            </div>

            <div className="space-y-2">
              <Label>สาย BTS/MRT ที่เดินทางได้</Label>
              <div className="flex flex-wrap gap-2">
                {TRANSIT_LINES.map((line) => (
                  <label
                    key={line.id}
                    className="flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm has-[:checked]:ring-2 has-[:checked]:ring-offset-1"
                    style={{ borderColor: line.color }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.transitLineIds.includes(line.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...formData.transitLineIds, line.id]
                          : formData.transitLineIds.filter((id) => id !== line.id)
                        setFormData({ ...formData, transitLineIds: next })
                      }}
                      className="sr-only"
                    />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: line.color }} />
                    {line.label.replace(/ \(.*\)$/, '')}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>รูปแบบงานที่ต้องการ</Label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((jt) => (
                  <label key={jt.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.preferredJobTypeIds.includes(jt.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...formData.preferredJobTypeIds, jt.id]
                          : formData.preferredJobTypeIds.filter((id) => id !== jt.id)
                        setFormData({ ...formData, preferredJobTypeIds: next })
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    {jt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedSalaryMin">เงินเดือนขั้นต่ำที่ต้องการ (บาท)</Label>
                <Input
                  id="expectedSalaryMin"
                  type="number"
                  min={0}
                  value={formData.expectedSalaryMin}
                  onChange={(e) => setFormData({ ...formData, expectedSalaryMin: e.target.value })}
                  placeholder="เช่น 20000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedSalaryMax">เงินเดือนสูงสุดที่ยอมรับ (บาท)</Label>
                <Input
                  id="expectedSalaryMax"
                  type="number"
                  min={0}
                  value={formData.expectedSalaryMax}
                  onChange={(e) => setFormData({ ...formData, expectedSalaryMax: e.target.value })}
                  placeholder="เช่น 40000"
                />
              </div>
            </div>
          </CardContent>

          <div className="flex justify-end space-x-4 p-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังอัปเดต...' : 'อัปเดตโปรไฟล์'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
