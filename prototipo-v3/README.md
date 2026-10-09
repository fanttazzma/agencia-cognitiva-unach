# Prototipo v3 · Plataforma de Agencia Cognitiva UNACH

Prototipo visual (Fase 0). No tiene backend: los datos son de ejemplo.

## Cambios de la v3 (revisión del 7 de octubre de 2026)

- **Docente:** selector de periodo con historial; materias separadas por grupo (5A y 5B son independientes) y panel filtrable; ejes transversales en el tipo de reto (IA fija + interculturalidad, sustentabilidad y cultura de paz con «¿qué incluye?» y ayuda contextual); mínimo de palabras y revisión de textos sin sentido; vista previa del estudiante; defensa oral programada y registrada; aprobar etapa o solicitar corrección (2 días); aviso de fecha límite para publicar retos; asistente de IA presentado como modelo local con análisis guardado.
- **Estudiante:** sin copiar ni pegar en sus retos; etapas que se abren solo tras la revisión; proyecto integrador que se llena una vez; conclusión con «¿cómo lo hiciste?» por eje; defensa oral; descarga de la cédula concluida en PDF con fecha y hora; avisos con enlace y «Agregar a Google Calendar»; guía con glosario, ejes, ejemplos y espacio para video.
- **Autoridad:** top 10 de unidades académicas, lugar de la propia unidad, retos por eje, detalle por programa educativo y plan, actividad docente.
- **Acceso:** botón de Google limitado a cuentas @unach.mx (simulado).
- **Ajustes posteriores (8 de octubre):** ejes «Aplica / No aplica» con justificación y nota del Modelo Académico (los cuatro ejes son filtros obligatorios de validación); fuentes base del andamiaje en la etapa 1 y gestión de riesgos en la conclusión; fuentes obligatorias como enlaces (título y autor opcionales); actividades de aprendizaje de 1 a 3 según las cédulas disponibles; etiqueta del momento del Modelo Académico (1 a 6) en cada etapa y pantalla; unidades de ejemplo: estudiante y docente en la Escuela de Tecnologías Digitales Aplicadas C-I, autoridad en la Facultad de Ingeniería.
- **Segunda revisión con la directora (8 de octubre):** el estudiante ve por qué aplica o no aplica cada eje; vista previa del docente con la pantalla real del estudiante y aviso de campos faltantes; total de cédulas por unidad académica (no la suma de los ejes); botón para volver al panel desde la guía y glosario; «Ver guía completa» en la guía del reto; tipografías del sitio institucional (Montserrat y Lato) con una sola jerarquía de títulos y cifras más legibles; ilustraciones de los cuatro ejes (portal, guía y plataforma); en «Conoce el modelo», ejemplos señalados, bitácora con propuesta inicial, interacciones y qué cambió (cédula de ejemplo del Modelo Académico, p. 33), «Descartado por» en la curaduría y respuestas de preguntas frecuentes que afirman o niegan en la frase.
- **ia.html:** propuesta de opciones de IA para la Secretaría Académica.

## Estructura

```
prototipo/
├── index.html          Portal de acceso (página principal)
├── modelo.html         Guía "Conoce el modelo" (explicación del método)
├── plataforma.html     Prototipo de la app (estudiante, docente y autoridad)
├── ia.html             Propuesta de asistente de IA (opciones)
└── assets/
    ├── css/
    │   ├── tokens.css  Colores, tipografías y medidas (única fuente)
    │   └── site.css    Estilos del portal y la guía
    ├── js/
    │   ├── data.js     Contenido dinámico: periodo, calendario, avisos
    │   └── site.js     Animaciones y comportamiento (sin dependencias)
    └── img/            Escudo (versión normal y versión clara para fondos oscuros)
```

- **Abrir:** doble clic en `index.html`. Para la tipografía (Fraunces y Manrope) se necesita internet; sin conexión se usa una de respaldo.
- **Servir localmente:** `python -m http.server 5510` dentro de esta carpeta.
- **Cambiar fechas o avisos:** editar `assets/js/data.js`. No hace falta tocar el HTML.

## Camino a producción

| Hoy (prototipo) | Producción |
|---|---|
| `data.js` estático | Endpoints de FastAPI con la misma forma de datos: `GET /api/portal/periodo`, `/calendario`, `/avisos` |
| `tokens.css` | Se copia a `tailwind.config` (colores y fuentes) del proyecto React |
| `plataforma.html` | Se reescribe en React por pantallas: Login, MisCedulas, Cedula (Bloques I–IV, RFA), PanelDocente, NuevoReto, EvaluarCedula |
| Botón "Continuar con cuenta UNACH" | SSO con el proveedor de identidad institucional (OIDC/SAML, por confirmar con TI) |
| Google Fonts | Fuentes alojadas en el propio servidor (privacidad y funcionamiento sin dependencias externas) |

## Seguridad (a aplicar al desplegar)

Los encabezados de seguridad van en Nginx, no en el HTML:

```nginx
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

Decisiones ya tomadas en el código del portal pensando en eso:

- `index.html` y `modelo.html` no tienen scripts ni eventos en línea (`onclick`), así que funcionan con la CSP estricta de arriba (una vez alojadas las fuentes localmente).
- Todo texto que viene de datos se escapa antes de insertarse (`esc()` en `site.js`) para evitar XSS cuando los avisos provengan de la API.
- La sesión debe manejarse con cookies `HttpOnly`, `Secure` y `SameSite=Strict`, nunca con tokens en `localStorage`.
- La plataforma no envía contenido de las cédulas a servicios externos de IA (Lineamientos de IA, Art. 10).

`plataforma.html` ya no usa `onclick` en línea. Quedan algunos estilos en línea generados por JavaScript; se resuelven al migrar a React.

## Accesibilidad

- Enlace "Saltar al contenido", foco visible y etiquetas ARIA en la navegación.
- Respeta "reducir movimiento" del sistema operativo: se desactivan las animaciones.
- Diseño adaptable a celular, tableta y escritorio.
