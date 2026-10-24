import { useStore, BOOT_MS } from '../store'
import Desktop from './Desktop'

const BOOT_LINES = [
  'VP-BIOS (C) 1989 Victor Paula Systems, Inc.',
  'CPU: Estudante 8086 @ 4.77 MHz ......... OK',
  'Memória base: 640K .................... OK',
  'Detectando unidades: A: 3½"  C: HD 20MB  OK',
  '',
  'Iniciando VictorOS...',
  'Carregando área de trabalho ............ OK',
]

/** Tela do CRT: animações de liga/desliga, boot e a área de trabalho. */
export default function CRTScreen() {
  const power = useStore((s) => s.power)
  const focused = useStore((s) => s.focused)
  const skipBoot = useStore((s) => s.skipBoot)

  return (
    <div className={`crt crt--${power} ${focused ? 'crt--focused' : ''}`} style={{ '--boot-ms': `${BOOT_MS}ms` }}>
      <div className="crt-content">
        {(power === 'on' || power === 'shutting') && <Desktop />}
        {power === 'booting' && (
          <div className="crt-boot" onClick={skipBoot} role="presentation">
            {BOOT_LINES.map((l, i) => (
              <p key={i} style={{ animationDelay: `${i * (BOOT_MS / (BOOT_LINES.length + 1))}ms` }}>{l || ' '}</p>
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
