import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import SiteApp from './site/SiteApp'
import './site/site.css'

// O escritório 3D (versão anterior do portfólio) continua disponível em ?3d,
// carregado sob demanda para não pesar no site principal.
const wants3D = new URLSearchParams(window.location.search).has('3d')
const App3D = wants3D ? lazy(() => import('./App3D')) : null

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {App3D ? (
      <Suspense fallback={null}>
        <App3D />
      </Suspense>
    ) : (
      <SiteApp />
    )}
  </StrictMode>,
)
