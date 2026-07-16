# DEPLOYMENT

```bash
npm install
npm run test
npm run build
vercel --prod
```

## Hotmart
Entregar: `https://autora-oculta.vercel.app/entregavel/`

## PWA
- `start_url`: `/entregavel/`
- Iconos: `/pwa-192.png`, `/pwa-512.png`
- SW: generado en build (`dist/sw.js`)

## Variables
- Checkout / Pixel: `src/config.ts`
- Feedback externo futuro: preferencia `feedbackUrl` / `FEEDBACK_URL`

## SPA
`vercel.json` reescribe rutas a `index.html`.
