#!/bin/bash
# Script สำหรับย้าย route groups เป็น regular folders

set -e

echo "🔄 กำลังย้าย route groups..."

# 1. ย้าย admin routes
if [ -d "app/(admin)" ]; then
  echo "📁 ย้าย app/(admin) → app/admin"
  mkdir -p app/admin
  cp -r app/\(admin\)/* app/admin/
  rm -rf app/\(admin\)
  echo "✅ ย้าย admin routes สำเร็จ"
else
  echo "⚠️  ไม่พบ app/(admin)"
fi

# 2. ย้าย company routes
if [ -d "app/(company)" ]; then
  echo "📁 ย้าย app/(company) → app/company"
  mkdir -p app/company
  cp -r app/\(company\)/* app/company/
  rm -rf app/\(company\)
  echo "✅ ย้าย company routes สำเร็จ"
else
  echo "⚠️  ไม่พบ app/(company)"
fi

echo ""
echo "✅ เสร็จสิ้น! ตรวจสอบโครงสร้าง:"
echo "ls -la app/admin/"
echo "ls -la app/company/"
echo ""
echo "📝 ขั้นตอนถัดไป:"
echo "1. git add ."
echo "2. git commit -m 'Fix route conflicts: move route groups to regular folders'"
echo "3. git push"
