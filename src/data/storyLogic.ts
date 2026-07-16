import type { ScenarioId, MaleId, FemaleId, RelationshipId, ConflictId, IntensityId, EndingId } from '@/types/quiz'

export const SCENARIO_DATA: Record<ScenarioId, {
  label: string
  setting: string
  atmosphere: string
  visualSymbols: string[]
  coverStyle: string
}> = {
  mansion: {
    label: 'Mansión aislada',
    setting: 'una mansión antigua con corredores cerrados, una biblioteca prohibida y documentos escondidos detrás de retratos',
    atmosphere: 'sombras largas, madera oscura y silencios que escuchan',
    visualSymbols: ['llave antigua', 'retrato', 'pasillo cerrado'],
    coverStyle: 'editorial gótico elegante',
  },
  small_town: {
    label: 'Ciudad pequeña',
    setting: 'una pequeña ciudad donde todos conocen un secreto… excepto ella',
    atmosphere: 'miradas en la calle, iglesias antiguas y rumores que nunca mueren',
    visualSymbols: ['mapa del pueblo', 'ventana iluminada', 'carta anónima'],
    coverStyle: 'misterio rural contemporáneo',
  },
  billionaire: {
    label: 'Imperio multimillonario',
    setting: 'un imperio empresarial donde herencias, consejos y contratos deciden destinos',
    atmosphere: 'vidrio, control, poder silencioso y lujo frío',
    visualSymbols: ['contrato', 'rascacielos', 'anillo de sello'],
    coverStyle: 'lujo oscuro contemporáneo',
  },
  rural: {
    label: 'Propiedad rural',
    setting: 'una propiedad rural aislada, con tierras disputadas y una casa que parece vigilar',
    atmosphere: 'niebla, caballos, distancia y peligro contenido',
    visualSymbols: ['cerca rota', 'caballo negro', 'casa de campo'],
    coverStyle: 'western oscuro atmosférico',
  },
  secret_society: {
    label: 'Sociedad secreta',
    setting: 'una sociedad secreta con máscaras, reglas antiguas y un juramento que no se puede romper',
    atmosphere: 'rituales, élite, símbolos y promesas peligrosas',
    visualSymbols: ['máscara negra', 'sello de cera', 'símbolo oculto'],
    coverStyle: 'sociedad secreta cinematográfica',
  },
  dangerous_family: {
    label: 'Familia peligrosa',
    setting: 'el territorio de una familia peligrosa, donde las alianzas se firman con miedo y sangre fría',
    atmosphere: 'poder familiar, vigilancia y lealtad forzada',
    visualSymbols: ['anillo familiar', 'arma guardada', 'retrato del clan'],
    coverStyle: 'mafia romance sofisticado',
  },
}

export const MALE_DATA: Record<MaleId, { label: string; trait: string; vibe: string }> = {
  cold_heir: {
    label: 'Heredero frío',
    trait: 'frío, calculista y controlador, pero protector solo con ella',
    vibe: 'heredero reservado',
  },
  mafia: {
    label: 'Mafioso',
    trait: 'peligroso, estratégico y posesivo con lo que considera suyo',
    vibe: 'hombre de poder',
  },
  obsessive_cowboy: {
    label: 'Cowboy obsesivo',
    trait: 'aislado, territorial y obsesivo, dueño de secretos antiguos',
    vibe: 'cowboy oscuro',
  },
  dangerous_boss: {
    label: 'Jefe peligroso',
    trait: 'autoritario, impecable ante el mundo y moralmente peligroso en privado',
    vibe: 'jefe oscuro',
  },
  family_rival: {
    label: 'Rival familiar',
    trait: 'marcado por una rivalidad antigua y una atracción que debería estar prohibida',
    vibe: 'rival prohibido',
  },
  masked_man: {
    label: 'Hombre enmascarado',
    trait: 'de identidad oculta, observa desde lejos y conoce más de su pasado de lo que debería',
    vibe: 'hombre enmascarado',
  },
}

export const FEMALE_DATA: Record<FemaleId, { label: string; trait: string }> = {
  defiant: {
    label: 'Desafiante',
    trait: 'desafía órdenes, cuestiona el poder y se niega a ser controlada',
  },
  innocent_observant: {
    label: 'Observadora',
    trait: 'parece vulnerable, pero registra cada detalle que otros ignoran',
  },
  strategic: {
    label: 'Estratégica',
    trait: 'analiza riesgos, esconde intenciones y juega con cuidado',
  },
  ambitious: {
    label: 'Ambiciosa',
    trait: 'está dispuesta a arriesgarlo todo por libertad, poder o justicia',
  },
  emotionally_closed: {
    label: 'Cerrada',
    trait: 'no confía en nadie y rechaza la intimidad hasta que alguien insiste',
  },
  escape_driven: {
    label: 'Determinada a escapar',
    trait: 'su objetivo inicial es sobrevivir, escapar y recuperar su libertad',
  },
}

export const RELATIONSHIP_DATA: Record<RelationshipId, { label: string; dynamic: string }> = {
  enemies_to_lovers: {
    label: 'Enemies to lovers',
    dynamic: 'rivalidad abierta, atracción negada y una confianza que nace demasiado tarde',
  },
  forced_marriage: {
    label: 'Matrimonio forzado',
    dynamic: 'un matrimonio estratégico, reglas claras y una convivencia que nadie eligió',
  },
  forbidden_romance: {
    label: 'Romance prohibido',
    dynamic: 'un deseo imposible por familia, posición, secreto o peligro',
  },
  forced_proximity: {
    label: 'Convivencia forzada',
    dynamic: 'comparten techo, espacio y silencio hasta que la tensión se vuelve inevitable',
  },
  second_chance: {
    label: 'Segunda oportunidad',
    dynamic: 'un pasado incompleto, un abandono y un reencuentro que reabre heridas',
  },
  hidden_identity: {
    label: 'Identidad escondida',
    dynamic: 'uno de los dos no sabe quién es realmente el otro… todavía',
  },
}

export const CONFLICT_DATA: Record<ConflictId, {
  label: string
  bond: string
  secret: string
  openingObject: string
}> = {
  family_debt: {
    label: 'Deuda familiar',
    bond: 'una deuda familiar que nadie le explicó a tiempo',
    secret: 'él sabía el monto exacto de la deuda mucho antes de conocerla',
    openingObject: 'un sobre con números y un apellido',
  },
  secret_contract: {
    label: 'Contrato secreto',
    bond: 'un contrato secreto firmado a espaldas de ambos… o de uno de ellos',
    secret: 'hay una cláusula que solo él ha leído completa',
    openingObject: 'un contrato con una firma familiar',
  },
  revenge: {
    label: 'Venganza',
    bond: 'una venganza antigua que necesita un nuevo nombre para cerrarse',
    secret: 'ella no es solo una pieza: es el final de una deuda emocional',
    openingObject: 'una fotografía marcada con una fecha',
  },
  disappearance: {
    label: 'Desaparición',
    bond: 'una desaparición que conecta sus familias y deja preguntas sin respuesta',
    secret: 'él sabe dónde empezó la desaparición… y quién mintió primero',
    openingObject: 'una carta nunca enviada',
  },
  inheritance: {
    label: 'Herencia',
    bond: 'una herencia inesperada que los obliga a compartir lo que ninguno quiere dividir',
    secret: 'él conocía la existencia de la herencia antes de que ella recibiera la llave',
    openingObject: 'una llave con una dirección escrita atrás',
  },
  old_promise: {
    label: 'Promesa antigua',
    bond: 'una promesa hecha años atrás que ahora exige cumplimiento',
    secret: 'él hizo esa promesa a alguien que ella amaba… o temía',
    openingObject: 'una promesa escrita en tinta desvanecida',
  },
}

export const INTENSITY_TONE: Record<IntensityId, string> = {
  mysterious: 'la tensión se sostiene en miradas, secretos y un deseo contenido',
  balanced: 'la intensidad es alta, pero medida: peligro, atracción y consecuencias claras',
  dark: 'el tono es oscuro y provocador, con poder, obsesión y moralidad en conflicto',
  very_dark: 'el universo es moralmente ambiguo, peligroso y sin héroes limpios',
}

export const ENDING_HINT: Record<EndingId, string> = {
  intense_happy: 'Un final feliz, pero intenso: juntos, después del costo.',
  victory_with_cost: 'Una victoria con consecuencias: ganan, pero algo queda marcado.',
  open_series: 'Un final abierto, listo para continuar el universo en una serie.',
  final_revelation: 'Una revelación final que reescribe todo lo que creían saber.',
}
