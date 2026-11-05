/* V4 progressive enrichment: filter controls and two quote pathways. No network, storage or payment calls. */
(() => {
 'use strict';
 const qs = new URLSearchParams(window.location.search);
 const intentField = document.getElementById('quoteIntent');
 const validIntents = new Set(['standard','custom','unsure']);
 if (intentField && validIntents.has(qs.get('intent'))) intentField.value = qs.get('intent');
 const form = document.getElementById('projectBrief');
 if (form && intentField) {
   // Update the existing listener's generated message via an explicit preview shown before compose.
   // The existing script remains responsible for WhatsApp navigation and validation.
   let intentText = document.getElementById('v4IntentStatus');
   if (!intentText) {intentText=document.createElement('p');intentText.id='v4IntentStatus';intentText.className='v4-input-help';intentText.setAttribute('aria-live','polite');intentField.after(intentText);}
   const reflect = () => { intentText.textContent = intentField.value === 'standard' ? 'Standard package outline requested; final price is confirmed by written quote.' : intentField.value === 'custom' ? 'Custom scope requested; pricing follows the agreed requirements.' : 'We will help identify the right starting point.'; };
   intentField.addEventListener('change', reflect); reflect();
 }
 const filters = [...document.querySelectorAll('[data-package-filter]')];
 const cards = [...document.querySelectorAll('[data-package-category]')];
 const status = document.getElementById('v4FilterStatus');
 if (filters.length && cards.length) {
   filters.forEach(button => button.addEventListener('click', () => {
     const value = button.dataset.packageFilter;
     filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
     let count=0;
     cards.forEach(card => {
       const shown = value === 'all' || card.dataset.packageCategory === value;
       card.hidden = !shown;
       if (shown) { count++; card.classList.add('visible'); }
     });
     if (status) status.textContent = `Showing ${count} ${count === 1 ? 'offer outline' : 'offer outlines'}. All prices are indicative.`;
   }));
 }
})();