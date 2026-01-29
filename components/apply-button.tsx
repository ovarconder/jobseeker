'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface ApplyButtonProps {
  jobId: string
  hasApplied: boolean
}

export function ApplyButton({ jobId, hasApplied }: ApplyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)

  const handleApply = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in, redirect to login
          router.push(`/login?redirect=/jobs/${jobId}`)
          return
        }
        alert(data.error || 'เกิดข้อผิดพลาดในการสมัครงาน')
        return
      }

      setApplied(true)
      alert('สมัครงานสำเร็จ!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('เกิดข้อผิดพลาดในการสมัครงาน')
    } finally {
      setLoading(false)
    }
  }

  if (applied) {
    return (
      <Button disabled className="w-full" size="lg" variant="outline">
        <CheckCircle2 className="w-5 h-5 mr-2" />
        สมัครงานแล้ว
      </Button>
    )
  }

  return (
    <Button
      onClick={handleApply}
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          กำลังสมัคร...
        </>
      ) : (
        'สมัครงาน'
      )}
    </Button>
  )
}
