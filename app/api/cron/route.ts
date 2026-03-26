import { NextRequest, NextResponse } from 'next/server'
import { scrapeJobsFromJSearch, deduplicateJobs } from '../../../lib/jobScraper'
import { saveJobs } from '../../../lib/storage'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const jobs = await scrapeJobsFromJSearch()
  const dedupe = await deduplicateJobs(jobs)
  saveJobs(dedupe)
  return NextResponse.json({ success: true, count: dedupe.length })
}
