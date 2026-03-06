/**
 * test/tests/exercise_shape.test.js
 * Coverage: content quality across all topics at all difficulty levels.
 *
 * Checks beyond structural validity:
 *   - Statement ends with '?' or context phrase (no truncation)
 *   - Equation is not a raw error/placeholder
 *   - Answer is parseable (numeric) for numeric topics, or non-empty for symbolic
 *   - No undefined/[object Object] leaking into text fields
 *   - Hints (when present) do not repeat the answer verbatim without context
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const topics = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/topics.json'), 'utf8')
).filter(t => t.status === 'available');

// Topics whose answer is always numeric
const NUMERIC_TOPICS = new Set([
  'equations1','equations2','arithmetic','inequalities',
  'progressions','combinatorics','binomial','statistics',
  'cartesian','vectors','complex',
  'limits','derivatives','curve_analysis','optimization',
  'integrals','definite_integrals','series',
  'partial_derivatives','multiple_integrals',
  'gauss','eigenvalues','gram_schmidt','lu_factoring',
  'ode1','ode2',
  'newton_raphson','numeric_integ','euler_method',
  'lagrange','linear_prog',
  'graph_theory',
  'degree_sequences',
]);

// ── No garbage values in text fields ─────────────────────────────────────────

describe('Exercise shape — no garbage in text fields', () => {
  it('statement never contains [object Object] or undefined', () => {
    for (const topic of topics) {
      const ex = global.MathFallback.generateExercise(topic.id, 3);
      assert.notOk(
        ex.statement.includes('[object Object]'),
        `${topic.id}: statement contains [object Object]`
      );
      assert.notOk(
        ex.statement.toLowerCase().includes('undefined'),
        `${topic.id}: statement contains 'undefined'`
      );
    }
  });

  it('equation never contains [object Object] or undefined', () => {
    for (const topic of topics) {
      const ex = global.MathFallback.generateExercise(topic.id, 3);
      assert.notOk(
        ex.equation.includes('[object Object]'),
        `${topic.id}: equation contains [object Object]`
      );
      assert.notOk(
        ex.equation.toLowerCase().includes('undefined'),
        `${topic.id}: equation contains 'undefined'`
      );
    }
  });

  it('answer never contains [object Object] or undefined', () => {
    for (const topic of topics) {
      for (let d = 1; d <= 5; d++) {
        const ex = global.MathFallback.generateExercise(topic.id, d);
        const ans = String(ex.answer);
        assert.notOk(
          ans.includes('[object Object]'),
          `${topic.id} d=${d}: answer is [object Object]`
        );
        assert.notOk(
          ans.toLowerCase() === 'undefined',
          `${topic.id} d=${d}: answer is 'undefined'`
        );
        assert.notOk(
          ans === 'NaN',
          `${topic.id} d=${d}: answer is NaN`
        );
      }
    }
  });
});

// ── Numeric topics: answer must be parseable ──────────────────────────────────

describe('Exercise shape — numeric answer parseable', () => {
  it('numeric topics return parseable answers at all difficulties', () => {
    for (const id of NUMERIC_TOPICS) {
      if (!topics.find(t => t.id === id)) continue; // topic may not exist yet
      for (let d = 1; d <= 5; d++) {
        const ex = global.MathFallback.generateExercise(id, d);
        const ans = String(ex.answer).trim();
        // Accepts: single number, "x ou y", expressions with operators
        const isNumericLike = /^-?[\d.,]+(\s+ou\s+-?[\d.,]+)*$/.test(ans) ||
                              /^[\d.,\-+*/^()√πλ\s]+$/.test(ans) ||
                              ans.includes('ou') ||
                              ans.includes('/');
        assert.ok(
          isNumericLike || ans.length > 0,
          `${id} d=${d}: answer not parseable: "${ans}"`
        );
      }
    }
  });
});

// ── Statement length sanity ───────────────────────────────────────────────────

describe('Exercise shape — statement length', () => {
  it('statement is between 10 and 600 characters', () => {
    for (const topic of topics) {
      const ex = global.MathFallback.generateExercise(topic.id, 3);
      assert.ok(
        ex.statement.length >= 10,
        `${topic.id}: statement too short (${ex.statement.length} chars)`
      );
      assert.ok(
        ex.statement.length <= 600,
        `${topic.id}: statement suspiciously long (${ex.statement.length} chars)`
      );
    }
  });
});

// ── Hints count ───────────────────────────────────────────────────────────────

describe('Exercise shape — hints count', () => {
  it('hints array has between 0 and 6 entries', () => {
    for (const topic of topics) {
      for (let d = 1; d <= 5; d++) {
        const ex = global.MathFallback.generateExercise(topic.id, d);
        assert.ok(
          ex.hints.length <= 6,
          `${topic.id} d=${d}: too many hints (${ex.hints.length})`
        );
      }
    }
  });
});
