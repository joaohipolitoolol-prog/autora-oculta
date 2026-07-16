import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaId?: string
  storyTitle?: string
  anchor?: boolean
  compact?: boolean
}

/**
 * Desire first, tools as vehicle. Numbers over adjectives.
 * Single clear CTA: DESBLOQUEAR MI PROYECTO POR US$ X
 */
export function OfferBox({
  title = 'Tu proyecto está listo para ser desarrollado.',
  subtitle = 'Desbloquea el método para convertir este concepto en capítulos, sinopsis y una historia que puedas publicar — bajo seudónimo.',
  ctaLabel,
  ctaId = 'offer',
  storyTitle,
  anchor = false,
  compact = false,
}: Props) {
  const label =
    ctaLabel ?? `DESBLOQUEAR MI PROYECTO POR ${APP_CONFIG.PRICE_CURRENT}`

  return (
    <div
      id={anchor ? 'oferta' : undefined}
      className="border border-gold/35 bg-gradient-to-b from-wine/30 to-bg p-6 text-center md:p-8"
    >
      <p className="font-accent text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Método Autora Oculta
      </p>
      {storyTitle ? (
        <p className="mt-3 text-base text-gold-soft">
          Continúa: <span className="text-ivory italic">«{storyTitle}»</span>
        </p>
      ) : null}
      <h3 className="font-display mt-3 text-2xl leading-snug text-ivory md:text-3xl">{title}</h3>
      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ivory-muted">{subtitle}</p>

      {!compact ? (
        <ul
          className="mx-auto mt-6 max-w-md space-y-2 text-left text-base text-ivory-muted"
          role="list"
        >
          {[
            'Tu proyecto del test importado (título, seudónimo, premisa)',
            'Estructura de hasta 25 capítulos',
            'Más de 40 prompts organizados',
            'Plan de ejecución en 7 días',
            'Guía de sinopsis y publicación',
          ].map((item) => (
            <li
              key={item}
              className="flex gap-2 border border-white/10 bg-elevated/50 px-3 py-2.5"
            >
              <span className="text-gold" aria-hidden>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 font-display text-5xl text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</p>
      <p className="mt-1 text-base text-ivory-faint">
        Un solo pago. Sin mensualidades. Acceso inmediato.
      </p>
      <p className="mt-1 text-sm text-ivory-faint">
        Referencia <s>{APP_CONFIG.PRICE_REFERENCE}</s>
      </p>

      <aside className="mx-auto mt-6 max-w-lg border border-gold/30 bg-bg/50 p-4 text-left">
        <p className="text-base leading-relaxed text-ivory-muted">
          <strong className="text-ivory">No es una novela completa automática.</strong> Recibes el
          método para desarrollar tu proyecto con estructuras y prompts en ChatGPT, Claude o Gemini.
        </p>
      </aside>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          {label}
        </CTAButton>
      </div>
      <p className="mt-3 text-sm text-ivory-faint">Garantía de 7 días según Hotmart.</p>
    </div>
  )
}
