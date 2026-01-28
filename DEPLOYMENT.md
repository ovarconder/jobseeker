# 🚀 คู่มือการ Deploy ไปยัง Vercel

## สารบัญ
1. [การเตรียมตัวก่อน Deploy](#การเตรียมตัวก่อน-deploy)
2. [การตั้งค่า GitHub](#การตั้งค่า-github)
3. [การตั้งค่า Database](#การตั้งค่า-database)
4. [การ Deploy ไปยัง Vercel](#การ-deploy-ไปยัง-vercel)
5. [การตั้งค่า LINE Bot](#การตั้งค่า-line-bot)
6. [Troubleshooting](#troubleshooting)

---

## การเตรียมตัวก่อน Deploy

### 1. ตรวจสอบไฟล์สำคัญ

```bash
# ตรวจสอบว่าไฟล์เหล่านี้มีอยู่
ls -la | grep -E "(package.json|next.config.js|tsconfig.json|prisma/schema.prisma)"
```

### 2. ตรวจสอบ Build

```bash
# ทดสอบ build ในเครื่อง
npm run build
```

ถ้า build สำเร็จ แสดงว่าโค้ดพร้อม deploy แล้ว

### 3. สร้าง NEXTAUTH_SECRET

```bash
# สร้าง secret key
openssl rand -base64 32
```

เก็บค่าไว้สำหรับตั้งค่าใน Vercel

---

## การตั้งค่า GitHub

### ขั้นตอนที่ 1: สร้าง Repository บน GitHub

1. ไปที่ https://github.com/new
2. ตั้งชื่อ repository (เช่น `jobseeker-platform`)
3. **อย่า** check "Initialize this repository with a README"
4. คลิก "Create repository"

### ขั้นตอนที่ 2: Push Code ไปยัง GitHub

```bash
# ตรวจสอบสถานะ git
git status

# ถ้ายังไม่ใช่ git repository
git init

# เพิ่ม remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit
git commit -m "Initial commit: Job Matching Platform"

# เปลี่ยน branch เป็น main (ถ้ายังไม่ใช่)
git branch -M main

# Push ไปยัง GitHub
git push -u origin main
```

### ขั้นตอนที่ 3: ตรวจสอบ .gitignore

ตรวจสอบว่าไฟล์เหล่านี้อยู่ใน `.gitignore`:
- `.env`
- `.env.local`
- `.env*.local`
- `node_modules/`
- `.next/`
- `.vercel/`

---

## การตั้งค่า Database

### ตัวเลือกที่ 1: Vercel Postgres (แนะนำ)

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Project → **Storage** → **Create Database**
3. เลือก **Postgres**
4. เลือก Region: **Singapore (sin1)** (ใกล้ไทยที่สุด)
5. ตั้งชื่อ Database
6. คลิก **Create**
7. คัดลอก **Connection String** (จะใช้ในขั้นตอนถัดไป)

### ตัวเลือกที่ 2: Supabase (ฟรี)

1. ไปที่ https://supabase.com
2. สร้าง Account และ Project ใหม่
3. ไปที่ **Settings** → **Database**
4. คัดลอก **Connection string** (URI format)
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **สำหรับ Production**: แนะนำให้ใช้ **Connection Pooling** แทน (ดูในแท็บ Connection pooling)
   - Pooling Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

**📖 ดูคำแนะนำละเอียดใน `SUPABASE_SETUP.md`**

### ตัวเลือกที่ 3: Neon (ฟรี)

1. ไปที่ https://neon.tech
2. สร้าง Account และ Project ใหม่
3. คัดลอก **Connection String**

---

## การ Deploy ไปยัง Vercel

### ขั้นตอนที่ 1: สร้าง Project บน Vercel

1. ไปที่ https://vercel.com/dashboard
2. คลิก **Add New Project**
3. Import repository จาก GitHub
4. เลือก repository ที่เพิ่งสร้าง
5. ตั้งค่า Project:
   - **Framework Preset**: Next.js (auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `prisma generate && next build` (มีใน `vercel.json` แล้ว)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables

**สำคัญมาก!** ต้องตั้งค่าทุกตัวแปรเหล่านี้:

| Variable Name | ค่าที่ต้องกรอก | หมายเหตุ |
|--------------|---------------|---------|
| `DATABASE_URL` | `postgresql://...` | Connection string จาก database |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | URL ของ Vercel project (จะได้หลัง deploy) |
| `NEXTAUTH_SECRET` | `[secret ที่สร้างไว้]` | ใช้ `openssl rand -base64 32` |
| `LINE_CHANNEL_ACCESS_TOKEN` | `[token จาก LINE]` | จาก LINE Developers Console |
| `LINE_CHANNEL_SECRET` | `[secret จาก LINE]` | จาก LINE Developers Console |
| `LINE_LIFF_ID` | `[liff-id]` | LIFF App ID |
| `NEXT_PUBLIC_LIFF_ID` | `[liff-id]` | ใช้ค่าเดียวกับ `LINE_LIFF_ID` |

**วิธีตั้งค่า:**
1. ในหน้า Project Settings → Environment Variables
2. เพิ่มแต่ละตัวแปร
3. เลือก Environment: **Production, Preview, Development** (เลือกทั้งหมด)
4. คลิก **Save**

### ขั้นตอนที่ 3: Deploy

1. หลังจากตั้งค่า Environment Variables แล้ว
2. คลิก **Deploy**
3. รอให้ build เสร็จ (ประมาณ 2-5 นาที)
4. ตรวจสอบว่า build สำเร็จ

### ขั้นตอนที่ 4: ตั้งค่า Database Schema

หลังจาก deploy สำเร็จ:

```bash
# วิธีที่ 1: ใช้ Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# วิธีที่ 2: ใช้ local terminal (ต้อง set DATABASE_URL ก่อน)
export DATABASE_URL="your-production-database-url"
npx prisma migrate deploy

# (Optional) Seed data
npm run db:seed
```

---

## การตั้งค่า LINE Bot

### 1. ตั้งค่า Webhook URL

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. เลือก Channel ของคุณ
3. ไปที่ **Messaging API** → **Webhook settings**
4. ตั้งค่า Webhook URL: `https://your-project.vercel.app/api/line/webhook`
5. คลิก **Update**
6. คลิก **Verify** เพื่อทดสอบ webhook
7. Enable **Use webhook**

### 2. ตั้งค่า LIFF URLs

1. ไปที่ LINE Developers Console → **LIFF**
2. แก้ไข LIFF App ที่สร้างไว้
3. อัปเดต Endpoint URLs:
   - **Register**: `https://your-project.vercel.app/liff/register`
   - **Profile**: `https://your-project.vercel.app/liff/profile`
4. คลิก **Update**

### 3. ตั้งค่า Auto-reply (Optional)

1. ไปที่ **Messaging API** → **Auto-reply messages**
2. Disable **Auto-reply messages** (ถ้าต้องการใช้ webhook แทน)

---

## Troubleshooting

### ❌ Build ล้มเหลว

**อาการ**: Build error ใน Vercel

**วิธีแก้**:
1. ตรวจสอบ build logs ใน Vercel Dashboard
2. ตรวจสอบว่า `prisma generate` ทำงานได้
3. ตรวจสอบ environment variables ครบถ้วน
4. ทดสอบ build ในเครื่อง: `npm run build`

### ❌ Database Connection Error

**อาการ**: Error connecting to database

**วิธีแก้**:
1. ตรวจสอบ `DATABASE_URL` format ถูกต้อง
2. ตรวจสอบว่า database อนุญาต connection จากภายนอก
3. สำหรับ Supabase: ใช้ Connection Pooling URL แทน
4. ตรวจสอบ firewall settings ของ database

### ❌ LINE Webhook ไม่ทำงาน

**อาการ**: LINE Bot ไม่ตอบกลับ

**วิธีแก้**:
1. ตรวจสอบ Webhook URL ถูกต้อง
2. ตรวจสอบ `LINE_CHANNEL_SECRET` ถูกต้อง
3. ดู logs ใน Vercel Dashboard → Functions → `/api/line/webhook`
4. ทดสอบ webhook ด้วย LINE Developers Console → Verify

### ❌ LIFF ไม่ทำงาน

**อาการ**: LIFF page แสดง error

**วิธีแก้**:
1. ตรวจสอบ `NEXT_PUBLIC_LIFF_ID` ถูกตั้งค่า
2. ตรวจสอบ LIFF URLs ใน LINE Developers Console
3. ตรวจสอบว่า LIFF App อยู่ใน Channel เดียวกัน
4. ตรวจสอบ console ใน browser สำหรับ error messages

### ❌ NextAuth ไม่ทำงาน

**อาการ**: Login ไม่ได้

**วิธีแก้**:
1. ตรวจสอบ `NEXTAUTH_URL` ตั้งเป็น production URL
2. ตรวจสอบ `NEXTAUTH_SECRET` ถูกตั้งค่า
3. ตรวจสอบ callback URL ใน NextAuth config

### ❌ Prisma Migration Error

**อาการ**: `prisma migrate deploy` ล้มเหลว

**วิธีแก้**:
1. ตรวจสอบ `DATABASE_URL` ถูกต้อง
2. ตรวจสอบว่า database มีสิทธิ์สร้าง tables
3. ลองใช้ `npx prisma db push` แทน (สำหรับ development)

---

## คำสั่งที่มีประโยชน์

```bash
# ดู logs จาก Vercel
vercel logs

# Pull environment variables
vercel env pull .env.local

# Deploy ใหม่
vercel --prod

# ดู deployment status
vercel inspect
```

---

## Checklist ก่อน Deploy

- [ ] Code ถูก push ไปยัง GitHub แล้ว
- [ ] Build ทำงานได้ในเครื่อง (`npm run build`)
- [ ] Environment variables ครบถ้วนใน Vercel
- [ ] Database ถูกสร้างและได้ connection string แล้ว
- [ ] `NEXTAUTH_SECRET` ถูกสร้างแล้ว
- [ ] LINE Channel credentials พร้อมแล้ว
- [ ] LIFF App ถูกสร้างแล้ว
- [ ] Migration files ถูก commit แล้ว
- [ ] Webhook URL ถูกอัปเดตใน LINE Developers Console
- [ ] LIFF URLs ถูกอัปเดตใน LINE Developers Console

---

## สรุป

หลังจากทำตามขั้นตอนทั้งหมด:
1. ✅ Project จะถูก deploy บน Vercel
2. ✅ Database schema จะถูกสร้าง
3. ✅ LINE Bot จะทำงานผ่าน webhook
4. ✅ LIFF pages จะสามารถเข้าถึงได้ผ่าน LINE

**URL ที่สำคัญ:**
- Production URL: `https://your-project.vercel.app`
- Webhook URL: `https://your-project.vercel.app/api/line/webhook`
- LIFF Register: `https://your-project.vercel.app/liff/register`
- LIFF Profile: `https://your-project.vercel.app/liff/profile`
