# Prototipo v2 · Plataforma de Agencia Cognitiva UNACH

Prototipo visual (Fase 0). No tiene backend: los datos son de ejemplo.

## Estructura

```
prototipo/
├── index.html          Portal de acceso (página principal)
├── modelo.html         Guía "Conoce el modelo" (explicación del método)
├── plataforma.html     Prototipo de la app (estudiante y docente)
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

Pendiente: `plataforma.html` todavía usa `onclick` en línea. Se resuelve al migrar a React.

## Accesibilidad

- Enlace "Saltar al contenido", foco visible y etiquetas ARIA en la navegación.
- Respeta "reducir movimiento" del sistema operativo: se desactivan las animaciones.
- Diseño adaptable a celular, tableta y escritorio.
