import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { floorTexture, posterTexture, skylineTexture, wallTexture } from './textures'

const BACK_Z = -1.0
const ROOM = { left: -2.4, right: 2.6, height: 2.8 }
const WIN = { x: -1.25, y: 1.55, w: 1.1, h: 1.0 }

function useMat(make, deps = []) {
  return useMemo(make, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

/** Parede do fundo com o vão da janela recortado (4 placas em volta). */
function BackWall({ material }) {
  const W = ROOM.right - ROOM.left
  const cx = (ROOM.left + ROOM.right) / 2
  const left = WIN.x - WIN.w / 2
  const right = WIN.x + WIN.w / 2
  const bottom = WIN.y - WIN.h / 2
  const top = WIN.y + WIN.h / 2
  const panels = [
    // [x, y, w, h]
    [(ROOM.left + left) / 2, ROOM.height / 2, left - ROOM.left, ROOM.height],
    [(right + ROOM.right) / 2, ROOM.height / 2, ROOM.right - right, ROOM.height],
    [WIN.x, bottom / 2, WIN.w, bottom],
    [WIN.x, (top + ROOM.height) / 2, WIN.w, ROOM.height - top],
  ]
  return (
    <group position={[0, 0, BACK_Z]}>
      {panels.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} material={material} receiveShadow>
          <planeGeometry args={[w, h]} />
        </mesh>
      ))}
      {/* rodapé */}
      <mesh position={[cx, 0.06, 0.01]}>
        <boxGeometry args={[W, 0.12, 0.02]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Window() {
  const sky = skylineTexture()
  const frame = useMat(() => new THREE.MeshStandardMaterial({ color: '#ece7dc', roughness: 0.5 }))
  const b = 0.04
  return (
    <group position={[WIN.x, WIN.y, BACK_Z]}>
      {/* cidade à noite, um pouco atrás da parede */}
      <mesh position={[0, 0, -0.35]}>
        <planeGeometry args={[WIN.w * 1.9, WIN.h * 1.9]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      {/* vidro com reflexo */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[WIN.w, WIN.h]} />
        <meshStandardMaterial color="#9fb6d0" transparent opacity={0.12} roughness={0.05} metalness={0.2} />
      </mesh>
      {/* batentes */}
      {[[0, WIN.h / 2, WIN.w + b * 2, b], [0, -WIN.h / 2, WIN.w + b * 2, b], [-WIN.w / 2, 0, b, WIN.h], [WIN.w / 2, 0, b, WIN.h], [0, 0, 0.025, WIN.h], [0, 0.12, WIN.w, 0.025]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} material={frame} castShadow>
          <boxGeometry args={[w, h, 0.07]} />
        </mesh>
      ))}
      {/* parapeito */}
      <mesh position={[0, -WIN.h / 2 - 0.03, 0.07]} material={frame} castShadow receiveShadow>
        <boxGeometry args={[WIN.w + 0.2, 0.035, 0.16]} />
      </mesh>
      {/* cortina presa de um lado */}
      <mesh position={[-WIN.w / 2 - 0.16, -0.05, 0.12]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, WIN.h + 0.45, 18, 1, true]} />
        <meshStandardMaterial color="#5b3a3a" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const BOOK_COLORS = ['#7a2e2e', '#2e4a7a', '#2e6a4f', '#8a6d2b', '#4b3a6b', '#2a2a2a', '#9c4b2a', '#335b66', '#6b2e52']

// Todos os livros da estante numa única InstancedMesh (uma chamada de desenho).
function Books({ books }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const c = new THREE.Color()
    books.forEach((b, i) => {
      q.setFromEuler(e.set(0, 0, b.tilt))
      m.compose(new THREE.Vector3(b.x, b.y, 0.02), q, new THREE.Vector3(b.w, b.h, b.d))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, c.set(b.color))
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [books])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, books.length]} castShadow>
      <boxGeometry />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  )
}

function Bookshelf(props) {
  const wood = useMat(() => new THREE.MeshStandardMaterial({ color: '#3d2a1d', roughness: 0.7 }))
  const books = useMemo(() => {
    const out = []
    let seed = 5
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    const shelves = [0.06, 0.5, 0.94, 1.38]
    shelves.forEach((y, s) => {
      let x = -0.36
      while (x < 0.33) {
        const w = 0.025 + r() * 0.025
        const h = 0.24 + r() * 0.14
        if (r() < 0.08) { x += 0.06; continue }
        const tilt = x > 0.25 && r() > 0.5 ? -0.18 : 0
        const i = out.length
        out.push({ x: x + w / 2, y: y + h / 2, w, h, d: 0.2 + r() * 0.04, color: BOOK_COLORS[(i + s * 3) % BOOK_COLORS.length], tilt })
        x += w + 0.002
      }
    })
    return out
  }, [])
  return (
    <group {...props}>
      {[0.03, 0.47, 0.91, 1.35, 1.8].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[0.8, 0.03, 0.3]} /></mesh>
      ))}
      {[-0.39, 0.39].map((x) => (
        <mesh key={x} position={[x, 0.91, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[0.025, 1.82, 0.3]} /></mesh>
      ))}
      <mesh position={[0, 0.91, -0.145]} material={wood}><boxGeometry args={[0.8, 1.82, 0.01]} /></mesh>
      <Books books={books} />
      {/* globo terrestre no topo */}
      <group position={[0.2, 1.815, 0]}>
        <mesh position={[0, 0.02, 0]} material={wood}><cylinderGeometry args={[0.05, 0.06, 0.03, 24]} /></mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.1, 32, 24]} />
          <meshStandardMaterial color="#3e6f8f" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

const clockInk = new THREE.MeshStandardMaterial({ color: '#222' })

function WallClock(props) {
  const hour = useRef()
  const minute = useRef()
  const second = useRef()
  const invalidate = useThree((s) => s.invalidate)
  // ponteiro de segundos "tique-taque": um quadro por segundo basta
  useEffect(() => {
    const id = setInterval(() => invalidate(), 1000)
    return () => clearInterval(id)
  }, [invalidate])
  useFrame(() => {
    const d = new Date()
    const s = d.getSeconds()
    const m = d.getMinutes() + s / 60
    const h = (d.getHours() % 12) + m / 60
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2
  })
  const hand = (ref, len, w, color, z) => (
    <group ref={ref} position={[0, 0, z]}>
      <mesh position={[0, len / 2 - 0.01, 0]}>
        <boxGeometry args={[w, len, 0.003]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.03, 48]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <circleGeometry args={[0.15, 48]} />
        <meshStandardMaterial color="#f2eee4" roughness={0.8} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} material={clockInk} position={[Math.sin((i / 12) * Math.PI * 2) * 0.13, Math.cos((i / 12) * Math.PI * 2) * 0.13, 0.018]} rotation={[0, 0, -(i / 12) * Math.PI * 2]}>
          <boxGeometry args={[0.006, i % 3 === 0 ? 0.03 : 0.015, 0.002]} />
        </mesh>
      ))}
      {hand(hour, 0.08, 0.01, '#222', 0.02)}
      {hand(minute, 0.12, 0.006, '#222', 0.023)}
      {hand(second, 0.13, 0.002, '#c0392b', 0.026)}
    </group>
  )
}

function Poster(props) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.69, 0.02]} />
        <meshStandardMaterial color="#1b1b1b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.45, 0.635]} />
        <meshStandardMaterial map={posterTexture()} roughness={0.7} />
      </mesh>
    </group>
  )
}

function FloorPlant(props) {
  const leaves = useMemo(() => {
    let seed = 9
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    return Array.from({ length: 16 }, (_, i) => ({
      rot: [-(0.3 + r() * 0.8), (i / 16) * Math.PI * 2 + r() * 0.3, 0],
      len: 0.35 + r() * 0.3,
      shade: r(),
    }))
  }, [])
  return (
    <group {...props}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.34, 32]} />
        <meshStandardMaterial color="#c9b79a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.33, 0]}><cylinderGeometry args={[0.16, 0.16, 0.02, 32]} /><meshStandardMaterial color="#2a1d14" /></mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.34, 0]} rotation={[0, l.rot[1], 0]}>
          <group rotation={[l.rot[0], 0, 0]}>
            <mesh position={[0, l.len / 2, 0]} scale={[0.07, l.len / 2, 0.012]} castShadow>
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial color={new THREE.Color().setHSL(0.31, 0.45, 0.18 + l.shade * 0.12)} roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}

export default function Room() {
  const wall = useMat(() => new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.95 }))
  const floor = useMat(() => new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.6 }))

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0, 1.5]} material={floor} receiveShadow>
        <planeGeometry args={[ROOM.right - ROOM.left, 5]} />
      </mesh>
      {/* tapete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0.45]} receiveShadow>
        <planeGeometry args={[2.3, 1.5]} />
        <meshStandardMaterial color="#5a3b33" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.45]} receiveShadow>
        <ringGeometry args={[0.6, 0.62, 4, 1]} />
        <meshStandardMaterial color="#c9a36a" roughness={1} />
      </mesh>
      <BackWall material={wall} />
      <mesh position={[ROOM.left, ROOM.height / 2, 1.5]} rotation={[0, Math.PI / 2, 0]} material={wall} receiveShadow>
        <planeGeometry args={[5, ROOM.height]} />
      </mesh>
      <mesh position={[ROOM.right, ROOM.height / 2, 1.5]} rotation={[0, -Math.PI / 2, 0]} material={wall} receiveShadow>
        <planeGeometry args={[5, ROOM.height]} />
      </mesh>
      <mesh position={[0.1, ROOM.height, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.right - ROOM.left, 5]} />
        <meshStandardMaterial color="#2b2f33" roughness={1} />
      </mesh>
      <Window />
      <Bookshelf position={[1.55, 0, BACK_Z + 0.16]} />
      <Poster position={[0.66, 1.5, BACK_Z + 0.012]} />
      <WallClock position={[-0.2, 1.68, BACK_Z + 0.02]} scale={0.8} />
      <FloorPlant position={[-2.0, 0, -0.55]} />
    </group>
  )
}
