import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProcessingScreen } from '@/components/ProcessingScreen'
import { generateProject } from '@/lib/generateProject'
import { loadAnswers, saveProject } from '@/lib/storage'
import type { QuizAnswers } from '@/types/quiz'

export function ProcessingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const answers = loadAnswers()
    const required: (keyof QuizAnswers)[] = [
      'scenario', 'male', 'relationship', 'conflict', 'female', 'intensity', 'ending', 'presentation',
    ]
    const complete = answers && required.every((k) => Boolean(answers[k]))
    if (!complete) {
      navigate('/quiz', { replace: true })
    }
  }, [navigate])

  const onDone = useCallback(() => {
    const answers = loadAnswers() as QuizAnswers
    const project = generateProject(answers)
    saveProject(project)
    navigate('/resultado', { replace: true })
  }, [navigate])

  return <ProcessingScreen onDone={onDone} />
}
