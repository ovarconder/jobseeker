import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  lineUserId: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  age: z.number().optional().nullable(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lineUserId = searchParams.get('lineUserId')

    if (!lineUserId) {
      return NextResponse.json({ error: 'lineUserId required' }, { status: 400 })
    }

    const seeker = await prisma.jobSeeker.findUnique({
      where: { lineUserId },
    })

    if (!seeker) {
      return NextResponse.json({ error: 'Seeker not found' }, { status: 404 })
    }

    return NextResponse.json(seeker)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const data = profileUpdateSchema.parse(body)

    const seeker = await prisma.jobSeeker.update({
      where: { lineUserId: data.lineUserId },
      data: {
        phone: data.phone,
        email: data.email || null,
        age: data.age,
        education: data.education,
        experience: data.experience,
        skills: data.skills,
      },
    })

    return NextResponse.json(seeker)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
