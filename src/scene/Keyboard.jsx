import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { beige, keyDark, keyLight } from './materials'

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

// Todas as legendas num único atlas (uma textura, uma chamada de desenho).
function buildLabelAtlas(labels) {
  const cells = Math.ceil(Math.sqrt(labels.length))
  const S = 64
  const c = document.createElement('canvas')
  c.width = c.height = cells * S
  const g = c.getContext('2d')
  g.fillStyle = '#3a342b'
  g.textBaseline = 'top'
  const index = new Map()
  labels.forEach((label, i) => {
    const cx = i % cells
    const cy = Math.floor(i / cells)
    g.font = `600 ${label.length > 2 ? 15 : 26}px monospace`
    g.fillText(label, cx * S + 9, cy * S + 8)
    index.set(label, [cx, cells - 1 - cy]) // flipY: linha 0 do canvas fica em v = 1
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return { tex, index, cells }
}

const labelVertex = /* glsl */`
  attribute vec2 cell;
  uniform float cells;
  varying vec2 vUv;
  void main() {
    vUv = (uv + cell) / cells;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`
const labelFragment = /* glsl */`
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.1) discard;
    gl_FragColor = vec4(c.rgb * 0.8, c.a * 0.85);
  }
`

const PRESS = -0.0045
const tmpMatrix = new THREE.Matrix4()
const tmpPos = new THREE.Vector3()
const tmpScale = new THREE.Vector3()
const noRotation = new THREE.Quaternion()

/**
 * Teclado com ~100 teclas desenhado com 3 InstancedMesh (teclas claras,
 * escuras e legendas) em vez de ~200 malhas separadas.
 */
export default function Keyboard(props) {
  const keys = useMemo(layoutKeys, [])
  const geo = useKeycapGeometry()
  const invalidate = useThree((s) => s.invalidate)
  const lightRef = useRef()
  const darkRef = useRef()
  const labelRef = useRef()
  const pressed = useRef(new Set())

  const { lightKeys, darkKeys, labelKeys, labelGeo, labelMat } = useMemo(() => {
    const withLabel = keys.filter((k) => k.label)
    const atlas = buildLabelAtlas([...new Set(withLabel.map((k) => k.label))])
    const g = new THREE.PlaneGeometry(U * 0.62, U * 0.62)
    g.rotateX(-Math.PI / 2)
    g.setAttribute('cell', new THREE.InstancedBufferAttribute(new Float32Array(withLabel.flatMap((k) => atlas.index.get(k.label))), 2))
    const m = new THREE.ShaderMaterial({
      uniforms: { map: { value: atlas.tex }, cells: { value: atlas.cells } },
      vertexShader: labelVertex,
      fragmentShader: labelFragment,
      transparent: true,
      depthWrite: false,
    })
    keys.forEach((k) => { k.offset = 0 })
    return {
      lightKeys: keys.filter((k) => !k.dark),
      darkKeys: keys.filter((k) => k.dark),
      labelKeys: withLabel,
      labelGeo: g,
      labelMat: m,
    }
  }, [keys])

  const writeKey = (mesh, i, k) => {
    tmpPos.set(k.x * U, k.offset, k.z)
    tmpScale.set(k.w * U - KEY_GAP, KEY_H, U - KEY_GAP)
    mesh.setMatrixAt(i, tmpMatrix.compose(tmpPos, noRotation, tmpScale))
  }
  const writeLabel = (i, k) => {
    tmpPos.set(k.x * U - (k.w * U) / 2 + U * 0.42, k.offset + KEY_H + 0.0002, k.z)
    labelRef.current.setMatrixAt(i, tmpMatrix.makeTranslation(tmpPos))
  }
  const writeAll = () => {
    lightKeys.forEach((k, i) => writeKey(lightRef.current, i, k))
    darkKeys.forEach((k, i) => writeKey(darkRef.current, i, k))
    labelKeys.forEach((k, i) => writeLabel(i, k))
    for (const m of [lightRef.current, darkRef.current, labelRef.current]) m.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => {
    writeAll()
    invalidate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const down = (e) => { pressed.current.add(e.code); invalidate() }
    const up = (e) => { pressed.current.delete(e.code); invalidate() }
    const clear = () => { pressed.current.clear(); invalidate() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [invalidate])

  useFrame((_, dt) => {
    let moving = false
    for (const k of keys) {
      const target = pressed.current.has(k.code) ? PRESS : 0
      if (Math.abs(k.offset - target) < 0.00005) {
        if (k.offset !== target) { k.offset = target; moving = true }
        continue
      }
      k.offset = THREE.MathUtils.damp(k.offset, target, 30, dt)
      moving = true
    }
    if (moving) {
      writeAll()
      invalidate()
    }
  })

  const totalW = 19.75 * U
  return (
    <group {...props}>
      <RoundedBox args={[totalW + 0.03, 0.026, 6.9 * U]} radius={0.006} smoothness={3} position={[0, 0.013, 0]} material={beige} castShadow receiveShadow />
      <group position={[-totalW / 2, 0.026, -0.125 * U]}>
        <instancedMesh ref={lightRef} args={[geo, keyLight, lightKeys.length]} />
        <instancedMesh ref={darkRef} args={[geo, keyDark, darkKeys.length]} />
        <instancedMesh ref={labelRef} args={[labelGeo, labelMat, labelKeys.length]} frustumCulled={false} />
      </group>
    </group>
  )
}

