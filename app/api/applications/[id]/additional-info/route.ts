import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateAdditionalInfoSchema = z.object({
  additionalSkills: z.string().optional(),
  preferredLocations: z.string().optional(),
  adminNotes: z.string().optional(),
  needsMoreInfo: z.boolean().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const data = updateAdditionalInfoSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        additionalSkills: data.additionalSkills,
        preferredLocations: data.preferredLocations,
        adminNotes: data.adminNotes,
        needsMoreInfo: data.needsMoreInfo !== undefined ? data.needsMoreInfo : application.needsMoreInfo,
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

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
