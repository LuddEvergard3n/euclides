/**
 * test/tests/generators.test.js
 * Coverage: every registered generator, every difficulty level.
 * Verifies that generateExercise() returns a structurally valid exercise
 * with a non-empty answer for all 79 topics × 5 difficulties = 395 cases.
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
