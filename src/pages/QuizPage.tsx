import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { QUESTIONS } from '@/data/questions'
import { ProgressBar } from '@/components/ProgressBar'
import { QuizOptionCard } from '@/components/QuizOptionCard'
import { CTAButton } from '@/components/CTAButton'
import { trackEvent } from '@/lib/analytics'
import { loadAnswers, saveAnswers, clearQuizProgress } from '@/lib/storage'
import type { QuizAnswers } from '@/types/quiz'

function countAnswered(answers: Partial<QuizAnswers>): number {
  return QUESTIONS.filter((q) => Boolean(answers[q.id])).length
}

function parsePaso(raw: string | null, total: number): number | null {
  if (raw == null || raw === '') return null
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return null
  // 1..total = preguntas; total+1 = captura
  return Math.min(n - 1, total)
}

export function QuizPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [step, setStep] = useState(() => parsePaso(searchParams.get('paso'), QUESTIONS.length) ?? 0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [creatorName, setCreatorName] = useState('')
  const [advancing, setAdvancing] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const startedRef = useRef(false)
  const advanceTimer = useRef<number | null>(null)
  const skipUrlSync = useRef(false)

  const total = QUESTIONS.length
  const question = QUESTIONS[step]
  const isCapture = step >= total
  const selected = question ? (answers[question.id] as string | undefined) : undefined
  const progressCurrent = isCapture ? total + 1 : step + 1
  const progressTotal = total + 1
  const progressLabel = isCapture ? 'Último paso' : undefined

  // Hidrata respuestas + resume si no hay ?paso=
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      const source =
        (location.state as { source?: string } | null)?.source ||
        searchParams.get('src') ||
        'direct'
      trackEvent('QuizStarted', { source })
    }

    const saved = loadAnswers()
    const forceNew = searchParams.get('nuevo') === '1'

    if (forceNew) {
      clearQuizProgress()
      setAnswers({})
      setCreatorName('')
      setStep(0)
      const next = new URLSearchParams(searchParams)
      next.delete('nuevo')
      next.set('paso', '1')
      setSearchParams(next, { replace: true })
      setHydrated(true)
      return () => {
        if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
      }
    }

    if (saved) {
      setAnswers(saved)
      if (saved.creatorName) setCreatorName(saved.creatorName)
    }

    const fromUrl = parsePaso(searchParams.get('paso'), total)
    if (fromUrl != null) {
      setStep(fromUrl)
    } else if (saved) {
      const answered = countAnswered(saved)
      if (answered > 0 && answered < total) setStep(answered)
      else if (answered >= total) setStep(total)
    }

    setHydrated(true)
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    }
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync step → URL (browser back funciona)
  useEffect(() => {
    if (!hydrated) return
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const desired = String(step + 1)
    if (searchParams.get('paso') === desired) return
    const next = new URLSearchParams(searchParams)
    next.set('paso', desired)
    setSearchParams(next, { replace: false })
  }, [step, hydrated, searchParams, setSearchParams])

  // URL → step (back/forward)
  useEffect(() => {
    if (!hydrated) return
    const fromUrl = parsePaso(searchParams.get('paso'), total)
    if (fromUrl == null) return
    if (fromUrl !== step) {
      skipUrlSync.current = true
      setAdvancing(false)
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
      setStep(fromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hydrated, total])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [step])

  const canContinue = useMemo(() => {
    if (isCapture) return true
    return Boolean(selected)
  }, [isCapture, selected])

  const goNextStep = useCallback(() => {
    setAdvancing(false)
    if (step < total - 1) {
      setStep((s) => s + 1)
      return
    }
    if (step === total - 1) {
      setStep(total)
    }
  }, [step, total])

  const selectOption = (id: string) => {
    if (!question || advancing) return
    const next = { ...answers, [question.id]: id }
    setAnswers(next)
    saveAnswers(next)
    trackEvent('QuizQuestionAnswered', {
      question: question.id,
      answer: id,
      step: step + 1,
      total,
    })

    setAdvancing(true)
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => {
      goNextStep()
    }, 280)
  }

  const finishQuiz = (opts?: { clearOptional?: boolean }) => {
    const complete: QuizAnswers = {
      ...(answers as QuizAnswers),
      creatorName: opts?.clearOptional ? undefined : creatorName.trim() || undefined,
    }
    const requiredOk = QUESTIONS.every((q) => Boolean(complete[q.id]))
    if (!requiredOk) {
      const firstMissing = QUESTIONS.findIndex((q) => !complete[q.id])
      setStep(Math.max(0, firstMissing))
      return
    }
    saveAnswers(complete)
    trackEvent('QuizCompleted', {
      hasName: Boolean(complete.creatorName),
    })
    navigate('/procesando')
  }

  const next = () => {
    if (!canContinue || advancing) return
    if (step < total - 1) {
      setStep((s) => s + 1)
      return
    }
    if (step === total - 1) {
      setStep(total)
      return
    }
    finishQuiz()
  }

  const back = () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current)
    setAdvancing(false)
    if (step === 0) {
      navigate('/')
      return
    }
    setStep((s) => s - 1)
  }

  const hasOptionalData = Boolean(creatorName.trim())

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 pb-32">
      <ProgressBar
        current={progressCurrent}
        total={progressTotal}
        label={progressLabel}
      />

      {!isCapture && question && (
        <div className="mt-8">
          <h1 className="font-display text-3xl text-ivory md:text-4xl">{question.title}</h1>
          {question.notice && <p className="mt-3 text-sm text-ivory-faint">{question.notice}</p>}
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label={question.title}>
            {question.options.map((opt) => (
              <QuizOptionCard
                key={opt.id}
                title={opt.title}
                description={opt.description}
                selected={selected === opt.id}
                onSelect={() => selectOption(opt.id)}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-ivory-faint">
            Toca una opción para continuar
          </p>
        </div>
      )}

      {isCapture && (
        <div className="mt-8">
          <h1 className="font-display text-3xl text-ivory md:text-4xl">
            Tu concepto está listo
          </h1>
          <p className="mt-3 text-lg text-ivory-muted">
            Opcional: deja tu nombre para personalizar el saludo. Puedes continuar sin llenar nada.
          </p>
          <label className="mt-6 block">
            <span className="mb-2 block text-base text-ivory-muted">Tu nombre (opcional)</span>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="min-h-12 w-full rounded-[2px] border border-white/15 bg-elevated px-4 text-ivory"
              placeholder="Ej. Camila"
              autoComplete="given-name"
            />
          </label>
          <p className="mt-2 text-sm text-ivory-faint">
            Este nombre no será utilizado como tu seudónimo.
          </p>

          <div className="mt-8 space-y-3">
            <CTAButton full onClick={() => finishQuiz()}>
              Ver mi historia ahora
            </CTAButton>
            {hasOptionalData ? (
              <CTAButton full variant="ghost" onClick={() => finishQuiz({ clearOptional: true })}>
                Continuar sin nombre
              </CTAButton>
            ) : null}
          </div>
        </div>
      )}

      {!isCapture && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bg/95 px-4 py-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div
            className="mx-auto flex max-w-2xl gap-3"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <CTAButton variant="secondary" onClick={back} className="flex-1">
              Atrás
            </CTAButton>
            <CTAButton onClick={next} disabled={!canContinue || advancing} className="flex-[1.4]">
              Continuar
            </CTAButton>
          </div>
        </div>
      )}

      {isCapture && (
        <div className="mt-6">
          <CTAButton variant="secondary" onClick={back} className="w-full">
            Atrás
          </CTAButton>
        </div>
      )}
    </div>
  )
}
