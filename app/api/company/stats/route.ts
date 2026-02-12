import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

    const [applicationsByApplicants, savedCount, applicationViewCount, resumeMatchingCount] =
      await Promise.all([
        prisma.application.count({
          where: { job: { companyId: company.id } },
        }),
        prisma.savedApplication.count({
          where: { companyId: company.id },
        }),
        prisma.applicationView.count({
          where: { companyId: company.id },
        }),
        prisma.application.count({
          where: {
            job: { companyId: company.id },
            status: { in: ['OPENED', 'REVIEWING', 'INTERVIEW_SCHEDULED'] },
          },
        }),
      ])

    const jobViewsCount = 0

    return NextResponse.json({
      applicationsByApplicants,
      savedApplications: savedCount,
      applicationViewHistory: applicationViewCount,
      resumeMatching: resumeMatchingCount,
      jobViews: jobViewsCount,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
