'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
    requirements: '',
    forElderly: false,
    expiresAt: '',
  })

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch job')
      const job = await res.json()
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary || '',
        jobType: job.jobType,
        requirements: job.requirements || '',
        forElderly: job.forElderly || false,
        expiresAt: job.expiresAt ? new Date(job.expiresAt).toISOString().split('T')[0] : '',
      })
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update job')
      }

      toast({ title: 'อัปเดตงานสำเร็จ' })
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

  if (fetching) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">แก้ไขงาน</h1>
        <p className="mt-2 text-gray-600">แก้ไขข้อมูลงาน</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>ข้อมูลงาน</CardTitle>
          <CardDescription>แก้ไขข้อมูลงาน</CardDescription>
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
                <Label htmlFor="salary">เงินเดือน</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
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
              {loading ? 'กำลังอัปเดต...' : 'อัปเดตงาน'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
