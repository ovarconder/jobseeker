import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { lineClient } from '@/lib/line-client'
import { z } from 'zod'

const applicationUpdateSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        seeker: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'COMPANY') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
      })

      if (user?.company?.id !== application.job.companyId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = applicationUpdateSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: { include: { user: true } },
          },
        },
        seeker: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Check permissions
    if (session.user.role === 'COMPANY') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true },
      })

      if (user?.company?.id !== application.job.companyId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const oldStatus = application.status
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: { status: data.status },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        seeker: true,
      },
    })

    // Send LINE notification if status changed
    if (oldStatus !== data.status && application.seeker.lineUserId) {
      const statusMessages: Record<string, string> = {
        REVIEWING: 'กำลังพิจารณาใบสมัครของคุณ',
        ACCEPTED: 'ยินดีด้วย! คุณได้รับการตอบรับเข้าทำงาน',
        REJECTED: 'ขออภัย ใบสมัครของคุณไม่ผ่านการพิจารณา',
      }

      const message = statusMessages[data.status]
      if (message) {
        try {
          await lineClient.pushMessage(application.seeker.lineUserId, {
            type: 'text',
            text: `🔔 ${message}\n\nตำแหน่ง: ${application.job.title}\nบริษัท: ${application.job.company.name}`,
          })
        } catch (error) {
          console.error('Error sending LINE notification:', error)
        }
      }

      // Create notification
      await prisma.notification.create({
        data: {
          seekerId: application.seekerId,
          title: 'อัปเดตสถานะใบสมัคร',
          message: `${message} - ${application.job.title}`,
          type: 'APPLICATION_STATUS_CHANGED',
        },
      })
    }

    return NextResponse.json(updatedApplication)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
