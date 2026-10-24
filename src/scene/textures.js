import * as THREE from 'three'

// Texturas geradas em <canvas>: madeira, piso, parede, a cidade pela
// janela, pôster, lombadas de livros e as legendas das teclas.
// Nada é baixado, então a cena carrega rápido.

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function toTexture(c, { repeat, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
  }
  return t
}

// Ruído determinístico: as texturas saem iguais a cada visita.
function rng(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const cache = new Map()
const memo = (key, fn) => {
  if (!cache.has(key)) cache.set(key, fn())
  return cache.get(key)
}

export const woodTexture = () => memo('wood', () => {
  const [c, g] = canvas(1024, 512)
  const r = rng(7)
  g.fillStyle = '#6b4126'
  g.fillRect(0, 0, 1024, 512)
  for (let i = 0; i < 260; i++) {
    const y = r() * 512
    g.strokeStyle = `rgba(${40 + r() * 40},${20 + r() * 20},${10 + r() * 10},${0.08 + r() * 0.18})`
    g.lineWidth = 1 + r() * 3
    g.beginPath()
    g.moveTo(0, y)
    for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + y) * 4 + (r() - 0.5) * 2)
    g.stroke()
  }
  for (let i = 0; i < 6; i++) {
    const x = r() * 1024, y = r() * 512
    const grd = g.createRadialGradient(x, y, 0, x, y, 18 + r() * 14)
    grd.addColorStop(0, 'rgba(40,20,8,.55)')
    grd.addColorStop(1, 'rgba(40,20,8,0)')
    g.fillStyle = grd
    g.beginPath(); g.ellipse(x, y, 40, 12, 0, 0, Math.PI * 2); g.fill()
  }
  return toTexture(c)
})

export const floorTexture = () => memo('floor', () => {
  const [c, g] = canvas(1024, 1024)
  const r = rng(3)
  const plankH = 128
  for (let row = 0; row < 8; row++) {
    let x = -r() * 400
    while (x < 1024) {
      const w = 300 + r() * 300
      const l = 28 + r() * 10
      g.fillStyle = `hsl(25, ${35 + r() * 10}%, ${l}%)`
      g.fillRect(x, row * plankH, w, plankH)
      for (let i = 0; i < 18; i++) {
        g.strokeStyle = `rgba(30,15,5,${0.05 + r() * 0.12})`
        g.lineWidth = 1 + r() * 2
        const yy = row * plankH + r() * plankH
        g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy + (r() - 0.5) * 6); g.stroke()
      }
      g.fillStyle = 'rgba(15,8,3,.6)'
      g.fillRect(x, row * plankH, 3, plankH)
      x += w
    }
    g.fillStyle = 'rgba(15,8,3,.55)'
    g.fillRect(0, row * plankH, 1024, 3)
  }
  return toTexture(c, { repeat: [3, 3] })
})

export const wallTexture = () => memo('wall', () => {
  const [c, g] = canvas(512, 512)
  const r = rng(11)
  g.fillStyle = '#4a5560'
  g.fillRect(0, 0, 512, 512)
  // listras discretas de papel de parede
  for (let x = 0; x < 512; x += 32) {
    g.fillStyle = 'rgba(255,255,255,.025)'
    g.fillRect(x, 0, 14, 512)
  }
  for (let i = 0; i < 6000; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},.025)`
    g.fillRect(r() * 512, r() * 512, 2, 2)
  }
  return toTexture(c, { repeat: [6, 2] })
})

export const skylineTexture = () => memo('skyline', () => {
  const [c, g] = canvas(1024, 768)
  const r = rng(21)
  const sky = g.createLinearGradient(0, 0, 0, 768)
  sky.addColorStop(0, '#070b1c')
  sky.addColorStop(0.55, '#1b2148')
  sky.addColorStop(0.85, '#5a3a5e')
  sky.addColorStop(1, '#c0705a')
  g.fillStyle = sky
  g.fillRect(0, 0, 1024, 768)
  for (let i = 0; i < 160; i++) {
    g.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`
    g.fillRect(r() * 1024, r() * 380, 1.5, 1.5)
  }
  // lua
  const mg = g.createRadialGradient(780, 150, 10, 780, 150, 110)
  mg.addColorStop(0, 'rgba(255,245,220,1)')
  mg.addColorStop(0.3, 'rgba(255,240,210,.9)')
  mg.addColorStop(0.32, 'rgba(255,240,210,.18)')
  mg.addColorStop(1, 'rgba(255,240,210,0)')
  g.fillStyle = mg
  g.beginPath(); g.arc(780, 150, 110, 0, Math.PI * 2); g.fill()

  const layers = [
    { base: 520, h: 200, color: '#141833', lit: 0.12 },
    { base: 600, h: 300, color: '#0c0f22', lit: 0.25 },
    { base: 690, h: 380, color: '#06070f', lit: 0.35 },
  ]
  for (const L of layers) {
    let x = -20
    while (x < 1044) {
      const w = 40 + r() * 90
      const h = L.h * (0.35 + r() * 0.65)
      const top = L.base - h + 120
      g.fillStyle = L.color
      g.fillRect(x, top, w, 900)
      for (let wy = top + 10; wy < 768; wy += 14) {
        for (let wx = x + 6; wx < x + w - 6; wx += 11) {
          if (r() < L.lit) {
            g.fillStyle = r() > 0.2 ? `rgba(255,${190 + r() * 50},${110 + r() * 60},.85)` : 'rgba(150,200,255,.8)'
            g.fillRect(wx, wy, 5, 7)
          }
        }
      }
      x += w + 2
    }
  }
  return toTexture(c)
})

export const posterTexture = () => memo('poster', () => {
  const [c, g] = canvas(512, 720)
  const grd = g.createLinearGradient(0, 0, 0, 720)
  grd.addColorStop(0, '#1a1036')
  grd.addColorStop(0.6, '#3b1650')
  grd.addColorStop(1, '#ff7a4d')
  g.fillStyle = grd
  g.fillRect(0, 0, 512, 720)
  // sol retrô listrado
  g.save()
  g.beginPath(); g.arc(256, 400, 150, 0, Math.PI * 2); g.clip()
  const sun = g.createLinearGradient(0, 250, 0, 550)
  sun.addColorStop(0, '#ffd36b'); sun.addColorStop(1, '#ff4f7b')
  g.fillStyle = sun
  g.fillRect(0, 250, 512, 300)
  g.fillStyle = '#2a1245'
  for (let i = 0; i < 7; i++) g.fillRect(0, 420 + i * 20, 512, 4 + i * 2)
  g.restore()
  // grid
  g.strokeStyle = 'rgba(255,90,200,.7)'
  g.lineWidth = 2
  for (let i = 0; i < 9; i++) {
    const y = 560 + i * i * 2.4
    g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke()
  }
  for (let i = -8; i <= 8; i++) {
    g.beginPath(); g.moveTo(256 + i * 18, 560); g.lineTo(256 + i * 90, 720); g.stroke()
  }
  g.fillStyle = '#fff3d6'
  g.textAlign = 'center'
  g.font = 'bold 66px monospace'
  g.fillText('</>', 256, 130)
  g.font = 'bold 30px monospace'
  g.fillText('HELLO, WORLD', 256, 190)
  g.font = '20px monospace'
  g.fillStyle = 'rgba(255,243,214,.75)'
  g.fillText('code · café · repeat', 256, 225)
  return toTexture(c)
})

export const spineTexture = (label, color, seed) => memo(`spine-${label}-${color}`, () => {
  const [c, g] = canvas(64, 256)
  const r = rng(seed)
  g.fillStyle = color
  g.fillRect(0, 0, 64, 256)
  g.fillStyle = 'rgba(255,255,255,.25)'
  g.fillRect(0, 22, 64, 4); g.fillRect(0, 230, 64, 4)
  if (r() > 0.4) { g.fillRect(0, 34, 64, 2); g.fillRect(0, 220, 64, 2) }
  g.save()
  g.translate(32, 128)
  g.rotate(Math.PI / 2)
  g.fillStyle = 'rgba(255,245,225,.9)'
  g.font = 'bold 20px monospace'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(label, 0, 0)
  g.restore()
  return toTexture(c)
})

export const keyLabelTexture = (label) => memo(`key-${label}`, () => {
  const [c, g] = canvas(64, 64)
  g.fillStyle = 'rgba(0,0,0,0)'
  g.clearRect(0, 0, 64, 64)
  g.fillStyle = '#3a342b'
  const size = label.length > 2 ? 15 : 26
  g.font = `600 ${size}px monospace`
  g.textAlign = label.length > 2 ? 'left' : 'left'
  g.textBaseline = 'top'
  g.fillText(label, 9, 8)
  return toTexture(c)
})

export const labelTexture = (lines, { w = 256, h = 256, bg = '#fff59a', fg = '#2b2b2b', font = '28px monospace', rotate = 0 } = {}) =>
  memo(`label-${lines.join('|')}-${bg}`, () => {
    const [c, g] = canvas(w, h)
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    g.fillStyle = fg
    g.font = font
    g.textBaseline = 'top'
    g.translate(w / 2, h / 2)
    g.rotate(rotate)
    g.translate(-w / 2, -h / 2)
    lines.forEach((l, i) => g.fillText(l, 18, 22 + i * (parseInt(font, 10) * 1.3)))
    return toTexture(c)
  })
