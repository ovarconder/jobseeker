'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'seeker' | 'company'>('seeker')
  const [seekerFormData, setSeekerFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  })
  const [companyFormData, setCompanyFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    description: '',
    address: '',
    phone: '',
    website: '',
  })

  const handleSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register/seeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast({
        title: 'สมัครสมาชิกสำเร็จ',
        description: data.message || 'คุณสามารถเข้าสู่ระบบได้เลย',
      })

      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'สมัครสมาชิกไม่สำเร็จ',
        description: error.message || 'เกิดข้อผิดพลาด',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast({
        title: 'สมัครสมาชิกสำเร็จ',
        description: 'กรุณารอการอนุมัติจากผู้ดูแลระบบ',
      })

      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'สมัครสมาชิกไม่สำเร็จ',
        description: error.message || 'เกิดข้อผิดพลาด',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">สมัครสมาชิก</CardTitle>
          <CardDescription>
            เลือกประเภทการสมัครสมาชิกที่ต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'seeker' | 'company')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">บุคคลทั่วไป</TabsTrigger>
              <TabsTrigger value="company">บริษัท</TabsTrigger>
            </TabsList>
            
            <TabsContent value="seeker" className="space-y-4 mt-6">
              <form onSubmit={handleSeekerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="seeker-email">อีเมล *</Label>
                    <Input
                      id="seeker-email"
                      type="email"
                      placeholder="your@email.com"
                      value={seekerFormData.email}
                      onChange={(e) => setSeekerFormData({ ...seekerFormData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seeker-password">รหัสผ่าน *</Label>
                    <Input
                      id="seeker-password"
                      type="password"
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      value={seekerFormData.password}
                      onChange={(e) => setSeekerFormData({ ...seekerFormData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seeker-name">ชื่อ-นามสกุล *</Label>
                  <Input
                    id="seeker-name"
                    placeholder="ชื่อของคุณ"
                    value={seekerFormData.name}
                    onChange={(e) => setSeekerFormData({ ...seekerFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seeker-phone">เบอร์โทรศัพท์ *</Label>
                  <Input
                    id="seeker-phone"
                    type="tel"
                    placeholder="081-234-5678"
                    value={seekerFormData.phone}
                    onChange={(e) => setSeekerFormData({ ...seekerFormData, phone: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4 mt-6">
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-email">อีเมล *</Label>
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="your@email.com"
                      value={companyFormData.email}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-password">รหัสผ่าน *</Label>
                    <Input
                      id="company-password"
                      type="password"
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      value={companyFormData.password}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name">ชื่อผู้ใช้ *</Label>
                  <Input
                    id="company-name"
                    value={companyFormData.name}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-companyName">ชื่อบริษัท *</Label>
                  <Input
                    id="company-companyName"
                    value={companyFormData.companyName}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-description">รายละเอียดบริษัท</Label>
                  <Textarea
                    id="company-description"
                    value={companyFormData.description}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-address">ที่อยู่</Label>
                    <Input
                      id="company-address"
                      value={companyFormData.address}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="company-phone"
                      type="tel"
                      value={companyFormData.phone}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">เว็บไซต์</Label>
                  <Input
                    id="company-website"
                    type="url"
                    placeholder="https://example.com"
                    value={companyFormData.website}
                    onChange={(e) => setCompanyFormData({ ...companyFormData, website: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-gray-600">
            มีบัญชีแล้ว?{' '}
            <Link href="/login" className="text-primary hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
