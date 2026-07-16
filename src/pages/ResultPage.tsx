import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoryCover } from '@/components/StoryCover'
import { StoryTags } from '@/components/StoryTags'
import { LockedContent } from '@/components/LockedContent'
import { OfferBox } from '@/components/OfferBox'
import { FAQAccordion } from '@/components/FAQAccordion'
import { CTAButton } from '@/components/CTAButton'
import { clearQuizProgress, loadProject } from '@/lib/storage'
import { goToCheckout, trackEvent } from '@/lib/analytics'
import type { GeneratedProject } from '@/types/quiz'
import { APP_CONFIG } from '@/config'

export function ResultPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = loadProject()
    if (!saved) {
      navigate('/quiz', { replace: true })
      return
    }
    setProject(saved)
    trackEvent('ResultViewed', { title: saved.title })
  }, [navigate])

  if (!project) {
    return (
      <div className="px-5 py-16 text-center text-ivory-muted">Cargando tu proyecto…</div>
    )
  }

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
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const redo = () => {
    clearQuizProgress()
    navigate('/quiz')
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">Resultado</p>
      <h1 className="font-display mt-2 text-4xl text-ivory md:text-5xl">Tu historia oculta ha sido revelada</h1>
      <p className="mt-3 text-lg text-ivory-muted">
        Basado en tus elecciones, este es el proyecto que podrías comenzar a desarrollar.
      </p>

      <div className="mt-8">
        <StoryCover title={project.title} penName={project.penName} tags={project.tags} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Tus elementos</h2>
        <div className="mt-4">
          <StoryTags tags={project.tags} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Premisa</h2>
        <p className="mt-3 leading-relaxed text-ivory-muted">{project.premise}</p>
      </section>

      <section className="mt-10 rounded-[2px] border border-white/10 bg-elevated p-5">
        <h2 className="font-display text-2xl text-ivory">Gancho inicial</h2>
        <pre className="font-display mt-4 whitespace-pre-wrap text-xl leading-relaxed text-ivory italic">
          {project.hook}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Promesa emocional</h2>
        <p className="font-display mt-3 text-2xl text-gold-soft italic">{project.emotionalPromise}</p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          ['Protagonista femenina', project.femaleSummary],
          ['Interés amoroso', project.maleSummary],
          ['Conflicto entre ellos', project.conflictSummary],
          ['Secreto que los conecta', project.secretSummary],
        ].map(([label, body]) => (
          <article key={label} className="border border-white/10 bg-elevated/80 p-4">
            <h3 className="font-accent text-[0.65rem] tracking-[0.16em] text-gold uppercase">{label}</h3>
            <p className="mt-2 text-ivory-muted">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Dirección visual</h2>
        <ul className="mt-3 space-y-2 text-ivory-muted" role="list">
          <li><strong className="text-ivory">Colores:</strong> {project.visual.colors.join(' · ')}</li>
          <li><strong className="text-ivory">Símbolos:</strong> {project.visual.symbols.join(' · ')}</li>
          <li><strong className="text-ivory">Ambiente:</strong> {project.visual.setting}</li>
          <li><strong className="text-ivory">Estilo de capa:</strong> {project.visual.coverStyle}</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ivory">Potencial de serie</h2>
        <p className="mt-3 text-ivory-muted">{project.seriesPotential}</p>
      </section>

      <section className="mt-10 border border-gold/25 bg-wine/15 p-5">
        <p className="font-display text-2xl text-ivory">Esto es solo el comienzo.</p>
        <p className="mt-3 text-ivory-muted">
          La idea existe. Ahora necesita personajes profundos, capítulos, escenas, tensión, identidad, publicación y una estrategia para llegar a lectoras.
        </p>
      </section>

      <div className="mt-8">
        <LockedContent
          title="Tu proyecto completo todavía está bloqueado"
          previews={project.lockedChapters.slice(0, 5)}
          items={[
            'Perfil completo de los protagonistas',
            'Secretos y heridas emocionales',
            'Estructura de hasta 25 capítulos',
            'Evolución del romance',
            'Escenas de tensión',
            'Conflicto secundario',
            'Clímax y final',
            'Prompts para escribir cada etapa',
            'Sinopsis comercial',
            'Descripción de venta',
            'Seudónimo e identidad visual',
            'Guía de publicación',
            'Modelos de anuncios',
            'Plan de ejecución',
          ]}
        />
      </div>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout('result_unlock')}>
          Desbloquear mi proyecto
        </CTAButton>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <CTAButton variant="secondary" className="flex-1" onClick={copyResult}>
          {copied ? 'Copiado' : 'Copiar mi resultado'}
        </CTAButton>
        <CTAButton variant="ghost" className="flex-1" onClick={redo}>
          Rehacer el test
        </CTAButton>
      </div>

      {/* OFERTA PERSONALIZADA */}
      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="font-display text-4xl text-ivory">
          Tu historia ya comenzó. Ahora descubre cómo convertirla en un proyecto real.
        </h2>
        <p className="mt-4 text-lg text-ivory-muted">
          Autora Oculta te entrega el método, las estructuras y los prompts necesarios para desarrollar tu historia usando ChatGPT, Claude, Gemini o la herramienta de inteligencia artificial que prefieras.
        </p>
        <p className="mt-4 rounded-[2px] border border-gold/25 bg-elevated p-4 text-ivory-muted">
          Autora Oculta no entrega una novela terminada automáticamente. Recibirás un sistema guiado para desarrollar, escribir, revisar, publicar y presentar tu proyecto.
        </p>

        <h3 className="font-display mt-10 text-2xl text-ivory">Qué recibirás</h3>
        <ul className="mt-4 grid gap-2 text-ivory-muted md:grid-cols-2" role="list">
          {[
            'Método Autora Oculta',
            'Mapa del Mercado Oscuro',
            'Creador de Universo',
            'Estructura de Historia Magnética',
            'Personajes Imposibles de Olvidar',
            'Prompts para desarrollar capítulos',
            'Modelo de hasta 25 capítulos',
            'Creador de seudónimo',
            'Modelo de sinopsis',
            'Modelo de descripción comercial',
            'Guía de publicación',
            'Guía de venta directa',
            'Modelos de anuncios narrativos',
            'Proyecto completo de ejemplo',
            'Plan práctico de 7 días',
          ].map((item) => (
            <li key={item} className="border border-white/10 bg-elevated/60 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>

        <h3 className="font-display mt-10 text-2xl text-ivory">Cómo funciona</h3>
        <ol className="mt-4 space-y-3 text-ivory-muted">
          <li>1. Recibes tu proyecto inicial.</li>
          <li>2. Utilizas las estructuras y prompts.</li>
          <li>3. Desarrollas la historia en tu herramienta de IA favorita.</li>
          <li>4. Preparas la publicación y la presentación comercial.</li>
        </ol>

        <h3 className="font-display mt-10 text-2xl text-ivory">No necesitas ser escritora profesional</h3>
        <p className="mt-3 text-ivory-muted">
          No comenzarás frente a una página vacía. Tendrás una ruta, preguntas, modelos y comandos para desarrollar cada parte de la historia.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {['Sin experiencia', 'Sin mostrar tu rostro', 'Sin crear contenido diario', 'Sin atender clientes', 'Sin comenzar desde cero'].map((t) => (
            <div key={t} className="border border-gold/20 bg-wine/10 px-3 py-3 text-ivory">
              {t}
            </div>
          ))}
        </div>

        <h3 className="font-display mt-10 text-2xl text-ivory">Una historia. Diferentes formas de publicarla.</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ['Venta directa', 'Ofrece tu historia como producto digital usando una página y un checkout.'],
            ['Marketplaces', 'Publica en plataformas donde las lectoras ya buscan historias.'],
            ['Series', 'Convierte el universo en nuevos libros y personajes.'],
            ['Contenido exclusivo', 'Ofrece capítulos anticipados, escenas extra o historias adicionales.'],
          ].map(([t, d]) => (
            <article key={t} className="border border-white/10 bg-elevated p-4">
              <h4 className="font-display text-xl text-ivory">{t}</h4>
              <p className="mt-2 text-sm text-ivory-muted">{d}</p>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <OfferBox />
        </div>

        <section className="mt-12">
          <h3 className="font-display text-2xl text-ivory">Prueba Autora Oculta durante 7 días</h3>
          <p className="mt-3 text-ivory-muted">
            Explora el método, revisa las estructuras y comprueba si este sistema tiene sentido para tu proyecto. Si dentro del plazo informado decides que no es para ti, podrás solicitar el reembolso conforme a las condiciones de la plataforma de pago.
          </p>
        </section>

        <section className="mt-12">
          <h3 className="font-display mb-4 text-2xl text-ivory">Preguntas frecuentes</h3>
          <FAQAccordion />
        </section>

        <section className="mt-14 text-center">
          <h3 className="font-display text-3xl text-ivory md:text-4xl">
            Tu identidad puede permanecer oculta.
            <br />
            Tu historia no tiene que quedarse guardada.
          </h3>
          <div className="mx-auto mt-6 max-w-md">
            <CTAButton full onClick={() => goToCheckout('final')}>
              Quiero convertir mi idea en una historia
            </CTAButton>
          </div>
          <p className="mt-3 text-ivory-muted">
            Acceso inmediato por <strong className="text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</strong>
          </p>
          <p className="mt-6 text-sm">
            <Link to="/" className="text-ivory-faint hover:text-gold-soft">
              Volver al inicio
            </Link>
          </p>
        </section>
      </section>
    </div>
  )
}
