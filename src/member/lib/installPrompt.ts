/**
 * Capture beforeinstallprompt as early as possible (before React onboarding).
 */
type BIP = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __aoDeferredInstall?: BIP | null
  }
}

export function captureInstallPromptEarly() {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    window.__aoDeferredInstall = e as BIP
    window.dispatchEvent(new Event('ao-bip-ready'))
  })
}

export function getDeferredInstall() {
  return window.__aoDeferredInstall ?? null
}

export function clearDeferredInstall() {
  window.__aoDeferredInstall = null
}
