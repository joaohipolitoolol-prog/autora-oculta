/**
 * Compatibility bridge: legacy useMember API → Zustand + IndexedDB store.
 * Lets existing module pages keep working while the app migrates.
 */
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useAppStore } from '../store/appStore'
import type { ChapterStatus as LegacyStatus } from '../lib/storage'
import type { CharacterSheet } from '../lib/storage'

type BridgeValue = {
  project: {
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
  setProjectField: (key: string, value: string) => void
  setProject: (p: Record<string, string>) => void
  saveProject: () => boolean
  clearProject: () => void
  saveFlash: string
  saving: boolean
  progress: { visited: string[]; completedModules: string[] }
  markVisited: (id: string) => void
  toggleModuleDone: (id: string) => void
  nextModulePath: string | null
  chapters: Record<number, { status: LegacyStatus; notes: string }>
  setChapterStatus: (n: number, status: LegacyStatus) => void
  setChapterNotes: (n: number, notes: string) => void
  plan7: Record<number, boolean>
  togglePlanDay: (day: number) => void
  characters: { ella: CharacterSheet; el: CharacterSheet }
  setCharacterField: (who: 'ella' | 'el', key: keyof CharacterSheet, value: string) => void
  universe: {
    where: string
    power: string
    rule: string
    forbidden: string
    leak: string
  }
  setUniverseField: (key: string, value: string) => void
  notes: string
  setNotes: (v: string) => void
  checklist: Record<string, boolean>
  toggleCheck: (id: string) => void
  onboardingDone: boolean
  completeOnboarding: () => void
  quizAvailable: boolean
  importFromQuiz: () => boolean
  exportBackup: () => unknown
  importBackup: (data: unknown) => { ok: boolean; message: string }
  resumeRoute: string
  online: boolean
  stats: {
    projectFill: number
    modulesDone: number
    modulesTotal: number
    chaptersDone: number
    planDone: number
    overall: number
  }
}

const Ctx = createContext<BridgeValue | null>(null)

const statusToLegacy: Record<string, LegacyStatus> = {
  idea: 'todo',
  planned: 'outline',
  drafting: 'draft',
  reviewing: 'draft',
  completed: 'done',
}
const legacyToStatus: Record<LegacyStatus, 'idea' | 'planned' | 'drafting' | 'completed'> = {
  todo: 'idea',
  outline: 'planned',
  draft: 'drafting',
  done: 'completed',
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const store = useAppStore()

  useEffect(() => {
    void store.hydrate()
    const on = () => store.setOnline(true)
    const off = () => store.setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<BridgeValue>(() => {
    const p = store.project
    const female = store.characters.find((c) => c.role === 'female_lead')
    const male = store.characters.find((c) => c.role === 'male_lead')
    const s = store.stats()

    const chaptersMap: BridgeValue['chapters'] = {}
    for (const ch of store.chapters) {
      chaptersMap[ch.number] = {
        status: statusToLegacy[ch.status] ?? 'todo',
        notes: ch.notes,
      }
    }

    const plan7: Record<number, boolean> = {}
    for (const [k, v] of Object.entries(store.progress?.plan7 ?? {})) {
      plan7[Number(k)] = Boolean(v)
    }

    const sheet = (c?: typeof female): CharacterSheet => ({
      desire: c?.desire ?? '',
      fakeDesire: '',
      wound: c?.wound ?? '',
      neverWould: c?.moralLimit ?? '',
      lies: c?.secret ?? '',
      underestimated: '',
      dangerous: c?.contradiction ?? '',
      controls: c?.goal ?? '',
      fears: c?.fear ?? '',
      whyHer: '',
      morality: c?.moralLimit ?? '',
      secretAboutHer: c?.secret ?? '',
      protects: '',
      humanizes: c?.personality ?? '',
    })

    return {
      project: {
        title: p?.title ?? '',
        pen: p?.penName ?? '',
        female: p?.femaleLead ?? '',
        male: p?.maleLead ?? '',
        premise: p?.premise ?? '',
        hook: p?.hook ?? '',
        conflict: p?.conflict ?? '',
        tags: p?.tags ?? '',
        promise: p?.emotionalPromise ?? '',
        updatedAt: p?.updatedAt,
      },
      setProjectField: (key, value) => {
        const map: Record<string, string> = {
          title: 'title',
          pen: 'penName',
          female: 'femaleLead',
          male: 'maleLead',
          premise: 'premise',
          hook: 'hook',
          conflict: 'conflict',
          tags: 'tags',
          promise: 'emotionalPromise',
        }
        const field = map[key]
        if (field) void store.updateProject({ [field]: value })
      },
      setProject: (proj) => {
        void store.updateProject({
          title: proj.title ?? '',
          penName: proj.pen ?? '',
          femaleLead: proj.female ?? '',
          maleLead: proj.male ?? '',
          premise: proj.premise ?? '',
          hook: proj.hook ?? '',
          conflict: proj.conflict ?? '',
          tags: proj.tags ?? '',
          emotionalPromise: proj.promise ?? '',
        })
      },
      saveProject: () => {
        if (store.project) void store.updateProject({})
        return true
      },
      clearProject: () => {
        void store.updateProject({
          title: '',
          penName: '',
          femaleLead: '',
          maleLead: '',
          premise: '',
          hook: '',
          conflict: '',
          tags: '',
          emotionalPromise: '',
          secret: '',
        })
      },
      saveFlash:
        store.saveState === 'saved'
          ? 'Guardado en este dispositivo.'
          : store.saveState === 'error'
            ? 'No se pudo guardar.'
            : store.saveState === 'saving'
              ? 'Guardando…'
              : '',
      saving: store.saveState === 'saving',
      progress: {
        visited: store.progress?.visitedRoutes ?? [],
        completedModules: store.progress?.completedStages ?? [],
      },
      markVisited: () => undefined,
      toggleModuleDone: (id) => void store.toggleStage(id),
      nextModulePath: store.nextAction().to,
      chapters: chaptersMap,
      setChapterStatus: (n, status) => {
        const ch = store.chapters.find((c) => c.number === n)
        if (ch) void store.setChapterStatus(ch.id, legacyToStatus[status])
      },
      setChapterNotes: (n, notes) => {
        const ch = store.chapters.find((c) => c.number === n)
        if (ch) void store.updateChapter(ch.id, { notes })
      },
      plan7,
      togglePlanDay: (day) => void store.togglePlanDay(day),
      characters: { ella: sheet(female), el: sheet(male) },
      setCharacterField: (who, key, value) => {
        const c = store.characters.find((x) =>
          who === 'ella' ? x.role === 'female_lead' : x.role === 'male_lead',
        )
        if (!c) return
        const map: Partial<Record<keyof CharacterSheet, keyof typeof c>> = {
          desire: 'desire',
          wound: 'wound',
          fears: 'fear',
          lies: 'secret',
          neverWould: 'moralLimit',
          dangerous: 'contradiction',
          controls: 'goal',
          morality: 'moralLimit',
          secretAboutHer: 'secret',
          humanizes: 'personality',
        }
        const field = map[key]
        if (field) void store.updateCharacter(c.id, { [field]: value })
      },
      universe: {
        where: store.world?.where ?? '',
        power: store.world?.power ?? '',
        rule: store.world?.rule ?? '',
        forbidden: store.world?.forbidden ?? '',
        leak: store.world?.leak ?? '',
      },
      setUniverseField: (key, value) => void store.updateWorld({ [key]: value }),
      notes: store.notes,
      setNotes: (v) => void store.setNotes(v),
      checklist: store.progress?.checklist ?? {},
      toggleCheck: (id) => void store.toggleCheck(id),
      onboardingDone: store.progress?.onboardingDone ?? false,
      completeOnboarding: () => void store.completeOnboarding(),
      quizAvailable: store.quizAvailable,
      importFromQuiz: () => {
        void store.importQuiz()
        return true
      },
      exportBackup: () => {
        void store.exportBackup()
        return {}
      },
      importBackup: (data) => {
        void store.importBackup(data)
        return { ok: true, message: 'Copia restaurada.' }
      },
      resumeRoute: store.progress?.lastRoute || '/entregavel/proyecto',
      online: store.online,
      stats: {
        projectFill: s.projectFill,
        modulesDone: s.stagesDone,
        modulesTotal: 12,
        chaptersDone: s.chaptersDone,
        planDone: s.planDone,
        overall: s.overall,
      },
    }
  }, [store])

  if (!store.ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-ivory-muted">
        Cargando tu proyecto…
      </div>
    )
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMember() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMember must be used inside MemberProvider')
  return ctx
}
