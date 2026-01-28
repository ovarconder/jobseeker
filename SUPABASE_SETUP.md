# 🔗 วิธีตั้งค่า Supabase Database URI

## ขั้นตอนการได้ URI จาก Supabase

### 1. เข้าสู่ Supabase Dashboard
1. ไปที่ https://supabase.com
2. Login และเลือก Project ของคุณ

### 2. หา Connection String
1. ไปที่ **Settings** (ไอคอนฟันเฟือง) → **Database**
2. เลื่อนลงไปหา **Connection string**
3. เลือกแท็บ **URI**
4. คัดลอก Connection String

**รูปแบบ URI ของ Supabase:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**ตัวอย่าง:**
```
postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## 📍 ใส่ URI ที่ไหน?

### 1️⃣ สำหรับ Local Development (ในเครื่อง)

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```bash
# สร้างไฟล์ .env
touch .env
```

เปิดไฟล์ `.env` และใส่:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**⚠️ หมายเหตุ:**
- แทนที่ `[YOUR-PASSWORD]` ด้วย password จริงของ Supabase database
- แทนที่ `[PROJECT-REF]` ด้วย project reference ของคุณ
- อย่าลืมใส่ password ในเครื่องหมายคำพูด `""`

**ตัวอย่างจริง:**
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres"
```

### 2️⃣ สำหรับ Vercel (Production)

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่ **Settings** → **Environment Variables**
4. คลิก **Add New**
5. ใส่:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **Environment**: เลือก **Production, Preview, Development** (เลือกทั้งหมด)
6. คลิก **Save**

---

## 🔐 วิธีหา Password ของ Supabase

ถ้าลืม password:

1. ไปที่ Supabase Dashboard → **Settings** → **Database**
2. ไปที่ส่วน **Database password**
3. คลิก **Reset database password**
4. ตั้ง password ใหม่
5. ใช้ password ใหม่ใน Connection String

---

## 🔄 ใช้ Connection Pooling (แนะนำสำหรับ Production)

สำหรับ Production บน Vercel แนะนำให้ใช้ **Connection Pooling** แทน:

### หา Pooling Connection String

1. ไปที่ Supabase Dashboard → **Settings** → **Database**
2. เลื่อนลงไปหา **Connection pooling**
3. เลือกแท็บ **Session mode** หรือ **Transaction mode**
4. คัดลอก Connection String

**รูปแบบ Pooling URI:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**ตัวอย่าง:**
```
postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### ข้อดีของ Connection Pooling
- ✅ รองรับ connection จำนวนมาก
- ✅ เหมาะสำหรับ serverless (Vercel)
- ✅ มีประสิทธิภาพดีกว่า

---

## ✅ ตรวจสอบว่าเชื่อมต่อได้

หลังจากตั้งค่าแล้ว ทดสอบด้วย:

```bash
# ตรวจสอบ connection
npx prisma db pull

# หรือ push schema
npx prisma db push
```

ถ้าไม่มี error แสดงว่าเชื่อมต่อสำเร็จ! 🎉

---

## 📝 ตัวอย่างไฟล์ .env ครบถ้วน

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:YourPassword@db.YourProjectRef.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# LINE Bot
LINE_CHANNEL_ACCESS_TOKEN="your-line-token"
LINE_CHANNEL_SECRET="your-line-secret"
LINE_LIFF_ID="your-liff-id"
NEXT_PUBLIC_LIFF_ID="your-liff-id"
```

---

## ⚠️ ข้อควรระวัง

1. **อย่า commit `.env` ไปยัง GitHub** - ไฟล์นี้อยู่ใน `.gitignore` แล้ว
2. **ใช้ Connection Pooling สำหรับ Production** - เหมาะกับ Vercel
3. **เก็บ password ไว้เป็นความลับ** - อย่าแชร์ให้ใคร
4. **ใช้ Environment Variables ใน Vercel** - อย่า hardcode ในโค้ด

---

## 🆘 Troubleshooting

### Error: "Connection refused"
- ตรวจสอบว่า Supabase project ยัง active อยู่
- ตรวจสอบ password ถูกต้อง
- ตรวจสอบ project reference ถูกต้อง

### Error: "Too many connections"
- ใช้ Connection Pooling แทน
- ตรวจสอบว่าไม่ได้เปิด connection หลายตัวพร้อมกัน

### Error: "SSL required"
- Supabase ต้องการ SSL connection
- Prisma จะจัดการให้อัตโนมัติ ไม่ต้องตั้งค่าเพิ่ม

---

## 📚 เอกสารเพิ่มเติม

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/using-prisma-with-supabase)
