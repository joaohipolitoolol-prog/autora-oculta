import { useNavigate } from 'react-router-dom'
import { CTAButton } from '@/components/CTAButton'
import { trackEvent } from '@/lib/analytics'

export function HomePage() {
  const navigate = useNavigate()

  const start = (source: string) => {
    trackEvent('QuizStarted', { source })
    navigate('/quiz')
  }

  return (
    <div>
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <p className="font-display text-4xl text-ivory md:text-5xl">Autora Oculta</p>
          <p className="font-accent mt-4 inline-block border border-gold/35 px-3 py-1.5 text-[0.62rem] tracking-[0.16em] text-gold uppercase">
            Descubre la historia que podrías crear
          </p>
          <h1 className="font-display mt-5 text-4xl leading-[1.1] text-balance text-ivory md:text-5xl">
            ¿Qué historia escribirías si nadie supiera que fuiste tú?
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory-muted">
            Responde algunas preguntas y descubre el concepto de tu primer dark romance, junto con un título, personajes, conflicto y una identidad secreta.
          </p>
          <ul className="mt-5 space-y-2 text-ivory-muted" role="list">
            <li>· No necesitas saber escribir.</li>
            <li>· No necesitas mostrar tu rostro.</li>
            <li>· Resultado personalizado.</li>
          </ul>
          <div className="mt-7 space-y-3">
            <CTAButton full onClick={() => start('home')}>
              Descubrir mi historia
            </CTAButton>
            <p className="text-sm text-ivory-faint">Toma menos de 2 minutos.</p>
          </div>
        </div>

        <figure className="overflow-hidden rounded-[2px] border border-white/10">
          <img
            src="/hero-autora-oculta.webp"
            alt="Escritorio oscuro con máscara, cuaderno y laptop: identidad secreta de una autora"
            className="h-64 w-full object-cover object-[70%_45%] md:h-[420px]"
            width={1536}
            height={1024}
          />
        </figure>
      </section>

      <section className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-ivory-muted">
            Miles de lectoras buscan historias sobre poder, peligro, obsesión, secretos y romances prohibidos.
          </p>
          <p className="font-display mt-4 text-3xl text-ivory">¿Qué historia podrías crear tú?</p>
          <div className="mx-auto mt-6 max-w-sm">
            <CTAButton full variant="secondary" onClick={() => start('home_secondary')}>
              Comenzar el test
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}
