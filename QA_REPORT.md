# QA_REPORT — Autora Oculta

Fecha: 2026-07-16

## Tests creados
- Unit: `src/member/lib/placeholders.test.ts` (schema + placeholders)
- Script: `npm run test` (Vitest)

## Ejecutados
- `npm run build` — OK (TypeScript + Vite + PWA SW)
- `npm run test` — ejecutar tras fix de imports

## Manual / checklist
| Área | Estado |
|------|--------|
| Rutas `/entregavel/*` | Implementadas |
| Import quiz | Store + migrate |
| Capítulos draft | Página dedicada |
| Backup JSON | Configuración |
| PWA manifest/SW | vite-plugin-pwa |
| Bottom nav ES | OK |
| Offline honesto | Copy actualizado |

## Limitaciones
- Sin Playwright E2E en CI aún
- Sin k6 (no hay API)
- Acceso semi-público (Hotmart link) documentado
- Lighthouse no corrido en este entorno

## Pendientes
- E2E Playwright (primera visita, offline, export)
- Self-host fonts para offline tipográfico total
- Access code opcional
