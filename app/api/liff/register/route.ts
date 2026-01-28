import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  lineUserId: z.string(),
  displayName: z.string(),
  pictureUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  age: z.number().optional().nullable(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

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
        email: data.email || null,
        age: data.age,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
      },
    })

    return NextResponse.json(seeker, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
