import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  salary: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  requirements: z.string().optional(),
  forElderly: z.boolean().optional().default(false),
  expiresAt: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const search = searchParams.get('search')
    const forElderly = searchParams.get('forElderly')

    const where: any = {}
    if (status) where.status = status
    if (companyId) where.companyId = companyId
    if (forElderly === 'true') where.forElderly = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = jobSchema.parse(body)

    // Get company
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    })

    if (!user?.company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        companyId: user.company.id,
        status: 'PENDING',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        company: true,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
