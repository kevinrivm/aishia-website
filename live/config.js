// Configuración de la landing del live — único lugar a editar.
// Mientras un valor esté vacío, la página funciona sin esa pieza (no rompe).
window.LIVE_CONFIG = {
  // Fecha y hora del live en hora de CDMX (UTC-6, sin horario de verano).
  // Formato ISO con offset. Ej.: '2026-09-30T19:00:00-06:00'
  startsAt: '2026-09-30T16:00:00-06:00',
  durationMin: 90,

  // Texto de la hora que se muestra (ej.: '7:00 p. m. CDMX'). Vacío = "hora por confirmar".
  timeLabel: '4:00 p. m. (CDMX)',

  // Video de YouTube del VSL: solo el ID (lo que va después de watch?v=). Vacío = se oculta el bloque.
  vslYoutubeId: 'TkMTIwYDtk0',

  // Videos testimoniales (YouTube, idealmente "No listado"). Vacío = la sección no se muestra.
  // Ej.: { youtubeId: 'AbC123xyz', name: 'Fernando Vega', role: 'Betson · Colombia', quote: '$36 de pauta → 2 clientes' }
  testimonialVideos: [
    { youtubeId: 'O18OguSXc_s', name: 'Eduardo Lagos', role: 'CRM con IA para una inmobiliaria de Madrid', quote: 'Le cobré 950 euros a una inmobiliaria por montarle un CRM con inteligencia artificial.' },
    { youtubeId: '1mrwvQ2cCug', name: 'David Jirasek', role: 'Dueño de agencia', quote: 'Estamos desarrollando nuestro propio CRM personalizado, con las APIs oficiales de WhatsApp.' },
    { youtubeId: 'gBCs_py69DI', name: 'Leopoldo Garrido', role: 'No venía de sistemas · hoy es Tech Provider de Meta', quote: 'Si estás viendo esto, es un claro testimonio de que sí se puede.' }
  ],

  // ID del pixel de Meta (dataset). Vacío = no se carga el pixel.
  metaPixelId: '1043848984720523', // "Web kevinbelier.cloud" · portafolio Kevin Belier IA

  // Webhook que recibe el registro (POST JSON). Debe responder 2xx.
  // Payload: { name, whatsapp, email, optin, tag, event_id, page_url, utm_*, fbp, fbc, submitted_at, hp, fill_seconds }
  // Sin autenticación a propósito: un formulario público no puede guardar secretos; n8n filtra el spam.
  formEndpoint: 'https://n8n2.kevinbelier.cloud/webhook/619c0f34-b390-462b-8360-4bf0027cca3a',


  // Etiqueta con la que entra al CRM.
  tag: 'live-30sep',

  // Dónde se ve el live (se muestra en la página de gracias y en el evento de calendario).
  watchUrl: 'https://youtube.com/live/CmQXXt292rM'
};
