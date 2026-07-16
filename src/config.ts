/**
 * Autora Oculta — configuración central
 * Sustituye CHECKOUT_URL por la URL real del checkout.
 */
export const APP_CONFIG = {
  CHECKOUT_URL: 'CHECKOUT_URL',
  PRICE_CURRENT: 'US$ 7,49',
  PRICE_REFERENCE: 'US$ 27',
  PRICE_VALUE: 7.49,
  CURRENCY: 'USD',
  CONTACT_EMAIL: 'hola@autoraoculta.com',
  META_PIXEL_ID: '',
  GA_MEASUREMENT_ID: '',
  GTM_ID: '',
} as const

export type AppConfig = typeof APP_CONFIG
