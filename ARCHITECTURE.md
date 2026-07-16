# ARCHITECTURE — Autora Oculta

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS 4
- React Router 7
- Zustand (`src/member/store/appStore.ts`)
- IndexedDB via `idb` (`src/member/db/`)
- Zod schemas (`src/member/db/schema.ts`)
- PWA: `vite-plugin-pwa` + Workbox
- Analytics: `trackEvent` (Meta/GA, solo metadatos)

## Capas
```
UI pages (ES) → Zustand store → IndexedDB
              ↘ MemberContext bridge (legacy modules)
Quiz funnel → localStorage `autora_oculta_generated_project` → migrate/import
```

## Entidades
Project, Character, StoryWorld, Chapter, Progress, Preferences, ActivityLog, Notes

## Rutas miembro (`/entregavel/*`)
Ver `src/member/data/nav.ts` y `src/App.tsx`.

## Preparación futura
Interfaces de persistencia ya centralizadas en `db/idb.ts` para sustituir por API sin reescribir UI.
