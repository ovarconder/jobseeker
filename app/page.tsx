'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { JobCard } from '@/components/job-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TRANSIT_LINES } from '@/lib/transit-lines'
import { MapPin, Train, Search } from 'lucide-react'

const JOB_TYPE_TABS = [
  { value: '', label: 'งานทั้งหมด' },
  { value: 'PART_TIME', label: 'งานพาร์ทไทม์' },
  { value: 'FULL_TIME', label: 'งานประจำ' },
  { value: 'CONTRACT', label: 'สัญญาจ้าง' },
  { value: 'INTERNSHIP', label: 'ฝึกงาน' },
]

const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'เลือกหมวดหมู่งานที่คุณต้องการค้นหา' },
  ...JOB_TYPE_TABS.filter((t) => t.value),
]

const PROVINCES = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'ปทุมธานี', 'เชียงใหม่', 'ขอนแก่น']

type JobItem = {
  id: string
  title: string
  description: string
  location: string
  salary?: string | null
  jobType: string
  forElderly?: boolean
  createdAt: string
  company?: { name: string; logo?: string | null } | null
  _count?: { applications: number }
}

function formatTimeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} วันที่แล้ว`
  if (hours > 0) return `${hours} ชม.ที่แล้ว`
  if (mins > 0) return `${mins} นาทีที่แล้ว`
  return 'เมื่อสักครู่'
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'งานประจำ',
  PART_TIME: 'งานพาร์ทไทม์',
  CONTRACT: 'สัญญาจ้าง',
  INTERNSHIP: 'ฝึกงาน',
}

export default function HomePage() {
  const [searchMode, setSearchMode] = useState<'area' | 'bts'>('area')
  const [areaProvince, setAreaProvince] = useState('')
  const [areaDistrict, setAreaDistrict] = useState('')
  const [btsLine, setBtsLine] = useState('')
  const [btsStation, setBtsStation] = useState('')
  const [category, setCategory] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [jobTypeTab, setJobTypeTab] = useState('')
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (jobTypeTab && jobTypeTab !== 'all') params.set('jobType', jobTypeTab)
    if (searchMode === 'area' && (areaProvince || areaDistrict)) {
      params.set('location', areaDistrict || areaProvince)
    }
    if (searchMode === 'bts' && (btsLine || btsStation)) {
      params.set('location', btsStation || btsLine)
    }
    if (keyword.trim()) params.set('search', keyword.trim())
    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchJobs()
  }, [jobTypeTab])

  const partTimeJobs = jobs.filter((j) => j.jobType === 'PART_TIME')
  const otherJobs = jobs

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            JobSeeker
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-pink-500 hover:bg-pink-600">สมัครสมาชิก</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Yellow Banner */}
      <section className="bg-[#FEF08A]/90 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            ค้นหางาน สมัครงาน ทั้งหมด
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-800 md:text-base">
            ตำแหน่งงานคุณภาพดีล่าสุด จากบริษัทชั้นนำ ในพื้นที่ใกล้คุณที่สุด
            แพลตฟอร์มที่ช่วยให้คุณได้งานที่เหมาะสม เส้นทางต่อไปในอาชีพรอคุณอยู่
          </p>
        </div>
      </section>

      {/* Search Box - White */}
      <section className="container mx-auto -mt-4 px-4 pb-6">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-4 md:p-6">
            {/* Tabs: พื้นที่ | BTS */}
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSearchMode('area')}
                className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                  searchMode === 'area'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                ค้นหาจากพื้นที่สะดวกรับงาน
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('bts')}
                className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                  searchMode === 'bts'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Train className="h-4 w-4" />
                ค้นหาจากสถานีรถไฟฟ้า
              </button>
            </div>

            {searchMode === 'area' ? (
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-40">
                  <label className="mb-1 block text-xs text-gray-500">จังหวัด</label>
                  <Select value={areaProvince} onValueChange={setAreaProvince}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <label className="mb-1 block text-xs text-gray-500">เขต/อำเภอ</label>
                  <Input
                    placeholder="เช่น บางเขน"
                    value={areaDistrict}
                    onChange={(e) => setAreaDistrict(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <label className="mb-1 block text-xs text-gray-500">หมวดหมู่งาน</label>
                  <Select value={category || 'all'} onValueChange={(v) => { setCategory(v); setJobTypeTab(v === 'all' ? '' : v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-1 block text-xs text-gray-500">ค่าที่ต้องการค้นหา</label>
                  <Input
                    placeholder="ค้นหาจากตำแหน่งหรือบริษัท"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <Button onClick={fetchJobs} className="bg-pink-500 hover:bg-pink-600">
                  <Search className="mr-2 h-4 w-4" />
                  ค้นหา
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-44">
                  <label className="mb-1 block text-xs text-gray-500">สาย BTS/MRT</label>
                  <Select value={btsLine} onValueChange={setBtsLine}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสาย" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSIT_LINES.map((line) => (
                        <SelectItem key={line.id} value={line.id}>
                          <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: line.color }} />
                            {line.label.replace(/ \(.*\)$/, '')}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <label className="mb-1 block text-xs text-gray-500">สถานี</label>
                  <Input
                    placeholder="เช่น บางจาก, อุดมสุข"
                    value={btsStation}
                    onChange={(e) => setBtsStation(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <label className="mb-1 block text-xs text-gray-500">หมวดหมู่งาน</label>
                  <Select value={category || 'all'} onValueChange={(v) => { setCategory(v); setJobTypeTab(v === 'all' ? '' : v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="mb-1 block text-xs text-gray-500">ค่าที่ต้องการค้นหา</label>
                  <Input
                    placeholder="ค้นหาจากตำแหน่งหรือบริษัท"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <Button onClick={fetchJobs} className="bg-pink-500 hover:bg-pink-600">
                  <Search className="mr-2 h-4 w-4" />
                  ค้นหา
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Job Type Tabs */}
      <section className="border-b bg-white">
        <div className="container mx-auto flex flex-wrap gap-2 px-4 py-3">
          {JOB_TYPE_TABS.map((tab) => (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => setJobTypeTab(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                jobTypeTab === tab.value
                  ? 'border-pink-500 bg-pink-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setJobTypeTab('')
              setKeyword('')
              setAreaProvince('')
              setAreaDistrict('')
              setBtsLine('')
              setBtsStation('')
              setCategory('')
              fetchJobs()
            }}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            ล้างทั้งหมด
          </button>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* งานพาร์ทไทม์แนะนำ */}
        {partTimeJobs.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">งานพาร์ทไทม์แนะนำ</h2>
              <button
                type="button"
                onClick={() => setJobTypeTab('PART_TIME')}
                className="text-sm font-medium text-pink-600 hover:underline"
              >
                งานพาร์ทไทม์แนะนำทั้งหมด &gt;
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {partTimeJobs.slice(0, 8).map((job) => (
                <JobCardCompact key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* งานทั้งหมด */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">งานทั้งหมด</h2>
            <span className="text-sm text-gray-500">ดูรายละเอียดงานทั้งหมด &gt;</span>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-500">กำลังโหลด...</div>
          ) : otherJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                ไม่พบงานที่ตรงกับเงื่อนไข ลองเปลี่ยนตัวกรองหรือกด &quot;ล้างทั้งหมด&quot;
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherJobs.map((job) => (
                <JobCardCompact key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        {/* Features - ย่อลง */}
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900">สำหรับผู้หางาน</h3>
              <p className="mt-1 text-sm text-gray-600">ค้นหางานผ่าน LINE Bot หรือเว็บ สมัครงานได้ทันที</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900">สำหรับบริษัท</h3>
              <p className="mt-1 text-sm text-gray-600">โพสต์งาน จัดการใบสมัคร ค้นหาประวัติผู้สมัคร</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900">ใช้งานง่าย</h3>
              <p className="mt-1 text-sm text-gray-600">กรองตามพื้นที่ สาย BTS/MRT หมวดงาน</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-16 border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © JobSeeker Platform
        </div>
      </footer>
    </div>
  )
}

function JobCardCompact({ job }: { job: JobItem }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              {jobTypeLabels[job.jobType] || job.jobType}
            </span>
            <span className="text-xs text-gray-400">{formatTimeAgo(job.createdAt)}</span>
          </div>
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt=""
              className="mb-2 h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-sm font-medium text-gray-500">
              {job.company?.name?.charAt(0) || '?'}
            </div>
          )}
          <h3 className="font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{job.description}</p>
          <p className="mt-2 text-sm font-medium text-gray-700">{job.company?.name}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {job.location}
          </p>
          {job.salary && (
            <p className="mt-1 text-sm font-medium text-green-700">{job.salary}</p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {job._count?.applications ?? 0} คนสมัคร
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
