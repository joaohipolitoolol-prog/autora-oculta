/** Hash determinístico simple a partir de un string */
export function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pickBySeed<T>(items: readonly T[], seed: number, salt = 0): T {
  const idx = Math.abs((seed + salt * 2654435761) >>> 0) % items.length
  return items[idx]
}

export function makeSeed(parts: string[]): string {
  return parts.join('|')
}
