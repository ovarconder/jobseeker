'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TRANSIT_LINES, parseTransitLineColors } from '@/lib/transit-lines'
import type { SeekerWithMatch } from '@/app/api/seekers/route'
import { useToast } from '@/components/ui/use-toast'
import { Bookmark, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react'

const MATCH_LABELS = [
  { key: 'areaMatch', label: 'พื้นที่ใกล้กัน', color: 'bg-blue-500' },
  { key: 'skillsMatch', label: 'งาน/ความสามารถตรง', color: 'bg-emerald-500' },
  { key: 'jobTypeMatch', label: 'รูปแบบจ้างตรงใจ', color: 'bg-amber-500' },
  { key: 'salaryMatch', label: 'เงินเดือนคุ้มค่า', color: 'bg-violet-500' },
] as const

const CATEGORIES = [
  { id: '', label: 'ประวัติมาใหม่' },
  { id: 'ไอที', label: 'ไอที' },
  { id: 'การตลาด', label: 'การตลาด/PR' },
  { id: 'บัญชี', label: 'บัญชี' },
  { id: 'ขาย', label: 'ขาย' },
  { id: 'วิศวกรรม', label: 'วิศวกรรม' },
  { id: 'คลังสินค้า', label: 'คลังสินค้า/โลจิสติกส์' },
  { id: 'ก่อสร้าง', label: 'ก่อสร้าง' },
  { id: 'ธุรการ', label: 'ธุรการ' },
]

const PROVINCES = [
  'กรุงเทพมหานคร',
  'สมุทรปราการ',
  'นนทบุรี',
  'ปทุมธานี',
  'เชียงใหม่',
  'ขอนแก่น',
  'นครราชสีมา',
  'อุบลราชธานี',
  'ภูเก็ต',
]

function formatTimeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} วันที่แล้ว`
  if (hours > 0) return `${hours} ชั่วโมงที่แล้ว`
  if (mins > 0) return `${mins} นาทีที่แล้ว`
  return 'เมื่อสักครู่'
}

function salaryText(min: number | null, max: number | null) {
  if (min != null && max != null) return `${min.toLocaleString()} - ${max.toLocaleString()}`
  if (min != null) return min.toLocaleString()
  if (max != null) return max.toLocaleString()
  return '-'
}

export default function SeekersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [seekers, setSeekers] = useState<SeekerWithMatch[]>([])
  const [total, setTotal] = useState(0)
  const [totalAll, setTotalAll] = useState(0)
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [area, setArea] = useState('')
  const [transitLine, setTransitLine] = useState<string>('all')
  const [jobId, setJobId] = useState<string>('')
  const [sort, setSort] = useState('latest')
  const [category, setCategory] = useState('')
  const [province, setProvince] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchJobs()
    fetchSavedIds()
  }, [])

  const fetchSavedIds = async () => {
    try {
      const res = await fetch('/api/company/saved-seekers')
      if (res.ok) {
        const ids = await res.json()
        setSavedIds(new Set(Array.isArray(ids) ? ids : []))
      }
    } catch {}
  }

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?status=ACTIVE')
      const data = await res.json()
      setJobs(Array.isArray(data) ? data.map((j: { id: string; title: string }) => ({ id: j.id, title: j.title })) : [])
    } catch {
      setJobs([])
    }
  }

  const fetchSeekers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (area.trim()) params.set('area', area.trim())
      if (transitLine && transitLine !== 'all') params.set('transitLine', transitLine)
      if (jobId) params.set('jobId', jobId)
      if (sort) params.set('sort', sort)
      if (category) params.set('category', category)
      if (province) params.set('province', province)
      const res = await fetch(`/api/seekers?${params.toString()}`)
      const data = await res.json()
      if (data && typeof data.list !== 'undefined') {
        setSeekers(Array.isArray(data.list) ? data.list : [])
        setTotal(Number(data.total) || 0)
        setTotalAll(Number(data.totalAll) ?? Number(data.total) ?? 0)
      } else {
        setSeekers(Array.isArray(data) ? data : [])
        const n = Array.isArray(data) ? data.length : 0
        setTotal(n)
        setTotalAll(n)
      }
    } catch {
      setSeekers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeekers()
  }, [sort, category, province])

  const toggleSave = async (seekerId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isSaved = savedIds.has(seekerId)
    try {
      if (isSaved) {
        await fetch(`/api/company/saved-seekers/${seekerId}`, { method: 'DELETE' })
        setSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(seekerId)
          return next
        })
        toast({ title: 'ยกเลิกการบันทึกแล้ว' })
      } else {
        await fetch('/api/company/saved-seekers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seekerId }),
        })
        setSavedIds((prev) => new Set(prev).add(seekerId))
        toast({ title: 'บันทึกประวัติแล้ว' })
      }
    } catch {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-4 py-4">
        <nav className="text-sm text-gray-500">
          <Link href="/company/dashboard" className="hover:text-gray-700">หน้าแรก</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">ค้นหาประวัติ</span>
        </nav>
        <h1 className="mt-2 text-2xl font-bold">ค้นหาประวัติ</h1>
      </div>

      <div className="border-b bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id || 'new'}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                category === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          <main className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Label className="text-sm text-gray-600">เรียงลำดับตาม</Label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">อัปเดตล่าสุด</SelectItem>
                    <SelectItem value="salary_asc">เงินเดือนน้อย-มาก</SelectItem>
                    <SelectItem value="salary_desc">เงินเดือนมาก-น้อย</SelectItem>
                    <SelectItem value="age_asc">อายุน้อย-มาก</SelectItem>
                    <SelectItem value="age_desc">อายุมาก-น้อย</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    placeholder="พื้นที่ / จังหวัด"
                    value={area || province}
                    onChange={(e) => {
                      setArea(e.target.value)
                      setProvince('')
                    }}
                    className="w-48"
                  />
                  <Select value={transitLine} onValueChange={setTransitLine}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="สาย BTS/MRT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสาย</SelectItem>
                      {TRANSIT_LINES.map((line) => (
                        <SelectItem key={line.id} value={line.id}>
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: line.color }} />
                            {line.label.replace(/ \(.*\)$/, '')}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={jobId} onValueChange={setJobId}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="เทียบกับงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ไม่เทียบ</SelectItem>
                      {jobs.map((j) => (
                        <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={fetchSeekers} disabled={loading}>
                    ค้นหา
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">ทั้งหมด {total.toLocaleString()}</p>
            </div>

            <div className="mb-2 text-sm font-medium text-gray-700">NEW & LAST UPDATE</div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">กำลังโหลด...</div>
            ) : seekers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  ไม่พบประวัติตามเงื่อนไข ลองเปลี่ยนตัวกรองหรือกด &quot;ค้นหา&quot;
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {seekers.map((seeker) => {
                  const isSaved = seeker.saved ?? savedIds.has(seeker.id)
                  return (
                    <Card
                      key={seeker.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => router.push(`/company/seekers/${seeker.id}`)}
                    >
                      <CardContent className="flex gap-6 p-6">
                        <div className="flex shrink-0 flex-col items-center gap-2">
                          {seeker.pictureUrl ? (
                            <img
                              src={seeker.pictureUrl}
                              alt=""
                              className="h-20 w-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-medium text-gray-500">
                              {seeker.displayName?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className="flex gap-1">
                            {seeker.phone && (
                              <span className="rounded bg-green-100 p-1" title="มีเบอร์โทร">
                                <Phone className="h-4 w-4 text-green-700" />
                              </span>
                            )}
                            {seeker.email && (
                              <span className="rounded bg-green-100 p-1" title="มีอีเมล">
                                <Mail className="h-4 w-4 text-green-700" />
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-medium text-gray-900">
                            {seeker.skills?.split(/[,/]/)[0]?.trim() || seeker.displayName}
                          </p>
                          {seeker.skills && (
                            <p className="line-clamp-2 text-sm text-gray-600">{seeker.skills}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {seeker.age != null && <span>อายุ(ปี): {seeker.age}</span>}
                            {seeker.experience != null && <span>ประสบการณ์(ปี): {seeker.experience}</span>}
                            <span>
                              เงินเดือน(บาท): {salaryText(seeker.expectedSalaryMin, seeker.expectedSalaryMax)}
                            </span>
                            {seeker.preferredArea && (
                              <span>พื้นที่ต้องการทำงาน: {seeker.preferredArea}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                          <p className="text-xs text-gray-500">{formatTimeAgo(seeker.updatedAt)}</p>
                          <div className="flex flex-col items-center">
                            <div
                              className="relative h-14 w-14 rounded-full border-4 border-gray-200"
                              style={{
                                background: `conic-gradient(#e11d48 0% ${seeker.resumeCompleteness}%, #e5e7eb ${seeker.resumeCompleteness}% 100%)`,
                              }}
                            >
                              <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white text-xs font-medium text-red-600">
                                {seeker.resumeCompleteness}%
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">ความสมบูรณ์เรซูเม่</p>
                          </div>
                          <Button
                            size="sm"
                            variant={isSaved ? 'secondary' : 'default'}
                            className="bg-red-600 hover:bg-red-700"
                            onClick={(e) => toggleSave(seeker.id, e)}
                          >
                            <Bookmark className={`mr-1 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                            บันทึก
                          </Button>
                        </div>

                        <div className="flex shrink-0 gap-0.5">
                          {MATCH_LABELS.map(({ key, label, color }) => (
                            <span
                              key={key}
                              title={label}
                              className={`inline-block h-3 w-3 rounded-full ${
                                seeker.match[key as keyof typeof seeker.match] ? color : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </main>

          <aside className="hidden w-64 shrink-0 lg:block">
            <Card>
              <CardContent className="p-4">
                <p className="font-medium text-gray-900">ทั้งหมด {total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">resume ทั้งหมด {totalAll || total} ฉบับ</p>

                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-gray-700">แบ่งตามพื้นที่</p>
                  <ul className="space-y-1 text-sm">
                    {PROVINCES.map((p) => (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => {
                            setProvince(p)
                            setArea('')
                          }}
                          className={`hover:underline ${province === p ? 'font-medium text-red-600' : 'text-gray-600'}`}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium text-gray-700">แบ่งตามอาชีพ</p>
                  <ul className="space-y-1 text-sm">
                    {CATEGORIES.filter((c) => c.id).map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setCategory(c.id)}
                          className={`hover:underline ${category === c.id ? 'font-medium text-red-600' : 'text-gray-600'}`}
                        >
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
