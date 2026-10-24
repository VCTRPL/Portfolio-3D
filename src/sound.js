// Sons sintetizados com Web Audio: nenhum arquivo para baixar.
let ctx = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state !== 'running') ctx.resume()
  return ctx
}

// Celulares só liberam o áudio dentro de um toque do usuário. No primeiro
// toque/clique em qualquer lugar, cria o contexto e toca um som mudo para
// destravar. No iPhone, a sessão "playback" faz os sons tocarem mesmo com
// a chave de silencioso ligada (Safari 16.4+).
function unlock() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'playback'
  } catch { /* navegador sem audioSession */ }
  const ac = audio()
  if (!ac) return
  const src = ac.createBufferSource()
  src.buffer = ac.createBuffer(1, 1, 22050)
  src.connect(ac.destination)
  src.start(0)
  if (ac.state === 'running') {
    ;['touchend', 'pointerdown', 'click', 'keydown'].forEach((t) => window.removeEventListener(t, unlock, true))
  }
}
;['touchend', 'pointerdown', 'click', 'keydown'].forEach((t) => window.addEventListener(t, unlock, true))

// Ruído curto filtrado + um "toc" grave: o estalo de um interruptor.
function click({ freq = 2200, thump = 140, gain = 0.5, length = 0.05 } = {}) {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime

  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * length), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4)
  const noise = ac.createBufferSource()
  noise.buffer = buffer
  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = freq
  band.Q.value = 1.2
  const noiseGain = ac.createGain()
  noiseGain.gain.value = gain
  noise.connect(band).connect(noiseGain).connect(ac.destination)
  noise.start(t)

  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(thump, t)
  osc.frequency.exponentialRampToValueAtTime(thump * 0.4, t + 0.06)
  const oscGain = ac.createGain()
  oscGain.gain.setValueAtTime(gain * 0.8, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  osc.connect(oscGain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.08)
}

// Botão de energia do gabinete: clique mais "pesado", em dois tempos
// (apertar e soltar).
export function playPowerClick() {
  click({ freq: 1500, thump: 110, gain: 0.55, length: 0.06 })
  setTimeout(() => click({ freq: 2600, thump: 180, gain: 0.25, length: 0.03 }), 90)
}

// Interruptor da luminária: estalo seco e agudo.
export function playLampClick() {
  click({ freq: 3400, thump: 260, gain: 0.45, length: 0.035 })
}
