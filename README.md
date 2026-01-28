# Job Matching Platform

แพลตฟอร์มหางานสำหรับผู้สูงอายุที่รองรับ 3 ประเภทผู้ใช้:
1. **Job Seekers** (ผู้หางาน) - เข้าถึงผ่าน LINE Bot
2. **Companies** (บริษัท) - Portal สำหรับโพสต์งานและจัดการใบสมัคร
3. **Admin** (ผู้ดูแลระบบ) - Dashboard สำหรับอนุมัติและจัดการระบบ

## เทคโนโลยีที่ใช้

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **LINE Integration**: @line/bot-sdk + LIFF

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` และกรอกข้อมูลต่อไปนี้:

```bash
# สร้างไฟล์ .env
touch .env
```

กรอกข้อมูลที่จำเป็นในไฟล์ `.env`:

```env
# Database
# สำหรับ Local: ใช้ local PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"

# สำหรับ Supabase: ใช้ Connection String จาก Supabase Dashboard
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here-use-openssl-rand-base64-32"

# LINE Bot Configuration (Server-side)
LINE_CHANNEL_ACCESS_TOKEN="your-line-channel-access-token"
LINE_CHANNEL_SECRET="your-line-channel-secret"
LINE_LIFF_ID="your-liff-app-id"

# LINE LIFF (Client-side - ต้องมี NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_LIFF_ID="your-liff-app-id"
```

**หมายเหตุ**: 
- `NEXTAUTH_SECRET` สร้างได้ด้วยคำสั่ง: `openssl rand -base64 32`
- `LINE_LIFF_ID` และ `NEXT_PUBLIC_LIFF_ID` ควรใช้ค่าเดียวกัน (LIFF App ID)
- `NEXT_PUBLIC_LIFF_ID` ใช้สำหรับ client-side code (LIFF pages)
- `LINE_LIFF_ID` ใช้สำหรับ server-side code (webhook)

### 3. ตั้งค่า Database

```bash
# สร้าง database schema
npx prisma db push

# หรือใช้ migration
npx prisma migrate dev --name init

# สร้าง seed data
npm run db:seed
```

### 4. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจกต์

```
job-matching-platform/
├── app/
│   ├── (auth)/          # หน้า login/register
│   ├── (company)/       # Company portal
│   ├── (admin)/         # Admin dashboard
│   ├── api/             # API routes
│   └── liff/            # LIFF pages สำหรับ LINE users
├── components/
│   ├── ui/              # shadcn/ui components
│   └── line/            # LINE Bot components
├── lib/                 # Utilities และ configurations
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
└── types/               # TypeScript types
```

## การใช้งาน

### สำหรับ Job Seekers (LINE Bot)

1. เพิ่ม LINE Bot เป็นเพื่อน
2. ระบบจะส่งข้อความต้อนรับและลิงก์ลงทะเบียน
3. ลงทะเบียนผ่าน LIFF form
4. ใช้เมนูเพื่อ:
   - ดูงานทั้งหมด
   - ดูใบสมัครของตัวเอง
   - แก้ไขโปรไฟล์
   - ดูการแจ้งเตือน

### สำหรับ Companies

1. สมัครสมาชิกที่ `/register`
2. รอการอนุมัติจาก Admin
3. หลังจากอนุมัติแล้ว:
   - เข้าสู่ระบบที่ `/login`
   - โพสต์งานใหม่
   - ดูและจัดการใบสมัคร
   - อัปเดตสถานะใบสมัคร

### สำหรับ Admin

1. เข้าสู่ระบบด้วย:
   - Email: `admin@example.com`
   - Password: `Admin123!`
2. ใช้งาน Dashboard เพื่อ:
   - อนุมัติ/ปฏิเสธบริษัท
   - อนุมัติ/ปฏิเสธงาน
   - ดูสถิติและรายงาน

## LINE Bot Setup

### 1. สร้าง LINE Channel

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. สร้าง Provider และ Messaging API Channel
3. เก็บ Channel Access Token และ Channel Secret

### 2. ตั้งค่า Webhook

1. ใน LINE Developers Console, ไปที่ Webhook settings
2. ตั้งค่า Webhook URL: `https://your-domain.com/api/line/webhook`
3. Enable Webhook

### 3. สร้าง LIFF App

1. ใน LINE Developers Console, ไปที่ LIFF
2. สร้าง LIFF App ใหม่
3. ตั้งค่า Endpoint URL:
   - Register: `https://your-domain.com/liff/register`
   - Profile: `https://your-domain.com/liff/profile`
4. เก็บ LIFF ID

## Database Schema

### Models

- **User**: ผู้ใช้ระบบ (Admin/Company)
- **Company**: ข้อมูลบริษัท
- **JobSeeker**: ผู้หางาน (LINE users)
- **Job**: งานที่เปิดรับ
- **Application**: ใบสมัครงาน
- **Notification**: การแจ้งเตือน

## API Routes

### Public Routes
- `POST /api/auth/register` - สมัครสมาชิกบริษัท
- `POST /api/line/webhook` - LINE Bot webhook

### Protected Routes
- `GET /api/jobs` - ดูงานทั้งหมด
- `POST /api/jobs` - สร้างงาน (Company only)
- `GET /api/applications` - ดูใบสมัคร
- `POST /api/applications` - สร้างใบสมัคร
- `PUT /api/applications/[id]` - อัปเดตสถานะใบสมัคร

### Admin Routes
- `GET /api/admin/companies` - ดูบริษัททั้งหมด
- `PUT /api/admin/users/[id]/status` - อัปเดตสถานะผู้ใช้

## Deployment

### 📦 การจัดการกับ GitHub

#### 1. สร้าง Repository ใหม่บน GitHub

1. ไปที่ [GitHub](https://github.com) และสร้าง repository ใหม่
2. ตั้งชื่อ repository (เช่น `jobseeker-platform`)
3. **อย่า** initialize ด้วย README, .gitignore หรือ license (เพราะเรามีอยู่แล้ว)

#### 2. เชื่อมต่อ Local Repository กับ GitHub

```bash
# ตรวจสอบว่าเป็น git repository หรือยัง
git status

# ถ้ายังไม่ใช่ git repository
git init

# เพิ่ม remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit ครั้งแรก
git commit -m "Initial commit: Job Matching Platform"

# Push ไปยัง GitHub (ใช้ branch main)
git branch -M main
git push -u origin main
```

#### 3. ตรวจสอบไฟล์ที่ต้อง ignore

ตรวจสอบว่าไฟล์ `.env` และไฟล์สำคัญอื่นๆ อยู่ใน `.gitignore` แล้ว:
- `.env`
- `.env.local`
- `.env*.local`
- `node_modules/`
- `.next/`
- `.vercel/`

### 🚀 การ Deploy ไปยัง Vercel

#### 1. เตรียม Database

**ตัวเลือกที่ 1: ใช้ Vercel Postgres (แนะนำ)**

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Project → Storage → Create Database
3. เลือก **Postgres**
4. เลือก Region (แนะนำ: `Singapore (sin1)`)
5. สร้าง Database และเก็บ Connection String

**ตัวเลือกที่ 2: ใช้ Supabase (ฟรี)**

1. ไปที่ [Supabase](https://supabase.com) และสร้าง project ใหม่
2. ไปที่ Settings → Database
3. คัดลอก Connection String (URI format)

#### 2. สร้าง Migration Files (ถ้ายังไม่มี)

```bash
# สร้าง migration ครั้งแรก
npx prisma migrate dev --name init

# หรือใช้ db push (สำหรับ development)
npx prisma db push
```

#### 3. Deploy บน Vercel

**วิธีที่ 1: ผ่าน Vercel Dashboard (แนะนำ)**

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. คลิก **Add New Project**
3. Import repository จาก GitHub
4. เลือก repository ที่เพิ่ง push ไป
5. ตั้งค่า Project:
   - **Framework Preset**: Next.js (จะ detect อัตโนมัติ)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build` (มีใน `vercel.json` แล้ว)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **ตั้งค่า Environment Variables** (สำคัญมาก!):
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   LINE_CHANNEL_ACCESS_TOKEN=your-token
   LINE_CHANNEL_SECRET=your-secret
   LINE_LIFF_ID=your-liff-id
   NEXT_PUBLIC_LIFF_ID=your-liff-id
   ```

7. คลิก **Deploy**

**วิธีที่ 2: ผ่าน Vercel CLI**

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (เลือก account)
# - Link to existing project? No
# - Project name? (ตั้งชื่อ project)
# - Directory? ./
# - Override settings? No
```

#### 4. ตั้งค่า Database หลัง Deploy

หลังจาก deploy สำเร็จ:

```bash
# ใช้ production database URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# (Optional) Seed data
npm run db:seed
```

หรือใช้ Vercel CLI:

```bash
# Set environment variable
vercel env add DATABASE_URL

# Run migrations via Vercel
vercel exec "npx prisma migrate deploy"
```

#### 5. ตั้งค่า LINE Webhook

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เลือก Channel ของคุณ
3. ไปที่ **Messaging API** → **Webhook settings**
4. ตั้งค่า Webhook URL: `https://your-project.vercel.app/api/line/webhook`
5. Enable Webhook
6. (Optional) Disable "Use webhook" ใน Auto-reply messages

#### 6. ตั้งค่า LIFF URLs

1. ไปที่ LINE Developers Console → LIFF
2. แก้ไข LIFF App ที่สร้างไว้
3. อัปเดต Endpoint URLs:
   - Register: `https://your-project.vercel.app/liff/register`
   - Profile: `https://your-project.vercel.app/liff/profile`

### ✅ Checklist ก่อน Deploy

- [ ] ทุก environment variables ถูกตั้งค่าใน Vercel
- [ ] Database connection string ถูกต้อง
- [ ] `NEXTAUTH_URL` ตั้งเป็น production URL
- [ ] `NEXTAUTH_SECRET` ถูกสร้างและตั้งค่าแล้ว
- [ ] LINE Webhook URL ถูกอัปเดต
- [ ] LIFF URLs ถูกอัปเดต
- [ ] Migration files ถูก commit และ push แล้ว
- [ ] Build command ทำงานได้ (`npm run build`)

### 🔧 Troubleshooting

**ปัญหา: Build ล้มเหลว**
- ตรวจสอบว่า `prisma generate` ทำงานได้
- ตรวจสอบ environment variables ครบถ้วน
- ดู build logs ใน Vercel Dashboard

**ปัญหา: Database connection error**
- ตรวจสอบ `DATABASE_URL` format
- ตรวจสอบว่า database อนุญาต connection จาก Vercel IPs
- สำหรับ Supabase: ตรวจสอบ connection pooling

**ปัญหา: LINE Webhook ไม่ทำงาน**
- ตรวจสอบ Webhook URL ถูกต้อง
- ตรวจสอบ `LINE_CHANNEL_SECRET` ถูกต้อง
- ดู logs ใน Vercel Dashboard → Functions

**ปัญหา: LIFF ไม่ทำงาน**
- ตรวจสอบ `NEXT_PUBLIC_LIFF_ID` ถูกตั้งค่า
- ตรวจสอบ LIFF URLs ใน LINE Developers Console
- ตรวจสอบว่า LIFF App อยู่ใน Channel เดียวกัน

## Scripts

- `npm run dev` - รัน development server
- `npm run build` - Build สำหรับ production
- `npm run start` - รัน production server
- `npm run db:push` - Push schema ไปยัง database
- `npm run db:migrate` - สร้าง migration
- `npm run db:seed` - สร้าง seed data
- `npm run db:studio` - เปิด Prisma Studio

## License

MIT
