import { NextResponse } from 'next/server'
import { loadJobs } from '@/lib/storage'

export async function GET() {
  const jobs = loadJobs()
  return NextResponse.json({ jobs })
}
