/* MahjongKit — main.js
   Small progressive enhancements only. Every page works without this file.
   1. Navigation drawer (opens the <dialog>, closes on backdrop click / Escape)
   2. Table of contents opens on wide screens and highlights the section you are reading
   3. Folder preview: when the site is opened straight from a folder (file://),
      links to folders get "index.html" added so they work without a web server
*/
(function () {
  'use strict';

  /* 1. Navigation drawer ------------------------------------------------- */
  var drawer = document.getElementById('nav-drawer');
  var openers = document.querySelectorAll('[data-open-drawer]');
  if (drawer && typeof drawer.showModal === 'function') {
    openers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        drawer.showModal();
        btn.setAttribute('aria-expanded', 'true');
        // Focus the dialog itself, not the first link: focusing a link makes
        // iOS Safari paint a focus ring around the logo when the menu opens.
        if (typeof drawer.focus === 'function') drawer.focus();
      });
    });
    drawer.addEventListener('close', function () {
      openers.forEach(function (btn) { btn.setAttribute('aria-expanded', 'false'); });
    });
    drawer.addEventListener('click', function (e) {
      // Click on the backdrop (outside the drawer's own box) closes it.
      var r = drawer.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) drawer.close();
    });
    var closeBtn = drawer.querySelector('[data-close-drawer]');
    if (closeBtn) closeBtn.addEventListener('click', function () { drawer.close(); });
  }

  /* 2. Table of contents ------------------------------------------------ */
  var toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute('href').slice(1));
      var el = document.getElementById(id);
      if (el) map[id] = a;
    });
    var ids = Object.keys(map);
    if (ids.length) {
      var setActive = function (id) {
        links.forEach(function (a) { a.classList.remove('is-active'); });
        if (map[id]) map[id].classList.add('is-active');
      };
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
      ids.forEach(function (id) { observer.observe(document.getElementById(id)); });
      // On wide screens open the list by default; on phones keep it collapsed.
      if (window.matchMedia('(min-width: 840px)').matches) toc.setAttribute('open', '');
    }
  }

  /* 3. Folder preview (file://) ----------------------------------------- */
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h || /^(https?:|mailto:|tel:|#|javascript:)/i.test(h)) return;
      var parts = h.split('#');
      if (/\/$/.test(parts[0])) {
        parts[0] += 'index.html';
        a.setAttribute('href', parts.join('#'));
      }
    });
    var f = document.querySelector('form.app-search');
    if (f) f.setAttribute('action', f.getAttribute('action').replace(/\/$/, '/index.html'));
  }
})();
