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
