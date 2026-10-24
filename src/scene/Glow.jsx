import * as THREE from 'three'

let glowTexture = null
function getGlowTexture() {
  if (glowTexture) return glowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,.45)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

// Halo aditivo barato no lugar do bloom de pós-processamento:
// um sprite com gradiente radial (LEDs, lâmpada).
export default function Glow({ ref, position, color = '#ffffff', size = 0.05, opacity = 1 }) {
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        ref={ref}
        map={getGlowTexture()}
        color={color}
        opacity={opacity}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}
