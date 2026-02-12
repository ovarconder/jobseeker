import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ seekerId: string }> }
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

    const { seekerId } = await params

    await prisma.savedSeeker.deleteMany({
      where: { companyId: company.id, seekerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing saved seeker:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
