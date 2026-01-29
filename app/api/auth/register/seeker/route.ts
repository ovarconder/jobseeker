import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const seekerRegisterSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  phone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = seekerRegisterSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user with SEEKER role
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: 'SEEKER',
        status: 'APPROVED', // Auto-approve seekers
      },
    })

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ คุณสามารถเข้าสู่ระบบได้เลย' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}
