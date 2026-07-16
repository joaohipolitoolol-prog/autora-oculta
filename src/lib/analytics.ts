import { APP_CONFIG } from '@/config'
import { getUtms } from '@/lib/storage'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(eventName: string, data: Record<string, unknown> = {}) {
  const payload = {
    content_name: 'Autora Oculta',
    content_category: 'digital_product',
    value: APP_CONFIG.PRICE_VALUE,
    currency: APP_CONFIG.CURRENCY,
    ...data,
  }

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, payload)
    } catch {
      /* ignore */
    }
  }

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, payload)
    } catch {
      /* ignore */
    }
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...payload })
}

export function initAnalytics() {
  const { META_PIXEL_ID, GA_MEASUREMENT_ID, GTM_ID } = APP_CONFIG

  if (GTM_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  }

  if (META_PIXEL_ID && !window.fbq) {
    type PixelFn = ((...args: unknown[]) => void) & {
      queue: unknown[]
      loaded: boolean
      version: string
      callMethod?: (...a: unknown[]) => void
    }
    const n = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args)
      else n.queue.push(args)
    } as PixelFn
    n.queue = []
    n.loaded = true
    n.version = '2.0'
    window.fbq = n
    const t = document.createElement('script')
    t.async = true
    t.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(t)
    window.fbq('init', META_PIXEL_ID)
    window.fbq('track', 'PageView')
  }

  if (GA_MEASUREMENT_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID)
  }

  trackEvent('PageView')
}

export function buildCheckoutUrl(extra: Record<string, string> = {}): string {
  const base = APP_CONFIG.CHECKOUT_URL
  if (!base || base === 'CHECKOUT_URL') return '#oferta'

  try {
    const url = new URL(base, window.location.origin)
    const utm = getUtms()
    Object.entries({ ...utm, ...extra }).forEach(([k, v]) => {
      if (v && !url.searchParams.get(k)) url.searchParams.set(k, v)
    })
    return url.toString()
  } catch {
    return base
  }
}

export function goToCheckout(cta: string) {
  trackEvent('InitiateCheckout', { cta_location: cta })
  trackEvent('UnlockClicked', { cta_location: cta })
  const href = buildCheckoutUrl({ cta })
  if (href === '#oferta') {
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  window.location.href = href
}
