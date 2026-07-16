import type { GeneratedProject } from '@/types/quiz'
import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  project: GeneratedProject
  ctaId?: string
}

/** Prueba tangible del método: prompts reales ligados al resultado del quiz */
export function MethodPreview({ project, ctaId = 'method_preview' }: Props) {
  const { femaleName, maleName, surname, title, penName, conflictSummary, secretSummary } = project

  const prompts = [
    {
      label: 'Prompt 1 · Escena de apertura',
      body: `Escribe la primera escena de «${title}» en tono dark romance. Protagonista: ${femaleName}. Él: ${maleName} ${surname}. Empieza con tensión, secreto y atracción negada. 450–600 palabras. No resuelvas el misterio todavía.`,
      locked: false,
    },
    {
      label: 'Prompt 2 · Conflicto entre ellos',
      body: `Desarrolla una escena donde ${femaleName} y ${maleName} enfrentan esto: ${conflictSummary} Incluye diálogo cortante, deseo contenido y una pista sobre: ${secretSummary}`,
      locked: false,
    },
    {
      label: 'Prompt 3 · Capítulos 4–8 + clímax',
      body: `Expande la estructura completa de «${title}» (como ${penName}): arcos, spoilers controlados, escenas de tensión y final…`,
      locked: true,
    },
  ]

  return (
    <section className="rounded-[2px] border border-gold/30 bg-elevated/90 p-5 md:p-7">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">
        Vista previa del método
      </p>
      <h3 className="font-display mt-2 text-3xl text-ivory md:text-4xl">
        Así se desarrolla <em className="text-gold-soft not-italic">tu</em> historia
      </h3>
      <p className="mt-3 text-base leading-relaxed text-ivory-muted">
        No es un curso genérico. Estos prompts ya usan tu título, tus personajes y tu conflicto.
        Copias, pegas en ChatGPT (u otra IA) y escribes la siguiente escena.
      </p>

      <div className="mt-6 space-y-4">
        {prompts.map((p) => (
          <article
            key={p.label}
            className={`relative overflow-hidden border text-left ${
              p.locked ? 'border-gold/25 bg-bg/50' : 'border-white/12 bg-bg/40'
            }`}
          >
            <div className="border-b border-white/10 px-4 py-2">
              <p className="font-accent text-[0.65rem] tracking-[0.14em] text-gold uppercase">
                {p.label}
                {p.locked ? ' · bloqueado' : ''}
              </p>
            </div>
            {p.locked ? (
              <div className="relative px-4 py-5">
                <p className="select-none text-base leading-relaxed text-ivory-muted blur-[5px]" aria-hidden="true">
                  {p.body}
                </p>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/70">
                  <span className="font-accent text-[0.65rem] tracking-[0.14em] text-gold uppercase">
                    Disponible al desbloquear
                  </span>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap px-4 py-4 text-sm leading-relaxed text-ivory-muted md:text-base">
                {p.body}
              </pre>
            )}
          </article>
        ))}
      </div>

      <p className="mt-5 text-base text-ivory-muted">
        Al desbloquear recibes decenas de prompts como estos, la estructura de capítulos y el plan
        para publicar — partiendo de <strong className="text-ivory">{title}</strong>.
      </p>

      <div className="mt-5">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          Quiero estos prompts para mi historia · {APP_CONFIG.PRICE_CURRENT}
        </CTAButton>
      </div>
    </section>
  )
}
