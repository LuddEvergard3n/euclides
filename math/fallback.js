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
    // A complete match is deliberate: parseFloat('2abc') must not be accepted.
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
    var n = Number(s);
    return isFinite(n) ? n : null;
  }

  function _normaliseText(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(',', '.');
  }

  function _splitValueAndUnit(s) {
    var match = _normaliseText(s).match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*([^\d\s].*)?$/i);
    if (!match) return null;
    return { value: Number(match[1]), unit: (match[2] || '').replace(/\s+/g, '') };
  }

  function _numericEqual(student, correct, spec) {
    var s = spec.unitRequired ? _splitValueAndUnit(student) : { value: _parseNum(student), unit: '' };
    var c = spec.unitRequired ? _splitValueAndUnit(correct) : { value: _parseNum(correct), unit: '' };
    if (!s || !c || s.value === null || c.value === null) return false;
    if (spec.unitRequired && s.unit !== c.unit) return false;
    var absTolerance = typeof spec.absoluteTolerance === 'number' ? spec.absoluteTolerance : 1e-9;
    var relTolerance = typeof spec.relativeTolerance === 'number' ? Math.abs(c.value) * spec.relativeTolerance : 0;
    return Math.abs(s.value - c.value) <= Math.max(absTolerance, relTolerance);
  }

  function _parseFraction(value) {
    var match = String(value).replace(/\s+/g, '').match(/^([+-]?\d+)(?:\/([+-]?\d+))?$/);
    if (!match) return null;
    var numerator = Number(match[1]), denominator = match[2] === undefined ? 1 : Number(match[2]);
    if (!denominator) return null;
    return { numerator: numerator, denominator: denominator };
  }

  function _fractionEqual(student, correct) {
    var s = _parseFraction(student), c = _parseFraction(correct);
    return !!s && !!c && s.numerator * c.denominator === c.numerator * s.denominator;
  }

  function _normaliseInequality(value) {
    return String(value).toLowerCase().replace(/\s+/g, '').replace(/≤|<=/g, '<=').replace(/≥|>=/g, '>=');
  }

  function _compatibilitySpec(topicId) {
    var halfDegree = { absoluteTolerance: 0.5 };
    var hundredth = { absoluteTolerance: 0.01 };
    var relative = { absoluteTolerance: 1, relativeTolerance: 0.01 };
    if (topicId === 'angles' || topicId === 'trig_graphs') return halfDegree;
    if (topicId === 'decimals' || topicId === 'dataanalysis') return hundredth;
    if (topicId === 'exponential' || topicId === 'series') return relative;
    if (topicId === 'measures' || topicId === 'similarity') {
      return { absoluteTolerance: 0.01, relativeTolerance: 0.01, unitRequired: true };
    }
    return { absoluteTolerance: 0.05 };
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

  function validate(topicId, studentAnswer, correctAnswer, validation) {
    var s = _normaliseText(studentAnswer);
    var c = _normaliseText(correctAnswer);
    var spec = validation || _compatibilitySpec(topicId);

    if (!s || !c) return false;

    if (topicId === 'angles' || topicId === 'trig_graphs') {
      s = s.replace(/[°º]$/, '');
      c = c.replace(/[°º]$/, '');
    }
    if (topicId === 'modular') {
      s = s.replace(/^x\s*=\s*/, '');
      c = c.replace(/^x\s*=\s*/, '');
    }

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

    if (topicId === 'fractions' && _fractionEqual(s, c)) return true;
    if (topicId === 'inequalities' && _normaliseInequality(s) === _normaliseInequality(c)) return true;

    // Numeric comparison (single value)
    if (_numericEqual(s, c, spec)) return true;

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
          return (rn !== null && srn !== null)
            ? _numericEqual(srn, rn, spec)
            : sr === r;
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
    parseNumber:      _parseNum,
  };

})();
