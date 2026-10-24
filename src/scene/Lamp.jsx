import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store'
import { clickable } from './clickable'
import { lampPaint, metal } from './materials'
import { approach } from './anim'
import Glow from './Glow'

// Cilindro entre dois pontos (os braços da luminária).
function Rod({ from, to, radius = 0.008, material = lampPaint }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion} material={material} castShadow>
      <cylinderGeometry args={[radius, radius, length, 12]} />
    </mesh>
  )
}

const BASE = [-0.6, 0.76, -0.2]
const ELBOW = [-0.64, 1.2, -0.26]
const HEAD = [-0.42, 1.27, 0.0]
const TARGET = new THREE.Vector3(-0.22, 0.76, 0.2)

// Luminária articulada de escritório: clique nela para ligar/desligar.
export default function Lamp() {
  const lampOn = useStore((s) => s.lampOn)
  const toggleLamp = useStore((s) => s.toggleLamp)
  const spot = useRef()
  const bulb = useRef()
  const glow = useRef()
  const invalidate = useThree((s) => s.invalidate)
  const head = useMemo(() => new THREE.Vector3(...HEAD), [])

  const shadeQuat = useMemo(() => {
    const dir = head.clone().sub(TARGET).normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  }, [head])
  const toTarget = useMemo(() => TARGET.clone().sub(head).normalize(), [head])
  const bulbPos = useMemo(() => head.clone().addScaledVector(toTarget, 0.045), [head, toTarget])
  const spotPos = useMemo(() => head.clone().addScaledVector(toTarget, 0.03), [head, toTarget])

  useEffect(() => {
    if (spot.current) {
      spot.current.target.position.copy(TARGET)
      spot.current.target.updateMatrixWorld()
    }
  }, [])

  useFrame((_, dt) => {
    if (!spot.current || !bulb.current || !glow.current) return
    const moving = [
      approach(spot.current, 'intensity', lampOn ? 6 : 0, 14, dt, 0.01),
      approach(bulb.current, 'emissiveIntensity', lampOn ? 2 : 0.05, 14, dt, 0.01),
      approach(glow.current, 'opacity', lampOn ? 0.55 : 0, 14, dt, 0.005),
    ].some(Boolean)
    if (moving) invalidate()
  })

  const click = clickable(toggleLamp)

  return (
    <group>
      <group {...click}>
        <mesh position={[BASE[0], BASE[1] + 0.012, BASE[2]]} material={lampPaint} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.078, 0.024, 40]} />
        </mesh>
        <mesh position={[BASE[0] + 0.035, BASE[1] + 0.027, BASE[2] + 0.03]} material={metal}>
          <cylinderGeometry args={[0.008, 0.008, 0.008, 16]} />
        </mesh>
        <Rod from={[BASE[0], BASE[1] + 0.02, BASE[2]]} to={ELBOW} />
        <Rod from={[BASE[0] + 0.018, BASE[1] + 0.03, BASE[2]]} to={[ELBOW[0] + 0.018, ELBOW[1] - 0.02, ELBOW[2]]} radius={0.003} material={metal} />
        <mesh position={ELBOW} material={metal}><sphereGeometry args={[0.016, 16, 16]} /></mesh>
        <Rod from={ELBOW} to={HEAD} />
        <Rod from={[ELBOW[0], ELBOW[1] + 0.02, ELBOW[2]]} to={[HEAD[0], HEAD[1] + 0.02, HEAD[2]]} radius={0.003} material={metal} />
        <group position={HEAD} quaternion={shadeQuat}>
          <mesh material={metal}><sphereGeometry args={[0.018, 16, 16]} /></mesh>
          <mesh position={[0, -0.05, 0]} material={lampPaint} castShadow>
            <cylinderGeometry args={[0.025, 0.075, 0.1, 40, 1, true]} />
          </mesh>
          <mesh position={[0, -0.0, 0]} material={lampPaint}>
            <sphereGeometry args={[0.026, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* interior claro do refletor */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.0245, 0.0745, 0.099, 40, 1, true]} />
            <meshStandardMaterial color="#f3ead2" side={THREE.BackSide} roughness={0.4} />
          </mesh>
        </group>
        <mesh position={bulbPos}>
          <sphereGeometry args={[0.022, 24, 24]} />
          <meshStandardMaterial ref={bulb} color="#fff6dc" emissive="#ffd9a0" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        <Glow ref={glow} position={bulbPos} color="#ffc878" size={0.22} opacity={0.55} />
      </group>
      <spotLight
        ref={spot}
        position={spotPos}
        angle={0.72}
        penumbra={0.65}
        intensity={6}
        distance={3}
        decay={1.6}
        color="#ffcf8a"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
    </group>
  )
}
