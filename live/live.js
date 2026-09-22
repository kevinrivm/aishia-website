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

  // ---------- Hora y VSL ----------
  var timeText = C.timeLabel || 'hora por confirmar';
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
      var title = 'Live de reapertura · Vibe Community VIP';
      var details = 'Live con Kevin Belier. Enlace: ' + (C.watchUrl || 'https://kevinbelier.cloud/live/');
      var g = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
        '&dates=' + utcStamp(start) + '/' + utcStamp(end) + '&details=' + encodeURIComponent(details) +
        '&location=' + encodeURIComponent(C.watchUrl || '');
      var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kevin Belier//Live//ES', 'BEGIN:VEVENT',
        'UID:live-30sep@kevinbelier.cloud', 'DTSTAMP:' + utcStamp(new Date()), 'DTSTART:' + utcStamp(start),
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
    if (!ok) return;

    if (!C.formEndpoint) {
      status.textContent = 'El registro todavía no está activo. Inténtalo en unos minutos.';
      status.classList.add('is-error');
      return;
    }

    var params = new URLSearchParams(location.search);
    var eventId = uuid();
    var payload = {
      name: name, whatsapp: wa, email: email, optin: optin, tag: C.tag || 'live-30sep',
      event_id: eventId, page_url: location.href, referrer: document.referrer || '',
      utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '', utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '', fbclid: params.get('fbclid') || '',
      fbp: getCookie('_fbp'), fbc: getCookie('_fbc'), submitted_at: new Date().toISOString(),
      // Antispam: hp debe llegar vacío; fill_seconds < 3 suele ser un bot.
      hp: form.website.value, fill_seconds: Math.round((Date.now() - loadedAt) / 1000)
    };

    btn.disabled = true; btn.textContent = 'Registrando…';
    fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
      .then(function () {
        if (window.fbq) {
          // Coincidencia avanzada manual: el pixel hashea estos datos (SHA-256) antes de enviarlos.
          fbq('init', C.metaPixelId, { em: email.toLowerCase(), ph: wa.replace(/\D/g, ''), fn: name.split(' ')[0].toLowerCase() });
          fbq('track', 'Lead', { content_name: C.tag || 'live-30sep' }, { eventID: eventId });
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
