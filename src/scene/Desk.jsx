import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { woodTexture } from './textures'
import { metal } from './materials'

export const DESK_TOP = 0.76

// Escrivaninha de madeira com gaveteiro à direita.
export default function Desk() {
  const wood = useMemo(() => {
    const map = woodTexture()
    return new THREE.MeshStandardMaterial({ map, roughness: 0.55, metalness: 0 })
  }, [])
  const woodDark = useMemo(() => new THREE.MeshStandardMaterial({ map: woodTexture(), color: '#8c6a52', roughness: 0.65 }), [])

  const T = 0.045
  return (
    <group>
      <RoundedBox args={[1.8, T, 0.85]} radius={0.01} smoothness={3} position={[0, DESK_TOP - T / 2, 0]} material={wood} castShadow receiveShadow />
      {/* gaveteiro */}
      <mesh position={[0.62, (DESK_TOP - T) / 2, -0.02]} material={woodDark} castShadow receiveShadow>
        <boxGeometry args={[0.5, DESK_TOP - T, 0.76]} />
      </mesh>
      {[0.56, 0.36, 0.14].map((y, i) => (
        <group key={y} position={[0.62, y, 0.362]}>
          <mesh material={wood} castShadow>
            <boxGeometry args={[0.46, i === 2 ? 0.24 : 0.17, 0.012]} />
          </mesh>
          <mesh position={[0, i === 2 ? 0.07 : 0.04, 0.012]} material={metal}>
            <boxGeometry args={[0.12, 0.012, 0.012]} />
          </mesh>
        </group>
      ))}
      {/* pernas do lado esquerdo e painel de fundo */}
      {[[-0.85, 0.36], [-0.85, -0.38]].map(([x, z]) => (
        <mesh key={z} position={[x, (DESK_TOP - T) / 2, z]} material={woodDark} castShadow>
          <boxGeometry args={[0.05, DESK_TOP - T, 0.05]} />
        </mesh>
      ))}
      <mesh position={[-0.1, 0.45, -0.39]} material={woodDark} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.5, 0.02]} />
      </mesh>
    </group>
  )
}
