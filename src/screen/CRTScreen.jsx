import { useStore, BOOT_MS } from '../store'
import ScreenSite from './ScreenSite'

const BOOT_LINES = [
  'VP-BIOS (C) 1989 Victor Paula Systems, Inc.',
  'CPU: Estudante 8086 @ 4.77 MHz ......... OK',
  'Memória base: 640K .................... OK',
  'Detectando unidades: A: 3½"  C: HD 20MB  OK',
  '',
  'C:\\> cd PORTFOLIO',
  'C:\\PORTFOLIO> montando /sobre /skills /projetos /contato',
  'C:\\PORTFOLIO> conectando a github.com/VCTRPL ... OK',
  'C:\\PORTFOLIO> iniciando victor@portfolio_',
]

/** Tela do CRT: animações de liga/desliga, boot e o site do currículo. */
export default function CRTScreen() {
  const power = useStore((s) => s.power)
  const focused = useStore((s) => s.focused)

  const skipBoot = () => {
    if (useStore.getState().power === 'booting') useStore.setState({ power: 'on' })
  }

  return (
    <div className={`crt crt--${power} ${focused ? 'crt--focused' : ''}`} style={{ '--boot-ms': `${BOOT_MS}ms` }}>
      <div className="crt-content">
        <ScreenSite embedded />
        {power === 'booting' && (
          <div className="crt-boot" onClick={skipBoot} role="presentation">
            {BOOT_LINES.map((l, i) => (
              <p key={i} style={{ animationDelay: `${i * (BOOT_MS / (BOOT_LINES.length + 1))}ms` }}>{l || '\u00a0'}</p>
            ))}
            <span className="crt-boot-skip">clique para pular</span>
          </div>
        )}
      </div>
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-flash" aria-hidden="true" />
    </div>
  )
}
