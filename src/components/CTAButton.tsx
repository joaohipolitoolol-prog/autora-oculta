import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'secondary'
  full?: boolean
}

export function CTAButton({ children, variant = 'primary', full, className = '', ...props }: Props) {
  const base =
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-[2px] px-5 py-3 text-center text-[0.92rem] font-bold uppercase tracking-[0.08em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50'

  const variants = {
    primary:
      'border border-gold/35 bg-gradient-to-br from-[#8a2a42] via-wine to-[#3d1020] text-ivory shadow-[0_10px_30px_rgba(61,16,32,0.45)] hover:brightness-110',
    secondary:
      'border border-gold/30 bg-elevated text-ivory hover:border-gold/55',
    ghost:
      'border border-transparent bg-transparent text-ivory-muted underline-offset-4 hover:text-ivory hover:underline',
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
