/**
 * test/tests/difficulty.test.js
 * Coverage: MathRNG.nextDifficulty() — adaptive difficulty progression.
 *
 * Rules (from rng.js):
 *   - 3 consecutive correct from last 5 → increase by 1 (max 5)
 *   - 3 or more wrong in last 5 → decrease by 1 (min 1)
 *   - Otherwise → keep current
 *   - Empty history → return 1
 */

'use strict';

const { nextDifficulty } = global.MathRNG;

// Helper: build a history array with _difficulty tag
function history(booleans, current) {
  const h = booleans.slice();
  h._difficulty = current || 1;
  return h;
}

// ── Empty / initial state ─────────────────────────────────────────────────────

describe('nextDifficulty — initial state', () => {
  it('returns 1 for empty history', () => {
    assert.equal(nextDifficulty([]), 1);
  });

  it('returns 1 for null/undefined history', () => {
    assert.equal(nextDifficulty(null),      1);
    assert.equal(nextDifficulty(undefined), 1);
  });
});

// ── Increase on correct streak ────────────────────────────────────────────────

describe('nextDifficulty — increase', () => {
  it('increases after 3 consecutive correct', () => {
    const h = history([true, true, true], 2);
    assert.equal(nextDifficulty(h), 3);
  });

  it('increases after 4 consecutive correct', () => {
    const h = history([false, true, true, true, true], 3);
    assert.equal(nextDifficulty(h), 4);
  });

  it('does not exceed 5', () => {
    const h = history([true, true, true, true, true], 5);
    assert.equal(nextDifficulty(h), 5);
  });

  it('does not increase on 2 correct', () => {
    const h = history([false, false, false, true, true], 2);
    assert.equal(nextDifficulty(h), 1); // 3 wrong in last 5 → decrease
  });
});

// ── Decrease on wrong streak ──────────────────────────────────────────────────

describe('nextDifficulty — decrease', () => {
  it('decreases after 3 wrong in last 5', () => {
    const h = history([false, false, false, true, true], 3);
    assert.equal(nextDifficulty(h), 2);
  });

  it('decreases after 4 wrong in last 5', () => {
    const h = history([false, false, false, false, true], 4);
    assert.equal(nextDifficulty(h), 3);
  });

  it('does not go below 1', () => {
    const h = history([false, false, false, false, false], 1);
    assert.equal(nextDifficulty(h), 1);
  });
});

// ── Neutral / stable ──────────────────────────────────────────────────────────

describe('nextDifficulty — stable', () => {
  it('keeps difficulty on mixed results (2W 2C)', () => {
    const h = history([true, false, true, false], 3);
    assert.equal(nextDifficulty(h), 3);
  });

  it('keeps difficulty on 2 correct (no streak)', () => {
    const h = history([false, true, false, true], 2);
    assert.equal(nextDifficulty(h), 2);
  });
});

// ── Boundary: only last 5 matter ──────────────────────────────────────────────

describe('nextDifficulty — last-5 window', () => {
  it('ignores older results beyond last 5', () => {
    // 10 wrong, then 3 correct — only last 5 count: [F,F,C,C,C]
    // streak of 3 → increase
    const h = history(
      [false, false, false, false, false, false, false, false, false, false,
       false, false, true, true, true],
      2
    );
    assert.equal(nextDifficulty(h), 3);
  });
});
