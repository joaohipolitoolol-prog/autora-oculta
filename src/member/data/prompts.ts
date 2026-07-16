export type PromptItem = {
  id: string
  title: string
  category:
    | 'ideacion'
    | 'universo'
    | 'personajes'
    | 'estructura'
    | 'escena'
    | 'revision'
    | 'venta'
    | 'anuncios'
    | 'identidad'
    | 'continuidad'
  body: string
  needsChapter?: boolean
  when?: string
}

export const PROMPTS: PromptItem[] = [
  {
    id: 'universo-expandir',
    title: 'Expandir universo',
    category: 'universo',
    body: `Actúa como editora de dark romance. A partir de esta premisa:

{{PREMISA}}

Conflicto: {{CONFLICTO}}

Expande el universo en 8 bloques cortos:
1) Lugar y atmósfera
2) Jerarquía de poder
3) Reglas del mundo
4) Símbolos visuales
5) Historia previa (5 años antes)
6) Amenaza externa
7) Secreto central
8) Potencial de secuela

Sé concreta. Sin relleno.`,
  },
  {
    id: 'outline-25',
    title: 'Outline de 25 capítulos',
    category: 'estructura',
    body: `Eres estructuralista de dark romance. Título: {{TITULO}}
Protagonista: {{ELLA}}
Él: {{EL}}
Premisa: {{PREMISA}}
Conflicto: {{CONFLICTO}}

Crea un outline de 25 capítulos. Para cada uno escribe:
- Título tentativo
- Objetivo de la escena (1 línea)
- Giro o cliffhanger (1 línea)
No escribas la prosa completa. Solo el mapa.`,
  },
  {
    id: 'fichas',
    title: 'Ficha de personajes',
    category: 'universo',
    body: `Crea fichas profundas de dark romance para:
ELLA: {{ELLA}}
ÉL: {{EL}}
Contexto: {{PREMISA}}
Conflicto: {{CONFLICTO}}

Para cada uno incluye: deseo consciente, deseo inconsciente, herida, mentira central, miedo, moralidad, voz (cómo habla), relación con el poder, y 3 secretos (uno falso, dos verdaderos).
Formato claro, sin relleno.`,
  },
  {
    id: 'apertura',
    title: 'Escena de apertura',
    category: 'escena',
    body: `Escribe la primera escena de «{{TITULO}}» en tono dark romance. Protagonista: {{ELLA}}. Él: {{EL}}. Empieza con tensión, secreto y atracción negada. 450–600 palabras. No resuelvas el misterio. Estilo sensorial, diálogos cortos, sin moralizar.

Gancho opcional: {{GANCHO}}`,
  },
  {
    id: 'conflicto',
    title: 'Conflicto entre ellos',
    category: 'escena',
    body: `Desarrolla una escena donde {{ELLA}} y {{EL}} enfrentan esto: {{CONFLICTO}}. Incluye diálogo cortante, deseo contenido y una pista del secreto. 500–700 palabras. Termina en cliffhanger.`,
  },
  {
    id: 'capitulo-n',
    title: 'Capítulo según número',
    category: 'escena',
    needsChapter: true,
    body: `Escribe el Capítulo {{N}} de «{{TITULO}}» siguiendo esta función: {{FUNCION_CAPITULO}}.
Cliffhanger objetivo: {{CLIFF}}.
Personajes: {{ELLA}} y {{EL}}.
Premisa: {{PREMISA}}.
Mantén continuidad. 700–1000 palabras. Cierra con una pregunta, amenaza o roce que obligue a leer el siguiente.`,
  },
  {
    id: 'vulnerabilidad',
    title: 'Escena de vulnerabilidad',
    category: 'escena',
    body: `Escribe una escena íntima (no necesariamente sexual) entre {{ELLA}} y {{EL}} donde uno muestra una grieta. El otro casi la usa… y elige no hacerlo del todo. 400–550 palabras. Tono contenido, peligroso, tierno a regañadientes.`,
  },
  {
    id: 'climax',
    title: 'Clímax',
    category: 'escena',
    body: `Escribe el clímax de «{{TITULO}}». Combina amenaza externa + confrontación emocional. {{ELLA}} debe elegir. {{EL}} debe pagar un precio. 800–1100 palabras. Final del capítulo abierto a resolución, no a epílogo todavía.`,
  },
  {
    id: 'revisar',
    title: 'Revisar y oscurecer',
    category: 'revision',
    body: `Revisa este capítulo de dark romance. Mejora ritmo, tensión y subtexto. Elimina explicaciones innecesarias. Intensifica el peligro emocional sin volverte explícita a menos que yo lo pida.

TEXTO:
[PEGA AQUÍ EL CAPÍTULO]`,
  },
  {
    id: 'seudonimos',
    title: 'Banco de seudónimos',
    category: 'identidad',
    body: `Propón 12 seudónimos para autora de dark romance en español/latam. Tono: editorial, premium, misterioso. Para cada uno: por qué funciona y qué tipo de historia sugiere. Evita nombres infantiles o cómicos.`,
  },
  {
    id: 'sinopsis',
    title: 'Sinopsis comercial',
    category: 'venta',
    body: `Escribe 3 versiones de sinopsis para «{{TITULO}}» (como {{SEUDONIMO}}):
A) Corta (120–150 palabras) para la página de venta
B) Media (200–250) para marketplace
C) Gancho de 2 frases para anuncio
Premisa: {{PREMISA}}
Conflicto: {{CONFLICTO}}
Tono dark romance. Sin spoilers del final. Termina con una pregunta o amenaza emocional.`,
  },
  {
    id: 'descripcion',
    title: 'Descripción de producto',
    category: 'venta',
    body: `Redacta la descripción de venta de la novela digital «{{TITULO}}». Incluye: promesa emocional, para quién es, qué encontrará la lectora, y un aviso de tono (misterio / oscuro). Máximo 180 palabras. CTA final suave.`,
  },
  {
    id: 'ads',
    title: '5 creativos de anuncio',
    category: 'anuncios',
    body: `Escribe 5 textos cortos para Instagram/Facebook Ads (máx 80 palabras c/u) vendiendo la novela «{{TITULO}}» de {{SEUDONIMO}}. Tono dark romance, curiosidad, sin emojis excesivos, sin promesas de dinero. Cada uno con un ángulo distinto.`,
  },
  {
    id: 'herida-ella',
    title: 'Herida emocional de ella',
    category: 'personajes',
    when: 'Antes de escribir capítulos largos',
    body: `Para {{ELLA}} en «{{TITULO}}»:
Premisa: {{PREMISA}}
Define en formato claro:
1) Herida original (hecho concreto)
2) Creencia falsa que nació de esa herida
3) Cómo esa creencia sabotea el romance con {{EL}}
4) Momento en que la herida se activa en la trama
5) Qué necesitaría para sanar SIN volverla “suave”
Sin relleno.`,
  },
  {
    id: 'moral-el',
    title: 'Moral torcida de él',
    category: 'personajes',
    body: `Para {{EL}} en «{{TITULO}}»:
Conflicto: {{CONFLICTO}}
Escribe:
1) Código moral propio (3 reglas)
2) Línea que no cruzaría… hasta que la cruza
3) Cómo “protege” mal a {{ELLA}}
4) Qué teme perder más que a ella
5) Una escena de 150 palabras donde su moral se muestra sin explicación`,
  },
  {
    id: 'dialogo-cortante',
    title: 'Diálogo cortante',
    category: 'escena',
    body: `Escribe un diálogo de 400–550 palabras entre {{ELLA}} y {{EL}} en «{{TITULO}}».
Tema: {{CONFLICTO}}
Reglas: frases cortas, subtexto, deseo contenido, una pista del secreto, cero monólogos explicativos. Termina cuando uno se va o se calla.`,
  },
  {
    id: 'continuidad',
    title: 'Chequeo de continuidad',
    category: 'continuidad',
    body: `Eres continuity editor de «{{TITULO}}».
Personajes: {{ELLA}}, {{EL}}
Premisa fija: {{PREMISA}}
Revisa el texto pegado abajo y lista:
- contradicciones
- datos inventados no establecidos
- tono fuera de dark romance
- oportunidades de cliffhanger
No reescribas todo: corrige solo lo crítico y explica por qué.

TEXTO:
[PEGA AQUÍ]`,
  },
  {
    id: 'midpoint',
    title: 'Punto medio / revelación',
    category: 'estructura',
    body: `Diseña el midpoint de «{{TITULO}}» (caps 11–13 aprox).
Premisa: {{PREMISA}}
Conflicto: {{CONFLICTO}}
Entrega:
1) Qué se revela
2) Qué creía {{ELLA}} hasta ahora
3) Cómo cambia el poder entre ella y {{EL}}
4) Nuevo objetivo inmediato
5) Cliffhanger de 1 línea
Sin prosa completa.`,
  },
  {
    id: 'antagonista',
    title: 'Antagonista o sistema',
    category: 'personajes',
    body: `Para «{{TITULO}}», define la fuerza antagonista (persona o sistema) que refuerza: {{CONFLICTO}}.
Incluye: deseo, método, debilidad, cómo usa a {{ELLA}} o {{EL}}, y 3 movimientos de presión a lo largo de la trama.`,
  },
  {
    id: 'bio-seudonimo',
    title: 'Bio de autora bajo seudónimo',
    category: 'identidad',
    body: `Escribe 3 biografías cortas (40–70 palabras) para {{SEUDONIMO}}, autora de dark romance.
Tono editorial. Sin datos personales reales. Sin promesas de dinero. Incluye géneros y promesa emocional.`,
  },
  {
    id: 'gancho-cap1',
    title: 'Gancho de apertura (variantes)',
    category: 'ideacion',
    body: `Con base en:
Título: {{TITULO}}
Gancho actual: {{GANCHO}}
Premisa: {{PREMISA}}
Propón 5 aperturas distintas (2–3 frases c/u). Cada una debe crear pregunta + peligro + atracción. No uses clichés de espejo/despertar.`,
  },
  {
    id: 'escena-celos',
    title: 'Escena de celos / posesión',
    category: 'escena',
    body: `Escribe una escena (500–700 palabras) donde {{EL}} siente amenaza sobre {{ELLA}} en «{{TITULO}}».
Mantén control: peligro emocional, no caricatura. Incluye diálogo cortante y un gesto que delate deseo. Cierra en cliff.`,
  },
  {
    id: 'ruptura',
    title: 'Ruptura / traición aparente',
    category: 'estructura',
    body: `Diseña la ruptura aparente de «{{TITULO}}» (caps 16–19).
Conflicto: {{CONFLICTO}}
Qué cree la lectora, qué es verdad, qué paga {{EL}}, qué decide {{ELLA}}. Outline de 3 beats + cliff.`,
  },
  {
    id: 'estilo-voz',
    title: 'Fijar voz narrativa',
    category: 'revision',
    body: `Define la voz narrativa de «{{TITULO}}» (POV de {{ELLA}} o dual).
Entrega: léxico, ritmo de frase, lo que NUNCA diría, 5 ejemplos de micro-detalle sensorial coherentes con: {{PREMISA}}.`,
  },
  {
    id: 'sinopsis-hooks',
    title: 'Hooks de 2 líneas',
    category: 'venta',
    body: `Escribe 10 hooks de 2 líneas para «{{TITULO}}» ({{SEUDONIMO}}).
Premisa: {{PREMISA}}
Sin spoilers del final. Sin emojis. Variar ángulo: secreto, poder, deseo, identidad.`,
  },
  {
    id: 'carousel',
    title: 'Guion de carrusel (8 slides)',
    category: 'anuncios',
    body: `Crea un carrusel de 8 slides para Instagram promocionando «{{TITULO}}» de {{SEUDONIMO}}.
Cada slide: título corto + 1 frase. Slide 8 = CTA suave a leer/comprar. Tono dark romance. Sin promesas financieras.`,
  },
  {
    id: 'epub-checklist',
    title: 'Checklist editorial pre-publicación',
    category: 'venta',
    body: `Actúa como editora freelance. Con «{{TITULO}}» y promesa {{PROMESA}}, genera un checklist accionable de revisión (continidad, ritmo, romance, cliffhangers, consistencia de nombres) en 15 ítems. No reescribas el libro.`,
  },
  {
    id: 'serie-potencial',
    title: 'Puerta a serie',
    category: 'ideacion',
    body: `A partir de «{{TITULO}}» ({{PREMISA}}), propone 3 ganchos de secuela sin arruinar el final del libro 1. Para cada uno: personaje focal, conflicto nuevo, vínculo con el universo.`,
  },
  {
    id: 'limites-tono',
    title: 'Límites de tono e intensidad',
    category: 'continuidad',
    body: `Para «{{TITULO}}», redacta una “biblia corta de límites” (máx 200 palabras): qué sí, qué no, intensidad emocional, qué evitar en diálogos. Debe servir para pegar al inicio de chats con IA externa.`,
  },
  {
    id: 'escena-poder',
    title: 'Escena de poder desigual',
    category: 'escena',
    body: `Escribe 550–750 palabras: {{ELLA}} y {{EL}} en un espacio donde él controla las reglas ({{CONFLICTO}}).
Ella debe ganar 1 centímetro de agencia. Él no puede volverse “bueno”. Cierra con amenaza íntima o revelación parcial.`,
  },
  {
    id: 'revision-dialogos',
    title: 'Pulir solo diálogos',
    category: 'revision',
    body: `Reescribe ÚNICAMENTE los diálogos del texto pegado para que suenen a {{ELLA}} y {{EL}} en dark romance. Mantén narración intacta. Elimina explicaciones en boca de personajes.

TEXTO:
[PEGA]`,
  },
  {
    id: 'portada-brief',
    title: 'Brief de portada',
    category: 'identidad',
    body: `Crea un brief de portada para «{{TITULO}}» ({{SEUDONIMO}}).
Incluye: concepto visual único, paleta (negro/vino/dorado), tipografía, símbolo, lo que NO debe aparecer. 120–160 palabras.`,
  },
  {
    id: 'pagina-venta',
    title: 'Estructura de página de venta',
    category: 'venta',
    body: `Arma el outline de una página de venta para «{{TITULO}}».
Bloques: promesa, para quién, qué incluye, aviso de tono, FAQ (4), CTA.
Textos listos para copiar. Sin garantías de ingresos.`,
  },
  {
    id: 'adversarios-familia',
    title: 'Presión familiar / clan',
    category: 'universo',
    body: `Expande la presión social/familiar alrededor de {{EL}} y {{ELLA}} en «{{TITULO}}».
3 figuras de poder, 1 secreto compartido, 2 reglas no escritas, 1 ultimátum que puede romper la pareja.`,
  },
  {
    id: 'objeto-simbolo',
    title: 'Objeto simbólico',
    category: 'universo',
    body: `Propón 5 objetos/símbolos para «{{TITULO}}» ligados a {{CONFLICTO}}.
Para cada uno: significado, quién lo controla, cuándo aparece, cómo cambia al final.`,
  },
  {
    id: 'cap-corto',
    title: 'Capítulo corto (novela express)',
    category: 'escena',
    needsChapter: true,
    body: `Escribe el Capítulo {{N}} de «{{TITULO}}» en 450–650 palabras (formato novela corta).
Función: {{FUNCION_CAPITULO}}
Cliff: {{CLIFF}}
Personajes: {{ELLA}}, {{EL}}
Prioriza tensión y cierre. Sin relleno descriptivo.`,
  },
  {
    id: 'anuncio-identidad',
    title: 'Anuncio ángulo identidad',
    category: 'anuncios',
    body: `Escribe 3 anuncios (máx 70 palabras) con el ángulo: “¿qué historia escribirías si nadie supiera que fuiste tú?”
Producto: método/novela «{{TITULO}}» / {{SEUDONIMO}}. Sin promesas de dinero.`,
  },
  {
    id: 'conflicto-interno',
    title: 'Conflicto interno de ella',
    category: 'personajes',
    body: `Para {{ELLA}} en «{{TITULO}}»:
Deseo consciente vs deseo real vs miedo.
Cómo eso choca con {{EL}} y con {{CONFLICTO}}.
Formato: tabla corta + 1 microescena (120 palabras).`,
  },
  {
    id: 'maestro',
    title: 'Prompt Maestro (iniciar chat)',
    category: 'continuidad',
    body: `Eres editora de dark romance. Trabaja SOLO con este proyecto:

TÍTULO: {{TITULO}}
SEUDÓNIMO: {{SEUDONIMO}}
ELLA: {{ELLA}} | ÉL: {{EL}}
PREMISA: {{PREMISA}}
CONFLICTO: {{CONFLICTO}}
GANCHO: {{GANCHO}}
PROMESA: {{PROMESA}}
TAGS: {{TAGS}}

Reglas: un pedido = una escena/bloque; continuidad; subtexto; cliff; no moralizar; no inventar datos que contradigan lo anterior.
Confirma en 5 viñetas el tono y lo que no debes revelar aún.`,
  },
]

export const PROMPT_CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'ideacion', label: 'Ideación' },
  { id: 'universo', label: 'Universo' },
  { id: 'personajes', label: 'Personajes' },
  { id: 'estructura', label: 'Estructura' },
  { id: 'escena', label: 'Escenas' },
  { id: 'continuidad', label: 'Continuidad' },
  { id: 'revision', label: 'Revisión' },
  { id: 'identidad', label: 'Identidad' },
  { id: 'venta', label: 'Venta' },
  { id: 'anuncios', label: 'Marketing' },
] as const
