import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProcessingScreen } from '@/components/ProcessingScreen'
import { generateProject } from '@/lib/generateProject'
import { loadAnswers, saveProject } from '@/lib/storage'
import { QUESTIONS } from '@/data/questions'
import type { GeneratedProject, QuizAnswers } from '@/types/quiz'

export function ProcessingPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [answers, setAnswers] = useState<QuizAnswers | null>(null)

  useEffect(() => {
    try {
      const saved = loadAnswers()
      const complete = saved && QUESTIONS.every((q) => Boolean(saved[q.id]))
      if (!complete) {
        navigate('/quiz', { replace: true })
        return
      }
      const a = saved as QuizAnswers
      const p = generateProject(a)
      setAnswers(a)
      setProject(p)
    } catch {
      navigate('/quiz', { replace: true })
    }
  }, [navigate])

  const onDone = useCallback(() => {
    if (!project) {
      navigate('/quiz', { replace: true })
      return
    }
    saveProject(project)
    navigate('/resultado', { replace: true })
  }, [navigate, project])

  const ready = useMemo(() => Boolean(answers && project), [answers, project])

  if (!ready || !answers || !project) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center px-5 text-ivory-muted">
        Preparando tu proyecto…
      </div>
    )
  }

  return <ProcessingScreen answers={answers} project={project} onDone={onDone} />
}
