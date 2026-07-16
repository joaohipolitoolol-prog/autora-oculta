import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaId?: string
  storyTitle?: string
  /** Solo el primer OfferBox de la página debe anclar #oferta */
  anchor?: boolean
}

export function OfferBox({
  title = 'Tu historia ya tiene un nombre, un conflicto y un universo. Ahora necesitas el método para terminarla.',
  subtitle = 'Desbloquea la estructura de capítulos, los perfiles de personajes, los prompts y el plan de publicación para desarrollar tu proyecto paso a paso.',
  ctaLabel,
  ctaId = 'offer',
  storyTitle,
  anchor = false,
}: Props) {
  const label = ctaLabel ?? `Desbloquear mi proyecto por ${APP_CONFIG.PRICE_CURRENT}`

  return (
    <div
      id={anchor ? 'oferta' : undefined}
      className="rounded-[2px] border border-gold/35 bg-gradient-to-b from-wine/30 to-bg p-6 text-center md:p-8"
    >
      <p className="font-accent text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Continuación de tu proyecto
      </p>
      {storyTitle ? (
        <p className="mt-3 text-base text-gold-soft">
          Para desarrollar: <span className="text-ivory italic">«{storyTitle}»</span>
        </p>
      ) : null}
      <h3 className="font-display mt-3 text-2xl leading-snug text-ivory md:text-3xl">{title}</h3>
      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ivory-muted">{subtitle}</p>

      <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-base text-ivory-muted" role="list">
        {[
          'Tu concepto del test como punto de partida (título, seudónimo, premisa)',
          'Prompts listos para pegar en ChatGPT / Claude / Gemini',
          'Estructura de capítulos + evolución del romance',
          'Sinopsis, descripción de venta y plan de 7 días',
        ].map((item) => (
          <li key={item} className="flex gap-2 border border-white/10 bg-elevated/50 px-3 py-2.5">
            <span className="text-gold" aria-hidden="true">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 max-w-md rounded-[2px] border border-white/10 bg-bg/40 p-4 text-left">
        <p className="font-accent text-[0.62rem] tracking-[0.14em] text-gold uppercase">
          Qué pasa al pagar
        </p>
        <ol className="mt-3 space-y-2 text-sm text-ivory-muted md:text-base">
          <li>1. Pagas en Hotmart (seguro).</li>
          <li>2. Acceso inmediato al método digital.</li>
          <li>3. Continúas desde el concepto que acabas de crear.</li>
        </ol>
      </div>

      <p className="mt-6 text-ivory-faint">
        Precio normal <s>{APP_CONFIG.PRICE_REFERENCE}</s>
      </p>
      <p className="font-display text-5xl text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</p>
      <p className="mt-1 text-base text-ivory-faint">Un solo pago · acceso inmediato</p>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          {label}
        </CTAButton>
      </div>
      <p className="mt-3 text-base text-ivory-faint">
        No es una novela completa automática. Es el método para desarrollar esta idea.
      </p>
      <p className="mt-2 text-sm text-ivory-faint">
        Prueba 7 días. Reembolso según el checkout.
      </p>
    </div>
  )
}
