/* =============================================
   AISHIA AGENCY — main.js
   Cursor · Navbar · Particles · Reveal · Stats
   ============================================= */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .service-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(1.8)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorTrail.style.borderColor = '#FFD700';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform      = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorTrail.style.borderColor = '#D4AF37';
    });
  });
})();

/* ── NAVBAR SCROLL ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();

/* ── TSPARTICLES ── */
(function initParticles() {
  if (typeof tsParticles === 'undefined') return;

  tsParticles.load('tsparticles', {
    background: { color: { value: 'transparent' } },
    fpsLimit: 45,
    particles: {
      number:   { value: 55, density: { enable: true, area: 900 } },
      color:    { value: ['#D4AF37', '#FFD700', '#8B6914'] },
      opacity:  { value: { min: 0.08, max: 0.4 }, animation: { enable: true, speed: 0.8, minimumValue: 0.05 } },
      size:     { value: { min: 0.8, max: 2.5 } },
      move: {
        enable: true,
        speed:  0.6,
        direction: 'none',
        random: true,
        out_mode: 'out',
      },
      links: {
        enable:   true,
        distance: 140,
        color:    '#D4AF37',
        opacity:  0.1,
        width:    0.8,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 },
      },
    },
    detectRetina: true,
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.round(easeOut(progress) * target);
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K'
        : current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target >= 1000
        ? (target / 1000).toFixed(target >= 10000 ? 0 : 1) + 'K'
        : target;
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);
})();

/* ── ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id            = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id ? '#D4AF37' : '';
        });
      }
    });
  }, { passive: true });
})();
