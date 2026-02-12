'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
const DEMO_EMAIL = 'admin@example.com'
const DEMO_PASSWORD = 'Admin123!'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const doRedirect = (session: { user?: { role?: string } }) => {
    if (session?.user?.role === 'ADMIN') router.push('/admin/dashboard')
    else if (session?.user?.role === 'COMPANY') router.push('/company/dashboard')
    else router.push('/')
    router.refresh()
  }

  useEffect(() => {
    if (!DEMO_MODE) return
    let cancelled = false
    const run = async () => {
      const result = await signIn('credentials', {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        redirect: false,
      })
      if (cancelled) return
      if (result?.error) return
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      doRedirect(session)
    }
    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      if (result?.error) {
        toast({
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          description: result.error === 'CredentialsSignin' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : result.error,
          variant: 'destructive',
        })
      } else {
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        doRedirect(session)
      }
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', description: 'ไม่สามารถเข้าสู่ระบบได้', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoClick = async () => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        redirect: false,
      })
      if (result?.error) {
        toast({ title: 'เข้าสู่ระบบไม่สำเร็จ', variant: 'destructive' })
      } else {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        doRedirect(session)
      }
    } finally {
      setLoading(false)
    }
  }

  if (DEMO_MODE) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">โหมด Demo</CardTitle>
            <CardDescription>
              กดปุ่มด้านล่างเพื่อเข้าแบบ Superuser (ไม่ต้องกรอกล็อกอิน)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" disabled={loading} onClick={handleDemoClick}>
              {loading ? 'กำลังเข้า...' : 'เข้าแบบ Superuser'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
          <CardDescription>เข้าสู่ระบบเพื่อจัดการงานและใบสมัคร</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={handleDemoClick}>
              เข้าแบบ Superuser (ไม่ต้องกรอก)
            </Button>
            <p className="text-center text-sm text-gray-600">
              ยังไม่มีบัญชี? <Link href="/register" className="text-primary hover:underline">สมัครสมาชิก</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
