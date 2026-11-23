import { useEffect, useState } from 'react'
import { useLang, ui } from '../i18n'
import { profile } from '../data/profile'
import { MenuIcon } from './Icons'

const LINKS = [
  { id: 'sobre', label: ui.nav.about },
  { id: 'projetos', label: ui.nav.projects },
  { id: 'experiencias', label: ui.nav.experience },
  { id: 'contato', label: ui.nav.contact },
]

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaca no menu a seção que está na tela.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-in">
        <a className="brand" href="#inicio" onClick={() => setOpen(false)} aria-label={profile.shortName}>
          <span className="brand-mark">VP</span>
          <span className="brand-name">{profile.shortName}</span>
        </a>

        <nav id="main-nav" className={`nav ${open ? 'is-open' : ''}`} aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''}
              aria-current={active === l.id ? 'true' : undefined} onClick={() => setOpen(false)}>
              {t(l.label)}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang" role="group" aria-label="Idioma / Language">
            {['pt', 'en'].map((l) => (
              <button key={l} type="button" className={lang === l ? 'is-on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" className="burger" aria-expanded={open} aria-controls="main-nav"
            aria-label={t(ui.menu)} onClick={() => setOpen((o) => !o)}>
            <MenuIcon open={open} />
          </button>
        </div>
      </div>
    </header>
  )
}
