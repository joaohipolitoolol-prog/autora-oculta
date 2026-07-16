export type ScenarioId =
  | 'mansion'
  | 'small_town'
  | 'billionaire'
  | 'rural'
  | 'secret_society'
  | 'dangerous_family'

export type MaleId =
  | 'cold_heir'
  | 'mafia'
  | 'obsessive_cowboy'
  | 'dangerous_boss'
  | 'family_rival'
  | 'masked_man'

export type RelationshipId =
  | 'enemies_to_lovers'
  | 'forced_marriage'
  | 'forbidden_romance'
  | 'forced_proximity'
  | 'second_chance'
  | 'hidden_identity'

export type ConflictId =
  | 'family_debt'
  | 'secret_contract'
  | 'revenge'
  | 'disappearance'
  | 'inheritance'
  | 'old_promise'

export type FemaleId =
  | 'defiant'
  | 'innocent_observant'
  | 'strategic'
  | 'ambitious'
  | 'emotionally_closed'
  | 'escape_driven'

export type IntensityId = 'mysterious' | 'balanced' | 'dark' | 'very_dark'

export type EndingId =
  | 'intense_happy'
  | 'victory_with_cost'
  | 'open_series'
  | 'final_revelation'

export type PresentationId =
  | 'secret_pen_name'
  | 'author_identity'
  | 'connected_series'
  | 'direct_sale'
  | 'unknown'

export interface QuizAnswers {
  scenario: ScenarioId
  male: MaleId
  relationship: RelationshipId
  conflict: ConflictId
  female: FemaleId
  intensity: IntensityId
  ending: EndingId
  presentation: PresentationId
  creatorName?: string
  email?: string
}

export interface QuizOption {
  id: string
  title: string
  description: string
  icon: string
}

export interface QuizQuestion {
  id: keyof Omit<QuizAnswers, 'creatorName' | 'email'>
  title: string
  notice?: string
  options: QuizOption[]
}

export interface GeneratedProject {
  seed: string
  title: string
  penName: string
  femaleName: string
  maleName: string
  surname: string
  tags: string[]
  premise: string
  hook: string
  emotionalPromise: string
  femaleSummary: string
  maleSummary: string
  conflictSummary: string
  secretSummary: string
  visual: {
    colors: string[]
    symbols: string[]
    setting: string
    coverStyle: string
  }
  seriesPotential: string
  lockedChapters: { title: string; teaser: string }[]
  answers: QuizAnswers
  createdAt: string
}
