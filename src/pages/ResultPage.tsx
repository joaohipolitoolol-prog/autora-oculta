import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoryCover } from '@/components/StoryCover'
import { LockedContent } from '@/components/LockedContent'
import { OfferBox } from '@/components/OfferBox'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTAButton } from '@/components/CTAButton'
import { StickyUnlockBar } from '@/components/StickyUnlockBar'
import { clearQuizProgress, loadProject } from '@/lib/storage'
import { goToCheckout, trackEvent } from '@/lib/analytics'
import type { GeneratedProject } from '@/types/quiz'
import { APP_CONFIG } from '@/config'

const UNLOCK_CTA = `Desbloquear mi proyecto por ${APP_CONFIG.PRICE_CURRENT}`

export function ResultPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [copied, setCopied] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const viewedRef = useRef(false)

  useEffect(() => {
    const saved = loadProject()
    if (!saved) {
      navigate('/quiz', { replace: true })
      return
    }
    setProject(saved)
    if (!viewedRef.current) {
      viewedRef.current = true
      trackEvent('ResultViewed', { title: saved.title })
      trackEvent('ViewContent', { content_ids: ['autora-oculta'], title: saved.title })
    }
  }, [navigate])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 380)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!project) {
    return (
      <div className="px-5 py-16 text-center text-ivory-muted">Cargando tu proyecto…</div>
    )
  }

  const creator = project.answers.creatorName?.trim()
  const impactLine = project.hook.split('\n\n')[0]?.trim() || project.emotionalPromise
  const openChapters = (Array.isArray(project.lockedChapters) ? project.lockedChapters : [])
    .map((ch) =>
      typeof ch === 'string'
        ? { title: ch, teaser: 'Una escena clave del conflicto central.' }
        : ch,
    )
    .slice(0, 3)

  const copyResult = async () => {
    const text = [
      `Título: ${project.title}`,
      `Autora sugerida: ${project.penName}`,
      `Premisa: ${project.premise}`,
      `Promesa emocional: ${project.emotionalPromise}`,
      '',
      'Generado con Autora Oculta',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      trackEvent('ResultCopied', {})
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const redo = () => {
    clearQuizProgress()
    navigate('/quiz?nuevo=1')
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 pb-28 md:pb-12">
      {/* BLOCO 1 — Resultado / momento uau */}
      <p className="font-accent text-[0.72rem] tracking-[0.18em] text-gold uppercase">
        Tu concepto está listo
      </p>
      <h1 className="font-display mt-2 text-3xl leading-tight text-ivory md:text-4xl">
        {creator
          ? `${creator}, tu idea ya tiene nombre, conflicto y universo`
          : 'Tu idea ya tiene nombre, conflicto y universo'}
      </h1>
      <p className="mt-3 text-lg text-ivory-muted">
        Esto no es una novela terminada. Es el proyecto inicial que puedes desarrollar.
      </p>

      <div className="mt-8">
        <StoryCover
          title={project.title}
          penName={project.penName}
          tags={project.tags}
          impactLine={impactLine}
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory md:text-3xl">Premisa</h2>
        <p className="mt-4 text-lg leading-relaxed text-ivory-muted">{project.premise}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory md:text-3xl">Personajes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ['Protagonista', project.femaleSummary],
            ['Interés amoroso', project.maleSummary],
            ['Conflicto', project.conflictSummary],
            ['Secreto', project.secretSummary],
          ].map(([label, body]) => (
            <article key={label} className="border border-white/10 bg-elevated/80 p-4">
              <h3 className="font-accent text-[0.7rem] tracking-[0.16em] text-gold uppercase">
                {label}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ivory-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2px] border border-white/10 bg-elevated p-5">
        <h2 className="font-display text-2xl text-ivory">Gancho (escena de apertura)</h2>
        <pre className="font-display mt-4 whitespace-pre-wrap text-xl leading-relaxed text-ivory italic md:text-2xl">
          {project.hook}
        </pre>
      </section>

      {/* Expectativa clara ANTES do primeiro botão pago */}
      <aside className="mt-8 rounded-[2px] border border-gold/30 bg-wine/15 p-5 text-left">
        <p className="font-display text-2xl text-ivory">
          Tu historia no está terminada. Está lista para ser desarrollada.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ivory-muted">
          Autora Oculta no genera una novela completa automáticamente. Al desbloquear, recibirás la
          estructura, los personajes, los prompts y el método para convertir este concepto en una
          historia real — y tu proyecto del test queda guardado como punto de partida.
        </p>
      </aside>

      {/* BLOCO 2 — Conteúdo bloqueado (documento) */}
      <div className="mt-8">
        <LockedContent openChapters={openChapters} ctaId="locked_structure" />
      </div>

      {/* BLOCO 3 — Oferta cedo */}
      <div className="mt-10">
        <OfferBox anchor ctaId="offer_early" ctaLabel={UNLOCK_CTA} />
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
        <CTAButton variant="secondary" className="flex-1" onClick={copyResult}>
          {copied ? 'Copiado' : 'Copiar mi resultado'}
        </CTAButton>
        <CTAButton
          variant="ghost"
          className="flex-1"
          onClick={() => {
            trackEvent('QuizRestarted', { source: 'result' })
            redo()
          }}
        >
          Rehacer el test
        </CTAButton>
      </div>

      {/* BLOCO 4 — Cómo funciona */}
      <section className="mt-14 border-t border-white/10 pt-12">
        <h2 className="font-display text-3xl text-ivory md:text-4xl">Cómo funciona</h2>
        <ol className="mt-5 space-y-3 text-lg text-ivory-muted">
          <li>1. Entras con tu proyecto inicial (el del test).</li>
          <li>2. Usas las estructuras y prompts del método.</li>
          <li>3. Desarrollas la historia en ChatGPT, Claude, Gemini u otra IA.</li>
          <li>4. Preparas publicación y presentación comercial.</li>
        </ol>
      </section>

      {/* BLOCO 5 — Qué recibes */}
      <section className="mt-12">
        <h2 className="font-display text-3xl text-ivory md:text-4xl">Qué recibirás</h2>
        <ul className="mt-5 grid gap-2 text-base text-ivory-muted md:grid-cols-2" role="list">
          {[
            'Tu proyecto inicial del quiz guardado',
            'Método Autora Oculta',
            'Estructura de hasta 25 capítulos',
            'Perfiles y secretos de personajes',
            'Prompts para cada etapa',
            'Sinopsis y descripción de venta',
            'Guía de publicación',
            'Plan práctico de 7 días',
          ].map((item) => (
            <li key={item} className="border border-white/10 bg-elevated/60 px-3 py-2.5">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {[
            'Sin experiencia previa',
            'Sin mostrar tu rostro',
            'Sin empezar en página en blanco',
            'Sin novela automática falsa',
          ].map((t) => (
            <div key={t} className="border border-gold/20 bg-wine/10 px-3 py-3 text-base text-ivory">
              {t}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ivory md:text-3xl">
          Prueba Autora Oculta durante 7 días
        </h2>
        <p className="mt-3 text-lg text-ivory-muted">
          Explora el método y comprueba si tiene sentido para tu proyecto. Si decides que no es para
          ti, puedes solicitar el reembolso según las condiciones del checkout.
        </p>
      </section>

      {/* BLOCO 6 — FAQ */}
      <section className="mt-12">
        <h2 className="font-display mb-4 text-3xl text-ivory">Preguntas frecuentes</h2>
        <FAQAccordion />
      </section>

      {/* BLOCO 7 — Oferta repetida */}
      <div className="mt-12">
        <OfferBox
          title="Desbloquea el método para desarrollar esta historia"
          subtitle="Recibe la estructura, los personajes, los prompts y el paso a paso para transformar este concepto en un libro digital."
          ctaId="offer_final"
          ctaLabel={UNLOCK_CTA}
        />
      </div>

      <section className="mt-14 text-center">
        <h3 className="font-display text-3xl text-ivory md:text-4xl">
          Tu identidad puede permanecer oculta.
          <br />
          Tu idea no tiene que quedarse guardada.
        </h3>
        <div className="mx-auto mt-6 max-w-md">
          <CTAButton full onClick={() => goToCheckout('final')}>
            {UNLOCK_CTA}
          </CTAButton>
        </div>
        <p className="mt-6 text-base">
          <Link to="/" className="text-ivory-faint hover:text-gold-soft">
            Volver al inicio
          </Link>
        </p>
      </section>

      <StickyUnlockBar visible={showSticky} />
    </div>
  )
}
