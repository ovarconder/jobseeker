import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateAdditionalInfoSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const updated = await prisma.application.update({
      where: { id: params.id },
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
