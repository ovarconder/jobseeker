# 📝 วิธีสร้างไฟล์ .env

เนื่องจากไฟล์ `.env` ถูกป้องกันโดยระบบเพื่อความปลอดภัย คุณต้องสร้างเองด้วยวิธีใดวิธีหนึ่งต่อไปนี้:

## วิธีที่ 1: คัดลอกจาก Template (แนะนำ)

```bash
# คัดลอกไฟล์ template
cp env.template .env

# แก้ไขไฟล์ .env ด้วย editor ที่คุณชอบ
code .env
# หรือ
nano .env
# หรือ
vim .env
```

## วิธีที่ 2: สร้างด้วย Terminal

```bash
# สร้างไฟล์ .env
touch .env

# เปิดไฟล์ด้วย editor
code .env
```

แล้วคัดลอกเนื้อหาจาก `env.template` ไปใส่ใน `.env`

## วิธีที่ 3: สร้างด้วยคำสั่งเดียว

```bash
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-secret-key"

# LINE Bot
LINE_CHANNEL_ACCESS_TOKEN="your-line-channel-access-token"
LINE_CHANNEL_SECRET="your-line-channel-secret"
LINE_LIFF_ID="your-liff-app-id"
NEXT_PUBLIC_LIFF_ID="your-liff-app-id"
EOF
```

## หลังจากสร้างไฟล์ .env แล้ว

1. เปิดไฟล์ `.env` ด้วย text editor
2. แก้ไขค่าต่างๆ ตามที่คุณมี:
   - `DATABASE_URL` - ใส่ URI จาก Supabase หรือ local database
   - `NEXTAUTH_SECRET` - สร้างด้วย `openssl rand -base64 32`
   - `LINE_CHANNEL_ACCESS_TOKEN` - จาก LINE Developers Console
   - `LINE_CHANNEL_SECRET` - จาก LINE Developers Console
   - `LINE_LIFF_ID` และ `NEXT_PUBLIC_LIFF_ID` - LIFF App ID จาก LINE

## ตรวจสอบว่าไฟล์ถูกสร้างแล้ว

```bash
ls -la .env
```

ถ้าเห็นไฟล์ `.env` แสดงว่าสำเร็จแล้ว! ✅

## หมายเหตุ

- ไฟล์ `.env` ถูก ignore โดย `.gitignore` แล้ว (จะไม่ถูก commit)
- อย่าแชร์ไฟล์ `.env` ให้ใคร
- สำหรับ Production บน Vercel ให้ตั้งค่า Environment Variables ใน Vercel Dashboard แทน
