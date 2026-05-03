/* ==========================================================
   MAIN.JS — Sourav Verma Portfolio v3
========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initHeroEntry();
  initNav();
  initMobileNav();
  initScrollAnimations();
  initCursorFollower();
  initMagneticButtons();
  initCardTilt();
  initCounters();
  initCampaignTabs();
  initCarousels();
  initFilterTabs();
  initSmoothScroll();
});

/* ── HERO ENTRY ANIMATIONS ── */
function initHeroEntry() {
  const els = document.querySelectorAll('.hero-el');
  if (!els.length) return;
  // Small RAF delay so CSS transitions fire
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      els.forEach(function (el) {
        el.classList.add('loaded');
      });
    });
  });
}

/* ── NAV ── */
function initNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ── MOBILE NAV ── */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      const icon = hamburger.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      const icon = hamburger.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}

/* ── SCROLL-TRIGGERED ANIMATIONS ── */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate, .animate-left, .animate-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );

  targets.forEach(function (el) { observer.observe(el); });
}

/* ── CURSOR FOLLOWER ── */
function initCursorFollower() {
  const cursor = document.getElementById('cursor-follower');
  if (!cursor) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let raf;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function tick() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)';
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  const hoverTargets = document.querySelectorAll('a, button, .build-card, .blog-card, .principle-card, .interest-item, .exp-card');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hovering'); });
  });

  document.addEventListener('mouseleave', function () { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { cursor.style.opacity = '1'; });
}

/* ── MAGNETIC BUTTONS ── */
function initMagneticButtons() {
  const mediaQuery = window.matchMedia('(pointer: fine)');
  if (!mediaQuery.matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const btns = document.querySelectorAll('.btn-primary, .btn-outline-light, .btn-nav-cta');
  btns.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.18;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.18;
      btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      btn.style.transition = 'transform 0.1s linear';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s, box-shadow 0.2s, color 0.2s';
    });
  });
}

/* ── CARD TILT ── */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.build-card, .principle-card, .blog-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX = y * -5;
      const rotY = x *  5;
      card.style.transform = 'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
      card.style.transition = 'transform 0.1s linear';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s, border-color 0.25s';
    });
  });
}

/* ── METRIC COUNTERS ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target   = parseFloat(el.dataset.count);
          const prefix   = el.dataset.prefix  || '';
          const suffix   = el.dataset.suffix  || '';
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
          const duration = 1800;
          const start    = performance.now();

          function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 4);
            el.textContent = prefix + (eased * target).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = prefix + target.toFixed(decimals) + suffix;
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) { observer.observe(el); });
}

/* ── CAMPAIGN TABS ── */
function initCampaignTabs() {
  const tabs     = document.querySelectorAll('.campaign-tab');
  const previews = document.querySelectorAll('.campaign-preview');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.dataset.tab;
      tabs.forEach(function (t) { t.classList.remove('active'); });
      previews.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      const preview = document.querySelector('.campaign-preview[data-preview="' + target + '"]');
      if (preview) preview.classList.add('active');
    });
  });
}

/* ── HORIZONTAL CAROUSELS ── */
function initCarousels() {
  document.querySelectorAll('.carousel-track').forEach(function (track) {
    let paused   = false;
    let lastTime = null;
    const speed  = parseFloat(track.dataset.speed || '0.6');

    track.addEventListener('mouseenter',  function () { paused = true; });
    track.addEventListener('mouseleave',  function () { paused = false; });
    track.addEventListener('touchstart',  function () { paused = true; },  { passive: true });
    track.addEventListener('touchend',    function () { setTimeout(function () { paused = false; }, 1500); }, { passive: true });

    function autoScroll(ts) {
      if (!lastTime) lastTime = ts;
      const delta = ts - lastTime;
      lastTime = ts;
      if (!paused) {
        const max = track.scrollWidth - track.clientWidth;
        if (max > 0) {
          track.scrollLeft += speed * (delta / 16.67);
          if (track.scrollLeft >= max - 2) track.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);

    const outer = track.closest('.carousel-outer');
    if (outer) {
      const prev = outer.querySelector('.carousel-arrow.prev');
      const next = outer.querySelector('.carousel-arrow.next');
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -340, behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left:  340, behavior: 'smooth' }); });
    }
  });
}

/* ── FILTER TABS ── */
function initFilterTabs() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.build-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const filter = tab.dataset.filter;
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      cards.forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
          if (card.dataset.featured === 'true') card.classList.add('featured');
        } else {
          const tags = card.dataset.tags || '';
          card.style.display = tags.includes(filter) ? '' : 'none';
          card.classList.remove('featured');
        }
      });
    });
  });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68'
  );
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    });
  });
}
