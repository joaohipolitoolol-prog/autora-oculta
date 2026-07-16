import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Garante que toda navegação de rota comece no topo da página. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
