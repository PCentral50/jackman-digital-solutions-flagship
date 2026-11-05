/* Jackman V3: accessible progressive scroll interaction for static pages. */
(() => {
  'use strict';
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = document.createElement('div');
  bar.className = 'motion-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  function drawProgress() {
    const root = document.documentElement;
    const distance = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / distance));
    bar.style.transform = 'scaleX(' + progress + ')';
    ticking = false;
  }
  function updateProgress() {
    if (!ticking) { ticking = true; requestAnimationFrame(drawProgress); }
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  window.addEventListener('pageshow', updateProgress);
  updateProgress();
  const elements = [...document.querySelectorAll('[data-reveal]')];
  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  // Set the class only after scripts have loaded; no content stays hidden when JS fails.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), {threshold: 0.06, rootMargin: '0px 0px -15px 0px'});
  elements.forEach(el => observer.observe(el));
  document.body.classList.add('motion-ready');
})();
