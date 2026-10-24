// 'hardware' | 'software' | 'none'. "software" é quando o navegador desenha
// o 3D sem a placa de vídeo (ex.: aceleração de hardware desligada no
// Chrome); nesse caso a cena roda na qualidade mais baixa.
function detectWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) return 'none'
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|softpipe|basic render/i.test(String(renderer)) ? 'software' : 'hardware'
  } catch {
    return 'none'
  }
}

export const WEBGL = detectWebGL()
