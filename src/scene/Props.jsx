import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Html, useTexture } from '@react-three/drei'
import { openResume } from '../content'
import { clickable } from './clickable'
import { cable, paper } from './materials'
import { labelTexture } from './textures'

// Folha do currículo em cima da mesa: clique abre o PDF.
function Resume() {
  const tex = useTexture('/textures/resume.jpg')
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const [hover, setHover] = useState(false)
  const base = clickable(openResume)
  const handlers = {
    ...base,
    onPointerOver: (e) => { base.onPointerOver(e); setHover(true) },
    onPointerOut: (e) => { base.onPointerOut(e); setHover(false) },
  }
  // A4 = 210 × 297 mm
  return (
    <group position={[0.66, 0.7615, 0.12]} rotation={[0, -0.32, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0.05]} position={[0.012, -0.0005, -0.01]} material={paper} receiveShadow>
        <planeGeometry args={[0.21, 0.297]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]} receiveShadow {...handlers}>
        <planeGeometry args={[0.21, 0.297]} />
        <meshStandardMaterial map={tex} roughness={0.85} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={hover ? 0.25 : 0.04} />
      </mesh>
      {/* clipe */}
      <mesh position={[-0.06, 0.002, -0.148]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.008, 0.0012, 6, 24, Math.PI * 1.6]} />
        <meshStandardMaterial color="#b7bcc2" metalness={0.9} roughness={0.25} />
      </mesh>
      {hover && (
        <Html position={[0, 0.05, -0.1]} center zIndexRange={[20, 11]} style={{ pointerEvents: 'none' }}>
          <div className="scene-tag">abrir curriculo.pdf ↗</div>
        </Html>
      )}
    </group>
  )
}

function Mug() {
  return (
    <group position={[-0.5, 0.76, 0.12]} rotation={[0, 0.9, 0]}>
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.038, 0.034, 0.09, 32, 1, true]} />
        <meshStandardMaterial color="#c0392b" roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.034, 0.034, 0.004, 32]} /><meshStandardMaterial color="#c0392b" roughness={0.3} /></mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.035, 0.035, 0.002, 32]} /><meshStandardMaterial color="#2b1608" roughness={0.15} /></mesh>
      <mesh position={[0.045, 0.048, 0]} castShadow>
        <torusGeometry args={[0.022, 0.006, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#c0392b" roughness={0.3} />
      </mesh>
    </group>
  )
}

function Floppies() {
  const labels = useMemo(() => [
    labelTexture(['CURRÍCULO', 'v2.0'], { w: 256, h: 128, bg: '#f2ede0', fg: '#222', font: 'bold 34px monospace' }),
    labelTexture(['PROJETOS'], { w: 256, h: 128, bg: '#f2ede0', fg: '#222', font: 'bold 34px monospace' }),
    labelTexture(['DOS 3.3'], { w: 256, h: 128, bg: '#f2ede0', fg: '#222', font: 'bold 34px monospace' }),
  ], [])
  const colors = ['#1f3f7a', '#2b2b2b', '#7a1f1f']
  return (
    <group position={[-0.47, 0.76, -0.02]}>
      {colors.map((c, i) => (
        <group key={c} position={[i * 0.004, 0.0015 + i * 0.0032, i * 0.006]} rotation={[0, 0.25 - i * 0.2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.003, 0.094]} />
            <meshStandardMaterial color={c} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.0016, -0.03]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 0.028]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.0016, 0.022]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.07, 0.035]} />
            <meshStandardMaterial map={labels[i]} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PenCup() {
  const pens = [['#f1c40f', 0.02, 0.01, 0.15], ['#2980b9', -0.012, 0.012, -0.1], ['#e74c3c', 0.004, -0.015, 0.05]]
  return (
    <group position={[0.36, 0.76, -0.28]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 24, 1, true]} />
        <meshStandardMaterial color="#3b3b3b" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {pens.map(([color, x, z, tilt]) => (
        <mesh key={color} position={[x, 0.1, z]} rotation={[tilt, 0, tilt * 0.6]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.15, 8]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function DeskPlant() {
  const leaves = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ a: (i / 9) * Math.PI * 2, t: 0.5 + (i % 3) * 0.25, l: 0.07 + (i % 4) * 0.012 })), [])
  return (
    <group position={[0.7, 0.76, -0.27]}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.038, 0.08, 24]} />
        <meshStandardMaterial color="#d9774b" roughness={0.8} />
      </mesh>
      {leaves.map((lf, i) => (
        <group key={i} position={[0, 0.08, 0]} rotation={[0, lf.a, 0]}>
          <mesh rotation={[-lf.t, 0, 0]} position={[0, lf.l * 0.4, -lf.l * 0.35]} scale={[0.018, lf.l, 0.006]} castShadow>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#3f7d3a" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function KeyboardCable() {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.775, 0.205),
      new THREE.Vector3(-0.12, 0.764, 0.16),
      new THREE.Vector3(-0.22, 0.764, 0.15),
      new THREE.Vector3(-0.2, 0.78, 0.13),
    ])
    return new THREE.TubeGeometry(curve, 30, 0.0028, 6, false)
  }, [])
  return <mesh geometry={geo} material={cable} castShadow />
}

export default function Props() {
  return (
    <group>
      <Resume />
      <Mug />
      <Floppies />
      <PenCup />
      <DeskPlant />
      <KeyboardCable />
    </group>
  )
}
