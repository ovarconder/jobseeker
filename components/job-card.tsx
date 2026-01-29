import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Clock, Building2 } from 'lucide-react'

interface JobCardProps {
  job: {
    id: string
    title: string
    description: string
    location: string
    salary?: string | null
    jobType: string
    forElderly?: boolean
    company?: {
      name: string
    } | null
    _count?: {
      applications: number
    }
  }
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'งานเต็มเวลา',
  PART_TIME: 'งาน part-time',
  CONTRACT: 'สัญญาจ้าง',
  INTERNSHIP: 'ฝึกงาน',
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
            {job.title}
          </CardTitle>
          {job.forElderly && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 whitespace-nowrap">
              👴 ผู้สูงอายุ
            </Badge>
          )}
        </div>
        {job.company && (
          <CardDescription className="flex items-center gap-1.5 mt-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{job.company.name}</span>
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          {job.description}
        </p>
        
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>{job.location}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-700">{job.salary}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{jobTypeLabels[job.jobType] || job.jobType}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full" variant="default">
            ดูรายละเอียด
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
