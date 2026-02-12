'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function CompanyProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    contactName: '',
    contactPhone: '',
    description: '',
    about: '',
    address: '',
    addressLine: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
    companyRegNo: '',
    companyRegDocUrl: '',
    googleMapUrl: '',
    btsLine: '',
    btsStation: '',
    mrtLine: '',
    mrtStation: '',
    srtLine: '',
    srtStation: '',
    arlStation: '',
    busLines: '',
    welfare: '',
    welfareOther: '',
    businessMain: '',
    businessSub: '',
    companySize: '',
    phone: '',
    phoneExt: '',
    fax: '',
    billingName: '',
    billingAddress: '',
    billingEmail: '',
    taxId: '',
    website: '',
    logo: '',
    applyProfileToAllJobs: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/company/profile')
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || '',
          nameEn: data.nameEn || '',
          contactName: data.contactName || '',
          contactPhone: data.contactPhone || '',
          description: data.description || '',
          about: data.about || '',
          address: data.address || '',
          addressLine: data.addressLine || '',
          province: data.province || '',
          district: data.district || '',
          subdistrict: data.subdistrict || '',
          postalCode: data.postalCode || '',
          companyRegNo: data.companyRegNo || '',
          companyRegDocUrl: data.companyRegDocUrl || '',
          googleMapUrl: data.googleMapUrl || '',
          btsLine: data.btsLine || '',
          btsStation: data.btsStation || '',
          mrtLine: data.mrtLine || '',
          mrtStation: data.mrtStation || '',
          srtLine: data.srtLine || '',
          srtStation: data.srtStation || '',
          arlStation: data.arlStation || '',
          busLines: data.busLines || '',
          welfare: data.welfare || '',
          welfareOther: data.welfareOther || '',
          businessMain: data.businessMain || '',
          businessSub: data.businessSub || '',
          companySize: data.companySize || '',
          phone: data.phone || '',
          phoneExt: data.phoneExt || '',
          fax: data.fax || '',
          billingName: data.billingName || '',
          billingAddress: data.billingAddress || '',
          billingEmail: data.billingEmail || '',
          taxId: data.taxId || '',
          website: data.website || '',
          logo: data.logo || '',
          applyProfileToAllJobs: !!data.applyProfileToAllJobs,
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
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo: formData.logo || null,
          nameEn: formData.nameEn || null,
          contactName: formData.contactName || null,
          contactPhone: formData.contactPhone || null,
          about: formData.about || null,
          address: formData.address || null,
          addressLine: formData.addressLine || null,
          province: formData.province || null,
          district: formData.district || null,
          subdistrict: formData.subdistrict || null,
          postalCode: formData.postalCode || null,
          companyRegNo: formData.companyRegNo || null,
          companyRegDocUrl: formData.companyRegDocUrl || null,
          googleMapUrl: formData.googleMapUrl || null,
          btsLine: formData.btsLine || null,
          btsStation: formData.btsStation || null,
          mrtLine: formData.mrtLine || null,
          mrtStation: formData.mrtStation || null,
          srtLine: formData.srtLine || null,
          srtStation: formData.srtStation || null,
          arlStation: formData.arlStation || null,
          busLines: formData.busLines || null,
          welfare: formData.welfare || null,
          welfareOther: formData.welfareOther || null,
          businessMain: formData.businessMain || null,
          businessSub: formData.businessSub || null,
          companySize: formData.companySize || null,
          phone: formData.phone || null,
          phoneExt: formData.phoneExt || null,
          fax: formData.fax || null,
          billingName: formData.billingName || null,
          billingAddress: formData.billingAddress || null,
          billingEmail: formData.billingEmail || null,
          taxId: formData.taxId || null,
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      toast({ title: 'บันทึกข้อมูลบริษัทสำเร็จ' })
      router.push('/company/dashboard')
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-8">กำลังโหลด...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">สร้าง/แก้ไขข้อมูลบริษัท</h1>
        <p className="mt-2 text-gray-600">กรอกข้อมูลบริษัทของคุณ</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>ข้อมูลบริษัท</CardTitle>
          <CardDescription>ฟอร์มข้อมูลบริษัทตามที่ต้องการ (แนวเดียวกับระบบในรูป)</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">ชื่อผู้ติดต่อ *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">เบอร์ผู้ติดต่อ *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL Logo</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อบริษัท (ภาษาไทย) *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">ชื่อบริษัท (ภาษาอังกฤษ)</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Company name (EN)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine">ที่อยู่ *</Label>
              <Textarea
                id="addressLine"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                placeholder="บ้านเลขที่/ถนน/ซอย"
                rows={2}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด *</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">เขต/อำเภอ *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdistrict">แขวง/ตำบล *</Label>
                <Input
                  id="subdistrict"
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">รหัสไปรษณีย์ *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyRegNo">เลขจดทะเบียนบริษัท</Label>
                <Input
                  id="companyRegNo"
                  value={formData.companyRegNo}
                  onChange={(e) => setFormData({ ...formData, companyRegNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyRegDocUrl">ไฟล์เอกสารยืนยันเลขจดทะเบียน (URL)</Label>
                <Input
                  id="companyRegDocUrl"
                  value={formData.companyRegDocUrl}
                  onChange={(e) => setFormData({ ...formData, companyRegDocUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="googleMapUrl">แผนที่ Google (URL)</Label>
                <Input
                  id="googleMapUrl"
                  value={formData.googleMapUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">เว็บไซต์บริษัท</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">การเดินทาง</Label>
              <p className="text-sm text-gray-500">กรอกเส้นทางและสถานีใกล้บริษัท (ตามหัวข้อในรูป)</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="btsLine">เส้นทาง BTS</Label>
                <Input id="btsLine" value={formData.btsLine} onChange={(e) => setFormData({ ...formData, btsLine: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btsStation">สถานี BTS</Label>
                <Input id="btsStation" value={formData.btsStation} onChange={(e) => setFormData({ ...formData, btsStation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrtLine">เส้นทาง MRT</Label>
                <Input id="mrtLine" value={formData.mrtLine} onChange={(e) => setFormData({ ...formData, mrtLine: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mrtStation">สถานี MRT</Label>
                <Input id="mrtStation" value={formData.mrtStation} onChange={(e) => setFormData({ ...formData, mrtStation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="srtLine">เส้นทาง SRT</Label>
                <Input id="srtLine" value={formData.srtLine} onChange={(e) => setFormData({ ...formData, srtLine: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="srtStation">สถานี SRT</Label>
                <Input id="srtStation" value={formData.srtStation} onChange={(e) => setFormData({ ...formData, srtStation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arlStation">ใกล้ Airport Rail Link</Label>
                <Input id="arlStation" value={formData.arlStation} onChange={(e) => setFormData({ ...formData, arlStation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busLines">สายรถเมล์</Label>
                <Input id="busLines" value={formData.busLines} onChange={(e) => setFormData({ ...formData, busLines: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">เกี่ยวกับบริษัท</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                rows={6}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="welfare">สวัสดิการ</Label>
                <Input id="welfare" value={formData.welfare} onChange={(e) => setFormData({ ...formData, welfare: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welfareOther">สวัสดิการอื่นๆ</Label>
                <Input id="welfareOther" value={formData.welfareOther} onChange={(e) => setFormData({ ...formData, welfareOther: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessMain">ประเภทธุรกิจหลัก</Label>
                <Input id="businessMain" value={formData.businessMain} onChange={(e) => setFormData({ ...formData, businessMain: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessSub">ประเภทธุรกิจย่อย</Label>
                <Input id="businessSub" value={formData.businessSub} onChange={(e) => setFormData({ ...formData, businessSub: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">ขนาดธุรกิจ</Label>
              <Input id="companySize" value={formData.companySize} onChange={(e) => setFormData({ ...formData, companySize: e.target.value })} placeholder="เช่น 1-50 / 50-200 / 200+" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรบริษัท</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneExt">ต่อ</Label>
                <Input id="phoneExt" value={formData.phoneExt} onChange={(e) => setFormData({ ...formData, phoneExt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">เบอร์แฟกซ์</Label>
                <Input id="fax" value={formData.fax} onChange={(e) => setFormData({ ...formData, fax: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="billingEmail">อีเมลบัญชี</Label>
                <Input id="billingEmail" value={formData.billingEmail} onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี</Label>
                <Input id="taxId" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="billingName">ชื่อบิล</Label>
                <Input id="billingName" value={formData.billingName} onChange={(e) => setFormData({ ...formData, billingName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddress">ที่อยู่บิล</Label>
                <Input id="billingAddress" value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="applyProfileToAllJobs"
                type="checkbox"
                checked={formData.applyProfileToAllJobs}
                onChange={(e) => setFormData({ ...formData, applyProfileToAllJobs: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="applyProfileToAllJobs" className="cursor-pointer text-sm font-normal">
                นำไปใช้กับทุกตำแหน่งงาน
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/company/dashboard">ยกเลิก</Link>
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
