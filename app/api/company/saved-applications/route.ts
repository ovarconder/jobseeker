import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addSchema = z.object({
  applicationId: z.string(),
})

export async function GET(req: NextRequest) {
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

    const saved = await prisma.savedApplication.findMany({
      where: { companyId: company.id },
      include: {
        application: {
          include: {
            job: true,
            seeker: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('Error fetching saved applications:', error)
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
    const { applicationId } = addSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    })
    if (!application || application.job.companyId !== company.id) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const saved = await prisma.savedApplication.upsert({
      where: {
        companyId_applicationId: { companyId: company.id, applicationId },
      },
      create: { companyId: company.id, applicationId },
      update: {},
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error saving application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
