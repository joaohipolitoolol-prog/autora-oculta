import type { GeneratedProject, QuizAnswers } from '@/types/quiz'
import { FEMALE_NAMES, MALE_NAMES, SURNAMES, PEN_NAMES, TITLE_TEMPLATES } from '@/data/names'
import {
  SCENARIO_DATA,
  MALE_DATA,
  FEMALE_DATA,
  RELATIONSHIP_DATA,
  CONFLICT_DATA,
  INTENSITY_TONE,
  ENDING_HINT,
} from '@/data/storyLogic'
import { hashString, pickBySeed, makeSeed } from '@/lib/hash'

function buildTitle(seed: number, female: string, male: string, surname: string): string {
  const template = pickBySeed(TITLE_TEMPLATES, seed, 11)
  return template
    .replace('{female}', female)
    .replace('{male}', male)
    .replace('{surname}', surname)
}

function buildPremise(a: QuizAnswers, female: string, male: string, surname: string): string {
  const scenario = SCENARIO_DATA[a.scenario]
  const conflict = CONFLICT_DATA[a.conflict]
  const relationship = RELATIONSHIP_DATA[a.relationship]
  const femaleData = FEMALE_DATA[a.female]
  const maleData = MALE_DATA[a.male]
  const tone = INTENSITY_TONE[a.intensity]

  return (
    `Después de un giro inesperado, ${female} llega a ${scenario.setting}. ` +
    `Allí aparece ${male} ${surname}, ${maleData.trait}. ` +
    `Lo que los mantiene unidos es ${conflict.bond}. ` +
    `Entre ellos nace ${relationship.dynamic}. ` +
    `${female} ${femaleData.trait}. ` +
    `Ella cree que llegó para recuperar algo que le pertenece, hasta descubrir un detalle imposible de ignorar: ${conflict.secret}. ` +
    `En este universo, ${tone}. ` +
    ENDING_HINT[a.ending]
  )
}

function buildHook(a: QuizAnswers, female: string, male: string): string {
  const conflict = CONFLICT_DATA[a.conflict]
  const lines = [
    `Nadie me preparó para ${conflict.openingObject}.`,
    `La noche en que todo cambió, encontré una dirección y una advertencia.`,
    `Cuando llegué, ${male} ya me estaba esperando.`,
    `“Tu nombre aparece en documentos que no debías ver”, dijo.`,
    `Yo respondí sin apartar la mirada: “Entonces explícame por qué ${female} está escrita al lado del tuyo.”`,
    `Él sonrió sin calor. “Porque desde esa noche… ambos pertenecemos a la misma deuda.”`,
  ]
  return lines.join('\n\n')
}

function buildLockedChapters(
  a: QuizAnswers,
  female: string,
  male: string,
): { title: string; teaser: string }[] {
  const conflict = CONFLICT_DATA[a.conflict]
  const opening =
    conflict.openingObject.charAt(0).toUpperCase() + conflict.openingObject.slice(1)
  return [
    {
      title: `Capítulo 1: ${opening}`,
      teaser: `${female} recibe una señal que no debía ver — y ya no puede fingir que no sabe.`,
    },
    {
      title: `Capítulo 2: El hombre que ya sabía su nombre`,
      teaser: `${male} revela un detalle imposible: él conocía su pasado antes del primer encuentro.`,
    },
    {
      title: `Capítulo 3: La habitación cerrada`,
      teaser: `Una puerta prohibida esconde la primera verdad que los une: ${conflict.secret}.`,
    },
    {
      title: `Capítulo 4: Las reglas de ${male}`,
      teaser: `Las condiciones del juego quedan claras. Ella puede aceptarlas… o romperlas.`,
    },
    {
      title: `Capítulo 5: Lo que ${female} no debía encontrar`,
      teaser: `Un documento, una mirada, una deuda antigua. El secreto deja de ser abstracto.`,
    },
  ]
}

const REQUIRED_KEYS: (keyof QuizAnswers)[] = [
  'scenario',
  'male',
  'relationship',
  'conflict',
  'female',
  'intensity',
  'ending',
  'presentation',
]

export function generateProject(answers: QuizAnswers): GeneratedProject {
  for (const key of REQUIRED_KEYS) {
    if (!answers[key]) {
      throw new Error(`Respuestas incompletas: falta ${key}`)
    }
  }

  const seedStr = makeSeed([
    answers.scenario,
    answers.male,
    answers.relationship,
    answers.conflict,
    answers.female,
    answers.intensity,
    answers.ending,
    answers.presentation,
  ])
  const seed = hashString(seedStr)

  const femaleName = pickBySeed(FEMALE_NAMES, seed, 1)
  const maleName = pickBySeed(MALE_NAMES, seed, 2)
  const surname = pickBySeed(SURNAMES, seed, 3)
  const penName = pickBySeed(PEN_NAMES, seed, 4)
  const title = buildTitle(seed, femaleName, maleName, surname)

  const scenario = SCENARIO_DATA[answers.scenario]
  const male = MALE_DATA[answers.male]
  const female = FEMALE_DATA[answers.female]
  const relationship = RELATIONSHIP_DATA[answers.relationship]
  const conflict = CONFLICT_DATA[answers.conflict]

  if (!scenario || !male || !female || !relationship || !conflict) {
    throw new Error('Respuestas inválidas para generar el proyecto')
  }

  const tags = [
    relationship.label,
    conflict.label,
    scenario.label,
    male.vibe,
    'Secreto familiar',
    answers.ending === 'open_series' ? 'Potencial de serie' : 'Final intenso',
  ]

  const emotionalPromise =
    answers.intensity === 'very_dark' || answers.intensity === 'dark'
      ? 'Peligro para todos. Protección absoluta para ella.'
      : 'Tensión constante. Deseo contenido. Una verdad que no puede ocultarse.'

  const seriesPotential =
    answers.presentation === 'connected_series' || answers.ending === 'open_series'
      ? `Esta historia podría convertirse en una serie de tres libros conectados por la familia ${surname}.`
      : `El personaje secundario de esta trama puede protagonizar el próximo libro del mismo universo.`

  return {
    seed: seedStr,
    title,
    penName,
    femaleName,
    maleName,
    surname,
    tags,
    premise: buildPremise(answers, femaleName, maleName, surname),
    hook: buildHook(answers, femaleName, maleName),
    emotionalPromise,
    femaleSummary: `${femaleName}: ${female.trait}.`,
    maleSummary: `${maleName} ${surname}: ${male.trait}.`,
    conflictSummary: `Lo que los une: ${conflict.bond}.`,
    secretSummary: conflict.secret.charAt(0).toUpperCase() + conflict.secret.slice(1) + '.',
    visual: {
      colors: ['Negro profundo', 'Vino oscuro', 'Dorado envejecido', 'Marfil'],
      symbols: scenario.visualSymbols,
      setting: scenario.atmosphere,
      coverStyle: scenario.coverStyle,
    },
    seriesPotential,
    lockedChapters: buildLockedChapters(answers, femaleName, maleName),
    answers,
    createdAt: new Date().toISOString(),
  }
}
