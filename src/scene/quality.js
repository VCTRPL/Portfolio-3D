import { WEBGL } from '../webgl'

// Escolhe a qualidade da cena uma vez, ao carregar, pelo que o aparelho informa.
// Máquinas fracas e celulares ficam sem sombras e com resolução 1x.
function detectLowEnd() {
  const nav = window.navigator
  const cores = nav.hardwareConcurrency || 4
  const memory = nav.deviceMemory || 8
  const touch = window.matchMedia('(pointer: coarse)').matches
  return touch || cores <= 4 || memory <= 4
}

const software = WEBGL === 'software'
const lowEnd = software || detectLowEnd()

export const QUALITY = {
  lowEnd,
  shadows: !lowEnd,
  // sem placa de vídeo, desenha em resolução reduzida para continuar fluido
  dpr: software ? 0.75 : Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5),
}
