/* =========================================================
   Datos de ejemplo de la plataforma.
   En producción: catálogos desde CIAE (estudiantes, docentes,
   materias, periodos) y cédulas desde la API de FastAPI.
   ========================================================= */
window.AC = {
  hoy: '2026-10-01',
  periodo: '2026-2',
  maxCedulasPorMateria: 3,
  diasRevisionDocente: 7,

  estudiante: { nombre: 'Ana Pérez Gómez', iniciales: 'AP', programa: 'Ingeniería en Desarrollo de Software', semestre: 5 },
  docente: { nombre: 'Mtro. Carlos Ruiz Hernández', iniciales: 'CR', materia: '5.2 Tópicos Avanzados de Bases de Datos', grupos: ['5A', '5B'],
    materias: [
      { c: '5.2', n: 'Tópicos Avanzados de Bases de Datos', grupos: ['5A', '5B'], usadas: 2 },
      { c: '3.2', n: 'Bases de Datos', grupos: ['3C'], usadas: 0 },
    ] },

  /* Docentes del mismo programa (para invitar a compartir un proyecto) */
  docentes: [
    { n: 'Mtra. Laura Gómez Ruiz', m: '5.3 Calidad de los Procesos' },
    { n: 'Ing. Pablo Torres Díaz', m: '5.6 Taller de Desarrollo' },
    { n: 'Dra. Paola Méndez Cruz', m: '5.1 Fundamentos de Redes' },
    { n: 'Mtro. Jorge Santiz López', m: '5.4 Estructuras de Bajo Nivel' },
    { n: 'Mtra. Rosa Aguilar Pérez', m: '5.5 Investigación de Operaciones' },
  ],
  invitaciones: [
    { de: 'Dra. Paola Méndez Cruz', m: '5.1 Fundamentos de Redes', reto: 'Red de datos para el laboratorio de cómputo', estado: 'pendiente' },
  ],
  autoridad: { nombre: 'Coordinación Académica', iniciales: 'SA' },

  /* Trayecto acumulativo: semestre N, materia N.1 … N.6.
     ced = [cédulas completas, cédulas asignadas] */
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

  /* Reto integrador: una actividad, una cédula por cada materia vinculada */
  reto: {
    id: 'R-2026-2-0142',
    titulo: 'Sistema de control de acceso a la Facultad con credencial QR',
    tipo: 'Proyecto integrador',
    materias: ['5.2 Tópicos Avanzados de Bases de Datos', '5.3 Calidad de los Procesos', '5.6 Taller de Desarrollo'],
    compartido: [['5.3 Calidad de los Procesos', 'Mtra. Laura Gómez Ruiz'], ['5.6 Taller de Desarrollo', 'Ing. Pablo Torres Díaz']],
    guia: {
      tipoReto: 'Situado',
      proposito: 'Diseñar y justificar un modelo de datos que soporte alta concurrencia, aplicando normalización, índices y particionamiento.',
      producto: 'Modelo de datos implementado en PostgreSQL con scripts, pruebas de carga y documento técnico de decisiones.',
      organizacion: 'Equipos de 3 integrantes; cada integrante entrega su propia cédula.',
      criterios: 'Pertinencia del modelo, justificación de decisiones, evidencia de pruebas y calidad del rastro intelectual.',
    },
    docente: 'Mtro. Carlos Ruiz Hernández',
    descripcion: 'Diseñar el sistema que registre entradas y salidas de estudiantes y docentes leyendo el código QR de la credencial institucional, con reportes de asistencia por facultad.',
    criteriosIA: 'Puedes usar IA para explorar alternativas de modelado y consultas. No para redactar tus respuestas ni la conclusión. Registra cada uso en tu bitácora.',
    andamiaje: ['Modelo entidad-relación y normalización (texto guía de la unidad)', 'Documentación oficial de PostgreSQL: índices y transacciones', 'Lineamientos de seguridad de los sistemas informáticos de la UNACH'],
  },

  /* Etapas calendarizadas por el docente (mínimo 2) + conclusión */
  etapas: [
    { n: 1, nombre: 'Comprender y explorar', entrega: '2026-09-22', revision: '2026-09-29', estado: 'done' },
    { n: 2, nombre: 'Mejora y adapta', entrega: '2026-10-06', revision: '2026-10-13', estado: 'cur' },
    { n: 3, nombre: 'Conclusión', entrega: '2026-10-27', revision: '2026-11-03', estado: 'next' },
  ],

  cedula: {
    preguntas: [
      ['¿Qué entendiste del reto con tus propias palabras?', 'Que hay que registrar quién entra y sale de la facultad usando la credencial, sin filas ni listas en papel, y que la información sirva para reportes de asistencia.'],
      ['¿Qué necesitas saber o investigar para resolverlo?', 'Cómo está codificado el QR de la credencial, qué datos podemos consultar de CIAE y cuánta concurrencia habría en horas pico.'],
      ['¿Qué vas a hacer en esta primera etapa?', 'Levantar requerimientos con control escolar y proponer un primer modelo de datos.'],
    ],
    bitacora: [
      { tipo: 'IA', herr: 'Gemini (cuenta institucional)', a: 'Propón un modelo entidad-relación para registrar accesos con credencial QR en una universidad.', b: 'Sugirió las tablas persona, credencial, acceso y puerta, con una relación muchos a muchos entre persona y puerta.' },
      { tipo: 'Humano', herr: 'Personal de control escolar', a: 'Entrevista sobre cómo se registra hoy la asistencia.', b: 'Muchos estudiantes olvidan la credencial; necesitan un respaldo con la aplicación Soy UNACH.', consent: true },
    ],
    propuesta: 'Una tabla única de accesos con la matrícula como llave y una aplicación móvil para escanear.',
    fuentes: ['Documentación de PostgreSQL sobre particionamiento de tablas', ''],
    descarte: ['Sugerencia de la IA de guardar la fotografía de cada acceso', 'Implica datos personales sensibles sin necesidad y aumenta el almacenamiento; contradice el principio de minimización.'],
    duda: '¿Cómo evitar que la tabla de accesos se vuelva lenta con miles de registros diarios?',
    error: '',
    rect: '',
    ejes: { Interculturalidad: '', Sustentabilidad: '', 'Cultura de Paz': '', 'Adopción Crítica de la IA': '' },
    riesgos: '', declaracion: '', aprendi: '',
    avance1: true, avance2: false,
    retro1: { autor: 'Mtro. Carlos Ruiz Hernández', fecha: '2026-09-27', texto: 'Buen levantamiento de requerimientos. Tu propuesta inicial de una sola tabla no resolverá el volumen: revisa particionamiento e índices. Documenta qué te hizo cambiar de opinión.' },
  },

  /* Docente */
  pendientes: [
    { n: 'Luis Hernández Ruiz', m: '5.2', g: '5A', etapa: 'Etapa 1 · Comprender y explorar', vence: '2026-09-29' },
    { n: 'Ana Pérez Gómez', m: '5.2', g: '5A', etapa: 'Etapa 1 · Comprender y explorar', vence: '2026-10-02' },
    { n: 'María José Santiz López', m: '5.2', g: '5A', etapa: 'Etapa 1 · Comprender y explorar', vence: '2026-10-03' },
    { n: 'Jorge Díaz Méndez', m: '5.2', g: '5B', etapa: 'Etapa 1 · Comprender y explorar', vence: '2026-10-05' },
    { n: 'Karla Gómez Pérez', m: '3.2', g: '3C', etapa: 'Actividad 1 · Etapa 1', vence: '2026-10-04' },
    { n: 'Diego Morales Cruz', m: '3.2', g: '3C', etapa: 'Actividad 1 · Etapa 1', vence: '2026-10-06' },
  ],
  retosDocente: [
    { t: 'Sistema de control de acceso con credencial QR', tipo: 'Proyecto integrador', etapa: 'Etapa 2 de 3', entregas: [31, 34] },
    { t: 'Optimización de consultas sobre datos de CIAE', tipo: 'Actividad', etapa: 'Por iniciar · 3 nov', entregas: [0, 34] },
  ],
  cumplimientoDocente: { aTiempo: 46, total: 49 },

  /* Autoridad */
  facultades: [
    ['Facultad de Ingeniería', 82, 74], ['Facultad de Arquitectura', 77, 69], ['Facultad de Medicina Humana', 64, 52],
    ['Facultad de Derecho', 41, 33], ['Facultad de Contaduría y Administración', 58, 47], ['Facultad de Humanidades', 53, 45],
  ],
};
