import { useEffect, useRef, useState } from 'react'
import { RESUME_PDF } from '../content'
import { useStore } from '../store'
import ScreenSite from './ScreenSite'

function TrayClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])
  return <span className="tray-clock">{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
}

function TerminalIcon({ small }) {
  return (
    <span className={`term-icon ${small ? 'term-icon--small' : ''}`} aria-hidden="true">
      <span className="term-icon-bar" />
      <span className="term-icon-prompt">&gt;_</span>
    </span>
  )
}

// Papel de parede: céu azul e um campo verde de colina, desenhados em SVG.
function Wallpaper() {
  return (
    <svg className="wallpaper" viewBox="0 0 1024 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f66d6" />
          <stop offset="0.55" stopColor="#5ea0ef" />
          <stop offset="1" stopColor="#b9dcfb" />
        </linearGradient>
        <linearGradient id="wp-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fcf3a" />
          <stop offset="0.35" stopColor="#4fa922" />
          <stop offset="1" stopColor="#2d7a12" />
        </linearGradient>
        <linearGradient id="wp-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d9a3c" />
          <stop offset="1" stopColor="#3d7a22" />
        </linearGradient>
        <radialGradient id="wp-light" cx="0.38" cy="0.42" r="0.55">
          <stop offset="0" stopColor="#d9ff8a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#d9ff8a" stopOpacity="0" />
        </radialGradient>
        <filter id="wp-blur"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <rect width="1024" height="768" fill="url(#wp-sky)" />
      <g filter="url(#wp-blur)" fill="#fff" opacity="0.85">
        <ellipse cx="760" cy="150" rx="150" ry="26" />
        <ellipse cx="840" cy="135" rx="90" ry="22" />
        <ellipse cx="220" cy="95" rx="120" ry="18" opacity="0.6" />
        <ellipse cx="520" cy="230" rx="80" ry="12" opacity="0.5" />
      </g>
      <path d="M0 470 C 140 430, 260 440, 360 455 L 360 768 L 0 768 Z" fill="url(#wp-hill-back)" />
      <path d="M0 520 C 180 380, 520 330, 1024 420 L 1024 768 L 0 768 Z" fill="url(#wp-hill)" />
      <path d="M0 520 C 180 380, 520 330, 1024 420 L 1024 768 L 0 768 Z" fill="url(#wp-light)" />
      <g stroke="#3f9119" strokeWidth="2" opacity="0.35" fill="none">
        <path d="M60 600 C 300 520, 600 500, 1000 540" />
        <path d="M0 680 C 320 600, 640 590, 1024 630" />
        <path d="M120 740 C 400 680, 700 670, 1024 700" />
      </g>
    </svg>
  )
}

/**
 * Área de trabalho do "VictorOS": papel de parede de campo, um único
 * ícone (o terminal do portfólio), barra de tarefas e menu Iniciar.
 */
export default function Desktop({ mobile = false }) {
  const appOpen = useStore((s) => s.appOpen)
  const setAppOpen = useStore((s) => s.setAppOpen)
  const powerOff = useStore((s) => s.powerOff)
  const [selected, setSelected] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [tip, setTip] = useState(true)
  // Toque duplo feito à mão: no celular o dblclick nem sempre dispara.
  const lastTap = useRef(0)
  const onIconTap = (e) => {
    e.stopPropagation()
    setStartOpen(false)
    const now = Date.now()
    if (now - lastTap.current < 450) {
      lastTap.current = 0
      openApp()
    } else {
      lastTap.current = now
      setSelected(true)
    }
  }

  const openApp = () => {
    setAppOpen(true)
    setMinimized(false)
    setStartOpen(false)
    setTip(false)
  }

  return (
    <div className={`desktop ${mobile ? 'desktop--mobile' : ''}`} onClick={() => { setSelected(false); setStartOpen(false) }}>
      <Wallpaper />

      <button
        type="button"
        className={`desk-icon ${selected ? 'is-selected' : ''}`}
        onClick={onIconTap}
        onKeyDown={(e) => { if (e.key === 'Enter') openApp() }}
      >
        <TerminalIcon />
        <span className="desk-icon-label">Portfólio</span>
      </button>

      {appOpen && (
        <section
          className={`xp-window ${maximized || mobile ? 'is-max' : ''} ${minimized ? 'is-min' : ''}`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Portfólio"
        >
          <header className="xp-titlebar" onDoubleClick={() => setMaximized((m) => !m)}>
            <TerminalIcon small />
            <span className="xp-title">Portfólio — victor@portfolio</span>
            <div className="xp-buttons">
              <button type="button" className="xp-btn" aria-label="Minimizar" onClick={() => setMinimized(true)}>_</button>
              <button type="button" className="xp-btn" aria-label={maximized ? 'Restaurar' : 'Maximizar'} onClick={() => setMaximized((m) => !m)}>{maximized ? '❐' : '□'}</button>
              <button type="button" className="xp-btn xp-btn--close" aria-label="Fechar" onClick={() => setAppOpen(false)}>✕</button>
            </div>
          </header>
          <div className="xp-body">
            {mobile ? <div className="xp-scroll"><ScreenSite /></div> : <ScreenSite embedded />}
          </div>
        </section>
      )}

      {startOpen && (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-head">
            <span className="start-avatar">VP</span>
            <strong>Victor Paula</strong>
          </div>
          <ul>
            <li><button type="button" onClick={openApp}><TerminalIcon small /> Portfólio</button></li>
            <li><a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" onClick={() => setStartOpen(false)}><span className="pdf-icon" aria-hidden="true">PDF</span> Currículo</a></li>
          </ul>
          <div className="start-menu-foot">
            <button type="button" onClick={powerOff}><span className="off-icon" aria-hidden="true">⏻</span> Desligar o computador</button>
          </div>
        </div>
      )}

      {tip && !appOpen && (
        <div className="balloon" onClick={(e) => { e.stopPropagation(); setTip(false) }}>
          <strong>Bem-vindo!</strong>
          {mobile ? 'Toque duas vezes' : 'Clique duas vezes'} em <b>Portfólio</b> para abrir meu currículo.
        </div>
      )}

      <footer className="taskbar" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={`start-btn ${startOpen ? 'is-open' : ''}`} onClick={() => setStartOpen((o) => !o)}>
          <span className="start-flag" aria-hidden="true" />
          iniciar
        </button>
        <div className="task-items">
          {appOpen && (
            <button type="button" className={`task-item ${minimized ? '' : 'is-active'}`} onClick={() => setMinimized((m) => !m)}>
              <TerminalIcon small /> Portfólio
            </button>
          )}
        </div>
        <div className="tray">
          <TrayClock />
        </div>
      </footer>
    </div>
  )
}
