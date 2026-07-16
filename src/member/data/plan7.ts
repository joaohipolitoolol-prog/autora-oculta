export type PlanDay = {
  day: number
  objective: string
  deliverable: string
  tips: string[]
  linkTo: string
}

export const PLAN_7: PlanDay[] = [
  {
    day: 1,
    objective: 'Congelar proyecto',
    deliverable: 'Campos de «Tu proyecto» completos',
    tips: ['Copia el resultado del test', 'Elige un seudónimo provisional', 'No edites el título más de 10 minutos'],
    linkTo: '/entregavel/proyecto',
  },
  {
    day: 2,
    objective: 'Universo + fichas',
    deliverable: '1 página de mundo + 2 fichas',
    tips: [
      'Responde las 5 preguntas del universo',
      'Luego abre Personajes y completa las 2 fichas',
      'Usa el prompt de fichas',
    ],
    linkTo: '/entregavel/universo',
  },
  {
    day: 3,
    objective: 'Outline',
    deliverable: '12–25 capítulos mapeados',
    tips: ['Marca cada capítulo como outline', 'Si es novela corta, usa 12–18', 'Anota el cliff de cada uno'],
    linkTo: '/entregavel/estructura',
  },
  {
    day: 4,
    objective: 'Abrir la historia',
    deliverable: 'Capítulos 1–2 escritos/editados',
    tips: ['Prompt de apertura + edición humana', 'No busques perfección', 'Cierra con cliff'],
    linkTo: '/entregavel/prompts',
  },
  {
    day: 5,
    objective: 'Motor del romance',
    deliverable: 'Capítulos 3–5',
    tips: ['Reglas + primer roce', 'Mantén el secreto vivo', 'Revisa con el prompt de oscurecer'],
    linkTo: '/entregavel/estructura',
  },
  {
    day: 6,
    objective: 'Punto medio',
    deliverable: 'Capítulo de revelación',
    tips: ['Cap 11 o equivalente', 'Cambia el tablero', 'La lectora no puede volver atrás'],
    linkTo: '/entregavel/prompts',
  },
  {
    day: 7,
    objective: 'Producto',
    deliverable: 'Sinopsis + descripción + plan de publicación',
    tips: ['3 versiones de sinopsis', 'Checklist de publicar', 'Elige un canal'],
    linkTo: '/entregavel/venta',
  },
]
