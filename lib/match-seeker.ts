/**
 * Logic การ match ระหว่างผู้สมัครกับงาน/บริษัท
 * คืนค่า 4 ข้อ: พื้นที่ใกล้กัน, งาน/ความสามารถตรง, รูปแบบจ้างตรง, เงินเดือนคุ้มค่า
 */
import { Job, JobSeeker } from '@prisma/client'
import { parseTransitLineColors } from './transit-lines'

export type MatchCriteria = {
  areaMatch: boolean
  skillsMatch: boolean
  jobTypeMatch: boolean
  salaryMatch: boolean
}

export function getSeekerJobMatch(seeker: JobSeeker, job: Job): MatchCriteria {
  const areaMatch = matchArea(job.location, seeker.preferredArea)
  const skillsMatch = matchSkillsAndJob(job, seeker)
  const jobTypeMatch = matchJobType(job.jobType, seeker.preferredJobTypes)
  const salaryMatch = matchSalary(job, seeker)
  return { areaMatch, skillsMatch, jobTypeMatch, salaryMatch }
}

/** พื้นที่ใกล้กัน: เปรียบเทียบ location งาน กับ preferredArea ผู้สมัคร (หรือคำใน location ตรงกับ area) */
function matchArea(jobLocation: string, preferredArea: string | null): boolean {
  if (!preferredArea?.trim()) return false
  const job = normalizeForMatch(jobLocation)
  const area = normalizeForMatch(preferredArea)
  if (job === area) return true
  // เช็คว่าคำใน area ปรากฏใน location หรือตรงกันบางส่วน
  const areaWords = area.split(/\s+/).filter(Boolean)
  return areaWords.some((w) => w.length >= 2 && job.includes(w))
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** ลักษณะงานและความสามารถ: ดู requirements/description กับ skills/experience */
function matchSkillsAndJob(job: Job, seeker: JobSeeker): boolean {
  const text = [job.requirements, job.description].filter(Boolean).join(' ')
  const seekerText = [seeker.skills, seeker.experience].filter(Boolean).join(' ')
  if (!text || !seekerText) return false
  const keywords = extractKeywords(text)
  const seekerNorm = normalizeForMatch(seekerText)
  const matchCount = keywords.filter((k) => k.length >= 2 && seekerNorm.includes(k)).length
  return keywords.length > 0 ? matchCount >= Math.min(1, keywords.length) : false
}

function extractKeywords(s: string): string[] {
  const normalized = normalizeForMatch(s)
  return normalized
    .split(/\s+|,|\.|\/|\(|\)/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((w) => w.length >= 2)
    .slice(0, 15)
}

/** รูปแบบการจ้างงานตรงใจ: job.jobType อยู่ใน preferredJobTypes ของผู้สมัคร */
function matchJobType(jobType: string, preferredJobTypesJson: string | null): boolean {
  if (!preferredJobTypesJson) return false
  try {
    const arr = JSON.parse(preferredJobTypesJson) as unknown
    const list = Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : []
    return list.includes(jobType)
  } catch {
    return false
  }
}

/** เงินเดือนคุ้มค่า: งานมี salaryMin/salaryMax อยู่ในช่วงที่ผู้สมัครยอมรับ หรือผู้สมัครไม่มี expected → ถ้ามีตัวเลขงานก็ถือว่าคุ้ม */
function matchSalary(job: Job & { salaryMin?: number | null; salaryMax?: number | null }, seeker: JobSeeker): boolean {
  const jobMin = job.salaryMin ?? null
  const jobMax = job.salaryMax ?? null
  const seekerMin = seeker.expectedSalaryMin ?? null
  const seekerMax = seeker.expectedSalaryMax ?? null

  if (seekerMin == null && seekerMax == null) {
    return jobMin != null || jobMax != null
  }
  if (jobMin == null && jobMax == null) return false

  const jobLow = jobMin ?? 0
  const jobHigh = jobMax ?? Number.MAX_SAFE_INTEGER
  const seekerLow = seekerMin ?? 0
  const seekerHigh = seekerMax ?? Number.MAX_SAFE_INTEGER

  return jobHigh >= seekerLow && jobLow <= seekerHigh
}

/** เช็คว่าผู้สมัครเดินทางด้วยสายที่บริษัทระบุได้หรือไม่ (มีสายร่วมกัน) */
export function matchTransitLines(
  seekerLineColorsJson: string | null | undefined,
  jobLineColorsJson: string | null | undefined
): boolean {
  const seekerLines = parseTransitLineColors(seekerLineColorsJson)
  const jobLines = parseTransitLineColors(jobLineColorsJson)
  if (jobLines.length === 0) return true
  if (seekerLines.length === 0) return false
  return jobLines.some((l) => seekerLines.includes(l))
}
