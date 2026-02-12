'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Globe, FileText, Train } from 'lucide-react'

export default function CompanyProfileViewPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/company/profile')
      .then((res) => res.ok && res.json())
      .then((data) => setProfile(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">กำลังโหลด...</div>
  if (!profile) return <div className="p-8">ไม่พบข้อมูลบริษัท</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/company/dashboard">← กลับไปแดชบอร์ด</Link>
        </Button>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-6">
            {profile.logo ? (
              <Image
                src={profile.logo}
                alt={profile.name}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-lg bg-gray-200 text-gray-400">
                Logo
              </div>
            )}
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.nameEn && (
            <p className="text-gray-600">ชื่ออังกฤษ: {profile.nameEn}</p>
          )}
          {(profile.contactName || profile.contactPhone) && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <p className="font-medium">ผู้ติดต่อ</p>
              <p className="text-gray-600">
                {profile.contactName || '-'} {profile.contactPhone ? `(${profile.contactPhone})` : ''}
              </p>
            </div>
          )}
          {profile.description && (
            <p className="text-gray-600">{profile.description}</p>
          )}
          {(profile.addressLine || profile.address) && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              <span>
                {profile.addressLine || profile.address}
                {(profile.subdistrict || profile.district || profile.province || profile.postalCode) && (
                  <span className="text-gray-600">
                    {' '}
                    {profile.subdistrict ? `แขวง/ตำบล ${profile.subdistrict}` : ''}
                    {profile.district ? ` เขต/อำเภอ ${profile.district}` : ''}
                    {profile.province ? ` จังหวัด ${profile.province}` : ''}
                    {profile.postalCode ? ` ${profile.postalCode}` : ''}
                  </span>
                )}
              </span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>
                {profile.phone}
                {profile.phoneExt ? ` ต่อ ${profile.phoneExt}` : ''}
              </span>
            </div>
          )}
          {profile.fax && (
            <div className="text-sm text-gray-600">แฟกซ์: {profile.fax}</div>
          )}
          {profile.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.website}
              </a>
            </div>
          )}
          {profile.googleMapUrl && (
            <div className="text-sm">
              <a href={profile.googleMapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                ดูแผนที่ Google
              </a>
            </div>
          )}
          {(profile.companyRegNo || profile.companyRegDocUrl) && (
            <div className="rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-gray-500" />
                เอกสารจดทะเบียน
              </div>
              {profile.companyRegNo && <p className="text-gray-600">เลขจดทะเบียน: {profile.companyRegNo}</p>}
              {profile.companyRegDocUrl && (
                <a href={profile.companyRegDocUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  เปิดไฟล์เอกสาร
                </a>
              )}
            </div>
          )}

          {(profile.btsLine || profile.mrtLine || profile.srtLine || profile.arlStation || profile.busLines) && (
            <div className="rounded-lg border p-3 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <Train className="h-4 w-4 text-gray-500" />
                การเดินทาง
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-gray-600">
                {profile.btsLine && <p>BTS: {profile.btsLine}{profile.btsStation ? ` / ${profile.btsStation}` : ''}</p>}
                {profile.mrtLine && <p>MRT: {profile.mrtLine}{profile.mrtStation ? ` / ${profile.mrtStation}` : ''}</p>}
                {profile.srtLine && <p>SRT: {profile.srtLine}{profile.srtStation ? ` / ${profile.srtStation}` : ''}</p>}
                {profile.arlStation && <p>ARL: {profile.arlStation}</p>}
                {profile.busLines && <p>รถเมล์: {profile.busLines}</p>}
              </div>
            </div>
          )}

          {profile.about && (
            <div className="rounded-lg border p-3">
              <p className="mb-1 text-sm font-medium">เกี่ยวกับบริษัท</p>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{profile.about}</p>
            </div>
          )}

          {(profile.welfare || profile.welfareOther) && (
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">สวัสดิการ</p>
              {profile.welfare && <p className="text-gray-600">{profile.welfare}</p>}
              {profile.welfareOther && <p className="text-gray-600">อื่นๆ: {profile.welfareOther}</p>}
            </div>
          )}

          {(profile.businessMain || profile.businessSub || profile.companySize) && (
            <div className="rounded-lg border p-3 text-sm text-gray-600">
              {profile.businessMain && <p>ประเภทธุรกิจหลัก: {profile.businessMain}</p>}
              {profile.businessSub && <p>ประเภทธุรกิจย่อย: {profile.businessSub}</p>}
              {profile.companySize && <p>ขนาดธุรกิจ: {profile.companySize}</p>}
            </div>
          )}

          {(profile.billingName || profile.billingAddress || profile.billingEmail || profile.taxId) && (
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">ข้อมูลออกบิล</p>
              <div className="mt-1 space-y-1 text-gray-600">
                {profile.billingName && <p>ชื่อบิล: {profile.billingName}</p>}
                {profile.billingAddress && <p>ที่อยู่บิล: {profile.billingAddress}</p>}
                {profile.billingEmail && <p>อีเมลบัญชี: {profile.billingEmail}</p>}
                {profile.taxId && <p>เลขผู้เสียภาษี: {profile.taxId}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
