import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const seeker = await prisma.jobSeeker.findUnique({
      where: { id },
    })

    if (!seeker) {
      return NextResponse.json({ error: 'Seeker not found' }, { status: 404 })
    }

    const company = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    })
    const saved = company?.company
      ? await prisma.savedSeeker.findUnique({
          where: {
            companyId_seekerId: { companyId: company.company.id, seekerId: id },
          },
        })
      : null

    const fields = [
      seeker.displayName,
      seeker.phone ?? seeker.email,
      seeker.education,
      seeker.experience,
      seeker.skills,
      seeker.preferredArea,
      seeker.expectedSalaryMin != null || seeker.expectedSalaryMax != null,
      seeker.resumeUrl,
      seeker.preferredJobTypes,
      seeker.transitLineColors,
    ]
    const filled = fields.filter((f) => f !== null && f !== undefined && f !== '').length
    const resumeCompleteness = Math.round((filled / 10) * 100)

    return NextResponse.json({
      ...seeker,
      saved: !!saved,
      resumeCompleteness,
    })
  } catch (error) {
    console.error('Error fetching seeker:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
