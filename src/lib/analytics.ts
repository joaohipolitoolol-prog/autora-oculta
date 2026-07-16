import { APP_CONFIG } from '@/config'
import { getUtms } from '@/lib/storage'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/** Eventos estándar de Meta Pixel (usar fbq track) */
const META_STANDARD = new Set([
  'PageView',
  'ViewContent',
  'Lead',
  'InitiateCheckout',
  'Purchase',
  'AddToCart',
  'CompleteRegistration',
  'Search',
  'Contact',
])

/** Solo estos eventos llevan value monetario */
const VALUE_EVENTS = new Set(['InitiateCheckout', 'Purchase', 'ViewContent', 'Lead'])

export function trackEvent(eventName: string, data: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = {
    content_name: 'Autora Oculta',
    content_category: 'digital_product',
    ...data,
  }

  if (VALUE_EVENTS.has(eventName)) {
    if (base.value === undefined) base.value = APP_CONFIG.PRICE_VALUE
    if (base.currency === undefined) base.currency = APP_CONFIG.CURRENCY
  }

  if (typeof window.fbq === 'function') {
    try {
      if (META_STANDARD.has(eventName)) {
        window.fbq('track', eventName, base)
      } else {
        window.fbq('trackCustom', eventName, base)
      }
    } catch {
      /* ignore */
    }
  }

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, base)
    } catch {
      /* ignore */
    }
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...base })
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
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
  }
}

export function hasRealCheckout(): boolean {
  const base = APP_CONFIG.CHECKOUT_URL as string
  return Boolean(base && base !== 'CHECKOUT_URL' && /^https?:\/\//i.test(base))
}

export function buildCheckoutUrl(extra: Record<string, string> = {}): string {
  if (!hasRealCheckout()) return '#oferta'

  try {
    const url = new URL(APP_CONFIG.CHECKOUT_URL, window.location.origin)
    const utm = getUtms()
    Object.entries({ ...utm, ...extra }).forEach(([k, v]) => {
      if (v && !url.searchParams.get(k)) url.searchParams.set(k, v)
    })
    return url.toString()
  } catch {
    return APP_CONFIG.CHECKOUT_URL
  }
}

export function goToCheckout(cta: string) {
  const href = buildCheckoutUrl({ cta })
  const real = href !== '#oferta' && hasRealCheckout()

  if (real) {
    trackEvent('InitiateCheckout', { cta_location: cta })
  }
  trackEvent('UnlockClicked', { cta_location: cta, checkout_ready: real })

  if (!real) {
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  // Hotmart: mesma aba (melhor em IG/FB in-app browser)
  window.location.assign(href)
}
