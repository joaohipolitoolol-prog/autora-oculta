import { useState } from 'react'

const FAQ = [
  {
    q: '¿Recibiré un libro completo automáticamente?',
    a: 'No. Recibirás un proyecto inicial personalizado (como el del test) y un método guiado: estructuras, prompts y un plan para desarrollar tu historia con ChatGPT u otra IA. Tú escribes con guía — no recibes una novela terminada al instante.',
  },
  {
    q: '¿El método usa mi resultado del test?',
    a: 'Sí. El punto de partida es tu concepto: título, seudónimo, premisa, personajes y conflicto. Los prompts del método se diseñaron para expandir ese tipo de proyecto, no para empezar de cero.',
  },
  {
    q: '¿Necesito saber escribir?',
    a: 'No. El método organiza ideas, personajes, capítulos y escenas. Pegarás prompts en una IA y editarás el resultado paso a paso.',
  },
  {
    q: '¿Tengo que mostrar mi rostro?',
    a: 'No. Puedes publicar bajo seudónimo y mantener el proyecto separado de tu identidad personal.',
  },
  {
    q: '¿Tengo que escribir contenido explícito?',
    a: 'No. Tú defines el nivel de intensidad. El método se adapta a misterio, tensión o dark más fuerte.',
  },
  {
    q: '¿Qué herramienta de IA necesito?',
    a: 'ChatGPT, Claude, Gemini u otra capaz de trabajar con texto. Funciona desde el celular con la app o el navegador.',
  },
  {
    q: '¿Puedo usarlo desde el celular?',
    a: 'Sí. El material es digital y los prompts se usan en la app de ChatGPT (u otra IA) desde el teléfono. No necesitas computadora para empezar.',
  },
  {
    q: '¿Dónde puedo publicar?',
    a: 'El método muestra opciones de venta directa, marketplaces y series. Tú eliges según tu mercado.',
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
