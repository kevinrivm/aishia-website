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

  // Testimonios en video alojados en el sitio (clips cortos 720p, ~1 MB): se reproducen en silencio
  // en el carrusel y con sonido al tocarlos. "result" es la etiqueta dorada sobre el video.
  testimonialClips: [
    { src: '/assets/testimonios/fernando-vega.mp4', poster: '/assets/testimonios/fernando-vega.jpg', name: 'Fernando Vega', role: 'Betson · Colombia', result: '$36 de pauta → 2 clientes', quote: 'De 4 llamadas cerró 2 clientes: $450 y $250 USD de instalación, más mensualidad.' },
    { src: '/assets/testimonios/eduardo-lagos.mp4', poster: '/assets/testimonios/eduardo-lagos.jpg', name: 'Eduardo Lagos', role: 'CRM con IA para una inmobiliaria de Madrid', result: '€950 por un CRM con IA', quote: 'Le cobré 950 euros a una inmobiliaria por montarle un CRM con inteligencia artificial.' },
    { src: '/assets/testimonios/david-jirasek.mp4', poster: '/assets/testimonios/david-jirasek.jpg', name: 'David Jirasek', role: 'Dueño de agencia', result: 'Su propio CRM con WhatsApp oficial', quote: 'Estamos desarrollando nuestro propio CRM personalizado, con las APIs oficiales de WhatsApp.' },
    { src: '/assets/testimonios/leopoldo-garrido.mp4', poster: '/assets/testimonios/leopoldo-garrido.jpg', name: 'Leopoldo Garrido', role: 'No venía de sistemas', result: 'Tech Provider sin ser programador', quote: 'Si estás viendo esto, es un claro testimonio de que sí se puede.' }
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
