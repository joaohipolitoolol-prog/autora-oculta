import { loadProject as loadQuizGenerated } from '@/lib/storage'
import { CHAPTERS } from '../data/chapters'
import {
  emptyProject,
  newId,
  nowIso,
  type Chapter,
  type Character,
  type Progress,
  type Project,
  type StoryWorld,
} from './schema'
import {
  getActiveProjectId,
  getChapters,
  getDb,
  getPreferences,
  listProjects,
  putChapter,
  putCharacter,
  putProgress,
  putProject,
  putWorld,
  savePreferences,
  setActiveProjectId,
} from './idb'

const MIGRATE_FLAG = 'ao_idb_migrated_v3'

function readLsJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/** Migrate v2 localStorage member data + quiz into IndexedDB once */
export async function migrateIfNeeded() {
  if (typeof localStorage === 'undefined') return
  if (localStorage.getItem(MIGRATE_FLAG) === '1') {
    const existing = await listProjects()
    if (existing.length) return
  }

  const existing = await listProjects()
  if (existing.length) {
    localStorage.setItem(MIGRATE_FLAG, '1')
    return
  }

  const oldProject = readLsJson<{
    title?: string
    pen?: string
    female?: string
    male?: string
    premise?: string
    hook?: string
    conflict?: string
    tags?: string
    promise?: string
  }>('ao_member_project_v2')

  const quiz = loadQuizGenerated()
  const t = nowIso()

  let project: Project
  if (oldProject && (oldProject.title || oldProject.premise)) {
    project = emptyProject({
      title: oldProject.title ?? '',
      penName: oldProject.pen ?? '',
      femaleLead: oldProject.female ?? '',
      maleLead: oldProject.male ?? '',
      premise: oldProject.premise ?? '',
      hook: oldProject.hook ?? '',
      conflict: oldProject.conflict ?? '',
      emotionalPromise: oldProject.promise ?? '',
      tags: oldProject.tags ?? '',
    })
  } else if (quiz) {
    project = emptyProject({
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
  } else {
    localStorage.setItem(MIGRATE_FLAG, '1')
    return
  }

  await putProject(project)
  await setActiveProjectId(project.id)

  const female: Character = {
    id: newId('char'),
    projectId: project.id,
    role: 'female_lead',
    name: project.femaleLead,
    age: '',
    appearance: '',
    personality: quiz?.femaleSummary ?? '',
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
  }
  const male: Character = {
    id: newId('char'),
    projectId: project.id,
    role: 'male_lead',
    name: project.maleLead,
    age: '',
    appearance: '',
    personality: quiz?.maleSummary ?? '',
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
  }
  await putCharacter(female)
  await putCharacter(male)

  const world: StoryWorld = {
    projectId: project.id,
    where: quiz?.visual?.setting ?? '',
    era: '',
    atmosphere: '',
    power: '',
    rule: '',
    forbidden: '',
    symbols: (quiz?.visual?.symbols || []).join(', '),
    dangers: '',
    leak: '',
    recurring: '',
    aiResponse: '',
    updatedAt: t,
  }
  await putWorld(world)

  const oldChapters = readLsJson<Record<string, { status?: string; notes?: string }>>(
    'ao_member_chapters_v2',
  )
  const count = project.chapterCount || 25
  for (let n = 1; n <= count; n++) {
    const beat = CHAPTERS.find((c) => c.n === n)
    const legacy = oldChapters?.[String(n)] ?? oldChapters?.[n as never]
    const statusMap: Record<string, Chapter['status']> = {
      todo: 'idea',
      outline: 'planned',
      draft: 'drafting',
      done: 'completed',
    }
    const ch: Chapter = {
      id: newId('ch'),
      projectId: project.id,
      number: n,
      title: '',
      summary: '',
      objective: beat?.function ?? '',
      pov: '',
      setting: '',
      charactersPresent: '',
      conflict: '',
      revelation: '',
      emotion: '',
      cliffhanger: beat?.cliff ?? '',
      status: statusMap[legacy?.status ?? ''] ?? 'idea',
      notes: legacy?.notes ?? '',
      externalDraft: '',
      revisionNotes: '',
      beatFunction: beat?.function ?? '',
      updatedAt: t,
    }
    await putChapter(ch)
  }

  const oldProgress = readLsJson<{ visited?: string[]; completedModules?: string[] }>(
    'ao_member_progress_v2',
  )
  const oldPlan = readLsJson<Record<string, boolean>>('ao_member_plan7_v2') ?? {}
  const oldCheck = readLsJson<Record<string, boolean>>('ao_member_checklist_v2') ?? {}
  const onboardingDone = localStorage.getItem('ao_member_onboarding_v2') === '1'
  const lastRoute = localStorage.getItem('ao_member_last_route_v2') || '/entregavel/proyecto'

  const progress: Progress = {
    projectId: project.id,
    completedStages: oldProgress?.completedModules ?? [],
    visitedRoutes: oldProgress?.visited ?? [],
    milestones: {},
    plan7: Object.fromEntries(Object.entries(oldPlan).map(([k, v]) => [String(k), Boolean(v)])),
    checklist: oldCheck,
    lastRoute,
    onboardingDone,
    onboardingGoal: '',
    onboardingPace: '',
    updatedAt: t,
  }
  await putProgress(progress)

  const notes = localStorage.getItem('ao_member_notes_v2') || ''
  if (notes) {
    const db = await getDb()
    await db.put('notes', { projectId: project.id, body: notes, updatedAt: t })
  }

  const prefs = await getPreferences()
  prefs.installDismissed = localStorage.getItem('ao_pwa_dismiss') === '1'
  prefs.sessionsCount = (prefs.sessionsCount || 0) + 1
  prefs.updatedAt = t
  await savePreferences(prefs)

  if (!(await getActiveProjectId())) await setActiveProjectId(project.id)

  localStorage.setItem(MIGRATE_FLAG, '1')
}

export async function ensureSeedChapters(projectId: string, count: number) {
  const existing = await getChapters(projectId)
  if (existing.length >= count) return existing
  const t = nowIso()
  const have = new Set(existing.map((c) => c.number))
  for (let n = 1; n <= count; n++) {
    if (have.has(n)) continue
    const beat = CHAPTERS.find((c) => c.n === n)
    await putChapter({
      id: newId('ch'),
      projectId,
      number: n,
      title: '',
      summary: '',
      objective: beat?.function ?? '',
      pov: '',
      setting: '',
      charactersPresent: '',
      conflict: '',
      revelation: '',
      emotion: '',
      cliffhanger: beat?.cliff ?? '',
      status: 'idea',
      notes: '',
      externalDraft: '',
      revisionNotes: '',
      beatFunction: beat?.function ?? '',
      updatedAt: t,
    })
  }
  return getChapters(projectId)
}
