/* MahjongKit Mahjong Solitaire. Every deal is solvable: boards are built by simulating a
   legal clearing order and assigning matching pairs along it. Engine first (no DOM, testable). */
(function (root) {
  'use strict';
  /* ================================ ENGINE ================================ */
  // Layer k covers columns k..W-1-k and rows k..H-1-k, stacked squarely on the layer below.
  function layout(W, H) {
    var pos = [];
    for (var z = 0; ; z++) {
      var c0 = z, c1 = W - 1 - z, r0 = z, r1 = H - 1 - z;
      if (c1 < c0 || r1 < r0) break;
      for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) pos.push({ c: c, r: r, z: z });
    }
    return pos;
  }
  var LAYOUTS = { quick: layout(6, 4), full: layout(8, 5) };
  function key(p) { return p.c + ',' + p.r + ',' + p.z; }
  // Is position p free, given the set of occupied keys?
  function isFree(p, occ) {
    if (occ[p.c + ',' + p.r + ',' + (p.z + 1)]) return false;
    var left = occ[(p.c - 1) + ',' + p.r + ',' + p.z], right = occ[(p.c + 1) + ',' + p.r + ',' + p.z];
    return !left || !right;
  }
  var KINDS = [];
  ['Crak', 'Dot', 'Bam'].forEach(function (s) { for (var n = 1; n <= 9; n++) KINDS.push(s + n); });
  KINDS = KINDS.concat(['N', 'E', 'W', 'S', 'Red', 'Green', 'Soap', 'F']);
  function matches(a, b) { return a === b; }   // all Flowers share the kind 'F'
  function shuffle(a, rnd) { rnd = rnd || Math.random; for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // Assign kinds to positions so that the board can be cleared. Returns {tiles, order} or null.
  function deal(positions, rnd) {
    for (var attempt = 0; attempt < 200; attempt++) {
      var occ = {}; positions.forEach(function (p) { occ[key(p)] = true; });
      var left = positions.slice(), order = [], ok = true;
      while (left.length) {
        var free = left.filter(function (p) { return isFree(p, occ); });
        if (free.length < 2) { ok = false; break; }
        shuffle(free, rnd);
        var a = free[0], b = free[1];
        order.push([key(a), key(b)]);
        delete occ[key(a)]; delete occ[key(b)];
        left = left.filter(function (p) { return p !== a && p !== b; });
      }
      if (!ok) continue;
      // Each kind appears as exactly one pair, so every tile has exactly one partner.
      // Removing tiles only ever frees others, so a clearable board stays clearable
      // whatever order the player chooses: nobody can get stuck.
      if (order.length > KINDS.length) return null;
      var pool = shuffle(KINDS.slice(), rnd), tiles = {};
      order.forEach(function (pair, i) { tiles[pair[0]] = pool[i]; tiles[pair[1]] = pool[i]; });
      return { tiles: tiles, order: order };
    }
    return null;
  }
  function freePairs(tiles, positions) {
    var occ = {}; positions.forEach(function (p) { if (tiles[key(p)]) occ[key(p)] = true; });
    var free = positions.filter(function (p) { return occ[key(p)] && isFree(p, occ); });
    var pairs = [];
    for (var i = 0; i < free.length; i++) for (var j = i + 1; j < free.length; j++)
      if (matches(tiles[key(free[i])], tiles[key(free[j])])) pairs.push([key(free[i]), key(free[j])]);
    return pairs;
  }
  var ENGINE = { LAYOUTS: LAYOUTS, isFree: isFree, deal: deal, freePairs: freePairs, key: key, KINDS: KINDS };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ENGINE; return; }

  /* =============================== INTERFACE =============================== */
  var app = document.getElementById('sol-app');
  if (!app || !root.MK_TILES) return;
  var FACES = root.MK_TILES;
  var NAMES = { N: 'North', E: 'East', W: 'West', S: 'South', Red: 'Red Dragon', Green: 'Green Dragon', Soap: 'Soap (White Dragon)', F: 'Flower' };
  function nm(k) { if (NAMES[k]) return NAMES[k]; var m = /^(Crak|Dot|Bam)(\d)$/.exec(k); return m ? m[2] + ' ' + m[1] : k; }
  function base(k) { return (/^(Dot|Bam)/.test(k) || 'NEWS'.indexOf(k) !== -1) ? 'blue' : 'pink'; }
  var S = { size: 'quick', positions: [], tiles: {}, sel: null, history: [], dim: true, hint: null };
  try { var saved = localStorage.getItem('mk-solitaire-size'); if (saved === 'full' || saved === 'quick') S.size = saved; } catch (e) { /* storage off */ }

  app.innerHTML =
    '<div class="game-status"><span class="chip chip--pink" id="sol-left"></span><span class="chip">No timer</span><span class="chip chip--tonal" id="sol-moves"></span></div>' +
    '<div class="sol-wrap"><div class="sol-board" id="sol-board" aria-label="Mahjong solitaire board"></div></div>' +
    '<p class="ph-msg" id="sol-msg" aria-live="polite"></p>' +
    '<div class="game-actions"><button class="btn btn--pink" id="sol-hint" type="button">Show me a pair</button>' +
    '<button class="btn btn--outlined" id="sol-undo" type="button">Undo</button>' +
    '<button class="btn btn--outlined" id="sol-new" type="button">New game</button></div>' +
    '<div class="game-size-wrap"><span class="label" id="sol-size-h">Layout</span><div class="game-size" role="group" aria-labelledby="sol-size-h">' +
    '<button type="button" data-size="quick" aria-pressed="false">Quick (32 tiles)</button><button type="button" data-size="full" aria-pressed="false">Full (62 tiles)</button></div></div>' +
    '<div class="ph-options"><label><input type="checkbox" id="sol-dim" checked> Soften tiles that can&rsquo;t move yet</label></div>';
  var el = function (id) { return document.getElementById(id); };
  var board = el('sol-board');

  function occupied() { var o = {}; S.positions.forEach(function (p) { if (S.tiles[key(p)]) o[key(p)] = true; }); return o; }
  function say(t) { el('sol-msg').innerHTML = t; }

  function render(hintPair) {
    hintPair = hintPair || S.hint;
    var occ = occupied(), W = S.size === 'full' ? 8 : 6, H = S.size === 'full' ? 5 : 4;
    var avail = board.parentNode.clientWidth || 340;
    var tw = Math.max(30, Math.min(64, Math.floor((avail - 16) / (W + 0.5)))), th = Math.round(tw * 1.36), lift = Math.round(tw * 0.12);
    board.style.width = (W * tw + lift * 4) + 'px'; board.style.height = (H * th + lift * 4) + 'px';
    board.style.setProperty('--ht-w', (tw - 2) + 'px');
    var html = '', left = 0;
    S.positions.slice().sort(function (a, b) { return a.z - b.z || a.r - b.r || a.c - b.c; }).forEach(function (p) {
      var k = key(p), kind = S.tiles[k]; if (!kind) return; left++;
      var free = isFree(p, occ);
      var cls = 'sol-tile' + (free ? ' is-free' : ' is-blocked') + (S.sel === k ? ' is-sel' : '') + (hintPair && hintPair.indexOf(k) !== -1 ? ' is-hint' : '');
      var x = p.c * tw + lift * (4 - p.z) - lift, y = p.r * th + lift * (4 - p.z) - lift * 2;
      html += '<button type="button" class="' + cls + '" data-k="' + k + '" style="left:' + x + 'px;top:' + y + 'px;z-index:' + (p.z * 100 + p.r * 10 + p.c) + '"' +
              ' aria-label="' + nm(kind) + (free ? '' : ', blocked') + '"><span class="htile htile--' + base(kind) + '" aria-hidden="true">' + FACES[kind] + '</span></button>';
    });
    board.innerHTML = html;
    board.classList.toggle('dim', S.dim);
    var pairs = freePairs(S.tiles, S.positions);
    el('sol-left').textContent = left + ' tiles left';
    el('sol-moves').textContent = left ? pairs.length + (pairs.length === 1 ? ' pair' : ' pairs') + ' available' : 'Cleared';
    el('sol-undo').disabled = !S.history.length;
    document.querySelectorAll('[data-size]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.size === S.size)); });
    return { left: left, pairs: pairs };
  }
  function newGame() {
    S.positions = LAYOUTS[S.size]; var d = deal(S.positions); S.tiles = d.tiles; S.sel = null; S.history = []; S.hint = null;
    render(); say('Match two identical tiles that are free: nothing on top, and an open left or right side. Any Flower matches any Flower.');
  }
  function afterMove() {
    var st = render();
    if (!st.left) { say('<strong>Board cleared.</strong> Nicely done. Start a new game whenever you like.'); celebrate(); }
    else if (!st.pairs.length) say('No pairs are free right now. Undo a move to try another way.');
  }
  function celebrate() { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; board.classList.remove('is-win'); void board.offsetWidth; board.classList.add('is-win'); }

  board.addEventListener('click', function (e) {
    var b = e.target.closest('.sol-tile'); if (!b) return;
    var k = b.dataset.k;
    if (b.classList.contains('is-blocked')) { b.classList.remove('is-shake'); void b.offsetWidth; b.classList.add('is-shake'); say('That tile is blocked. A tile can move when nothing is on top of it and its left or right side is open.'); return; }
    if (S.sel === null || S.sel === k) { S.sel = S.sel === k ? null : k; render(); return; }
    if (S.tiles[S.sel] === S.tiles[k]) {
      S.history.push([[S.sel, S.tiles[S.sel]], [k, S.tiles[k]]]);
      var name = nm(S.tiles[k]); delete S.tiles[S.sel]; delete S.tiles[k]; S.sel = null; S.hint = null;
      say('Matched two ' + (name === 'Flower' ? 'Flowers' : name + ' tiles') + '.'); afterMove();
    } else { S.sel = k; render(); say('Those two don&rsquo;t match. Pick another tile to pair with the one that is lifted.'); }
  });
  el('sol-hint').addEventListener('click', function () {
    var p = freePairs(S.tiles, S.positions);
    if (!p.length) { say('No pairs are free. Try Undo.'); return; }
    S.sel = null; S.hint = p[Math.floor(Math.random() * p.length)]; render(); say('These two can be matched.');
  });
  el('sol-undo').addEventListener('click', function () {
    var last = S.history.pop(); if (!last) return;
    last.forEach(function (t) { S.tiles[t[0]] = t[1]; }); S.sel = null; S.hint = null; render(); say('Move undone.');
  });
  var shuffleBtn = el('sol-shuffle'); if (shuffleBtn) shuffleBtn.addEventListener('click', function () {
    var remaining = S.positions.filter(function (p) { return S.tiles[key(p)]; });
    if (!remaining.length) return;
    var kinds = remaining.map(function (p) { return S.tiles[key(p)]; });
    var d = deal(remaining);
    if (!d) { say('Could not find a solvable shuffle. Try Undo instead.'); return; }
    // keep the same tiles: reassign the existing kinds, pair by pair, along the new solvable order
    var counts = {}; kinds.forEach(function (k) { counts[k] = (counts[k] || 0) + 1; });
    var pairKinds = []; Object.keys(counts).forEach(function (k) { for (var i = 0; i < counts[k] / 2; i++) pairKinds.push(k); });
    shuffle(pairKinds); var t = {};
    d.order.forEach(function (pair, i) { t[pair[0]] = pairKinds[i]; t[pair[1]] = pairKinds[i]; });
    S.positions.forEach(function (p) { if (!t[key(p)]) delete S.tiles[key(p)]; });
    Object.keys(t).forEach(function (k) { S.tiles[k] = t[k]; });
    S.sel = null; S.history = []; S.hint = null; render(); say('Shuffled. The tiles that are left can still be cleared.');
  });
  el('sol-new').addEventListener('click', newGame);
  el('sol-dim').addEventListener('change', function (e) { S.dim = e.target.checked; render(); });
  document.querySelectorAll('[data-size]').forEach(function (b) {
    b.addEventListener('click', function () { S.size = b.dataset.size; try { localStorage.setItem('mk-solitaire-size', S.size); } catch (e) { /* ok */ } newGame(); });
  });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { render(); }, 150); });
  newGame();
})(typeof window !== 'undefined' ? window : this);
