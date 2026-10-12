/**
 * router.js
 * Hash router, lazy topic loader and screen lifecycle coordinator.
 */

var Router = (function () {
  var _modules = {};
  var _loading = {};
  var _topicIds = {};
  var _current = '';
  var _activeScreen = null;
  var _started = false;

  function register(topicId, moduleObj) {
    _modules[topicId] = moduleObj;
  }

  function setTopics(topics) {
    _topicIds = {};
    (topics || []).forEach(function (topic) { _topicIds[topic.id] = true; });
  }

  function _normalise(path) {
    path = String(path || '').replace(/^#/, '').replace(/^\//, '');
    return path === 'home' ? '' : path;
  }

  function _hashFor(path) {
    return '#' + (path || 'home');
  }

  function _destroyCurrent() {
    if (_activeScreen && typeof _activeScreen.destroy === 'function') {
      try { _activeScreen.destroy(); } catch (error) { console.warn('[Euclides] screen cleanup failed:', error); }
    }
    _activeScreen = null;
    Progress.unmuteEvents();
  }

  function navigate(path, replace) {
    path = _normalise(path);
    var hash = _hashFor(path);
    if (window.location && window.location.hash !== hash) {
      if (replace && window.history && history.replaceState) history.replaceState(null, '', hash);
      else window.location.hash = hash;
      return;
    }
    _go(path);
  }

  function _go(path) {
    path = _normalise(path);
    _destroyCurrent();
    _current = path;
    Sidebar.close();
    _render(path);
    if (typeof UI.setActiveRoute === 'function') UI.setActiveRoute(path);
  }

  function _loadTopic(topicId, done, fail) {
    if (_modules[topicId]) { done(_modules[topicId]); return; }
    if (!_topicIds[topicId]) { fail(new Error('Tópico desconhecido.')); return; }

    if (_loading[topicId]) {
      _loading[topicId].then(done, fail);
      return;
    }

    _loading[topicId] = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'modules/' + topicId + '.js?v=5.0';
      script.async = true;
      script.onload = function () {
        if (_modules[topicId]) resolve(_modules[topicId]);
        else reject(new Error('O módulo não se registrou corretamente.'));
      };
      script.onerror = function () { reject(new Error('Não foi possível carregar o módulo.')); };
      document.head.appendChild(script);
    });
    _loading[topicId].then(done, fail);
  }

  function _render(path) {
    var view = document.getElementById('view');
    if (!view) return;

    if (!path) {
      UI.renderHome(view);
      UI.renderSidebar(null);
      return;
    }
    if (path === 'catalog') {
      UI.renderCatalog(view);
      UI.renderSidebar(null);
      return;
    }
    if (path === 'teacher') { _activeScreen = Teacher; Teacher.render(view); UI.renderSidebar(null); return; }
    if (path === 'review' || path === 'practice') { _activeScreen = Review; Review.render(view); UI.renderSidebar(null); return; }
    if (path === 'stats' || path === 'progress') { _activeScreen = Stats; Stats.render(view); UI.renderSidebar(null); return; }
    if (path === 'exam') { _activeScreen = Exam; Exam.render(view); UI.renderSidebar(null); return; }
    if (path === 'reference') { window.location.href = 'formulas.html'; return; }

    var parts = path.split('/');
    if (parts[0] === 'topic' && parts.length >= 2) {
      var topicId = parts[1];
      var phase = parts[2] || 'concept';
      UI.renderSidebar(topicId);
      UI.showLoading('Preparando laboratório…');
      _loadTopic(topicId, function (moduleObj) {
        if (_current !== path) return;
        _activeScreen = moduleObj;
        Progress.rememberTopic(topicId, phase);
        if (phase === 'concept' && moduleObj.renderConcept) moduleObj.renderConcept(view);
        else if (phase === 'example' && moduleObj.renderExample) moduleObj.renderExample(view);
        else if (phase === 'practice' && moduleObj.renderPractice) moduleObj.renderPractice(view);
        else UI.showError('Etapa não encontrada para este tópico.');
      }, function (error) {
        if (_current === path) UI.showError(error.message, function () { navigate(path, true); });
      });
      return;
    }

    UI.showError('Página não encontrada: ' + path);
  }

  function start() {
    if (_started) return;
    _started = true;
    window.addEventListener('hashchange', function () { _go(_normalise(window.location.hash)); });
    _go(_normalise(window.location.hash));
  }

  return {
    register: register,
    setTopics: setTopics,
    navigate: navigate,
    start: start,
    current: function () { return _current; },
    isLoaded: function (topicId) { return !!_modules[topicId]; },
  };
})();
