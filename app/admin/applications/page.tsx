'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Application {
  id: string
  status: string
  needsMoreInfo: boolean
  additionalSkills?: string
  preferredLocations?: string
  adminNotes?: string
  createdAt: string
  job: {
    id: string
    title: string
    company: {
      name: string
    }
  }
  seeker: {
    id: string
    displayName: string
    phone?: string
    email?: string
    isElderly: boolean
  }
}

export default function ApplicationsPage() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'needsInfo'>('needsInfo')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    additionalSkills: '',
    preferredLocations: '',
    adminNotes: '',
  })

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      const url = filter === 'needsInfo' 
        ? '/api/applications?needsMoreInfo=true'
        : '/api/applications'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch applications')
      const data = await res.json()
      setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (app: Application) => {
    setSelectedApp(app)
    setFormData({
      additionalSkills: app.additionalSkills || '',
      preferredLocations: app.preferredLocations || '',
      adminNotes: app.adminNotes || '',
    })
    setDialogOpen(true)
  }

  const handleUpdateApplication = async () => {
    if (!selectedApp) return

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/additional-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          additionalSkills: formData.additionalSkills,
          preferredLocations: formData.preferredLocations,
          adminNotes: formData.adminNotes,
          needsMoreInfo: false, // Mark as completed after updating
        }),
      })

      if (!res.ok) throw new Error('Failed to update application')

      toast({ title: 'อัปเดตข้อมูลสำเร็จ' })
      setDialogOpen(false)
      fetchApplications()
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'default',
      REVIEWING: 'secondary',
      ACCEPTED: 'default',
      REJECTED: 'destructive',
    }
    const labels: Record<string, string> = {
      PENDING: 'รอตรวจสอบ',
      REVIEWING: 'กำลังพิจารณา',
      ACCEPTED: 'รับแล้ว',
      REJECTED: 'ปฏิเสธ',
    }
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">จัดการใบสมัครงาน</h1>
        <p className="mt-2 text-gray-600">ดูและจัดการใบสมัครงานทั้งหมด</p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === 'needsInfo' ? 'default' : 'outline'}
          onClick={() => setFilter('needsInfo')}
        >
          ต้องการข้อมูลเพิ่มเติม ({applications.filter(a => a.needsMoreInfo).length})
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          ทั้งหมด
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'needsInfo' ? 'ใบสมัครที่ต้องการข้อมูลเพิ่มเติม' : 'ใบสมัครทั้งหมด'}
          </CardTitle>
          <CardDescription>
            {filter === 'needsInfo' 
              ? 'ติดต่อผู้สมัครเพื่อขอข้อมูลเพิ่มเติม เช่น ทักษะที่ถนัด, พื้นที่ที่สามารถทำงานได้'
              : 'รายการใบสมัครงานทั้งหมด'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {filter === 'needsInfo' 
                ? 'ไม่มีใบสมัครที่ต้องการข้อมูลเพิ่มเติม' 
                : 'ไม่มีใบสมัครงาน'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้สมัคร</TableHead>
                  <TableHead>งาน</TableHead>
                  <TableHead>บริษัท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สมัคร</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.seeker.displayName}</div>
                        {app.seeker.isElderly && (
                          <Badge variant="outline" className="mt-1">ผู้สูงอายุ</Badge>
                        )}
                        {app.seeker.phone && (
                          <div className="text-sm text-gray-500">{app.seeker.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{app.job.title}</TableCell>
                    <TableCell>{app.job.company.name}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      {app.needsMoreInfo ? (
                        <Dialog open={dialogOpen && selectedApp?.id === app.id} onOpenChange={(open) => {
                          if (!open) setDialogOpen(false)
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(app)}
                            >
                              อัปเดตข้อมูล
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>อัปเดตข้อมูลผู้สมัคร</DialogTitle>
                              <DialogDescription>
                                กรอกข้อมูลเพิ่มเติมที่ได้จากการติดต่อผู้สมัคร
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>ผู้สมัคร</Label>
                                <div className="text-sm">
                                  <div className="font-medium">{app.seeker.displayName}</div>
                                  {app.seeker.phone && <div>โทร: {app.seeker.phone}</div>}
                                  {app.seeker.email && <div>อีเมล: {app.seeker.email}</div>}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="additionalSkills">ทักษะที่ถนัด</Label>
                                <Textarea
                                  id="additionalSkills"
                                  value={formData.additionalSkills}
                                  onChange={(e) =>
                                    setFormData({ ...formData, additionalSkills: e.target.value })
                                  }
                                  placeholder="เช่น Microsoft Office, การสื่อสาร, ภาษาอังกฤษ"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="preferredLocations">พื้นที่ที่สามารถทำงานได้</Label>
                                <Textarea
                                  id="preferredLocations"
                                  value={formData.preferredLocations}
                                  onChange={(e) =>
                                    setFormData({ ...formData, preferredLocations: e.target.value })
                                  }
                                  placeholder="เช่น กรุงเทพ, สมุทรปราการ, นนทบุรี"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="adminNotes">หมายเหตุ</Label>
                                <Textarea
                                  id="adminNotes"
                                  value={formData.adminNotes}
                                  onChange={(e) =>
                                    setFormData({ ...formData, adminNotes: e.target.value })
                                  }
                                  placeholder="บันทึกข้อมูลเพิ่มเติมจากการติดต่อ"
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setDialogOpen(false)}
                                >
                                  ยกเลิก
                                </Button>
                                <Button onClick={handleUpdateApplication}>
                                  บันทึกข้อมูล
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-sm text-gray-500">ครบถ้วน</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
