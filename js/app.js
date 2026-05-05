/* === js/config.js === */
window.SITE_CONFIG = {
  businessName: 'Reparación de Refrigeradoras',
  phoneDisplay: '904 972 382',
  phoneE164: '+51904972382',
  whatsapp: '51904972382',
  domain: 'https://reparacionderefrigeradoras.com/',
  punycodeDomain: 'https://reparacionderefrigeradoras.com/',
  city: 'Lima',
  country: 'PE'
};

/* === mobile-scroll-safety.js === */
// Evita pantallas blancas en celulares: desactiva efectos pesados de scroll/touch.
(function(){
  const isMobileScrollSafe = Boolean(
    window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse), (max-width: 780px)').matches
  );
  window.__MOBILE_SCROLL_SAFE__ = isMobileScrollSafe;
  if (isMobileScrollSafe) document.documentElement.classList.add('mobile-scroll-safe');

  window.__revealAllForMobileScrollSafe = function(){
    document.body.classList.add('motion-ready');
    document.querySelectorAll('[data-reveal], .premium-reveal, .card, .service-card, .ref-service-card, .symptom, .step, .quote, .faq-item, .district-cloud span, .scroll-motion-item, .scroll-motion-section, .section-head').forEach((el) => {
      el.classList.add('visible', 'is-visible', 'is-inview');
      el.classList.remove('is-out-up', 'is-out-down');
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
      el.style.removeProperty('filter');
      el.style.removeProperty('will-change');
    });
  };
})();

;
/* === js/components.js === */
// Static GitHub-ready build: HTML components are already embedded in index.html.
// The custom event is fired after all defer scripts have registered their listeners.
(function () {
  function fireComponentsLoaded() {
    document.dispatchEvent(new CustomEvent('components:loaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireComponentsLoaded, { once: true });
  } else {
    window.setTimeout(fireComponentsLoaded, 0);
  }
})();

;
/* === js/navbar.js === */
document.addEventListener('components:loaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if(!menuBtn || !navLinks) return;
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  }));
});

;
/* === js/whatsapp.js === */
document.addEventListener('components:loaded', () => {
  const toggle = document.getElementById('waToggle');
  const panel = document.getElementById('waPanel');
  if(!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
});

// Oculta el botón flotante de WhatsApp al llegar al footer para evitar que tape el cierre de la web.
(function(){
  function initWhatsAppFooterHide(){
    const floatWa = document.querySelector('.float-wa');
    const footer = document.querySelector('footer, #pie');
    const panel = document.getElementById('waPanel');
    const toggle = document.getElementById('waToggle');
    if(!floatWa || !footer) return;

    function setHidden(hidden){
      floatWa.classList.toggle('is-footer-hidden', hidden);
      if(hidden && panel && toggle){
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }

    if('IntersectionObserver' in window){
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        setHidden(Boolean(entry && entry.isIntersecting));
      }, { root: null, threshold: 0.08, rootMargin: '0px 0px -12% 0px' });
      observer.observe(footer);
      return;
    }

    function fallback(){
      const rect = footer.getBoundingClientRect();
      setHidden(rect.top < window.innerHeight * 0.88 && rect.bottom > 0);
    }
    fallback();
    window.addEventListener('scroll', fallback, { passive:true });
    window.addEventListener('resize', fallback);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initWhatsAppFooterHide);
  }else{
    initWhatsAppFooterHide();
  }
})();

;
/* === js/animations.js === */
document.addEventListener('components:loaded', () => {
  document.body.classList.add('motion-ready');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileScrollSafe = Boolean(window.__MOBILE_SCROLL_SAFE__);
  const revealItems = document.querySelectorAll('[data-reveal], .card, .symptom, .step, .quote, .faq-item, .district-cloud span');

  if (mobileScrollSafe) {
    revealItems.forEach((item) => item.classList.add('visible', 'is-visible', 'is-inview'));
    if (typeof window.__revealAllForMobileScrollSafe === 'function') window.__revealAllForMobileScrollSafe();
    return;
  }

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealItems.forEach((item) => item.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 35, 280)}ms`);
      observer.observe(item);
    });
  }

  const parallaxItems = document.querySelectorAll('[data-parallax]');
  const updateParallax = () => {
    if (reduceMotion || window.innerWidth < 780) {
      parallaxItems.forEach((item) => item.style.transform = '');
      return;
    }
    const scrollY = window.scrollY || window.pageYOffset;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0);
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + scrollY;
      const distance = scrollY - itemTop;
      const y = Math.max(Math.min(distance * speed, 90), -90);
      item.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  updateParallax();

  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (reduceMotion || window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -5;
      const ry = ((x / rect.width) - 0.5) * 5;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
});

// Premium counters inspired by the uploaded reference layout
document.addEventListener('components:loaded', () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runCounter = (el) => {
    const target = Number(el.dataset.count || 0);
    if (!target) return;
    if (el.dataset.done === 'true') return;
    el.dataset.done = 'true';
    if (reduceMotion) { el.textContent = target.toLocaleString('en-US'); return; }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!('IntersectionObserver' in window)) { counters.forEach(runCounter); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { runCounter(entry.target); observer.unobserve(entry.target); } });
  }, { threshold: 0.35 });
  counters.forEach((counter) => observer.observe(counter));
});

// Extra hover movement for a non-static GitHub-ready landing
// Adds magnetic buttons, soft 3D cards and click ripples without requiring any framework.
document.addEventListener('components:loaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || window.__MOBILE_SCROLL_SAFE__) return;

  const interactiveSelectors = [
    '.ref-feature-grid article', '.ref-service-pillars article', '.service-card', '.gallery-item',
    '.symptom', '.step', '.testimonial-card', '.review-card', '.stats-grid div', '.wa-options a',
    '.btn', '.wa-toggle', '.wa-main-link', '.ref-proof-row div'
  ];
  const interactive = document.querySelectorAll(interactiveSelectors.join(','));

  interactive.forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    }, { passive: true });
  });

  const magnetic = document.querySelectorAll('.btn, .wa-toggle, .wa-main-link');
  magnetic.forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 900) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.10}px, ${y * 0.16}px) translateY(-5px) scale(1.025)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    el.addEventListener('click', (event) => {
      const ripple = document.createElement('span');
      ripple.className = 'hover-ripple';
      const rect = el.getBoundingClientRect();
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      el.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 680);
    });
  });

  const tiltTargets = document.querySelectorAll('.ref-feature-grid article, .ref-service-pillars article, .service-card, .testimonial-card, .stats-grid div, .step');
  tiltTargets.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -4.5;
      const ry = ((x / rect.width) - 0.5) * 4.5;
      card.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-12px) scale(1.018)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
});

;
/* === js/interactions.js === */
document.addEventListener('components:loaded', () => {
  document.querySelectorAll('.faq-q').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span:last-child').textContent = open ? '−' : '+';
    });
  });
});

;
/* === js/main.js === */
// Punto de entrada para mejoras futuras.

;
/* === js/hero-visible-parallax.js === */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.ref-hero');
  if (!hero || reduce || window.__MOBILE_SCROLL_SAFE__) return;

  let ticking = false;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateHeroParallax(){
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const progress = clamp((0 - rect.top) / Math.max(rect.height - vh * 0.18, 1), 0, 1);

    const mainShift = clamp(progress * 92, 0, 92);
    const bgShift = clamp(progress * -44, -44, 0);
    const cardA = clamp(progress * -48, -48, 0);
    const cardB = clamp(progress * 54, 0, 54);

    hero.style.setProperty('--hero-photo-shift', mainShift.toFixed(2) + 'px');
    hero.style.setProperty('--hero-bg-shift', bgShift.toFixed(2) + 'px');
    hero.style.setProperty('--hero-card-a-shift', cardA.toFixed(2) + 'px');
    hero.style.setProperty('--hero-card-b-shift', cardB.toFixed(2) + 'px');
  }

  function requestUpdate(){
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function(){
      updateHeroParallax();
      ticking = false;
    });
  }

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  window.addEventListener('load', updateHeroParallax, {once:true});
  updateHeroParallax();
})();

;
/* === js/navbar-hide-on-up.js === */
(function(){
  if (window.__MOBILE_SCROLL_SAFE__) return;
  const navbar = document.querySelector('.ref-navbar, .navbar');
  if (!navbar) return;
  let lastY = window.scrollY || document.documentElement.scrollTop || 0;
  let ticking = false;
  function updateNavbar(){
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;
    const diff = currentY - lastY;
    if (currentY <= 24 || diff < -8) {
      navbar.classList.remove('nav-hidden');
    } else if (diff > 6 && currentY > 88) {
      navbar.classList.add('nav-hidden');
    }
    lastY = currentY;
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateNavbar);
  }, { passive: true });
})();

;
/* === js/premium-polish-final.js === */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.__MOBILE_SCROLL_SAFE__) {
    const revealNow = () => { if (typeof window.__revealAllForMobileScrollSafe === 'function') window.__revealAllForMobileScrollSafe(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revealNow, { once:true });
    else revealNow();
    return;
  }

  // Ensure all reveal elements become visible even if previous scripts fail.
  const revealTargets = document.querySelectorAll('[data-reveal], .card, .service-card, .ref-service-card, .step, .gallery-item, .section-head');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // Duplicate marquees so they never leave blank space.
  const tracks = document.querySelectorAll('.ref-parts-track, .brand-track, .brand-track-logos-only, .ref-logo-strip');
  tracks.forEach((track) => {
    if (track.dataset.premiumCloned === 'true') return;
    const original = Array.from(track.children);
    if (!original.length) return;
    let safety = 0;
    while (track.scrollWidth < window.innerWidth * 2.25 && safety < 8) {
      original.forEach((node) => track.appendChild(node.cloneNode(true)));
      safety += 1;
    }
    track.dataset.premiumCloned = 'true';
  });

  // Hide navbar when user scrolls upward, show when scrolling downward or at the top.
  const navbar = document.querySelector('.ref-navbar, .navbar');
  if (navbar) {
    let lastY = window.scrollY || 0;
    let ticking = false;
    function navUpdate(){
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const diff = y - lastY;
      if (y <= 24) navbar.classList.remove('nav-hidden');
      else if (diff < -9) navbar.classList.add('nav-hidden');
      else if (diff > 9) navbar.classList.remove('nav-hidden');
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(navUpdate);
    }, { passive:true });
  }

  // Smooth controlled hero parallax.
  const hero = document.querySelector('.ref-hero');
  if (hero && !reduce) {
    let ticking = false;
    const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
    function updateHero(){
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const p = clamp((0 - rect.top) / Math.max(rect.height - vh * .2, 1), 0, 1);
      hero.style.setProperty('--hero-photo-shift', (p * 46).toFixed(2) + 'px');
      hero.style.setProperty('--hero-bg-shift', (p * -28).toFixed(2) + 'px');
      hero.style.setProperty('--hero-card-a-shift', (p * -22).toFixed(2) + 'px');
      hero.style.setProperty('--hero-card-b-shift', (p * 26).toFixed(2) + 'px');
      ticking = false;
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateHero); } };
    window.addEventListener('scroll', request, { passive:true });
    window.addEventListener('resize', request, { passive:true });
    updateHero();
  }

  // Gentle tilt for important cards only.
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.service-card, .ref-service-card, .ref-process .step, .ref-proof-row > div').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const r = card.getBoundingClientRect();
        const x = ((event.clientX - r.left) / r.width - .5) * 6;
        const y = ((event.clientY - r.top) / r.height - .5) * -6;
        card.style.transform = `translateY(-8px) rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();

;
/* === js/gallery-lightbox.js === */
(() => {
  const gallery = document.querySelector('#galeria .gallery-mosaic-clean');
  const lightbox = document.getElementById('galleryLightbox');
  const image = document.getElementById('galleryLightboxImg');
  const caption = document.getElementById('galleryLightboxCaption');
  if (!gallery || !lightbox || !image || !caption) return;

  const figures = [...gallery.querySelectorAll('.gallery-tile')];
  const items = figures.map((figure) => figure.querySelector('img')).filter(Boolean);
  const closeBtn = lightbox.querySelector('.gallery-lightbox-close');
  const prevBtn = lightbox.querySelector('.gallery-lightbox-prev');
  const nextBtn = lightbox.querySelector('.gallery-lightbox-next');
  let currentIndex = 0;
  let lastFocused = null;

  figures.forEach((figure, index) => {
    figure.setAttribute('tabindex', '0');
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `Ampliar imagen ${index + 1} de ${figures.length}`);
  });

  function render(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const selected = items[currentIndex];
    const figure = selected.closest('.gallery-tile');
    image.src = selected.currentSrc || selected.src;
    image.alt = selected.alt || 'Imagen ampliada del servicio técnico';
    caption.textContent = figure?.dataset.lightboxTitle || selected.alt || `Imagen ${currentIndex + 1} de ${items.length}`;
  }

  function open(index) {
    lastFocused = document.activeElement;
    render(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-lightbox-open');
    closeBtn?.focus({ preventScroll: true });
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lightbox-open');
    image.removeAttribute('src');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  }

  function next() { render(currentIndex + 1); }
  function prev() { render(currentIndex - 1); }

  figures.forEach((figure, index) => {
    figure.addEventListener('click', () => open(index));
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeBtn?.addEventListener('click', close);
  nextBtn?.addEventListener('click', (event) => { event.stopPropagation(); next(); });
  prevBtn?.addEventListener('click', (event) => { event.stopPropagation(); prev(); });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  window.addEventListener('keydown', (event) => {
    if (lightbox.getAttribute('aria-hidden') !== 'false') return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  });
})();

;
/* === js/scroll-premium-motion-final.js === */
(function(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navbar = document.querySelector('.ref-navbar, .navbar');
  let lastY = window.scrollY || document.documentElement.scrollTop || 0;
  let scrollDir = 'down';
  let ticking = false;
  let motionReady = false;

  if (window.__MOBILE_SCROLL_SAFE__) {
    const revealNow = () => { if (typeof window.__revealAllForMobileScrollSafe === 'function') window.__revealAllForMobileScrollSafe(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', revealNow, { once:true });
    else revealNow();
    return;
  }

  function currentY(){
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function setNavbar(){
    if (!navbar) return;
    const y = currentY();
    const delta = y - lastY;
    if (Math.abs(delta) > 2) scrollDir = delta > 0 ? 'down' : 'up';
    document.body.classList.toggle('scrolling-down', scrollDir === 'down');
    document.body.classList.toggle('scrolling-up', scrollDir === 'up');
    navbar.classList.toggle('nav-scrolling', y > 18);
    if (y <= 24 || delta < -8) {
      navbar.classList.remove('nav-hidden');
    } else if (delta > 6 && y > 88) {
      navbar.classList.add('nav-hidden');
    }
    lastY = y;
  }

  function setProgress(){
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((currentY()) / max, 0), 1) * 100;
    document.body.style.setProperty('--scroll-progress', progress.toFixed(2) + '%');
  }

  function updateDepth(){
    if (reduceMotion || window.innerWidth < 780) return;
    const y = currentY();
    document.querySelectorAll('[data-scroll-depth]').forEach((el) => {
      const speed = Number(el.getAttribute('data-scroll-depth') || 0.04);
      const rect = el.getBoundingClientRect();
      const center = rect.top + y + rect.height / 2;
      const dist = y + window.innerHeight / 2 - center;
      const move = Math.max(Math.min(dist * speed, 34), -34);
      el.style.setProperty('--scroll-y', move.toFixed(2) + 'px');
    });
  }

  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setNavbar();
      setProgress();
      updateDepth();
      ticking = false;
    });
  }

  function setInitialState(el){
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.04;
    if (visible) {
      el.classList.add('is-inview');
      el.classList.remove('is-out-up','is-out-down');
    } else if (rect.top >= window.innerHeight * 0.92) {
      el.classList.add('is-out-down');
    } else {
      el.classList.add('is-out-up');
    }
  }

  function prepareMotion(){
    if (motionReady) return;
    motionReady = true;

    const sections = Array.from(document.querySelectorAll('main > section, footer, .ref-final, .ref-footer-clean'));
    sections.forEach((section) => section.classList.add('scroll-motion-section'));

    const itemSelectors = [
      '.section-head', '.ref-hero-copy', '.ref-hero-device', '.ref-mobile-hero-card', '.ref-proof-row > div',
      '.ref-feature-grid article', '.ref-service-pillars article', '.service-card', '.gallery-item',
      '.ref-photo-row img', '.ref-testimonial-card', '.ref-testimonial-photo', '.ref-diagnosis-card',
      '.symptom', '.step', '.faq-item', '.stats-grid > div', '.ref-about-copy', '.ref-about-media',
      '.brand-logo-marquee', '.ref-parts-marquee', '.ref-final-inner > *', 'footer .container > *',
      '.ref-footer-clean .container > *', '.ref-professional .grid-3 > *', '.ref-laundry-row h2'
    ].join(',');

    const items = Array.from(document.querySelectorAll(itemSelectors));
    items.forEach((el, index) => {
      el.classList.add('scroll-motion-item');
      el.style.setProperty('--motion-delay', Math.min((index % 6) * 42, 210) + 'ms');
      setInitialState(el);
    });

    document.querySelectorAll('.ref-hero-device, .ref-testimonial-photo, .ref-about-media, .gallery-item:nth-child(2n)').forEach((el) => {
      el.classList.add('scroll-motion-right');
    });
    document.querySelectorAll('.ref-hero-copy, .ref-testimonial-card, .ref-about-copy, .gallery-item:nth-child(2n+1)').forEach((el) => {
      el.classList.add('scroll-motion-left');
    });
    document.querySelectorAll('.ref-main-fridge, .ref-float-card, .ref-device-glow, .ref-hero-bg img').forEach((el) => {
      el.classList.add('scroll-depth');
      if (!el.hasAttribute('data-scroll-depth')) el.setAttribute('data-scroll-depth', el.classList.contains('ref-hero-bg') ? '0.025' : '0.04');
    });
    document.querySelectorAll('.ref-float-card, .wa-toggle, .wa-main-link').forEach((el) => el.classList.add('scroll-float-soft'));

    if (!('IntersectionObserver' in window) || reduceMotion) {
      sections.forEach((s) => s.classList.add('is-inview'));
      items.forEach((el) => el.classList.add('is-inview'));
      return;
    }

    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        if (entry.isIntersecting) {
          target.classList.add('is-inview');
          target.classList.remove('is-out-up','is-out-down');
        } else {
          const leftAbove = entry.boundingClientRect.top < 0;
          target.classList.remove('is-inview');
          target.classList.toggle('is-out-up', leftAbove);
          target.classList.toggle('is-out-down', !leftAbove);
        }
      });
    }, { threshold: 0.09, rootMargin: '-2% 0px -2% 0px' });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-inview', entry.isIntersecting);
      });
    }, { threshold: 0.05, rootMargin: '-4% 0px -4% 0px' });

    sections.forEach((s) => sectionObserver.observe(s));
    items.forEach((el) => itemObserver.observe(el));
  }

  function init(){
    prepareMotion();
    setNavbar();
    setProgress();
    updateDepth();
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
  document.addEventListener('components:loaded', init, { once:true });
})();
