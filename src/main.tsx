import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { applySceneIntensityFromUrl } from './lib/scene/intensity'

// Permite calibrar a cena de fundo pela URL: /?scene=0.5
applySceneIntensityFromUrl(window.location.search)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
