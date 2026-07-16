import type { GeneratedProject, QuizAnswers } from '@/types/quiz'

const ANSWERS_KEY = 'autora_oculta_quiz_answers'
const PROJECT_KEY = 'autora_oculta_generated_project'
const UTM_KEY = 'autora_oculta_utm'

export function saveAnswers(answers: Partial<QuizAnswers>) {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
}

export function loadAnswers(): Partial<QuizAnswers> | null {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    return raw ? (JSON.parse(raw) as Partial<QuizAnswers>) : null
  } catch {
    return null
  }
}

export function saveProject(project: GeneratedProject) {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(project))
}

export function loadProject(): GeneratedProject | null {
  try {
    const raw = localStorage.getItem(PROJECT_KEY)
    return raw ? (JSON.parse(raw) as GeneratedProject) : null
  } catch {
    return null
  }
}

export function clearQuizProgress() {
  localStorage.removeItem(ANSWERS_KEY)
  localStorage.removeItem(PROJECT_KEY)
}

export type UtmData = Record<string, string>

export function captureUtms(): UtmData {
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const out: UtmData = {}
  keys.forEach((k) => {
    const v = params.get(k)
    if (v) out[k] = v
  })
  if (Object.keys(out).length) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(out))
  }
  return out
}

export function getUtms(): UtmData {
  try {
    const raw = sessionStorage.getItem(UTM_KEY)
    return raw ? (JSON.parse(raw) as UtmData) : {}
  } catch {
    return {}
  }
}
