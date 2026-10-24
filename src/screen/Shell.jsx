import { useEffect, useRef, useState } from 'react'
import { contacts, languages, profile, skills, tools, openResume } from '../content'
import { useStore } from '../store'

const BANNER = [
  ' __     _____ ____ _____ ___  ____  ',
  ' \\ \\   / /_ _/ ___|_   _/ _ \\|  _ \\ ',
  '  \\ \\ / / | | |     | || | | | |_) |',
  '   \\ V /  | | |___  | || |_| |  _ < ',
  '    \\_/  |___\\____| |_| \\___/|_| \\_\\',
  '',
  `${profile.shortName} — ${profile.role}`,
].join('\n')

let lineId = 0
const line = (kind, text, tone) => ({ id: ++lineId, kind, text, tone })

export default function Shell({ goTo }) {
  const [log, setLog] = useState(() => [line('out', 'sessão iniciada. digite "help" para começar.', 'ok')])
  const [value, setValue] = useState('')
  const history = useRef([])
  const historyIndex = useRef(0)
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const commands = {
    help: () => [
      'comandos disponíveis:',
      '  whoami      nome e objetivo',
      '  sobre       resumo profissional',
      '  skills      competências técnicas',
      '  idiomas     idiomas',
      '  projetos    vai para os repositórios',
      '  contato     formas de contato',
      '  pdf         abre o currículo em PDF',
      '  lampada     liga/desliga a luminária',
      '  desligar    desliga o computador',
      '  banner      imprime o banner',
      '  clear       limpa esta tela',
    ].join('\n'),
    whoami: () => `${profile.name}\n${profile.role}\n\n${profile.objective}`,
    sobre: () => profile.summary.join('\n'),
    skills: () => [
      ...skills.map((s) => `${s.name.padEnd(14, '.')} ${s.level.toLowerCase()}`),
      `${'Ferramentas'.padEnd(14, '.')} ${tools.join(', ')}`,
    ].join('\n'),
    idiomas: () => languages.map((l) => `${l.name.padEnd(14, '.')} ${l.level.toLowerCase()}${l.note ? ` (${l.note})` : ''}`).join('\n'),
    projetos: () => { goTo('projetos'); return 'abrindo projetos.sh...' },
    contato: () => contacts.map((c) => `${c.key.padEnd(10, '.')} ${c.label}`).join('\n'),
    pdf: () => { openResume(); return 'abrindo Curriculo_Victor_Reis_Silva_de_Paula.pdf em outra aba...' },
    curriculo: () => commands.pdf(),
    lampada: () => { useStore.getState().toggleLamp(); return 'click.' },
    desligar: () => { setTimeout(() => useStore.getState().powerOff(), 400); return 'desligando... até logo!' },
    shutdown: () => commands.desligar(),
    exit: () => commands.desligar(),
    banner: () => BANNER,
    ls: () => 'sobre.md  skills.json  projetos.sh  contato.sh  curriculo.pdf',
    sudo: () => ['warn', 'permissão negada: victor não está no arquivo sudoers. (mas um e-mail educado costuma funcionar)'],
    clear: () => { setLog([]); return null },
  }

  const run = (raw) => {
    const [name] = raw.toLowerCase().split(/\s+/)
    const handler = commands[name]
    const entry = [line('cmd', raw)]
    if (!handler) {
      entry.push(line('out', `comando não encontrado: ${name}. digite "help".`, 'err'))
      setLog((l) => [...l, ...entry])
      return
    }
    const out = handler()
    if (name === 'clear') return
    if (Array.isArray(out)) entry.push(line('out', out[1], out[0]))
    else if (out) entry.push(line('out', out, 'ok'))
    setLog((l) => [...l, ...entry])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      const raw = value.trim()
      setValue('')
      if (!raw) return
      history.current.push(raw)
      historyIndex.current = history.current.length
      run(raw)
    } else if (e.key === 'ArrowUp' && history.current.length) {
      e.preventDefault()
      historyIndex.current = Math.max(0, historyIndex.current - 1)
      setValue(history.current[historyIndex.current] || '')
    } else if (e.key === 'ArrowDown' && history.current.length) {
      e.preventDefault()
      historyIndex.current = Math.min(history.current.length, historyIndex.current + 1)
      setValue(history.current[historyIndex.current] || '')
    }
  }

  return (
    <div className="shell" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="shell-log" ref={logRef}>
        {log.map((l) => (l.kind === 'cmd' ? (
          <p key={l.id} className="log-cmd">
            <span className="prompt-user">victor</span><span className="prompt-at">@</span>
            <span className="prompt-host">portfolio</span><span className="prompt-sep">:</span>
            <span className="prompt-path">~</span><span className="prompt-dollar">$</span>
            <span className="prompt-cmd">{l.text}</span>
          </p>
        ) : (
          <p key={l.id} className={`log-output ${l.tone || ''}`}>{l.text}</p>
        )))}
      </div>
      <div className="shell-input-line">
        <span className="prompt-user">victor</span><span className="prompt-at">@</span>
        <span className="prompt-host">portfolio</span><span className="prompt-sep">:</span>
        <span className="prompt-path">~</span><span className="prompt-dollar">$</span>
        <input
          ref={inputRef}
          className="shell-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Digite um comando"
        />
      </div>
    </div>
  )
}
