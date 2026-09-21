/* MahjongKit — flower-match.js
   Flower Match: a calm, Mahjong-inspired matching game.
   Every board has exactly one identical pair. Find it, and a fresh board deals.
   All flower art is drawn in code as SVG (no image files, nothing copied).
   Works entirely in the browser: no accounts, no tracking, no timers.
*/
(function () {
  'use strict';

  /* ---------- Retro palette ---------- */
  var C = {
    pink: '#F4A7C2', rose: '#E86A97', orange: '#F0672E', red: '#D9432F', brown: '#7E4527',
    green: '#3B9A45', leaf: '#2C7A38', blue: '#2F55A6', mustard: '#D3912C', cream: '#F8ECD4',
    lilac: '#B08AC8', teal: '#2E8C86', cocoa: '#5B3A2A'
  };

  /* ---------- Flower designs (each is visually distinct) ---------- */
  var DESIGNS = [
    { t: 'round',   n: 5,  a: C.pink,    b: C.orange,  name: 'Pink five-petal' },
    { t: 'round',   n: 6,  a: C.orange,  b: C.cream,   name: 'Orange six-petal' },
    { t: 'round',   n: 8,  a: C.brown,   b: C.pink,    name: 'Brown eight-petal' },
    { t: 'round',   n: 4,  a: C.mustard, b: C.cream,   name: 'Mustard clover' },
    { t: 'round',   n: 6,  a: C.green,   b: C.pink,    name: 'Green six-petal' },
    { t: 'round',   n: 7,  a: C.blue,    b: C.cream,   name: 'Blue seven-petal' },
    { t: 'round',   n: 5,  a: C.rose,    b: C.mustard, name: 'Rose five-petal' },
    { t: 'round',   n: 9,  a: C.lilac,   b: C.brown,   name: 'Lilac nine-petal' },
    { t: 'daisy',   n: 12, a: C.pink,    b: C.brown,   name: 'Pink daisy' },
    { t: 'daisy',   n: 16, a: C.green,   b: C.cream,   name: 'Green daisy' },
    { t: 'daisy',   n: 10, a: C.orange,  b: C.blue,    name: 'Orange daisy' },
    { t: 'daisy',   n: 14, a: C.mustard, b: C.red,     name: 'Mustard daisy' },
    { t: 'pointed', n: 6,  a: C.red,     b: C.cream,   name: 'Red star flower' },
    { t: 'pointed', n: 8,  a: C.teal,    b: C.pink,    name: 'Teal star flower' },
    { t: 'pointed', n: 5,  a: C.cocoa,   b: C.mustard, name: 'Cocoa star flower' },
    { t: 'pointed', n: 10, a: C.blue,    b: C.orange,  name: 'Blue star flower' },
    { t: 'layered', n: 6,  a: C.orange,  b: C.pink,    c: C.brown, name: 'Orange over pink' },
    { t: 'layered', n: 5,  a: C.green,   b: C.mustard, c: C.cream, name: 'Green over mustard' },
    { t: 'layered', n: 8,  a: C.rose,    b: C.cream,   c: C.red,   name: 'Rose over cream' },
    { t: 'layered', n: 7,  a: C.brown,   b: C.orange,  c: C.pink,  name: 'Brown over orange' },
    { t: 'target',  n: 4,  a: C.red,     b: C.cream,   c: C.brown, name: 'Red rings' },
    { t: 'target',  n: 5,  a: C.blue,    b: C.pink,    c: C.cream, name: 'Blue rings' },
    { t: 'target',  n: 3,  a: C.green,   b: C.cream,   c: C.orange, name: 'Green rings' },
    { t: 'wheel',   n: 12, a: C.brown,   b: C.cream,   name: 'Brown wheel' },
    { t: 'wheel',   n: 16, a: C.orange,  b: C.pink,    name: 'Orange wheel' },
    { t: 'wheel',   n: 10, a: C.teal,    b: C.mustard, name: 'Teal wheel' },
    { t: 'scallop', n: 10, a: C.pink,    b: C.orange,  name: 'Pink scallop' },
    { t: 'scallop', n: 12, a: C.mustard, b: C.green,   name: 'Mustard scallop' },
    { t: 'scallop', n: 8,  a: C.lilac,   b: C.cream,   name: 'Lilac scallop' },
    { t: 'tulip',   n: 3,  a: C.red,     b: C.green,   name: 'Red tulip' },
    { t: 'tulip',   n: 3,  a: C.pink,    b: C.leaf,    name: 'Pink tulip' },
    { t: 'tulip',   n: 3,  a: C.mustard, b: C.cocoa,   name: 'Mustard tulip' }
  ];

  function polar(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function draw(d) {
    var s = '', i, p, cx = 50, cy = 50;
    var n = d.n;
    switch (d.t) {
      case 'round':
        for (i = 0; i < n; i++) { p = polar(cx, cy, 26, i * 360 / n); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (n > 7 ? 13 : 17) + '" fill="' + d.a + '"/>'; }
        s += '<circle cx="50" cy="50" r="13" fill="' + d.b + '"/>';
        break;
      case 'daisy':
        for (i = 0; i < n; i++) { s += '<ellipse cx="50" cy="24" rx="6" ry="20" fill="' + d.a + '" transform="rotate(' + (i * 360 / n) + ' 50 50)"/>'; }
        s += '<circle cx="50" cy="50" r="11" fill="' + d.b + '"/>';
        break;
      case 'pointed':
        for (i = 0; i < n; i++) { s += '<path d="M50 6 L62 40 L50 52 L38 40 Z" fill="' + d.a + '" transform="rotate(' + (i * 360 / n) + ' 50 50)"/>'; }
        s += '<circle cx="50" cy="50" r="12" fill="' + d.b + '"/>';
        break;
      case 'layered':
        for (i = 0; i < n; i++) { p = polar(cx, cy, 27, i * 360 / n); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="16" fill="' + d.b + '"/>'; }
        for (i = 0; i < n; i++) { p = polar(cx, cy, 16, i * 360 / n + 180 / n); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="11" fill="' + d.a + '"/>'; }
        s += '<circle cx="50" cy="50" r="8" fill="' + d.c + '"/>';
        break;
      case 'target':
        s += '<circle cx="50" cy="50" r="44" fill="' + d.a + '"/>';
        for (i = 1; i <= n; i++) { s += '<circle cx="50" cy="50" r="' + (44 - i * (34 / n)).toFixed(1) + '" fill="' + (i % 2 ? d.b : d.a) + '"/>'; }
        s += '<circle cx="50" cy="50" r="9" fill="' + d.c + '"/>';
        break;
      case 'wheel':
        s += '<circle cx="50" cy="50" r="44" fill="' + d.a + '"/>';
        for (i = 0; i < n; i++) { s += '<rect x="47" y="10" width="6" height="34" rx="3" fill="' + d.b + '" transform="rotate(' + (i * 360 / n) + ' 50 50)"/>'; }
        s += '<circle cx="50" cy="50" r="12" fill="' + d.b + '"/>';
        break;
      case 'scallop':
        for (i = 0; i < n; i++) { p = polar(cx, cy, 33, i * 360 / n); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="12" fill="' + d.a + '"/>'; }
        s += '<circle cx="50" cy="50" r="32" fill="' + d.a + '"/>';
        s += '<circle cx="50" cy="50" r="20" fill="' + d.b + '"/>';
        s += '<circle cx="50" cy="50" r="8" fill="' + d.a + '"/>';
        break;
      case 'tulip':
        s += '<path d="M50 92 C50 70 50 60 50 48" stroke="' + d.b + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
        s += '<path d="M50 70 C40 66 32 70 26 80 C36 82 46 78 50 70Z" fill="' + d.b + '"/>';
        s += '<path d="M50 74 C60 70 68 74 74 84 C64 86 54 82 50 74Z" fill="' + d.b + '"/>';
        s += '<path d="M28 44 C28 22 40 12 50 24 C60 12 72 22 72 44 C72 56 60 60 50 60 C40 60 28 56 28 44Z" fill="' + d.a + '"/>';
        s += '<path d="M44 26 C48 18 52 18 56 26" stroke="' + d.b + '" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5"/>';
        break;
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + s + '</svg>';
  }

  /* ---------- Game state ---------- */
  var board = document.getElementById('board');
  if (!board) return;
  var pairsEl = document.getElementById('pairs-count');
  var sizeLabel = document.getElementById('size-label');
  var hintBtn = document.getElementById('hint-btn');
  var newBtn = document.getElementById('new-board-btn');
  var doneBox = document.getElementById('game-done');
  var doneText = document.getElementById('done-text');
  var againBtn = document.getElementById('again-btn');
  var sizeBtns = document.querySelectorAll('[data-size]');
  var live = document.getElementById('game-live');

  var ROUND_LENGTH = 10;
  var size = 16, cols = 4;
  var tiles = [], picked = null, pairs = 0, inRound = 0, locked = false, pairIndex = -1;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  function deal() {
    picked = null; locked = false;
    var pool = shuffle(DESIGNS.slice()).slice(0, size - 1);
    pairIndex = Math.floor(Math.random() * pool.length);
    var list = pool.slice();
    list.push(pool[pairIndex]);
    shuffle(list);
    tiles = list;
    board.style.setProperty('--board-cols', cols);
    board.innerHTML = '';
    list.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ftile';
      b.setAttribute('aria-label', d.name + ' tile');
      b.dataset.i = String(i);
      b.innerHTML = draw(d);
      board.appendChild(b);
    });
    if (live) live.textContent = 'New board dealt. ' + size + ' tiles.';
  }

  function announce(msg) { if (live) live.textContent = msg; }

  function onTile(e) {
    var btn = e.target.closest('.ftile');
    if (!btn || locked) return;
    var i = Number(btn.dataset.i);
    if (picked === null) { picked = i; btn.classList.add('is-picked'); return; }
    if (picked === i) { btn.classList.remove('is-picked'); picked = null; return; }
    var first = board.querySelector('[data-i="' + picked + '"]');
    if (tiles[picked] === tiles[i]) {
      locked = true;
      first.classList.add('is-matched'); btn.classList.add('is-matched');
      pairs++; inRound++;
      pairsEl.textContent = pairs;
      announce('Matched: ' + tiles[i].name + '. ' + pairs + ' pairs so far.');
      if (inRound >= ROUND_LENGTH) { setTimeout(finishRound, 450); }
      else { setTimeout(deal, 520); }
    } else {
      first.classList.remove('is-picked');
      btn.classList.add('is-wrong'); first.classList.add('is-wrong');
      setTimeout(function () { btn.classList.remove('is-wrong'); first.classList.remove('is-wrong'); }, 400);
      picked = null;
      announce('Not a match. Try again.');
    }
  }

  function finishRound() {
    locked = true;
    doneText.textContent = pairs + (pairs === 1 ? ' pair' : ' pairs') + ' found. Keep going, or learn a rule while you are here.';
    doneBox.classList.add('is-open');
    doneBox.setAttribute('aria-hidden', 'false');
    againBtn.focus();
  }

  function hint() {
    if (locked) return;
    var idxs = [];
    tiles.forEach(function (d, i) { if (tiles.indexOf(d) !== tiles.lastIndexOf(d)) idxs.push(i); });
    var show = idxs[Math.floor(Math.random() * idxs.length)];
    var el = board.querySelector('[data-i="' + show + '"]');
    if (!el) return;
    el.classList.add('is-hint');
    setTimeout(function () { el.classList.remove('is-hint'); }, 2400);
    announce('Hint shown. One of the pair is highlighted.');
  }

  function setSize(n) {
    size = n; cols = n === 9 ? 3 : n === 16 ? 4 : 5;
    sizeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.size) === n)); });
    if (sizeLabel) sizeLabel.textContent = n + ' tiles';
    deal();
  }

  board.addEventListener('click', onTile);
  hintBtn.addEventListener('click', hint);
  newBtn.addEventListener('click', function () { deal(); });
  againBtn.addEventListener('click', function () {
    inRound = 0;
    doneBox.classList.remove('is-open'); doneBox.setAttribute('aria-hidden', 'true');
    deal();
  });
  sizeBtns.forEach(function (b) { b.addEventListener('click', function () { setSize(Number(b.dataset.size)); }); });

  // Phones get a 4x4 by default; wider screens a 5x5.
  setSize(window.matchMedia('(min-width: 600px)').matches ? 25 : 16);
})();
