import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useStore } from '../store'
import { SCREEN } from './Computer'

const OVERVIEW_TARGET = new THREE.Vector3(-0.05, 1.0, -0.1)

// Câmera: plano aberto do escritório ↔ zoom na tela do CRT.
// Começa longe e "entra" no escritório ao carregar.
export default function CameraRig() {
  const focused = useStore((s) => s.focused)
  const { camera, size, invalidate } = useThree()
  const look = useMemo(() => OVERVIEW_TARGET.clone().add(new THREE.Vector3(0.4, 0.3, 0)), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ pointer }, delta) => {
    // com frameloop="demand", o delta depois de um tempo parado pode ser enorme
    const dt = Math.min(delta, 0.1)
    const aspect = size.width / size.height
    const fov = THREE.MathUtils.degToRad(camera.fov)
    const tanHalf = Math.tan(fov / 2)

    if (focused) {
      // distância para a tela ocupar ~80% da altura (ou da largura, em telas estreitas)
      const byHeight = (SCREEN.height / 0.8) / (2 * tanHalf)
      const byWidth = (SCREEN.width / 0.94) / (2 * tanHalf * aspect)
      const d = Math.max(byHeight, byWidth)
      // desloca um pouco para cima: a tela fica abaixo da barra de botões
      const lift = SCREEN.height * 0.045
      pos.set(SCREEN.center.x + pointer.x * 0.008, SCREEN.center.y + lift + pointer.y * 0.006, SCREEN.center.z + d)
      target.set(SCREEN.center.x, SCREEN.center.y + lift, SCREEN.center.z)
    } else {
      // em telas estreitas a câmera recua para a mesa inteira caber
      const back = aspect < 1 ? 1.9 / aspect : aspect < 1.4 ? 2.3 : 1.85
      pos.set(0.55 + pointer.x * 0.12, 1.38 + pointer.y * 0.06, back)
      target.copy(OVERVIEW_TARGET)
    }

    const moving = easing.damp3(camera.position, pos, focused ? 0.45 : 0.7, dt, Infinity, undefined, 0.0002)
    const turning = easing.damp3(look, target, focused ? 0.35 : 0.6, dt, Infinity, undefined, 0.0002)
    camera.lookAt(look)
    if (moving || turning) invalidate()
  })

  return null
}
