'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type PackageItem = {
  id: string
  name: string
  description: string | null
  price: number | string
  creditsIncluded: number
  features: string | null
  isActive: boolean
  sortOrder: number
}

export default function AdminPackagesPage() {
  const { toast } = useToast()
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    creditsIncluded: '0',
    features: '',
    isActive: true,
    sortOrder: '0',
  })

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPackages(Array.isArray(data) ? data : [])
    } catch (e) {
      toast({ title: 'โหลดแพ็คเกจไม่สำเร็จ', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      creditsIncluded: '0',
      features: '',
      isActive: true,
      sortOrder: String(packages.length),
    })
    setEditingId(null)
  }

  const openCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (pkg: PackageItem) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      price: String(pkg.price),
      creditsIncluded: String(pkg.creditsIncluded),
      features: pkg.features || '',
      isActive: pkg.isActive,
      sortOrder: String(pkg.sortOrder),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        creditsIncluded: parseInt(form.creditsIncluded, 10) || 0,
        features: form.features || null,
        isActive: form.isActive,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
      }
      if (editingId) {
        const res = await fetch(`/api/admin/packages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.text())
        toast({ title: 'อัปเดตแพ็คเกจสำเร็จ' })
      } else {
        const res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error(await res.text())
        toast({ title: 'สร้างแพ็คเกจสำเร็จ' })
      }
      setDialogOpen(false)
      fetchPackages()
    } catch (err: any) {
      toast({ title: err.message || 'เกิดข้อผิดพลาด', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบแพ็คเกจนี้?')) return
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('ลบไม่สำเร็จ')
      toast({ title: 'ลบแพ็คเกจสำเร็จ' })
      fetchPackages()
    } catch {
      toast({ title: 'ลบไม่สำเร็จ', variant: 'destructive' })
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการแพ็คเกจราคา</h1>
          <p className="mt-2 text-gray-600">สร้างและแก้ไขแพ็คเกจที่บริษัทซื้อได้</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm() }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>เพิ่มแพ็คเกจ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'แก้ไขแพ็คเกจ' : 'เพิ่มแพ็คเกจ'}</DialogTitle>
              <DialogDescription>กรอกชื่อ ราคา เครดิต และคุณสมบัติ</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>ชื่อแพ็คเกจ</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>คำอธิบาย</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ราคา (บาท)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>เครดิตที่ได้</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.creditsIncluded}
                    onChange={(e) => setForm({ ...form, creditsIncluded: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>คุณสมบัติ (ข้อความหรือ JSON)</Label>
                <Textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={2}
                  placeholder="เช่น เปิดดูเรซูเม 50 ครั้ง"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive">เปิดให้ซื้อ</Label>
              </div>
              <div>
                <Label>ลำดับแสดงผล</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">{editingId ? 'บันทึก' : 'สร้าง'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการแพ็คเกจ</CardTitle>
          <CardDescription>แพ็คเกจทั้งหมด (รวมที่ปิดขาย)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>เครดิต</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ลำดับ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    ยังไม่มีแพ็คเกจ
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>฿{Number(pkg.price).toLocaleString()}</TableCell>
                    <TableCell>{pkg.creditsIncluded}</TableCell>
                    <TableCell>
                      {pkg.isActive ? (
                        <Badge variant="default">เปิดขาย</Badge>
                      ) : (
                        <Badge variant="secondary">ปิดขาย</Badge>
                      )}
                    </TableCell>
                    <TableCell>{pkg.sortOrder}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(pkg)}>
                        แก้ไข
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg.id)}>
                        ลบ
                      </Button>
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
