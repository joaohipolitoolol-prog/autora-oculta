import { useState } from 'react'

/** FAQ in customer language — mechanism proof, no fake testimonials */
const FAQ = [
  {
    q: '¿Voy a recibir el libro listo?',
    a: 'No. Recibes el proyecto del test (título, seudónimo, premisa) y el método para desarrollarlo: estructura de hasta 25 capítulos, más de 40 prompts y un plan de 7 días. Tú escribes con guía en ChatGPT, Claude o Gemini — no es una novela automática completa.',
  },
  {
    q: '¿Y si no sé por dónde empezar?',
    a: 'Por eso existe el método. El test te da el concepto; adentro tienes la siguiente acción clara: personajes, capítulos, prompts y publicación, en ese orden.',
  },
  {
    q: '¿La historia no va a quedar genérica?',
    a: 'El punto de partida es tu combinación personalizada de universo, conflicto y personajes. Los prompts están pensados para expandir ese proyecto, no para generar un texto genérico sin contexto.',
  },
  {
    q: '¿Alguien sabrá que fui yo?',
    a: 'No hace falta. Publicas bajo seudónimo. Tu identidad puede permanecer oculta; tu historia no necesita quedarse guardada.',
  },
  {
    q: '¿Necesito saber escribir o usar IA?',
    a: 'No. Pegarás prompts en ChatGPT, Claude o Gemini y editarás paso a paso. Funciona desde el celular.',
  },
  {
    q: '¿Es un pago único o una suscripción?',
    a: 'Un solo pago. Sin mensualidades. Acceso inmediato al método. Garantía de 7 días según Hotmart.',
  },
  {
    q: '¿Qué pasa con mi resultado del test después de comprar?',
    a: 'Si usas el mismo navegador, el proyecto se importa a tu área del método. Título, seudónimo y premisa aparecen como base de trabajo — no empiezas de cero.',
  },
]

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="border-t border-gold/25">
      {FAQ.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="border-b border-gold/25">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display text-xl text-ivory md:text-2xl">{item.q}</span>
              <span className="text-gold" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && <p className="pb-4 text-base leading-relaxed text-ivory-muted">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
