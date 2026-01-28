#!/bin/bash
# Script สำหรับแก้ปัญหาทั้งหมด (esbuild + Prisma)

set -e  # Stop on error

echo "🧹 ขั้นตอนที่ 1: ลบ node_modules และ lock files..."
sudo rm -rf node_modules
rm -f package-lock.json yarn.lock pnpm-lock.yaml

echo "🧹 ขั้นตอนที่ 2: Clear npm cache..."
npm cache clean --force

echo "📦 ขั้นตอนที่ 3: ติดตั้ง esbuild (รองรับ macOS เก่า)..."
npm install esbuild@^0.19.0 --save-dev --no-save || echo "⚠️  esbuild อาจติดตั้งแล้ว"

echo "📦 ขั้นตอนที่ 4: ติดตั้ง dependencies..."
npm install

echo "📦 ขั้นตอนที่ 5: ติดตั้ง Prisma 5.19.0 (lock version)..."
npm install prisma@5.19.0 --save-dev --exact
npm install @prisma/client@5.19.0 --save --exact

echo "✅ ขั้นตอนที่ 6: ตรวจสอบ Prisma version..."
./node_modules/.bin/prisma --version

echo ""
echo "✅ เสร็จสิ้น! ขั้นตอนถัดไป:"
echo "1. npm run prisma:generate"
echo "2. npm run db:push"
echo ""
echo "หรือใช้คำสั่ง:"
echo "./node_modules/.bin/prisma generate"
echo "./node_modules/.bin/prisma db push"
