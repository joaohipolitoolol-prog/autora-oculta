# Autora Oculta — Funil interactivo

Aplicación web (React + TypeScript + Tailwind) con flujo:

**Anuncio → Quiz → Procesando → Resultado personalizado → Oferta → Checkout**

## Estructura de archivos

```
src/
  config.ts                 ← CHECKOUT_URL, precio, Pixel, GA
  App.tsx                   ← rutas
  components/               ← UI reutilizable
  data/
    questions.ts            ← preguntas del quiz
    names.ts                ← nombres, apellidos, seudónimos, títulos
    storyLogic.ts           ← lógica por escenario/conflicto/relación
  lib/
    generateProject.ts      ← generador combinatorio determinístico
    analytics.ts            ← trackEvent + checkout
    storage.ts              ← localStorage + UTMs
  pages/
    HomePage.tsx
    QuizPage.tsx
    ProcessingPage.tsx
    ResultPage.tsx          ← resultado + oferta + FAQ
    LegalPages.tsx
public/
  hero-autora-oculta.webp
  og-image.webp
  favicon.svg
```

## 1. CHECKOUT_URL

Archivo: `src/config.ts`

```ts
CHECKOUT_URL: 'https://tu-checkout-real.com'
```

## 2. Precio

Mismo archivo `src/config.ts`:

```ts
PRICE_CURRENT: 'US$ 7,49'
PRICE_REFERENCE: 'US$ 27'
PRICE_VALUE: 7.49
```

## 3. Preguntas

Archivo: `src/data/questions.ts`

## 4. Resultados / bancos de contenido

- Nombres y títulos: `src/data/names.ts`
- Escenarios, arquetipos, conflictos: `src/data/storyLogic.ts`
- Motor: `src/lib/generateProject.ts`

## 5. Meta Pixel

`src/config.ts` → `META_PIXEL_ID: 'TU_ID'`

## 6. Google Analytics / GTM

`src/config.ts` → `GA_MEASUREMENT_ID` y/o `GTM_ID`

## 7. Publicar

```bash
npm install
npm run build
vercel --prod
```

O conectar el repo a Vercel (SPA con rewrite a `index.html`).

## 9. Entregável do produto (pós-compra)

Área do método (HTML):

- Pasta: `public/entregavel/`
- URL: `https://autora-oculta.vercel.app/entregavel/`
- Guia Hotmart: `ENTREGA-HOTMART.md`

Cole esse link como conteúdo do produto na Hotmart.

## 10. Probar el flujo

1. `npm run dev`
2. Abrir `/`
3. Completar las 8 preguntas
4. Ver pantalla de procesamiento
5. Revisar resultado + bloqueado + oferta
6. Probar “Rehacer el test” y “Copiar mi resultado”
7. Con `CHECKOUT_URL` placeholder, el botón hace scroll a `#oferta`

## 9. Datos de demostración

- Imágenes hero/OG son assets de demostración del branding
- `CHECKOUT_URL` sigue como placeholder hasta configurar checkout real
- Email del pie: `hola@autoraoculta.com` (editable en config)
- No hay IA externa: la generación es 100% local y determinística

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # preview del build
```
