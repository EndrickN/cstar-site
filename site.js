/* CSTAR site configuration and shared wiring.
   Edit SITE_CONFIG only. Empty values leave the hard-coded link in place. */
window.SITE_CONFIG = {
  price:        '$149',
  priceNote:    'one-time',
  buyUrl:       'https://nowpayments.io/payment?iid=5103220243',
  demoUrl:      'https://github.com/EndrickN/cstar-site/releases/latest/download/CSTAR_v1.0.exe',
  contactEmail: 'cstar.propulsion@gmail.com',
};

(function () {
  const cfg = window.SITE_CONFIG;
  const mailto = (subject) =>
    `mailto:${cfg.contactEmail}?subject=${encodeURIComponent(subject)}`;

  document.querySelectorAll('[data-price]').forEach((el) => {
    if (cfg.price) el.textContent = cfg.price;
  });
  document.querySelectorAll('[data-price-note]').forEach((el) => {
    if (cfg.priceNote) el.textContent = cfg.priceNote;
  });

  document.querySelectorAll('[data-buy]').forEach((a) => {
    if (cfg.buyUrl) {
      a.href = cfg.buyUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  document.querySelectorAll('[data-demo]').forEach((a) => {
    if (cfg.demoUrl) {
      a.href = cfg.demoUrl;
      a.setAttribute('download', '');
    }
  });

  document.querySelectorAll('[data-contact]').forEach((a) => {
    if (cfg.contactEmail) a.href = mailto('CSTAR enquiry');
  });
  document.querySelectorAll('[data-contact-text]').forEach((el) => {
    if (cfg.contactEmail) el.textContent = cfg.contactEmail;
  });

  document.querySelectorAll('[data-print]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  /* Entrance motion: one reveal per element, staggered within its group.
     Content is visible by default; the class is only added when motion runs. */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window && targets.length) {
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => {
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'))
        : [];
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--d', Math.min(index * 70, 280) + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
