import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  creditsIncluded: z.number().int().min(0),
  features: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const packages = await prisma.package.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSchema.parse({
      ...body,
      price: typeof body.price === 'string' ? parseFloat(body.price) : body.price,
      creditsIncluded: typeof body.creditsIncluded === 'string' ? parseInt(body.creditsIncluded, 10) : body.creditsIncluded,
      sortOrder: body.sortOrder != null ? (typeof body.sortOrder === 'string' ? parseInt(body.sortOrder, 10) : body.sortOrder) : 0,
    })

    const pkg = await prisma.package.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        creditsIncluded: data.creditsIncluded,
        features: data.features ?? null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    })
    return NextResponse.json(pkg)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 })
    }
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
