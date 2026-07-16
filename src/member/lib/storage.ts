import type { GeneratedProject } from '@/types/quiz'

export const MEMBER_KEYS = {
  project: 'ao_member_project_v2',
  progress: 'ao_member_progress_v2',
  chapters: 'ao_member_chapters_v2',
  plan7: 'ao_member_plan7_v2',
  characters: 'ao_member_characters_v2',
  universe: 'ao_member_universe_v2',
  notes: 'ao_member_notes_v2',
  checklist: 'ao_member_checklist_v2',
  onboarding: 'ao_member_onboarding_v2',
  lastRoute: 'ao_member_last_route_v2',
  quizImported: 'ao_member_quiz_imported_v2',
} as const

export const QUIZ_PROJECT_KEY = 'autora_oculta_generated_project'

export type MemberProject = {
  title: string
  pen: string
  female: string
  male: string
  premise: string
  hook: string
  conflict: string
  tags: string
  promise: string
  updatedAt?: string
}

export type ChapterStatus = 'todo' | 'outline' | 'draft' | 'done'

export type ChapterProgress = {
  status: ChapterStatus
  notes: string
}

export type CharacterSheet = {
  desire: string
  fakeDesire: string
  wound: string
  neverWould: string
  lies: string
  underestimated: string
  dangerous: string
  controls?: string
  fears?: string
  whyHer?: string
  morality?: string
  secretAboutHer?: string
  protects?: string
  humanizes?: string
}

export type UniverseAnswers = {
  where: string
  power: string
  rule: string
  forbidden: string
  leak: string
}

export type MemberProgress = {
  visited: string[]
  completedModules: string[]
}

export type MemberBackup = {
  version: 1
  exportedAt: string
  project: MemberProject
  progress: MemberProgress
  chapters: Record<number, ChapterProgress>
  plan7: Record<number, boolean>
  characters: { ella: CharacterSheet; el: CharacterSheet }
  universe: UniverseAnswers
  notes: string
  checklist: Record<string, boolean>
}

export const emptyProject = (): MemberProject => ({
  title: '',
  pen: '',
  female: '',
  male: '',
  premise: '',
  hook: '',
  conflict: '',
  tags: '',
  promise: '',
})

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      if (key === MEMBER_KEYS.project) {
        const legacy = localStorage.getItem('autora_oculta_member_project')
        if (legacy) {
          const parsed = JSON.parse(legacy) as Partial<MemberProject>
          return { ...fallback, ...parsed } as T
        }
      }
      return fallback
    }
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function readString(key: string, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeString(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function loadQuizGenerated(): GeneratedProject | null {
  try {
    const raw = localStorage.getItem(QUIZ_PROJECT_KEY)
    return raw ? (JSON.parse(raw) as GeneratedProject) : null
  } catch {
    return null
  }
}

export function quizToMemberProject(g: GeneratedProject): MemberProject {
  return {
    title: g.title || '',
    pen: g.penName || '',
    female: g.femaleName || '',
    male: [g.maleName, g.surname].filter(Boolean).join(' ').trim(),
    premise: g.premise || '',
    hook: g.hook || '',
    conflict: g.conflictSummary || '',
    tags: (g.tags || []).join(', '),
    promise: g.emotionalPromise || '',
    updatedAt: new Date().toISOString(),
  }
}

export function projectIsEmpty(p: MemberProject) {
  return !['title', 'pen', 'female', 'male', 'premise', 'hook', 'conflict', 'tags', 'promise'].some(
    (k) => Boolean(p[k as keyof MemberProject]?.toString().trim()),
  )
}

/** Never persist the panel itself as resume target */
export function rememberContentRoute(pathname: string) {
  if (!pathname.startsWith('/entregavel')) return
  if (pathname === '/entregavel' || pathname === '/entregavel/') return
  writeString(MEMBER_KEYS.lastRoute, pathname)
}

export function getResumeRoute(fallback = '/entregavel/proyecto') {
  const last = readString(MEMBER_KEYS.lastRoute, fallback)
  if (!last.startsWith('/entregavel') || last === '/entregavel' || last === '/entregavel/') {
    return fallback
  }
  return last
}
