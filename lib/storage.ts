import { Job } from './jobScraper'
import * as fs from 'fs'
import * as path from 'path'

const JOBS_FILE = path.join(process.cwd(), 'data', 'jobs.json')

function ensureDataDir() {
  const dir = path.dirname(JOBS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function saveJobs(jobs: Job[]): void {
  ensureDataDir()
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2))
}

export function loadJobs(): Job[] {
  try {
    ensureDataDir()
    if (!fs.existsSync(JOBS_FILE)) return []
    const data = fs.readFileSync(JOBS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading jobs:', error)
    return []
  }
}
