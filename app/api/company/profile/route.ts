import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  nameEn: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  description: z.string().optional(),
  about: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  addressLine: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  subdistrict: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  companyRegNo: z.string().optional().nullable(),
  companyRegDocUrl: z.string().optional().nullable(),
  mapImageUrl: z.string().optional().nullable(),
  googleMapUrl: z.string().optional().nullable(),
  btsLine: z.string().optional().nullable(),
  btsStation: z.string().optional().nullable(),
  mrtLine: z.string().optional().nullable(),
  mrtStation: z.string().optional().nullable(),
  srtLine: z.string().optional().nullable(),
  srtStation: z.string().optional().nullable(),
  arlStation: z.string().optional().nullable(),
  busLines: z.string().optional().nullable(),
  welfare: z.string().optional().nullable(),
  welfareOther: z.string().optional().nullable(),
  businessMain: z.string().optional().nullable(),
  businessSub: z.string().optional().nullable(),
  companySize: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  phoneExt: z.string().optional().nullable(),
  fax: z.string().optional().nullable(),
  billingName: z.string().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  billingEmail: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  applyProfileToAllJobs: z.boolean().optional(),
  website: z.string().optional(),
  logo: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'COMPANY' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { name: true, email: true, lastLoginAt: true },
        },
      },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
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

    const body = await req.json()
    const data = updateSchema.parse(body)

    const updated = await prisma.company.update({
      where: { id: company.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
        ...(data.contactName !== undefined && { contactName: data.contactName }),
        ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.about !== undefined && { about: data.about }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.addressLine !== undefined && { addressLine: data.addressLine }),
        ...(data.province !== undefined && { province: data.province }),
        ...(data.district !== undefined && { district: data.district }),
        ...(data.subdistrict !== undefined && { subdistrict: data.subdistrict }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
        ...(data.companyRegNo !== undefined && { companyRegNo: data.companyRegNo }),
        ...(data.companyRegDocUrl !== undefined && { companyRegDocUrl: data.companyRegDocUrl }),
        ...(data.mapImageUrl !== undefined && { mapImageUrl: data.mapImageUrl }),
        ...(data.googleMapUrl !== undefined && { googleMapUrl: data.googleMapUrl }),
        ...(data.btsLine !== undefined && { btsLine: data.btsLine }),
        ...(data.btsStation !== undefined && { btsStation: data.btsStation }),
        ...(data.mrtLine !== undefined && { mrtLine: data.mrtLine }),
        ...(data.mrtStation !== undefined && { mrtStation: data.mrtStation }),
        ...(data.srtLine !== undefined && { srtLine: data.srtLine }),
        ...(data.srtStation !== undefined && { srtStation: data.srtStation }),
        ...(data.arlStation !== undefined && { arlStation: data.arlStation }),
        ...(data.busLines !== undefined && { busLines: data.busLines }),
        ...(data.welfare !== undefined && { welfare: data.welfare }),
        ...(data.welfareOther !== undefined && { welfareOther: data.welfareOther }),
        ...(data.businessMain !== undefined && { businessMain: data.businessMain }),
        ...(data.businessSub !== undefined && { businessSub: data.businessSub }),
        ...(data.companySize !== undefined && { companySize: data.companySize }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.phoneExt !== undefined && { phoneExt: data.phoneExt }),
        ...(data.fax !== undefined && { fax: data.fax }),
        ...(data.billingName !== undefined && { billingName: data.billingName }),
        ...(data.billingAddress !== undefined && { billingAddress: data.billingAddress }),
        ...(data.billingEmail !== undefined && { billingEmail: data.billingEmail }),
        ...(data.taxId !== undefined && { taxId: data.taxId }),
        ...(data.applyProfileToAllJobs !== undefined && { applyProfileToAllJobs: data.applyProfileToAllJobs }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.logo !== undefined && { logo: data.logo }),
      },
      include: { user: { select: { name: true, email: true, lastLoginAt: true } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating company profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
