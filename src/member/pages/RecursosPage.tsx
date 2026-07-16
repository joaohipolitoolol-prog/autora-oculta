import { Link } from 'react-router-dom'
import { Accent, Card, PromptCard } from '../components/ui'
import { PLAN_7 } from '../data/plan7'

export function RecursosPage() {
  return (
    <div>
      <Accent>Recursos</Accent>
      <h1 className="font-display mt-2 text-3xl">Recursos del método</h1>
      <p className="mt-2 text-ivory-muted">
        Atajos prácticos. El contenido profundo vive en cada módulo.
      </p>

      <Card gold>
        <h2 className="font-display text-xl">Proyecto ejemplo</h2>
        <p className="mt-1 text-sm text-ivory-muted">La Deuda de Ravencroft · Sienna Vale</p>
        <p className="mt-3 text-sm text-ivory-muted">
          Elena firma un contrato para salvar a su hermano. Adrian no compró su silencio: compró su
          nombre. Una habitación cerrada guarda lo que ambos juraron no abrir.
        </p>
        <Link to="/entregavel/ejemplo" className="mt-3 inline-block text-sm text-gold-soft">
          Ver ejemplo completo →
        </Link>
      </Card>

      <Card>
        <h2 className="font-display text-xl">Plan 7 días</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ivory-muted">
          {PLAN_7.map((d) => (
            <li key={d.day}>
              Día {d.day}: {d.objective}
            </li>
          ))}
        </ol>
        <Link to="/entregavel/progreso" className="mt-3 inline-block text-sm text-gold-soft">
          Abrir progreso →
        </Link>
      </Card>

      <PromptCard
        title="Prompt Maestro del Proyecto"
        body={`Eres editora de dark romance. Trabajarás SOLO con este proyecto. No inventes datos que contradigan lo siguiente.

TÍTULO: {{TITULO}}
SEUDÓNIMO: {{SEUDONIMO}}
ELLA: {{ELLA}}
ÉL: {{EL}}
PREMISA: {{PREMISA}}
CONFLICTO: {{CONFLICTO}}
GANCHO: {{GANCHO}}
PROMESA EMOCIONAL: {{PROMESA}}
TAGS: {{TAGS}}

REGLAS:
1) Un prompt = una escena o bloque.
2) Mantén continuidad y subtexto.
3) Cada escena termina con pregunta, amenaza o roce.
4) No moralices. No resumas lo ya escrito salvo que yo lo pida.
5) Si falta un dato, pregunta antes de inventar.

Confirma que entendiste listando en 5 viñetas el tono, el conflicto y lo que NO debes revelar aún.`}
      />
    </div>
  )
}
