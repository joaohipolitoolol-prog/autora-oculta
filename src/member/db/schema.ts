/**
 * Domain schemas for Autora Oculta member app (Zod).
 * UI language: Spanish. Code identifiers: English.
 */
import { z } from 'zod'

export const SCHEMA_VERSION = 3

export const ChapterStatusSchema = z.enum([
  'idea',
  'planned',
  'drafting',
  'reviewing',
  'completed',
])
export type ChapterStatus = z.infer<typeof ChapterStatusSchema>

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  penName: z.string().default(''),
  femaleLead: z.string().default(''),
  maleLead: z.string().default(''),
  premise: z.string().default(''),
  hook: z.string().default(''),
  conflict: z.string().default(''),
  secret: z.string().default(''),
  emotionalPromise: z.string().default(''),
  tags: z.string().default(''),
  setting: z.string().default(''),
  intensity: z.string().default(''),
  endingType: z.string().default(''),
  genre: z.string().default('dark romance'),
  format: z.string().default('novela digital'),
  goal: z.string().default(''),
  chapterCount: z.number().int().min(5).max(40).default(25),
  impactLine: z.string().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Project = z.infer<typeof ProjectSchema>

export const CharacterSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  role: z.enum(['female_lead', 'male_lead', 'antagonist', 'secondary']),
  name: z.string().default(''),
  age: z.string().default(''),
  appearance: z.string().default(''),
  personality: z.string().default(''),
  desire: z.string().default(''),
  fear: z.string().default(''),
  wound: z.string().default(''),
  secret: z.string().default(''),
  contradiction: z.string().default(''),
  moralLimit: z.string().default(''),
  goal: z.string().default(''),
  arc: z.string().default(''),
  relationships: z.string().default(''),
  voiceNotes: z.string().default(''),
  conflictBehavior: z.string().default(''),
  notes: z.string().default(''),
  updatedAt: z.string(),
})
export type Character = z.infer<typeof CharacterSchema>

export const StoryWorldSchema = z.object({
  projectId: z.string(),
  where: z.string().default(''),
  era: z.string().default(''),
  atmosphere: z.string().default(''),
  power: z.string().default(''),
  rule: z.string().default(''),
  forbidden: z.string().default(''),
  symbols: z.string().default(''),
  dangers: z.string().default(''),
  leak: z.string().default(''),
  recurring: z.string().default(''),
  aiResponse: z.string().default(''),
  updatedAt: z.string(),
})
export type StoryWorld = z.infer<typeof StoryWorldSchema>

export const ChapterSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  number: z.number().int().positive(),
  title: z.string().default(''),
  summary: z.string().default(''),
  objective: z.string().default(''),
  pov: z.string().default(''),
  setting: z.string().default(''),
  charactersPresent: z.string().default(''),
  conflict: z.string().default(''),
  revelation: z.string().default(''),
  emotion: z.string().default(''),
  cliffhanger: z.string().default(''),
  status: ChapterStatusSchema.default('idea'),
  notes: z.string().default(''),
  externalDraft: z.string().default(''),
  revisionNotes: z.string().default(''),
  beatFunction: z.string().default(''),
  updatedAt: z.string(),
})
export type Chapter = z.infer<typeof ChapterSchema>

export const ProgressSchema = z.object({
  projectId: z.string(),
  completedStages: z.array(z.string()).default([]),
  visitedRoutes: z.array(z.string()).default([]),
  milestones: z.record(z.string(), z.boolean()).default({}),
  plan7: z.record(z.string(), z.boolean()).default({}),
  checklist: z.record(z.string(), z.boolean()).default({}),
  lastRoute: z.string().default('/entregavel/proyecto'),
  onboardingDone: z.boolean().default(false),
  onboardingGoal: z.string().default(''),
  onboardingPace: z.string().default(''),
  updatedAt: z.string(),
})
export type Progress = z.infer<typeof ProgressSchema>

export const PreferencesSchema = z.object({
  theme: z.enum(['dark', 'lectura']).default('dark'),
  installDismissed: z.boolean().default(false),
  installPromptEligible: z.boolean().default(false),
  sessionsCount: z.number().int().default(0),
  feedbackUrl: z.string().default(''),
  accessCode: z.string().default(''),
  updatedAt: z.string(),
})
export type Preferences = z.infer<typeof PreferencesSchema>

export const ActivityLogSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  type: z.string(),
  label: z.string(),
  at: z.string(),
})
export type ActivityLog = z.infer<typeof ActivityLogSchema>

export function nowIso() {
  return new Date().toISOString()
}

export function newId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export function emptyProject(partial: Partial<Project> = {}): Project {
  const t = nowIso()
  return ProjectSchema.parse({
    id: partial.id ?? newId('proj'),
    createdAt: partial.createdAt ?? t,
    updatedAt: partial.updatedAt ?? t,
    ...partial,
  })
}
