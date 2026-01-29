'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    pendingApprovals: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // In a real app, you'd have a dedicated stats API endpoint
      const [usersRes, companiesRes, jobsRes, applicationsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/companies'),
        fetch('/api/jobs'),
        fetch('/api/applications'),
      ])

      const users = await usersRes.json()
      const companies = await companiesRes.json()
      const jobs = await jobsRes.json()
      const applications = await applicationsRes.json()

      const pendingCompanies = companies.filter((c: any) => c.user?.status === 'PENDING')
      const pendingJobs = jobs.filter((j: any) => j.status === 'PENDING')
      const activeJobs = jobs.filter((j: any) => j.status === 'ACTIVE')

      setStats({
        totalUsers: users.length,
        totalCompanies: companies.length,
        pendingApprovals: pendingCompanies.length + pendingJobs.length,
        totalJobs: jobs.length,
        activeJobs: activeJobs.length,
        totalApplications: applications.length,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className="mt-2 text-gray-600">ภาพรวมของระบบ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ผู้ใช้ทั้งหมด</CardTitle>
            <CardDescription>จำนวนผู้ใช้ในระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>บริษัททั้งหมด</CardTitle>
            <CardDescription>จำนวนบริษัทที่ลงทะเบียน</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCompanies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>รออนุมัติ</CardTitle>
            <CardDescription>บริษัทและงานที่รออนุมัติ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>งานทั้งหมด</CardTitle>
            <CardDescription>จำนวนงานทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>งานที่เปิดรับ</CardTitle>
            <CardDescription>งานที่เปิดรับสมัคร</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ใบสมัครทั้งหมด</CardTitle>
            <CardDescription>จำนวนใบสมัครทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
