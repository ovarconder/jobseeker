import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
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
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            แพลตฟอร์มหางานสำหรับทุกคน
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            เชื่อมต่อผู้หางานกับโอกาสการทำงานที่เหมาะสม 
            รองรับการใช้งานผ่าน LINE Bot และ Web Portal
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                เริ่มต้นใช้งาน
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">วิธีการใช้งาน</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">ลงทะเบียน</h3>
              <p className="text-sm text-gray-600">
                สมัครสมาชิกเป็นผู้หางานผ่าน LINE Bot หรือเป็นบริษัทผ่าน Web Portal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">ค้นหางาน/โพสต์งาน</h3>
              <p className="text-sm text-gray-600">
                ผู้หางานค้นหางานที่สนใจ บริษัทโพสต์ตำแหน่งงานที่เปิดรับ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">สมัครงาน/จัดการ</h3>
              <p className="text-sm text-gray-600">
                สมัครงานได้ทันที บริษัทสามารถดูและจัดการใบสมัครได้ง่าย
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 JobSeeker Platform. สงวนลิขสิทธิ์
          </p>
        </div>
      </footer>
    </div>
  )
}
