/* =========================================================
   Datos de ejemplo de la plataforma (prototipo v3).
   En producción todo esto llega de la API institucional
   (estudiantes, docentes, materias por grupo, periodos,
   unidades académicas y programas) y de la base de datos
   propia del sistema (retos, cédulas, revisiones).
   ========================================================= */
window.AC = {
  hoy: '2026-10-01',
  periodo: '2026-2',
  periodos: [
    { k: '2026-2', n: 'Agosto – Diciembre 2026', actual: true, inicio: '2026-08-04' },
    { k: '2026-1', n: 'Enero – Junio 2026' },
    { k: '2025-2', n: 'Agosto – Diciembre 2025' },
  ],
  maxCedulasPorMateria: 3,
  diasRevisionDocente: 7,
  diasCorreccion: 2,
  diasRecomendadosEtapa: 30,
  minPalabras: 15,

  /* Ejes transversales del Modelo Académico (apartado 2.2.1.2) */
  ejes: {
    'Adopción crítica de la IA': {
      def: 'Uso ético, transparente y estratégico de la IA, siempre bajo el juicio del estudiante. La IA es una herramienta, nunca la autora de la solución.',
      ej: 'Ejemplo: el estudiante usa la IA para comparar materiales, pero justifica por qué descartó una sugerencia que no se consigue en la región.',
    },
    'Interculturalidad': {
      def: 'Reconocer la diversidad de saberes, lenguas y culturas, y dialogar con ellas sin imponer una sola visión.',
      ej: 'Ejemplo: un sistema de registro que ofrece la interfaz en tsotsil, o un diseño que considera prácticas constructivas de la comunidad.',
    },
    'Sustentabilidad': {
      def: 'Considerar el impacto ambiental y social de las decisiones técnicas y buscar soluciones que cuiden el entorno.',
      ej: 'Ejemplo: elegir un modelo de IA local que consume menos energía y agua, o materiales de la región que evitan transporte.',
    },
    'Cultura de paz': {
      def: 'Promover la equidad, la inclusión y la convivencia sin violencia; la empatía activa (K\'uxubinel) como forma de trabajo.',
      ej: 'Ejemplo: un proyecto que facilita la mediación de conflictos escolares o que cuida la accesibilidad para personas con discapacidad.',
    },
  },

  estudiante: { nombre: 'Ana Pérez Gómez', iniciales: 'AP', programa: 'Ingeniería en Desarrollo y Tecnologías de Software', unidad: 'Escuela de Tecnologías Digitales Aplicadas C-I', semestre: 5, matricula: 'A220145' },
  docente: { nombre: 'Mtro. Carlos Ruiz Hernández', iniciales: 'CR' },
  autoridad: { nombre: 'Secretaría Académica', iniciales: 'SA' },

  /* Cada grupo es una materia independiente (aunque compartan nombre) */
  materiasDocente: [
    { id: '5.2-5A', c: '5.2', n: 'Tópicos Avanzados de Bases de Datos', g: '5A', usadas: 2, alumnos: 34, entregas: [31, 34] },
    { id: '5.2-5B', c: '5.2', n: 'Tópicos Avanzados de Bases de Datos', g: '5B', usadas: 2, alumnos: 31, entregas: [27, 31] },
    { id: '3.2-3C', c: '3.2', n: 'Bases de Datos', g: '3C', usadas: 0, alumnos: 29, entregas: [0, 0] },
  ],
  historialDocente: {
    '2026-1': [['4.2 Análisis y Diseño de Sistemas · 4A', 'Rediseño del sistema de préstamo de la biblioteca', 'Proyecto integrador', '30 de 32 cédulas completas']],
    '2025-2': [['3.2 Bases de Datos · 3B', 'Base de datos para un banco de alimentos comunitario', 'Proyecto integrador', '27 de 28 cédulas completas'],
               ['3.2 Bases de Datos · 3B', 'Normalización de un inventario real', 'Actividad', '28 de 28 cédulas completas']],
  },
  limitePublicacion: '2026-09-04',

  docentes: [
    { n: 'Mtra. Laura Gómez Ruiz', m: '5.3 Calidad de los Procesos · 5A' },
    { n: 'Ing. Pablo Torres Díaz', m: '5.6 Taller de Desarrollo · 5A' },
    { n: 'Dra. Paola Méndez Cruz', m: '5.1 Fundamentos de Redes · 5A' },
    { n: 'Mtro. Jorge Santiz López', m: '5.4 Estructuras de Bajo Nivel · 5A' },
    { n: 'Mtra. Rosa Aguilar Pérez', m: '5.5 Investigación de Operaciones · 5A' },
  ],
  invitaciones: [
    { de: 'Dra. Paola Méndez Cruz', m: '5.1 Fundamentos de Redes · 5A', reto: 'Red de datos para el laboratorio de cómputo', estado: 'pendiente' },
  ],

  /* Trayecto acumulativo: semestre N, materia N.1 … N.6.  ced = [completas, asignadas] */
  semestres: [
    { n: 1, estado: 'done', materias: [
      ['1.1', 'Fundamentos de Programación', [2, 2]], ['1.2', 'Matemáticas Discretas', [1, 1]], ['1.3', 'Cálculo Diferencial', [1, 1]],
      ['1.4', 'Introducción a la Ingeniería de Software', [2, 2]], ['1.5', 'Comunicación Oral y Escrita', [1, 1]], ['1.6', 'Desarrollo Humano', [1, 1]] ] },
    { n: 2, estado: 'done', materias: [
      ['2.1', 'Programación Orientada a Objetos', [2, 2]], ['2.2', 'Álgebra Lineal', [1, 1]], ['2.3', 'Cálculo Integral', [1, 1]],
      ['2.4', 'Arquitectura de Computadoras', [1, 1]], ['2.5', 'Metodología de la Investigación', [2, 2]], ['2.6', 'Ética Profesional', [1, 1]] ] },
    { n: 3, estado: 'done', materias: [
      ['3.1', 'Estructuras de Datos', [2, 2]], ['3.2', 'Bases de Datos', [1, 1]], ['3.3', 'Probabilidad y Estadística', [1, 1]],
      ['3.4', 'Sistemas Operativos', [1, 1]], ['3.5', 'Ingeniería de Requerimientos', [2, 2]], ['3.6', 'Interculturalidad y Sociedad', [1, 1]] ] },
    { n: 4, estado: 'done', materias: [
      ['4.1', 'Programación Web', [2, 2]], ['4.2', 'Análisis y Diseño de Sistemas', [1, 1]], ['4.3', 'Métodos Numéricos', [1, 1]],
      ['4.4', 'Desarrollo Sustentable', [1, 1]], ['4.5', 'Interacción Humano-Computadora', [2, 2]], ['4.6', 'Taller de Investigación', [1, 1]] ] },
    { n: 5, estado: 'now', materias: [
      ['5.1', 'Fundamentos de Redes', [1, 2]], ['5.2', 'Tópicos Avanzados de Bases de Datos', [0, 2]], ['5.3', 'Calidad de los Procesos', [0, 1]],
      ['5.4', 'Estructuras de Bajo Nivel', [0, 1]], ['5.5', 'Investigación de Operaciones', [1, 1]], ['5.6', 'Taller de Desarrollo', [0, 1]] ] },
    { n: 6, estado: 'lock', materias: [] },
    { n: 7, estado: 'lock', materias: [] },
    { n: 8, estado: 'lock', materias: [] },
  ],

  /* Reto integrador en curso del estudiante */
  reto: {
    id: 'R-2026-2-0142',
    titulo: 'Sistema de control de acceso a la Facultad con credencial QR',
    tipo: 'Proyecto integrador',
    tipoReto: 'Situado',
    docente: 'Mtro. Carlos Ruiz Hernández',
    grupo: '5A',
    criteriosIA: 'Puedes usar IA para explorar alternativas de modelado y consultas. No para redactar tus respuestas ni la conclusión. Registra cada uso en tu bitácora.',
    ejes: {
      'Interculturalidad': { aplica: true, texto: 'Ofrecer la interfaz del registro también en tsotsil y tseltal para el personal y estudiantes hablantes.' },
      'Sustentabilidad': { aplica: true, texto: 'Reducir el uso de papel en listas de asistencia y dimensionar el servidor para no desperdiciar energía.' },
      'Cultura de paz': { aplica: false, texto: 'El reto es técnico y no involucra procesos de convivencia; se valorará el trato respetuoso en el trabajo en equipo.' },
    },
    // Fuentes obligatorias (andamiaje): de preferencia enlaces; título y autor opcionales
    andamiaje: [
      { tipo: 'doc', titulo: 'Texto guía de la unidad: modelo entidad-relación y normalización', autor: 'Academia de Bases de Datos', archivo: 'texto-guia-unidad-2.pdf' },
      { tipo: 'link', titulo: '', autor: '', url: 'https://www.postgresql.org/docs/current/indexes.html' },
      { tipo: 'norma', titulo: 'Lineamientos de seguridad para los sistemas informáticos y de comunicaciones', autor: 'UNACH', url: 'https://www.unach.mx/images/documentos/legislacion/LINEAMIENTOS-DE-SEGURIDAD.pdf' },
    ],
    compartido: [['5.3 Calidad de los Procesos', 'Mtra. Laura Gómez Ruiz'], ['5.6 Taller de Desarrollo', 'Ing. Pablo Torres Díaz']],
    guia: {
      proposito: 'Diseñar y justificar un modelo de datos que soporte alta concurrencia, aplicando normalización, índices y particionamiento.',
      producto: 'Modelo de datos implementado en PostgreSQL con scripts, pruebas de carga y documento técnico de decisiones.',
      organizacion: 'Equipos de 3 integrantes; cada integrante registra su propia cédula.',
      criterios: 'Pertinencia del modelo, justificación de decisiones, evidencia de pruebas y calidad del rastro intelectual.',
    },
    defensa: { fecha: '2026-11-05', hora: '10:00', lugar: 'Laboratorio de Bases de Datos, edificio C' },
  },

  /* Etapas calendarizadas por el docente (mínimo 2) + conclusión */
  etapas: [
    { n: 1, nombre: 'Comprender y explorar', entrega: '2026-09-04', revision: '2026-09-11', estado: 'done' },
    { n: 2, nombre: 'Mejora y adapta', entrega: '2026-10-06', revision: '2026-10-13', estado: 'cur' },
    { n: 3, nombre: 'Conclusión', entrega: '2026-10-27', revision: '2026-11-03', estado: 'next' },
  ],

  cedula: {
    preguntas: [
      ['¿Qué entendiste del reto con tus propias palabras?', 'Que hay que registrar quién entra y sale de la facultad usando la credencial, sin filas ni listas en papel, y que la información sirva para reportes de asistencia.'],
      ['¿Qué necesitas saber o investigar para resolverlo?', 'Cómo está codificado el QR de la credencial, qué datos podemos consultar del sistema escolar y cuánta concurrencia habría en horas pico.'],
      ['¿Qué vas a hacer en esta primera etapa?', 'Levantar requerimientos con control escolar y proponer un primer modelo de datos.'],
    ],
    bitacora: [
      { tipo: 'IA', herr: 'Gemini (cuenta institucional)', a: 'Propón un modelo entidad-relación para registrar accesos con credencial QR en una universidad.', b: 'Sugirió las tablas persona, credencial, acceso y puerta, con una relación muchos a muchos entre persona y puerta.' },
      { tipo: 'Humano', herr: 'Personal de control escolar', a: 'Entrevista sobre cómo se registra hoy la asistencia.', b: 'Muchos estudiantes olvidan la credencial; necesitan un respaldo con la aplicación institucional.', consent: true },
    ],
    fuentesBase: [
      'Con el texto guía normalicé el modelo hasta tercera forma normal y separé persona de credencial.',
      'De la documentación de PostgreSQL tomé el uso de índices compuestos para las consultas por fecha.',
      'Los lineamientos de seguridad me hicieron limitar quién puede consultar los registros de acceso.',
    ],
    propuesta: 'Una tabla única de accesos con la matrícula como llave y una aplicación móvil para escanear.',
    fuentes: ['Documentación de PostgreSQL sobre particionamiento de tablas', ''],
    descarte: ['Sugerencia de la IA de guardar la fotografía de cada acceso', 'Implica datos personales sensibles sin necesidad y aumenta el almacenamiento; contradice el principio de minimización.'],
    duda: '¿Cómo evitar que la tabla de accesos se vuelva lenta con miles de registros diarios?',
    error: '', rect: '',
    avance2: false,
    retro1: { autor: 'Mtro. Carlos Ruiz Hernández', fecha: '2026-09-09', texto: 'Buen levantamiento de requerimientos. Tu propuesta inicial de una sola tabla no resolverá el volumen: revisa particionamiento e índices. Documenta qué te hizo cambiar de opinión.' },
  },

  /* Cédula concluida de un semestre anterior (para la descarga en PDF) */
  cedulaFinal: {
    materia: '4.1 Programación Web', grupo: '4A', docente: 'Mtra. Elena Vázquez Cruz', periodo: '2026-1',
    reto: 'Portal de citas para la clínica universitaria', tipoReto: 'Situado', ejes: ['Adopción crítica de la IA', 'Cultura de paz'],
    etapas: [['Comprender y explorar', '2026-02-20', 'Cumplida'], ['Mejora y adapta', '2026-03-27', 'Cumplida'], ['Conclusión', '2026-05-08', 'Cumplida']],
    aprendi: 'Aprendí a validar requerimientos con usuarias reales antes de programar y a no aceptar una sugerencia de la IA sin probarla.',
    defensa: 'Realizada el 15 de mayo de 2026',
  },

  glosario: [
    ['Agencia Cognitiva', 'Metodología del Modelo Académico en la que el estudiante dirige y documenta su propio proceso de aprendizaje.'],
    ['Cédula de Rastro Intelectual', 'Registro, etapa por etapa, de cómo construiste tu solución: preguntas, fuentes, descartes, errores y conclusiones.'],
    ['Reto situado', 'Reto que resuelve un problema real del territorio o de una comunidad.'],
    ['Reto conceptual', 'Reto que profundiza, cuestiona o relaciona teorías y conceptos.'],
    ['Andamiaje', 'Fuentes y conceptos obligatorios que define el docente como base del reto.'],
    ['Bitácora de interacción', 'Registro de tus conversaciones con la IA y con personas (expertos, comunidad).'],
    ['Giro cognitivo', 'La duda, el error y la corrección que cambiaron tu forma de resolver el reto.'],
    ['RFA', 'Resultado Final de Aprendizaje: el producto que resuelve el reto.'],
    ['Defensa oral', 'Conversación final con tu docente donde explicas el porqué de tus decisiones.'],
  ],
  ejemplosRetos: [
    ['Situado', 'Ingeniería', 'Sistema de alerta de inundaciones para una colonia de Tuxtla con sensores de bajo costo.'],
    ['Conceptual', 'Derecho', 'Comparar el marco constitucional con los sistemas normativos de los pueblos originarios en un caso de mediación.'],
    ['Situado', 'Arquitectura', 'Propuesta de vivienda con bajareque para una cooperativa en Zinacantán.'],
  ],

  /* Docente */
  pendientes: [
    { n: 'Luis Hernández Ruiz', m: '5.2', g: '5A', etapa: 'Etapa 2 · Mejora y adapta', vence: '2026-09-29' },
    { n: 'Ana Pérez Gómez', m: '5.2', g: '5A', etapa: 'Etapa 2 · Mejora y adapta', vence: '2026-10-02' },
    { n: 'María José Santiz López', m: '5.2', g: '5A', etapa: 'Etapa 2 · Mejora y adapta', vence: '2026-10-03' },
    { n: 'Jorge Díaz Méndez', m: '5.2', g: '5B', etapa: 'Etapa 2 · Mejora y adapta', vence: '2026-10-05' },
    { n: 'Karla Gómez Pérez', m: '3.2', g: '3C', etapa: 'Cédula 1 · Etapa 1', vence: '2026-10-04' },
    { n: 'Diego Morales Cruz', m: '3.2', g: '3C', etapa: 'Cédula 1 · Etapa 1', vence: '2026-10-06' },
  ],
  retosDocente: [
    { t: 'Sistema de control de acceso con credencial QR', tipo: 'Proyecto integrador', grupos: '5A y 5B', etapa: 'Etapa 2 de 3', entregas: [58, 65] },
    { t: 'Optimización de consultas sobre datos institucionales', tipo: 'Actividad de aprendizaje', grupos: '5A y 5B', etapa: 'Inicia el 3 nov', entregas: [0, 65] },
  ],
  defensas: [
    { n: 'Luis Hernández Ruiz', g: '5A', fecha: '2026-11-05', hora: '09:00', hecha: false },
    { n: 'Ana Pérez Gómez', g: '5A', fecha: '2026-11-05', hora: '10:00', hecha: false },
  ],
  cumplimientoDocente: { aTiempo: 46, total: 49 },

  /* Autoridad: unidades académicas (cumplimiento estudiantes %, docentes %, retos por eje) */
  unidades: [
    ['Facultad de Contaduría y Administración C-I', 88, 81, { I: 12, S: 30, P: 9 }],
    ['Facultad de Arquitectura', 86, 79, { I: 41, S: 52, P: 14 }],
    ['Facultad de Ingeniería', 84, 76, { I: 18, S: 47, P: 11 }],
    ['Facultad de Medicina Humana C-II', 81, 70, { I: 22, S: 15, P: 19 }],
    ['Facultad de Ciencias Agronómicas', 79, 72, { I: 33, S: 61, P: 8 }],
    ['Facultad de Humanidades C-VI', 77, 69, { I: 49, S: 18, P: 37 }],
    ['Escuela de Ciencias Químicas', 74, 66, { I: 6, S: 39, P: 5 }],
    ['Escuela de Tecnologías Digitales Aplicadas C-I', 72, 64, { I: 11, S: 26, P: 7 }],
    ['Facultad de Derecho C-III', 71, 60, { I: 28, S: 7, P: 44 }],
    ['Facultad de Ciencias Sociales C-III', 69, 63, { I: 38, S: 21, P: 30 }],
    ['Facultad de Lenguas Tuxtla', 66, 58, { I: 52, S: 6, P: 17 }],
    ['Escuela de Gestión y Autodesarrollo Indígena', 63, 55, { I: 57, S: 24, P: 21 }],
    ['Facultad de Medicina Veterinaria y Zootecnia', 58, 49, { I: 9, S: 33, P: 4 }],
  ],
  totalUnidades: 44,
  miUnidad: 'Facultad de Ingeniería',
  // Programas de ejemplo: la lista real llegará de la API institucional
  programas: [
    ['Ingeniería Civil', 'Plan 2026', 85, 77],
    ['Ingeniería Civil', 'Plan 2015', 81, 72],
  ],
  actividadDocente: { activos: 112, total: 131, sinRetos: 9, reportes: 9, accesosSemana: 1840 },
};
