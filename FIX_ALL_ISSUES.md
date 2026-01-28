# 🔧 แก้ปัญหาทั้งหมด (esbuild + Prisma)

## ปัญหาที่พบ

1. **esbuild error**: `Symbol not found: _SecTrustCopyCertificateChain` - macOS version compatibility
2. **Prisma CLI**: ยังเป็น version 7.3.0 แทนที่จะเป็น 5.19.0
3. **ENOTEMPTY errors**: node_modules มีปัญหา

## วิธีแก้ไข (ทำตามลำดับ)

### ขั้นตอนที่ 1: ลบ node_modules แบบ force

```bash
# ปิด editor/IDE ทั้งหมดก่อน

# ลบ node_modules แบบ force
sudo rm -rf node_modules

# ลบ lock files
rm -f package-lock.json yarn.lock pnpm-lock.yaml

# Clear npm cache
npm cache clean --force
```

### ขั้นตอนที่ 2: แก้ปัญหา esbuild (macOS compatibility)

เพิ่ม esbuild version ที่รองรับ macOS เก่าใน package.json:

```json
{
  "overrides": {
    "esbuild": "^0.19.0"
  }
}
```

หรือติดตั้ง esbuild โดยตรง:

```bash
npm install esbuild@^0.19.0 --save-dev
```

### ขั้นตอนที่ 3: ติดตั้ง dependencies

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# ถ้ามี error เกี่ยวกับ esbuild ให้ติดตั้ง esbuild ก่อน
npm install esbuild@^0.19.0 --save-dev
npm install
```

### ขั้นตอนที่ 4: ติดตั้ง Prisma 5 โดยตรง

```bash
# ลบ Prisma CLI global (ถ้ามี)
npm uninstall -g prisma

# ติดตั้ง Prisma 5 ในโปรเจกต์
npm install prisma@5.19.0 --save-dev --exact
npm install @prisma/client@5.19.0 --save --exact

# ตรวจสอบ version
./node_modules/.bin/prisma --version
# ควรแสดง: prisma 5.19.0
```

### ขั้นตอนที่ 5: ใช้ Prisma จาก node_modules

```bash
# ใช้ Prisma จาก node_modules แทน npx
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
```

## Script แบบครบถ้วน

```bash
#!/bin/bash

echo "🧹 กำลังลบ node_modules..."
sudo rm -rf node_modules
rm -f package-lock.json

echo "🧹 กำลัง clear npm cache..."
npm cache clean --force

echo "📦 กำลังติดตั้ง esbuild (รองรับ macOS เก่า)..."
npm install esbuild@^0.19.0 --save-dev

echo "📦 กำลังติดตั้ง dependencies..."
npm install

echo "📦 กำลังติดตั้ง Prisma 5.19.0..."
npm install prisma@5.19.0 --save-dev --exact
npm install @prisma/client@5.19.0 --save --exact

echo "✅ ตรวจสอบ Prisma version:"
./node_modules/.bin/prisma --version

echo ""
echo "📝 ขั้นตอนถัดไป:"
echo "1. ./node_modules/.bin/prisma generate"
echo "2. ./node_modules/.bin/prisma db push"
```

## วิธีแก้ปัญหา esbuild (ถ้ายังมีปัญหา)

### วิธีที่ 1: ใช้ esbuild version เก่า

```bash
npm install esbuild@0.19.12 --save-dev
```

### วิธีที่ 2: ใช้ platform-specific install

```bash
npm install esbuild-darwin-arm64@0.19.12 --save-dev
# หรือ
npm install esbuild-darwin-x64@0.19.12 --save-dev
```

### วิธีที่ 3: ใช้ yarn แทน npm

```bash
# ติดตั้ง yarn
npm install -g yarn

# ใช้ yarn
yarn install
```

## ตรวจสอบ macOS version

```bash
sw_vers
```

ถ้าเป็น macOS 10.x หรือ 11.x อาจต้องใช้ esbuild version เก่า

## สรุปคำสั่งที่ควรรัน

```bash
# 1. ลบ node_modules
sudo rm -rf node_modules package-lock.json

# 2. Clear cache
npm cache clean --force

# 3. ติดตั้ง esbuild เก่า (รองรับ macOS เก่า)
npm install esbuild@^0.19.0 --save-dev

# 4. ติดตั้ง dependencies
npm install

# 5. ติดตั้ง Prisma 5
npm install prisma@5.19.0 @prisma/client@5.19.0 --save-dev --save --exact

# 6. ใช้ Prisma จาก node_modules
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
```
