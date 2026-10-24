import { useEffect, useState } from 'react'
import { GITHUB_USER } from '../content'

export default function Repos() {
  const [state, setState] = useState({ status: 'loading', repos: [] })

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub respondeu ${res.status}`)
        return res.json()
      })
      .then((repos) => {
        if (cancelled) return
        setState({ status: 'ok', repos: repos.filter((r) => !r.fork).slice(0, 6) })
      })
      .catch(() => !cancelled && setState({ status: 'error', repos: [] }))
    return () => { cancelled = true }
  }, [])

  const { status, repos } = state

  return (
    <>
      <div className={`repo-status ${status === 'error' ? 'is-error' : ''}`}>
        {status === 'loading' && 'carregando repositórios...'}
        {status === 'error' && 'não foi possível carregar os repositórios agora (limite da API do GitHub). Veja direto no link abaixo.'}
        {status === 'ok' && (repos.length
          ? `${repos.length} repositório(s) carregado(s).`
          : 'nenhum repositório público encontrado no momento.')}
      </div>
      <ul className="repo-list">
        {repos.map((repo) => (
          <li className="repo-card" key={repo.id}>
            <div className="repo-card-top">
              <a className="repo-name" href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
              {repo.language && <span className="repo-lang">{repo.language}</span>}
            </div>
            {repo.description && <p className="repo-desc">{repo.description}</p>}
            <div className="repo-meta">
              <span>★ {repo.stargazers_count}</span>
              <span>atualizado em {new Date(repo.pushed_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </li>
        ))}
      </ul>
      <a className="btn btn-ghost btn-small" href={`https://github.com/${GITHUB_USER}?tab=repositories`} target="_blank" rel="noopener noreferrer">
        ver tudo em github.com/{GITHUB_USER}
      </a>
    </>
  )
}
