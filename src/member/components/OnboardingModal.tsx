import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { trackEvent } from '@/lib/analytics'

export function OnboardingModal() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const quizAvailable = useAppStore((s) => s.quizAvailable)
  const importQuiz = useAppStore((s) => s.importQuiz)
  const createBlankProject = useAppStore((s) => s.createBlankProject)
  const project = useAppStore((s) => s.project)
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('desarrollar')
  const [pace, setPace] = useState('equilibrado')
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    trackEvent('OnboardingStarted', {})
  }, [])

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    const focusables = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusables[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void completeOnboarding(goal, pace)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [completeOnboarding, goal, pace, step])

  const finish = async () => {
    if (!project) {
      if (quizAvailable) await importQuiz()
      else await createBlankProject(goal, pace)
    }
    await completeOnboarding(goal, pace)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div ref={dialogRef} className="w-full max-w-md border border-gold/30 bg-elevated p-6">
        <p className="font-accent text-[0.65rem] tracking-[0.16em] text-gold uppercase">
          Bienvenida · {step + 1}/5
        </p>

        {step === 0 && (
          <>
            <h2 id={titleId} className="font-display mt-2 text-2xl">
              Bienvenida a Autora Oculta
            </h2>
            <p className="mt-3 text-sm text-ivory-muted">
              Tu proyecto está listo para ser desarrollado. Organizamos el método; la prosa la
              escribes con ChatGPT, Claude o Gemini. No es una novela automática completa.
            </p>
          </>
        )}
        {step === 1 && (
          <>
            <h2 id={titleId} className="font-display mt-2 text-2xl">
              Tu punto de partida
            </h2>
            <p className="mt-3 text-sm text-ivory-muted">
              {quizAvailable
                ? 'Detectamos el resultado del test en este navegador.'
                : 'Puedes crear el proyecto desde cero o pegar el resultado después.'}
            </p>
            {quizAvailable ? (
              <button
                type="button"
                className="mt-4 w-full min-h-11 border border-gold/40 text-sm text-gold-soft"
                onClick={() => void importQuiz()}
              >
                Importar resultado del test
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 w-full min-h-11 border border-gold/40 text-sm text-gold-soft"
                onClick={() => void createBlankProject(goal, pace)}
              >
                Crear proyecto en blanco
              </button>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <h2 id={titleId} className="font-display mt-2 text-2xl">
              ¿Cuál es tu objetivo?
            </h2>
            <div className="mt-3 space-y-2">
              {[
                ['desarrollar', 'Desarrollar mi primera historia'],
                ['organizar', 'Organizar una idea existente'],
                ['serie', 'Crear una serie'],
                ['publicar', 'Preparar una historia para publicar'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGoal(id)}
                  className={`block w-full min-h-11 border px-3 text-left text-sm ${goal === id ? 'border-gold/40 bg-wine/30' : 'border-white/10'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 id={titleId} className="font-display mt-2 text-2xl">
              Ritmo
            </h2>
            <div className="mt-3 space-y-2">
              {[
                ['rapido', 'Rápido — avances cortos'],
                ['equilibrado', 'Equilibrado'],
                ['profundo', 'Profundo — más detalle'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPace(id)}
                  className={`block w-full min-h-11 border px-3 text-left text-sm ${pace === id ? 'border-gold/40 bg-wine/30' : 'border-white/10'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2 id={titleId} className="font-display mt-2 text-2xl">
              Tu primera tarea
            </h2>
            <p className="mt-3 text-sm text-ivory-muted">
              Completa la base en Mi Proyecto (título, seudónimo, nombres, premisa). Luego copia un
              prompt y pega el resultado en Capítulos.
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {step < 4 ? (
            <button
              type="button"
              className="min-h-11 flex-1 border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-4 font-semibold text-ivory"
              onClick={() => setStep((s) => s + 1)}
            >
              Continuar
            </button>
          ) : (
            <Link
              to="/entregavel/proyecto"
              className="flex min-h-11 flex-1 items-center justify-center border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-4 font-semibold text-ivory no-underline"
              onClick={() => void finish()}
            >
              Ir a Mi Proyecto
            </Link>
          )}
          <button
            type="button"
            className="min-h-11 border border-white/15 px-4 text-ivory-muted"
            onClick={() => void finish()}
          >
            Saltar
          </button>
        </div>
      </div>
    </div>
  )
}
