/**
 * test/assert.js
 * Minimal assertion library for Euclides test suite.
 * Each function throws AssertionError on failure.
 * No external dependencies.
 */

'use strict';

// ── AssertionError ────────────────────────────────────────────────────────────

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name    = 'AssertionError';
    this.actual   = actual;
    this.expected = expected;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _fmt(v) {
  if (v === null)      return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'object') {
    try { return JSON.stringify(v); } catch (_) { return String(v); }
  }
  return String(v);
}

// ── Assertions ────────────────────────────────────────────────────────────────

/**
 * Strict equality (===).
 * assert.equal(2 + 2, 4, 'basic addition')
 */
function equal(actual, expected, msg) {
  if (actual !== expected) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      'Expected ' + _fmt(expected) + ' but got ' + _fmt(actual),
      actual, expected
    );
  }
}

/**
 * Strict inequality (!==).
 * assert.notEqual(a, b, 'must differ')
 */
function notEqual(actual, unexpected, msg) {
  if (actual === unexpected) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      'Expected value to differ from ' + _fmt(unexpected),
      actual, '!== ' + _fmt(unexpected)
    );
  }
}

/**
 * Numeric proximity (|actual - expected| <= tolerance).
 * Default tolerance: 0.01
 * assert.approx(Math.PI, 3.14159, 0.00001, 'pi approximation')
 */
function approx(actual, expected, tolerance, msg) {
  if (typeof tolerance === 'string') { msg = tolerance; tolerance = 0.01; }
  tolerance = tolerance != null ? tolerance : 0.01;
  var diff = Math.abs(Number(actual) - Number(expected));
  if (isNaN(diff) || diff > tolerance) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      _fmt(actual) + ' is not within ' + tolerance + ' of ' + _fmt(expected) +
      ' (diff=' + (isNaN(diff) ? 'NaN' : diff.toFixed(6)) + ')',
      actual, expected + ' ± ' + tolerance
    );
  }
}

/**
 * Truthy condition.
 * assert.ok(arr.length > 0, 'array must not be empty')
 */
function ok(condition, msg) {
  if (!condition) {
    throw new AssertionError(
      (msg ? msg : 'Expected truthy value but got ' + _fmt(condition)),
      condition, 'truthy'
    );
  }
}

/**
 * Falsy condition.
 * assert.notOk(errors.length, 'no errors expected')
 */
function notOk(condition, msg) {
  if (condition) {
    throw new AssertionError(
      (msg ? msg : 'Expected falsy value but got ' + _fmt(condition)),
      condition, 'falsy'
    );
  }
}

/**
 * Deep structural equality (JSON-round-trip comparison).
 * Suitable for plain objects and arrays.
 * assert.deepEqual({ a: 1 }, { a: 1 }, 'objects match')
 */
function deepEqual(actual, expected, msg) {
  var a = JSON.stringify(actual);
  var b = JSON.stringify(expected);
  if (a !== b) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      'Deep equality failed:\n  actual:   ' + a + '\n  expected: ' + b,
      actual, expected
    );
  }
}

/**
 * Asserts that a function throws (optionally matching a string or RegExp).
 * assert.throws(() => fn(badInput), /error/, 'should throw on bad input')
 */
function throws(fn, pattern, msg) {
  if (typeof pattern === 'string') { msg = pattern; pattern = null; }
  var threw = false;
  var err;
  try { fn(); } catch (e) { threw = true; err = e; }
  if (!threw) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') + 'Expected function to throw but it did not',
      'no throw', 'throw'
    );
  }
  if (pattern instanceof RegExp && !pattern.test(err.message)) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      'Thrown message ' + _fmt(err.message) + ' does not match ' + pattern,
      err.message, pattern.toString()
    );
  }
}

/**
 * Asserts that obj has all required fields and that each field passes
 * an optional per-field validator: { field: fn } or just [field, field].
 *
 * assert.hasShape(exercise, {
 *   statement: (v) => typeof v === 'string' && v.length > 0,
 *   answer:    (v) => v !== '—',
 *   hints:     (v) => Array.isArray(v),
 * }, 'exercise shape')
 */
function hasShape(obj, shape, msg) {
  if (typeof obj !== 'object' || obj === null) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') + 'Expected an object but got ' + _fmt(obj),
      obj, 'object'
    );
  }
  var fields = Array.isArray(shape) ? shape : Object.keys(shape);
  fields.forEach(function (field) {
    if (!(field in obj)) {
      throw new AssertionError(
        (msg ? msg + '\n  ' : '') + 'Missing field: ' + _fmt(field),
        obj, '{ ' + field + ': ... }'
      );
    }
    if (!Array.isArray(shape) && typeof shape[field] === 'function') {
      var valid = shape[field](obj[field]);
      if (!valid) {
        throw new AssertionError(
          (msg ? msg + '\n  ' : '') +
          'Field ' + _fmt(field) + ' failed validator. Value: ' + _fmt(obj[field]),
          obj[field], 'passes validator'
        );
      }
    }
  });
}

/**
 * Asserts that a string matches a RegExp.
 * assert.match('hello world', /world/, 'contains world')
 */
function match(str, pattern, msg) {
  if (!pattern.test(str)) {
    throw new AssertionError(
      (msg ? msg + '\n  ' : '') +
      _fmt(str) + ' does not match ' + pattern,
      str, pattern.toString()
    );
  }
}

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  AssertionError,
  equal,
  notEqual,
  approx,
  ok,
  notOk,
  deepEqual,
  throws,
  hasShape,
  match,
};
