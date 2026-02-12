'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { TRANSIT_LINES, serializeTransitLineColors } from '@/lib/transit-lines'

export default function NewJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    salaryMin: '' as string | number,
    salaryMax: '' as string | number,
    jobType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
    requirements: '',
    forElderly: false,
    transitLineIds: [] as string[],
    expiresAt: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin !== '' ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax !== '' ? Number(formData.salaryMax) : null,
        transitLineColors: formData.transitLineIds.length > 0 ? serializeTransitLineColors(formData.transitLineIds) : null,
      }
      delete (payload as any).transitLineIds
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create job')
      }

      toast({ title: 'สร้างงานสำเร็จ', description: 'รอการอนุมัติจากผู้ดูแลระบบ' })
      router.push('/company/jobs')
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">โพสต์งานใหม่</h1>
        <p className="mt-2 text-gray-600">กรอกข้อมูลงานที่ต้องการรับสมัคร</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>ข้อมูลงาน</CardTitle>
          <CardDescription>กรุณากรอกข้อมูลให้ครบถ้วน</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">ชื่องาน *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียดงาน *</Label>
              <Textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">สถานที่ *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">เงินเดือน (แสดงในประกาศ)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="เช่น 25,000 - 35,000 บาท"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">เงินเดือนขั้นต่ำ (บาท) สำหรับ match</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  min={0}
                  value={formData.salaryMin === '' ? '' : formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value === '' ? '' : e.target.value })}
                  placeholder="เช่น 25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">เงินเดือนสูงสุด (บาท) สำหรับ match</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  min={0}
                  value={formData.salaryMax === '' ? '' : formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value === '' ? '' : e.target.value })}
                  placeholder="เช่น 35000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>สาย BTS/MRT ใกล้บริษัท</Label>
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobType">ประเภทงาน *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">งานเต็มเวลา</SelectItem>
                    <SelectItem value="PART_TIME">งาน part-time</SelectItem>
                    <SelectItem value="CONTRACT">สัญญาจ้าง</SelectItem>
                    <SelectItem value="INTERNSHIP">ฝึกงาน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">วันหมดอายุ</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">คุณสมบัติ</Label>
              <Textarea
                id="requirements"
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="ระบุคุณสมบัติที่ต้องการ..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="forElderly"
                checked={formData.forElderly}
                onChange={(e) => setFormData({ ...formData, forElderly: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="forElderly" className="text-sm font-normal cursor-pointer">
                งานสำหรับผู้สูงอายุ (บริษัทต้องการรับผู้สูงอายุ)
              </Label>
            </div>
          </CardContent>

          <div className="flex justify-end space-x-4 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังสร้าง...' : 'สร้างงาน'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
