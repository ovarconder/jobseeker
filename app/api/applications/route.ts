import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const needsMoreInfo = searchParams.get('needsMoreInfo')

    const where: any = {}

    if (jobId) where.jobId = jobId
    if (status) where.status = status
    if (needsMoreInfo === 'true') where.needsMoreInfo = true

    // If company user, only show applications for their jobs
    if (session.user?.role === 'COMPANY') {
      const user = await prisma.user.findUnique({
        where: { id: session.user?.id },
        include: { company: true },
      })

      if (user?.company) {
        where.job = {
          companyId: user.company.id,
        }
      }
    }

    if (companyId) {
      where.job = {
        companyId,
      }
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            company: true,
          },
        },
        seeker: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const data = applicationSchema.parse(body)

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: { company: { include: { user: true } } },
    })

    if (!job || job.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Job not found or not active' },
        { status: 400 }
      )
    }

    // For web users, use session.user.id (must be SEEKER role)
    // For LINE users, seekerId should come from the request body
    let seekerId = body.seekerId
    
    if (!seekerId && session?.user) {
      // Check if user is a SEEKER
      if (session.user.role !== 'SEEKER') {
        return NextResponse.json(
          { error: 'Only job seekers can apply for jobs' },
          { status: 403 }
        )
      }
      
      // For web users, create or find JobSeeker using userId as lineUserId
      // (This is a workaround since JobSeeker currently only has lineUserId)
      let seeker = await prisma.jobSeeker.findFirst({
        where: { 
          lineUserId: `web_${session.user.id}`,
        },
      })
      
      if (!seeker) {
        // Create JobSeeker record for web user
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
        })
        
        seeker = await prisma.jobSeeker.create({
          data: {
            lineUserId: `web_${session.user.id}`,
            displayName: user?.name || 'User',
            email: user?.email,
            phone: user?.phone,
          },
        })
      }
      
      seekerId = seeker.id
    }
    
    if (!seekerId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to apply.' },
        { status: 401 }
      )
    }

    // Check if already applied
    const existing = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId: data.jobId,
          seekerId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already applied for this job' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        seekerId,
        coverLetter: data.coverLetter,
        status: 'PENDING',
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        seeker: true,
      },
    })

    // Create notification for company
    await prisma.notification.create({
      data: {
        userId: job.company.userId,
        title: 'มีใบสมัครงานใหม่',
        message: `มีผู้สมัครงานใหม่สำหรับตำแหน่ง: ${job.title}`,
        type: 'NEW_APPLICATION',
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
