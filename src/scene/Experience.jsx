import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, useProgress } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing'
import { useStore } from '../store'
import CameraRig from './CameraRig'
import Computer from './Computer'
import Desk, { DESK_TOP } from './Desk'
import Keyboard from './Keyboard'
import Lamp from './Lamp'
import Mouse from './Mouse'
import Props from './Props'
import Room from './Room'

function Ready() {
  const setReady = useStore((s) => s.setReady)
  useEffect(() => { setReady() }, [setReady])
  return null
}

export function Loader() {
  const { progress, active } = useProgress()
  const ready = useStore((s) => s.ready)
  if (ready && !active) return null
  return (
    <div className="loader" aria-live="polite">
      <div className="loader-box">
        <p>carregando escritório<span className="loader-dots" /></p>
        <div className="loader-bar"><span style={{ width: `${Math.max(8, progress)}%` }} /></div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <Canvas
      className="scene-canvas"
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 40, near: 0.01, far: 30, position: [2.4, 2.1, 4.2] }}
      onPointerMissed={() => useStore.getState().setFocused(false)}
    >
      <color attach="background" args={['#0a0c12']} />
      <fog attach="fog" args={['#0a0c12', 5, 11]} />

      {/* luz geral fria da noite + luar entrando pela janela */}
      <hemisphereLight args={['#6d7fa8', '#2a1f18', 0.55]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-2.2, 2.6, -2.5]} intensity={0.55} color="#9fb4ff" />
      <pointLight position={[0.6, 2.5, 1.6]} intensity={1.4} distance={5} decay={2} color="#ffe2bd" />

      <Suspense fallback={null}>
        <Room />
        <Desk />
        <Computer />
        <Keyboard position={[-0.04, DESK_TOP, 0.27]} rotation={[0.06, 0, 0]} />
        <Mouse />
        <Lamp />
        <Props />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={1.2} color="#ffd9a8" position={[0, 3, 2]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={0.6} color="#8fa8ff" position={[-3, 1.5, -2]} scale={[2, 2, 1]} />
          <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[2, 2, 3]} scale={1} />
        </Environment>
        <Ready />
      </Suspense>

      <CameraRig />

      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.7} radius={0.7} />
        <Noise opacity={0.025} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
