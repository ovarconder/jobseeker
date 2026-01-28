import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSimpleSchema = z.object({
  lineUserId: z.string(),
  displayName: z.string(),
  pictureUrl: z.string().optional(),
  phone: z.string().min(1, 'เบอร์โทรศัพท์จำเป็นต้องกรอก'),
  isElderly: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSimpleSchema.parse(body)

    // Check if already registered
    const existing = await prisma.jobSeeker.findUnique({
      where: { lineUserId: data.lineUserId },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered' },
        { status: 400 }
      )
    }

    const seeker = await prisma.jobSeeker.create({
      data: {
        lineUserId: data.lineUserId,
        displayName: data.displayName,
        pictureUrl: data.pictureUrl,
        phone: data.phone,
        isElderly: data.isElderly,
      },
    })

    return NextResponse.json(seeker, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
