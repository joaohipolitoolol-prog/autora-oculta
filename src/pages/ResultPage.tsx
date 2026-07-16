import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoryCover } from '@/components/StoryCover'
import { LockedContent } from '@/components/LockedContent'
import { MethodPreview } from '@/components/MethodPreview'
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
    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const threshold = Math.max(900, scrollable * 0.55)
      setShowSticky(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
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
      {/* 1. Capa / título / revelado */}
      <p className="font-accent text-[0.72rem] tracking-[0.18em] text-gold uppercase">
        Tu concepto está listo
      </p>
      <h1 className="font-display mt-2 text-3xl leading-tight text-ivory md:text-4xl">
        {creator
          ? `${creator}, tu historia ya tiene una base`
          : 'Tu historia ya tiene una base'}
      </h1>
      <p className="mt-3 text-lg text-ivory-muted">
        Esto es tu proyecto inicial — no una novela terminada.
      </p>

      <div className="mt-8">
        <StoryCover
          title={project.title}
          penName={project.penName}
          tags={project.tags}
          impactLine={impactLine}
        />
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl text-ivory">Premisa</h2>
        <p className="mt-3 text-lg leading-relaxed text-ivory-muted">{project.premise}</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
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
      </section>

      <section className="mt-8 rounded-[2px] border border-white/10 bg-elevated p-5">
        <h2 className="font-display text-2xl text-ivory">Gancho</h2>
        <pre className="font-display mt-3 whitespace-pre-wrap text-xl leading-relaxed text-ivory italic md:text-2xl">
          {project.hook}
        </pre>
      </section>

      {/* 2. O que está bloqueado (prévias sexy) */}
      <div className="mt-10">
        <LockedContent
          openChapters={openChapters}
          femaleName={project.femaleName}
          maleName={project.maleName}
          ctaId="locked_structure"
        />
      </div>

      {/* 3. Prompts tangíveis (compacto) */}
      <div className="mt-8">
        <MethodPreview project={project} />
      </div>

      {/* 4. Preço / oferta */}
      <div className="mt-10">
        <OfferBox
          anchor
          ctaId="offer_early"
          ctaLabel={UNLOCK_CTA}
          storyTitle={project.title}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        <button
          type="button"
          onClick={copyResult}
          className="text-ivory-faint hover:text-gold-soft"
        >
          {copied ? 'Copiado' : 'Copiar mi resultado'}
        </button>
        <button
          type="button"
          onClick={() => {
            trackEvent('QuizRestarted', { source: 'result' })
            redo()
          }}
          className="text-ivory-faint hover:text-gold-soft"
        >
          Rehacer el test
        </button>
      </div>

      {/* 5. FAQ */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="font-display mb-4 text-3xl text-ivory">Preguntas frecuentes</h2>
        <FAQAccordion />
      </section>

      {/* 6. CTA final */}
      <div className="mt-12">
        <OfferBox
          title="Tu historia ya tiene una base. Ahora necesitas el método para desarrollarla."
          subtitle="Desbloquea la estructura, los personajes, los prompts y el plan para convertir este concepto en una historia que puedas desarrollar, publicar y presentar."
          ctaId="offer_final"
          ctaLabel={UNLOCK_CTA}
          storyTitle={project.title}
        />
      </div>

      <p className="mt-8 text-center text-base">
        <Link to="/" className="text-ivory-faint hover:text-gold-soft">
          Volver al inicio
        </Link>
      </p>

      <StickyUnlockBar visible={showSticky} />
    </div>
  )
}
