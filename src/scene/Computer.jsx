import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { useStore } from '../store'
import CRTScreen from '../screen/CRTScreen'
import { clickable } from './clickable'
import { beige, beigeDark, plasticBlack, slot } from './materials'
import { labelTexture } from './textures'

// Tela 4:3 do monitor, em metros. O site (1024×768 px) é escalado para caber.
export const SCREEN = {
  width: 0.32,
  height: 0.24,
  center: new THREE.Vector3(0, 1.125, 0.092),
}
// O <Html transform> do drei mapeia 1px CSS para 0.025 unidades (distanceFactor 10).
const HTML_SCALE = SCREEN.width / (1024 * 0.025)

// Vidro do tubo, levemente abaulado como num CRT de verdade.
function useCurvedGlass(w, h, bulge) {
  return useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 24, 18)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (w / 2)
      const y = p.getY(i) / (h / 2)
      p.setZ(i, bulge * (1 - x * x * 0.6) * (1 - y * y * 0.6))
    }
    g.computeVertexNormals()
    return g
  }, [w, h, bulge])
}

// Caixa traseira do CRT: um tronco de pirâmide que afina para trás.
function useTubeHousing() {
  return useMemo(() => {
    const g = new THREE.CylinderGeometry(0.6 / Math.SQRT2, 1 / Math.SQRT2, 0.3, 4, 1)
    g.rotateY(Math.PI / 4)
    g.rotateX(-Math.PI / 2)
    g.scale(0.4, 0.34, 1)
    g.computeVertexNormals()
    return g
  }, [])
}

function Led({ position, power, kind }) {
  const mat = useRef()
  useFrame(({ clock }) => {
    if (!mat.current) return
    const on = power !== 'off'
    let intensity = on ? 2.4 : 0.15
    if (kind === 'hdd') {
      intensity = power === 'booting' || power === 'warming'
        ? (Math.sin(clock.elapsedTime * 37) > 0.2 ? 3 : 0.1)
        : (on && Math.sin(clock.elapsedTime * 3.1) > 0.97 ? 2.5 : 0.1)
    }
    mat.current.emissiveIntensity = intensity
  })
  return (
    <mesh position={position}>
      <boxGeometry args={[0.012, 0.005, 0.004]} />
      <meshStandardMaterial
        ref={mat}
        color={kind === 'hdd' ? '#5a3a00' : '#0b3d0b'}
        emissive={kind === 'hdd' ? '#ffae1a' : '#39ff5a'}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function Computer() {
  const power = useStore((s) => s.power)
  const focused = useStore((s) => s.focused)
  const togglePower = useStore((s) => s.togglePower)
  const glassGeo = useCurvedGlass(SCREEN.width + 0.006, SCREEN.height + 0.006, 0.006)
  const housing = useTubeHousing()
  const glassMat = useRef()
  const screenLight = useRef()
  const badge = labelTexture(['VP-1989'], { w: 256, h: 48, bg: '#cfc5ab', fg: '#5b5446', font: 'bold 30px monospace' })
  const sticky = labelTexture(['git push', 'origin main', '      ✓'], { w: 256, h: 256, bg: '#ffe873', fg: '#3b3320', font: '30px monospace', rotate: -0.04 })

  const onGlassClick = () => {
    const s = useStore.getState()
    if (s.power === 'off') s.powerOn()
    else s.setFocused(true)
  }

  // O vidro "acende" um pouco além da borda do site: a bloom faz o brilho
  // vazar para a moldura, e uma luz fria ilumina o teclado.
  useFrame((_, dt) => {
    const lit = power === 'on' ? 1 : power === 'booting' ? 0.7 : power === 'warming' ? 1.4 : 0
    if (glassMat.current) {
      glassMat.current.emissiveIntensity = THREE.MathUtils.damp(glassMat.current.emissiveIntensity, lit * 0.55, 8, dt)
    }
    if (screenLight.current) {
      screenLight.current.intensity = THREE.MathUtils.damp(screenLight.current.intensity, lit * 0.35, 8, dt)
    }
  })

  return (
    <group>
      {/* ---------- Gabinete (desktop horizontal) ---------- */}
      <group position={[0, 0.83, -0.08]}>
        <RoundedBox args={[0.5, 0.14, 0.42]} radius={0.012} smoothness={3} material={beige} castShadow receiveShadow />
        {/* frente: faixa mais escura */}
        <mesh position={[0, 0, 0.2105]} material={beigeDark}>
          <boxGeometry args={[0.48, 0.12, 0.002]} />
        </mesh>
        {/* duas baias de disquete 5¼" */}
        {[0.028, -0.022].map((y) => (
          <group key={y} position={[0.11, y, 0.212]}>
            <mesh material={beige}><boxGeometry args={[0.2, 0.04, 0.004]} /></mesh>
            <mesh position={[0, 0.004, 0.0025]} material={slot}><boxGeometry args={[0.15, 0.006, 0.002]} /></mesh>
            <mesh position={[0.082, -0.01, 0.0025]} material={plasticBlack}><boxGeometry args={[0.014, 0.008, 0.003]} /></mesh>
          </group>
        ))}
        {/* grade de ventilação */}
        {Array.from({ length: 7 }, (_, i) => (
          <mesh key={i} position={[-0.17, 0.036 - i * 0.012, 0.212]} material={slot}>
            <boxGeometry args={[0.1, 0.004, 0.002]} />
          </mesh>
        ))}
        {/* botão de energia */}
        <mesh position={[-0.06, -0.02, 0.215]} material={plasticBlack} {...clickable(togglePower)}>
          <boxGeometry args={[0.026, 0.026, 0.01]} />
        </mesh>
        <Led position={[-0.06, 0.03, 0.212]} power={power} kind="power" />
        <Led position={[-0.035, 0.03, 0.212]} power={power} kind="hdd" />
      </group>

      {/* ---------- Monitor CRT ---------- */}
      <mesh position={[0, 0.9125, -0.05]} material={beigeDark} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.025, 32]} />
      </mesh>
      <group position={[0, 1.115, 0]}>
        <RoundedBox args={[0.44, 0.38, 0.07]} radius={0.02} smoothness={4} position={[0, 0, 0.055]} material={beige} castShadow receiveShadow />
        <mesh geometry={housing} position={[0, 0.005, -0.13]} material={beige} castShadow receiveShadow />
        {/* moldura interna escura em volta do vidro */}
        <mesh position={[0, 0.01, 0.0905]} material={plasticBlack}>
          <planeGeometry args={[0.36, 0.28]} />
        </mesh>
        {/* emblema e botão do monitor */}
        <mesh position={[-0.14, -0.163, 0.0905]}>
          <planeGeometry args={[0.07, 0.013]} />
          <meshStandardMaterial map={badge} roughness={0.6} />
        </mesh>
        <mesh position={[0.17, -0.163, 0.093]} material={beigeDark} {...clickable(togglePower)}>
          <boxGeometry args={[0.03, 0.014, 0.008]} />
        </mesh>
        <Led position={[0.14, -0.163, 0.091]} power={power} kind="power" />
        {/* post-it */}
        <mesh position={[0.185, 0.14, 0.0915]} rotation={[0, 0, -0.12]}>
          <planeGeometry args={[0.06, 0.06]} />
          <meshStandardMaterial map={sticky} roughness={0.9} />
        </mesh>
      </group>

      {/* vidro do tubo: escuro desligado, brilha ligado */}
      <mesh
        geometry={glassGeo}
        position={[SCREEN.center.x, SCREEN.center.y, SCREEN.center.z - 0.001]}
        {...clickable(onGlassClick)}
      >
        <meshPhysicalMaterial
          ref={glassMat}
          color="#0e1512"
          emissive="#9fd0c0"
          emissiveIntensity={0}
          roughness={0.12}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <pointLight ref={screenLight} position={[0, 1.1, 0.35]} color="#a8d8ff" intensity={0} distance={1.4} decay={2} />

      {/* o site do currículo, renderizado como DOM de verdade dentro da tela */}
      <Html
        transform
        position={[SCREEN.center.x, SCREEN.center.y, SCREEN.center.z + 0.005]}
        scale={HTML_SCALE}
        zIndexRange={[10, 0]}
        pointerEvents={focused && power !== 'off' ? 'auto' : 'none'}
        className="crt-html"
      >
        <CRTScreen />
      </Html>
    </group>
  )
}
