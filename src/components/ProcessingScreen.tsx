import { useEffect, useMemo, useState } from 'react'
import { QUESTIONS } from '@/data/questions'
import type { GeneratedProject, QuizAnswers } from '@/types/quiz'

type Phase = 'loading' | 'reveal'

type Props = {
  answers: QuizAnswers
  project: GeneratedProject
  onDone: () => void
}

function optionTitle(questionId: string, answerId: string): string {
  const q = QUESTIONS.find((x) => x.id === questionId)
  return q?.options.find((o) => o.id === answerId)?.title ?? answerId
}

function buildSteps(answers: QuizAnswers, name?: string) {
  return [
    {
      label: name ? `${name}, leyendo tus elecciones…` : 'Leyendo tus elecciones…',
      detail: 'Cruzando escenario, personajes y tono',
    },
    {
      label: `Mundo: ${optionTitle('scenario', answers.scenario)}`,
      detail: 'Atmósfera, símbolos y dirección visual',
    },
    {
      label: `Él: ${optionTitle('male', answers.male)}`,
      detail: 'Presencia, peligro y atracción',
    },
    {
      label: `Ella: ${optionTitle('female', answers.female)}`,
      detail: 'Voz, herida y deseo',
    },
    {
      label: `Lazo: ${optionTitle('relationship', answers.relationship)}`,
      detail: optionTitle('conflict', answers.conflict),
    },
    {
      label: name ? `${name}, sellando tu identidad oculta…` : 'Sellando tu identidad oculta…',
      detail: 'Seudónimo, título y gancho inicial',
    },
  ]
}

export function ProcessingScreen({ answers, project, onDone }: Props) {
  const name = answers.creatorName?.trim()
  const steps = useMemo(() => buildSteps(answers, name), [answers, name])
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [visibleLines, setVisibleLines] = useState(1)

  useEffect(() => {
    const timers: number[] = []
    steps.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setStep(i)
          setVisibleLines(i + 1)
        }, i * 1100),
      )
    })

    const revealAt = steps.length * 1100 + 500
    timers.push(window.setTimeout(() => setPhase('reveal'), revealAt))
    timers.push(window.setTimeout(onDone, revealAt + 2800))

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [steps, onDone])

  const progress =
    phase === 'reveal' ? 100 : Math.min(96, Math.round(((step + 1) / steps.length) * 96))

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-5 py-12 text-center">
      {phase === 'loading' ? (
        <>
          <div className="relative mb-10 h-28 w-28" aria-hidden="true">
            <div
              className="absolute inset-0 rounded-full border border-gold/20"
              style={{ animation: 'ao-spin 12s linear infinite' }}
            />
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 112 112"
              fill="none"
            >
              <circle cx="56" cy="56" r="50" stroke="rgba(184,151,90,0.12)" strokeWidth="2" />
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="#b8975a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 314} 314`}
                className="transition-[stroke-dasharray] duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-accent text-2xl tracking-[0.12em] text-gold-soft">AO</span>
              <span className="mt-1 text-[0.65rem] tabular-nums text-ivory-faint">{progress}%</span>
            </div>
          </div>

          <p className="font-accent mb-3 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
            Autora Oculta
          </p>
          <p
            className="font-display max-w-lg text-3xl leading-tight text-ivory md:text-4xl"
            role="status"
            aria-live="polite"
          >
            {steps[step]?.label}
          </p>
          <p className="mt-3 max-w-md text-sm text-ivory-faint">{steps[step]?.detail}</p>

          <ul className="mt-10 w-full max-w-md space-y-2 text-left" role="list">
            {steps.slice(0, visibleLines).map((s, i) => {
              const active = i === step
              const done = i < step
              return (
                <li
                  key={s.label}
                  className={`flex items-start gap-3 border px-3 py-2.5 transition-all duration-500 ${
                    active
                      ? 'border-gold/40 bg-wine/25 text-ivory'
                      : 'border-white/8 bg-elevated/50 text-ivory-muted'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem] ${
                      done
                        ? 'border-gold/55 bg-gold/15 text-gold'
                        : active
                          ? 'border-gold/40 text-gold-soft'
                          : 'border-white/20 text-ivory-faint'
                    }`}
                    aria-hidden="true"
                  >
                    {done ? '●' : i + 1}
                  </span>
                  <span className="text-sm leading-snug">{s.label}</span>
                </li>
              )
            })}
          </ul>

          <p className="mt-8 max-w-sm text-sm text-ivory-faint">
            Esto no escribe un libro completo. Monta el concepto inicial de tu proyecto.
          </p>
        </>
      ) : (
        <div className="w-full max-w-md" style={{ animation: 'ao-reveal 0.75s ease-out both' }}>
          <p className="font-accent mb-4 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
            Tu proyecto está listo
          </p>
          <div className="rounded-[2px] border border-gold/40 bg-gradient-to-b from-wine/40 to-elevated px-6 py-9 text-center">
            <p className="text-sm text-ivory-faint">Título sugerido</p>
            <h2 className="font-display mt-2 text-3xl leading-tight text-balance text-ivory md:text-4xl">
              {project.title}
            </h2>
            <div className="mx-auto my-5 h-px w-16 bg-gold/40" />
            <p className="text-sm text-ivory-faint">Seudónimo</p>
            <p className="font-accent mt-1 text-lg tracking-[0.08em] text-gold-soft">
              {project.penName}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="border border-white/15 px-2.5 py-1 text-[0.7rem] text-ivory-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-6 text-ivory-muted">Abriendo el resultado completo…</p>
        </div>
      )}
    </div>
  )
}
