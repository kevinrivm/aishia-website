// Configuración de la landing del live — único lugar a editar.
// Mientras un valor esté vacío, la página funciona sin esa pieza (no rompe).
// La versión del 30-sep vive en el historial de git (commit anterior a «live 19-nov»).
window.LIVE_CONFIG = {
  // Fecha y hora del live en hora de CDMX (UTC-6, sin horario de verano).
  // ⚠️ 13:00 es PROPUESTA hasta que David y Marco confirmen. Si cambia, se cambia
  // SOLO aquí: la tarjeta de fecha, los horarios por país, la cuenta regresiva
  // y el calendario se calculan solos. (Y en n8n: nodo «Config del live».)
  startsAt: '2026-11-19T13:00:00-06:00',
  durationMin: 90,

  // Título corto del live (calendario, correo, página de gracias).
  title: 'Cómo vender sistemas de $2,000 con IA, sin saber programar',

  // Testimonios en video alojados en el sitio. "result" es la etiqueta dorada sobre el video.
  testimonialClips: [
    { src: '/assets/testimonios/david-jirasek.mp4', poster: '/assets/testimonios/david-jirasek.jpg', name: 'David Jirasek', role: 'Dueño de agencia · invitado del live', result: 'Lo vende a sus clientes', quote: 'Estamos desarrollando nuestro propio CRM personalizado, con las APIs oficiales de WhatsApp.' },
    { src: '/assets/testimonios/fernando-vega.mp4', poster: '/assets/testimonios/fernando-vega.jpg', name: 'Fernando Vega', role: 'Betson · Colombia', result: '$36 de pauta → 2 clientes', quote: 'De 4 llamadas cerró 2 clientes: $450 y $250 USD de instalación, más mensualidad.' },
    { src: '/assets/testimonios/eduardo-lagos.mp4', poster: '/assets/testimonios/eduardo-lagos.jpg', name: 'Eduardo Lagos', role: 'CRM con IA para una inmobiliaria de Madrid', result: '€950 por un CRM con IA', quote: 'Le cobré 950 euros a una inmobiliaria por montarle un CRM con inteligencia artificial.' },
    { src: '/assets/testimonios/leopoldo-garrido.mp4', poster: '/assets/testimonios/leopoldo-garrido.jpg', name: 'Leopoldo Garrido', role: 'No venía de sistemas', result: 'Tech Provider sin ser programador', quote: 'Si estás viendo esto, es un claro testimonio de que sí se puede.' }
  ],

  // ID del pixel de Meta (dataset). Vacío = no se carga el pixel.
  metaPixelId: '1043848984720523', // "Web kevinbelier.cloud" · portafolio Kevin Belier IA

  // Webhook que recibe el registro (POST JSON). Debe responder 2xx.
  // Flujo n8n «Live 19-nov · Registro» en n8n2.kevinbelier.cloud.
  // Sin autenticación a propósito: un formulario público no puede guardar secretos; n8n filtra el spam.
  formEndpoint: 'https://n8n2.kevinbelier.cloud/webhook/live19-registro',

  // Etiqueta con la que entra al CRM y a la tabla de registros.
  tag: 'live-19nov',

  // Dónde se ve el live. Vacío mientras no esté programado en YouTube:
  // el calendario manda a /envivo, que redirige al live (se edita en n8n, no aquí).
  watchUrl: 'https://kevinbelier.cloud/envivo'
};
