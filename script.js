/* PocketBill landing page — minimal vanilla JS for mobile nav + reveal + lightbox. */

(function () {
  'use strict';

  // -------------------------------------------------- Placeholder sync
  // Reads the centralized <meta name="pb-play-url"> and
  // <meta name="pb-support-email"> tags so the CTA href and the
  // contact email can be updated in one place.
  function getMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : '';
  }

  var playUrl = getMeta('pb-play-url');
  var supportEmail = getMeta('pb-support-email');

  if (playUrl) {
    document.querySelectorAll('[data-pb-cta="play"]').forEach(function (a) {
      a.setAttribute('href', playUrl);
    });
  }
  if (supportEmail) {
    document.querySelectorAll('[data-pb-cta="email"]').forEach(function (a) {
      a.setAttribute('href', 'mailto:' + supportEmail);
      if (a.textContent && a.textContent.indexOf('@') === -1) {
        a.textContent = supportEmail;
      }
    });
  }

  // -------------------------------------------------- Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile UX).
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------- Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback: just show everything.
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // -------------------------------------------------- Lightbox for screenshots
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.shot-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var img = card.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // -------------------------------------------------- Footer year
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

