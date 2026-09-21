/* MahjongKit — search.js
   Client-side search over the list in search-index.js. No server, no tracking.
   Matches against title, description, category and keywords. Shows results
   instantly as you type, and also reads ?q= from the address bar so the
   top-bar search form on other pages works.
*/
(function () {
  'use strict';
  var input = document.getElementById('search-input');
  var out = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  if (!input || !out || typeof SEARCH_INDEX === 'undefined') return;

  // Index URLs are site-root paths like "/rules/joker-rules/". The search page lives at
  // /search/, so "../" reaches the site root whether hosted or opened from a folder.
  function link(u) {
    var rel = '../' + u.replace(/^\//, '');
    if (window.location.protocol === 'file:' && /\/$/.test(rel)) rel += 'index.html';
    return rel;
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[’']/g, ''); }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function highlight(text, terms) {
    var safe = escapeHtml(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      safe = safe.replace(re, '<mark>$1</mark>');
    });
    return safe;
  }

  function score(entry, terms) {
    var title = norm(entry.title), desc = norm(entry.description), cat = norm(entry.category);
    var kws = (entry.keywords || []).map(norm);
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (title.indexOf(t) !== -1) hit += 6;
      if (kws.some(function (k) { return k === t; })) hit += 5;
      else if (kws.some(function (k) { return k.indexOf(t) !== -1; })) hit += 3;
      if (desc.indexOf(t) !== -1) hit += 2;
      if (cat === t) hit += 2;
      if (!hit) return 0; // every term must match somewhere
      total += hit;
    }
    return total;
  }

  function render(q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    out.innerHTML = '';
    if (!terms.length) { status.textContent = 'Type a word like "joker", "wall" or "soap".'; return; }
    var results = SEARCH_INDEX.map(function (e) { return { e: e, s: score(e, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 20);
    if (!results.length) {
      status.textContent = 'No guides match "' + q + '". Try a shorter word, or browse the Rules section.';
      return;
    }
    status.textContent = results.length + (results.length === 1 ? ' guide' : ' guides') + ' for "' + q + '"';
    var ul = document.createElement('ul');
    ul.className = 'list';
    results.forEach(function (r) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="' + escapeHtml(link(r.e.url)) + '">' +
        '<span class="list__text"><span class="list__headline">' + highlight(r.e.title, terms) + '</span>' +
        '<span class="list__support">' + escapeHtml(r.e.category) + ' · ' + highlight(r.e.description, terms) + '</span></span>' +
        '<span class="list__trail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></span></a>';
      ul.appendChild(li);
    });
    out.appendChild(ul);
  }

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  if (initial) input.value = initial;
  render(input.value);
  input.addEventListener('input', function () { render(input.value); });
  var form = input.form;
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); render(input.value); input.blur(); });
  input.focus();
})();
