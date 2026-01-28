# ✅ Checklist การตรวจสอบและแก้ไข Project

## สิ่งที่ตรวจสอบและแก้ไขแล้ว

### ✅ 1. Environment Variables
- [x] ตรวจสอบการใช้ environment variables ทั้งหมด
- [x] แก้ไข inconsistency ระหว่าง `LINE_LIFF_ID` และ `NEXT_PUBLIC_LIFF_ID`
- [x] อัปเดต webhook route ให้รองรับทั้งสองตัวแปร
- [x] สร้างเอกสารอธิบาย environment variables ใน README

### ✅ 2. Configuration Files
- [x] สร้าง `vercel.json` สำหรับการตั้งค่า Vercel
- [x] ตั้งค่า build command: `prisma generate && next build`
- [x] ตั้งค่า region: `sin1` (Singapore - ใกล้ไทย)
- [x] อัปเดต `.gitignore` ให้ครบถ้วน

### ✅ 3. Code Quality
- [x] ตรวจสอบ syntax errors (ไม่มี)
- [x] ตรวจสอบ TypeScript errors (ไม่มี)
- [x] ตรวจสอบ linter errors (ไม่มี)
- [x] แก้ไข environment variable handling ใน webhook route

### ✅ 4. Documentation
- [x] อัปเดต README.md ด้วยคำแนะนำการ deploy แบบละเอียด
- [x] สร้าง DEPLOYMENT.md สำหรับคู่มือการ deploy แบบ step-by-step
- [x] เพิ่มคำแนะนำการตั้งค่า GitHub
- [x] เพิ่มคำแนะนำการตั้งค่า Database
- [x] เพิ่มคำแนะนำการตั้งค่า LINE Bot
- [x] เพิ่ม Troubleshooting guide

### ✅ 5. Build Configuration
- [x] ตรวจสอบ `package.json` scripts
- [x] ตรวจสอบ `next.config.js`
- [x] ตรวจสอบ `tsconfig.json`
- [x] ตรวจสอบ Prisma schema

## สิ่งที่ควรตรวจสอบเพิ่มเติม

### ⚠️ 1. Database Migrations
- [ ] สร้าง migration files (ถ้ายังไม่มี)
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Commit migration files ไปยัง GitHub

### ⚠️ 2. Environment Variables
- [ ] สร้างไฟล์ `.env.example` (ถ้ายังไม่มี) - **ถูก block โดย gitignore**
- [ ] ตรวจสอบว่าทุก environment variables ถูกตั้งค่าใน Vercel

### ⚠️ 3. Testing
- [ ] ทดสอบ build ในเครื่อง: `npm run build`
- [ ] ทดสอบการเชื่อมต่อ database
- [ ] ทดสอบ LINE webhook (หลัง deploy)

### ⚠️ 4. Security
- [ ] ตรวจสอบว่า `.env` อยู่ใน `.gitignore`
- [ ] ตรวจสอบว่า sensitive data ไม่ถูก commit
- [ ] ตรวจสอบ CORS settings (ถ้ามี)

## Environment Variables ที่ต้องตั้งค่าใน Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Production URL (https://your-project.vercel.app) |
| `NEXTAUTH_SECRET` | ✅ | Secret key (ใช้ `openssl rand -base64 32`) |
| `LINE_CHANNEL_ACCESS_TOKEN` | ✅ | จาก LINE Developers Console |
| `LINE_CHANNEL_SECRET` | ✅ | จาก LINE Developers Console |
| `LINE_LIFF_ID` | ✅ | LIFF App ID (server-side) |
| `NEXT_PUBLIC_LIFF_ID` | ✅ | LIFF App ID (client-side) |

## ขั้นตอนการ Deploy

1. **เตรียม GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

2. **สร้าง Database**
   - Vercel Postgres หรือ Supabase

3. **Deploy บน Vercel**
   - Import repository จาก GitHub
   - ตั้งค่า Environment Variables
   - Deploy

4. **ตั้งค่า Database Schema**
   ```bash
   npx prisma migrate deploy
   ```

5. **ตั้งค่า LINE Bot**
   - อัปเดต Webhook URL
   - อัปเดต LIFF URLs

## ไฟล์ที่สร้าง/แก้ไข

- ✅ `vercel.json` - สร้างใหม่
- ✅ `.gitignore` - อัปเดต
- ✅ `README.md` - อัปเดตคำแนะนำการ deploy
- ✅ `DEPLOYMENT.md` - สร้างใหม่ (คู่มือละเอียด)
- ✅ `app/api/line/webhook/route.ts` - แก้ไข environment variable handling

## หมายเหตุ

- ไฟล์ `.env.example` ไม่สามารถสร้างได้เพราะถูก block โดย gitignore (ปกติ)
- ข้อมูล environment variables ถูกอธิบายใน README.md แทน
- ทุก environment variables ต้องตั้งค่าใน Vercel Dashboard

## สรุป

Project พร้อมสำหรับการ deploy ไปยัง Vercel แล้ว! 

ทำตามขั้นตอนใน `DEPLOYMENT.md` เพื่อ deploy ได้เลย 🚀
