import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create company users
  const company1Password = await bcrypt.hash('Company123!', 10)
  const company1 = await prisma.user.create({
    data: {
      email: 'company1@example.com',
      password: company1Password,
      name: 'Company 1 Owner',
      role: 'COMPANY',
      status: 'APPROVED',
      company: {
        create: {
          name: 'บริษัท เทคโนโลยี จำกัด',
          description: 'บริษัทเทคโนโลยีชั้นนำ',
          address: '123 ถนนสุขุมวิท กรุงเทพฯ',
          phone: '02-123-4567',
          website: 'https://company1.com',
        },
      },
    },
  })

  const company2Password = await bcrypt.hash('Company123!', 10)
  const company2 = await prisma.user.create({
    data: {
      email: 'company2@example.com',
      password: company2Password,
      name: 'Company 2 Owner',
      role: 'COMPANY',
      status: 'APPROVED',
      company: {
        create: {
          name: 'บริษัท การตลาด จำกัด',
          description: 'บริษัทการตลาดดิจิทัล',
          address: '456 ถนนพหลโยธิน กรุงเทพฯ',
          phone: '02-234-5678',
          website: 'https://company2.com',
        },
      },
    },
  })

  const company3Password = await bcrypt.hash('Company123!', 10)
  const company3 = await prisma.user.create({
    data: {
      email: 'company3@example.com',
      password: company3Password,
      name: 'Company 3 Owner',
      role: 'COMPANY',
      status: 'PENDING',
      company: {
        create: {
          name: 'บริษัท บริการ จำกัด',
          description: 'บริษัทให้บริการ',
          address: '789 ถนนรัชดาภิเษก กรุงเทพฯ',
          phone: '02-345-6789',
        },
      },
    },
  })

  console.log('Created company users')

  // Get companies
  const companies = await prisma.company.findMany()

  // ——— ตัวอย่างงาน 10 งาน ของบริษัท ———
  const jobTemplates10 = [
    { title: 'พนักงานขาย', description: 'รับสมัครพนักงานขายที่มีประสบการณ์ ทำงานกับทีมขายที่แข็งแกร่ง', location: 'กรุงเทพฯ', salary: '25,000 - 35,000 บาท', jobType: 'FULL_TIME' as const, requirements: 'อายุ 50-65 ปี, มีประสบการณ์ขาย', forElderly: true },
    { title: 'พนักงานต้อนรับ', description: 'รับสมัครพนักงานต้อนรับที่ยิ้มแย้มแจ่มใส มีมนุษยสัมพันธ์ดี', location: 'กรุงเทพฯ', salary: '20,000 - 30,000 บาท', jobType: 'FULL_TIME' as const, forElderly: true },
    { title: 'พนักงานทำความสะอาด', description: 'รับสมัครพนักงานทำความสะอาด ทำงานในสำนักงาน', location: 'กรุงเทพฯ', salary: '15,000 - 20,000 บาท', jobType: 'PART_TIME' as const, forElderly: true },
    { title: 'พนักงานรักษาความปลอดภัย', description: 'รับสมัครพนักงานรักษาความปลอดภัย ทำงานกะ', location: 'กรุงเทพฯ', salary: '18,000 - 25,000 บาท', jobType: 'FULL_TIME' as const, forElderly: true },
    { title: 'พนักงานขับรถส่งของ', description: 'รับสมัครพนักงานขับรถส่งของ มีใบขับขี่', location: 'กรุงเทพฯ', salary: '22,000 - 30,000 บาท', jobType: 'FULL_TIME' as const },
    { title: 'พนักงานการตลาด', description: 'รับสมัครพนักงานการตลาดดิจิทัล มีประสบการณ์', location: 'กรุงเทพฯ', salary: '30,000 - 40,000 บาท', jobType: 'FULL_TIME' as const },
    { title: 'พนักงานดูแลลูกค้า', description: 'รับสมัครพนักงานดูแลลูกค้า Call Center', location: 'กรุงเทพฯ', salary: '22,000 - 28,000 บาท', jobType: 'FULL_TIME' as const },
    { title: 'พนักงานขายออนไลน์', description: 'รับสมัครพนักงานขายออนไลน์ ทำงานที่บ้านได้', location: 'กรุงเทพฯ', salary: '20,000 - 30,000 บาท', jobType: 'PART_TIME' as const, forElderly: true },
    { title: 'พนักงานครัว', description: 'รับสมัครพนักงานครัวในร้านอาหาร', location: 'กรุงเทพฯ', salary: '18,000 - 25,000 บาท', jobType: 'FULL_TIME' as const },
    { title: 'พนักงานดูแลผู้สูงอายุ', description: 'รับสมัครพนักงานดูแลผู้สูงอายุ', location: 'กรุงเทพฯ', salary: '20,000 - 28,000 บาท', jobType: 'FULL_TIME' as const, forElderly: true },
  ]

  await prisma.applicationView.deleteMany({})
  await prisma.savedApplication.deleteMany({})
  await prisma.application.deleteMany({})
  await prisma.savedSeeker.deleteMany({})
  await prisma.jobSeeker.deleteMany({})
  await prisma.job.deleteMany({})

  const createdJobs: { id: string }[] = []
  for (let i = 0; i < jobTemplates10.length; i++) {
    const template = jobTemplates10[i]
    const job = await prisma.job.create({
      data: {
        ...template,
        companyId: companies[i % companies.length].id,
        status: 'ACTIVE',
      },
    })
    createdJobs.push(job)
  }
  console.log('Created jobs (10):', createdJobs.length)

  // ——— คนสมัครส่ง resume 16 คน ———
  const seekerTemplates = [
    { lineUserId: 'demo_seeker_01', displayName: 'สมชาย ใจดี', phone: '081-234-5678', email: 's1@example.com', age: 58, education: 'ม.ปลาย', experience: 'ขาย 20 ปี', skills: 'การขาย, การสื่อสาร', isElderly: true },
    { lineUserId: 'demo_seeker_02', displayName: 'สมหญิง รักงาน', phone: '082-345-6789', email: 's2@example.com', age: 55, education: 'ปริญญาตรี', experience: 'ต้อนรับ 15 ปี', skills: 'ต้อนรับ, ภาษาอังกฤษ', isElderly: true },
    { lineUserId: 'demo_seeker_03', displayName: 'วิชัย ขยัน', phone: '083-456-7890', age: 62, education: 'ประถม', experience: 'ทำความสะอาด 10 ปี', skills: 'ทำความสะอาด', isElderly: true },
    { lineUserId: 'demo_seeker_04', displayName: 'ประเสริฐ มากฝีมือ', phone: '084-567-8901', email: 's4@example.com', age: 52, education: 'ปวช.', experience: 'ช่าง 18 ปี', skills: 'ซ่อมบำรุง, ไฟฟ้า', isElderly: true },
    { lineUserId: 'demo_seeker_05', displayName: 'มานี มีสุข', phone: '085-678-9012', email: 's5@example.com', age: 48, education: 'ม.ปลาย', experience: 'ครัว 12 ปี', skills: 'ทำอาหารไทย', isElderly: false },
    { lineUserId: 'demo_seeker_06', displayName: 'สมศักดิ์ ตั้งใจ', phone: '086-789-0123', age: 59, education: 'ปริญญาตรี', experience: 'การตลาด 25 ปี', skills: 'การตลาด, Digital', isElderly: true },
    { lineUserId: 'demo_seeker_07', displayName: 'วรรณา ใจดี', phone: '087-890-1234', email: 's7@example.com', age: 54, education: 'ม.ปลาย', experience: 'ดูแลลูกค้า 10 ปี', skills: 'Call Center, สื่อสาร', isElderly: true },
    { lineUserId: 'demo_seeker_08', displayName: 'อนุชา ขับรถเก่ง', phone: '088-901-2345', age: 56, education: 'ม.ต้น', experience: 'ขับรถส่งของ 15 ปี', skills: 'ขับรถ, ใบขับขี่', isElderly: true },
    { lineUserId: 'demo_seeker_09', displayName: 'กัลยา พิมพ์เร็ว', phone: '089-012-3456', email: 's9@example.com', age: 45, education: 'ปวส.', experience: 'พิมพ์ข้อมูล 8 ปี', skills: 'Microsoft Office, ภาษาไทย', isElderly: false },
    { lineUserId: 'demo_seeker_10', displayName: 'ธนพล ตรวจเอกสาร', phone: '090-123-4567', age: 58, education: 'ปริญญาตรี', experience: 'ตรวจเอกสาร 20 ปี', skills: 'ตรวจสอบ, ภาษาอังกฤษ', isElderly: true },
    { lineUserId: 'demo_seeker_11', displayName: 'รุ่งฤดี ขายออนไลน์', phone: '091-234-5678', email: 's11@example.com', age: 50, education: 'ม.ปลาย', experience: 'ขายออนไลน์ 5 ปี', skills: 'ขายออนไลน์, Line, Facebook', isElderly: true },
    { lineUserId: 'demo_seeker_12', displayName: 'วีระ นวดแผนไทย', phone: '092-345-6789', age: 55, education: 'หลักสูตรนวด', experience: 'นวด 12 ปี', skills: 'นวดแผนไทย, ใบรับรอง', isElderly: true },
    { lineUserId: 'demo_seeker_13', displayName: 'เพ็ญศรี ตัดเย็บ', phone: '093-456-7890', email: 's13@example.com', age: 60, education: 'ม.ต้น', experience: 'ตัดเย็บ 30 ปี', skills: 'ตัดเย็บเสื้อผ้า', isElderly: true },
    { lineUserId: 'demo_seeker_14', displayName: 'สมหมาย ดูแลผู้สูงอายุ', phone: '094-567-8901', age: 52, education: 'ปวช. พยาบาล', experience: 'ดูแลผู้สูงอายุ 8 ปี', skills: 'ดูแลผู้สูงอายุ, อดทน', isElderly: false },
    { lineUserId: 'demo_seeker_15', displayName: 'นภา จัดดอกไม้', phone: '095-678-9012', email: 's15@example.com', age: 57, education: 'ม.ปลาย', experience: 'จัดดอกไม้ 15 ปี', skills: 'จัดดอกไม้, ออกแบบ', isElderly: true },
    { lineUserId: 'demo_seeker_16', displayName: 'บุญเลิศ ทำขนม', phone: '096-789-0123', age: 61, education: 'ม.ต้น', experience: 'ทำขนมไทย 25 ปี', skills: 'ขนมไทย, ขนมเค้ก', isElderly: true },
  ]

  const createdSeekers: { id: string }[] = []
  for (const s of seekerTemplates) {
    const { isElderly, ...rest } = s
    const seeker = await prisma.jobSeeker.create({
      data: { ...rest, isElderly: isElderly ?? false },
    })
    createdSeekers.push(seeker)
  }
  console.log('Created job seekers (16):', createdSeekers.length)

  // ใบสมัคร: ให้ 16 คนส่ง resume กระจายไปที่งาน 10 งาน
  const statuses = ['PENDING', 'OPENED', 'REVIEWING', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'] as const
  for (let s = 0; s < createdSeekers.length; s++) {
    const seekerId = createdSeekers[s].id
    const jobsToApply = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((j) => (s + j) % 3 !== 0)
    const numApps = 1 + (s % 3)
    for (let a = 0; a < numApps && a < jobsToApply.length; a++) {
      const jobIndex = jobsToApply[a % jobsToApply.length]
      const jobId = createdJobs[jobIndex].id
      const status = statuses[(s + a) % statuses.length]
      await prisma.application.upsert({
        where: {
          jobId_seekerId: { jobId, seekerId },
        },
        create: {
          jobId,
          seekerId,
          status,
          coverLetter: `สนใจงานนี้มากครับ/ค่ะ (ผู้สมัครที่ ${s + 1})`,
        },
        update: {},
      })
    }
  }
  const appCount = await prisma.application.count()
  console.log('Created applications:', appCount)

  // Packages for company
  const packageData = [
    {
      name: 'แพ็คเกจเริ่มต้น',
      description: 'เหมาะสำหรับบริษัทที่ต้องการทดลองใช้บริการ',
      price: 990,
      creditsIncluded: 10,
      features: JSON.stringify(['ประกาศงานได้ 3 ตำแหน่ง', 'ดูเรซูเม่ 10 ครั้ง', 'รองรับ 1 ผู้ใช้']),
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'แพ็คเกจมาตรฐาน',
      description: 'เหมาะสำหรับบริษัทที่รับสมัครงานเป็นประจำ',
      price: 2990,
      creditsIncluded: 50,
      features: JSON.stringify(['ประกาศงานได้ 10 ตำแหน่ง', 'ดูเรซูเม่ 50 ครั้ง', 'ค้นหาประวัติตามพื้นที่/สาย BTS']),
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'แพ็คเกจองค์กร',
      description: 'เหมาะสำหรับองค์กรขนาดใหญ่',
      price: 9990,
      creditsIncluded: 200,
      features: JSON.stringify(['ประกาศงานไม่จำกัด', 'เครดิต 200 หน่วย', 'รายงานสถิติ', 'รองรับหลายผู้ใช้']),
      isActive: true,
      sortOrder: 3,
    },
  ]
  for (const pkg of packageData) {
    const existing = await prisma.package.findFirst({ where: { name: pkg.name } })
    if (!existing) {
      await prisma.package.create({
        data: {
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          creditsIncluded: pkg.creditsIncluded,
          features: pkg.features,
          isActive: pkg.isActive,
          sortOrder: pkg.sortOrder,
        },
      })
    }
  }
  console.log('Created packages for company')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
