import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSeekerJobMatch, type MatchCriteria } from '@/lib/match-seeker'

export type SeekerWithMatch = {
  id: string
  displayName: string
  pictureUrl: string | null
  phone: string | null
  email: string | null
  age: number | null
  education: string | null
  experience: string | null
  skills: string | null
  resumeUrl: string | null
  preferredArea: string | null
  transitLineColors: string | null
  preferredJobTypes: string | null
  expectedSalaryMin: number | null
  expectedSalaryMax: number | null
  match: MatchCriteria
  appliedJobIds?: string[]
  resumeCompleteness: number
  updatedAt: string
  saved?: boolean
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user?.role !== 'COMPANY' && session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user?.id },
      include: { company: true },
    })
    const companyId = user?.company?.id
    if (!companyId && session.user?.role === 'COMPANY') {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const area = searchParams.get('area')?.trim() || undefined
    const transitLine = searchParams.get('transitLine')?.trim() || undefined
    const jobId = searchParams.get('jobId')?.trim() || undefined
    const sort = searchParams.get('sort') || 'latest'
    const category = searchParams.get('category')?.trim() || undefined
    const province = searchParams.get('province')?.trim() || undefined

    const where: {
      preferredArea?: { contains: string; mode: 'insensitive' }
      transitLineColors?: { contains: string }
      skills?: { contains: string; mode: 'insensitive' }
    } = {}
    if (area) {
      where.preferredArea = { contains: area, mode: 'insensitive' }
    } else if (province) {
      where.preferredArea = { contains: province, mode: 'insensitive' }
    }
    if (transitLine) {
      where.transitLineColors = { contains: `"${transitLine}"` }
    }
    if (category) {
      where.skills = { contains: category, mode: 'insensitive' }
    }

    const orderBy: { updatedAt?: 'asc' | 'desc'; age?: 'asc' | 'desc'; expectedSalaryMin?: 'asc' | 'desc' }[] = []
    if (sort === 'latest') orderBy.push({ updatedAt: 'desc' })
    else if (sort === 'salary_asc') orderBy.push({ expectedSalaryMin: 'asc' })
    else if (sort === 'salary_desc') orderBy.push({ expectedSalaryMin: 'desc' })
    else if (sort === 'age_asc') orderBy.push({ age: 'asc' })
    else if (sort === 'age_desc') orderBy.push({ age: 'desc' })
    else orderBy.push({ updatedAt: 'desc' })

    const [seekers, total, totalAll, savedSeekerIds] = await Promise.all([
      prisma.jobSeeker.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: {
          applications: { select: { jobId: true } },
        },
        orderBy: orderBy.length ? orderBy : [{ updatedAt: 'desc' }],
        take: 100,
      }),
      prisma.jobSeeker.count({
        where: Object.keys(where).length ? where : undefined,
      }),
      prisma.jobSeeker.count(),
      companyId
        ? prisma.savedSeeker.findMany({ where: { companyId }, select: { seekerId: true } }).then((r) => r.map((s) => s.seekerId))
        : Promise.resolve([] as string[]),
    ])

    let job = null
    if (jobId) {
      job = await prisma.job.findUnique({
        where: { id: jobId, companyId: session.user?.role === 'ADMIN' ? undefined : companyId! },
      })
    }
    if (!job && companyId) {
      const firstJob = await prisma.job.findFirst({
        where: { companyId, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      })
      job = firstJob
    }

    function resumeCompleteness(s: typeof seekers[0]) {
      const fields = [
        s.displayName,
        s.phone ?? s.email,
        s.education,
        s.experience,
        s.skills,
        s.preferredArea,
        s.expectedSalaryMin != null || s.expectedSalaryMax != null,
        s.resumeUrl,
        s.preferredJobTypes,
        s.transitLineColors,
      ]
      const filled = fields.filter((f) => f !== null && f !== undefined && f !== '').length
      return Math.round((filled / 10) * 100)
    }

    const list: SeekerWithMatch[] = seekers.map((seeker) => {
      const match: MatchCriteria = job
        ? getSeekerJobMatch(seeker, job)
        : { areaMatch: false, skillsMatch: false, jobTypeMatch: false, salaryMatch: false }
      return {
        id: seeker.id,
        displayName: seeker.displayName,
        pictureUrl: seeker.pictureUrl,
        phone: seeker.phone,
        email: seeker.email,
        age: seeker.age,
        education: seeker.education,
        experience: seeker.experience,
        skills: seeker.skills,
        resumeUrl: seeker.resumeUrl,
        preferredArea: seeker.preferredArea,
        transitLineColors: seeker.transitLineColors,
        preferredJobTypes: seeker.preferredJobTypes,
        expectedSalaryMin: seeker.expectedSalaryMin,
        expectedSalaryMax: seeker.expectedSalaryMax,
        match,
        appliedJobIds: seeker.applications.map((a) => a.jobId),
        resumeCompleteness: resumeCompleteness(seeker),
        updatedAt: seeker.updatedAt.toISOString(),
        saved: savedSeekerIds.includes(seeker.id),
      }
    })

    return NextResponse.json({ total, totalAll, list })
  } catch (error) {
    console.error('Error fetching seekers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
