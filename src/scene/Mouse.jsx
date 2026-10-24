import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { beige, beigeDark, cable } from './materials'
import { approach } from './anim'

const PAD = new THREE.Vector3(0.37, 0.76, 0.26)

// Mouse "caixote" de dois botões, com bolinha e fio. Ele acompanha o
// ponteiro de verdade sobre o mousepad e afunda o botão no clique.
export default function Mouse() {
  const body = useRef()
  const left = useRef()
  const right = useRef()
  const buttons = useRef({ 0: false, 2: false })
  const cableMesh = useRef()
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    const down = (e) => { buttons.current[e.button] = true; invalidate() }
    const up = (e) => { buttons.current[e.button] = false; invalidate() }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [invalidate])

  const tubeFor = (end) => {
    const curve = new THREE.CatmullRomCurve3([
      end,
      new THREE.Vector3(end.x - 0.01, 0.765, end.z - 0.09),
      new THREE.Vector3(0.27, 0.764, 0.06),
      new THREE.Vector3(0.2, 0.77, 0.14),
      new THREE.Vector3(0.18, 0.8, 0.13),
    ])
    return new THREE.TubeGeometry(curve, 40, 0.0025, 6, false)
  }
  const initialTube = useMemo(() => tubeFor(new THREE.Vector3(PAD.x, 0.772, PAD.z - 0.05)), [])

  const tmp = useMemo(() => new THREE.Vector3(), [])
  const lastCable = useRef(new THREE.Vector3())

  useFrame(({ pointer }, dt) => {
    if (!body.current) return
    const tx = PAD.x + THREE.MathUtils.clamp(pointer.x, -1, 1) * 0.06
    const tz = PAD.z - THREE.MathUtils.clamp(pointer.y, -1, 1) * 0.05
    const moving = [
      approach(body.current.position, 'x', tx, 10, dt, 2e-5),
      approach(body.current.position, 'z', tz, 10, dt, 2e-5),
      approach(left.current.position, 'y', buttons.current[0] ? 0.0255 : 0.0285, 40, dt, 2e-5),
      approach(right.current.position, 'y', buttons.current[2] ? 0.0255 : 0.0285, 40, dt, 2e-5),
    ].some(Boolean)
    if (moving) invalidate()

    // refaz o fio só quando o mouse andou de verdade
    tmp.set(body.current.position.x, 0.772, body.current.position.z - 0.05)
    if (tmp.distanceToSquared(lastCable.current) > 0.000004 && cableMesh.current) {
      lastCable.current.copy(tmp)
      cableMesh.current.geometry.dispose()
      cableMesh.current.geometry = tubeFor(tmp.clone())
    }
  })

  return (
    <group>
      {/* mousepad */}
      <RoundedBox args={[0.24, 0.004, 0.2]} radius={0.002} smoothness={2} position={[PAD.x, 0.762, PAD.z]} receiveShadow>
        <meshStandardMaterial color="#23324a" roughness={0.95} />
      </RoundedBox>
      <group ref={body} position={[PAD.x, 0.764, PAD.z]}>
        <RoundedBox args={[0.062, 0.026, 0.1]} radius={0.01} smoothness={3} position={[0, 0.013, 0]} material={beige} />
        <mesh ref={left} position={[-0.0155, 0.0285, -0.028]} material={beigeDark}>
          <boxGeometry args={[0.028, 0.004, 0.04]} />
        </mesh>
        <mesh ref={right} position={[0.0155, 0.0285, -0.028]} material={beigeDark}>
          <boxGeometry args={[0.028, 0.004, 0.04]} />
        </mesh>
      </group>
      <mesh ref={cableMesh} geometry={initialTube} material={cable} />
    </group>
  )
}
