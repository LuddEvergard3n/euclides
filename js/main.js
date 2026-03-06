/**
 * main.js
 * Single responsibility: boot sequence. Initializes systems in dependency
 * order and navigates to the home screen.
 * No math logic. No rendering. No DOM building beyond calling subsystems.
 */

(function () {

  // ── Boot sequence ─────────────────────────────────────────────────

  function boot() {
    // 1. Restore student progress from localStorage
    Progress.init();

    // 2. Load topic list and configure UI
    _loadTopics(function (topics) {
      UI.setTopics(topics);
      Review.setTopics(topics);
      Completion.setTopics(topics);
      Exam.setTopics(topics);
      Teacher.setTopics(topics);
      Stats.setTopics(topics);
      UI.renderSidebar(null);

      // 3. Load WASM (or fall back to pure JS) — non-blocking
      MathCore.load().then(function () {
        console.log('[Euclides] MathCore ready. WASM:', MathCore.usingWasm());
      });

      // 4. Init animations and completion overlay
      Anim.init();
      Completion.init();

      // 5. Register service worker (PWA offline support)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function (err) {
          console.warn('[Euclides] SW registration failed:', err);
        });
      }

      // 6. Navigate to home
      Router.navigate('');
    });
  }

  function _loadTopics(cb) {
    // topics.json is small — fetch synchronously via XHR to keep boot simple
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/topics.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          cb(JSON.parse(xhr.responseText));
          return;
        } catch (_) {}
      }
      // Fallback: hardcoded list if fetch fails (e.g. opened as file://)
      cb(_defaultTopics());
    };
    xhr.onerror = function () { cb(_defaultTopics()); };
    xhr.send();
  }

  function _defaultTopics() {
    return [
      { id: 'arithmetic',  title: 'Aritmética',           symbol: '±',  status: 'coming-soon' },
      { id: 'equations1',  title: 'Equações de 1º Grau',  symbol: 'x',  status: 'available'   },
      { id: 'equations2',  title: 'Equações de 2º Grau',  symbol: 'x²', status: 'available'   },
      { id: 'cartesian',   title: 'Plano Cartesiano',      symbol: '↗',  status: 'coming-soon' },
      { id: 'geometry',    title: 'Geometria',             symbol: '△',  status: 'coming-soon' },
      { id: 'trig',        title: 'Trigonometria',         symbol: 'θ',  status: 'coming-soon' },
    ];
  }

  // ── Start on DOMContentLoaded ─────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
