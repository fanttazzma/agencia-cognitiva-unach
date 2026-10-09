/* =========================================================
   Contenido dinámico del portal (datos de ejemplo).
   Hoy es un archivo estático; en producción estos mismos
   objetos llegarán desde la API (FastAPI), por ejemplo:
     GET /api/portal/periodo
     GET /api/portal/calendario
     GET /api/portal/avisos
   Mantener la misma forma de los datos facilita el cambio.
   ========================================================= */
window.PORTAL_DATA = {
  periodo: {
    nombre: 'Agosto – Diciembre 2026',
    estadoServicio: 'Todos los servicios operando',
    version: '0.2 · prototipo',
  },

  // estado: 'done' (concluido) | 'now' (en curso) | 'next' (próximo)
  calendario: [
    { dia: '04', mes: 'Ago', titulo: 'Inicio del periodo', detalle: 'Los docentes publican los Retos de Aprendizaje y su andamiaje.', estado: 'done' },
    { dia: '18', mes: 'Ago', titulo: 'Apertura de cédulas', detalle: 'Los estudiantes pueden iniciar el registro de su rastro intelectual.', estado: 'done' },
    { dia: '10', mes: 'Nov', titulo: 'Cierre de cédulas', detalle: 'Último día para enviar la Cédula de Rastro Intelectual y el RFA.', estado: 'now' },
    { dia: '14', mes: 'Nov', titulo: 'Defensas orales', detalle: 'Del 14 al 28 de noviembre, según la programación de cada docente.', estado: 'next' },
    { dia: '05', mes: 'Dic', titulo: 'Publicación de evaluaciones', detalle: 'Retroalimentación y calificación final disponibles en la plataforma.', estado: 'next' },
  ],

  avisos: [
    { tipo: 'Actualización', fecha: '28 sep 2026', titulo: 'Autoguardado sin conexión', texto: 'Si pierdes internet mientras escribes, tu avance se conserva y se sincroniza al reconectar.' },
    { tipo: 'Recordatorio', fecha: '22 sep 2026', titulo: 'Declara todo uso de IA', texto: 'Cada interacción con herramientas de IA debe quedar registrada en tu Bitácora (Lineamientos de IA, Art. 35).' },
    { tipo: 'Mantenimiento', fecha: '15 sep 2026', titulo: 'Ventana programada', texto: 'Sábado 4 de octubre, de 22:00 a 02:00 h. La plataforma no estará disponible.' },
  ],
};
