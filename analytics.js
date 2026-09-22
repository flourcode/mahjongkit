/* MahjongKit — Google Analytics (GA4)

   SETUP — EDIT ONE LINE ONLY:
   1. In Google Analytics: Admin -> Data streams -> Web.
   2. Copy the Measurement ID (it starts with "G-").
   3. Replace G-XXXXXXXXXX below with your real Measurement ID.

   Every HTML page on MahjongKit loads this file, so you only set it once.
   This file uses Google's current gtag.js tag. The filename "analytics.js"
   is just MahjongKit's local filename; it is not the retired Google
   Analytics analytics.js library.
*/
(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-XDQNL7NSLN'; // <-- PASTE YOUR GA4 MEASUREMENT ID HERE

  // Do nothing until a real GA4 ID has been entered.
  if (!/^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Load Google's tag asynchronously.
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(tag);

  // GA4 automatically sends the initial page_view for each page load.
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();
