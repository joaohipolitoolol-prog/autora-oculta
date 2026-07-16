import { useEffect, useState } from 'react'

const MESSAGES = [
  'Combinando tus elecciones…',
  'Creando el conflicto central…',
  'Definiendo a los protagonistas…',
  'Preparando tu identidad oculta…',
  'Construyendo la premisa…',
  'Tu historia está apareciendo…',
]

type Props = {
  onDone: () => void
}

export function ProcessingScreen({ onDone }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const step = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, MESSAGES.length - 1))
    }, 650)
    const done = window.setTimeout(onDone, 4200)
    return () => {
      window.clearInterval(step)
      window.clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-5 text-center">
      <div className="relative mb-8 h-20 w-20" aria-hidden="true">
        <div className="absolute inset-0 animate-pulse rounded-full border border-gold/40" />
        <div className="absolute inset-3 rounded-full border border-wine/60" />
        <div className="absolute inset-0 flex items-center justify-center font-accent text-gold">
          ⌘
        </div>
      </div>
      <p className="font-accent mb-3 text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Autora Oculta
      </p>
      <p className="font-display text-3xl text-ivory" role="status" aria-live="polite">
        {MESSAGES[index]}
      </p>
      <p className="mt-4 max-w-sm text-sm text-ivory-faint">
        Estamos organizando tu proyecto inicial. No se está escribiendo un libro completo.
      </p>
    </div>
  )
}
