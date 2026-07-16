import type { GeneratedProject } from '@/types/quiz'
import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  project: GeneratedProject
  ctaId?: string
}

/** Um prompt aberto + lista do que falta — tangível sem alongar demais */
export function MethodPreview({ project, ctaId = 'method_preview' }: Props) {
  const { femaleName, maleName, surname, title, conflictSummary } = project

  const openPrompt = `Escribe la primera escena de «${title}» en tono dark romance. Protagonista: ${femaleName}. Él: ${maleName} ${surname}. Empieza con tensión, secreto y atracción negada. 450–600 palabras. No resuelvas el misterio todavía.`

  return (
    <section className="rounded-[2px] border border-gold/30 bg-elevated/90 p-5 md:p-6">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">
        Así se desarrolla tu historia
      </p>
      <h3 className="font-display mt-2 text-2xl text-ivory md:text-3xl">
        Un prompt real, con tus personajes
      </h3>
      <p className="mt-2 text-base text-ivory-muted">
        Copias, pegas en ChatGPT (u otra IA) y escribes la siguiente escena. Conflictos como:{' '}
        {conflictSummary}
      </p>

      <article className="mt-5 border border-white/12 bg-bg/40 text-left">
        <div className="border-b border-white/10 px-4 py-2">
          <p className="font-accent text-[0.65rem] tracking-[0.14em] text-gold uppercase">
            Prompt · Escena de apertura
          </p>
        </div>
        <pre className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-ivory-muted md:text-base">
          {openPrompt}
        </pre>
      </article>

      <p className="mt-4 text-sm text-ivory-faint">
        Al desbloquear: prompts para capítulos, diálogos, clímax, sinopsis y más — partiendo de «
        {title}».
      </p>

      <div className="mt-5">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          Desbloquear mi proyecto por {APP_CONFIG.PRICE_CURRENT}
        </CTAButton>
      </div>
    </section>
  )
}
