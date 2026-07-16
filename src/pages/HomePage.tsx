import { useNavigate } from 'react-router-dom'
import { CTAButton } from '@/components/CTAButton'
import { QUESTIONS } from '@/data/questions'
import { loadAnswers, loadProject } from '@/lib/storage'

export function HomePage() {
  const navigate = useNavigate()
  const saved = loadAnswers()
  const answeredCount = saved
    ? QUESTIONS.filter((q) => Boolean(saved[q.id])).length
    : 0
  const hasProgress = answeredCount > 0 && answeredCount < QUESTIONS.length
  const hasResult = Boolean(loadProject())

  const start = (source: string) => {
    navigate('/quiz', { state: { source } })
  }

  return (
    <div>
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <p className="font-display text-4xl text-ivory md:text-5xl">Autora Oculta</p>
          <p className="font-accent mt-4 inline-block border border-gold/35 px-3 py-1.5 text-[0.62rem] tracking-[0.16em] text-gold uppercase">
            Test gratis · 2 minutos
          </p>
          <h1 className="font-display mt-5 text-4xl leading-[1.1] text-balance text-ivory md:text-5xl">
            ¿Qué dark romance escribirías si nadie supiera que fuiste tú?
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-muted">
            Responde 8 preguntas y recibe ahora: título, seudónimo, premisa, gancho y el conflicto de tu historia.
          </p>
          <ul className="mt-5 space-y-2 text-lg text-ivory-muted" role="list">
            <li>· Una idea personalizada, no una respuesta genérica.</li>
            <li>· Sin mostrar tu rostro. Sin experiencia previa.</li>
            <li>· Luego puedes desbloquear el método para desarrollarlo y publicarlo.</li>
          </ul>
          <div className="mt-7 space-y-3">
            <CTAButton full onClick={() => start('home')}>
              Quiero ver mi historia ahora
            </CTAButton>
            {hasResult ? (
              <CTAButton full variant="secondary" onClick={() => navigate('/resultado')}>
                Ver mi último resultado
              </CTAButton>
            ) : hasProgress ? (
              <CTAButton full variant="secondary" onClick={() => start('home_resume')}>
                Continuar donde lo dejé
              </CTAButton>
            ) : null}
            <p className="text-sm text-ivory-faint">Gratis. Sin tarjeta. Sin crear cuenta.</p>
          </div>
        </div>

        <figure className="overflow-hidden rounded-[2px] border border-white/10">
          <img
            src="/hero-autora-oculta.webp"
            alt="Escritorio oscuro con máscara, cuaderno y laptop: identidad secreta de una autora"
            className="h-64 w-full object-cover object-[70%_45%] md:h-[420px]"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </figure>
      </section>

      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-ivory-muted">
            Lectoras buscan poder, peligro, obsesión y romance prohibido. Tú puedes crear esa historia bajo un nombre falso.
          </p>
          <p className="font-display mt-4 text-3xl text-ivory">En 2 minutos ves tu concepto.</p>
          <div className="mx-auto mt-6 max-w-sm">
            <CTAButton full onClick={() => start('home_secondary')}>
              Empezar el test gratis
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}
