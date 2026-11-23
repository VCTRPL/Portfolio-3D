import { useLang, ui } from '../i18n'
import { experiences } from '../data/experiences'
import Section from './Section'

export default function Experience() {
  const { t } = useLang()
  return (
    <Section id="experiencias" eyebrow={t(ui.experience.eyebrow)} title={t(ui.experience.title)} intro={t(ui.experience.intro)}>
      <ul className="exp-list">
        {experiences.map((e) => (
          <li key={e.org} className="card exp">
            <div className="exp-head">
              <div>
                <h3>{t(e.role)}</h3>
                <p className="strong">{e.org}</p>
              </div>
              <div className="exp-meta">
                <span className="tag">{t(e.kind)}</span>
                <span className="muted">{t(e.period)}</span>
              </div>
            </div>
            <p>{t(e.description)}</p>
          </li>
        ))}
      </ul>
      <p className="callout">{t(ui.experience.open)}</p>
    </Section>
  )
}
