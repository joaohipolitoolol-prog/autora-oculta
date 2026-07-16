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
}

export function OfferBox({
  title = 'Tu historia ya tiene una base. Ahora necesitas el método para desarrollarla.',
  subtitle = 'Desbloquea la estructura, los personajes, los prompts y el plan para convertir este concepto en una historia que puedas desarrollar, publicar y presentar.',
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
          'Proyecto inicial del test (título, seudónimo, premisa)',
          'Estructura de capítulos + perfiles de personajes',
          'Prompts para ChatGPT / Claude / Gemini',
          'Sinopsis, publicación y plan de 7 días',
        ].map((item) => (
          <li key={item} className="flex gap-2 border border-white/10 bg-elevated/50 px-3 py-2.5">
            <span className="text-gold" aria-hidden="true">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-ivory-faint">
        Precio normal <s>{APP_CONFIG.PRICE_REFERENCE}</s>
      </p>
      <p className="font-display text-5xl text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</p>
      <p className="mt-1 text-base text-ivory-faint">Un solo pago · acceso inmediato</p>

      {/* Frase obrigatória ANTES do botão */}
      <aside className="mx-auto mt-6 max-w-lg rounded-[2px] border border-gold/30 bg-bg/50 p-4 text-left">
        <p className="text-base leading-relaxed text-ivory-muted">
          <strong className="text-ivory">Autora Oculta no genera una novela completa automáticamente.</strong>{' '}
          Recibirás un proyecto inicial personalizado y un método guiado para desarrollarlo con
          prompts, estructuras y herramientas de inteligencia artificial.
        </p>
      </aside>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          {label}
        </CTAButton>
      </div>
      <p className="mt-3 text-sm text-ivory-faint">
        Prueba 7 días. Reembolso según el checkout de Hotmart.
      </p>
    </div>
  )
}
