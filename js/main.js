/* ==========================================================
   MAIN.JS — Sourav Verma Portfolio
========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initMobileNav();
  initScrollAnimations();
  initCounters();
  initCampaignTabs();
  initCarousels();
  initFilterTabs();
  initSmoothScroll();
});

/* ── NAV SCROLL BEHAVIOR ── */
function initNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
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
    mobileNav.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.className = mobileNav.classList.contains('open')
        ? 'fas fa-times'
        : 'fas fa-bars';
    }
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
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
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
          const target = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
          const duration = 1800;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const value = eased * target;
            el.textContent = prefix + value.toFixed(decimals) + suffix;
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = prefix + target.toFixed(decimals) + suffix;
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) {
    observer.observe(el);
  });
}

/* ── CAMPAIGN TABS ── */
function initCampaignTabs() {
  const tabs = document.querySelectorAll('.campaign-tab');
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
  const carousels = document.querySelectorAll('.carousel-track');

  carousels.forEach(function (track) {
    const id = track.dataset.carouselId || Math.random();
    let paused = false;
    let lastTime = null;
    const speed = parseFloat(track.dataset.speed || '0.6');

    // Pause on hover/touch
    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    track.addEventListener('touchend',   function () {
      setTimeout(function () { paused = false; }, 1500);
    }, { passive: true });

    function autoScroll(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!paused) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll > 0) {
          track.scrollLeft += speed * (delta / 16.67);
          if (track.scrollLeft >= maxScroll - 2) {
            track.scrollLeft = 0;
          }
        }
      }
      requestAnimationFrame(autoScroll);
    }

    requestAnimationFrame(autoScroll);

    // Arrow controls
    const carouselOuter = track.closest('.carousel-outer');
    if (carouselOuter) {
      const prevBtn = carouselOuter.querySelector('.carousel-arrow.prev');
      const nextBtn = carouselOuter.querySelector('.carousel-arrow.next');
      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          track.scrollBy({ left: -340, behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          track.scrollBy({ left: 340, behavior: 'smooth' });
        });
      }
    }
  });
}

/* ── PROJECT/BUILD FILTER TABS ── */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
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
          // reset featured span
          if (card.dataset.featured === 'true') card.classList.add('featured');
        } else {
          const tags = card.dataset.tags || '';
          if (tags.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
          card.classList.remove('featured');
        }
      });
    });
  });
}

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68'
  );

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}
