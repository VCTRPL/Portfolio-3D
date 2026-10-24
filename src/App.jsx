import { lazy, Suspense, useEffect, useState } from 'react'
import { RESUME_PDF } from './content'
import { useStore } from './store'
import ScreenSite from './screen/ScreenSite'
import { WEBGL } from './webgl'

const Experience = lazy(() => import('./scene/Experience'))
const Loader = lazy(() => import('./scene/Experience').then((m) => ({ default: m.Loader })))

const supportsWebGL = () => WEBGL !== 'none'

const startSimple = () => {
  const q = new URLSearchParams(window.location.search)
  return q.has('simples') || WEBGL === 'none'
}

// Em telas pequenas, 1024px de site dentro do monitor ficariam ilegíveis:
// depois que o computador liga, o site abre em tela cheia por cima da cena.
const useIsSmall = () => {
  const query = '(max-width: 760px), (max-height: 520px)'
  const [small, setSmall] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setSmall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return small
}

function Hud({ onSimple }) {
  const power = useStore((s) => s.power)
  const focused = useStore((s) => s.focused)
  const lampOn = useStore((s) => s.lampOn)
  const ready = useStore((s) => s.ready)
  const { togglePower, toggleLamp, setFocused } = useStore.getState()
  const on = power !== 'off'

  let hint = null
  if (ready && power === 'off') hint = 'Clique no monitor ou no botão ⏻ para ligar o computador'
  else if (power === 'on' && !focused) hint = 'Clique na tela para aproximar'

  return (
    <div className="hud">
      <header className="hud-top">
        <div className="hud-brand">
          <strong>Victor Paula</strong>
          <span>Engenharia de Software · PUC Minas</span>
        </div>
        <nav className="hud-actions" aria-label="Controles da cena">
          <button type="button" className={`hud-btn ${on ? 'is-on' : ''}`} onClick={togglePower} aria-pressed={on}>
            <span aria-hidden="true">⏻</span> {on ? 'desligar' : 'ligar'}
          </button>
          <button type="button" className={`hud-btn ${lampOn ? 'is-on' : ''}`} onClick={toggleLamp} aria-pressed={lampOn}>
            <span aria-hidden="true">✦</span> luminária
          </button>
          {focused && (
            <button type="button" className="hud-btn" onClick={() => setFocused(false)}>
              <span aria-hidden="true">⤢</span> afastar
            </button>
          )}
          <a className="hud-btn hud-btn--primary" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">⭳</span> currículo PDF
          </a>
          <button type="button" className="hud-btn hud-btn--ghost" onClick={onSimple}>versão simples</button>
        </nav>
      </header>
      {hint && <p className="hud-hint" key={hint}>{hint}</p>}
    </div>
  )
}

export default function App() {
  const [simple, setSimple] = useState(startSimple)
  const small = useIsSmall()
  const power = useStore((s) => s.power)
  const focused = useStore((s) => s.focused)

  useEffect(() => {
    document.body.classList.toggle('is-simple', simple)
  }, [simple])

  // Atalhos: Esc pula o boot ou afasta a câmera; Enter pula o boot.
  useEffect(() => {
    if (simple) return undefined
    const onKey = (e) => {
      const s = useStore.getState()
      if (e.key === 'Escape') {
        if (s.power === 'booting') s.skipBoot()
        else s.setFocused(false)
        e.target.blur?.()
      } else if (e.key === 'Enter' && s.power === 'booting') {
        s.skipBoot()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [simple])

  if (simple) {
    return (
      <>
        <div className="simple-bar">
          <span>versão simples</span>
          {supportsWebGL() && <button type="button" onClick={() => setSimple(false)}>ver o escritório 3D</button>}
        </div>
        <ScreenSite />
      </>
    )
  }

  return (
    <>
      <Suspense fallback={<div className="loader" />}>
        <Experience />
        <div className="vignette" aria-hidden="true" />
        <Loader />
      </Suspense>
      <Hud onSimple={() => setSimple(true)} />
      {small && power === 'on' && focused && (
        <div className="mobile-screen">
          <ScreenSite />
          <button type="button" className="mobile-close" onClick={() => useStore.getState().setFocused(false)}>voltar ao escritório</button>
        </div>
      )}
    </>
  )
}
