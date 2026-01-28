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

  // Create jobs
  const jobs = [
    {
      companyId: companies[0].id,
      title: 'พนักงานขาย',
      description: 'รับสมัครพนักงานขายที่มีประสบการณ์',
      location: 'กรุงเทพฯ',
      salary: '25,000 - 35,000 บาท',
      jobType: 'FULL_TIME' as const,
      requirements: 'อายุ 50-65 ปี, มีประสบการณ์ขาย',
      status: 'ACTIVE' as const,
    },
    {
      companyId: companies[0].id,
      title: 'พนักงานต้อนรับ',
      description: 'รับสมัครพนักงานต้อนรับ',
      location: 'กรุงเทพฯ',
      salary: '20,000 - 30,000 บาท',
      jobType: 'FULL_TIME' as const,
      status: 'ACTIVE' as const,
    },
    {
      companyId: companies[0].id,
      title: 'พนักงานทำความสะอาด',
      description: 'รับสมัครพนักงานทำความสะอาด',
      location: 'กรุงเทพฯ',
      salary: '15,000 - 20,000 บาท',
      jobType: 'PART_TIME' as const,
      status: 'PENDING' as const,
    },
    {
      companyId: companies[1].id,
      title: 'พนักงานการตลาด',
      description: 'รับสมัครพนักงานการตลาด',
      location: 'กรุงเทพฯ',
      salary: '30,000 - 40,000 บาท',
      jobType: 'FULL_TIME' as const,
      status: 'ACTIVE' as const,
    },
    {
      companyId: companies[1].id,
      title: 'พนักงานดูแลลูกค้า',
      description: 'รับสมัครพนักงานดูแลลูกค้า',
      location: 'กรุงเทพฯ',
      salary: '22,000 - 28,000 บาท',
      jobType: 'FULL_TIME' as const,
      status: 'ACTIVE' as const,
    },
  ]

  const createdJobs = []
  for (const job of jobs) {
    const created = await prisma.job.create({ data: job })
    createdJobs.push(created)
  }

  console.log('Created jobs:', createdJobs.length)

  // Create job seekers
  const seekers = [
    {
      lineUserId: 'U1234567890abcdef1234567890abcdef',
      displayName: 'สมชาย ใจดี',
      phone: '081-234-5678',
      email: 'somchai@example.com',
      age: 58,
      education: 'มัธยมศึกษาตอนปลาย',
      experience: 'ทำงานขายมา 20 ปี',
      skills: 'การขาย, การสื่อสาร',
    },
    {
      lineUserId: 'Uabcdef1234567890abcdef1234567890',
      displayName: 'สมหญิง รักงาน',
      phone: '082-345-6789',
      email: 'somying@example.com',
      age: 55,
      education: 'ปริญญาตรี',
      experience: 'ทำงานต้อนรับมา 15 ปี',
      skills: 'การต้อนรับ, ภาษาอังกฤษ',
    },
    {
      lineUserId: 'U9876543210fedcba9876543210fedcba',
      displayName: 'วิชัย ขยัน',
      phone: '083-456-7890',
      age: 62,
      education: 'ประถมศึกษา',
      experience: 'ทำงานทำความสะอาดมา 10 ปี',
      skills: 'ทำความสะอาด',
    },
  ]

  const createdSeekers = []
  for (const seeker of seekers) {
    const created = await prisma.jobSeeker.create({ data: seeker })
    createdSeekers.push(created)
  }

  console.log('Created job seekers:', createdSeekers.length)

  // Create applications
  const applications = [
    {
      jobId: createdJobs[0].id,
      seekerId: createdSeekers[0].id,
      status: 'PENDING' as const,
      coverLetter: 'สนใจงานนี้มาก',
    },
    {
      jobId: createdJobs[0].id,
      seekerId: createdSeekers[1].id,
      status: 'REVIEWING' as const,
    },
    {
      jobId: createdJobs[1].id,
      seekerId: createdSeekers[1].id,
      status: 'ACCEPTED' as const,
    },
    {
      jobId: createdJobs[3].id,
      seekerId: createdSeekers[0].id,
      status: 'PENDING' as const,
    },
  ]

  for (const app of applications) {
    await prisma.application.create({ data: app })
  }

  console.log('Created applications:', applications.length)
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
