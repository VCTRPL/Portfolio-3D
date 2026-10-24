import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useProgress } from '@react-three/drei'
import { useStore } from '../store'
import { QUALITY } from './quality'
import CameraRig from './CameraRig'
import Computer from './Computer'
import Desk, { DESK_TOP } from './Desk'
import Keyboard from './Keyboard'
import Lamp from './Lamp'
import Mouse from './Mouse'
import Props from './Props'
import Room from './Room'

// A cena só é desenhada quando algo muda (frameloop="demand"). Cada
// animação pede o próximo quadro com invalidate() enquanto está andando;
// aqui ficam os gatilhos globais: mover o ponteiro e redimensionar.
function DemandTriggers() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const on = () => invalidate()
    window.addEventListener('pointermove', on, { passive: true })
    window.addEventListener('resize', on)
    const unsub = useStore.subscribe(on)
    return () => {
      window.removeEventListener('pointermove', on)
      window.removeEventListener('resize', on)
      unsub()
    }
  }, [invalidate])
  return null
}

function Ready() {
  const setReady = useStore((s) => s.setReady)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    // Nada que projeta sombra se mexe: o mapa de sombras é calculado uma vez.
    gl.shadowMap.needsUpdate = true
    invalidate()
    setReady()
    if (new URLSearchParams(window.location.search).has('debug')) window.__gl = gl
  }, [gl, invalidate, setReady])
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
      frameloop="demand"
      shadows={QUALITY.shadows}
      dpr={QUALITY.dpr}
      gl={{ antialias: true, powerPreference: 'default', stencil: false }}
      onCreated={({ gl }) => { gl.shadowMap.autoUpdate = false }}
      camera={{ fov: 40, near: 0.01, far: 30, position: [2.4, 2.1, 4.2] }}
      onPointerMissed={() => useStore.getState().setFocused(false)}
    >
      <color attach="background" args={['#0a0c12']} />
      <fog attach="fog" args={['#0a0c12', 5, 11]} />

      {/* luz geral fria da noite + luar entrando pela janela */}
      <hemisphereLight args={['#8090b8', '#3a2c22', 0.95]} />
      <directionalLight position={[-2.2, 2.6, -2.5]} intensity={0.55} color="#9fb4ff" />

      <Suspense fallback={null}>
        <Room />
        <Desk />
        <Computer />
        <Keyboard position={[-0.04, DESK_TOP, 0.27]} rotation={[0.06, 0, 0]} />
        <Mouse />
        <Lamp />
        <Props />
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={1.2} color="#ffd9a8" position={[0, 3, 2]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={0.6} color="#8fa8ff" position={[-3, 1.5, -2]} scale={[2, 2, 1]} />
          <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[2, 2, 3]} scale={1} />
        </Environment>
        <Ready />
      </Suspense>

      <CameraRig />
      <DemandTriggers />
    </Canvas>
  )
}
