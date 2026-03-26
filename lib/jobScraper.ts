const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY
const JSEARCH_API_HOST = 'jsearch.p.rapidapi.com'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  url: string
  postedDate: string
}

export async function scrapeJobsFromJSearch(): Promise<Job[]> {
  if (!JSEARCH_API_KEY) {
    console.warn('JSEARCH_API_KEY not set. Returning empty jobs.')
    return []
  }

  try {
    const response = await fetch('https://jsearch.p.rapidapi.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': JSEARCH_API_HOST,
      },
      body: JSON.stringify({
        query: 'software engineer fintech AI',
        num_pages: 1,
        page: 1,
        date_posted: 'last_7_days',
      }),
    })

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`)
    }

    const data = await response.json() as any
    const jobsData = data.data || []

    return jobsData.map((job: any, index: number) => ({
      id: `${job.job_id || index}`,
      title: job.job_title || 'N/A',
      company: job.employer_name || 'N/A',
      location: job.job_city || 'Remote',
      salary: job.job_salary_currency && job.job_salary_max 
        ? `${job.job_salary_currency} ${job.job_salary_max}`
        : undefined,
      url: job.job_apply_link || '#',
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error scraping jobs:', error)
    return []
  }
}

export async function deduplicateJobs(jobs: Job[]): Promise<Job[]> {
  const seen = new Set<string>()
  return jobs.filter((job) => {
    const key = `${job.company}|${job.title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
