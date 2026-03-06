/**
 * math/rng.js
 * Deterministic PRNG, numeric helpers, difficulty adjuster.
 * Exposes: window.MathRNG = { reseed, randInt, randFloat, nextDifficulty }
 * No dependencies.
 */
(function () {

var _seed = Date.now() >>> 0;

function _rand() {
  _seed ^= _seed << 13;
  _seed ^= _seed >> 17;
  _seed ^= _seed << 5;
  return (_seed >>> 0) / 0xFFFFFFFF;
}

function _randInt(min, max) {
  return Math.floor(_rand() * (max - min + 1)) + min;
}

// Reseed so successive calls within the same ms differ
function _reseed() { _seed = (Date.now() ^ (_seed * 1664525 + 1013904223)) >>> 0; }

// ── Numeric parsing ──────────────────────────────────────────────

function _parseNum(s) {
  if (typeof s === 'number') return s;
  s = String(s).trim().replace(',', '.');
  var n = parseFloat(s);
  return isNaN(n) ? null : n;
}

// ── Difficulty adjuster ──────────────────────────────────────────

function nextDifficulty(history) {
  // history: array of booleans (true = correct)
  if (!history || history.length === 0) return 1;
  var last   = history.slice(-5);
  var streak = 0;
  for (var i = last.length - 1; i >= 0; i--) {
    if (last[i]) streak++;
    else break;
  }
  var current = history._difficulty || 1;
  if (streak >= 3 && current < 5)  return current + 1;
  var wrong = last.filter(function (b) { return !b; }).length;
  if (wrong >= 3 && current > 1)   return current - 1;
  return current;
}

  window.MathRNG = {
    reseed:         _reseed,
    randInt:        _randInt,
    nextDifficulty: nextDifficulty,
  };

})();
