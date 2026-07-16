import { PROMPTS } from '../data/prompts'
import { useMember } from '../context/MemberContext'
import { Accent, Card, Field, ModuleDoneButton, PromptCard } from '../components/ui'
import type { CharacterSheet } from '../lib/storage'

const ELLA_FIELDS: { key: keyof CharacterSheet; label: string }[] = [
  { key: 'desire', label: '¿Qué quiere realmente?' },
  { key: 'fakeDesire', label: '¿Qué finge querer?' },
  { key: 'wound', label: '¿Cuál es su herida?' },
  { key: 'neverWould', label: '¿Qué nunca haría… hasta que lo hace?' },
  { key: 'lies', label: '¿Cómo miente?' },
  { key: 'underestimated', label: '¿Quién la subestima?' },
  { key: 'dangerous', label: '¿Qué la hace peligrosa?' },
]

const EL_FIELDS: { key: keyof CharacterSheet; label: string }[] = [
  { key: 'controls', label: '¿Qué controla?' },
  { key: 'fears', label: '¿Qué teme perder?' },
  { key: 'whyHer', label: '¿Por qué ella y no otra?' },
  { key: 'morality', label: '¿Cuál es su moral torcida?' },
  { key: 'secretAboutHer', label: '¿Qué secreto guarda sobre ella?' },
  { key: 'protects', label: '¿Cómo protege (mal)?' },
  { key: 'humanizes', label: '¿Qué lo humaniza 10 segundos?' },
]

export function PersonajesPage() {
  const { characters, setCharacterField, project } = useMember()
  const prompt = PROMPTS.find((p) => p.id === 'fichas')!

  return (
    <div>
      <Accent>Módulo 6</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Personajes imposibles de olvidar</h1>
      <p className="mt-3 text-ivory-muted">
        Completa las fichas. Se guardan solas.
        {project.female || project.male
          ? ` Ahora: ${project.female || 'ella'} × ${project.male || 'él'}.`
          : ''}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h4 className="font-display text-lg">
            Ella{project.female ? ` — ${project.female}` : ' — 7 preguntas'}
          </h4>
          {ELLA_FIELDS.map((f) => (
            <Field
              key={f.key}
              id={`ella_${f.key}`}
              label={f.label}
              value={characters.ella[f.key] ?? ''}
              textarea
              onChange={(v) => setCharacterField('ella', f.key, v)}
            />
          ))}
        </Card>
        <Card>
          <h4 className="font-display text-lg">
            Él{project.male ? ` — ${project.male}` : ' — 7 preguntas'}
          </h4>
          {EL_FIELDS.map((f) => (
            <Field
              key={f.key}
              id={`el_${f.key}`}
              label={f.label}
              value={characters.el[f.key] ?? ''}
              textarea
              onChange={(v) => setCharacterField('el', f.key, v)}
            />
          ))}
        </Card>
      </div>

      <PromptCard title={prompt.title} body={prompt.body} />
      <ModuleDoneButton moduleId="personajes" />
    </div>
  )
}
