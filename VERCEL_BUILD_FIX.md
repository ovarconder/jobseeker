# 🔧 แก้ปัญหา Vercel ไม่ Build

## ปัญหาที่พบ

Vercel ไม่ได้ compile/deploy โค้ดหลังจาก push ไปยัง GitHub

## สิ่งที่แก้ไขแล้ว

1. **แก้ไข `vercel.json`**:
   - เปลี่ยน `buildCommand` จาก `prisma generate && next build` เป็น `npm run build`
   - ใช้ npm script แทน command โดยตรง (จะใช้ Prisma จาก node_modules)

2. **แก้ไข `package.json`**:
   - เปลี่ยน build script จาก `./node_modules/.bin/prisma generate` เป็น `prisma generate`
   - Vercel จะใช้ `npx prisma` อัตโนมัติ

## ตรวจสอบการตั้งค่าใน Vercel

### 1. ตรวจสอบ Build Settings

ไปที่ Vercel Dashboard → Project → Settings → General:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (หรือปล่อยว่างไว้ Vercel จะ detect อัตโนมัติ)
- **Output Directory**: `.next` (หรือปล่อยว่างไว้)
- **Install Command**: `npm install` (หรือปล่อยว่างไว้)

### 2. ตรวจสอบ Environment Variables

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables:

ตรวจสอบว่ามีตัวแปรเหล่านี้ครบถ้วน:

- `DATABASE_URL` ✅
- `NEXTAUTH_URL` ✅
- `NEXTAUTH_SECRET` ✅
- `LINE_CHANNEL_ACCESS_TOKEN` ✅
- `LINE_CHANNEL_SECRET` ✅
- `LINE_LIFF_ID` ✅
- `NEXT_PUBLIC_LIFF_ID` ✅

### 3. ตรวจสอบ Build Logs

ไปที่ Vercel Dashboard → Project → Deployments → เลือก deployment ล่าสุด → View Build Logs

ดูว่ามี error อะไร:
- ❌ Prisma generate failed?
- ❌ Missing environment variables?
- ❌ Build command failed?

## วิธีแก้ไข (ถ้ายังมีปัญหา)

### ขั้นตอนที่ 1: Trigger Deployment ใหม่

```bash
# ใน Vercel Dashboard
# ไปที่ Deployments → เลือก deployment → Redeploy
```

หรือ push commit ใหม่:

```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

### ขั้นตอนที่ 2: ตรวจสอบ Build Logs

ดู error ใน Build Logs และแก้ไขตาม:

**ถ้า error: "prisma: command not found"**
- ตรวจสอบว่า `prisma` อยู่ใน `devDependencies`
- Vercel จะใช้ `npx prisma` อัตโนมัติ

**ถ้า error: "DATABASE_URL not found"**
- ตรวจสอบ Environment Variables ใน Vercel
- ตั้งค่าให้ครบถ้วน

**ถ้า error: "Build failed"**
- ดู error message ใน Build Logs
- ทดสอบ build ในเครื่อง: `npm run build`

### ขั้นตอนที่ 3: ใช้ Vercel CLI (ถ้าจำเป็น)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## ตรวจสอบว่าแก้ไขสำเร็จ

1. Push code ใหม่ไปยัง GitHub
2. ตรวจสอบ Vercel Dashboard → Deployments
3. ดูว่า deployment ใหม่ถูกสร้างขึ้น
4. ตรวจสอบ Build Logs ว่า build สำเร็จ
5. ตรวจสอบว่าเว็บไซต์ทำงานได้

## คำสั่งที่ควรใช้

```bash
# 1. Commit และ push
git add .
git commit -m "Fix Vercel build configuration"
git push

# 2. ตรวจสอบใน Vercel Dashboard
# - ไปที่ Deployments
# - ดู deployment ใหม่
# - ตรวจสอบ Build Logs
```

## สรุป

- ✅ แก้ไข `vercel.json` ให้ใช้ `npm run build`
- ✅ แก้ไข `package.json` build script ให้ใช้ `prisma generate`
- ✅ ตรวจสอบ Environment Variables ใน Vercel
- ✅ ตรวจสอบ Build Logs สำหรับ errors

ลอง push code ใหม่และตรวจสอบใน Vercel Dashboard ดูครับ!
