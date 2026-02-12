'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Check, CreditCard } from 'lucide-react'

type PackageItem = {
  id: string
  name: string
  description: string | null
  price: number | string
  creditsIncluded: number
  features: string | null
  sortOrder: number
}

export default function CompanyPackagesPage() {
  const { toast } = useToast()
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [orderingId, setOrderingId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false))
  }, [])

  const handleOrder = async (pkg: PackageItem) => {
    setOrderingId(pkg.id)
    try {
      const res = await fetch('/api/company/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'สร้างคำสั่งซื้อไม่สำเร็จ')
      }
      const order = await res.json()
      setOrderId(order.id)
      toast({ title: 'สร้างคำสั่งซื้อแล้ว', description: 'กดปุ่มชำระเงินด้านล่างเพื่อยืนยันการจ่าย' })
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' })
    } finally {
      setOrderingId(null)
    }
  }

  const handlePay = async () => {
    if (!orderId) return
    setPaying(true)
    try {
      const res = await fetch(`/api/company/orders/${orderId}/pay`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'ชำระเงินไม่สำเร็จ')
      }
      toast({ title: 'ชำระเงินสำเร็จ', description: 'เครดิตถูกเพิ่มเข้าบัญชีแล้ว' })
      setOrderId(null)
      setTimeout(() => {
        window.location.href = '/company/dashboard'
      }, 1500)
    } catch (error: any) {
      toast({ title: 'ชำระเงินไม่สำเร็จ', description: error.message, variant: 'destructive' })
    } finally {
      setPaying(false)
    }
  }

  const parsePrice = (p: number | string) => {
    if (typeof p === 'number') return p
    if (typeof p === 'object' && p !== null && 'toString' in p) return Number((p as any).toString())
    return Number(p) || 0
  }

  const parseFeatures = (f: string | null): string[] => {
    if (!f) return []
    try {
      const arr = JSON.parse(f) as unknown
      return Array.isArray(arr) ? arr.map(String) : [f]
    } catch {
      return [f]
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">กำลังโหลดแพ็คเกจ...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/company/dashboard">← กลับไปแดชบอร์ด</Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">สั่งซื้อแพ็คเกจ</h1>
        <p className="mt-2 text-gray-600">
          เลือกแพ็คเกจที่เหมาะกับบริษัทของคุณ ใช้งานสะดวก จ่ายผ่านเครดิต
        </p>
      </div>

      {orderId ? (
        <Card className="mx-auto max-w-md border-2 border-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              ยืนยันการชำระเงิน
            </CardTitle>
            <CardDescription>
              กดปุ่มด้านล่างเพื่อยืนยันการชำระเงิน (ระบบจะเพิ่มเครดิตให้ทันที)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              ในระบบจริงสามารถเชื่อมต่อกับช่องทางชำระเงิน เช่น พร้อมเพย์, บัตรเครดิต, โอนธนาคาร
            </p>
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? 'กำลังดำเนินการ...' : 'ชำระเงิน'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setOrderId(null)} disabled={paying}>
              ยกเลิก
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description || ''}</CardDescription>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-red-600">
                    ฿{parsePrice(pkg.price).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500"> / แพ็คเกจ</span>
                </div>
                <p className="text-sm text-gray-600">
                  ได้เครดิต <strong>{pkg.creditsIncluded}</strong> หน่วย
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <ul className="space-y-2">
                  {parseFeatures(pkg.features).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => handleOrder(pkg)}
                  disabled={orderingId !== null}
                >
                  {orderingId === pkg.id ? 'กำลังสร้างคำสั่งซื้อ...' : 'สั่งซื้อ'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {packages.length === 0 && !orderId && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            ยังไม่มีแพ็คเกจในระบบ กรุณาติดต่อผู้ดูแล
          </CardContent>
        </Card>
      )}
    </div>
  )
}
