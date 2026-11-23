import { useReveal } from './useReveal'

export default function Section({ id, eyebrow, title, intro, children }) {
  const ref = useReveal()
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container reveal" ref={ref}>
        <header className="section-head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
          {intro && <p className="lead">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
