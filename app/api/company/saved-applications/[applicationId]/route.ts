import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
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

    const { applicationId } = await params

    await prisma.savedApplication.deleteMany({
      where: {
        companyId: company.id,
        applicationId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing saved application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
