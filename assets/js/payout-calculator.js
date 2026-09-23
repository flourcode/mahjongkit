/* MahjongKit payout calculator. Rules: the discarder pays double and the others pay the value;
   self-drawn, all three pay double; an announced Jokerless hand doubles everything, except
   Singles and Pairs hands and Quint hands. Logic first (testable), interface below. */
(function (root) {
  'use strict';
  function payout(value, how, jokerless, type) {
    var v = Number(value) || 0;
    var bonus = jokerless && type === 'regular';
    if (bonus) v *= 2;
    if (how === 'self') return { bonus: bonus, discarder: null, each: 2 * v, others: 3, total: 6 * v };
    return { bonus: bonus, discarder: 2 * v, each: v, others: 2, total: 4 * v };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { payout: payout }; return; }
  var f = document.getElementById('pc-form'); if (!f) return;
  var out = document.getElementById('pc-out');
  function money(points, rate) {
    if (!rate) return points + ' point' + (points === 1 ? '' : 's');
    var d = points * rate; return '$' + d.toFixed(2) + ' (' + points + ' points)';
  }
  function render() {
    var val = Number(f.value.value), how = f.how.value, jl = f.jokerless.checked, type = f.type.value;
    var rate = parseFloat(f.rate.value) || 0;
    f.jokerless.disabled = type !== 'regular';
    if (type !== 'regular') f.jokerless.checked = false;
    if (!(val > 0)) { out.innerHTML = '<p>Enter the value printed next to the winning hand on the card.</p>'; return; }
    var r = payout(val, how, f.jokerless.checked, type), rows = '';
    if (how === 'discard') {
      rows += '<tr><td>The player who threw the winning tile</td><td>' + money(r.discarder, rate) + '</td></tr>';
      rows += '<tr><td>Each of the other two players</td><td>' + money(r.each, rate) + '</td></tr>';
    } else rows += '<tr><td>Each of the three other players</td><td>' + money(r.each, rate) + '</td></tr>';
    rows += '<tr class="pc-total"><td>The winner collects</td><td>' + money(r.total, rate) + '</td></tr>';
    var notes = [];
    if (r.bonus) notes.push('Jokerless doubles every payment, as long as the winner announced it.');
    if (type !== 'regular') notes.push('Singles and Pairs hands and Quint hands never get the Jokerless bonus.');
    notes.push('A player whose hand is dead still pays. In a wall game, nobody pays.');
    out.innerHTML = '<table><tbody>' + rows + '</tbody></table><p class="pc-notes">' + notes.join(' ') + '</p>';
  }
  f.addEventListener('input', render); f.addEventListener('change', render); render();
})(typeof window !== 'undefined' ? window : this);
