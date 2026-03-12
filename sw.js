/**
 * sw.js — Euclides service worker
 * Strategy: cache-first for all static assets.
 *           network-first-with-cache-fallback for Google Fonts.
 * Bump CACHE_VER to force cache refresh on deploy.
 * FONT_CACHE is intentionally stable — never deleted on version bumps.
 */

var CACHE_VER  = 'euclides-v4-1';
var FONT_CACHE = 'euclides-fonts-v1';  // separate, persistent font cache
var CACHE_URLS = [
  './',
  './index.html',
  './sobre.html',
  './guia-professor.html',
  './plano-aula.html',
  './style.css',
  './manifest.json',
  './icon.svg',
  './data/topics.json',
  /* Infrastructure JS */
  './js/progress.js',
  './js/ui.js',
  './js/renderer.js',
  './js/router.js',
  './js/wasm-loader.js',
  './js/teacher.js',
  './js/anim.js',
  './js/sidebar.js',
  './js/stats.js',
  './js/review.js',
  './js/completion.js',
  './js/exam.js',
  './js/main.js',
  /* Math core */
  './math/rng.js',
  './math/fallback.js',
  /* Generators */
  './math/generators/algebra.js',
  './math/generators/batch3.js',
  './math/generators/batch4.js',
  './math/generators/calc_I.js',
  './math/generators/calc_II.js',
  './math/generators/calc_III.js',
  './math/generators/calculus_adv.js',
  './math/generators/efI.js',
  './math/generators/efII.js',
  './math/generators/functions.js',
  './math/generators/geometry.js',
  './math/generators/lin_alg.js',
  './math/generators/lin_alg_adv.js',
  './math/generators/matrices_logic.js',
  './math/generators/numeric_transforms.js',
  './math/generators/ode_prob.js',
  './math/generators/prob.js',
  './math/generators/trig.js',
  /* Modules (79) */
  './modules/algebraic.js',
  './modules/analytic_geo.js',
  './modules/angles.js',
  './modules/arithmetic.js',
  './modules/binomial.js',
  './modules/calc_limits.js',
  './modules/calculus.js',
  './modules/cartesian.js',
  './modules/combinatorics.js',
  './modules/complex.js',
  './modules/conics.js',
  './modules/curve_analysis.js',
  './modules/dataanalysis.js',
  './modules/decimals.js',
  './modules/definite_integrals.js',
  './modules/derivatives.js',
  './modules/distributions.js',
  './modules/eigenvalues_adv.js',
  './modules/equations1.js',
  './modules/equations2.js',
  './modules/euler_method.js',
  './modules/exponential.js',
  './modules/factoring.js',
  './modules/finance.js',
  './modules/fourier_series.js',
  './modules/fractions.js',
  './modules/functions.js',
  './modules/gauss_elim.js',
  './modules/geometry.js',
  './modules/gram_schmidt.js',
  './modules/graph_theory.js',
  './modules/heat_eq.js',
  './modules/complex_var.js',
  './modules/runge_kutta.js',
  './modules/wave_eq.js',
  './modules/interpolation.js',
  './modules/ode_systems.js',
  './modules/inequalities.js',
  './modules/inference.js',
  './modules/integers.js',
  './modules/integrals.js',
  './modules/inverse_func.js',
  './modules/lagrange.js',
  './modules/laplace.js',
  './modules/lin_transformations.js',
  './modules/linear_prog.js',
  './modules/logarithms.js',
  './modules/logic.js',
  './modules/lu_factoring.js',
  './modules/markov.js',
  './modules/matrices.js',
  './modules/measures.js',
  './modules/mmc_mdc.js',
  './modules/modular.js',
  './modules/multiple_integrals.js',
  './modules/newton_raphson.js',
  './modules/nonlinear.js',
  './modules/numeric_integ.js',
  './modules/ode_first.js',
  './modules/ode_second.js',
  './modules/optimization.js',
  './modules/partial_deriv.js',
  './modules/polynomials.js',
  './modules/powers.js',
  './modules/prob_advanced.js',
  './modules/probability.js',
  './modules/progressions.js',
  './modules/quadratic_forms.js',
  './modules/ratio.js',
  './modules/rationals.js',
  './modules/real_numbers.js',
  './modules/regression.js',
  './modules/series.js',
  './modules/series_calc.js',
  './modules/similarity.js',
  './modules/spatial.js',
  './modules/statistics.js',
  './modules/systems.js',
  './modules/trig.js',
  './modules/trig_circle.js',
  './modules/trig_graphs.js',
  './modules/vector_calc.js',
  './modules/vector_spaces.js',
  './modules/vectors.js',
];

// ── Install: pre-cache all static assets ─────────────────────────

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VER).then(function (cache) {
      return Promise.all(
        CACHE_URLS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SW] Failed to cache:', url, err);
          });
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

// ── Activate: delete old app caches, preserve font cache ──────────

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k !== CACHE_VER && k !== FONT_CACHE; })
          .map(function (k)    { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// ── Helpers ───────────────────────────────────────────────────────

function _isFont(url) {
  return url.indexOf('fonts.googleapis.com') !== -1 ||
         url.indexOf('fonts.gstatic.com')    !== -1;
}

// ── Fetch ─────────────────────────────────────────────────────────
//
// Google Fonts: network-first, cache on success, serve stale if offline.
//   - fonts.googleapis.com  → CSS with @font-face declarations
//   - fonts.gstatic.com     → .woff2 binary files
//   Both caches are stored in FONT_CACHE (persistent across version bumps).
//
// Everything else: cache-first, network fallback (pre-cached at install).

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var url = e.request.url;

  // ── Font requests: network-first with persistent cache ───────────
  if (_isFont(url)) {
    e.respondWith(
      fetch(e.request).then(function (response) {
        // Cache any successful response, including opaque woff2 files.
        if (response && (response.status === 200 || response.type === 'opaque')) {
          var clone = response.clone();
          caches.open(FONT_CACHE).then(function (cache) { cache.put(e.request, clone); });
        }
        return response;
      }).catch(function () {
        // Network unavailable — try stale font from cache.
        return caches.match(e.request);
      })
    );
    return;
  }

  // ── Navigation requests (HTML pages): cache-first, offline fallback ─
  //   Only navigation requests get the offline fallback page.
  //   Serving HTML for a JS/WASM request confuses the browser and breaks
  //   script loading error handling (script.onerror never fires cleanly).
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        if (cached) return cached;
        return fetch(e.request).then(function (response) {
          if (!response || response.status !== 200) return response;
          var clone = response.clone();
          caches.open(CACHE_VER).then(function (cache) { cache.put(e.request, clone); });
          return response;
        });
      }).catch(function () {
        // Offline: serve cached index.html as app shell.
        return caches.match('./index.html').then(function (shell) {
          return shell || new Response(
            '<!DOCTYPE html><html><body style="background:#0c0c10;color:#e8e8f2;font-family:monospace;padding:48px;text-align:center">' +
            '<h2>Euclides \u2014 offline</h2><p>Reabra quando tiver conex\u00e3o para sincronizar.</p>' +
            '</body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
    );
    return;
  }

  // ── Static assets (JS, WASM, CSS, JSON, images): cache-first ─────────
  //   No catch handler: if fetch fails, let the browser handle it natively.
  //   This ensures script.onerror fires correctly (e.g. wasm-loader.js
  //   calls _useFallback() cleanly when wasm/math_core.js is not compiled).
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (response) {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        var clone = response.clone();
        caches.open(CACHE_VER).then(function (cache) { cache.put(e.request, clone); });
        return response;
      });
    })
  );
});
