import type { QuizQuestion } from '@/types/quiz'

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'scenario',
    title: '¿Dónde comienza tu historia?',
    options: [
      { id: 'mansion', title: 'Una mansión aislada', description: 'Pasillos cerrados, documentos ocultos y una ala prohibida.', icon: 'mansion' },
      { id: 'small_town', title: 'Una pequeña ciudad llena de secretos', description: 'Rumores, familias poderosas y verdades a medias.', icon: 'town' },
      { id: 'billionaire', title: 'Un imperio multimillonario', description: 'Contratos, herencias y un consejo que todo controla.', icon: 'empire' },
      { id: 'rural', title: 'Una propiedad rural', description: 'Tierras aisladas, disputas antiguas y silencio peligroso.', icon: 'rural' },
      { id: 'secret_society', title: 'Una sociedad secreta', description: 'Máscaras, reglas antiguas y un juramento imposible de romper.', icon: 'mask' },
      { id: 'dangerous_family', title: 'El territorio de una familia peligrosa', description: 'Poder, deuda y alianzas que nadie elige libremente.', icon: 'family' },
    ],
  },
  {
    id: 'male',
    title: '¿Quién es el hombre que cambia todo?',
    options: [
      { id: 'cold_heir', title: 'El heredero frío que controla todo', description: 'Calculista, reservado y peligroso cuando decide proteger.', icon: 'heir' },
      { id: 'mafia', title: 'El mafioso que nunca pierde', description: 'Respetado, estratégico y posesivo con lo que considera suyo.', icon: 'mafia' },
      { id: 'obsessive_cowboy', title: 'El cowboy obsesivo que vive aislado', description: 'Territorial, dominante y dueño de secretos antiguos.', icon: 'cowboy' },
      { id: 'dangerous_boss', title: 'El jefe moralmente peligroso', description: 'Autoridad, diferencia de poder y una obsesión creciente.', icon: 'boss' },
      { id: 'family_rival', title: 'El rival de su familia', description: 'Historia de enemistad, atracción prohibida y rencor vivo.', icon: 'rival' },
      { id: 'masked_man', title: 'El hombre enmascarado que conoce su pasado', description: 'Identidad oculta y una mirada que ya la conocía.', icon: 'masked' },
    ],
  },
  {
    id: 'relationship',
    title: '¿Qué relación existe entre ellos?',
    options: [
      { id: 'enemies_to_lovers', title: 'Enemies to lovers', description: 'Rivalidad, atracción negada y una confianza que nace tarde.', icon: 'enemies' },
      { id: 'forced_marriage', title: 'Matrimonio forzado', description: 'Contrato, convivencia y reglas que ninguno pidió.', icon: 'rings' },
      { id: 'forbidden_romance', title: 'Romance prohibido', description: 'Imposible por familia, posición, secreto o peligro.', icon: 'forbidden' },
      { id: 'forced_proximity', title: 'Convivencia forzada', description: 'La misma casa, la misma misión, el mismo aire.', icon: 'house' },
      { id: 'second_chance', title: 'Segunda oportunidad', description: 'Un pasado incompleto y un reencuentro que duele.', icon: 'chance' },
      { id: 'hidden_identity', title: 'Identidad escondida', description: 'Uno de los dos no sabe quién es realmente el otro.', icon: 'identity' },
    ],
  },
  {
    id: 'conflict',
    title: '¿Qué los mantiene unidos?',
    options: [
      { id: 'family_debt', title: 'Una deuda familiar', description: 'Un nombre, un número y una obligación que nadie olvidó.', icon: 'debt' },
      { id: 'secret_contract', title: 'Un contrato secreto', description: 'Cláusulas, firmas y consecuencias que no se pueden deshacer.', icon: 'contract' },
      { id: 'revenge', title: 'Una venganza', description: 'Una herida antigua buscando un precio exacto.', icon: 'revenge' },
      { id: 'disappearance', title: 'Una desaparición', description: 'Alguien se fue. Alguien sabe. Nadie habla.', icon: 'vanish' },
      { id: 'inheritance', title: 'Una herencia', description: 'Una llave, un documento y una propiedad que cambia todo.', icon: 'key' },
      { id: 'old_promise', title: 'Una promesa hecha años atrás', description: 'Palabras dichas a tiempo. Consecuencias llegadas tarde.', icon: 'promise' },
    ],
  },
  {
    id: 'female',
    title: '¿Cómo es tu protagonista?',
    options: [
      { id: 'defiant', title: 'Desafiante y difícil de controlar', description: 'Cuestiona órdenes y se niega a ser propiedad de nadie.', icon: 'fire' },
      { id: 'innocent_observant', title: 'Aparentemente inocente, pero observadora', description: 'Parece vulnerable, pero ve lo que otros ignoran.', icon: 'eye' },
      { id: 'strategic', title: 'Fría, estratégica y desconfiada', description: 'Analiza riesgos y esconde más de lo que dice.', icon: 'chess' },
      { id: 'ambitious', title: 'Ambiciosa y dispuesta a arriesgarlo todo', description: 'Quiere poder, libertad o justicia… aunque duela.', icon: 'ambition' },
      { id: 'emotionally_closed', title: 'Emocionalmente cerrada', description: 'No confía. No se entrega. Hasta que alguien insiste.', icon: 'wall' },
      { id: 'escape_driven', title: 'Determinada a escapar', description: 'Su primer objetivo es sobrevivir y recuperar su libertad.', icon: 'escape' },
    ],
  },
  {
    id: 'intensity',
    title: '¿Qué nivel de intensidad quieres?',
    notice: 'Podrás ajustar el nivel de contenido durante la creación.',
    options: [
      { id: 'mysterious', title: 'Tensión, misterio y romance', description: 'Atmósfera densa, deseo contenido y secretos.', icon: 'mist' },
      { id: 'balanced', title: 'Intenso, pero equilibrado', description: 'Emoción fuerte sin cruzar líneas que no elijas.', icon: 'balance' },
      { id: 'dark', title: 'Oscuro y provocador', description: 'Poder, obsesión y moralidad en tensión constante.', icon: 'dark' },
      { id: 'very_dark', title: 'Muy oscuro y moralmente ambiguo', description: 'Personajes peligrosos y decisiones sin pureza.', icon: 'void' },
    ],
  },
  {
    id: 'ending',
    title: '¿Qué tipo de final imaginas?',
    options: [
      { id: 'intense_happy', title: 'Feliz, pero intenso', description: 'Ganan juntos… después de haber pagado un precio.', icon: 'heart' },
      { id: 'victory_with_cost', title: 'Una victoria con consecuencias', description: 'Triunfo imperfecto. Cicatrices incluidas.', icon: 'scar' },
      { id: 'open_series', title: 'Un final abierto para continuar la serie', description: 'La historia termina. El universo no.', icon: 'series' },
      { id: 'final_revelation', title: 'Una revelación que cambia todo', description: 'La última verdad reescribe lo que creían saber.', icon: 'reveal' },
    ],
  },
  {
    id: 'presentation',
    title: '¿Cómo te gustaría presentar tu historia?',
    options: [
      { id: 'secret_pen_name', title: 'Con un seudónimo completamente secreto', description: 'Tu vida personal y tu proyecto quedan separados.', icon: 'pen' },
      { id: 'author_identity', title: 'Como una nueva identidad de autora', description: 'Nombre, estética y voz narrativa propios.', icon: 'author' },
      { id: 'connected_series', title: 'Como una serie de libros conectados', description: 'Un universo con más historias por contar.', icon: 'books' },
      { id: 'direct_sale', title: 'Como un producto digital para venta directa', description: 'Historia lista para ofrecerse online.', icon: 'sale' },
      { id: 'unknown', title: 'Todavía no lo sé', description: 'Primero quieres ver qué historia aparece.', icon: 'question' },
    ],
  },
]
