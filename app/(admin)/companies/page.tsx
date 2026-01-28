'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export default function CompaniesPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/admin/companies')
      const data = await res.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyStatus = async (userId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      toast({ title: 'อัปเดตสถานะสำเร็จ' })
      fetchCompanies()
    } catch (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: 'secondary',
      APPROVED: 'success',
      REJECTED: 'destructive',
      SUSPENDED: 'warning',
    }
    const labels: Record<string, string> = {
      PENDING: 'รออนุมัติ',
      APPROVED: 'อนุมัติแล้ว',
      REJECTED: 'ปฏิเสธ',
      SUSPENDED: 'ระงับ',
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">จัดการบริษัท</h1>
        <p className="mt-2 text-gray-600">อนุมัติและจัดการบริษัท</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อบริษัท</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จำนวนงาน</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    ไม่พบบริษัท
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.user?.email}</TableCell>
                    <TableCell>{getStatusBadge(company.user?.status || 'PENDING')}</TableCell>
                    <TableCell>{company._count?.jobs || 0}</TableCell>
                    <TableCell>
                      {new Date(company.createdAt).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {company.user?.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateCompanyStatus(company.userId, 'APPROVED')}
                            >
                              อนุมัติ
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateCompanyStatus(company.userId, 'REJECTED')}
                            >
                              ปฏิเสธ
                            </Button>
                          </>
                        )}
                        {company.user?.status === 'APPROVED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCompanyStatus(company.userId, 'SUSPENDED')}
                          >
                            ระงับ
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
