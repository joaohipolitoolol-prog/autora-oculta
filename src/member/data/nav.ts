export type NavItem = {
  id: string
  path: string
  label: string
  short: string
  group: 'inicio' | 'crear' | 'escribir' | 'lanzar' | 'cuenta'
  module?: boolean
  mobilePrimary?: boolean
}

/** Information architecture — español latino */
export const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', path: '/entregavel', label: 'Inicio', short: 'Inicio', group: 'inicio', mobilePrimary: true },
  { id: 'proyecto', path: '/entregavel/proyecto', label: 'Mi Proyecto', short: 'Proyecto', group: 'inicio', module: true, mobilePrimary: true },
  { id: 'universo', path: '/entregavel/universo', label: 'Universo', short: 'Universo', group: 'crear', module: true },
  { id: 'personajes', path: '/entregavel/personajes', label: 'Personajes', short: 'Personajes', group: 'crear', module: true },
  { id: 'estructura', path: '/entregavel/estructura', label: 'Estructura', short: 'Estructura', group: 'crear', module: true },
  { id: 'capitulos', path: '/entregavel/capitulos', label: 'Capítulos', short: 'Capítulos', group: 'escribir', module: true },
  { id: 'prompts', path: '/entregavel/prompts', label: 'Biblioteca de Prompts', short: 'Prompts', group: 'escribir', module: true, mobilePrimary: true },
  { id: 'identidad', path: '/entregavel/identidad', label: 'Identidad Oculta', short: 'Identidad', group: 'lanzar', module: true },
  { id: 'publicar', path: '/entregavel/publicar', label: 'Publicación', short: 'Publicar', group: 'lanzar', module: true },
  { id: 'anuncios', path: '/entregavel/anuncios', label: 'Marketing', short: 'Marketing', group: 'lanzar', module: true },
  { id: 'recursos', path: '/entregavel/recursos', label: 'Recursos', short: 'Recursos', group: 'lanzar' },
  { id: 'progreso', path: '/entregavel/progreso', label: 'Progreso', short: 'Progreso', group: 'cuenta', module: true, mobilePrimary: true },
  { id: 'config', path: '/entregavel/configuracion', label: 'Configuración', short: 'Config', group: 'cuenta' },
  { id: 'ayuda', path: '/entregavel/ayuda', label: 'Ayuda', short: 'Ayuda', group: 'cuenta' },
]

export const GROUP_LABELS: Record<NavItem['group'], string> = {
  inicio: 'Inicio',
  crear: 'Crear',
  escribir: 'Escribir',
  lanzar: 'Lanzar',
  cuenta: 'Cuenta',
}

export const MOBILE_MORE = NAV_ITEMS.filter((n) => !n.mobilePrimary && n.id !== 'inicio')
