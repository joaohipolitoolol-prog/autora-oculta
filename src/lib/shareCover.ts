/**
 * Export a shareable story cover as PNG (client-side canvas).
 * Does not reveal quiz answers — only title, pen name, impact line.
 */
export async function downloadShareCover(opts: {
  title: string
  penName: string
  impactLine: string
}): Promise<boolean> {
  const w = 1080
  const h = 1350
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  // Background
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#2a1018')
  grad.addColorStop(0.45, '#120b10')
  grad.addColorStop(1, '#0a0608')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Soft gold glow
  const glow = ctx.createRadialGradient(w * 0.8, h * 0.15, 20, w * 0.8, h * 0.15, 420)
  glow.addColorStop(0, 'rgba(184,151,90,0.28)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#b8975a'
  ctx.font = '500 28px Cinzel, Georgia, serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '6px'
  ctx.fillText('AUTORA OCULTA', w / 2, 120)

  ctx.fillStyle = '#f3ebe1'
  ctx.font = 'italic 600 72px "Cormorant Garamond", Georgia, serif'
  wrapText(ctx, opts.title, w / 2, 320, w - 160, 84)

  ctx.fillStyle = '#c9a96e'
  ctx.font = '500 32px Cinzel, Georgia, serif'
  ctx.fillText(`Por ${opts.penName}`, w / 2, 560)

  if (opts.impactLine) {
    ctx.fillStyle = 'rgba(243,235,225,0.78)'
    ctx.font = 'italic 400 40px "Cormorant Garamond", Georgia, serif'
    wrapText(ctx, opts.impactLine.slice(0, 140), w / 2, 680, w - 180, 52)
  }

  ctx.fillStyle = '#b8975a'
  ctx.font = '500 26px "DM Sans", system-ui, sans-serif'
  ctx.fillText('Descubre la tuya en Autora Oculta', w / 2, h - 140)
  ctx.fillStyle = 'rgba(243,235,225,0.55)'
  ctx.font = '400 22px "DM Sans", system-ui, sans-serif'
  ctx.fillText('autora-oculta.vercel.app', w / 2, h - 90)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `autora-oculta-${slug(opts.title)}.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve(true)
    }, 'image/png')
  })
}

export function shareWhatsAppCoverText(opts: {
  title: string
  penName: string
  impactLine: string
}) {
  const text = [
    `«${opts.title}»`,
    `Por ${opts.penName}`,
    opts.impactLine ? `"${opts.impactLine}"` : '',
    '',
    'Descubre qué dark romance escribirías si nadie supiera que fuiste tú:',
    'https://autora-oculta.vercel.app/',
  ]
    .filter(Boolean)
    .join('\n')
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40)
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(/\s+/)
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, yy)
}
