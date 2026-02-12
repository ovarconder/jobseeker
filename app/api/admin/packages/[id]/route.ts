import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  creditsIncluded: z.number().int().min(0).optional(),
  features: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const pkg = await prisma.package.findUnique({ where: { id } })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const data = updateSchema.parse({
      ...body,
      price: body.price != null ? (typeof body.price === 'string' ? parseFloat(body.price) : body.price) : undefined,
      creditsIncluded: body.creditsIncluded != null ? (typeof body.creditsIncluded === 'string' ? parseInt(body.creditsIncluded, 10) : body.creditsIncluded) : undefined,
      sortOrder: body.sortOrder != null ? (typeof body.sortOrder === 'string' ? parseInt(body.sortOrder, 10) : body.sortOrder) : undefined,
    })

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price != null && { price: data.price }),
        ...(data.creditsIncluded != null && { creditsIncluded: data.creditsIncluded }),
        ...(data.features !== undefined && { features: data.features }),
        ...(data.isActive != null && { isActive: data.isActive }),
        ...(data.sortOrder != null && { sortOrder: data.sortOrder }),
      },
    })
    return NextResponse.json(pkg)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
