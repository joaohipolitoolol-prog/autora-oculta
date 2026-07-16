import { useEffect, useMemo, useState } from 'react'
import { QUESTIONS } from '@/data/questions'
import type { GeneratedProject, QuizAnswers } from '@/types/quiz'

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
      detail: 'Atmósfera y dirección visual',
    },
    {
      label: `Él: ${optionTitle('male', answers.male)}`,
      detail: 'Presencia y peligro',
    },
    {
      label: `Ella: ${optionTitle('female', answers.female)}`,
      detail: 'Voz y deseo',
    },
    {
      label: `Lazo: ${optionTitle('relationship', answers.relationship)}`,
      detail: optionTitle('conflict', answers.conflict),
    },
    {
      label: 'Sellando tu identidad oculta…',
      detail: 'Título, seudónimo y gancho',
    },
  ]
}

/** Una sola secuencia → resultado. Sin pantalla intermedia que “salta”. */
export function ProcessingScreen({ answers, onDone }: Props) {
  const name = answers.creatorName?.trim()
  const steps = useMemo(() => buildSteps(answers, name), [answers, name])
  const [step, setStep] = useState(0)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    const timers: number[] = []
    const stepMs = 900

    steps.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setStep(i)
        }, i * stepMs),
      )
    })

    const finishAt = steps.length * stepMs + 200
    timers.push(
      window.setTimeout(() => {
        setFinishing(true)
        setStep(steps.length - 1)
      }, finishAt),
    )

    // Breve “100%” y va directo al resultado (el wow está allá)
    timers.push(window.setTimeout(onDone, finishAt + 700))

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [steps, onDone])

  const progress = finishing
    ? 100
    : Math.round(((step + 1) / steps.length) * 100)

  const current = steps[Math.min(step, steps.length - 1)]

  return (
    <div className="flex min-h-[70dvh] flex-col items-center px-5 pb-10 pt-6 text-center md:justify-center md:py-12">
      {/* Anel fixo no topo no mobile — não some ao crescer a lista */}
      <div className="sticky top-0 z-10 w-full bg-bg/90 pb-4 pt-2 backdrop-blur-sm">
        <div className="relative mx-auto h-24 w-24" aria-hidden="true">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 112 112"
            fill="none"
          >
            <circle cx="56" cy="56" r="50" stroke="rgba(184,151,90,0.14)" strokeWidth="2.5" />
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="#b8975a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 314} 314`}
              className="transition-[stroke-dasharray] duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <svg
              width="26"
              height="26"
              viewBox="0 0 36 36"
              fill="none"
              className="text-gold-soft opacity-90"
            >
              <path
                d="M6 16c0-6.5 5.2-11 12-11s12 4.5 12 11c0 5.5-3.2 9.2-6.5 11.2-.8.5-1.5-.2-1.5-1v-2.4c0-.6-.4-1.1-.9-1.3C19.2 21.8 18.2 21.5 18 21.5s-1.2.3-3.1 1c-.5.2-.9.7-.9 1.3v2.4c0 .8-.7 1.5-1.5 1C9.2 25.2 6 21.5 6 16Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 16.5c.4-.8 1.1-1.3 1.8-1.3M22.5 16.5c-.4-.8-1.1-1.3-1.8-1.3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-lg tabular-nums leading-none text-ivory">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <p className="font-accent mb-3 mt-2 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Autora Oculta
      </p>
      <p
        className="font-display max-w-lg text-2xl leading-tight text-ivory md:text-4xl"
        role="status"
        aria-live="polite"
      >
        {finishing ? 'Tu concepto está listo' : current?.label}
      </p>
      <p className="mt-2 max-w-md text-base text-ivory-faint">
        {finishing ? 'Abriendo tu resultado…' : current?.detail}
      </p>

      <ul className="mt-8 w-full max-w-md space-y-2 text-left" role="list">
        {steps.slice(0, step + 1).map((s, i) => {
          const active = !finishing && i === step
          const done = finishing || i < step
          return (
            <li
              key={s.label}
              className={`flex items-start gap-3 border px-3 py-2.5 transition-all duration-400 ${
                active
                  ? 'border-gold/40 bg-wine/25 text-ivory'
                  : 'border-white/8 bg-elevated/50 text-ivory-muted'
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem] ${
                  done
                    ? 'border-gold/55 bg-gold/15 text-gold'
                    : 'border-gold/40 text-gold-soft'
                }`}
                aria-hidden="true"
              >
                {done ? '●' : i + 1}
              </span>
              <span className="text-sm leading-snug md:text-base">{s.label}</span>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 max-w-sm text-sm text-ivory-faint">
        Esto no escribe un libro completo. Monta el concepto inicial de tu proyecto.
      </p>
    </div>
  )
}
