# SECURITY_AND_PRIVACY

## Modelo actual
- Sin cuentas propias
- Datos del manuscrito solo en IndexedDB del dispositivo
- Analytics: eventos de uso **sin** texto de capítulos

## Controles
- Export / wipe en Configuración
- Confirmación en borrado total
- Validación Zod al crear entidades
- Import JSON con chequeo de `version`
- Sin API keys en frontend

## Limitaciones honestas
- URL `/entregavel` es semi-pública (quien tenga el link)
- Seudónimo ≠ anonimato legal/fiscal
- XSS: React escapa por defecto; no usar `dangerouslySetInnerHTML` con drafts

## Roadmap
Auth + sync cifrado en tránsito; nunca loguear contenido literario.
