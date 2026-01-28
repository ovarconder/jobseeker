'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

declare global {
  interface Window {
    liff: any
  }
}

export default function RegisterSimplePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [liffReady, setLiffReady] = useState(false)
  const [lineProfile, setLineProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    phone: '',
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
          })
        })
        .catch((err: any) => {
          console.error('LIFF initialization failed', err)
        })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/liff/register-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          lineUserId: lineProfile?.userId,
          displayName: lineProfile?.displayName,
          pictureUrl: lineProfile?.pictureUrl,
          isElderly: true,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Registration failed')
      }

      toast({ title: 'ลงทะเบียนสำเร็จ! ทีมงานจะติดต่อกลับเพื่อขอข้อมูลเพิ่มเติม' })
      
      // Close LIFF window
      setTimeout(() => {
        if (window.liff) {
          window.liff.closeWindow()
        }
      }, 2000)
    } catch (error: any) {
      toast({
        title: 'ลงทะเบียนไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!liffReady) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>ลงทะเบียนสำหรับผู้สูงอายุ</CardTitle>
          <CardDescription>
            กรุณากรอกเบอร์โทรศัพท์เท่านั้น ทีมงานจะติดต่อกลับเพื่อขอข้อมูลเพิ่มเติม
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
              <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812345678"
                required
              />
            </div>
          </CardContent>

          <div className="flex justify-end space-x-4 p-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
