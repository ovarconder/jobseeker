import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id, companyId: company.id },
      include: { package: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.status === 'PAID') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    const creditsToAdd = order.package.creditsIncluded
    const newCredits = company.creditsRemaining + creditsToAdd
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status: 'PAID', paidAt: new Date() },
      }),
      prisma.company.update({
        where: { id: company.id },
        data: {
          creditsRemaining: newCredits,
          currentPackageId: order.packageId,
          packageExpiresAt: expiresAt,
        },
      }),
    ])

    const updated = await prisma.company.findUnique({
      where: { id: company.id },
    })

    return NextResponse.json({
      success: true,
      creditsRemaining: updated?.creditsRemaining ?? newCredits,
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
