/* MahjongKit Solo Practice Hand
   A single-player American Mahjong practice hand: real 152-tile set, real wall,
   draw and discard, an original practice card, and real Joker rules.
   The rules engine (top) has no DOM code, so it can be tested on its own. */
(function (root) {
  'use strict';

  /* =============================== RULES ENGINE =============================== */
  var SUITS = ['Crak', 'Dot', 'Bam'];
  var DRAGON_OF = { Crak: 'Red', Dot: 'Soap', Bam: 'Green' };
  var WINDS = ['N', 'E', 'W', 'S'];
  var NAMES = { N: 'North', E: 'East', W: 'West', S: 'South', Red: 'Red Dragon', Green: 'Green Dragon',
                Soap: 'Soap (White Dragon)', F: 'Flower', J: 'Joker' };
  function tileName(k) {
    if (NAMES[k]) return NAMES[k];
    var m = /^(Crak|Dot|Bam)(\d)$/.exec(k);
    return m ? m[2] + ' ' + m[1] + (k === 'Bam1' ? ' (the bird)' : '') : k;
  }
  var ORDER = [];
  SUITS.forEach(function (s) { for (var n = 1; n <= 9; n++) ORDER.push(s + n); });
  ORDER = ORDER.concat(WINDS, ['Red', 'Green', 'Soap', 'F', 'J']);
  function sortKey(k) { return ORDER.indexOf(k); }

  function fullSet() {
    var t = [], id = 0;
    SUITS.forEach(function (s) { for (var n = 1; n <= 9; n++) for (var c = 0; c < 4; c++) t.push({ id: id++, k: s + n }); });
    WINDS.concat(['Red', 'Green', 'Soap']).forEach(function (k) { for (var c = 0; c < 4; c++) t.push({ id: id++, k: k }); });
    for (var f = 0; f < 8; f++) t.push({ id: id++, k: 'F' });
    for (var j = 0; j < 8; j++) t.push({ id: id++, k: 'J' });
    return t;   // 108 + 16 + 12 + 8 + 8 = 152
  }

  /* The practice card. Invented for MahjongKit, not taken from any NMJL card.
     Groups: t 'F' Flower, 'W' a Wind, 'D' the Dragon matching color c's suit,
     'S' a suit tile of color c. With rel, v is added to a variable x (any run). */
  function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }
  var LINES = [
    { id: 'A', name: 'Consecutive kongs', note: 'Any 3 consecutive numbers, one suit', rel: true, xs: range(1, 7),
      groups: [{ n: 2, t: 'F' }, { n: 4, t: 'S', c: 1, v: 0 }, { n: 4, t: 'S', c: 1, v: 1 }, { n: 4, t: 'S', c: 1, v: 2 }],
      show: [['FF', 0], ['1111', 1], ['2222', 1], ['3333', 1]] },
    { id: 'B', name: 'Like numbers', note: 'Any one number, in all three suits', rel: true, xs: range(1, 9),
      groups: [{ n: 2, t: 'F' }, { n: 4, t: 'S', c: 1, v: 0 }, { n: 4, t: 'S', c: 2, v: 0 }, { n: 4, t: 'S', c: 3, v: 0 }],
      show: [['FF', 0], ['5555', 1], ['5555', 2], ['5555', 3]] },
    { id: 'C', name: 'The four winds', note: 'Kongs of North and South, pungs of East and West', rel: false, xs: [0],
      groups: [{ n: 4, t: 'W', w: 'N' }, { n: 3, t: 'W', w: 'E' }, { n: 3, t: 'W', w: 'W' }, { n: 4, t: 'W', w: 'S' }],
      show: [['NNNN', 0], ['EEE', 0], ['WWW', 0], ['SSSS', 0]] },
    { id: 'D', name: 'Suits and their Dragons', note: 'Any 2 consecutive numbers in two suits, each with its matching Dragon', rel: true, xs: range(1, 8),
      groups: [{ n: 4, t: 'S', c: 1, v: 0 }, { n: 3, t: 'D', c: 1 }, { n: 4, t: 'S', c: 2, v: 1 }, { n: 3, t: 'D', c: 2 }],
      show: [['1111', 1], ['DDD', 1], ['2222', 2], ['DDD', 2]] },
    { id: 'E', name: 'Evens', note: '2, 4, 6 and 8 in one suit', rel: false, xs: [0],
      groups: [{ n: 3, t: 'F' }, { n: 3, t: 'S', c: 1, v: 2 }, { n: 3, t: 'S', c: 1, v: 4 }, { n: 3, t: 'S', c: 1, v: 6 }, { n: 2, t: 'S', c: 1, v: 8 }],
      show: [['FFF', 0], ['222', 1], ['444', 1], ['666', 1], ['88', 1]] },
    { id: 'F', name: 'Odds in two suits', note: '1 and 3 in one suit, 5 and 7 in another', rel: false, xs: [0],
      groups: [{ n: 2, t: 'F' }, { n: 3, t: 'S', c: 1, v: 1 }, { n: 3, t: 'S', c: 1, v: 3 }, { n: 3, t: 'S', c: 2, v: 5 }, { n: 3, t: 'S', c: 2, v: 7 }],
      show: [['FF', 0], ['111', 1], ['333', 1], ['555', 2], ['777', 2]] }
  ];

  function permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    var out = [];
    arr.forEach(function (x, i) {
      var rest = arr.slice(0, i).concat(arr.slice(i + 1));
      permutations(rest).forEach(function (p) { out.push([x].concat(p)); });
    });
    return out;
  }
  // Every concrete way a line can be filled: colors -> distinct suits, x -> a number.
  function expand(line) {
    var out = [];
    permutations(SUITS).forEach(function (perm) {
      line.xs.forEach(function (x) {
        var req = line.groups.map(function (g) {
          var key;
          if (g.t === 'F') key = 'F';
          else if (g.t === 'W') key = g.w;
          else if (g.t === 'D') key = DRAGON_OF[perm[g.c - 1]];
          else key = perm[g.c - 1] + (line.rel ? x + g.v : g.v);
          return { key: key, n: g.n };
        });
        var sig = req.map(function (r) { return r.key + r.n; }).join(',');
        if (!out.some(function (o) { return o.sig === sig; })) out.push({ sig: sig, req: req });
      });
    });
    return out;
  }
  function counts(keys) { var c = {}; keys.forEach(function (k) { c[k] = (c[k] || 0) + 1; }); return c; }

  // How close a hand is to one concrete fill of a line.
  function evaluate(keys, req) {
    var c = counts(keys), jokers = c.J || 0, used = {}, small = 0, big = 0, total = keys.length, usedNat = 0;
    var short = [];
    req.forEach(function (g) {
      var have = c[g.key] || 0, use = Math.min(have, g.n), d = g.n - use;
      used[g.key] = use; usedNat += use;
      if (g.n < 3) small += d; else big += d;
      if (d > 0) short.push({ key: g.key, need: d, jokersOk: g.n >= 3 });
    });
    var jUsed = Math.min(jokers, big);
    var missing = small + big - jUsed;
    var extras = total - usedNat - jUsed;
    return { missing: missing, used: used, jokersUsed: jUsed, extraJokers: jokers - jUsed, small: small, big: big,
             extras: extras, short: short, valid: total === 14 && missing === 0 && extras === 0 };
  }
  function best(keys, line) {
    var top = null;
    expand(line).forEach(function (e) {
      var r = evaluate(keys, e.req);
      if (!top || r.missing < top.missing || (r.missing === top.missing && r.extras < top.extras)) { r.req = e.req; top = r; }
    });
    return top;
  }
  // Explain why a 14-tile hand is not Mahjong for a chosen line.
  function explain(keys, line) {
    var r = best(keys, line);
    if (r.valid) return [];
    var msgs = [];
    if (r.small > 0 && r.extraJokers > 0) msgs.push('Jokers can\'t be used in a pair or a single. Pairs must be natural tiles.');
    var still = r.short.map(function (s) { return s.need + ' more ' + tileName(s.key) + (s.jokersOk ? '' : ' (natural tiles only)'); });
    if (r.missing > 0 && still.length) msgs.push('Still needed: ' + still.join(', ') + (r.jokersUsed ? '. Your Jokers are already counted.' : '.'));
    if (r.extras > 0) msgs.push('You hold ' + r.extras + ' tile' + (r.extras === 1 ? '' : 's') + ' this line does not use.');
    return msgs;
  }
  function mahjongLine(keys) {
    for (var i = 0; i < LINES.length; i++) if (best(keys, LINES[i]).valid) return LINES[i];
    return null;
  }

  var ENGINE = { LINES: LINES, fullSet: fullSet, expand: expand, evaluate: evaluate, best: best, explain: explain,
                 mahjongLine: mahjongLine, tileName: tileName, sortKey: sortKey };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ENGINE; return; }

  /* ================================= INTERFACE ================================= */
  var app = document.getElementById('ph-app');
  if (!app || !root.MK_TILES) return;
  var FACES = root.MK_TILES;
  var S = { hand: [], wall: [], discards: [], draws: 0, pace: 'relaxed', line: null, fade: true, sel: null, drawn: null, over: false };

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function keysOf(h) { return h.map(function (t) { return t.k; }); }
  function sortHand() { S.hand.sort(function (a, b) { return sortKey(a.k) - sortKey(b.k) || a.id - b.id; }); }
  function maxDraws() { return S.pace === 'real' ? 24 : Infinity; }
  function drawsLeft() { return Math.min(S.wall.length, maxDraws() - S.draws); }
  function base(k) { return (/^(Dot|Bam)/.test(k) || WINDS.indexOf(k) !== -1) ? 'blue' : 'pink'; }
  function face(k) { return '<span class="htile htile--' + base(k) + '" aria-hidden="true">' + FACES[k] + '</span>'; }

  app.innerHTML =
    '<div class="game-status"><span class="chip chip--pink" id="ph-left"></span>' +
    '<span class="chip chip--tonal" id="ph-need">Choose a hand</span></div>' +
    '<div class="ph-rack"><p class="ph-label">Your tiles <span id="ph-count"></span></p><div class="ph-hand" id="ph-hand"></div></div>' +
    '<p class="ph-msg" id="ph-msg" aria-live="polite"></p>' +
    '<div class="game-actions"><button class="btn btn--filled" id="ph-discard" type="button" disabled>Discard selected tile</button>' +
    '<button class="btn btn--pink" id="ph-mj" type="button">Mahjong!</button>' +
    '<button class="btn btn--outlined" id="ph-new" type="button">New deal</button></div>' +
    '<div class="ph-card" role="radiogroup" aria-label="Practice card"><p class="ph-card__title">Practice card <span>Tap a line to aim for it</span></p><div id="ph-lines"></div></div>' +
    '<div class="ph-options"><label><input type="checkbox" id="ph-fade" checked> Fade tiles my line doesn&rsquo;t use</label>' +
    '<label>Pace <select id="ph-pace"><option value="relaxed">Relaxed</option>' +
    '<option value="real">Real pace (24 draws)</option></select></label></div>' +
    '<div class="ph-discards"><p class="ph-label">Your discards</p><div class="ph-dis" id="ph-dis"></div></div>';

  var el = function (id) { return document.getElementById(id); };

  function renderLines() {
    var keys = keysOf(S.hand);
    el('ph-lines').innerHTML = LINES.map(function (L) {
      var r = best(keys, L), on = S.line === L.id;
      var notation = L.show.map(function (p) { return '<span class="ph-c' + p[1] + '">' + p[0] + '</span>'; }).join(' ');
      var need = r.missing === 0 && r.extras === 0 && keys.length === 14 ? 'Complete!' :
                 'needs ' + r.missing + ' more';
      return '<button type="button" role="radio" aria-checked="' + on + '" class="ph-line' + (on ? ' is-on' : '') + '" data-line="' + L.id + '">' +
             '<span class="ph-line__id">' + L.id + '</span><span class="ph-line__body"><span class="ph-line__not">' + notation + '</span>' +
             '<span class="ph-line__note">' + L.name + ': ' + L.note + '</span></span><span class="ph-line__need">' + need + '</span></button>';
    }).join('');
  }
  function renderHand() {
    var keys = keysOf(S.hand), useful = null;
    if (S.line && S.fade) {
      var r = best(keys, LINES.filter(function (L) { return L.id === S.line; })[0]);
      var left = {}; Object.keys(r.used).forEach(function (k) { left[k] = r.used[k]; });
      var jLeft = r.jokersUsed; useful = {};
      S.hand.forEach(function (t) {
        if (t.k === 'J') { if (jLeft > 0) { useful[t.id] = true; jLeft--; } }
        else if (left[t.k] > 0) { useful[t.id] = true; left[t.k]--; }
      });
    }
    el('ph-hand').innerHTML = S.hand.map(function (t) {
      var cls = 'ph-tile' + (S.sel === t.id ? ' is-sel' : '') + (S.drawn === t.id ? ' is-new' : '') + (useful && !useful[t.id] ? ' is-faded' : '');
      return '<button type="button" class="' + cls + '" data-id="' + t.id + '" aria-pressed="' + (S.sel === t.id) + '" aria-label="' +
             tileName(t.k) + (S.drawn === t.id ? ', just drawn' : '') + '">' + face(t.k) + '</button>';
    }).join('');
    el('ph-count').textContent = '(' + S.hand.length + ')';
    el('ph-dis').innerHTML = S.discards.map(function (k) { return '<span class="ph-d" title="' + tileName(k) + '">' + face(k) + '</span>'; }).join('');
    el('ph-discard').disabled = S.over || S.sel === null;
    el('ph-mj').disabled = S.over || S.hand.length !== 14;
    var left = drawsLeft();
    el('ph-left').textContent = S.over ? 'Hand over' : (isFinite(maxDraws()) ? left + ' draws left' : S.wall.length + ' tiles in the wall');
    if (S.line) {
      var rr = best(keys, LINES.filter(function (L) { return L.id === S.line; })[0]);
      el('ph-need').textContent = 'Line ' + S.line + ': needs ' + rr.missing;
    } else el('ph-need').textContent = 'Choose a hand';
    renderLines();
  }
  function say(t) { el('ph-msg').innerHTML = t; }

  function deal() {
    S.wall = shuffle(fullSet()); S.hand = S.wall.splice(0, 13); S.discards = []; S.draws = 0; S.sel = null; S.over = false; S.line = null;
    sortHand(); draw(true);
    say('Your 13 tiles are dealt and you have drawn a 14th. Pick a line on the practice card, then discard one tile. '
        + 'Each line shows how many tiles it still needs, which is how real players choose a hand.');
  }
  function draw(first) {
    if (drawsLeft() <= 0) { S.over = true; S.drawn = null; renderHand();
      say('<strong>Wall game.</strong> ' + (isFinite(maxDraws()) ? 'You have had your 24 draws.' : 'The wall has run out.') +
          ' Nobody pays in a wall game. Deal again whenever you like.'); return; }
    var t = S.wall.shift(); S.draws++; S.hand.push(t); sortHand(); S.drawn = t.id; S.sel = null; renderHand();
    if (!first) say('You drew ' + tileName(t.k) + '. Discard a tile, or declare Mahjong if your hand is complete.');
  }
  function discard() {
    if (S.sel === null || S.over) return;
    var i = S.hand.findIndex(function (t) { return t.id === S.sel; });
    var t = S.hand.splice(i, 1)[0]; S.discards.push(t.k); S.sel = null; S.drawn = null;
    renderHand(); setTimeout(function () { draw(false); }, 350);
  }
  function mahjong() {
    var keys = keysOf(S.hand), won = mahjongLine(keys);
    if (won) {
      S.over = true; renderHand();
      var jl = keys.indexOf('J') === -1;
      say('<strong>Mahjong!</strong> Your hand matches line ' + won.id + ', ' + won.name + ', in ' + S.draws + ' draws.' +
          (jl ? ' It is Jokerless: in a real game you would announce that, and the payout doubles.' : '') +
          ' Deal again to try another line.');
      burst(); return;
    }
    var L = S.line ? LINES.filter(function (x) { return x.id === S.line; })[0] : null;
    var msgs = L ? explain(keys, L) : ['Pick a line on the practice card first, so I can tell you what is missing.'];
    say('<strong>Not Mahjong yet.</strong> ' + msgs.join(' ') +
        ' In a real game, calling Mahjong in error makes your hand dead, so it pays to check against the card first.');
  }
  function burst() {
    var h = el('ph-hand'); if (!h || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    h.classList.remove('is-win'); void h.offsetWidth; h.classList.add('is-win');
  }

  app.addEventListener('click', function (e) {
    var tile = e.target.closest('.ph-tile');
    if (tile && !S.over) {
      var id = Number(tile.dataset.id);
      if (S.sel === id) { discard(); return; }        // second tap discards
      S.sel = id; renderHand(); return;
    }
    var line = e.target.closest('.ph-line');
    if (line) { S.line = S.line === line.dataset.line ? null : line.dataset.line; renderHand(); return; }
  });
  el('ph-discard').addEventListener('click', discard);
  el('ph-mj').addEventListener('click', mahjong);
  el('ph-new').addEventListener('click', deal);
  el('ph-fade').addEventListener('change', function (e) { S.fade = e.target.checked; renderHand(); });
  el('ph-pace').addEventListener('change', function (e) { S.pace = e.target.value; deal(); });
  deal();
})(typeof window !== 'undefined' ? window : this);
