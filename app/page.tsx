'use client'
import { useEffect, useState } from 'react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  url: string
  postedDate: string
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Job Engine</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Real jobs • 4x daily updates</p>
        
        <button onClick={fetchJobs} style={{ padding: '0.5rem 1.5rem', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '2rem' }}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>

        {error && <div style={{ color: '#f00', marginBottom: '1rem' }}>Error: {error}</div>}

        {!loading && jobs.length === 0 && <p style={{ color: '#888' }}>No jobs yet</p>}

        {jobs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {jobs.map((job) => (
              <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer" style={{ background: '#222', padding: '1.5rem', borderRadius: '8px', textDecoration: 'none', color: '#fff', border: '1px solid #333' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{job.title}</h3>
                <p style={{ color: '#0066cc', fontWeight: 'bold', marginBottom: '0.5rem' }}>{job.company}</p>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{job.location}</p>
                {job.salary && <p style={{ color: '#00cc00', marginBottom: '0.5rem' }}>{job.salary}</p>}
                <p style={{ color: '#666', fontSize: '0.8rem' }}>Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
