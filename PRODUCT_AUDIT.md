# PRODUCT_AUDIT — Autora Oculta

Fecha: 2026-07-16  
Alcance: funil + área de miembros (`/entregavel`)  
Idioma de producto: español latino neutro

## Resumen

El entregable pasó de “área de miembros estática” a **app de ejecución centrada en proyecto** (IndexedDB, Capítulos, próxima acción, PWA, prompts ampliados).

## Problemas y status

| ID | Severidad | Problema | Status |
|----|-----------|----------|--------|
| C1 | crítico | Capítulos no first-class | **corregido** |
| C2 | crítico | Solo localStorage | **corregido** (IndexedDB) |
| C3 | crítico | BIP PWA perdido en onboarding | **corregido** |
| C4 | crítico | Mezcla PT/ES en UI | **corregido** (UI ES; URL Hotmart `/entregavel` se mantiene) |
| H1 | alto | Import quiz incompleto | **parcial** (campos ricos mapeados en migrate/import) |
| H2 | alto | Sin Progreso/Config/Ayuda | **corregido** |
| H3 | alto | Bottom nav débil | **corregido** |
| H4 | alto | Prompts insuficientes | **corregido** (40+) |
| H5 | alto | Offline overclaim (fonts CDN) | **parcial** (copy honesta) |
| H6 | alto | Backup incompleto | **corregido** (export IDB completo) |
| H7 | alto | Acceso semi-público | **documentado** (sin gate Hotmart aún) |
| M4 | medio | Onboarding corto | **corregido** (5 pasos) |

## Coherencia
Quiz → localStorage → import IndexedDB → próxima acción → prompts externos → capítulos → publicar.
Sin IA interna. Sin promesas de ingresos.
