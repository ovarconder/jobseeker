import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, DollarSign, Clock, Building2, Calendar, FileText, User } from 'lucide-react'
import { ApplyButton } from '@/components/apply-button'
import { auth } from '@/lib/auth'

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'งานเต็มเวลา',
  PART_TIME: 'งาน part-time',
  CONTRACT: 'สัญญาจ้าง',
  INTERNSHIP: 'ฝึกงาน',
}

async function getJob(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
    })
    return job
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await getJob(id)
  const session = await auth()

  if (!job) {
    notFound()
  }

  // Check if user has already applied (only for logged-in seekers)
  let hasApplied = false
  if (session?.user?.role === 'SEEKER') {
    try {
      // Find JobSeeker for web user
      const seeker = await prisma.jobSeeker.findFirst({
        where: { lineUserId: `web_${session.user.id}` },
      })
      
      if (seeker) {
        const existing = await prisma.application.findUnique({
          where: {
            jobId_seekerId: {
              jobId: id,
              seekerId: seeker.id,
            },
          },
        })
        hasApplied = !!existing
      }
    } catch (error) {
      console.error('Error checking application:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              JobSeeker
            </Link>
            <div className="flex gap-4">
              {session ? (
                <Link href={session.user.role === 'COMPANY' ? '/company/dashboard' : '/'}>
                  <Button variant="ghost">
                    {session.user.role === 'COMPANY' ? 'แดชบอร์ด' : 'หน้าหลัก'}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link href="/register">
                    <Button>สมัครสมาชิก</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            ← กลับไปหน้าหลัก
          </Button>
        </Link>

        {/* Job Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    {job.title}
                  </CardTitle>
                  {job.forElderly && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                      👴 ผู้สูงอายุ
                    </Badge>
                  )}
                  <Badge
                    variant={job.status === 'ACTIVE' ? 'success' : 'secondary'}
                  >
                    {job.status === 'ACTIVE' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                  </Badge>
                </div>
                {job.company && (
                  <CardDescription className="flex items-center gap-2 text-lg">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700 font-medium">{job.company.name}</span>
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Job Info Grid */}
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span className="font-medium">สถานที่:</span>
                <span>{job.location}</span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">เงินเดือน:</span>
                  <span className="text-green-700 font-semibold">{job.salary}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="font-medium">ประเภทงาน:</span>
                <span>{jobTypeLabels[job.jobType] || job.jobType}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="font-medium">จำนวนผู้สมัคร:</span>
                <span>{job._count.applications} คน</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                รายละเอียดงาน
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  คุณสมบัติผู้สมัคร
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Company Info */}
            {job.company && (
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  ข้อมูลบริษัท
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">ชื่อบริษัท:</span> {job.company.name}
                  </p>
                  {job.company.description && (
                    <p className="text-gray-700">
                      <span className="font-medium">รายละเอียด:</span> {job.company.description}
                    </p>
                  )}
                  {job.company.address && (
                    <p className="text-gray-700">
                      <span className="font-medium">ที่อยู่:</span> {job.company.address}
                    </p>
                  )}
                  {job.company.phone && (
                    <p className="text-gray-700">
                      <span className="font-medium">เบอร์โทร:</span> {job.company.phone}
                    </p>
                  )}
                  {job.company.website && (
                    <p className="text-gray-700">
                      <span className="font-medium">เว็บไซต์:</span>{' '}
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {job.company.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <div className="pt-6 border-t">
              {job.status === 'ACTIVE' ? (
                <ApplyButton jobId={job.id} hasApplied={hasApplied} />
              ) : (
                <Button disabled className="w-full" size="lg">
                  งานนี้ปิดรับสมัครแล้ว
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
