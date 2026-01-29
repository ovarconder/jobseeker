import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobCard } from '@/components/job-card'
import { prisma } from '@/lib/prisma'

async function getJobs() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    })
    return jobs
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return []
  }
}

export default async function Home() {
  const jobs = await getJobs()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">JobSeeker</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/register">
              <Button>สมัครสมาชิก</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            แพลตฟอร์มหางานสำหรับทุกคน
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            เชื่อมต่อผู้หางานกับโอกาสการทำงานที่เหมาะสม 
            รองรับการใช้งานผ่าน LINE Bot และ Web Portal
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                เริ่มต้นใช้งาน
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Jobs Section */}
        {jobs.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  งานที่เปิดรับสมัคร
                </h2>
                <p className="text-gray-600">
                  พบงานมากกว่า {jobs.length} ตำแหน่งที่กำลังเปิดรับสมัคร
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="hidden md:flex">
                  ดูงานทั้งหมด
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.slice(0, 24).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            
            {jobs.length > 24 && (
              <div className="text-center mt-8">
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8">
                    ดูงานทั้งหมด ({jobs.length} ตำแหน่ง)
                  </Button>
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                สำหรับผู้หางาน
              </CardTitle>
              <CardDescription>
                ค้นหางานที่เหมาะสมผ่าน LINE Bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ ใช้งานง่ายผ่าน LINE</li>
                <li>✓ รับการแจ้งเตือนงานใหม่</li>
                <li>✓ ติดตามสถานะใบสมัคร</li>
                <li>✓ จัดการโปรไฟล์ออนไลน์</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                สำหรับบริษัท
              </CardTitle>
              <CardDescription>
                โพสต์งานและจัดการใบสมัคร
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ โพสต์งานได้ง่าย</li>
                <li>✓ ดูและจัดการใบสมัคร</li>
                <li>✓ ติดตามสถิติการสมัคร</li>
                <li>✓ Dashboard ที่ใช้งานง่าย</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚡</span> 
                ใช้งานง่าย
              </CardTitle>
              <CardDescription>
                ระบบที่ทันสมัยและรวดเร็ว
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ รองรับ LINE Bot</li>
                <li>✓ Web Portal สมบูรณ์</li>
                <li>✓ ระบบแจ้งเตือนอัตโนมัติ</li>
                <li>✓ อัปเดตแบบ Real-time</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 md:p-12 shadow-xl border border-indigo-100 mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">วิธีการใช้งาน</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            เพียง 3 ขั้นตอนง่ายๆ คุณก็สามารถเริ่มหางานหรือหาคนทำงานได้แล้ว
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">ลงทะเบียน</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                สมัครสมาชิกเป็นผู้หางานผ่าน LINE Bot หรือเป็นบริษัทผ่าน Web Portal
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">ค้นหางาน/โพสต์งาน</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                ผู้หางานค้นหางานที่สนใจ บริษัทโพสต์ตำแหน่งงานที่เปิดรับ
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">สมัครงาน/จัดการ</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                สมัครงานได้ทันที บริษัทสามารถดูและจัดการใบสมัครได้ง่าย
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">JobSeeker</h3>
              <p className="text-gray-400 text-sm">
                แพลตฟอร์มหางานที่เชื่อมต่อผู้หางานกับโอกาสการทำงานที่เหมาะสม
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ลิงก์ด่วน</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    สมัครสมาชิก
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
              <p className="text-sm text-gray-400">
                อีเมล: support@jobseeker.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 JobSeeker Platform. สงวนลิขสิทธิ์
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
