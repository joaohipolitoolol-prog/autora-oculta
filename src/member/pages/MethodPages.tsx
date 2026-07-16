import { Link } from 'react-router-dom'
import { Accent, Card, Field, ModuleDoneButton, Notice, PromptCard } from '../components/ui'
import { useMember } from '../context/MemberContext'
import { PROMPTS } from '../data/prompts'

export function MethodPage() {
  const layers = [
    {
      t: '1. Identidad oculta',
      d: 'Seudónimo, tono de autora, límites de contenido, promesa emocional que le haces a la lectora.',
    },
    {
      t: '2. Universo + conflicto',
      d: 'Escenario, poder, secreto, deuda o contrato. Sin conflicto no hay dark romance: hay decorado.',
    },
    {
      t: '3. Personajes imposibles',
      d: 'Ella quiere algo. Él controla algo. Ambos mienten. La atracción nace del roce entre deseo y peligro.',
    },
    {
      t: '4. Estructura magnética',
      d: '25 capítulos (o menos). Cada uno termina con una pregunta, una revelación o un roce que obliga a seguir.',
    },
    {
      t: '5. Producto vendible',
      d: 'Sinopsis, descripción, portada simple, página de venta o marketplace. La historia se convierte en oferta.',
    },
  ]

  return (
    <div>
      <Accent>Módulo 2</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">El Método Autora Oculta</h1>
      <p className="mt-3 text-ivory-muted">
        Un sistema en 5 capas. No empieces escribiendo el capítulo 25. Avanza capa por capa.
      </p>
      {layers.map((l) => (
        <Card key={l.t}>
          <h3 className="font-display text-xl">{l.t}</h3>
          <p className="mt-2 text-sm text-ivory-muted">{l.d}</p>
        </Card>
      ))}
      <Notice>
        Regla de oro: <strong className="text-ivory">un prompt = una escena o un bloque</strong>. No
        pidas “escribe el libro entero” a la IA.
      </Notice>
      <ModuleDoneButton moduleId="metodo" />
    </div>
  )
}

export function MercadoPage() {
  const rows = [
    ['Protección peligrosa', 'Él es amenaza para el mundo y refugio para ella'],
    ['Secreto', 'Deuda, contrato, desaparición, herencia'],
    ['Poder desigual', 'Jefe, heredero, mafia, rival familiar'],
    ['Identidad oculta', 'Máscaras, seudónimos, mentiras piadosas'],
    ['Serie', 'Familia, clan, ciudad, imperio'],
  ]

  return (
    <div>
      <Accent>Módulo 3</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Mapa del Mercado Oscuro</h1>
      <p className="mt-3 text-ivory-muted">
        La lectora de dark romance compra atmósfera, poder, obsesión y resolución emocional — no
        “literatura perfecta”.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-white/10 px-3 py-2 text-left font-medium text-gold-soft">
                Deseo
              </th>
              <th className="border border-white/10 px-3 py-2 text-left font-medium text-gold-soft">
                Cómo aparece en tu historia
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([a, b]) => (
              <tr key={a}>
                <td className="border border-white/10 px-3 py-2 align-top">{a}</td>
                <td className="border border-white/10 px-3 py-2 align-top text-ivory-muted">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="mt-4">
        <h3 className="font-display text-lg">Formatos que venden</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ivory-muted">
          <li>Novela corta / novela digital (más rápido de terminar)</li>
          <li>Serie de 3 libros conectados</li>
          <li>Capítulos anticipados / escenas extra (contenido exclusivo)</li>
        </ul>
      </Card>
      <ModuleDoneButton moduleId="mercado" />
    </div>
  )
}

export function UniversoPage() {
  const { universe, setUniverseField } = useMember()
  const prompt = PROMPTS.find((p) => p.id === 'universo-expandir')!

  const fields: { key: keyof typeof universe; label: string; ph: string }[] = [
    { key: 'where', label: '¿Dónde ocurre? (lugar + sensación)', ph: 'Mansión costera, niebla, silencio' },
    { key: 'power', label: '¿Quién tiene el poder aquí?', ph: 'El heredero / el consejo / la deuda' },
    { key: 'rule', label: '¿Qué regla no se puede romper?', ph: 'Nadie entra al ala oeste' },
    { key: 'forbidden', label: '¿Qué objeto / documento / lugar está prohibido?', ph: 'El contrato original' },
    { key: 'leak', label: '¿Qué pasaría si el secreto se filtrara mañana?', ph: 'Caería el imperio familiar' },
  ]

  return (
    <div>
      <Accent>Módulo 4</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Creador de Universo</h1>
      <p className="mt-3 text-ivory-muted">
        Completa esto antes de escribir capítulos largos. Se guarda automáticamente.
      </p>
      <Card>
        <h4 className="font-display text-lg">Plantilla rápida</h4>
        {fields.map((f) => (
          <Field
            key={f.key}
            id={`u_${f.key}`}
            label={f.label}
            value={universe[f.key]}
            placeholder={f.ph}
            textarea={f.key === 'leak'}
            onChange={(v) => setUniverseField(f.key, v)}
          />
        ))}
      </Card>
      <PromptCard title={prompt.title} body={prompt.body} />
      <ModuleDoneButton moduleId="universo" />
    </div>
  )
}

export function IdentidadPage() {
  const prompt = PROMPTS.find((p) => p.id === 'seudonimos')!
  return (
    <div>
      <Accent>Módulo 8</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Seudónimo e identidad visual</h1>
      <p className="mt-3 text-ivory-muted">
        Tu seudónimo sugerido del test es un punto de partida. Puedes refinarlo.
      </p>
      <Card>
        <h4 className="font-display text-lg">Fórmula rápida</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ivory-muted">
          <li>Nombre elegante + apellido corto (Valentina Noir)</li>
          <li>Nombre simple + palabra oscura (Clara Voss)</li>
          <li>Solo apellido de autora (Montenegro)</li>
        </ul>
        <p className="mt-3 text-xs text-ivory-faint">
          Evita tu nombre real, fechas de nacimiento y datos fáciles de rastrear.
        </p>
      </Card>
      <PromptCard title={prompt.title} body={prompt.body} />
      <Card>
        <h4 className="font-display text-lg">Dirección visual de portada</h4>
        <p className="mt-2 text-sm text-ivory-muted">
          Negro, vino, dorado envejecido, tipografía serif. Un solo símbolo fuerte (llave, máscara,
          anillo, contrato). Nada de collage saturado.
        </p>
      </Card>
      <ModuleDoneButton moduleId="identidad" />
    </div>
  )
}

export function VentaPage() {
  const sinopsis = PROMPTS.find((p) => p.id === 'sinopsis')!
  const desc = PROMPTS.find((p) => p.id === 'descripcion')!
  return (
    <div>
      <Accent>Módulo 9</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Sinopsis y descripción comercial</h1>
      <Card>
        <h4 className="font-display text-lg">Plantilla de sinopsis</h4>
        <p className="mt-2 text-sm text-ivory-muted">
          Cuando <em>[ELLA]</em> llega a <em>[LUGAR]</em>, descubre que <em>[EL]</em> ya sabía su
          nombre. Unidos por <em>[CONFLICTO]</em>, deberán elegir entre la verdad y el deseo. Si ella
          revela el secreto, pierde <em>[COSTO]</em>. Si él la protege, pierde <em>[IMPERIO]</em>.
        </p>
      </Card>
      <PromptCard title={sinopsis.title} body={sinopsis.body} />
      <PromptCard title={desc.title} body={desc.body} />
      <ModuleDoneButton moduleId="venta" />
    </div>
  )
}

export function PublicarPage() {
  const { checklist, toggleCheck } = useMember()
  const items = [
    { id: 'pub_archivo', label: 'Archivo del libro (PDF / EPUB)' },
    { id: 'pub_portada', label: 'Portada' },
    { id: 'pub_sinopsis', label: 'Sinopsis' },
    { id: 'pub_precio', label: 'Precio' },
    { id: 'pub_listing', label: 'Página o listing' },
    { id: 'pub_seudonimo', label: 'Seudónimo en todos lados' },
  ]

  return (
    <div>
      <Accent>Módulo 10</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Guía de publicación</h1>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ivory-muted">
        <li>Termina un manuscrito corto (o 3 capítulos + outline vendible).</li>
        <li>Revisa con IA + lectura humana (tú).</li>
        <li>Exporta a PDF / EPUB según el canal.</li>
        <li>Crea portada simple (Canva) con tu dirección visual.</li>
        <li>Elige canal: Hotmart / Gumroad / Payhip o marketplace.</li>
        <li>Publica la oferta con sinopsis + precio + garantía clara.</li>
      </ol>
      <Notice>
        Empieza por <strong className="text-ivory">venta directa</strong> si quieres control de
        precio y lista.
      </Notice>
      <Card>
        <h4 className="font-display text-lg">Checklist mínimo</h4>
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ivory-muted">
                <input
                  type="checkbox"
                  className="size-4 accent-gold"
                  checked={Boolean(checklist[it.id])}
                  onChange={() => toggleCheck(it.id)}
                />
                <span className={checklist[it.id] ? 'text-gold-soft line-through' : ''}>
                  {it.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
      <ModuleDoneButton moduleId="publicar" />
    </div>
  )
}

export function AnunciosPage() {
  const ads = PROMPTS.find((p) => p.id === 'ads')!
  return (
    <div>
      <Accent>Módulo 11</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Modelos de anuncios narrativos</h1>
      <p className="mt-3 text-ivory-muted">
        Para vender tu novela (o el propio método). Tono historia, no “curso milagroso”.
      </p>
      <Card>
        <h4 className="font-display text-lg">Ángulo 1 — Identidad</h4>
        <p className="mt-2 text-sm text-ivory-muted">
          “¿Qué historia escribirías si nadie supiera que fuiste tú?”
        </p>
      </Card>
      <Card>
        <h4 className="font-display text-lg">Ángulo 2 — Resultado del test</h4>
        <p className="mt-2 text-sm text-ivory-muted">
          “En 2 minutos ya tienes título, seudónimo y conflicto. Ahora falta terminarla.”
        </p>
      </Card>
      <Card>
        <h4 className="font-display text-lg">Ángulo 3 — Lectura</h4>
        <p className="mt-2 text-sm text-ivory-muted">
          Gancho de tu novela: la primera frase del capítulo 1 + CTA “Leer más”.
        </p>
      </Card>
      <PromptCard title={ads.title} body={ads.body} />
      <ModuleDoneButton moduleId="anuncios" />
    </div>
  )
}

export function EjemploPage() {
  return (
    <div>
      <Accent>Módulo 12</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Proyecto ejemplo completo</h1>
      <Card gold>
        <p className="font-accent text-[0.65rem] tracking-widest text-gold uppercase">Ejemplo</p>
        <h2 className="font-display mt-2 text-2xl">La Deuda de Ravencroft</h2>
        <p className="text-sm text-ivory-muted">Por Sienna Vale</p>
        <p className="mt-3 flex flex-wrap gap-1">
          {['Matrimonio forzado', 'Heredero frío', 'Secreto familiar'].map((t) => (
            <span
              key={t}
              className="border border-gold/30 px-2 py-0.5 text-xs text-gold-soft"
            >
              {t}
            </span>
          ))}
        </p>
        <p className="mt-4 text-sm text-ivory-muted">
          Cuando Elena firma un contrato para salvar a su hermano, descubre que Adrian Ravencroft no
          compró su silencio: compró su nombre. En la mansión, una habitación cerrada guarda la
          verdad que ambos juraron no abrir.
        </p>
        <p className="mt-3 text-sm text-ivory-muted">
          <strong className="text-ivory">Promesa emocional:</strong> Peligro para todos. Protección
          absoluta para ella.
        </p>
        <p className="mt-2 text-sm text-ivory-muted">
          <strong className="text-ivory">Cap 1:</strong> El contrato ·{' '}
          <strong className="text-ivory">Cap 2:</strong> El hombre que ya firmó por ella ·{' '}
          <strong className="text-ivory">Cap 3:</strong> El ala oeste
        </p>
      </Card>
      <p className="text-sm text-ivory-faint">
        Usa este ejemplo como referencia de densidad. Tu proyecto del test puede ser igual de
        concreto.
      </p>
      <p className="mt-4">
        <Link to="/entregavel/proyecto" className="text-gold-soft no-underline hover:text-ivory">
          Volver a tu proyecto →
        </Link>
      </p>
      <ModuleDoneButton moduleId="ejemplo" />
    </div>
  )
}
