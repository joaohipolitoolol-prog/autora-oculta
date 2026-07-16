import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { captureInstallPromptEarly } from './member/lib/installPrompt'
import './index.css'
import App from './App.tsx'

captureInstallPromptEarly()

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(
      new CustomEvent('ao-sw-update', {
        detail: {
          update: (reloadPage?: boolean) => updateSW(reloadPage),
        },
      }),
    )
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
