import { useNavigate } from 'react-router-dom'
import { CTAButton } from '@/components/CTAButton'
import { QUESTIONS } from '@/data/questions'
import { loadAnswers, loadProject } from '@/lib/storage'

/**
 * Hero sells the whole thesis (principle 32).
 * One primary CTA. Desire + mechanism. No income claim above the fold.
 */
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
      {/* HERO — one composition */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(900px 420px at 50% -10%, rgba(92,26,46,0.35), transparent 60%), radial-gradient(600px 400px at 100% 30%, rgba(42,20,40,0.4), transparent 55%)',
          }}
        />
        <div className="relative mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <p className="font-display text-4xl text-ivory md:text-5xl">Autora Oculta</p>
            <p className="font-accent mt-4 inline-block border border-gold/35 px-3 py-1.5 text-[0.62rem] tracking-[0.16em] text-gold uppercase">
              Test gratis · 2 minutos
            </p>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] text-balance text-ivory md:text-5xl">
              ¿Qué dark romance escribirías si nadie supiera que fuiste tú?
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-muted">
              Responde 8 preguntas y recibe un título, un seudónimo, una premisa, protagonistas y un
              gancho inicial personalizado.
            </p>
            <ul className="mt-5 space-y-2 text-base text-ivory-muted" role="list">
              <li>· Sin mostrar tu rostro</li>
              <li>· Sin experiencia previa</li>
              <li>· Sin comenzar desde una página en blanco</li>
            </ul>
            <div className="mt-7 space-y-3">
              <CTAButton full onClick={() => start('home')}>
                QUIERO VER MI HISTORIA AHORA
              </CTAButton>
              {hasResult ? (
                <button
                  type="button"
                  onClick={() => navigate('/resultado')}
                  className="w-full text-center text-sm text-ivory-faint underline-offset-2 hover:text-gold-soft hover:underline"
                >
                  Ver mi último resultado
                </button>
              ) : hasProgress ? (
                <button
                  type="button"
                  onClick={() => start('home_resume')}
                  className="w-full text-center text-sm text-ivory-faint underline-offset-2 hover:text-gold-soft hover:underline"
                >
                  Continuar donde lo dejé
                </button>
              ) : null}
              <p className="text-sm text-ivory-faint">Gratis. Sin tarjeta. Sin crear cuenta.</p>
            </div>
          </div>

          <figure className="overflow-hidden border border-white/10">
            <img
              src="/hero-autora-oculta.webp"
              alt="Escritorio oscuro con máscara y cuaderno: identidad secreta de una autora"
              className="h-64 w-full object-cover object-[70%_45%] md:h-[420px]"
              width={1536}
              height={1024}
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      {/* Empathy */}
      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg leading-relaxed text-ivory-muted">
            Tal vez tienes ideas, pero no sabes cómo convertirlas en personajes, capítulos y una
            historia que puedas terminar.
          </p>
          <p className="mt-4 text-lg text-ivory-muted">
            No necesitas ser escritora profesional ni comenzar frente a una página en blanco.
          </p>
        </div>
      </section>

      {/* Mechanism — 4 steps */}
      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="font-accent text-center text-[0.68rem] tracking-[0.18em] text-gold uppercase">
            Método Autora Oculta
          </p>
          <h2 className="font-display mt-3 text-center text-3xl text-ivory">
            Crea y desarrolla historias digitales bajo un seudónimo
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-base text-ivory-muted">
            Empiezas con una combinación personalizada de universo, personajes y conflicto. Luego
            usas estructuras y prompts para transformar esa base en una historia que puedas
            publicar.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[
              ['1', 'Descubrir', 'Tu concepto en el test'],
              ['2', 'Estructurar', 'Hasta 25 capítulos'],
              ['3', 'Desarrollar', 'Con +40 prompts'],
              ['4', 'Publicar', 'Sinopsis y plan'],
            ].map(([n, t, d]) => (
              <li key={n} className="border border-white/10 bg-elevated/60 px-4 py-4 text-center">
                <p className="font-display text-2xl text-gold-soft">{n}</p>
                <p className="mt-1 font-display text-xl text-ivory">{t}</p>
                <p className="mt-1 text-sm text-ivory-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="border border-white/10 p-5">
            <h3 className="font-display text-2xl text-ivory">Página en blanco</h3>
            <ul className="mt-3 space-y-2 text-sm text-ivory-muted">
              <li>· Sin dirección</li>
              <li>· Ideas sueltas</li>
              <li>· Personajes inconsistentes</li>
              <li>· Capítulos sin estructura</li>
            </ul>
          </div>
          <div className="border border-gold/30 bg-wine/15 p-5">
            <h3 className="font-display text-2xl text-ivory">Autora Oculta</h3>
            <ul className="mt-3 space-y-2 text-sm text-ivory-muted">
              <li>· Concepto personalizado</li>
              <li>· Proyecto organizado</li>
              <li>· Prompts conectados a tu historia</li>
              <li>· Plan de publicación</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-sm">
          <CTAButton full onClick={() => start('home_secondary')}>
            QUIERO VER MI HISTORIA AHORA
          </CTAButton>
        </div>
      </section>
    </div>
  )
}
