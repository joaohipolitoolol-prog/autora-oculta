export type ChapterBeat = {
  n: number
  function: string
  cliff: string
  act: 1 | 2 | 3 | 4 | 5
}

export const CHAPTERS: ChapterBeat[] = [
  { n: 1, function: 'La señal que no debía ver', cliff: 'Aparece él / el documento', act: 1 },
  { n: 2, function: 'El hombre que ya sabía su nombre', cliff: 'Una frase imposible', act: 1 },
  { n: 3, function: 'La habitación / ala / archivo prohibido', cliff: 'Encuentra una pista', act: 1 },
  { n: 4, function: 'Las reglas de él', cliff: 'Ella acepta… a medias', act: 1 },
  { n: 5, function: 'Primer roce peligroso', cliff: 'Casi beso / amenaza íntima', act: 1 },
  { n: 6, function: 'Convivencia o misión compartida', cliff: 'Alguien los observa', act: 2 },
  { n: 7, function: 'Verdad a medias', cliff: 'Él miente por “protegerla”', act: 2 },
  { n: 8, function: 'Rival / familia / consejo', cliff: 'Ultimátum externo', act: 2 },
  { n: 9, function: 'Celos / posesión / distancia', cliff: 'Ella decide investigar sola', act: 2 },
  { n: 10, function: 'Descubrimiento parcial', cliff: 'Su nombre en el secreto', act: 2 },
  { n: 11, function: 'Punto medio: revelación', cliff: 'Ya no pueden fingir', act: 3 },
  { n: 12, function: 'Alianza frágil', cliff: 'Nueva amenaza', act: 3 },
  { n: 13, function: 'Confianza rota o casi', cliff: 'Prueba de lealtad', act: 3 },
  { n: 14, function: 'Escena de vulnerabilidad', cliff: 'Él muestra la herida', act: 3 },
  { n: 15, function: 'Plan peligroso', cliff: 'Algo sale mal', act: 3 },
  { n: 16, function: 'Separación forzada', cliff: 'Mensaje / chantaje', act: 4 },
  { n: 17, function: 'Ella toma poder', cliff: 'Confronta al sistema', act: 4 },
  { n: 18, function: 'Él elige entre imperio y ella', cliff: 'Sacrificio visible', act: 4 },
  { n: 19, function: 'Traición aparente', cliff: 'Lectora duda', act: 4 },
  { n: 20, function: 'La verdad completa', cliff: 'Todo encaja', act: 4 },
  { n: 21, function: 'Clímax externo', cliff: 'Peligro máximo', act: 5 },
  { n: 22, function: 'Clímax emocional', cliff: 'Confesión', act: 5 },
  { n: 23, function: 'Consecuencias', cliff: 'Precio pagado', act: 5 },
  { n: 24, function: 'Resolución del romance', cliff: 'Elección final', act: 5 },
  { n: 25, function: 'Epílogo / gancho de serie', cliff: 'Nueva puerta', act: 5 },
]

export const ACT_LABELS: Record<number, string> = {
  1: 'Caps 1–5 · Gancho y reglas',
  2: 'Caps 6–10 · Convivencia y secretos',
  3: 'Caps 11–15 · Revelación',
  4: 'Caps 16–20 · Escalada',
  5: 'Caps 21–25 · Clímax y cierre',
}
