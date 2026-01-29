# 🔧 แก้ปัญหา Vercel ยังใช้ GitHub Account เก่า (zablink)

## ปัญหาที่พบ

- Vercel เชื่อมต่อกับ GitHub account `zablink` (ผิด)
- ต้องการใช้ account `ovarconder` (ถูกต้อง)
- Login เข้าไป `ovarconder` ได้แล้ว แต่ Settings → Git ยังแสดง `zablink` อยู่
- ไม่สามารถใช้ repository ที่แท้จริงได้

## วิธีแก้ไข (ทำตามลำดับ)

### ขั้นตอนที่ 1: Disconnect Account เก่า (zablink) ทั้งหมด

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. ไปที่ **Settings** (ไอคอนฟันเฟืองด้านบนขวา) → **Git**
3. หา GitHub integration ที่เชื่อมต่อกับ `zablink`
4. คลิก **Disconnect** หรือ **Remove**
5. ยืนยันการ disconnect

**ถ้าไม่เห็นปุ่ม Disconnect:**
- ไปที่ **Connected Accounts** section
- หา GitHub account `zablink`
- คลิก **...** → **Disconnect**

### ขั้นตอนที่ 2: Revoke Vercel Access ใน GitHub (สำคัญ!)

1. ไปที่ GitHub → **Settings** → **Applications** → **Authorized OAuth Apps**
   - หรือไปที่: `https://github.com/settings/applications`
2. หา **Vercel** ในรายการ
3. คลิก **Vercel**
4. ตรวจสอบว่าเชื่อมต่อกับ account ไหน (`zablink` หรือ `ovarconder`)
5. ถ้าเป็น `zablink`:
   - คลิก **Revoke access** หรือ **Revoke**
   - ยืนยันการ revoke

### ขั้นตอนที่ 3: Revoke จาก Account `zablink` โดยตรง

1. Login เข้า GitHub ด้วย account `zablink`
2. ไปที่ GitHub → **Settings** → **Applications** → **Authorized OAuth Apps**
3. หา **Vercel**
4. คลิก **Revoke access**

### ขั้นตอนที่ 4: Clear Browser Cache/Cookies (ถ้าจำเป็น)

1. **Chrome/Edge:**
   - กด `Ctrl+Shift+Delete` (Windows) หรือ `Cmd+Shift+Delete` (Mac)
   - เลือก "Cookies and other site data"
   - เลือก "All time"
   - คลิก **Clear data**

2. **หรือใช้ Incognito/Private Mode:**
   - เปิด Vercel Dashboard ใน Incognito/Private window
   - Login ใหม่

### ขั้นตอนที่ 5: Connect Account ใหม่ (`ovarconder`)

1. ไปที่ Vercel Dashboard → **Settings** → **Git**
2. คลิก **Connect Git Provider** หรือ **Add Git Provider**
3. เลือก **GitHub**
4. **สำคัญ**: ตรวจสอบว่า login ด้วย account `ovarconder` (ไม่ใช่ `zablink`)
5. Authorize Vercel ให้เข้าถึง GitHub
6. เลือก repositories ที่ต้องการ:
   - ✅ เลือก `ovarconder/jobseeker`
   - ❌ อย่าเลือก repositories จาก `zablink`

### ขั้นตอนที่ 6: เชื่อมต่อ Project กับ Repository ใหม่

1. ไปที่ Vercel Dashboard → **Project** → **Settings** → **Git**
2. คลิก **Disconnect** (ถ้ายังเชื่อมต่อกับ repository เก่าอยู่)
3. คลิก **Connect Git Repository**
4. **ตรวจสอบว่าแสดง account `ovarconder`** (ไม่ใช่ `zablink`)
5. เลือก repository: `ovarconder/jobseeker`
6. คลิก **Connect**

### ขั้นตอนที่ 7: ตรวจสอบว่าเชื่อมต่อถูกต้อง

1. ไปที่ Vercel Dashboard → **Project** → **Settings** → **Git**
2. ตรวจสอบว่าแสดง:
   - **Repository**: `ovarconder/jobseeker` ✅
   - **Owner**: `ovarconder` ✅
   - **ไม่ใช่**: `zablink` ❌

### ขั้นตอนที่ 8: Trigger Deployment

```bash
# Push commit ใหม่เพื่อ trigger deployment
git commit --allow-empty -m "Fix Vercel GitHub account connection"
git push
```

## ถ้ายังไม่ได้ผล

### วิธีที่ 1: ลบ Project และสร้างใหม่

1. ไปที่ Vercel Dashboard → **Project** → **Settings** → **General**
2. เลื่อนลงไปหา **Delete Project**
3. คลิก **Delete** (ระวัง! จะลบ deployment ทั้งหมด)
4. สร้าง Project ใหม่:
   - คลิก **Add New Project**
   - เลือก repository: `ovarconder/jobseeker`
   - ตรวจสอบว่าแสดง account `ovarconder`
   - ตั้งค่า Environment Variables ใหม่

### วิธีที่ 2: ใช้ Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# เลือก account ที่ถูกต้อง (ovarconder)
# เมื่อถาม "Which scope?" เลือก account ที่ถูกต้อง

# Link project
vercel link

# เลือก repository: ovarconder/jobseeker

# Deploy
vercel --prod
```

## Checklist

- [ ] Disconnect GitHub account `zablink` ใน Vercel
- [ ] Revoke Vercel access จาก GitHub account `zablink`
- [ ] Clear browser cache/cookies (ถ้าจำเป็น)
- [ ] Connect GitHub account `ovarconder` ใน Vercel
- [ ] ตรวจสอบว่าเชื่อมต่อกับ repository `ovarconder/jobseeker`
- [ ] ตรวจสอบใน Project Settings → Git ว่าแสดง account ถูกต้อง
- [ ] Push code เพื่อ trigger deployment
- [ ] ตรวจสอบว่า Vercel compile สำเร็จ

## ตรวจสอบว่าแก้ไขสำเร็จ

1. **ใน Vercel Dashboard:**
   - Project → Settings → Git
   - ควรแสดง: `ovarconder/jobseeker` ✅
   - ไม่ควรแสดง: `zablink` ❌

2. **ใน GitHub:**
   - ไปที่ repository: `https://github.com/ovarconder/jobseeker`
   - ตรวจสอบว่า repository อยู่ใน account `ovarconder`

3. **ทดสอบ Push:**
   ```bash
   git push
   ```
   - ตรวจสอบใน Vercel Dashboard ว่ามี deployment ใหม่

## สรุป

ปัญหานี้เกิดจาก Vercel ยังเชื่อมต่อกับ GitHub account เก่า (`zablink`) อยู่

**วิธีแก้:**
1. ✅ Disconnect account `zablink` ทั้งหมด
2. ✅ Revoke Vercel access จาก GitHub account `zablink`
3. ✅ Connect account `ovarconder` ใหม่
4. ✅ เชื่อมต่อ Project กับ repository `ovarconder/jobseeker`
5. ✅ ตรวจสอบว่าเชื่อมต่อถูกต้อง

ลองทำตามขั้นตอนด้านบนตามลำดับครับ!
