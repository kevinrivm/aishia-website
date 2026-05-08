/* =============================================
   AISHIA — main.js
   Navbar · Reveal · Counters
   ============================================= */

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

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

  els.forEach(el => observer.observe(el));
})();

/* ── COUNTERS ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function format(n) {
    if (n >= 10000) return Math.round(n / 1000) + 'K';
    if (n >= 1000)  return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  function animate(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.querySelector('.suffix');
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const current  = Math.round(easeOut(progress) * target);
      el.firstChild.textContent = format(current);
      if (suffix) el.appendChild(suffix);
      if (progress < 1) requestAnimationFrame(step);
      else {
        el.firstChild.textContent = format(target);
        if (suffix) el.appendChild(suffix);
      }
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animate);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  obs.observe(counters[0]);
})();

/* ── ACTIVE NAV LINK ON SCROLL ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav-link:not(.nav-cta)');
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    const y = window.scrollY + 140;
    let activeId = '';
    sections.forEach(s => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) activeId = s.id;
    });
    links.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + activeId;
      link.style.color = isActive ? 'var(--text)' : '';
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();
