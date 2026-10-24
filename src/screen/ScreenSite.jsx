import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GITHUB_USER, RESUME_PDF, profile, education, skills, tools, softSkills, languages, contacts,
} from '../content'
import Shell from './Shell'
import Repos from './Repos'

const TABS = [
  { id: 'whoami', label: 'whoami.sh' },
  { id: 'sobre', label: 'sobre.md' },
  { id: 'skills', label: 'skills.json' },
  { id: 'projetos', label: 'projetos.sh' },
  { id: 'contato', label: 'contato.sh' },
  { id: 'shell', label: 'shell' },
]

function Prompt({ cmd }) {
  return (
    <p className="prompt-line">
      <span className="prompt-user">victor</span><span className="prompt-at">@</span>
      <span className="prompt-host">portfolio</span><span className="prompt-sep">:</span>
      <span className="prompt-path">~</span><span className="prompt-dollar">$</span>
      <span className="prompt-cmd">{cmd}</span>
    </p>
  )
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="clock">{now.toLocaleTimeString('pt-BR', { hour12: false })}</span>
}

/**
 * O "site do currículo". Dentro do monitor 3D ele roda num quadro fixo
 * 4:3 (1024×768) e rola por dentro; no modo simples ocupa a página.
 */
export default function ScreenSite({ embedded = false }) {
  const bodyRef = useRef(null)
  const [active, setActive] = useState('whoami')

  const goTo = useCallback((id) => {
    const body = bodyRef.current
    const el = body?.querySelector(`#sec-${id}`)
    if (!body || !el) return
    // scrollTo no próprio container: scrollIntoView rolaria também a página
    // por trás da cena 3D.
    body.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' })
  }, [])

  const onScroll = useCallback(() => {
    const body = bodyRef.current
    if (!body) return
    const mark = body.scrollTop + body.clientHeight * 0.35
    let current = TABS[0].id
    for (const t of TABS) {
      const el = body.querySelector(`#sec-${t.id}`)
      if (el && el.offsetTop <= mark) current = t.id
    }
    if (body.scrollTop + body.clientHeight >= body.scrollHeight - 4) current = TABS[TABS.length - 1].id
    setActive(current)
  }, [])

  return (
    <div className={`site ${embedded ? 'site--embedded' : 'site--page'}`}>
      <header className="titlebar">
        <div className="titlebar-left">
          <span className="dot dot-a" /><span className="dot dot-b" /><span className="dot dot-c" />
          <span className="titlebar-path">victorrsdp:~/portfolio</span>
        </div>
        <div className="titlebar-right">
          <a className="pdf-link" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">⭳</span> curriculo.pdf
          </a>
          <Clock />
        </div>
      </header>

      <nav className="tabbar" aria-label="Seções do currículo">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${active === t.id ? 'is-active' : ''}`}
            onClick={() => goTo(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="terminal-body" ref={bodyRef} onScroll={onScroll}>
        <section id="sec-whoami" className="pane">
          <Prompt cmd="./whoami.sh" />
          <h1 className="hero-title">
            <span className="hero-name">{profile.shortName}</span>
            <span className="hero-dash">—</span>
            <span className="hero-role">{profile.role}</span>
          </h1>
          <p className="hero-tagline">{profile.summary[0]}</p>
          <ul className="hero-meta">
            <li><span className="meta-key">nome</span><span className="meta-val">{profile.name}</span></li>
            <li><span className="meta-key">formação</span><span className="meta-val">Engenharia de Software · PUC Minas</span></li>
            <li><span className="meta-key">período</span><span className="meta-val">2º período · conclusão prevista em 2029</span></li>
            <li><span className="meta-key">local</span><span className="meta-val">{profile.location}</span></li>
            <li><span className="meta-key">status</span><span className="meta-val meta-ok">Em busca da primeira oportunidade</span></li>
          </ul>
          <div className="hero-actions">
            <a className="btn btn-primary" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">abrir curriculo.pdf</a>
            <button type="button" className="btn btn-ghost" onClick={() => goTo('contato')}>contato --show</button>
            <a className="btn btn-ghost" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noopener noreferrer">github.com/{GITHUB_USER}</a>
          </div>
        </section>

        <section id="sec-sobre" className="pane">
          <Prompt cmd="cat sobre.md" />
          <h2 className="section-heading"><span className="heading-hash">#</span>Objetivo</h2>
          <p>{profile.objective}</p>

          <h3 className="subheading"><span className="heading-hash">##</span>Resumo</h3>
          {profile.summary.slice(1).map((p) => <p key={p}>{p}</p>)}

          <h3 className="subheading"><span className="heading-hash">##</span>Formação acadêmica</h3>
          <div className="edu">
            <div className="edu-top">
              <strong>{education.school}</strong>
              <span className="edu-date">{education.conclusion}</span>
            </div>
            <div className="edu-sub">
              <span>{education.degree}</span>
              <span className="meta-ok">{education.status}</span>
            </div>
          </div>

          <h3 className="subheading"><span className="heading-hash">##</span>Idiomas</h3>
          <ul className="lang-list">
            {languages.map((l) => (
              <li key={l.name}>
                <span className="lang-name">{l.name}</span>
                <span className={`lang-tag lang-${l.tone}`}>{l.level}</span>
                {l.note && <span className="lang-note">— {l.note}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section id="sec-skills" className="pane">
          <Prompt cmd="cat skills.json" />
          <h2 className="section-heading"><span className="heading-hash">#</span>Competências técnicas</h2>
          <p className="section-note">Níveis autoavaliados; sem experiência prévia de mercado.</p>
          <ul className="skill-bars">
            {skills.map((s) => (
              <li className="skill-row" key={s.name}>
                <span className="skill-name">{s.name}</span>
                <span className="skill-bar" role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name}: ${s.level}`}>
                  <span className="skill-fill" style={{ '--pct': `${s.pct}%` }} />
                </span>
                <span className="skill-level">{s.level}</span>
              </li>
            ))}
          </ul>

          <h3 className="subheading"><span className="heading-hash">##</span>Ferramentas</h3>
          <ul className="tag-list tag-list--violet">
            {tools.map((t) => <li key={t}>{t}</li>)}
          </ul>

          <h3 className="subheading"><span className="heading-hash">##</span>Competências comportamentais</h3>
          <ul className="tag-list tag-list--mint">
            {softSkills.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        <section id="sec-projetos" className="pane">
          <Prompt cmd={`./projetos.sh --fetch github.com/${GITHUB_USER}`} />
          <h2 className="section-heading"><span className="heading-hash">#</span>Projetos</h2>
          <p className="section-note">Repositórios acadêmicos e pessoais (web e Python), carregados da API pública do GitHub.</p>
          <Repos />
        </section>

        <section id="sec-contato" className="pane">
          <Prompt cmd="cat contato.sh" />
          <h2 className="section-heading"><span className="heading-hash">#</span>Contato</h2>
          <ul className="contact-list">
            {contacts.map((c) => (
              <li key={c.key}>
                <span className="meta-key">{c.key}</span>
                <a className="contact-link" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{c.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn-ghost btn-small" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">⭳ baixar curriculo.pdf</a>
        </section>

        <section id="sec-shell" className="pane shell-pane">
          <h2 className="section-heading"><span className="heading-hash">#</span>Shell interativo</h2>
          <p className="section-note">Digite <code>help</code> para ver os comandos.</p>
          <Shell goTo={goTo} />
        </section>
      </main>

      <footer className="statusbar">
        <span>victor@portfolio</span>
        <span className="status-branch">main</span>
        <span className="status-right">UTF-8 · pt-BR</span>
      </footer>
    </div>
  )
}
