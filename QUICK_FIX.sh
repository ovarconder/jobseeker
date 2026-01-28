#!/bin/bash
# Script สำหรับแก้ปัญหา npm ENOTEMPTY error

echo "🧹 กำลังลบ node_modules และ lock files..."
rm -rf node_modules package-lock.json

echo "🧹 กำลัง clear npm cache..."
npm cache clean --force

echo "📦 กำลังติดตั้ง dependencies..."
npm install

echo "📦 กำลังติดตั้ง Prisma 5.19.0..."
npm install prisma@5.19.0 @prisma/client@5.19.0 --save-dev --save

echo "✅ เสร็จสิ้น! ตรวจสอบ version:"
npx prisma --version

echo ""
echo "📝 ขั้นตอนถัดไป:"
echo "1. npx prisma generate"
echo "2. npx prisma db push"
