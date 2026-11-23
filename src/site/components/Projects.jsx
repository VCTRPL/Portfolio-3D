import { useState } from 'react'
import { useLang, ui } from '../i18n'
import { GITHUB_USER } from '../data/profile'
import { useGithubProjects } from '../useGithubProjects'
import { ExternalIcon, GithubIcon } from './Icons'
import Section from './Section'
import { useReveal } from './useReveal'

const fmtDate = (ym, lang) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })
}

function Media({ project, alt }) {
  const [broken, setBroken] = useState(false)
  if (!project.image || broken) {
    return <div className="media media-empty" aria-hidden="true"><GithubIcon width={36} height={36} /></div>
  }
  return (
    <div className="media">
      <img src={project.image} alt={alt} loading="lazy" decoding="async" onError={() => setBroken(true)} />
    </div>
  )
}

function Item({ project, index }) {
  const { lang, t } = useLang()
  const ref = useReveal()
  const name = t(project.name)
  const desc = t(project.description) || (lang === 'pt' ? 'Repositório no GitHub.' : 'GitHub repository.')
  return (
    <li className="tl-item reveal" ref={ref} style={{ '--i': index % 3 }}>
      <span className="tl-dot" aria-hidden="true" />
      <time className="tl-date" dateTime={project.date}>{fmtDate(project.date, lang)}</time>
      <article className="card project">
        <Media project={project} alt={t(project.imageAlt) || `${t(ui.projects.noImage)}: ${name}`} />
        <div className="project-body">
          <h3>{name}</h3>
          <p>{desc}</p>
          {project.tech.length > 0 && (
            <ul className="chips" aria-label={t(ui.projects.tech)}>
              {project.tech.map((x) => <li key={x}>{x}</li>)}
            </ul>
          )}
          <div className="project-links">
            <a className="btn btn-small btn-ghost" href={project.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon width={16} height={16} /> {t(ui.projects.repo)}
            </a>
            {project.live && (
              <a className="btn btn-small btn-ghost" href={project.live} target="_blank" rel="noopener noreferrer">
                {t(ui.projects.live)} <ExternalIcon />
              </a>
            )}
          </div>
        </div>
      </article>
    </li>
  )
}

export default function Projects() {
  const { t } = useLang()
  const { items, status } = useGithubProjects()
  return (
    <Section id="projetos" eyebrow={t(ui.projects.eyebrow)} title={t(ui.projects.title)} intro={t(ui.projects.intro)}>
      <ol className="timeline">
        {items.map((p, i) => <Item key={p.repo} project={p} index={i} />)}
      </ol>
      <p className={`status ${status === 'error' ? 'is-error' : ''}`} role="status">
        {status === 'loading' && t(ui.projects.loading)}
        {status === 'error' && t(ui.projects.error)}
      </p>
      <a className="btn btn-ghost" href={`https://github.com/${GITHUB_USER}?tab=repositories`} target="_blank" rel="noopener noreferrer">
        <GithubIcon width={18} height={18} /> {t(ui.projects.all)}
      </a>
    </Section>
  )
}
