import { describe, expect, it } from 'vitest'
import { emptyProject, ProjectSchema } from '../db/schema'
import { applyPlaceholders } from './placeholders'

describe('ProjectSchema', () => {
  it('creates a valid empty project', () => {
    const p = emptyProject({ title: 'Prueba' })
    expect(p.title).toBe('Prueba')
    expect(ProjectSchema.safeParse(p).success).toBe(true)
  })
})

describe('applyPlaceholders', () => {
  it('replaces project tokens', () => {
    const out = applyPlaceholders('Hola {{ELLA}} en {{TITULO}}', {
      title: 'La Deuda',
      pen: 'Sienna',
      female: 'Elena',
      male: 'Adrian',
      premise: 'x',
      hook: 'y',
      conflict: 'z',
      tags: 'a',
      promise: 'p',
    })
    expect(out).toContain('Elena')
    expect(out).toContain('La Deuda')
  })
})
