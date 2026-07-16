/**
 * Autora Oculta — configuración central
 */
export const APP_CONFIG = {
  CHECKOUT_URL: 'https://pay.hotmart.com/R106762918Y',
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
