import { useEffect, useState } from 'react'
import { GITHUB_USER } from './data/profile'
import { projects as curated } from './data/projects'

const CACHE_KEY = 'gh-repos-v1'

const toProject = (r) => ({
  repo: r.name,
  date: r.created_at.slice(0, 7),
  name: r.name.replace(/[-_]+/g, ' '),
  description: r.description || null,
  tech: [r.language, ...(r.topics || [])].filter(Boolean),
  github: r.html_url,
  live: r.homepage || null,
  // Prévia gerada pelo próprio GitHub (cartão social do repositório).
  image: `https://opengraph.githubassets.com/1/${GITHUB_USER}/${r.name}`,
  fromGithub: true,
})

const readCache = () => {
  try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null') } catch { return null }
}

/** Projetos curados + repositórios públicos do GitHub, do mais antigo ao mais recente. */
export function useGithubProjects() {
  const [state, setState] = useState(() => {
    const cached = readCache()
    return cached ? { status: 'ok', repos: cached } : { status: 'loading', repos: [] }
  })

  useEffect(() => {
    if (state.status === 'ok') return undefined
    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: ctrl.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then((list) => {
        const repos = list.filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== GITHUB_USER.toLowerCase()).map(toProject)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(repos)) } catch { /* ignora */ }
        setState({ status: 'ok', repos })
      })
      .catch((e) => { if (e.name !== 'AbortError') setState({ status: 'error', repos: [] }) })
    return () => ctrl.abort()
  }, [state.status])

  const curatedNames = new Set(curated.map((p) => p.repo.toLowerCase()))
  const extra = state.repos.filter((r) => !curatedNames.has(r.repo.toLowerCase()))
  const items = [...curated, ...extra].sort((a, b) => a.date.localeCompare(b.date))
  return { items, status: state.status }
}
