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

    let currentPackageName: string | null = null
    if (company.currentPackageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: company.currentPackageId },
      })
      currentPackageName = pkg?.name ?? null
    }

    return NextResponse.json({
      creditsRemaining: company.creditsRemaining,
      currentPackageId: company.currentPackageId,
      currentPackageName: currentPackageName,
      packageExpiresAt: company.packageExpiresAt,
    })
  } catch (error) {
    console.error('Error fetching credits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
