import { FlexMessage, FlexBubble, FlexCarousel, FlexButton, FlexComponent, FlexBox, FlexText } from '@line/bot-sdk'

export function createWelcomeMessage(liffUrl: string, simpleLiffUrl?: string): FlexMessage {
  const buttons: FlexButton[] = []
  
  if (simpleLiffUrl) {
    buttons.push({
      type: 'button',
      style: 'primary',
      height: 'sm',
      action: {
        type: 'uri',
        label: 'ลงทะเบียนแบบง่าย (ผู้สูงอายุ)',
        uri: simpleLiffUrl,
      },
      color: '#4F46E5',
    } as FlexButton)
  }
  
  buttons.push({
    type: 'button',
    style: simpleLiffUrl ? 'secondary' : 'primary',
    height: 'sm',
    action: {
      type: 'uri',
      label: simpleLiffUrl ? 'ลงทะเบียนแบบเต็ม' : 'ลงทะเบียน',
      uri: liffUrl,
    },
    ...(simpleLiffUrl ? {} : { color: '#4F46E5' }),
  } as FlexButton)

  return {
    type: 'flex',
    altText: 'ยินดีต้อนรับสู่ระบบหางาน',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://via.placeholder.com/1024x300/4F46E5/FFFFFF?text=Job+Matching+Platform',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'ยินดีต้อนรับ! 👋',
            weight: 'bold',
            size: 'xl',
            color: '#1F2937',
          },
          {
            type: 'text',
            text: 'ระบบหางานสำหรับผู้สูงอายุ',
            margin: 'md',
            size: 'sm',
            color: '#6B7280',
          },
          {
            type: 'text',
            text: simpleLiffUrl 
              ? 'เลือกวิธีลงทะเบียน:\n• แบบง่าย: กรอกแค่เบอร์โทร (สำหรับผู้สูงอายุ)\n• แบบเต็ม: กรอกข้อมูลครบถ้วน'
              : 'กรุณาลงทะเบียนเพื่อเริ่มใช้งาน',
            margin: 'md',
            size: 'sm',
            color: '#6B7280',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: buttons,
      },
    },
  }
}

export function createMainMenu(): FlexMessage {
  return {
    type: 'flex',
    altText: 'เมนูหลัก',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'เมนูหลัก',
            weight: 'bold',
            size: 'xl',
            color: '#1F2937',
          },
          {
            type: 'separator',
            margin: 'md',
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '🔍 ดูงานทั้งหมด',
              data: 'action=browse_jobs',
            },
            color: '#4F46E5',
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '📝 ใบสมัครของฉัน',
              data: 'action=my_applications',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '👤 แก้ไขโปรไฟล์',
              data: 'action=edit_profile',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: '🔔 การแจ้งเตือน',
              data: 'action=notifications',
            },
          },
        ],
      },
    },
  }
}

export function createJobBubble(job: any, liffUrl: string): FlexBubble {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: job.company?.logo || 'https://via.placeholder.com/400x200',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: (() => {
            const baseContents: FlexComponent[] = [
              {
                type: 'text',
                text: job.title,
                weight: 'bold',
                size: 'xl',
                wrap: true,
                flex: 1,
              },
            ]
            if (job.forElderly) {
              baseContents.push({
                type: 'text' as const,
                text: '👴',
                size: 'sm' as const,
                flex: 0,
              } as FlexText)
            }
            return baseContents
          })(),
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'md',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'บริษัท:',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: job.company?.name || 'ไม่ระบุ',
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 5,
                },
              ],
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'สถานที่:',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: job.location,
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 5,
                },
              ],
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'เงินเดือน:',
                  color: '#aaaaaa',
                  size: 'sm',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: job.salary || 'ไม่ระบุ',
                  wrap: true,
                  color: '#666666',
                  size: 'sm',
                  flex: 5,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'postback',
            label: 'ดูรายละเอียด',
            data: `action=job_details&jobId=${job.id}`,
          },
          color: '#4F46E5',
        },
        {
          type: 'button',
          style: 'secondary',
          height: 'sm',
          action: {
            type: 'postback',
            label: 'สมัครงาน',
            data: `action=apply_job&jobId=${job.id}`,
          },
        },
      ],
    },
  }
}

export function createJobCarousel(jobs: any[], liffUrl: string): FlexMessage {
  const bubbles = jobs.slice(0, 10).map((job) => createJobBubble(job, liffUrl))

  return {
    type: 'flex',
    altText: `พบงาน ${jobs.length} ตำแหน่ง`,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  }
}

export function createJobDetailsMessage(job: any, liffUrl: string, hasApplied: boolean): FlexMessage {
  // Build body contents
  const bodyContents: FlexComponent[] = [
    {
      type: 'text',
      text: job.title,
      weight: 'bold',
      size: 'xl',
      wrap: true,
    },
    {
      type: 'separator',
      margin: 'md',
    },
    {
      type: 'text',
      text: job.description,
      wrap: true,
      margin: 'md',
      size: 'sm',
      color: '#666666',
    },
    {
      type: 'box',
      layout: 'vertical',
      margin: 'md',
      spacing: 'sm',
      contents: [
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'บริษัท:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: job.company?.name || 'ไม่ระบุ',
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'สถานที่:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: job.location,
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'เงินเดือน:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: job.salary || 'ไม่ระบุ',
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'ประเภท:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: getJobTypeText(job.jobType),
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
        ...(job.forElderly ? [{
          type: 'box' as const,
          layout: 'baseline' as const,
          spacing: 'sm' as const,
          contents: [
            {
              type: 'text' as const,
              text: 'สำหรับ:',
              color: '#aaaaaa',
              size: 'sm' as const,
              flex: 1,
            },
            {
              type: 'text' as const,
              text: '👴 ผู้สูงอายุ',
              wrap: true,
              color: '#4F46E5',
              size: 'sm' as const,
              weight: 'bold' as const,
              flex: 5,
            },
          ],
        } as FlexBox] : []),
      ],
    },
  ]

  if (job.requirements) {
    bodyContents.push(
      {
        type: 'text' as const,
        text: 'คุณสมบัติ:',
        weight: 'bold' as const,
        margin: 'md' as const,
        size: 'sm' as const,
      } as FlexText,
      {
        type: 'text' as const,
        text: job.requirements,
        wrap: true,
        margin: 'sm' as const,
        size: 'sm' as const,
        color: '#666666',
      } as FlexText
    )
  }

  // Build footer contents
  const footerContents: FlexComponent[] = []
  if (!hasApplied) {
    footerContents.push({
      type: 'button' as const,
      style: 'primary' as const,
      height: 'sm' as const,
      action: {
        type: 'postback' as const,
        label: 'สมัครงาน',
        data: `action=apply_job&jobId=${job.id}`,
      },
      color: '#4F46E5',
    } as FlexButton)
  }
  footerContents.push({
    type: 'button',
    style: 'secondary',
    height: 'sm',
    action: {
      type: 'postback',
      label: 'กลับไปดูงานทั้งหมด',
      data: 'action=browse_jobs',
    },
  })

  return {
    type: 'flex',
    altText: `รายละเอียดงาน: ${job.title}`,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: bodyContents,
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: footerContents,
      },
    },
  }
}

export function createApplicationBubble(application: any): FlexBubble {
  const statusEmoji = getStatusEmoji(application.status)
  const statusText = getStatusText(application.status)

  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: `${statusEmoji} ${application.job.title}`,
          weight: 'bold',
          size: 'lg',
          wrap: true,
        },
        {
          type: 'text',
          text: application.job.company?.name || 'ไม่ระบุ',
          size: 'sm',
          color: '#666666',
          margin: 'sm',
        },
        {
          type: 'separator',
          margin: 'md',
        },
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: 'สถานะ:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: statusText,
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
        {
          type: 'box',
          layout: 'baseline',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: 'วันที่สมัคร:',
              color: '#aaaaaa',
              size: 'sm',
              flex: 1,
            },
            {
              type: 'text',
              text: new Date(application.createdAt).toLocaleDateString('th-TH'),
              wrap: true,
              color: '#666666',
              size: 'sm',
              flex: 5,
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'secondary',
          height: 'sm',
          action: {
            type: 'postback',
            label: 'ดูรายละเอียด',
            data: `action=application_details&applicationId=${application.id}`,
          },
        },
      ],
    },
  }
}

export function createApplicationCarousel(applications: any[]): FlexMessage {
  const bubbles = applications.map((app) => createApplicationBubble(app))

  return {
    type: 'flex',
    altText: `ใบสมัคร ${applications.length} รายการ`,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  }
}

export function createSuccessMessage(message: string): FlexMessage {
  return {
    type: 'flex',
    altText: message,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '✅ สำเร็จ',
            weight: 'bold',
            size: 'xl',
            color: '#10B981',
          },
          {
            type: 'text',
            text: message,
            wrap: true,
            margin: 'md',
            size: 'sm',
            color: '#666666',
          },
        ],
      },
    },
  }
}

export function createErrorMessage(message: string): FlexMessage {
  return {
    type: 'flex',
    altText: message,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '❌ เกิดข้อผิดพลาด',
            weight: 'bold',
            size: 'xl',
            color: '#EF4444',
          },
          {
            type: 'text',
            text: message,
            wrap: true,
            margin: 'md',
            size: 'sm',
            color: '#666666',
          },
        ],
      },
    },
  }
}

function getJobTypeText(jobType: string): string {
  const types: Record<string, string> = {
    FULL_TIME: 'งานเต็มเวลา',
    PART_TIME: 'งาน part-time',
    CONTRACT: 'สัญญาจ้าง',
    INTERNSHIP: 'ฝึกงาน',
  }
  return types[jobType] || jobType
}

function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    PENDING: '⏳',
    REVIEWING: '👀',
    ACCEPTED: '✅',
    REJECTED: '❌',
    WITHDRAWN: '↩️',
  }
  return emojis[status] || '📄'
}

function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    PENDING: 'รอตรวจสอบ',
    REVIEWING: 'กำลังพิจารณา',
    ACCEPTED: 'รับแล้ว',
    REJECTED: 'ปฏิเสธ',
    WITHDRAWN: 'ถอนการสมัคร',
  }
  return texts[status] || status
}
