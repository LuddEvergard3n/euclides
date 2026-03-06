/**
 * router.js
 * Single responsibility: parse navigation paths and delegate rendering
 * to the correct module. No math logic. No Canvas drawing.
 *
 * Path schema:
 *   ''                    → home screen
 *   'topic/:id/concept'   → module.renderConcept()
 *   'topic/:id/example'   → module.renderExample()
 *   'topic/:id/practice'  → module.renderPractice()
 *   'teacher'             → Teacher.render()
 */

var Router = (function () {

  // Map topicId → module object (registered by each module file)
  var _modules = {};

  // Current path
  var _current = '';

  // ── Module registry ───────────────────────────────────────────────

  function register(topicId, moduleObj) {
    _modules[topicId] = moduleObj;
  }

  // ── Navigation ────────────────────────────────────────────────────

  function navigate(path) {
    _current = path || '';
    Sidebar.close();
    _render(_current);
  }

  function _render(path) {
    var view = document.getElementById('view');
    if (!view) return;

    // Home
    if (!path) {
      _renderHome(view);
      UI.renderSidebar(null);
      return;
    }

    // Teacher mode
    if (path === 'teacher') {
      Teacher.render(view);
      UI.renderSidebar(null);
      return;
    }

    // Review mode
    if (path === 'review') {
      Review.render(view);
      UI.renderSidebar(null);
      return;
    }

    // Stats
    if (path === 'stats') {
      Stats.render(view);
      UI.renderSidebar(null);
      return;
    }

    // Exam mode
    if (path === 'exam') {
      Exam.render(view);
      UI.renderSidebar(null);
      return;
    }

    // Topic paths: 'topic/:id/:phase'
    var parts = path.split('/');
    if (parts[0] === 'topic' && parts.length >= 3) {
      var topicId = parts[1];
      var phase   = parts[2]; // 'concept' | 'example' | 'practice'
      var mod     = _modules[topicId];

      UI.renderSidebar(topicId);

      if (!mod) {
        UI.showError('Módulo "' + topicId + '" não encontrado.');
        return;
      }

      if (phase === 'concept')  { mod.renderConcept(view);  return; }
      if (phase === 'example')  { mod.renderExample(view);  return; }
      if (phase === 'practice') { mod.renderPractice(view); return; }
    }

    UI.showError('Página não encontrada: ' + path);
  }

  // ── Home screen ───────────────────────────────────────────────────

  function _renderHome(view) {
    view.innerHTML =
      '<div class="home-screen">' +
        '<img src="icon.svg" class="home-icon" alt="Euclides"/>' +
        '<div class="home-title">Euclides</div>' +
        '<p class="home-subtitle">' +
          'Matemática não é um bicho de sete cabeças.<br>' +
          'Selecione um tópico na barra lateral para começar.' +
        '</p>' +
        '<p class="home-prompt text-mono text-dim">→ escolha um tópico</p>' +
      '</div>';
  }

  // ── Current path query ────────────────────────────────────────────

  function current() { return _current; }

  // ── Public API ────────────────────────────────────────────────────

  return {
    register: register,
    navigate: navigate,
    current:  current,
  };

})();
