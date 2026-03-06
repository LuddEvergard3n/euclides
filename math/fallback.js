/**
 * math/fallback.js
 * Core: validation, error analysis, dispatcher, public API.
 * Generators live in math/generators/*.js (registered on MathGenerators).
 * Load order: rng.js → generators/*.js → fallback.js
 */
(function () {

  var nextDifficulty = MathRNG.nextDifficulty;

  // ── Numeric parsing ───────────────────────────────────────────────

  function _parseNum(s) {
    if (typeof s === 'number') return s;
    s = String(s).trim().replace(',', '.');
    // Reject strings with non-numeric content ("2 ou -3", "x = 5")
    if (!/^-?[\d.]+$/.test(s)) return null;
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  // ── Trig / symbolic normalisation ─────────────────────────────────

  function _normTrig(s) {
    return s
      .replace(/sqrt\s*\(?\s*(\d+)\s*\)?/gi, '√$1')
      .replace(/raiz\s*\(?\s*(\d+)\s*\)?/gi, '√$1')
      .replace(/indefinid[ao]/i, 'indef.')
      .replace(/nao\s*existe/i,  'indef.')
      .replace(/\bnd\b/i,        'indef.')
      .replace(/\s+/g, '');
  }

  // ── Validation ────────────────────────────────────────────────────

  function validate(topicId, studentAnswer, correctAnswer) {
    var s = String(studentAnswer).trim().toLowerCase().replace(',', '.');
    var c = String(correctAnswer).trim().toLowerCase().replace(',', '.');

    // Trig / exact-form normalised match
    if (_normTrig(s) === _normTrig(c)) return true;

    // Quadrant answers: "1", "1°", "primeiro" → "1º"
    if (topicId === 'cartesian') {
      var quadMap = { '1':'1º','2':'2º','3':'3º','4':'4º',
                      'primeiro':'1º','segundo':'2º','terceiro':'3º','quarto':'4º' };
      var sQ = quadMap[s.replace(/[°º]/g, '').trim()];
      if (sQ && sQ === c) return true;
    }

    // Direct string match
    if (s === c) return true;

    // Numeric comparison (single value)
    var sn = _parseNum(s), cn = _parseNum(c);
    if (sn !== null && cn !== null) return Math.abs(sn - cn) < 1e-9;

    // Multi-root: "x1 ou x2" — order-independent, both roots required
    if (c.indexOf(' ou ') !== -1) {
      var roots  = c.split(' ou ').map(function (r) { return r.trim(); });
      var sroots = s.split(/[\s,;]+ou[\s,;]+|[\s,;]+e[\s,;]+|[\s,;]+/)
                    .map(function (r) { return r.trim(); })
                    .filter(Boolean);
      return roots.every(function (r) {
        var rn = _parseNum(r);
        return sroots.some(function (sr) {
          var srn = _parseNum(sr);
          return (rn !== null && srn !== null) ? Math.abs(rn - srn) < 1e-9 : sr === r;
        });
      });
    }

    return false;
  }

  // ── Error analysis ────────────────────────────────────────────────

  function analyzeError(topicId, studentAnswer, correctAnswer) {
    if (!studentAnswer || studentAnswer.trim() === '') return 1;
    var s = _parseNum(studentAnswer), c = _parseNum(correctAnswer);
    if (s === null) return 1;
    if (topicId === 'equations1') {
      if (Math.abs(s) > Math.abs(c) * 1.5) return 2;
      if (Math.abs(s + c) < 1e-9) return 2;
    }
    if (topicId === 'equations2') {
      if (correctAnswer.indexOf(' ou ') !== -1 && studentAnswer.indexOf('ou') === -1) return 2;
      return 2;
    }
    return 0;
  }

  // ── Dispatcher ────────────────────────────────────────────────────

  function generateExercise(topicId, difficulty) {
    difficulty = Math.max(1, Math.min(5, difficulty || 1));
    var gen = MathGenerators[topicId];
    if (gen) return gen(difficulty);
    return { statement: 'Tópico "' + topicId + '" não encontrado.',
             equation: '—', answer: '—', hints: [] };
  }

  // ── Public API ────────────────────────────────────────────────────

  window.MathFallback = {
    generateExercise: generateExercise,
    validate:         validate,
    analyzeError:     analyzeError,
    nextDifficulty:   nextDifficulty,
    _genByType:       generateExercise,
  };

})();
