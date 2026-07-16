import { useRef, useState } from 'react'
import { useMember } from '../context/MemberContext'
import { emptyProject, type MemberProject } from '../lib/storage'
import { Accent, Card, Field, ModuleDoneButton, Notice } from '../components/ui'

function parsePastedResult(text: string): Partial<MemberProject> {
  const out: Partial<MemberProject> = {}
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(
      /^\s*(título|titulo|seudónimo|seudonimo|autora sugerida|protagonista|él|el|interés|interes|premisa|gancho|conflicto|etiquetas|tags|promesa emocional|promesa)\s*[:：]\s*(.+)$/i,
    )
    if (!m) continue
    const key = m[1].toLowerCase()
    const val = m[2].trim()
    if (key.includes('títul') || key.includes('titul')) out.title = val
    else if (key.includes('seud') || key.includes('autora')) out.pen = val
    else if (key.includes('protagon')) out.female = val
    else if (key === 'él' || key === 'el' || key.includes('interés') || key.includes('interes'))
      out.male = val
    else if (key.includes('premisa')) out.premise = val
    else if (key.includes('gancho')) out.hook = val
    else if (key.includes('conflict')) out.conflict = val
    else if (key.includes('etiqueta') || key === 'tags') out.tags = val
    else if (key.includes('promesa')) out.promise = val
  }
  if (!out.title) {
    const first = lines.map((l) => l.trim()).find(Boolean)
    if (first && first.length < 80) out.title = first.replace(/^["«]|["»]$/g, '')
  }
  return out
}

export function ProjectPage() {
  const {
    project,
    setProjectField,
    setProject,
    saveProject,
    clearProject,
    saveFlash,
    saving,
    stats,
    quizAvailable,
    importFromQuiz,
    exportBackup,
    importBackup,
  } = useMember()
  const [paste, setPaste] = useState('')
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const flash = saveFlash || importMsg

  return (
    <div>
      <Accent>Módulo 1</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Tu proyecto</h1>
      <p className="mt-3 text-ivory-muted">
        Título, seudónimo y premisa del test viven aquí. Está listo para ser desarrollado — no es la
        novela terminada.
      </p>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-ivory-faint">
        <span>Completado: {stats.projectFill}%</span>
        <span role="status" aria-live="polite">
          {saving ? 'Guardando…' : flash || 'Autoguardado activo'}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-gold/80 transition-all" style={{ width: `${stats.projectFill}%` }} />
      </div>

      {quizAvailable ? (
        <Card gold>
          <h3 className="font-display text-lg">Importar del test</h3>
          <p className="mt-1 text-sm text-ivory-muted">
            Hay un resultado del test en este navegador.
          </p>
          <button
            type="button"
            className="mt-3 min-h-11 border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-4 font-semibold text-ivory"
            onClick={() => {
              importFromQuiz()
              setImportMsg('')
            }}
          >
            Importar en un toque
          </button>
        </Card>
      ) : null}

      <Card>
        <Field
          id="p_title"
          label="Título"
          value={project.title}
          placeholder="Ej. La Heredera de Montenegro"
          onChange={(v) => setProjectField('title', v)}
        />
        <Field
          id="p_pen"
          label="Seudónimo"
          value={project.pen}
          placeholder="Ej. Valentina Noir"
          onChange={(v) => setProjectField('pen', v)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id="p_female"
            label="Protagonista"
            value={project.female}
            placeholder="Nombre femenino"
            onChange={(v) => setProjectField('female', v)}
          />
          <Field
            id="p_male"
            label="Interés amoroso"
            value={project.male}
            placeholder="Nombre masculino"
            onChange={(v) => setProjectField('male', v)}
          />
        </div>
        <Field
          id="p_premise"
          label="Premisa"
          textarea
          value={project.premise}
          placeholder="La premisa del test…"
          onChange={(v) => setProjectField('premise', v)}
        />
        <Field
          id="p_hook"
          label="Gancho / apertura"
          textarea
          value={project.hook}
          placeholder="Las primeras líneas…"
          onChange={(v) => setProjectField('hook', v)}
        />
        <Field
          id="p_conflict"
          label="Conflicto / secreto"
          textarea
          value={project.conflict}
          placeholder="Qué los une y qué ocultan…"
          onChange={(v) => setProjectField('conflict', v)}
        />
        <Field
          id="p_promise"
          label="Promesa emocional"
          textarea
          value={project.promise}
          placeholder="Qué siente la lectora al terminar…"
          onChange={(v) => setProjectField('promise', v)}
        />
        <Field
          id="p_tags"
          label="Etiquetas (separadas por coma)"
          value={project.tags}
          placeholder="Enemies to lovers, mansión, secreto familiar…"
          onChange={(v) => setProjectField('tags', v)}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-12 border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-5 font-semibold text-ivory"
            onClick={saveProject}
          >
            Guardar ahora
          </button>
          <button
            type="button"
            className="min-h-12 border border-white/15 px-5 text-ivory-muted"
            onClick={async () => {
              const blob = [
                `Título: ${project.title}`,
                `Seudónimo: ${project.pen}`,
                `Protagonista: ${project.female}`,
                `Él: ${project.male}`,
                `Premisa: ${project.premise}`,
                `Gancho: ${project.hook}`,
                `Conflicto: ${project.conflict}`,
                `Promesa emocional: ${project.promise}`,
                `Etiquetas: ${project.tags}`,
              ].join('\n')
              try {
                await navigator.clipboard.writeText(blob)
                setImportMsg('Resumen copiado.')
              } catch {
                setImportMsg('No se pudo copiar.')
              }
            }}
          >
            Copiar resumen
          </button>
          <button
            type="button"
            className="min-h-12 border border-white/15 px-5 text-ivory-muted"
            onClick={() => {
              if (confirm('¿Borrar los datos del proyecto en este dispositivo?')) clearProject()
            }}
          >
            Borrar proyecto
          </button>
        </div>
        {project.updatedAt ? (
          <p className="mt-2 text-xs text-ivory-faint">
            Última guardada: {new Date(project.updatedAt).toLocaleString()}
          </p>
        ) : null}
      </Card>

      <Card>
        <h3 className="font-display text-xl">Copia de seguridad</h3>
        <p className="mt-2 text-sm text-ivory-muted">
          Exporta todo (proyecto, capítulos, plan, fichas, notas) para otro teléfono o por si
          borras el navegador.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-11 border border-gold/40 px-4 text-sm text-ivory hover:bg-wine/30"
            onClick={() => {
              const data = exportBackup()
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `autora-oculta-backup-${new Date().toISOString().slice(0, 10)}.json`
              a.click()
              URL.revokeObjectURL(url)
              setImportMsg('Copia descargada.')
            }}
          >
            Descargar copia (.json)
          </button>
          <button
            type="button"
            className="min-h-11 border border-white/15 px-4 text-sm text-ivory-muted"
            onClick={() => fileRef.current?.click()}
          >
            Restaurar copia
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const text = await file.text()
                const result = importBackup(JSON.parse(text))
                setImportMsg(result.message)
              } catch {
                setImportMsg('Archivo inválido.')
              }
              e.target.value = ''
            }}
          />
        </div>
      </Card>

      <Card gold>
        <h3 className="font-display text-xl">Pegar texto del test</h3>
        <p className="mt-2 text-sm text-ivory-muted">
          Si no está en este dispositivo: en el resultado toca <em>Copiar mi resultado</em> y pégalo
          abajo.
        </p>
        <textarea
          className="mt-3 min-h-[120px] w-full border border-white/15 bg-elevated px-3 py-2 text-ivory"
          placeholder="Pega aquí el resultado copiado…"
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
        />
        <button
          type="button"
          className="mt-3 min-h-11 border border-gold/40 px-4 text-sm text-ivory hover:bg-wine/30"
          onClick={() => {
            const parsed = parsePastedResult(paste)
            if (Object.keys(parsed).length === 0) {
              setImportMsg('No detectamos campos. Completa a mano o usa Título: …')
              return
            }
            setProject({ ...emptyProject(), ...project, ...parsed })
            setImportMsg('Campos importados (autoguardado).')
            setPaste('')
          }}
        >
          Importar texto
        </button>
      </Card>

      <Notice>
        <strong className="text-ivory">Importante:</strong> sin cuenta en la nube. La copia .json es
        tu seguro al cambiar de teléfono.
      </Notice>

      <ModuleDoneButton moduleId="proyecto" />
    </div>
  )
}
