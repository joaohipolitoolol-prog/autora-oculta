import type { MemberProject } from './storage'

export function applyPlaceholders(
  text: string,
  project: MemberProject,
  extras: Record<string, string> = {},
) {
  const map: Record<string, string> = {
    '{{TITULO}}': project.title || 'TU TÍTULO',
    '{{SEUDONIMO}}': project.pen || 'TU SEUDÓNIMO',
    '{{ELLA}}': project.female || 'la protagonista',
    '{{EL}}': project.male || 'el interés amoroso',
    '{{PREMISA}}': project.premise || 'tu premisa',
    '{{CONFLICTO}}': project.conflict || 'tu conflicto',
    '{{GANCHO}}': project.hook || 'tu gancho de apertura',
    '{{TAGS}}': project.tags || 'dark romance',
    '{{PROMESA}}': project.promise || 'tu promesa emocional',
    ...Object.fromEntries(Object.entries(extras).map(([k, v]) => [k.startsWith('{{') ? k : `{{${k}}}`, v])),
  }

  let out = text
  for (const [token, value] of Object.entries(map)) {
    out = out.split(token).join(value)
  }
  return out
}
