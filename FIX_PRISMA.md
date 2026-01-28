# 🔧 วิธีแก้ปัญหา Prisma Error

## ปัญหาที่พบ

คุณพบ error เกี่ยวกับ permission กับ npm/nvm และ prisma command not found

## วิธีแก้ไข (ทำตามลำดับ)

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install
```

ถ้ามี permission error กับ npm:

```bash
# วิธีที่ 1: ใช้ sudo (ไม่แนะนำ แต่ใช้ได้)
sudo npm install

# วิธีที่ 2: แก้ไข permissions
sudo chown -R $(whoami) ~/.npm
npm install

# วิธีที่ 3: ใช้ yarn แทน
npm install -g yarn
yarn install
```

### ขั้นตอนที่ 2: ใช้ Prisma ผ่าน npm scripts

หลังจากติดตั้ง dependencies แล้ว ใช้คำสั่งเหล่านี้:

```bash
# Generate Prisma Client
npm run build  # จะรัน prisma generate อัตโนมัติ

# หรือแยกทำ
npm exec prisma generate

# Push schema ไปยัง database
npm run db:push

# สร้าง migration
npm run db:migrate

# เปิด Prisma Studio
npm run db:studio
```

### ขั้นตอนที่ 3: ถ้ายังมี Permission Error

#### แก้ไข Permissions ของ npm/nvm

```bash
# ตรวจสอบ ownership
ls -la ~/.nvm/versions/node/

# แก้ไข ownership
sudo chown -R $(whoami) ~/.nvm
sudo chown -R $(whoami) ~/.npm

# ลองใหม่
npm install
```

#### หรือใช้ yarn/pnpm แทน

```bash
# ติดตั้ง yarn
npm install -g yarn

# ใช้ yarn
yarn install
yarn prisma generate
yarn prisma db push
```

### ขั้นตอนที่ 4: ตรวจสอบ DATABASE_URL

ตรวจสอบว่าไฟล์ `.env` มี `DATABASE_URL` ถูกต้อง:

```bash
# ดูไฟล์ .env
cat .env | grep DATABASE_URL
```

ถ้ายังไม่ได้ตั้งค่า ให้แก้ไขไฟล์ `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## คำสั่งที่ควรรัน (ตามลำดับ)

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตรวจสอบ .env มี DATABASE_URL
cat .env | grep DATABASE_URL

# 3. Generate Prisma Client
npm exec prisma generate

# 4. Push schema ไปยัง database
npm run db:push

# 5. (Optional) Seed data
npm run db:seed
```

## ถ้ายังไม่ได้ผล

ลองวิธีนี้:

```bash
# 1. ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# 2. ใช้ npx โดยตรง (ถ้า permission แก้ไขแล้ว)
npx prisma generate
npx prisma db push

# 3. หรือใช้ yarn
yarn install
yarn prisma generate
yarn prisma db push
```

## ตรวจสอบว่า Prisma ทำงานได้

```bash
# ตรวจสอบ version
npm exec prisma --version

# Validate schema
npm exec prisma validate

# Format schema
npm exec prisma format
```

## สรุป

ปัญหาหลักคือ:
1. **Dependencies ยังไม่ได้ติดตั้ง** → รัน `npm install`
2. **Permission error** → แก้ไข permissions หรือใช้ yarn
3. **DATABASE_URL ไม่ถูกตั้งค่า** → ตรวจสอบไฟล์ `.env`

ลองทำตามขั้นตอนด้านบนตามลำดับครับ! 🚀
