/* Jackman Flagship V3 — static-first navigation and WhatsApp enquiry. No storage/API. */
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  if (toggle && nav) {
    let lastOpen = false;
    const close = (focusToggle = false) => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      document.body.classList.remove('nav-open');
      if (focusToggle) toggle.focus();
      lastOpen = false;
    };
    toggle.addEventListener('click', () => {
      const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
      if (!shouldOpen) { close(); return; }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
      nav.classList.add('open');
      document.body.classList.add('nav-open');
      lastOpen = true;
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && lastOpen) close(true); });
    document.addEventListener('pointerdown', event => {
      if (lastOpen && !nav.contains(event.target) && !toggle.contains(event.target)) close();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 860 && lastOpen) close(); }, {passive: true});
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
  const form = document.getElementById('projectBrief');
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const serviceField = form.elements.namedItem('service');
    const prior = params.get('service');
    if (prior && serviceField && serviceField.options) {
      const normalise = value => value.trim().toLowerCase().replace(/\s+/g, ' ');
      const serviceAliases = {
        'websites': 'New business website',
        'landing pages': 'Landing page (help me choose)',
        'landing-pages': 'Landing page (help me choose)',
        'marketing': 'Marketing & local SEO',
        'care': 'Care',
        'bookings': 'Booking or appointment system',
        'ecommerce': 'Ecommerce / online store'
      };
      const requested = serviceAliases[normalise(prior)] || prior;
      const match = Array.from(serviceField.options).find(option => normalise(option.textContent) === normalise(requested));
      if (match) serviceField.value = match.value;
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const nameInput = form.elements.namedItem('name');
      const businessInput = form.elements.namedItem('business');
      const detailInput = form.elements.namedItem('message');
      const feedback = document.getElementById('formFeedback');
      if (!form.checkValidity()) {
        if (feedback) feedback.textContent = 'Please complete the required fields before continuing.';
        form.reportValidity(); return;
      }
      const name = nameInput.value.trim(), business = businessInput.value.trim();
      const intent = form.elements.namedItem('intent')?.value || 'unsure';
      const intentLabel = intent === 'standard' ? 'Published package outline (pending written quote)' : intent === 'custom' ? 'Custom quotation' : 'Advice on which package to choose';
      const service = serviceField.value.trim(), detail = detailInput?.value?.trim() || '';
      if (!name || !business || !service) {
        if (feedback) feedback.textContent = 'Please complete your name, business and preferred service.';
        if (!name) nameInput.focus(); else if (!business) businessInput.focus(); else serviceField.focus();
        return;
      }
      if (feedback) feedback.textContent = 'Opening an editable WhatsApp message. Nothing has been sent yet.';
      const message = `Hello Jackman Digital Solutions, I'd like to discuss a project.

Name: ${name}
Business: ${business}
Interested in: ${service}
Quotation path: ${intentLabel}${detail ? `
Project details: ${detail}` : ''}

Please let me know the next step.`;
      // Use same-tab navigation so the compose flow works reliably on mobile browsers.
      window.location.assign('https://wa.me/27744679979?text=' + encodeURIComponent(message));
    });
  }
})();
