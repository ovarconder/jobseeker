import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']),
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
    const { status } = statusSchema.parse(body)

    const user = await prisma.user.update({
      where: { id },
      data: { status },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'อัปเดตสถานะบัญชี',
        message: `สถานะบัญชีของคุณถูกเปลี่ยนเป็น: ${status}`,
        type: status === 'APPROVED' ? 'COMPANY_APPROVED' : 'COMPANY_REJECTED',
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
