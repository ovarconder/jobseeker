/**
 * สาย BTS / MRT สำหรับกรองและแสดงผล
 * ค่า id ใช้เก็บใน DB (JSON array), label และ color ใช้แสดงใน UI
 */
export const TRANSIT_LINES = [
  { id: 'RED', label: 'สายสีแดง (MRT)', color: '#E31E24' },
  { id: 'BLUE', label: 'สายสีน้ำเงิน (MRT)', color: '#0070BD' },
  { id: 'PURPLE', label: 'สายสีม่วง (MRT)', color: '#6C1D7A' },
  { id: 'GREEN', label: 'สายสีเขียว (BTS สุขุมวิท)', color: '#00A651' },
  { id: 'DARK_GREEN', label: 'สายสีเขียวเข้ม (BTS สีลม)', color: '#009444' },
  { id: 'GOLD', label: 'สายสีทอง (BTS)', color: '#B8860B' },
  { id: 'YELLOW', label: 'สายสีเหลือง (MRT)', color: '#FFD100' },
  { id: 'PINK', label: 'สายสีชมพู (MRT)', color: '#E91E8C' },
  { id: 'ORANGE', label: 'สายสีส้ม', color: '#ED8B00' },
] as const

export type TransitLineId = (typeof TRANSIT_LINES)[number]['id']

export function getTransitLineById(id: string) {
  return TRANSIT_LINES.find((l) => l.id === id)
}

export function parseTransitLineColors(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json) as unknown
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function serializeTransitLineColors(ids: string[]): string {
  return JSON.stringify(ids)
}
