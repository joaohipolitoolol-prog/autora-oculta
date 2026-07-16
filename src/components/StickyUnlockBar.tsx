import { APP_CONFIG } from '@/config'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  visible: boolean
  ctaId?: string
}

/** CTA fijo en mobile en la página de resultado */
export function StickyUnlockBar({ visible, ctaId = 'sticky_result' }: Props) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/25 bg-bg/95 px-4 py-3 backdrop-blur md:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={() => goToCheckout(ctaId)}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[2px] border border-gold/35 bg-gradient-to-br from-[#8a2a42] via-wine to-[#3d1020] px-4 text-center text-ivory"
      >
        <span className="text-[0.8rem] font-bold uppercase tracking-[0.05em]">
          Desbloquear mi proyecto por {APP_CONFIG.PRICE_CURRENT}
        </span>
      </button>
    </div>
  )
}
