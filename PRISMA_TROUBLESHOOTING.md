# 🔧 Prisma Troubleshooting Guide

## ปัญหาที่พบบ่อยและวิธีแก้ไข

### ❌ Error: EPERM - Permission Denied

**อาการ:**
```
npm error code EPERM
npm error syscall open
npm error path /Users/mac/.nvm/versions/node/v20.19.5/lib/node_modules/npm/...
```

**วิธีแก้ไข:**

#### วิธีที่ 1: แก้ไข Permissions ของ npm/nvm

```bash
# ตรวจสอบ ownership ของ nvm directory
ls -la ~/.nvm/versions/node/

# แก้ไข ownership (ถ้าจำเป็น)
sudo chown -R $(whoami) ~/.nvm
sudo chown -R $(whoami) ~/.npm
```

#### วิธีที่ 2: ใช้ Prisma จาก node_modules แทน

```bash
# ใช้ prisma จาก local node_modules
./node_modules/.bin/prisma generate

# หรือใช้ผ่าน npm scripts
npm run db:push
```

#### วิธีที่ 3: Reinstall npm/nvm

```bash
# ถ้าใช้ nvm
nvm reinstall-packages

# หรือ reinstall node version
nvm uninstall v20.19.5
nvm install v20.19.5
```

### ❌ Error: DATABASE_URL ไม่พบ

**อาการ:**
```
Environment variable not found: DATABASE_URL
```

**วิธีแก้ไข:**

1. ตรวจสอบว่ามีไฟล์ `.env`:
   ```bash
   ls -la .env
   ```

2. ถ้าไม่มี สร้างไฟล์ `.env`:
   ```bash
   cp env.template .env
   ```

3. ตั้งค่า `DATABASE_URL` ในไฟล์ `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"
   ```

4. สำหรับ Supabase:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### ❌ Error: Cannot connect to database

**อาการ:**
```
Can't reach database server
```

**วิธีแก้ไข:**

1. ตรวจสอบว่า database server ทำงานอยู่:
   ```bash
   # สำหรับ local PostgreSQL
   pg_isready
   
   # หรือ
   psql -h localhost -U postgres -c "SELECT 1"
   ```

2. ตรวจสอบ `DATABASE_URL` ถูกต้อง:
   - Format: `postgresql://user:password@host:port/database`
   - ตรวจสอบ username, password, host, port

3. สำหรับ Supabase:
   - ตรวจสอบว่า project ยัง active อยู่
   - ตรวจสอบ password ถูกต้อง
   - ลองใช้ Connection Pooling URL แทน

### ❌ Error: Schema validation failed

**อาการ:**
```
Error validating model
```

**วิธีแก้ไข:**

1. ตรวจสอบ Prisma schema syntax:
   ```bash
   npx prisma validate
   ```

2. ตรวจสอบว่า schema.prisma ไม่มี syntax errors

3. ตรวจสอบว่าใช้ Prisma version ที่รองรับ:
   ```bash
   npx prisma --version
   ```

### ❌ Error: Migration failed

**อาการ:**
```
Migration failed to apply
```

**วิธีแก้ไข:**

1. ตรวจสอบ database connection:
   ```bash
   npx prisma db pull
   ```

2. ใช้ `db push` แทน migration (สำหรับ development):
   ```bash
   npx prisma db push
   ```

3. สำหรับ production ใช้:
   ```bash
   npx prisma migrate deploy
   ```

## คำสั่ง Prisma ที่มีประโยชน์

### ตรวจสอบสถานะ
```bash
# ตรวจสอบ Prisma version
npx prisma --version

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

### Generate และ Migration
```bash
# Generate Prisma Client
npx prisma generate

# Push schema ไปยัง database (development)
npx prisma db push

# สร้าง migration
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy
```

### Database Management
```bash
# Pull schema จาก database
npx prisma db pull

# Reset database (ระวัง! จะลบข้อมูลทั้งหมด)
npx prisma migrate reset

# เปิด Prisma Studio (GUI)
npx prisma studio
```

## วิธีแก้ปัญหา Permission Error

### 1. ใช้ npm scripts แทน npx

แก้ไข `package.json` scripts ให้ใช้ prisma จาก node_modules:

```json
{
  "scripts": {
    "prisma:generate": "./node_modules/.bin/prisma generate",
    "prisma:push": "./node_modules/.bin/prisma db push",
    "prisma:migrate": "./node_modules/.bin/prisma migrate dev",
    "prisma:studio": "./node_modules/.bin/prisma studio"
  }
}
```

แล้วใช้:
```bash
npm run prisma:generate
npm run prisma:push
```

### 2. ใช้ yarn แทน npm

```bash
# ติดตั้ง yarn
npm install -g yarn

# ใช้ yarn แทน npm
yarn prisma generate
yarn prisma db push
```

### 3. ใช้ pnpm

```bash
# ติดตั้ง pnpm
npm install -g pnpm

# ใช้ pnpm
pnpm prisma generate
pnpm prisma db push
```

## Checklist การแก้ปัญหา

- [ ] ตรวจสอบว่ามีไฟล์ `.env` และ `DATABASE_URL` ถูกตั้งค่า
- [ ] ตรวจสอบว่า database server ทำงานอยู่
- [ ] ตรวจสอบ Prisma schema ไม่มี syntax errors
- [ ] ลองใช้ prisma จาก node_modules แทน npx
- [ ] ลองใช้ npm scripts แทน npx
- [ ] แก้ไข permissions ของ npm/nvm (ถ้าจำเป็น)
- [ ] Reinstall node/npm (ถ้ายังไม่ได้)

## สรุป

ถ้ายังมีปัญหา ลองใช้คำสั่งเหล่านี้ตามลำดับ:

1. ```bash
   npm run db:push
   ```

2. ```bash
   ./node_modules/.bin/prisma generate
   ./node_modules/.bin/prisma db push
   ```

3. ```bash
   # แก้ไข permissions
   sudo chown -R $(whoami) ~/.nvm ~/.npm
   ```

4. ```bash
   # Reinstall
   nvm reinstall-packages
   ```
