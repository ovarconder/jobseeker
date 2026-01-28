'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

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
          ...formData,
          lineUserId: lineProfile?.userId,
          age: formData.age ? parseInt(formData.age) : null,
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
