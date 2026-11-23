import { useLang, ui } from '../i18n'
import { profile, education, skills, tools, softSkills, languages, RESUME_PDF } from '../data/profile'
import { ArrowIcon, DownloadIcon } from './Icons'
import Section from './Section'

function Hero() {
  const { t } = useLang()
  return (
    <div className="hero">
      <div className="hero-text">
        <p className="eyebrow">{t(ui.hello)}</p>
        <h1>{profile.name}</h1>
        <p className="hero-role">{t(profile.role)} <span>· PUC Minas</span></p>
        <p className="lead">{t(profile.tagline)}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#projetos">{t(ui.seeProjects)} <ArrowIcon width={18} height={18} /></a>
          <a className="btn btn-ghost" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
            <DownloadIcon width={18} height={18} /> {t(ui.downloadCv)}
          </a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="avatar"><span>VP</span></div>
        <code className="chip chip-a">{'<React />'}</code>
        <code className="chip chip-b">python</code>
        <code className="chip chip-c">git push</code>
      </div>
    </div>
  )
}

export default function About() {
  const { lang, setLang, t } = useLang()
  return (
    <>
      <div className="container hero-wrap" id="inicio"><Hero /></div>
      <Section id="sobre" eyebrow={t(ui.about.eyebrow)} title={t(ui.about.title)}>
        <div className="grid about-grid">
          <article className="card card-lg">
            <div className="card-top">
              <h3>{lang === 'pt' ? 'Apresentação' : 'Introduction'}</h3>
              <div className="lang lang-sm" role="group" aria-label="Idioma do texto / Text language">
                {[['pt', 'Português'], ['en', 'English']].map(([l, label]) => (
                  <button key={l} type="button" className={lang === l ? 'is-on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{label}</button>
                ))}
              </div>
            </div>
            {profile.about[lang].map((p) => <p key={p}>{p}</p>)}
            <h4>{t(ui.about.objective)}</h4>
            <p>{t(profile.objective)}</p>
            <h4>{t(ui.about.interests)}</h4>
            <ul className="chips">{profile.interests[lang].map((i) => <li key={i}>{i}</li>)}</ul>
          </article>

          <div className="stack">
            <article className="card">
              <h3>{t(ui.about.education)}</h3>
              <p className="strong">{education.school}</p>
              <p>{t(education.degree)}</p>
              <p className="muted">{t(education.status)} · {t(education.conclusion)}</p>
            </article>
            <article className="card">
              <h3>{t(ui.about.languages)}</h3>
              <ul className="rows">
                {languages.map((l) => (
                  <li key={l.name.pt}><span>{t(l.name)}</span><span className="muted">{t(l.level)}</span></li>
                ))}
              </ul>
            </article>
          </div>

          <article className="card">
            <h3>{t(ui.about.skills)}</h3>
            <ul className="rows skills">
              {skills.map((s) => (
                <li key={s.name}>
                  <span>{s.name}</span>
                  <span className="skill-level">
                    <span className="dots" role="img" aria-label={`${s.dots}/5`}>
                      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= s.dots ? 'on' : ''} />)}
                    </span>
                    <span className="muted">{t(s.level)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="note">{t(ui.about.skillsNote)}</p>
            <h4>{t(ui.about.tools)}</h4>
            <ul className="chips">{tools.map((x) => <li key={x}>{x}</li>)}</ul>
          </article>

          <article className="card card-wide">
            <h3>{t(ui.about.soft)}</h3>
            <ul className="chips">{softSkills[lang].map((x) => <li key={x}>{x}</li>)}</ul>
          </article>
        </div>
      </Section>
    </>
  )
}
