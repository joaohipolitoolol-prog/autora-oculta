import { useState } from 'react'

const FAQ = [
  {
    q: '¿Recibiré un libro completo automáticamente?',
    a: 'No. Recibirás un proyecto inicial personalizado y un método guiado para desarrollar tu historia usando estructuras, prompts y herramientas de inteligencia artificial.',
  },
  {
    q: '¿Necesito saber escribir?',
    a: 'No. El método fue creado para ayudarte a organizar ideas, personajes, capítulos y escenas desde cero.',
  },
  {
    q: '¿Tengo que mostrar mi rostro?',
    a: 'No. Puedes trabajar bajo un seudónimo y mantener el proyecto separado de tu identidad personal.',
  },
  {
    q: '¿Tengo que escribir contenido explícito?',
    a: 'No. Puedes definir el nivel de intensidad de tu historia.',
  },
  {
    q: '¿Qué herramienta de inteligencia artificial necesito?',
    a: 'Puedes utilizar ChatGPT, Claude, Gemini u otra herramienta capaz de trabajar con texto.',
  },
  {
    q: '¿Autora Oculta escribe el libro dentro de la plataforma?',
    a: 'En esta versión, Autora Oculta entrega estructuras, prompts, ejemplos y un camino guiado. El desarrollo del texto se realiza utilizando la herramienta de inteligencia artificial elegida por la usuaria.',
  },
  {
    q: '¿Puedo usarlo desde el celular?',
    a: 'Sí.',
  },
  {
    q: '¿Dónde puedo publicar?',
    a: 'El método presenta diferentes posibilidades de publicación y venta digital.',
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
            {isOpen && <p className="pb-4 text-ivory-muted">{item.a}</p>}
          </div>
        )
      })}
    </div>
  )
}
