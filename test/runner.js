#!/usr/bin/env node
/**
 * test/runner.js
 * Euclides test runner.
 *
 * Usage:
 *   node test/runner.js                   # run all test files
 *   node test/runner.js generators        # run tests matching 'generators'
 *   node test/runner.js --verbose         # show passing tests too
 *
 * Exit code: 0 = all pass, 1 = any failure.
 *
 * Architecture:
 *   1. Bootstrap — polyfill browser globals (window, localStorage, document)
 *   2. Load     — evaluate all math/*.js files in dependency order
 *   3. Discover — find test/tests/*.test.js matching optional filter
 *   4. Execute  — run each suite, catch assertion errors vs unexpected errors
 *   5. Report   — colored summary, per-file breakdown
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── CLI args ──────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const filter  = args.filter(a => !a.startsWith('--') && !a.startsWith('-'))[0] || '';

// ── ANSI colors ───────────────────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

function green(s)  { return C.green  + s + C.reset; }
function red(s)    { return C.red    + s + C.reset; }
function yellow(s) { return C.yellow + s + C.reset; }
function cyan(s)   { return C.cyan   + s + C.reset; }
function bold(s)   { return C.bold   + s + C.reset; }
function dim(s)    { return C.dim    + s + C.reset; }

// ── Step 1: Browser global bootstrap ─────────────────────────────────────────

function bootstrapGlobals() {
  // Minimal localStorage mock
  const _store = {};
  const localStorage = {
    getItem:    (k)    => _store[k] !== undefined ? _store[k] : null,
    setItem:    (k, v) => { _store[k] = String(v); },
    removeItem: (k)    => { delete _store[k]; },
    clear:      ()     => { Object.keys(_store).forEach(k => delete _store[k]); },
  };

  // Minimal document mock (only dispatchEvent needed by progress.js)
  const _listeners = {};
  const document = {
    dispatchEvent: (e) => {
      const list = _listeners[e.type] || [];
      list.forEach(fn => fn(e));
    },
    addEventListener: (type, fn) => {
      if (!_listeners[type]) _listeners[type] = [];
      _listeners[type].push(fn);
    },
    removeEventListener: (type, fn) => {
      if (_listeners[type]) {
        _listeners[type] = _listeners[type].filter(f => f !== fn);
      }
    },
    getElementById: () => null,
    querySelector:  () => null,
    querySelectorAll: () => ({ forEach: () => {} }),
    readyState: 'complete',
    body: { appendChild: () => {}, removeChild: () => {} },
  };

  // window = global namespace, same object
  global.window       = global;
  global.localStorage = localStorage;
  global.document     = document;

  // Stub browser APIs that math modules don't use but reference
  global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
  global.CustomEvent = class CustomEvent {
    constructor(type, opts) { this.type = type; this.detail = (opts || {}).detail; }
  };
}

// ── Step 2: Load math modules ─────────────────────────────────────────────────

function loadMathModules() {
  const BASE = path.join(__dirname, '..', 'math');

  // Generators must be registered before fallback.js reads them
  global.MathGenerators = {};

  const FILES = [
    path.join(BASE, 'rng.js'),
    // Generators — order does not matter among themselves
    path.join(BASE, 'generators', 'efI.js'),
    path.join(BASE, 'generators', 'efII.js'),
    path.join(BASE, 'generators', 'algebra.js'),
    path.join(BASE, 'generators', 'functions.js'),
    path.join(BASE, 'generators', 'geometry.js'),
    path.join(BASE, 'generators', 'trig.js'),
    path.join(BASE, 'generators', 'prob.js'),
    path.join(BASE, 'generators', 'matrices_logic.js'),
    path.join(BASE, 'generators', 'calculus_adv.js'),
    path.join(BASE, 'generators', 'calc_I.js'),
    path.join(BASE, 'generators', 'calc_II.js'),
    path.join(BASE, 'generators', 'calc_III.js'),
    path.join(BASE, 'generators', 'lin_alg.js'),
    path.join(BASE, 'generators', 'ode_prob.js'),
    path.join(BASE, 'generators', 'numeric_transforms.js'),
    path.join(BASE, 'generators', 'lin_alg_adv.js'),
    path.join(BASE, 'generators', 'batch3.js'),
    path.join(BASE, 'generators', 'batch4.js'),
    // Fallback/dispatcher last
    path.join(BASE, 'fallback.js'),
  ];

  FILES.forEach(f => {
    const src = fs.readFileSync(f, 'utf8')
      // Replace window.X = ... with global.X = ...
      .replace(/window\./g, 'global.');
    try {
      // eslint-disable-next-line no-new-func
      new Function('require', 'module', 'exports', src)(require, module, exports);
    } catch (e) {
      console.error(red('LOAD ERROR: ' + path.basename(f) + '\n  ' + e.message));
      process.exit(1);
    }
  });

  // MathCore shim: in tests we use MathFallback directly (no WASM)
  global.MathCore = {
    generateExercise: global.MathFallback.generateExercise,
    nextDifficulty:   global.MathFallback.nextDifficulty,
    usingWasm:        () => false,
    load:             () => Promise.resolve(),
  };
}

// ── Step 3: Test registry (used by test files) ────────────────────────────────

const _suites = [];   // [{ name, tests: [{ desc, fn }] }]

/**
 * describe(name, fn)
 * Groups related tests under a named suite.
 */
global.describe = function describe(name, fn) {
  const suite = { name, tests: [], beforeEach: null, afterEach: null };
  _suites.push(suite);
  const prev = global._currentSuite;
  global._currentSuite = suite;
  fn();
  global._currentSuite = prev;
};

/**
 * it(description, fn)
 * Registers a single test case. fn may be async.
 */
global.it = function it(desc, fn) {
  const suite = global._currentSuite;
  if (!suite) throw new Error('it() called outside describe()');
  suite.tests.push({ desc, fn });
};

/**
 * beforeEach(fn) — runs before each test in the current describe block.
 */
global.beforeEach = function beforeEach(fn) {
  if (global._currentSuite) global._currentSuite.beforeEach = fn;
};

/**
 * afterEach(fn) — runs after each test in the current describe block.
 */
global.afterEach = function afterEach(fn) {
  if (global._currentSuite) global._currentSuite.afterEach = fn;
};

// Expose assert to test files
global.assert = require(path.join(__dirname, 'assert.js'));

// ── Step 4: Discover test files ───────────────────────────────────────────────

function discoverTests() {
  const dir = path.join(__dirname, 'tests');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.test.js'))
    .filter(f => !filter || f.includes(filter))
    .sort()
    .map(f => path.join(dir, f));
}

// ── Step 5: Execute & report ──────────────────────────────────────────────────

async function runAll(files) {
  console.log('\n' + bold('Euclides Test Suite'));
  console.log(dim('─'.repeat(52)));

  let totalPass = 0;
  let totalFail = 0;
  const failures = [];

  for (const file of files) {
    const label = path.basename(file, '.test.js');

    // Load the test file — populates _suites via describe/it
    const before = _suites.length;
    try {
      require(file);
    } catch (e) {
      console.error(red('  PARSE ERROR: ' + label + '\n    ' + e.message));
      totalFail++;
      continue;
    }
    const fileSuites = _suites.slice(before);

    let filePass = 0;
    let fileFail = 0;

    console.log('\n' + cyan(bold(label)));

    for (const suite of fileSuites) {
      const suiteLabel = suite.name;

      for (const test of suite.tests) {
        try {
          if (suite.beforeEach) await suite.beforeEach();
          await test.fn();
          if (suite.afterEach) await suite.afterEach();
          filePass++;
          totalPass++;
          if (verbose) {
            console.log('  ' + green('PASS') + ' ' + dim(suiteLabel + ' > ') + test.desc);
          }
        } catch (e) {
          fileFail++;
          totalFail++;
          const loc = suiteLabel + ' > ' + test.desc;
          failures.push({ file: label, loc, error: e });
          console.log('  ' + red('FAIL') + ' ' + dim(suiteLabel + ' > ') + test.desc);
          console.log('       ' + dim(e.message.split('\n').join('\n       ')));
        }
      }
    }

    const status = fileFail === 0
      ? green(filePass + ' passed')
      : red(fileFail + ' failed') + dim(', ' + filePass + ' passed');
    console.log(dim('  ─── ') + status);
  }

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n' + dim('═'.repeat(52)));

  if (totalFail === 0) {
    console.log(bold(green('  ALL TESTS PASSED')) +
      dim('  (' + totalPass + ' tests)'));
  } else {
    console.log(bold(red('  ' + totalFail + ' FAILED')) +
      dim('  ' + totalPass + ' passed, ' + (totalPass + totalFail) + ' total'));

    console.log('\n' + bold('Failures:'));
    failures.forEach((f, i) => {
      console.log('\n  ' + yellow((i + 1) + '. [' + f.file + '] ' + f.loc));
      console.log('     ' + dim(f.error.message.split('\n').join('\n     ')));
      if (f.error.name !== 'AssertionError' && f.error.stack) {
        const stackLine = f.error.stack.split('\n')[1] || '';
        console.log('     ' + dim(stackLine.trim()));
      }
    });
  }
  console.log('');

  process.exit(totalFail > 0 ? 1 : 0);
}

// ── Main ──────────────────────────────────────────────────────────────────────

bootstrapGlobals();
loadMathModules();

const files = discoverTests();
if (files.length === 0) {
  console.error(yellow('No test files found' + (filter ? ' matching "' + filter + '"' : '') + '.'));
  process.exit(1);
}

runAll(files).catch(e => {
  console.error(red('Runner error: ' + e.message));
  process.exit(1);
});
