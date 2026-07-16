import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  SCHEMA_VERSION,
  type ActivityLog,
  type Chapter,
  type Character,
  type Preferences,
  type Progress,
  type Project,
  type StoryWorld,
  nowIso,
} from './schema'

interface AutoraDB extends DBSchema {
  meta: {
    key: string
    value: { key: string; value: unknown }
  }
  projects: {
    key: string
    value: Project
  }
  characters: {
    key: string
    value: Character
    indexes: { 'by-project': string }
  }
  worlds: {
    key: string
    value: StoryWorld
  }
  chapters: {
    key: string
    value: Chapter
    indexes: { 'by-project': string }
  }
  progress: {
    key: string
    value: Progress
  }
  preferences: {
    key: string
    value: Preferences & { id: string }
  }
  activity: {
    key: string
    value: ActivityLog
    indexes: { 'by-project': string }
  }
  notes: {
    key: string
    value: { projectId: string; body: string; updatedAt: string }
  }
}

const DB_NAME = 'autora-oculta-v3'

let dbPromise: Promise<IDBPDatabase<AutoraDB>> | null = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<AutoraDB>(DB_NAME, SCHEMA_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' })
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('characters')) {
          const s = db.createObjectStore('characters', { keyPath: 'id' })
          s.createIndex('by-project', 'projectId')
        }
        if (!db.objectStoreNames.contains('worlds')) db.createObjectStore('worlds', { keyPath: 'projectId' })
        if (!db.objectStoreNames.contains('chapters')) {
          const s = db.createObjectStore('chapters', { keyPath: 'id' })
          s.createIndex('by-project', 'projectId')
        }
        if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'projectId' })
        if (!db.objectStoreNames.contains('preferences'))
          db.createObjectStore('preferences', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('activity')) {
          const s = db.createObjectStore('activity', { keyPath: 'id' })
          s.createIndex('by-project', 'projectId')
        }
        if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'projectId' })
      },
    })
  }
  return dbPromise
}

export async function getPreferences(): Promise<Preferences> {
  const db = await getDb()
  const row = await db.get('preferences', 'default')
  if (row) {
    const { id: _id, ...rest } = row as Preferences & { id: string }
    return rest as Preferences
  }
  const prefs: Preferences = {
    theme: 'dark',
    installDismissed: false,
    installPromptEligible: false,
    sessionsCount: 0,
    feedbackUrl: '',
    accessCode: '',
    updatedAt: nowIso(),
  }
  await savePreferences(prefs)
  return prefs
}

export async function savePreferences(prefs: Preferences) {
  const db = await getDb()
  await db.put('preferences', { ...prefs, id: 'default' } as Preferences & { id: string })
}

export async function getActiveProjectId(): Promise<string | null> {
  const db = await getDb()
  const row = await db.get('meta', 'activeProjectId')
  return (row?.value as string) ?? null
}

export async function setActiveProjectId(id: string) {
  const db = await getDb()
  await db.put('meta', { key: 'activeProjectId', value: id })
}

export async function putProject(p: Project) {
  const db = await getDb()
  await db.put('projects', p)
}

export async function getProject(id: string) {
  const db = await getDb()
  return db.get('projects', id)
}

export async function listProjects() {
  const db = await getDb()
  return db.getAll('projects')
}

export async function putCharacter(c: Character) {
  const db = await getDb()
  await db.put('characters', c)
}

export async function getCharacters(projectId: string) {
  const db = await getDb()
  return db.getAllFromIndex('characters', 'by-project', projectId)
}

export async function deleteCharacter(id: string) {
  const db = await getDb()
  await db.delete('characters', id)
}

export async function putWorld(w: StoryWorld) {
  const db = await getDb()
  await db.put('worlds', w)
}

export async function getWorld(projectId: string) {
  const db = await getDb()
  return db.get('worlds', projectId)
}

export async function putChapter(c: Chapter) {
  const db = await getDb()
  await db.put('chapters', c)
}

export async function getChapters(projectId: string) {
  const db = await getDb()
  const all = await db.getAllFromIndex('chapters', 'by-project', projectId)
  return all.sort((a, b) => a.number - b.number)
}

export async function putProgress(p: Progress) {
  const db = await getDb()
  await db.put('progress', p)
}

export async function getProgress(projectId: string) {
  const db = await getDb()
  return db.get('progress', projectId)
}

export async function putNotes(projectId: string, body: string) {
  const db = await getDb()
  await db.put('notes', { projectId, body, updatedAt: nowIso() })
}

export async function getNotes(projectId: string) {
  const db = await getDb()
  return db.get('notes', projectId)
}

export async function addActivity(log: ActivityLog) {
  const db = await getDb()
  await db.put('activity', log)
}

export async function getRecentActivity(projectId: string, limit = 20) {
  const db = await getDb()
  const all = await db.getAllFromIndex('activity', 'by-project', projectId)
  return all.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}

export async function clearAllMemberData() {
  const db = await getDb()
  const stores = [
    'projects',
    'characters',
    'worlds',
    'chapters',
    'progress',
    'activity',
    'notes',
    'meta',
  ] as const
  for (const s of stores) {
    await db.clear(s)
  }
}

export type FullBackup = {
  version: typeof SCHEMA_VERSION
  exportedAt: string
  activeProjectId: string | null
  projects: Project[]
  characters: Character[]
  worlds: StoryWorld[]
  chapters: Chapter[]
  progress: Progress[]
  notes: { projectId: string; body: string; updatedAt: string }[]
  preferences: Preferences
}

export async function exportFullBackup(): Promise<FullBackup> {
  const db = await getDb()
  return {
    version: SCHEMA_VERSION,
    exportedAt: nowIso(),
    activeProjectId: await getActiveProjectId(),
    projects: await db.getAll('projects'),
    characters: await db.getAll('characters'),
    worlds: await db.getAll('worlds'),
    chapters: await db.getAll('chapters'),
    progress: await db.getAll('progress'),
    notes: await db.getAll('notes'),
    preferences: await getPreferences(),
  }
}

export async function importFullBackup(data: FullBackup) {
  if (!data || data.version < 1 || !Array.isArray(data.projects)) {
    throw new Error('INVALID_BACKUP')
  }
  await clearAllMemberData()
  const db = await getDb()
  for (const p of data.projects) await db.put('projects', p)
  for (const c of data.characters ?? []) await db.put('characters', c)
  for (const w of data.worlds ?? []) await db.put('worlds', w)
  for (const ch of data.chapters ?? []) await db.put('chapters', ch)
  for (const pr of data.progress ?? []) await db.put('progress', pr)
  for (const n of data.notes ?? []) await db.put('notes', n)
  if (data.preferences) await savePreferences(data.preferences)
  if (data.activeProjectId) await setActiveProjectId(data.activeProjectId)
  else if (data.projects[0]) await setActiveProjectId(data.projects[0].id)
}
