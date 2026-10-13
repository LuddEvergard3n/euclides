/**
 * test/tests/generators.test.js
 * Coverage: every registered generator, every difficulty level.
 * Verifies that generateExercise() returns a structurally valid exercise
 * with a non-empty answer for all available topics and five difficulty levels.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// Load topics from JSON
const topics = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/topics.json'), 'utf8')
).filter(t => t.status === 'available');

// ── Shape validator ────────────────────────────────────────────────────────────

const EXERCISE_SHAPE = {
  statement: v => typeof v === 'string' && v.trim().length > 0,
  equation:  v => typeof v === 'string' && v.trim().length > 0,
  answer:    v => v !== undefined && v !== null && String(v).trim() !== '' && String(v) !== '—',
  hints:     v => Array.isArray(v),
};

// ── Coverage: all topics × all difficulties ────────────────────────────────────

describe('Generators — structural validity', () => {
  for (const topic of topics) {
    for (let diff = 1; diff <= 5; diff++) {
      it(`${topic.id} d=${diff} returns valid exercise`, () => {
        const ex = global.MathFallback.generateExercise(topic.id, diff);
        assert.hasShape(ex, EXERCISE_SHAPE, `${topic.id} d=${diff}`);
      });
    }
  }
});

// ── Fallback for unknown topic ─────────────────────────────────────────────────

describe('Generators — unknown topic fallback', () => {
  it('returns fallback object for unregistered topic', () => {
    const ex = global.MathFallback.generateExercise('__nonexistent_topic__', 1);
    assert.ok(typeof ex === 'object', 'returns object');
    assert.ok('statement' in ex, 'has statement');
    assert.ok('answer' in ex, 'has answer');
  });
});

// ── Variability: same topic same difficulty produces varied exercises ──────────

describe('Generators — variability', () => {
  it('consecutive calls for same topic/difficulty differ', () => {
    // Use a topic with multiple exercise patterns
    const answers = new Set();
    const statements = new Set();
    for (let i = 0; i < 8; i++) {
      const ex = global.MathFallback.generateExercise('equations1', 1);
      answers.add(String(ex.answer));
      statements.add(ex.statement);
    }
    // Expect at least 2 distinct answers across 8 calls
    assert.ok(answers.size >= 2, `expected >= 2 distinct answers, got ${answers.size}`);
  });

  for (const topic of topics) {
    it(topic.id + ' provides at least three task forms', () => {
      const forms = new Set();
      for (let difficulty = 1; difficulty <= 5; difficulty++) {
        global.MathRNG.setSeed(1000 + difficulty);
        const ex = global.MathFallback.generateExercise(topic.id, difficulty);
        forms.add(ex.statement + '|' + ex.equation);
      }
      assert.ok(forms.size >= 3, topic.id + ' exposes only ' + forms.size + ' task forms');
    });
  }
});

describe('Generators — deterministic properties', () => {
  for (const topic of topics) {
    it(topic.id + ' reproduces and validates seeded exercises', () => {
      global.MathRNG.setSeed(20261012);
      const first = global.MathFallback.generateExercise(topic.id, 3);
      global.MathRNG.setSeed(20261012);
      const second = global.MathFallback.generateExercise(topic.id, 3);
      assert.equal(JSON.stringify(first), JSON.stringify(second), topic.id + ' is not deterministic');
      for (let seed = 1; seed <= 10; seed++) {
        global.MathRNG.setSeed(seed * 7919);
        const difficulty = (seed % 5) + 1;
        const ex = global.MathCore.generateExercise(topic.id, difficulty);
        assert.ok(global.MathFallback.validate(topic.id, ex.answer, ex.answer, ex.validation), topic.id + ' rejected its canonical answer at seed ' + seed);
        assert.notOk(/(?:^|[^a-z])(?:NaN|Infinity|undefined)(?:$|[^a-z])|\[object Object\]/i.test(ex.statement + ex.equation + ex.answer), topic.id + ' produced an invalid value at seed ' + seed);
      }
    });
  }

  it('factoring quadratics preserve their generated roots', () => {
    for (let seed = 1; seed <= 50; seed++) {
      global.MathRNG.setSeed(seed * 3571);
      const ex = global.MathFallback.generateExercise('factoring', 4);
      const factor = value => '(x ' + (value >= 0 ? '− ' + value : '+ ' + Math.abs(value)) + ')';
      assert.equal(ex.answer, factor(ex.r1) + factor(ex.r2), 'incorrect factors at seed ' + seed);
      assert.equal(ex.r1 * ex.r2, ex.c, 'constant term does not match roots at seed ' + seed);
    }
  });

  it('linear systems preserve both generated equations', () => {
    for (let seed = 1; seed <= 50; seed++) {
      global.MathRNG.setSeed(seed * 4567);
      const ex = global.MathFallback.generateExercise('systems', (seed % 5) + 1);
      assert.equal(ex.a1 * ex.x0 + ex.b1 * ex.y0, ex.c1, 'first equation failed at seed ' + seed);
      assert.equal(ex.a2 * ex.x0 + ex.b2 * ex.y0, ex.c2, 'second equation failed at seed ' + seed);
    }
  });

  it('quadratic equations preserve their discriminant', () => {
    for (let seed = 1; seed <= 50; seed++) {
      global.MathRNG.setSeed(seed * 6151);
      const ex = global.MathFallback.generateExercise('equations2', (seed % 5) + 1);
      assert.equal(ex.delta, ex.b * ex.b - 4 * ex.a * ex.c, 'incorrect discriminant at seed ' + seed);
    }
  });

  it('matrix results match their generated operands', () => {
    for (let difficulty = 1; difficulty <= 5; difficulty++) {
      for (let seed = 1; seed <= 25; seed++) {
        global.MathRNG.setSeed(seed * 6997);
        const ex = global.MathFallback.generateExercise('matrices', difficulty);
        if (ex.matType === 'add') {
          assert.deepEqual(ex.matR, ex.matA.map((row, i) => row.map((value, j) => value + ex.matB[i][j])), 'incorrect matrix sum at seed ' + seed);
        } else if (ex.matType === 'multiply') {
          const product = [0, 1].map(i => [0, 1].map(j => ex.matA[i][0] * ex.matB[0][j] + ex.matA[i][1] * ex.matB[1][j]));
          assert.deepEqual(ex.matR, product, 'incorrect matrix product at seed ' + seed);
        } else {
          const matrix = ex.matA;
          const determinant = matrix.length === 2
            ? matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
            : matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
          assert.equal(Number(ex.answer), determinant, 'incorrect determinant at seed ' + seed);
          if (difficulty === 3) {
            assert.equal(ex.choices.length, 4, 'determinant task must provide four choices');
            assert.equal(new Set(ex.choices).size, 4, 'determinant choices must be unique');
            assert.ok(ex.choices.includes(ex.answer), 'determinant choices omit the answer');
          }
        }
      }
    }
  });
});

// ── Hints are strings when present ────────────────────────────────────────────

describe('Generators — hint quality', () => {
  it('all hints are non-empty strings when present', () => {
    for (const topic of topics) {
      const ex = global.MathFallback.generateExercise(topic.id, 3);
      ex.hints.forEach((h, i) => {
        assert.ok(
          typeof h === 'string' && h.trim().length > 0,
          `${topic.id}: hint[${i}] must be a non-empty string, got ${JSON.stringify(h)}`
        );
      });
    }
  });
});
