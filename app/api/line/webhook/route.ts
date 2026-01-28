import { NextRequest, NextResponse } from 'next/server'
import { lineClient, lineMiddleware } from '@/lib/line-client'
import { prisma } from '@/lib/prisma'
import {
  createWelcomeMessage,
  createMainMenu,
  createJobCarousel,
  createJobDetailsMessage,
  createApplicationCarousel,
  createSuccessMessage,
  createErrorMessage,
} from '@/components/line/flex-messages'
import { WebhookEvent, MessageEvent, PostbackEvent, FollowEvent } from '@line/bot-sdk'

// Use NEXT_PUBLIC_LIFF_ID if available, fallback to LINE_LIFF_ID for server-side
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || process.env.LINE_LIFF_ID || ''
const LIFF_URL = LIFF_ID ? `https://liff.line.me/${LIFF_ID}` : ''
const LIFF_SIMPLE_REGISTER_URL = LIFF_ID ? `https://liff.line.me/${LIFF_ID}/register-simple` : ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-line-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    // Verify signature (simplified - in production use proper verification)
    const events: WebhookEvent[] = JSON.parse(body).events

    for (const event of events) {
      await handleEvent(event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleEvent(event: WebhookEvent) {
  try {
    if (event.type === 'follow') {
      await handleFollow(event as FollowEvent)
    } else if (event.type === 'message') {
      await handleMessage(event as MessageEvent)
    } else if (event.type === 'postback') {
      await handlePostback(event as PostbackEvent)
    }
  } catch (error) {
    console.error('Error handling event:', error)
  }
}

async function handleFollow(event: FollowEvent) {
  const lineUserId = event.source.userId
  if (!lineUserId) return

  // Check if user is already registered
  const seeker = await prisma.jobSeeker.findUnique({
    where: { lineUserId },
  })

  if (seeker) {
    // User is registered, show main menu
    await lineClient.replyMessage(event.replyToken, createMainMenu())
  } else {
    // New user, show welcome message with simple registration option
    await lineClient.replyMessage(
      event.replyToken,
      createWelcomeMessage(LIFF_URL, LIFF_SIMPLE_REGISTER_URL)
    )
  }
}

async function handleMessage(event: MessageEvent) {
  if (event.message.type !== 'text') return

  const lineUserId = event.source.userId
  if (!lineUserId) return

  const text = event.message.text.toLowerCase().trim()

  // Check if user is registered
  const seeker = await prisma.jobSeeker.findUnique({
    where: { lineUserId },
  })

  if (!seeker) {
    // Check if user might be elderly (could add logic here)
    // For now, show simple registration option
    await lineClient.replyMessage(
      event.replyToken,
      createWelcomeMessage(LIFF_URL, LIFF_SIMPLE_REGISTER_URL)
    )
    return
  }

  // Handle text commands
  if (text === 'เมนู' || text === 'menu' || text === 'help') {
    await lineClient.replyMessage(event.replyToken, createMainMenu())
  } else if (text === 'งาน' || text === 'jobs' || text.includes('งาน')) {
    await handleBrowseJobs(event.replyToken, seeker.id)
  } else {
    await lineClient.replyMessage(
      event.replyToken,
      {
        type: 'text',
        text: 'พิมพ์ "เมนู" เพื่อดูเมนูหลัก หรือใช้ปุ่มด้านล่าง',
      }
    )
  }
}

async function handlePostback(event: PostbackEvent) {
  const lineUserId = event.source.userId
  if (!lineUserId) return

  const data = event.postback.data
  const params = new URLSearchParams(data)

  const action = params.get('action')
  const seeker = await prisma.jobSeeker.findUnique({
    where: { lineUserId },
  })

  if (!seeker) {
    await lineClient.replyMessage(
      event.replyToken,
      createErrorMessage('กรุณาลงทะเบียนก่อนใช้งาน')
    )
    return
  }

  switch (action) {
    case 'browse_jobs':
      await handleBrowseJobs(event.replyToken, seeker.id)
      break
    case 'my_applications':
      await handleMyApplications(event.replyToken, seeker.id)
      break
    case 'edit_profile':
      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: `กรุณาแก้ไขโปรไฟล์ผ่านลิงก์นี้: ${LIFF_URL}/profile`,
      })
      break
    case 'notifications':
      await handleNotifications(event.replyToken, seeker.id)
      break
    case 'job_details':
      await handleJobDetails(event.replyToken, params.get('jobId')!, seeker.id)
      break
    case 'apply_job':
      await handleApplyJob(event.replyToken, params.get('jobId')!, seeker.id)
      break
    default:
      await lineClient.replyMessage(event.replyToken, createMainMenu())
  }
}

async function handleBrowseJobs(replyToken: string, seekerId: string) {
  // Get seeker info to check if elderly
  const seeker = await prisma.jobSeeker.findUnique({
    where: { id: seekerId },
  })

  const where: any = {
    status: 'ACTIVE',
    expiresAt: {
      gte: new Date(),
    },
  }

  // If elderly seeker, show elderly-friendly jobs first
  if (seeker?.isElderly) {
    where.forElderly = true
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  if (jobs.length === 0) {
    await lineClient.replyMessage(replyToken, {
      type: 'text',
      text: seeker?.isElderly 
        ? 'ไม่พบงานสำหรับผู้สูงอายุที่เปิดรับสมัครในขณะนี้' 
        : 'ไม่พบงานที่เปิดรับสมัครในขณะนี้',
    })
    return
  }

  await lineClient.replyMessage(replyToken, createJobCarousel(jobs, LIFF_URL))
}

async function handleJobDetails(replyToken: string, jobId: string, seekerId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
    },
  })

  if (!job) {
    await lineClient.replyMessage(replyToken, createErrorMessage('ไม่พบงานที่ต้องการ'))
    return
  }

  const hasApplied = await prisma.application.findUnique({
    where: {
      jobId_seekerId: {
        jobId,
        seekerId,
      },
    },
  })

  await lineClient.replyMessage(
    replyToken,
    createJobDetailsMessage(job, LIFF_URL, !!hasApplied)
  )
}

async function handleApplyJob(replyToken: string, jobId: string, seekerId: string) {
  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: {
      jobId_seekerId: {
        jobId,
        seekerId,
      },
    },
  })

  if (existing) {
    await lineClient.replyMessage(
      replyToken,
      createErrorMessage('คุณได้สมัครงานนี้แล้ว')
    )
    return
  }

  // Check if job exists and is active
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: { include: { user: true } } },
  })

  if (!job || job.status !== 'ACTIVE') {
    await lineClient.replyMessage(replyToken, createErrorMessage('งานนี้ไม่เปิดรับสมัครแล้ว'))
    return
  }

  // Get seeker to check if elderly
  const seeker = await prisma.jobSeeker.findUnique({
    where: { id: seekerId },
  })

  // Create application - mark as needing more info if elderly
  const application = await prisma.application.create({
    data: {
      jobId,
      seekerId,
      status: 'PENDING',
      needsMoreInfo: seeker?.isElderly || false, // Mark as needing more info for elderly
    },
  })

  // Create notification for company
  await prisma.notification.create({
    data: {
      userId: job.company.userId,
      title: 'มีใบสมัครงานใหม่',
      message: `มีผู้สมัครงานใหม่สำหรับตำแหน่ง: ${job.title}${seeker?.isElderly ? ' (ผู้สูงอายุ - ต้องการข้อมูลเพิ่มเติม)' : ''}`,
      type: 'NEW_APPLICATION',
    },
  })

  // Also notify admin if needs more info
  if (seeker?.isElderly) {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })
    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'ใบสมัครงานที่ต้องการข้อมูลเพิ่มเติม',
          message: `ผู้สมัครงานสูงอายุ: ${seeker.displayName} สมัครงาน ${job.title} - ต้องการติดต่อเพื่อขอข้อมูลเพิ่มเติม`,
          type: 'NEW_APPLICATION',
        },
      })
    }
  }

  const successMessage = seeker?.isElderly
    ? 'สมัครงานสำเร็จ! ทีมงานจะติดต่อกลับเพื่อขอข้อมูลเพิ่มเติม (เช่น ทักษะที่ถนัด, พื้นที่ที่สามารถทำงานได้)'
    : 'สมัครงานสำเร็จ! เราจะแจ้งผลการพิจารณาให้ทราบ'

  await lineClient.replyMessage(
    replyToken,
    createSuccessMessage(successMessage)
  )
}

async function handleMyApplications(replyToken: string, seekerId: string) {
  const applications = await prisma.application.findMany({
    where: { seekerId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (applications.length === 0) {
    await lineClient.replyMessage(replyToken, {
      type: 'text',
      text: 'คุณยังไม่มีใบสมัครงาน',
    })
    return
  }

  await lineClient.replyMessage(replyToken, createApplicationCarousel(applications))
}

async function handleNotifications(replyToken: string, seekerId: string) {
  const notifications = await prisma.notification.findMany({
    where: {
      seekerId,
      isRead: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  if (notifications.length === 0) {
    await lineClient.replyMessage(replyToken, {
      type: 'text',
      text: 'ไม่มีการแจ้งเตือนใหม่',
    })
    return
  }

  const messages = notifications.map((notif) => ({
    type: 'text' as const,
    text: `🔔 ${notif.title}\n${notif.message}`,
  }))

  await lineClient.replyMessage(replyToken, messages[0])
}
