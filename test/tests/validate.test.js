/**
 * test/tests/validate.test.js
 * Coverage: MathFallback.validate() — all answer acceptance/rejection rules.
 *
 * Scenarios:
 *   - Exact string match
 *   - Case-insensitive string match
 *   - Numeric match within tolerance
 *   - Comma-decimal input ("3,14")
 *   - Multi-root answers ("x = 2 ou x = -3")
 *   - Trig normalisation ("sqrt(3)/2" == "√3/2")
 *   - Rejection of wrong answers
 */

'use strict';

const { validate } = global.MathFallback;

// ── Exact and string matches ───────────────────────────────────────────────────

describe('validate — exact matches', () => {
  it('accepts identical strings', () => {
    assert.ok(validate('any', '42', '42'));
  });

  it('accepts case-insensitive match for symbolic answers', () => {
    assert.ok(validate('any', 'SIM', 'sim'));
    assert.ok(validate('any', 'Não', 'não'));
  });

  it('rejects wrong string', () => {
    assert.notOk(validate('any', 'wrong', 'correct'));
  });
});

// ── Numeric tolerance ─────────────────────────────────────────────────────────

describe('validate — numeric tolerance', () => {
  it('accepts exact integer', () => {
    assert.ok(validate('any', '7', '7'));
  });

  it('accepts float within tolerance (< 1e-9)', () => {
    assert.ok(validate('any', '3.14159265', '3.14159265'));
  });

  it('accepts comma decimal (pt-BR input)', () => {
    assert.ok(validate('any', '3,14', '3.14'));
  });

  it('rejects float outside tolerance', () => {
    assert.notOk(validate('any', '3.14', '3.15'));
  });

  it('accepts negative numbers', () => {
    assert.ok(validate('equations1', '-5', '-5'));
  });

  it('rejects opposite-sign answer', () => {
    assert.notOk(validate('equations1', '5', '-5'));
  });
});

// ── Multi-root answers ────────────────────────────────────────────────────────

describe('validate — multi-root answers', () => {
  it('accepts both roots in order', () => {
    assert.ok(validate('equations2', '2 ou -3', '2 ou -3'));
  });

  it('accepts roots regardless of order', () => {
    assert.ok(validate('equations2', '-3 ou 2', '2 ou -3'));
  });

  it('rejects partial answer (only one root)', () => {
    assert.notOk(validate('equations2', '2', '2 ou -3'));
  });

  it('rejects wrong roots', () => {
    assert.notOk(validate('equations2', '1 ou -4', '2 ou -3'));
  });
});

// ── Trig normalisation ────────────────────────────────────────────────────────

describe('validate — trig normalisation', () => {
  it('accepts sqrt(3)/2 == √3/2', () => {
    assert.ok(validate('trig', 'sqrt(3)/2', '√3/2'));
  });

  it('accepts raiz(3)/2 == √3/2', () => {
    assert.ok(validate('trig', 'raiz(3)/2', '√3/2'));
  });

  it('accepts indefinida == indef.', () => {
    assert.ok(validate('trig', 'indefinida', 'indef.'));
  });

  it('accepts nao existe == indef.', () => {
    assert.ok(validate('trig', 'nao existe', 'indef.'));
  });

  it('rejects wrong trig value', () => {
    assert.notOk(validate('trig', '1/2', '√3/2'));
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('validate — edge cases', () => {
  it('rejects empty string', () => {
    assert.notOk(validate('any', '', '42'));
  });

  it('rejects whitespace-only', () => {
    assert.notOk(validate('any', '   ', '42'));
  });

  it('accepts answer with leading/trailing whitespace', () => {
    // Validate trims both sides
    assert.ok(validate('any', '  42  ', '42'));
  });
});
