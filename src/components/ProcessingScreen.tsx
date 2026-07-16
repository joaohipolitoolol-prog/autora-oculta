import { useEffect, useMemo, useRef, useState } from 'react'
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

function useSmoothProgress(target: number, durationMs = 850) {
  const [display, setDisplay] = useState(0)
  const current = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const from = current.current
    const to = target
    const start = performance.now()
    cancelAnimationFrame(raf.current)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // ease-out cubic
      const eased = 1 - (1 - t) ** 3
      const value = from + (to - from) * eased
      current.current = value
      setDisplay(value)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, durationMs])

  return display
}

/** Una sola secuencia suave → resultado */
export function ProcessingScreen({ answers, onDone }: Props) {
  const name = answers.creatorName?.trim()
  const steps = useMemo(() => buildSteps(answers, name), [answers, name])
  const [step, setStep] = useState(0)
  const [finishing, setFinishing] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [headlineKey, setHeadlineKey] = useState(0)
  const [headlineVisible, setHeadlineVisible] = useState(true)

  const targetProgress = finishing
    ? 100
    : Math.round(((step + 1) / steps.length) * 100)
  const smoothProgress = useSmoothProgress(targetProgress, 900)

  // Troca de texto com fade
  useEffect(() => {
    setHeadlineVisible(false)
    const t = window.setTimeout(() => {
      setHeadlineKey((k) => k + 1)
      setHeadlineVisible(true)
    }, 180)
    return () => window.clearTimeout(t)
  }, [step, finishing])

  useEffect(() => {
    const timers: number[] = []
    const stepMs = 1100

    steps.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setStep(i)
        }, i * stepMs),
      )
    })

    const finishAt = steps.length * stepMs + 350
    timers.push(
      window.setTimeout(() => {
        setFinishing(true)
      }, finishAt),
    )

    // Fade-out da tela inteira antes de navegar
    timers.push(
      window.setTimeout(() => {
        setExiting(true)
      }, finishAt + 900),
    )
    timers.push(window.setTimeout(onDone, finishAt + 1400))

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [steps, onDone])

  const current = steps[Math.min(step, steps.length - 1)]
  const headline = finishing ? 'Tu concepto está listo' : current?.label
  const detail = finishing ? 'Abriendo tu resultado…' : current?.detail
  const ring = (smoothProgress / 100) * 314

  return (
    <div
      className={`flex min-h-[70dvh] flex-col items-center px-5 pb-10 pt-6 text-center transition-opacity duration-500 ease-out md:justify-center md:py-12 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="sticky top-0 z-10 w-full bg-bg/92 pb-4 pt-2 backdrop-blur-sm">
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
              strokeDasharray={`${ring} 314`}
              className="transition-[stroke-dasharray] duration-300 ease-out"
            />
          </svg>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            style={{ animation: finishing ? undefined : 'ao-breathe 3.2s ease-in-out infinite' }}
          >
            <svg
              width="24"
              height="24"
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
              {Math.round(smoothProgress)}%
            </span>
          </div>
        </div>
      </div>

      <p className="font-accent mb-3 mt-2 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Autora Oculta
      </p>

      <div
        key={headlineKey}
        className={`max-w-lg transition-all duration-500 ease-out ${
          headlineVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <p
          className="font-display text-2xl leading-tight text-ivory md:text-4xl"
          role="status"
          aria-live="polite"
        >
          {headline}
        </p>
        <p className="mt-2 text-base text-ivory-faint">{detail}</p>
      </div>

      <ul className="mt-8 w-full max-w-md space-y-2 text-left" role="list">
        {steps.slice(0, step + 1).map((s, i) => {
          const active = !finishing && i === step
          const done = finishing || i < step
          return (
            <li
              key={s.label}
              className={`flex items-start gap-3 border px-3 py-2.5 transition-all duration-700 ease-out ${
                active
                  ? 'border-gold/40 bg-wine/25 text-ivory'
                  : 'border-white/8 bg-elevated/50 text-ivory-muted'
              }`}
              style={{
                animation: 'ao-step-in 0.55s ease-out both',
                animationDelay: `${Math.min(i, 2) * 40}ms`,
              }}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem] transition-colors duration-500 ${
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

      <p className="mt-8 max-w-sm text-sm text-ivory-faint transition-opacity duration-700">
        Esto no escribe un libro completo. Monta el concepto inicial de tu proyecto.
      </p>
    </div>
  )
}
