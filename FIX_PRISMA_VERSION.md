# 🔧 แก้ปัญหา Prisma Version Mismatch

## ปัญหาที่พบ

คุณใช้ Prisma CLI version 7.3.0 แต่ `package.json` ระบุ version 5.19.0

Prisma 7 มี breaking change - ไม่รองรับ `url` ใน `schema.prisma` อีกต่อไป

## วิธีแก้ไข (เลือก 1 วิธี)

### วิธีที่ 1: Downgrade กลับไปใช้ Prisma 5 (แนะนำ)

Prisma 5 ยังรองรับ `url` ใน schema.prisma และโค้ดที่เขียนไว้รองรับ Prisma 5

```bash
# 1. ลบ Prisma CLI global (ถ้ามี)
npm uninstall -g prisma

# 2. ติดตั้ง Prisma 5 ในโปรเจกต์
npm install prisma@5.19.0 --save-dev
npm install @prisma/client@5.19.0 --save

# 3. ตรวจสอบ version
npx prisma --version
# ควรแสดง: prisma 5.19.0

# 4. Generate Prisma Client
npx prisma generate

# 5. Push schema ไปยัง database
npx prisma db push
```

### วิธีที่ 2: Upgrade ไปใช้ Prisma 7 (ต้องแก้ไขโค้ด)

ถ้าต้องการใช้ Prisma 7 ต้องแก้ไข schema และสร้าง `prisma.config.ts`

**ขั้นตอน:**

1. **อัปเดต package.json:**
```bash
npm install prisma@latest @prisma/client@latest --save-dev --save
```

2. **แก้ไข schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  // ลบ url ออก
}
```

3. **สร้าง prisma.config.ts:**
```typescript
import { defineConfig } from 'prisma'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

4. **แก้ไข lib/prisma.ts:**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

## คำแนะนำ

**แนะนำให้ใช้วิธีที่ 1 (Downgrade ไป Prisma 5)** เพราะ:
- ✅ โค้ดที่เขียนไว้รองรับ Prisma 5 แล้ว
- ✅ ไม่ต้องแก้ไขโค้ดมาก
- ✅ Prisma 5 ยัง stable และใช้งานได้ดี
- ✅ Prisma 7 ยังใหม่มาก อาจมี breaking changes อื่นๆ

## ตรวจสอบว่าแก้ไขสำเร็จ

```bash
# ตรวจสอบ version
npx prisma --version
# ควรแสดง: prisma 5.19.0

# Validate schema
npx prisma validate

# Generate client
npx prisma generate

# Push schema
npx prisma db push
```

## ถ้ายังมีปัญหา

ลองทำตามนี้:

```bash
# 1. ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# 2. ตรวจสอบ Prisma version
npm list prisma @prisma/client

# 3. ถ้ายังเป็น version 7 ให้ติดตั้ง version 5 โดยตรง
npm install prisma@5.19.0 @prisma/client@5.19.0 --save-dev --save

# 4. Generate และ push
npx prisma generate
npx prisma db push
```
