import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS } from '@/data/questions'
import { ProgressBar } from '@/components/ProgressBar'
import { QuizOptionCard } from '@/components/QuizOptionCard'
import { CTAButton } from '@/components/CTAButton'
import { trackEvent } from '@/lib/analytics'
import { loadAnswers, saveAnswers } from '@/lib/storage'
import type { QuizAnswers } from '@/types/quiz'

export function QuizPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [creatorName, setCreatorName] = useState('')
  const [email, setEmail] = useState('')

  const total = QUESTIONS.length
  const question = QUESTIONS[step]
  const isCapture = step >= total
  const selected = question ? (answers[question.id] as string | undefined) : undefined

  useEffect(() => {
    trackEvent('QuizStarted', { source: 'quiz_page' })
    const saved = loadAnswers()
    if (saved) {
      setAnswers(saved)
      if (saved.creatorName) setCreatorName(saved.creatorName)
      if (saved.email) setEmail(saved.email)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [step])

  const canContinue = useMemo(() => {
    if (isCapture) return true
    return Boolean(selected)
  }, [isCapture, selected])

  const selectOption = (id: string) => {
    if (!question) return
    const next = { ...answers, [question.id]: id }
    setAnswers(next)
    saveAnswers(next)
    trackEvent('QuizQuestionAnswered', { question: question.id, answer: id, step: step + 1 })
  }

  const next = () => {
    if (!canContinue) return
    if (step < total - 1) {
      setStep((s) => s + 1)
      return
    }
    if (step === total - 1) {
      setStep(total)
      return
    }
    const complete: QuizAnswers = {
      ...(answers as QuizAnswers),
      creatorName: creatorName.trim() || undefined,
      email: email.trim() || undefined,
    }
    saveAnswers(complete)
    trackEvent('QuizCompleted', { hasEmail: Boolean(complete.email) })
    navigate('/processando')
  }

  const back = () => {
    if (step === 0) {
      navigate('/')
      return
    }
    setStep((s) => s - 1)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <ProgressBar current={Math.min(step + 1, total)} total={total} />

      {!isCapture && question && (
        <div className="mt-8">
          <h1 className="font-display text-3xl text-ivory md:text-4xl">{question.title}</h1>
          {question.notice && <p className="mt-3 text-sm text-ivory-faint">{question.notice}</p>}
          <div className="mt-6 grid gap-3">
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
        </div>
      )}

      {isCapture && (
        <div className="mt-8">
          <h1 className="font-display text-3xl text-ivory md:text-4xl">
            ¿Cómo debemos llamar a la creadora de esta historia?
          </h1>
          <label className="mt-6 block">
            <span className="mb-2 block text-sm text-ivory-muted">Tu nombre</span>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="min-h-12 w-full rounded-[2px] border border-white/15 bg-elevated px-4 text-ivory"
              placeholder="Ej. Camila"
              autoComplete="given-name"
            />
          </label>
          <p className="mt-2 text-sm text-ivory-faint">Este nombre no será utilizado como tu seudónimo.</p>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm text-ivory-muted">
              ¿Quieres recibir una copia de tu resultado? (opcional)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full rounded-[2px] border border-white/15 bg-elevated px-4 text-ivory"
              placeholder="Correo electrónico"
              autoComplete="email"
            />
          </label>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <CTAButton variant="secondary" onClick={back} className="flex-1">
          Atrás
        </CTAButton>
        <CTAButton onClick={next} disabled={!canContinue} className="flex-[1.4]">
          {isCapture ? 'Crear mi historia' : 'Continuar'}
        </CTAButton>
      </div>
    </div>
  )
}
