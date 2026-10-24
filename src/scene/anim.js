import * as THREE from 'three'

// Com frameloop="demand" o delta depois de um tempo parado pode ser de
// segundos; limitar evita saltos nas animações.
export const clampDelta = (delta) => Math.min(delta, 0.1)

// Aproxima obj[key] de target com amortecimento. Retorna true enquanto ainda
// está andando, para o componente pedir o próximo quadro (invalidate).
export function approach(obj, key, target, lambda, dt, eps = 1e-4) {
  const v = obj[key]
  if (Math.abs(v - target) <= eps) {
    if (v !== target) obj[key] = target
    return false
  }
  obj[key] = THREE.MathUtils.damp(v, target, lambda, clampDelta(dt))
  return true
}
