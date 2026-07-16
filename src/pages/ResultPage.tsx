import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoryCover } from '@/components/StoryCover'
import { LockedContent } from '@/components/LockedContent'
import { OfferBox } from '@/components/OfferBox'
import { FAQAccordion } from '@/components/FAQAccordion'
import { StickyUnlockBar } from '@/components/StickyUnlockBar'
import { clearQuizProgress, loadProject } from '@/lib/storage'
import { trackEvent } from '@/lib/analytics'
import { downloadShareCover, shareWhatsAppCoverText } from '@/lib/shareCover'
import type { GeneratedProject } from '@/types/quiz'
import { APP_CONFIG } from '@/config'

const UNLOCK_CTA = `DESBLOQUEAR MI PROYECTO POR ${APP_CONFIG.PRICE_CURRENT}`

export function ResultPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
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
      // Sticky after paywall / early offer area
      setShowSticky(window.scrollY > 700)
    }
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

  const copyShareText = async () => {
    const text = [
      `«${project.title}»`,
      `Por ${project.penName}`,
      impactLine ? `"${impactLine}"` : '',
      '',
      'Descubre qué dark romance escribirías si nadie supiera que fuiste tú:',
      'https://autora-oculta.vercel.app/',
    ]
      .filter(Boolean)
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      trackEvent('ResultCopied', { mode: 'share_cover' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const downloadCover = async () => {
    setDownloading(true)
    try {
      const ok = await downloadShareCover({
        title: project.title,
        penName: project.penName,
        impactLine,
      })
      if (ok) trackEvent('CoverDownloaded', {})
    } finally {
      setDownloading(false)
    }
  }

  const redo = () => {
    clearQuizProgress()
    navigate('/quiz?nuevo=1')
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 pb-28 md:pb-12">
      {/* Expectation correction */}
      <p className="font-accent text-[0.72rem] tracking-[0.18em] text-gold uppercase">
        Tu proyecto está listo para ser desarrollado
      </p>
      <h1 className="font-display mt-2 text-3xl leading-tight text-ivory md:text-4xl">
        {creator
          ? `${creator}, este es el concepto de tu historia`
          : 'Este es el concepto de tu historia'}
      </h1>
      <p className="mt-3 text-lg text-ivory-muted">
        Título, seudónimo, premisa y gancho — la base para desarrollar. No es una novela completa.
      </p>

      <div className="mt-8">
        <StoryCover
          title={project.title}
          penName={project.penName}
          tags={project.tags}
          impactLine={impactLine}
        />
      </div>

      {/* Shareable cover — distribution */}
      <section className="mt-5 border border-white/10 bg-elevated/60 p-4">
        <p className="text-center text-sm text-ivory-muted">
          Comparte solo la portada de tu historia, sin revelar tus respuestas.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={copyShareText}
            className="min-h-11 border border-white/15 px-4 text-sm text-ivory hover:border-gold/40"
          >
            {copied ? 'Copiado' : 'Copiar resultado'}
          </button>
          <button
            type="button"
            onClick={downloadCover}
            disabled={downloading}
            className="min-h-11 border border-white/15 px-4 text-sm text-ivory hover:border-gold/40 disabled:opacity-60"
          >
            {downloading ? 'Generando…' : 'Descargar portada'}
          </button>
          <button
            type="button"
            onClick={() => {
              trackEvent('ResultSharedWhatsApp', {})
              shareWhatsAppCoverText({
                title: project.title,
                penName: project.penName,
                impactLine,
              })
            }}
            className="min-h-11 border border-gold/35 bg-wine/20 px-4 text-sm text-ivory hover:border-gold/55"
          >
            Compartir en WhatsApp
          </button>
        </div>
      </section>

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

      {/* Paywall early — 3 chapters then price */}
      <div className="mt-10">
        <LockedContent
          openChapters={openChapters}
          femaleName={project.femaleName}
          maleName={project.maleName}
          ctaId="locked_structure"
        />
      </div>

      {/* Price immediately after locked preview */}
      <div className="mt-8">
        <OfferBox
          anchor
          compact
          ctaId="offer_early"
          ctaLabel={UNLOCK_CTA}
          storyTitle={project.title}
          title={`Desbloquea tu proyecto por ${APP_CONFIG.PRICE_CURRENT}`}
          subtitle="Un solo pago. Acceso inmediato. Garantía de 7 días. Estructura de hasta 25 capítulos, más de 40 prompts y plan de 7 días."
        />
      </div>

      {/* Method 4 steps — short */}
      <section className="mt-12 border-t border-white/10 pt-10">
        <p className="font-accent text-center text-[0.68rem] tracking-[0.18em] text-gold uppercase">
          Método Autora Oculta
        </p>
        <h2 className="font-display mt-2 text-center text-3xl text-ivory">
          Descubrir → Estructurar → Desarrollar → Publicar
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-base text-ivory-muted">
          Empiezas con esta combinación personalizada. Luego usas estructuras y prompts para
          transformarla en una historia publicable — bajo seudónimo.
        </p>
        <ul className="mx-auto mt-6 max-w-md space-y-2 text-base text-ivory-muted" role="list">
          <li>· 8 preguntas · menos de 2 minutos</li>
          <li>· Estructura de hasta 25 capítulos</li>
          <li>· Más de 40 prompts organizados</li>
          <li>· Plan de ejecución en 7 días</li>
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
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
      <p className="mt-3 text-center text-xs text-ivory-faint">
        Tras la compra, abre tu área del método. Si usas el mismo navegador, importamos este proyecto
        automáticamente.
      </p>

      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="font-display mb-4 text-3xl text-ivory">Preguntas frecuentes</h2>
        <FAQAccordion />
      </section>

      <div className="mt-12">
        <OfferBox
          title="Tu proyecto está listo para ser desarrollado."
          subtitle="Desbloquea el método: estructura, prompts y plan de publicación. Tu identidad puede permanecer oculta. Tu historia no necesita quedarse guardada."
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
