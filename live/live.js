(function () {
  var C = window.LIVE_CONFIG || {};

  // ---------- Meta Pixel (solo si hay ID) ----------
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.metaPixelId);
    fbq('track', 'PageView');
  }

  // ---------- Fecha y horarios por país (todo sale de C.startsAt) ----------
  // Mismas zonas que usa n8n para los recordatorios: si cambia la hora en config.js,
  // aquí se recalcula todo y no hay textos de hora escritos a mano.
  var ZONAS = [
    { label: 'México', tz: 'America/Mexico_City' },
    { label: 'Colombia · Perú · Ecuador', tz: 'America/Bogota' },
    { label: 'Venezuela · Bolivia · R. Dominicana', tz: 'America/Caracas' },
    { label: 'Chile · Argentina · Uruguay', tz: 'America/Argentina/Buenos_Aires' },
    { label: 'España', tz: 'Europe/Madrid' }
  ];
  function horaEn(d, tz) {
    return d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz })
      .replace(/\s?a\.?\s?m\.?/i, ' a. m.').replace(/\s?p\.?\s?m\.?/i, ' p. m.');
  }
  function fechaEn(d, tz, opts) { return d.toLocaleDateString('es-MX', Object.assign({ timeZone: tz }, opts)); }
  var timeText = 'hora por confirmar';
  if (C.startsAt) {
    var inicio = new Date(C.startsAt), MX = 'America/Mexico_City';
    var hMx = horaEn(inicio, MX);
    timeText = hMx + ' (hora de México)';
    var dia = fechaEn(inicio, MX, { weekday: 'short' }).replace('.', '').slice(0, 3).toUpperCase();
    var num = fechaEn(inicio, MX, { day: 'numeric' });
    var mes = fechaEn(inicio, MX, { month: 'short' }).replace('.', '').slice(0, 3).toUpperCase();
    var largo = fechaEn(inicio, MX, { weekday: 'long', day: 'numeric', month: 'long' });
    largo = largo.charAt(0).toUpperCase() + largo.slice(1);
    var set = function (sel, fn) { document.querySelectorAll(sel).forEach(fn); };
    set('[data-live-day]', function (el) { el.innerHTML = dia + '<b>' + num + '</b>' + mes; });
    set('[data-live-hour]', function (el) { el.textContent = hMx; });
    set('[data-live-zone]', function (el) { el.textContent = 'México'; });
    set('[data-live-others]', function (el) {
      el.textContent = ZONAS.slice(1).map(function (z) { return horaEn(inicio, z.tz) + ' ' + z.label.split(' · ')[0]; }).join(' · ');
    });
    set('[data-live-table]', function (el) {
      el.innerHTML = largo + ':<br>' + ZONAS.map(function (z) { return '<b>' + horaEn(inicio, z.tz) + '</b> ' + z.label; }).join('<br>') +
        '<br>Si vives en otro país, te mandamos tu hora por WhatsApp.';
    });
    set('[data-live-longdate]', function (el) { el.textContent = largo + ' · ' + hMx + ' (México)'; });
    set('[data-live-short]', function (el) { el.textContent = dia.toLowerCase() + ' ' + num + ' ' + mes.toLowerCase() + ', ' + hMx.replace(':00', ''); });
  }
  document.querySelectorAll('[data-live-time]').forEach(function (el) { el.textContent = timeText; });

  // Video "fachada": muestra la miniatura y carga el reproductor de YouTube solo al dar clic.
  // Así la página carga rápido aunque tenga varios videos.
  function ytFacade(el, id, title) {
    el.classList.add('yt');
    el.innerHTML = '<button type="button" class="yt-play" aria-label="Reproducir: ' + title.replace(/"/g, '') + '">' +
      '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/hqdefault.jpg" alt="" loading="lazy" />' +
      '<span class="yt-btn" aria-hidden="true"></span></button>';
    el.querySelector('button').addEventListener('click', function () {
      el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="' + title.replace(/"/g, '') +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      if (window.fbq) fbq('trackCustom', 'VideoPlay', { video: title });
    });
  }

  var vsl = document.getElementById('vsl');
  if (vsl) {
    if (C.vslYoutubeId) ytFacade(vsl, C.vslYoutubeId, 'Video: live de reapertura');
    else vsl.hidden = true;
  }

  // ---------- Testimonios: carrusel horizontal con clips en silencio ----------
  var track = document.getElementById('clips');
  if (track) {
    var list = (C.testimonialClips || []).filter(function (c) { return c && c.src; });
    if (!list.length) { var sc = document.getElementById('casos'); if (sc) sc.hidden = true; }
    list.forEach(function (c) {
      var card = document.createElement('article'); card.className = 'lp-clip';
      var media = document.createElement('div'); media.className = 'lp-clip-media';
      var v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.poster = c.poster || '';
      v.dataset.src = c.src; v.setAttribute('aria-label', 'Testimonio de ' + (c.name || 'miembro'));
      var badge = document.createElement('span'); badge.className = 'lp-result'; badge.textContent = c.result || '';
      var sound = document.createElement('span'); sound.className = 'lp-sound'; sound.textContent = '🔊 Toca para escuchar';
      media.appendChild(v); if (c.result) media.appendChild(badge); media.appendChild(sound);
      var meta = document.createElement('div'); meta.className = 'lp-clip-meta';
      var n = document.createElement('strong'); n.textContent = c.name || '';
      var r = document.createElement('span'); r.textContent = c.role || '';
      meta.appendChild(n); meta.appendChild(r);
      if (c.quote) { var q = document.createElement('p'); q.textContent = '“' + c.quote + '”'; meta.appendChild(q); }
      card.appendChild(media); card.appendChild(meta); track.appendChild(card);

      media.addEventListener('click', function () {
        var playing = card.classList.contains('is-playing');
        track.querySelectorAll('.lp-clip.is-playing').forEach(function (o) {
          if (o === card) return; o.classList.remove('is-playing');
          var ov = o.querySelector('video'); ov.muted = true; ov.controls = false;
        });
        if (!playing) {
          if (!v.src) v.src = v.dataset.src;
          card.classList.add('is-playing'); v.muted = false; v.controls = true; v.currentTime = 0; v.play();
          if (window.fbq) fbq('trackCustom', 'VideoPlay', { video: 'Testimonio ' + (c.name || '') });
        }
      });
    });

    // Reproduce en silencio solo el video visible; pausa los que salen de pantalla.
    var clipVideos = track.querySelectorAll('video');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var vid = en.target;
          if (en.isIntersecting && en.intersectionRatio >= 0.6) {
            if (!vid.src) vid.src = vid.dataset.src;
            var p = vid.play(); if (p && p.catch) p.catch(function () {});
          } else if (!vid.closest('.lp-clip').classList.contains('is-playing') || !en.isIntersecting) {
            vid.pause();
          }
        });
      }, { threshold: [0, 0.6] });
      clipVideos.forEach(function (vid) { io.observe(vid); });
    }

    document.querySelectorAll('.lp-arrow').forEach(function (b) {
      b.addEventListener('click', function () {
        var first = track.querySelector('.lp-clip');
        var step = first ? first.getBoundingClientRect().width + 20 : 400;
        track.scrollBy({ left: step * Number(b.dataset.dir), behavior: 'smooth' });
      });
    });
  }

  // ---------- Cuenta regresiva ----------
  var cds = document.querySelectorAll('[data-countdown]');
  if (cds.length && C.startsAt) {
    var target = new Date(C.startsAt).getTime();
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var parts = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      cds.forEach(function (cd) {
        Object.keys(parts).forEach(function (k) { var el = cd.querySelector('[data-cd="' + k + '"]'); if (el) el.textContent = (parts[k] < 10 ? '0' : '') + parts[k]; });
      });
    };
    tick(); setInterval(tick, 1000);
  }

  // ---------- Modo en vivo / grabación (se activa solo por la hora) ----------
  // Desde liveOpensMin antes del inicio y hasta liveEndsAt: «Estamos en vivo» + botón directo a YouTube,
  // sin formulario. Después: «Ver la grabación». Se revisa cada 30 s para cambiar sin recargar.
  var form0 = document.getElementById('registro');
  if (C.liveUrl && C.startsAt && form0) {
    var vista = (new URLSearchParams(location.search).get('vista') || '').toLowerCase();
    var tOpen = new Date(C.startsAt).getTime() - (C.liveOpensMin || 20) * 60000;
    var tEnd = C.liveEndsAt ? new Date(C.liveEndsAt).getTime() : new Date(C.startsAt).getTime() + 150 * 60000;
    var estadoActual = '';
    var estado = function () {
      if (vista === 'envivo' || vista === 'grabacion') return vista;
      var n = Date.now();
      return n < tOpen ? '' : (n < tEnd ? 'envivo' : 'grabacion');
    };
    var aplicar = function () {
      var e = estado();
      if (!e || e === estadoActual) return;
      estadoActual = e;
      var vivo = e === 'envivo';
      var txtBtn = vivo ? 'Entrar al live' : 'Ver la grabación';
      document.body.classList.add('lp-modo-' + e);
      var pill = document.querySelector('.lp-pill');
      if (pill) pill.innerHTML = vivo ? '<span class="lp-dot lp-dot-vivo"></span> En vivo ahora · en YouTube' : '<span class="lp-dot"></span> Ya pasó · quedó grabado';
      document.querySelectorAll('[data-countdown]').forEach(function (cd) { cd.hidden = true; cd.style.display = 'none'; });
      form0.innerHTML =
        '<h2>' + (vivo ? '🔴 Estamos en vivo' : 'El live ya pasó') + '</h2>' +
        '<p>' + (vivo ? 'Entra ahora. Es gratis y no necesitas registrarte.' : 'Quedó grabado completo. Velo aquí, es gratis.') + '</p>' +
        '<a class="btn btn-primary" href="' + C.liveUrl + '" target="_blank" rel="noopener" data-entrar-live>' + txtBtn + ' <span class="arrow">→</span></a>';
      document.querySelectorAll('a[href="#registro"]').forEach(function (a) {
        a.href = C.liveUrl; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-entrar-live', '');
        a.innerHTML = txtBtn + (a.classList.contains('btn-sm') ? '' : ' <span class="arrow">→</span>');
      });
      var finalH2 = document.querySelector('.lp-final h2');
      if (finalH2) finalH2.textContent = vivo ? 'Estamos en vivo.' : 'Quedó grabado.';
      var stickyTxt = document.querySelector('#lp-sticky > span');
      if (stickyTxt) stickyTxt.innerHTML = vivo ? '<b>🔴 En vivo ahora</b>' : '<b>Live grabado</b>';
      document.querySelectorAll('[data-entrar-live]').forEach(function (a) {
        a.addEventListener('click', function () { if (window.fbq) fbq('trackCustom', vivo ? 'EntrarLive' : 'VerGrabacion'); });
      });
    };
    aplicar(); setInterval(aplicar, 30000);
  }

  // ---------- Barra fija en celular (aparece cuando el formulario ya no se ve) ----------
  var sticky = document.getElementById('lp-sticky'), reg = document.getElementById('registro');
  if (sticky && reg) {
    var updateSticky = function () {
      var r = reg.getBoundingClientRect();
      sticky.hidden = r.bottom > 0 && r.top < window.innerHeight; // oculto mientras el formulario se ve
    };
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
    updateSticky();
  }

  // ---------- Calendario (página de gracias) ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function utcStamp(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  }
  var cal = document.getElementById('calendar-actions');
  if (cal) {
    if (C.startsAt) {
      var start = new Date(C.startsAt), end = new Date(start.getTime() + (C.durationMin || 90) * 60000);
      var title = 'Live: ' + (C.title || 'Kevin Belier');
      var details = 'Live gratis con Kevin Belier. Enlace: ' + (C.watchUrl || 'https://kevinbelier.cloud/live/');
      var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
        '&dates=' + utcStamp(start) + '/' + utcStamp(end) + '&details=' + encodeURIComponent(details) +
        '&location=' + encodeURIComponent(C.watchUrl || '');
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kevin Belier//Live//ES', 'BEGIN:VEVENT',
        'UID:' + (C.tag || 'live') + '@kevinbelier.cloud', 'DTSTAMP:' + utcStamp(new Date()), 'DTSTART:' + utcStamp(start),
        'DTEND:' + utcStamp(end), 'SUMMARY:' + title, 'DESCRIPTION:' + details, 'URL:' + (C.watchUrl || ''),
        'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var icsUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      cal.innerHTML = '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + g + '">Agregar a Google Calendar</a>' +
        '<a class="btn btn-ghost" download="live-kevin-belier.ics" href="' + icsUrl + '">Descargar para Apple / Outlook</a>';
    } else {
      cal.innerHTML = '<p class="form-hint">Te mandamos la hora exacta y el enlace por WhatsApp y correo.</p>';
    }
  }

  // ---------- Formulario ----------
  var form = document.getElementById('live-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var btn = form.querySelector('button[type="submit"]');
  var loadedAt = Date.now();

  function getCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'ev-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }
  function setError(field, msg) {
    var wrap = form.querySelector('[data-field="' + field + '"]');
    if (wrap) { wrap.classList.toggle('has-error', !!msg); var e = wrap.querySelector('.field-error'); if (e) e.textContent = msg || ''; }
  }

  // «¿Cómo te enteraste?»: pide el detalle solo cuando sirve para atribuir.
  var DETALLE = {
    youtube: { label: '¿Cuál video? (el título o de qué trataba)', placeholder: 'Ej.: el del CRM con IA', req: false },
    referido: { label: '¿Quién te lo recomendó?', placeholder: 'Su nombre', req: false },
    anuncio: { label: '¿Dónde viste el anuncio?', placeholder: 'Facebook, Instagram, YouTube…', req: false },
    otro: { label: '¿Dónde?', placeholder: 'Cuéntanos en pocas palabras', req: true }
  };
  var detWrap = form.querySelector('[data-field="como_detalle"]');
  var detLabel = form.querySelector('[data-detalle-label]');
  function syncDetalle() {
    var d = DETALLE[form.como.value];
    detWrap.hidden = !d;
    if (d) { detLabel.textContent = d.label; form.como_detalle.placeholder = d.placeholder; }
    else { form.como_detalle.value = ''; setError('como_detalle', ''); }
  }
  form.como.addEventListener('change', syncDetalle);

  // País sugerido por la clave del WhatsApp (solo si aún no eligió).
  var PREFIJOS = [['1809', 'DO'], ['1829', 'DO'], ['1849', 'DO'], ['52', 'MX'], ['57', 'CO'], ['54', 'AR'], ['56', 'CL'], ['51', 'PE'], ['593', 'EC'],
    ['34', 'ES'], ['1', 'US'], ['58', 'VE'], ['591', 'BO'], ['502', 'GT'], ['503', 'SV'], ['504', 'HN'], ['505', 'NI'], ['506', 'CR'],
    ['507', 'PA'], ['595', 'PY'], ['598', 'UY']];
  form.whatsapp.addEventListener('blur', function () {
    if (form.pais.value) return;
    var dg = form.whatsapp.value.replace(/[^\d+]/g, '');
    if (dg.charAt(0) !== '+') return;
    dg = dg.slice(1);
    var hit = PREFIJOS.filter(function (p) { return dg.indexOf(p[0]) === 0; })
      .sort(function (a, b) { return b[0].length - a[0].length; })[0];
    if (hit) form.pais.value = hit[1];
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    status.textContent = ''; status.className = 'form-status';

    var name = form.name.value.trim();
    var wa = form.whatsapp.value.replace(/[^\d+]/g, '');
    var email = form.email.value.trim();
    var optin = form.optin.checked;
    var ok = true;

    setError('name', name.length < 2 ? 'Escribe tu nombre.' : ''); if (name.length < 2) ok = false;
    var waDigits = wa.replace(/\D/g, '');
    var waOk = wa.charAt(0) === '+' && waDigits.length >= 10 && waDigits.length <= 15;
    setError('whatsapp', waOk ? '' : 'Incluye la clave de país, por ejemplo +52 462 123 4567.'); if (!waOk) ok = false;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    setError('email', emailOk ? '' : 'Revisa tu correo.'); if (!emailOk) ok = false;
    setError('optin', optin ? '' : 'Necesitamos tu permiso para mandarte el enlace y los recordatorios.'); if (!optin) ok = false;
    var pais = form.pais.value, como = form.como.value, comoDet = form.como_detalle.value.trim();
    setError('pais', pais ? '' : 'Elige tu país.'); if (!pais) ok = false;
    setError('como', como ? '' : 'Elige una opción.'); if (!como) ok = false;
    var detReq = DETALLE[como] && DETALLE[como].req && !comoDet;
    setError('como_detalle', detReq ? 'Cuéntanos dónde.' : ''); if (detReq) ok = false;
    if (!ok) return;

    if (!C.formEndpoint) {
      status.textContent = 'El registro todavía no está activo. Inténtalo en unos minutos.';
      status.classList.add('is-error');
      return;
    }

    var params = new URLSearchParams(location.search);
    var eventId = uuid();
    var payload = {
      name: name, whatsapp: wa, email: email, optin: optin, tag: C.tag || '',
      pais: pais, como: como, como_detalle: comoDet,
      event_id: eventId, page_url: location.href, referrer: document.referrer || '',
      utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '', utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '', fbclid: params.get('fbclid') || '',
      fbp: getCookie('_fbp'), fbc: getCookie('_fbc'), submitted_at: new Date().toISOString(),
      // Antispam: hp debe llegar vacío; fill_seconds < 3 suele ser un bot.
      hp: form.website.value, fill_seconds: Math.round((Date.now() - loadedAt) / 1000)
    };

    btn.disabled = true; btn.textContent = 'Registrando…';
    // Reintento: si n8n tarda o responde 5xx/429 (16-nov se saturó y devolvía 503),
    // se reintenta sola hasta 4 veces antes de mostrar el error. Mismo event_id:
    // n8n deduplica por WhatsApp, así que un reintento no crea registros dobles.
    var ESPERAS = [2000, 4000, 8000];
    function enviar(intento) {
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = ctl ? setTimeout(function () { ctl.abort(); }, 15000) : null;
      return fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined })
        .then(function (r) {
          if (timer) clearTimeout(timer);
          if (r.ok) return r;
          var err = new Error('HTTP ' + r.status); err.reintentar = r.status >= 500 || r.status === 429; throw err;
        }, function (e) { if (timer) clearTimeout(timer); e.reintentar = true; throw e; })
        .catch(function (e) {
          if (!e.reintentar || intento >= ESPERAS.length) throw e;
          btn.textContent = 'Registrando… un momento';
          return new Promise(function (ok) { setTimeout(ok, ESPERAS[intento]); }).then(function () { return enviar(intento + 1); });
        });
    }
    enviar(0)
      .then(function () {
        if (window.fbq) {
          // Coincidencia avanzada manual: el pixel hashea estos datos (SHA-256) antes de enviarlos.
          fbq('init', C.metaPixelId, { em: email.toLowerCase(), ph: wa.replace(/\D/g, ''), fn: name.split(' ')[0].toLowerCase() });
          fbq('track', 'Lead', { content_name: C.tag || 'live' }, { eventID: eventId });
        }
        try { sessionStorage.setItem('live_name', name.split(' ')[0]); } catch (e) {}
        setTimeout(function () { location.href = '/live/gracias/'; }, 350);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Quiero mi lugar';
        status.textContent = 'No pudimos registrarte. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp al +52 462 134 9768.';
        status.classList.add('is-error');
      });
  });
})();
