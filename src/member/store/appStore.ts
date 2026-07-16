import { create } from 'zustand'
import { loadProject as loadQuiz } from '@/lib/storage'
import { trackEvent } from '@/lib/analytics'
import {
  emptyProject,
  newId,
  nowIso,
  type ActivityLog,
  type Chapter,
  type ChapterStatus,
  type Character,
  type Preferences,
  type Progress,
  type Project,
  type StoryWorld,
} from '../db/schema'
import * as idb from '../db/idb'
import { ensureSeedChapters, migrateIfNeeded } from '../db/migrate'
import { CHAPTERS } from '../data/chapters'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type AppState = {
  ready: boolean
  online: boolean
  saveState: SaveState
  project: Project | null
  characters: Character[]
  world: StoryWorld | null
  chapters: Chapter[]
  progress: Progress | null
  notes: string
  preferences: Preferences | null
  activity: ActivityLog[]
  quizAvailable: boolean
  error: string | null

  hydrate: () => Promise<void>
  setOnline: (v: boolean) => void
  updateProject: (patch: Partial<Project>) => Promise<void>
  importQuiz: () => Promise<boolean>
  createBlankProject: (goal?: string, pace?: string) => Promise<void>
  updateWorld: (patch: Partial<StoryWorld>) => Promise<void>
  updateCharacter: (id: string, patch: Partial<Character>) => Promise<void>
  addCharacter: (role: Character['role']) => Promise<void>
  removeCharacter: (id: string) => Promise<void>
  updateChapter: (id: string, patch: Partial<Chapter>) => Promise<void>
  setChapterStatus: (id: string, status: ChapterStatus) => Promise<void>
  setNotes: (body: string) => Promise<void>
  toggleStage: (stageId: string) => Promise<void>
  togglePlanDay: (day: number) => Promise<void>
  toggleCheck: (id: string) => Promise<void>
  completeOnboarding: (goal?: string, pace?: string) => Promise<void>
  rememberRoute: (path: string) => Promise<void>
  setPreferences: (patch: Partial<Preferences>) => Promise<void>
  exportBackup: () => Promise<idb.FullBackup>
  importBackup: (data: unknown) => Promise<void>
  wipeAll: () => Promise<void>
  stats: () => {
    projectFill: number
    chaptersDone: number
    chaptersTotal: number
    stagesDone: number
    planDone: number
    overall: number
  }
  nextAction: () => { title: string; body: string; to: string; minutes: string }
}

function defaultWorld(projectId: string): StoryWorld {
  return {
    projectId,
    where: '',
    era: '',
    atmosphere: '',
    power: '',
    rule: '',
    forbidden: '',
    symbols: '',
    dangers: '',
    leak: '',
    recurring: '',
    aiResponse: '',
    updatedAt: nowIso(),
  }
}

function defaultProgress(projectId: string): Progress {
  return {
    projectId,
    completedStages: [],
    visitedRoutes: [],
    milestones: {},
    plan7: {},
    checklist: {},
    lastRoute: '/entregavel/proyecto',
    onboardingDone: false,
    onboardingGoal: '',
    onboardingPace: '',
    updatedAt: nowIso(),
  }
}

function projectFill(p: Project | null) {
  if (!p) return 0
  const fields: (keyof Project)[] = [
    'title',
    'penName',
    'femaleLead',
    'maleLead',
    'premise',
    'hook',
    'conflict',
    'emotionalPromise',
    'tags',
  ]
  const filled = fields.filter((k) => Boolean(String(p[k] ?? '').trim())).length
  return Math.round((filled / fields.length) * 100)
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  saveState: 'idle',
  project: null,
  characters: [],
  world: null,
  chapters: [],
  progress: null,
  notes: '',
  preferences: null,
  activity: [],
  quizAvailable: false,
  error: null,

  setOnline: (v) => set({ online: v }),

  hydrate: async () => {
    try {
      await migrateIfNeeded()
      let projects = await idb.listProjects()
      let activeId = await idb.getActiveProjectId()

      if (!projects.length) {
        const quiz = loadQuiz()
        set({
          ready: true,
          quizAvailable: Boolean(quiz),
          preferences: await idb.getPreferences(),
        })
        return
      }

      if (!activeId || !projects.find((p: { id: string }) => p.id === activeId)) {
        activeId = projects[0].id
        await idb.setActiveProjectId(activeId)
      }

      const project = (await idb.getProject(activeId))!
      await ensureSeedChapters(project.id, project.chapterCount || 25)
      const [characters, world, chapters, progress, notesRow, preferences, activity] =
        await Promise.all([
          idb.getCharacters(project.id),
          idb.getWorld(project.id),
          idb.getChapters(project.id),
          idb.getProgress(project.id),
          idb.getNotes(project.id),
          idb.getPreferences(),
          idb.getRecentActivity(project.id),
        ])

      const prefs = {
        ...preferences,
        sessionsCount: (preferences.sessionsCount || 0) + 1,
        installPromptEligible:
          preferences.installPromptEligible || preferences.sessionsCount >= 1,
        updatedAt: nowIso(),
      }
      await idb.savePreferences(prefs)

      set({
        ready: true,
        project,
        characters,
        world: world ?? defaultWorld(project.id),
        chapters,
        progress: progress ?? defaultProgress(project.id),
        notes: notesRow?.body ?? '',
        preferences: prefs,
        activity,
        quizAvailable: Boolean(loadQuiz()),
        error: null,
      })
      trackEvent('AppOpened', { hasProject: true })
    } catch (e) {
      console.error(e)
      set({ ready: true, error: 'No se pudieron cargar los datos locales.' })
    }
  },

  updateProject: async (patch) => {
    const { project } = get()
    if (!project) return
    set({ saveState: 'saving' })
    const next = { ...project, ...patch, updatedAt: nowIso() }
    set({ project: next })
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      try {
        await idb.putProject(next)
        set({ saveState: 'saved' })
        setTimeout(() => set({ saveState: 'idle' }), 1600)
        trackEvent('ProjectUpdated', {})
      } catch {
        set({ saveState: 'error' })
      }
    }, 400)
  },

  importQuiz: async () => {
    const quiz = loadQuiz()
    if (!quiz) return false
    const t = nowIso()
    const project = emptyProject({
      title: quiz.title,
      penName: quiz.penName,
      femaleLead: quiz.femaleName,
      maleLead: [quiz.maleName, quiz.surname].filter(Boolean).join(' '),
      premise: quiz.premise,
      hook: quiz.hook,
      conflict: quiz.conflictSummary,
      secret: quiz.secretSummary,
      emotionalPromise: quiz.emotionalPromise,
      tags: (quiz.tags || []).join(', '),
      setting: quiz.visual?.setting ?? '',
      impactLine: quiz.emotionalPromise,
    })
    await idb.putProject(project)
    await idb.setActiveProjectId(project.id)
    await idb.putCharacter({
      id: newId('char'),
      projectId: project.id,
      role: 'female_lead',
      name: project.femaleLead,
      age: '',
      appearance: '',
      personality: quiz.femaleSummary ?? '',
      desire: '',
      fear: '',
      wound: '',
      secret: '',
      contradiction: '',
      moralLimit: '',
      goal: '',
      arc: '',
      relationships: '',
      voiceNotes: '',
      conflictBehavior: '',
      notes: '',
      updatedAt: t,
    })
    await idb.putCharacter({
      id: newId('char'),
      projectId: project.id,
      role: 'male_lead',
      name: project.maleLead,
      age: '',
      appearance: '',
      personality: quiz.maleSummary ?? '',
      desire: '',
      fear: '',
      wound: '',
      secret: '',
      contradiction: '',
      moralLimit: '',
      goal: '',
      arc: '',
      relationships: '',
      voiceNotes: '',
      conflictBehavior: '',
      notes: '',
      updatedAt: t,
    })
    await idb.putWorld({
      ...defaultWorld(project.id),
      where: quiz.visual?.setting ?? '',
      symbols: (quiz.visual?.symbols || []).join(', '),
    })
    await ensureSeedChapters(project.id, 25)
    await idb.putProgress({ ...defaultProgress(project.id), onboardingDone: get().progress?.onboardingDone ?? false })
    await get().hydrate()
    trackEvent('QuizImported', {})
    return true
  },

  createBlankProject: async (goal, pace) => {
    const project = emptyProject({ goal: goal ?? '', format: 'novela digital' })
    await idb.putProject(project)
    await idb.setActiveProjectId(project.id)
    await idb.putWorld(defaultWorld(project.id))
    await ensureSeedChapters(project.id, project.chapterCount)
    await idb.putProgress({
      ...defaultProgress(project.id),
      onboardingGoal: goal ?? '',
      onboardingPace: pace ?? '',
    })
    await idb.putCharacter({
      id: newId('char'),
      projectId: project.id,
      role: 'female_lead',
      name: '',
      age: '',
      appearance: '',
      personality: '',
      desire: '',
      fear: '',
      wound: '',
      secret: '',
      contradiction: '',
      moralLimit: '',
      goal: '',
      arc: '',
      relationships: '',
      voiceNotes: '',
      conflictBehavior: '',
      notes: '',
      updatedAt: nowIso(),
    })
    await idb.putCharacter({
      id: newId('char'),
      projectId: project.id,
      role: 'male_lead',
      name: '',
      age: '',
      appearance: '',
      personality: '',
      desire: '',
      fear: '',
      wound: '',
      secret: '',
      contradiction: '',
      moralLimit: '',
      goal: '',
      arc: '',
      relationships: '',
      voiceNotes: '',
      conflictBehavior: '',
      notes: '',
      updatedAt: nowIso(),
    })
    await get().hydrate()
    trackEvent('ProjectCreated', { goal: goal ?? '' })
  },

  updateWorld: async (patch) => {
    const { world, project } = get()
    if (!project) return
    const next = { ...(world ?? defaultWorld(project.id)), ...patch, updatedAt: nowIso() }
    set({ world: next, saveState: 'saving' })
    await idb.putWorld(next)
    set({ saveState: 'saved' })
    setTimeout(() => set({ saveState: 'idle' }), 1200)
  },

  updateCharacter: async (id, patch) => {
    const chars = get().characters
    const idx = chars.findIndex((c) => c.id === id)
    if (idx < 0) return
    const next = { ...chars[idx], ...patch, updatedAt: nowIso() }
    const list = [...chars]
    list[idx] = next
    set({ characters: list, saveState: 'saving' })
    await idb.putCharacter(next)
    set({ saveState: 'saved' })
    setTimeout(() => set({ saveState: 'idle' }), 1200)
  },

  addCharacter: async (role) => {
    const { project } = get()
    if (!project) return
    const c: Character = {
      id: newId('char'),
      projectId: project.id,
      role,
      name: '',
      age: '',
      appearance: '',
      personality: '',
      desire: '',
      fear: '',
      wound: '',
      secret: '',
      contradiction: '',
      moralLimit: '',
      goal: '',
      arc: '',
      relationships: '',
      voiceNotes: '',
      conflictBehavior: '',
      notes: '',
      updatedAt: nowIso(),
    }
    await idb.putCharacter(c)
    set({ characters: [...get().characters, c] })
    trackEvent('CharacterCreated', { role })
  },

  removeCharacter: async (id) => {
    await idb.deleteCharacter(id)
    set({ characters: get().characters.filter((c) => c.id !== id) })
  },

  updateChapter: async (id, patch) => {
    const chapters = get().chapters
    const idx = chapters.findIndex((c) => c.id === id)
    if (idx < 0) return
    const next = { ...chapters[idx], ...patch, updatedAt: nowIso() }
    const list = [...chapters]
    list[idx] = next
    set({ chapters: list, saveState: 'saving' })
    await idb.putChapter(next)
    set({ saveState: 'saved' })
    setTimeout(() => set({ saveState: 'idle' }), 1200)
  },

  setChapterStatus: async (id, status) => {
    await get().updateChapter(id, { status })
    if (status === 'completed') trackEvent('ChapterCompleted', {})
  },

  setNotes: async (body) => {
    const { project } = get()
    if (!project) return
    set({ notes: body })
    await idb.putNotes(project.id, body)
  },

  toggleStage: async (stageId) => {
    const { progress, project } = get()
    if (!progress || !project) return
    const has = progress.completedStages.includes(stageId)
    const completedStages = has
      ? progress.completedStages.filter((x: string) => x !== stageId)
      : [...progress.completedStages, stageId]
    const next = { ...progress, completedStages, updatedAt: nowIso() }
    set({ progress: next })
    await idb.putProgress(next)
    if (!has) trackEvent('StageCompleted', { stageId })
  },

  togglePlanDay: async (day) => {
    const { progress, project } = get()
    if (!progress || !project) return
    const key = String(day)
    const next = {
      ...progress,
      plan7: { ...progress.plan7, [key]: !progress.plan7[key] },
      updatedAt: nowIso(),
    }
    set({ progress: next })
    await idb.putProgress(next)
  },

  toggleCheck: async (id) => {
    const { progress, project } = get()
    if (!progress || !project) return
    const next = {
      ...progress,
      checklist: { ...progress.checklist, [id]: !progress.checklist[id] },
      updatedAt: nowIso(),
    }
    set({ progress: next })
    await idb.putProgress(next)
  },

  completeOnboarding: async (goal, pace) => {
    const { progress, project } = get()
    if (progress && project) {
      const next = {
        ...progress,
        onboardingDone: true,
        onboardingGoal: goal ?? progress.onboardingGoal,
        onboardingPace: pace ?? progress.onboardingPace,
        updatedAt: nowIso(),
      }
      set({ progress: next })
      await idb.putProgress(next)
    } else {
      set({
        progress: {
          ...defaultProgress('pending'),
          onboardingDone: true,
          onboardingGoal: goal ?? '',
          onboardingPace: pace ?? '',
        },
      })
    }
    trackEvent('OnboardingCompleted', { goal: goal ?? '' })
  },

  rememberRoute: async (path) => {
    if (!path.startsWith('/entregavel') || path === '/entregavel' || path === '/entregavel/') return
    const { progress, project } = get()
    if (!progress || !project) return
    const next = { ...progress, lastRoute: path, updatedAt: nowIso() }
    set({ progress: next })
    await idb.putProgress(next)
  },

  setPreferences: async (patch) => {
    const prefs = get().preferences
    if (!prefs) return
    const next = { ...prefs, ...patch, updatedAt: nowIso() }
    set({ preferences: next })
    await idb.savePreferences(next)
  },

  exportBackup: async () => idb.exportFullBackup(),

  importBackup: async (data) => {
    await idb.importFullBackup(data as idb.FullBackup)
    await get().hydrate()
    trackEvent('ExportCompleted', { kind: 'import' })
  },

  wipeAll: async () => {
    await idb.clearAllMemberData()
    localStorage.removeItem('ao_idb_migrated_v3')
    set({
      project: null,
      characters: [],
      world: null,
      chapters: [],
      progress: null,
      notes: '',
      activity: [],
    })
  },

  stats: () => {
    const { project, chapters, progress } = get()
    const chaptersTotal = chapters.length || CHAPTERS.length
    const chaptersDone = chapters.filter((c) => c.status === 'completed').length
    const stagesDone = progress?.completedStages.length ?? 0
    const planDone = Object.values(progress?.plan7 ?? {}).filter(Boolean).length
    const fill = projectFill(project)
    const overall = Math.round(
      fill * 0.3 +
        (chaptersDone / Math.max(chaptersTotal, 1)) * 100 * 0.4 +
        (stagesDone / 12) * 100 * 0.15 +
        (planDone / 7) * 100 * 0.15,
    )
    return { projectFill: fill, chaptersDone, chaptersTotal, stagesDone, planDone, overall }
  },

  nextAction: () => {
    const { project, characters, world, chapters, progress } = get()
    if (!project || projectFill(project) < 40) {
      return {
        title: 'Tu próxima acción',
        body: 'Completa la base de tu proyecto: título, seudónimo, protagonistas y premisa.',
        to: '/entregavel/proyecto',
        minutes: '5 a 10 minutos',
      }
    }
    const female = characters.find((c) => c.role === 'female_lead')
    if (female && !female.wound) {
      return {
        title: 'Tu próxima acción',
        body: 'Define la herida emocional de tu protagonista antes de construir los capítulos.',
        to: '/entregavel/personajes',
        minutes: '5 a 10 minutos',
      }
    }
    if (world && !world.where) {
      return {
        title: 'Tu próxima acción',
        body: 'Ancla el universo: dónde ocurre y qué regla no se puede romper.',
        to: '/entregavel/universo',
        minutes: '5 a 10 minutos',
      }
    }
    const first = chapters.find((c) => c.status === 'idea' || c.status === 'planned')
    if (first && !first.externalDraft) {
      return {
        title: 'Tu próxima acción',
        body: `Prepara el capítulo ${first.number}: objetivo, conflicto y gancho. Luego copia el prompt.`,
        to: `/entregavel/capitulos?n=${first.number}`,
        minutes: '10 a 20 minutos',
      }
    }
    if (!(progress?.plan7?.['1'])) {
      return {
        title: 'Tu próxima acción',
        body: 'Sigue el Plan 7 días para avanzar con constancia sin abrumarte.',
        to: '/entregavel/progreso',
        minutes: '2 minutos',
      }
    }
    return {
      title: 'Tu próxima acción',
      body: 'Abre la biblioteca de prompts y genera la siguiente escena con tu proyecto ya cargado.',
      to: '/entregavel/prompts',
      minutes: '5 a 15 minutos',
    }
  },
}))
