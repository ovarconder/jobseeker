import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addSchema = z.object({
  seekerId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: { userId: session.user.id },
    })
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const list = await prisma.savedSeeker.findMany({
      where: { companyId: company.id },
      select: { seekerId: true },
    })

    return NextResponse.json(list.map((s) => s.seekerId))
  } catch (error) {
    console.error('Error fetching saved seekers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: { userId: session.user.id },
    })
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const body = await req.json()
    const { seekerId } = addSchema.parse(body)

    const seeker = await prisma.jobSeeker.findUnique({
      where: { id: seekerId },
    })
    if (!seeker) {
      return NextResponse.json({ error: 'Seeker not found' }, { status: 404 })
    }

    await prisma.savedSeeker.upsert({
      where: {
        companyId_seekerId: { companyId: company.id, seekerId },
      },
      create: { companyId: company.id, seekerId },
      update: {},
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error saving seeker:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
