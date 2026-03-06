/**
 * test/tests/rng.test.js
 * Coverage: MathRNG — PRNG behaviour, randInt distribution, reseed.
 */

'use strict';

const { randInt, reseed } = global.MathRNG;

// ── randInt bounds ─────────────────────────────────────────────────────────────

describe('MathRNG.randInt — bounds', () => {
  it('always returns integer within [min, max]', () => {
    for (let i = 0; i < 1000; i++) {
      const v = randInt(1, 10);
      assert.ok(Number.isInteger(v), `not integer: ${v}`);
      assert.ok(v >= 1,  `below min: ${v}`);
      assert.ok(v <= 10, `above max: ${v}`);
    }
  });

  it('handles single-value range [n, n]', () => {
    for (let i = 0; i < 20; i++) {
      assert.equal(randInt(7, 7), 7);
    }
  });

  it('handles negative ranges', () => {
    for (let i = 0; i < 200; i++) {
      const v = randInt(-5, -1);
      assert.ok(v >= -5 && v <= -1, `out of range: ${v}`);
    }
  });
});

// ── Distribution: all values reachable ────────────────────────────────────────

describe('MathRNG.randInt — distribution', () => {
  it('covers full range [1,6] within 200 samples', () => {
    const seen = new Set();
    for (let i = 0; i < 200; i++) seen.add(randInt(1, 6));
    for (let v = 1; v <= 6; v++) {
      assert.ok(seen.has(v), `value ${v} never generated in 200 samples`);
    }
  });

  it('does not return only one value for wide range', () => {
    const seen = new Set();
    for (let i = 0; i < 50; i++) seen.add(randInt(1, 100));
    assert.ok(seen.size >= 10, `expected >= 10 distinct values, got ${seen.size}`);
  });
});

// ── reseed ────────────────────────────────────────────────────────────────────

describe('MathRNG.reseed', () => {
  it('does not throw', () => {
    assert.ok(typeof reseed === 'function');
    reseed(); // must not throw
  });

  it('produces different values after reseed across time', () => {
    // Call reseed and generate a batch, then wait 1ms and repeat
    reseed();
    const batch1 = Array.from({ length: 10 }, () => randInt(1, 1000));
    // Mutate state a bit more
    for (let i = 0; i < 5; i++) randInt(1, 100);
    reseed();
    const batch2 = Array.from({ length: 10 }, () => randInt(1, 1000));
    // They should not be identical (astronomically unlikely)
    const same = batch1.every((v, i) => v === batch2[i]);
    assert.notOk(same, 'batches should differ after reseed');
  });
});
