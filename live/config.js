// Configuración de la landing del live — único lugar a editar.
// Mientras un valor esté vacío, la página funciona sin esa pieza (no rompe).
window.LIVE_CONFIG = {
  // Fecha y hora del live en hora de CDMX (UTC-6, sin horario de verano).
  // Formato ISO con offset. Ej.: '2026-09-30T19:00:00-06:00'
  startsAt: '',
  durationMin: 90,

  // Texto de la hora que se muestra (ej.: '7:00 p. m. CDMX'). Vacío = "hora por confirmar".
  timeLabel: '',

  // Video de YouTube del VSL: solo el ID (lo que va después de watch?v=). Vacío = se oculta el bloque.
  vslYoutubeId: '',

  // ID del pixel de Meta (dataset). Vacío = no se carga el pixel.
  metaPixelId: '',

  // Webhook que recibe el registro (POST JSON). Debe responder 2xx.
  // Payload: { name, whatsapp, email, optin, tag, event_id, page_url, utm_*, fbp, fbc, submitted_at }
  formEndpoint: '',

  // Etiqueta con la que entra al CRM.
  tag: 'live-30sep',

  // Dónde se ve el live (se muestra en la página de gracias y en el evento de calendario).
  watchUrl: 'https://www.youtube.com/@KevinBelier/streams'
};
