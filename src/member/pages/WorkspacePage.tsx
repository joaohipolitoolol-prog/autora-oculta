import { Accent, Card } from '../components/ui'
import { useMember } from '../context/MemberContext'

export function WorkspacePage() {
  const { notes, setNotes, project } = useMember()

  return (
    <div>
      <Accent>Cuaderno</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Tu cuaderno de trabajo</h1>
      <p className="mt-3 text-ivory-muted">
        Escenas sueltas, ideas, continuidad, dudas. Se guarda solo en este dispositivo
        {project.title ? ` · «${project.title}»` : ''}.
      </p>
      <Card>
        <textarea
          className="min-h-[55vh] w-full resize-y border-0 bg-transparent text-base leading-relaxed text-ivory outline-none placeholder:text-ivory-faint"
          placeholder="Escribe aquí… ideas de escena, nombres secundarios, lo que la IA no debe olvidar…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <p className="mt-2 text-xs text-ivory-faint">
          {notes.length} caracteres · guardado automático
        </p>
      </Card>
    </div>
  )
}
