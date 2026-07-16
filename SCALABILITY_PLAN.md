# SCALABILITY_PLAN — Autora Oculta

Documento **teórico**. No afirma haber testeado 1M usuarios reales.

## Estado actual
- 100% client-side + IndexedDB
- Escala de cómputo = navegador de cada usuaria
- Cuello de botella: cuota disco del browser, no servidores

## Límites locales
- IndexedDB suele soportar cientos de MB; textos de novela OK
- Backup JSON crece con drafts pegados
- Sin sync: cambio de dispositivo = export/import manual

## Camino a 1M usuarias (cuando exista backend)
1. Auth (Hotmart / Magic link / OAuth)
2. API Edge/Serverless (CRUD proyecto)
3. DB documental o Postgres + object storage para drafts
4. CDN estático (Vite build)
5. Rate limit + WAF
6. Observabilidad (Sentry)
7. Colas para jobs (export PDF, email)
8. Conflictos: version vector / last-write-wins + “export before overwrite”
9. Multi-idioma: catalogs i18n (UI ya ES)
10. IA interna futura: proxy server-side, nunca API keys en frontend

## Scripts de carga
Carpeta sugerida: `load-tests/` (k6) — ejecutar solo cuando exista API.

## Metas futuras
- p95 lectura proyecto < 300ms
- p95 save < 500ms
- Error rate < 0.1%
