import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { beige, keyDark, keyLight } from './materials'
import { keyLabelTexture } from './textures'

// Layout de teclado "clicky" dos anos 80 (bloco principal + numérico).
// Cada tecla: [código do KeyboardEvent, legenda, largura em unidades, escura?]
const ROWS = [
  [['Escape', 'Esc', 1, 1], null, ['F1', 'F1', 1, 1], ['F2', 'F2', 1, 1], ['F3', 'F3', 1, 1], ['F4', 'F4', 1, 1], null,
    ['F5', 'F5', 1, 1], ['F6', 'F6', 1, 1], ['F7', 'F7', 1, 1], ['F8', 'F8', 1, 1], null,
    ['F9', 'F9', 1, 1], ['F10', 'F10', 1, 1], ['F11', 'F11', 1, 1], ['F12', 'F12', 1, 1]],
  [['Backquote', '`'], ...'1234567890'.split('').map((d) => [`Digit${d}`, d]), ['Minus', '-'], ['Equal', '='], ['Backspace', '←', 2, 1]],
  [['Tab', 'Tab', 1.5, 1], ...'QWERTYUIOP'.split('').map((k) => [`Key${k}`, k]), ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\', 1.5]],
  [['CapsLock', 'Caps', 1.75, 1], ...'ASDFGHJKL'.split('').map((k) => [`Key${k}`, k]), ['Semicolon', 'Ç'], ['Quote', "'"], ['Enter', 'Enter', 2.25, 1]],
  [['ShiftLeft', 'Shift', 2.25, 1], ...'ZXCVBNM'.split('').map((k) => [`Key${k}`, k]), ['Comma', ','], ['Period', '.'], ['Slash', ';'], ['ShiftRight', 'Shift', 2.75, 1]],
  [['ControlLeft', 'Ctrl', 1.5, 1], null, ['AltLeft', 'Alt', 1.5, 1], ['Space', '', 8.5], ['AltRight', 'Alt', 1.5, 1], null, ['ControlRight', 'Ctrl', 1.5, 1]],
]
const NUMPAD = [
  [['NumLock', 'Num', 1, 1], ['NumpadDivide', '/', 1, 1], ['NumpadMultiply', '*', 1, 1], ['NumpadSubtract', '-', 1, 1]],
  [['Numpad7', '7'], ['Numpad8', '8'], ['Numpad9', '9'], ['NumpadAdd', '+', 1, 1]],
  [['Numpad4', '4'], ['Numpad5', '5'], ['Numpad6', '6'], ['NumpadComma', '.', 1, 1]],
  [['Numpad1', '1'], ['Numpad2', '2'], ['Numpad3', '3'], ['NumpadEnter', '↵', 1, 1]],
  [['Numpad0', '0', 2], ['NumpadDecimal', ',']],
]

const U = 0.0192 // passo entre teclas (19 mm, como num teclado real)
const KEY_GAP = 0.0028
const KEY_H = 0.011

// Tecla em tronco de pirâmide: topo menor que a base, como as teclas antigas.
function useKeycapGeometry() {
  return useMemo(() => {
    const g = new THREE.CylinderGeometry(0.78 / Math.SQRT2, 1 / Math.SQRT2, 1, 4, 1)
    g.rotateY(Math.PI / 4)
    g.translate(0, 0.5, 0)
    g.computeVertexNormals()
    return g
  }, [])
}

function layoutKeys() {
  const keys = []
  const rowZ = (r) => (r === 0 ? -2.75 : r - 2) * U
  ROWS.forEach((row, r) => {
    let x = 0
    row.forEach((k) => {
      if (!k) { x += r === 0 ? 0.5 : 0.25; return }
      const [code, label, w = 1, dark = 0] = k
      keys.push({ code, label, w, dark, x: x + w / 2, z: rowZ(r) })
      x += w
    })
  })
  NUMPAD.forEach((row, r) => {
    let x = 15.75
    row.forEach(([code, label, w = 1, dark = 0]) => {
      keys.push({ code, label, w, dark, x: x + w / 2, z: rowZ(r + 1) })
      x += w
    })
  })
  return keys
}

export default function Keyboard(props) {
  const keys = useMemo(layoutKeys, [])
  const geo = useKeycapGeometry()
  const refs = useRef({})
  const pressed = useRef(new Set())

  useEffect(() => {
    const down = (e) => pressed.current.add(e.code)
    const up = (e) => pressed.current.delete(e.code)
    const clear = () => pressed.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  useFrame((_, dt) => {
    for (const k of keys) {
      const m = refs.current[k.code]
      if (!m) continue
      const target = pressed.current.has(k.code) ? -0.0045 : 0
      m.position.y = THREE.MathUtils.damp(m.position.y, target, 30, dt)
    }
  })

  const totalW = 19.75 * U
  return (
    <group {...props}>
      <RoundedBox args={[totalW + 0.03, 0.026, 6.9 * U]} radius={0.006} smoothness={3} position={[0, 0.013, 0]} material={beige} castShadow receiveShadow />
      <group position={[-totalW / 2, 0.026, -0.125 * U]}>
        {keys.map((k) => (
          <group key={k.code} ref={(m) => { refs.current[k.code] = m }} position={[k.x * U, 0, k.z]}>
            <mesh
              geometry={geo}
              scale={[k.w * U - KEY_GAP, KEY_H, U - KEY_GAP]}
              material={k.dark ? keyDark : keyLight}
              castShadow
            />
            {k.label && (
              <mesh position={[-(k.w * U) / 2 + U * 0.42, KEY_H + 0.0002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[U * 0.62, U * 0.62]} />
                <meshBasicMaterial map={keyLabelTexture(k.label)} transparent depthWrite={false} toneMapped={false} opacity={0.85} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  )
}
