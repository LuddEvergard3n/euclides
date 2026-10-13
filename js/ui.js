/**
 * ui.js
 * Shared semantic UI for navigation, home, catalog and screen states.
 */

var UI = (function () {
  var _topics = [];
  var LEVELS = [{ key:'EFI', label:'Fundamental I' },{ key:'EFII', label:'Fundamental II' },{ key:'EM', label:'Ensino Médio' },{ key:'ES', label:'Ensino Superior' }];
  var LEVEL_RANK = { EFI: 0, EFII: 1, EM: 2, ES: 3 };

  function _escape(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function _topic(id) {
    return _topics.find(function (item) { return item.id === id; }) || null;
  }

  function _area(topic) {
    if (topic.area) return topic.area;
    if (topic.group) return topic.group;
    var id = topic.id;
    if (/geo|angle|spatial|similar|conic|vector|cartesian/.test(id)) return 'Geometria';
    if (/prob|stat|data|distribution|inference|regression|markov/.test(id)) return 'Estatística';
    if (/calc|deriv|integr|limit|series|ode|heat|wave|fourier|laplace/.test(id)) return 'Cálculo';
    if (/function|exponential|logarithm|trig/.test(id)) return 'Funções';
    if (/logic|graph|combin|modular/.test(id)) return 'Matemática Discreta';
    return 'Álgebra';
  }

  function _topicCard(topic) {
    var accuracy = Progress.accuracy(topic.id);
    var status = Progress.mastery(topic.id);
    var favorite = Progress.isFavorite(topic.id);
    return '<article class="catalog-card" data-topic-id="' + _escape(topic.id) + '">' +
      '<div class="catalog-card-top"><span class="topic-symbol">' + _escape(topic.symbol) + '</span>' +
      '<button class="icon-btn favorite-btn' + (favorite ? ' selected' : '') + '" aria-label="' + (favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos') + '" onclick="UI.toggleFavorite(\'' + _escape(topic.id) + '\',this)">☆</button></div>' +
      '<p class="eyebrow">' + _escape(_area(topic)) + ' · ' + _escape(topic.level) + '</p>' +
      '<h3>' + _escape(topic.title) + '</h3>' +
      '<p class="card-meta">' + _escape(topic.estimatedMinutes || 20) + ' min · ' + _escape(status) + (accuracy >= 0 ? ' · ' + accuracy + '%' : '') + '</p>' +
      '<button class="card-action" onclick="Router.navigate(\'topic/' + _escape(topic.id) + '/concept\')">Abrir laboratório</button>' +
    '</article>';
  }

  function _continueCard() {
    var state = Progress.state();
    var topic = state.lastTopic ? _topic(state.lastTopic) : null;
    if (!topic) {
      return '<div class="continue-card empty"><p class="eyebrow">Primeiro percurso</p><h2>Comece por Funções</h2>' +
        '<p>Observe relações, interprete gráficos e avance para exponenciais, logaritmos e trigonometria.</p>' +
        '<button class="btn btn-primary" onclick="Router.navigate(\'topic/functions/concept\')">Iniciar percurso</button></div>';
    }
    return '<div class="continue-card"><p class="eyebrow">Continuar estudando</p><h2>' + _escape(topic.title) + '</h2>' +
      '<p>' + _escape(Progress.mastery(topic.id)) + ' · retome de onde parou.</p>' +
      '<button class="btn btn-primary" onclick="Router.navigate(\'topic/' + _escape(topic.id) + '/' + _escape(state.lastStep || 'concept') + '\')">Continuar</button></div>';
  }

  function renderHome(view) {
    var highSchool = _topics.filter(function (topic) { return topic.level === 'EM'; });
    var practiced = _topics.filter(function (topic) { return Progress.get(topic.id).practiceCount > 0; }).length;
    var mastered = _topics.filter(function (topic) { return Progress.mastery(topic.id) === 'dominado'; }).length;
    var featured = ['functions', 'analytic_geo', 'probability', 'trig'].map(_topic).filter(Boolean);

    view.innerHTML = '<div class="home-v5">' +
      '<section class="lab-hero">' +
        '<div class="hero-copy"><p class="eyebrow">Laboratório geométrico de matemática</p>' +
          '<h1>Veja a estrutura.<br><span>Resolva com sentido.</span></h1>' +
          '<p>Explore conceitos por diagramas, exemplos guiados e prática adaptativa. O Ensino Médio é o percurso principal; fundamentos e aprofundamentos continuam disponíveis.</p>' +
          '<div class="hero-actions"><button class="btn btn-primary" onclick="Router.navigate(\'catalog\')">Explorar ' + highSchool.length + ' tópicos do Ensino Médio</button>' +
          '<button class="btn" onclick="Router.navigate(\'practice\')">Prática rápida</button></div>' +
        '</div>' +
        '<div class="hero-visual" role="img" aria-label="Parábola, reta secante e pontos em um plano cartesiano">' +
          '<svg viewBox="0 0 520 340" aria-hidden="true"><defs><pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M 26 0 L 0 0 0 26" fill="none" stroke="currentColor" stroke-opacity=".14"/></pattern></defs><rect width="520" height="340" fill="url(#grid)"/><path class="axis" d="M20 270H500M90 20V320"/><path class="curve" d="M45 55 Q190 330 465 72"/><path class="secant" d="M100 247L420 108"/><circle class="point-a" cx="155" cy="222" r="6"/><circle class="point-b" cx="388" cy="122" r="6"/><text x="164" y="215">A</text><text x="397" y="115">B</text><text x="315" y="82">f(x)</text></svg>' +
          '<div class="visual-readout"><span>Δy / Δx</span><strong>taxa média</strong></div>' +
        '</div>' +
      '</section>' +
      '<section class="home-search"><label for="home-search">O que você quer compreender?</label><div class="search-field"><input id="home-search" type="search" placeholder="Ex.: função quadrática, probabilidade, vetores" onkeydown="if(event.key===\'Enter\')UI.searchFromHome()"><button onclick="UI.searchFromHome()">Buscar</button></div></section>' +
      '<section class="home-grid">' + _continueCard() +
        '<div class="progress-card"><p class="eyebrow">Seu panorama local</p><div class="progress-numbers"><strong>' + mastered + '</strong><span>dominados</span><strong>' + practiced + '</strong><span>praticados</span></div><button class="text-action" onclick="Router.navigate(\'progress\')">Ver progresso</button></div>' +
      '</section>' +
      '<section class="home-section"><div class="section-heading"><div><p class="eyebrow">Pontos de entrada</p><h2>Laboratórios em destaque</h2></div><button class="text-action" onclick="Router.navigate(\'catalog\')">Ver catálogo completo</button></div><div class="catalog-grid">' + featured.map(_topicCard).join('') + '</div></section>' +
      '<section class="path-grid">' + ['Álgebra','Geometria','Funções','Estatística','Cálculo','Matemática Discreta'].map(function (area, index) {
        return '<button class="path-card path-' + index + '" onclick="UI.openArea(\'' + area + '\')"><span class="path-number">0' + (index + 1) + '</span><strong>' + area + '</strong><span>Explorar percurso</span></button>';
      }).join('') + '</section>' +
    '</div>';
  }

  function renderCatalog(view) {
    var filters = _filtersFromUrl() || Progress.getFilters();
    view.innerHTML = '<div class="catalog-screen"><header class="page-header"><p class="eyebrow">84 tópicos, um percurso flexível</p><h1>Explorar matemática</h1><p>Encontre um conceito, filtre pelo seu momento de estudo e avance sem bloqueios.</p></header>' +
      '<section class="catalog-toolbar" aria-label="Filtros do catálogo"><div class="search-field"><input id="catalog-query" type="search" placeholder="Buscar conceito ou aplicação" value="' + _escape(filters.query || '') + '" oninput="UI.applyCatalogFilters()"></div>' +
      '<select id="catalog-level" onchange="UI.applyCatalogFilters()" aria-label="Nível"><option value="">Todos os níveis</option>' + LEVELS.map(function (level) { return '<option value="' + level.key + '">' + level.label + '</option>'; }).join('') + '</select>' +
      '<select id="catalog-area" onchange="UI.applyCatalogFilters()" aria-label="Área"><option value="">Todas as áreas</option>' + ['Álgebra','Geometria','Funções','Estatística','Cálculo','Matemática Discreta'].map(function (area) { return '<option>' + area + '</option>'; }).join('') + '</select>' +
      '<select id="catalog-duration" onchange="UI.applyCatalogFilters()" aria-label="Duração"><option value="">Qualquer duração</option><option value="20">Até 20 min</option><option value="30">Até 30 min</option></select>' +
      '<select id="catalog-status" onchange="UI.applyCatalogFilters()" aria-label="Domínio"><option value="">Qualquer domínio</option><option value="em introdução">Em introdução</option><option value="em prática">Em prática</option><option value="consolidando">Consolidando</option><option value="dominado">Dominado</option></select>' +
      '<button class="btn" onclick="UI.clearCatalogFilters()">Limpar</button></section>' +
      '<div id="catalog-summary" class="catalog-summary" aria-live="polite"></div><section id="catalog-results" class="catalog-grid"></section></div>';
    document.getElementById('catalog-level').value = filters.level || '';
    document.getElementById('catalog-area').value = filters.area || '';
    document.getElementById('catalog-duration').value = filters.duration || '';
    document.getElementById('catalog-status').value = filters.status || '';
    applyCatalogFilters();
  }

  function _filtersFromUrl() {
    var raw = String(window.location.hash || '').split('?')[1];
    if (!raw) return null;
    var params = new URLSearchParams(raw);
    return { query: params.get('query') || '', level: params.get('level') || '', area: params.get('area') || '', duration: params.get('duration') || '', status: params.get('status') || '' };
  }

  function _shareFilters(filters) {
    var params = new URLSearchParams();
    Object.keys(filters).forEach(function (key) { if (filters[key]) params.set(key, filters[key]); });
    var hash = '#catalog' + (params.toString() ? '?' + params.toString() : '');
    if (history.replaceState && window.location.hash !== hash) history.replaceState(null, '', hash);
  }

  function applyCatalogFilters() {
    var queryEl = document.getElementById('catalog-query');
    var levelEl = document.getElementById('catalog-level');
    var areaEl = document.getElementById('catalog-area');
    var durationEl = document.getElementById('catalog-duration');
    var statusEl = document.getElementById('catalog-status');
    if (!queryEl || !levelEl || !areaEl || !durationEl || !statusEl) return;
    var filters = { query: queryEl.value.trim(), level: levelEl.value, area: areaEl.value, duration: durationEl.value, status: statusEl.value };
    var needle = filters.query.toLowerCase();
    var matches = _topics.filter(function (topic) {
      var haystack = [topic.title, topic.id, _area(topic)].concat(topic.tags || []).join(' ').toLowerCase();
      return (!needle || haystack.indexOf(needle) !== -1) && (!filters.level || topic.level === filters.level) && (!filters.area || _area(topic) === filters.area) && (!filters.duration || Number(topic.estimatedMinutes || 0) <= Number(filters.duration)) && (!filters.status || Progress.mastery(topic.id) === filters.status);
    }).sort(function (a, b) {
      return (LEVEL_RANK[a.level] === undefined ? 99 : LEVEL_RANK[a.level]) - (LEVEL_RANK[b.level] === undefined ? 99 : LEVEL_RANK[b.level]);
    });
    Progress.setFilters(filters);
    _shareFilters(filters);
    var results = document.getElementById('catalog-results');
    var summary = document.getElementById('catalog-summary');
    summary.textContent = matches.length + (matches.length === 1 ? ' tópico encontrado' : ' tópicos encontrados');
    results.innerHTML = matches.length ? matches.map(_topicCard).join('') : '<div class="empty-state"><h2>Nenhum tópico encontrado</h2><p>Remova um filtro ou procure por um conceito mais amplo.</p><button class="btn" onclick="UI.clearCatalogFilters()">Limpar filtros</button></div>';
  }

  function renderProgressBar() {
    var wrap = document.getElementById('progress-bar-wrap');
    if (!wrap) return;
    var total = _topics.filter(function (topic) { return topic.status === 'available'; }).length;
    var practiced = _topics.filter(function (topic) { return topic.status === 'available' && Progress.get(topic.id).practiceCount > 0; }).length;
    var percent = total ? Math.round(practiced / total * 100) : 0;
    wrap.innerHTML = '<div class="prog-bar-row"><span class="prog-label">Progresso</span><span class="prog-value">' + practiced + '/' + total + '</span></div><div class="prog-bar-track"><div class="prog-bar-fill" style="width:' + percent + '%"></div></div>';
  }

  function renderSidebar(activeId) {
    var nav = document.getElementById('topic-nav');
    if (!nav) return;
    renderProgressBar();
    var html = '<button class="nav-catalog" onclick="Router.navigate(\'catalog\')">Buscar e filtrar tópicos</button>';
    LEVELS.forEach(function (level) {
      var topics = _topics.filter(function (topic) { return topic.level === level.key; });
      if (!topics.length) return;
      html += '<div class="nav-section-label">' + level.label + '</div>';
      topics.forEach(function (topic) {
        var classes = 'nav-item' + (topic.id === activeId ? ' active' : '');
        html += '<button class="' + classes + '" onclick="Router.navigate(\'topic/' + _escape(topic.id) + '/concept\')"><span class="nav-symbol">' + _escape(topic.symbol) + '</span><span>' + _escape(topic.title) + '</span><span class="nav-badge">' + _escape(Progress.mastery(topic.id).replace('em ', '')) + '</span></button>';
      });
    });
    nav.innerHTML = html;
  }

  function renderPhaseBar(topicId, activePhase) {
    var phases = [{id:'concept',label:'Conceito'},{id:'example',label:'Exemplo'},{id:'practice',label:'Prática'}];
    var progress = Progress.get(topicId);
    return '<nav class="phase-bar" aria-label="Etapas da aula">' + phases.map(function (phase) {
      var classes = 'phase-step' + (phase.id === activePhase ? ' active' : '') + ((phase.id === 'example' && progress.conceptDone) || (phase.id === 'practice' && progress.exampleDone) ? ' done' : '');
      return '<button class="' + classes + '"' + (phase.id === activePhase ? ' aria-current="step"' : '') + ' onclick="Router.navigate(\'topic/' + _escape(topicId) + '/' + phase.id + '\')">' + phase.label + '</button>';
    }).join('') + '</nav>';
  }

  function decorateTopic(topicId, phase) {
    var topic = _topic(topicId);
    var content = document.querySelector('.topic-content');
    if (!topic || !content || content.querySelector('.topic-contract')) return;
    var title = content.querySelector('.topic-title') || content.querySelector('h1');
    var prerequisites = (topic.prerequisites || []).map(function (id) {
      var item = _topic(id);
      return item ? '<button onclick="Router.navigate(\'topic/' + _escape(id) + '/concept\')">' + _escape(item.title) + '</button>' : '';
    }).join('');
    var references = (topic.references || []).map(function (reference) {
      return '<li><a href="' + _escape(reference.url) + '" target="_blank" rel="noopener">' + _escape(reference.title) + '</a> <span>' + _escape(reference.type || '') + '</span></li>';
    }).join('');
    var block = document.createElement('section');
    block.className = 'topic-contract';
    block.setAttribute('aria-label', 'Informações pedagógicas');
    block.innerHTML = '<div class="topic-contract-summary"><span>' + _escape(topic.level) + '</span><span>' + _escape(topic.estimatedMinutes || 20) + ' min</span><span>' + _escape(Progress.mastery(topicId)) + '</span><span>Revisão ' + _escape(topic.lastReviewed || 'pendente') + '</span></div>' +
      '<p><strong>Objetivo:</strong> ' + _escape((topic.learningObjectives || [])[0] || 'Compreender e aplicar o conceito.') + '</p>' +
      (prerequisites ? '<div class="topic-prerequisites"><strong>Pré-requisitos recomendados:</strong> ' + prerequisites + '</div>' : '') +
      (phase === 'concept' && references ? '<details><summary>Referências e situação editorial</summary><p>Status: ' + _escape(topic.reviewStatus || 'em-revisao') + '.</p><ul>' + references + '</ul></details>' : '');
    if (title && title.nextSibling) content.insertBefore(block, title.nextSibling);
    else content.insertBefore(block, content.firstChild);
  }

  function renderBreadcrumb(parts) {
    return '<nav class="breadcrumb" aria-label="Navegação estrutural">' + parts.map(function (part, index) {
      var sep = index ? '<span class="sep" aria-hidden="true">/</span>' : '';
      return sep + (part.href ? '<button onclick="Router.navigate(\'' + _escape(part.href) + '\')">' + _escape(part.label) + '</button>' : '<span class="current">' + _escape(part.label) + '</span>');
    }).join('') + '</nav>';
  }

  function setActiveRoute(path) {
    var root = (path || 'home').split('/')[0];
    if (root === 'topic' || root === 'catalog') root = 'catalog';
    if (root === 'review') root = 'practice';
    if (root === 'stats') root = 'progress';
    document.querySelectorAll('[data-route]').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-route') === root);
    });
  }

  function showLoading(message) {
    var view = document.getElementById('view');
    if (view) view.innerHTML = '<div class="loading-state" role="status"><div class="loading-geometry" aria-hidden="true"></div><p>' + _escape(message || 'Carregando…') + '</p></div>';
  }

  function showError(message, retry) {
    var view = document.getElementById('view');
    if (!view) return;
    window.__euclidesRetry = retry || null;
    view.innerHTML = '<div class="empty-state error-state" role="alert"><p class="eyebrow">Não foi possível abrir esta área</p><h2>' + _escape(message) + '</h2><div class="btn-row">' + (retry ? '<button class="btn btn-primary" onclick="window.__euclidesRetry()">Tentar novamente</button>' : '') + '<button class="btn" onclick="Router.navigate(\'\')">Voltar ao início</button></div></div>';
  }

  return {
    setTopics: function (topics) { _topics = topics || []; },
    renderHome: renderHome,
    renderCatalog: renderCatalog,
    applyCatalogFilters: applyCatalogFilters,
    clearCatalogFilters: function () { Progress.setFilters({}); renderCatalog(document.getElementById('view')); },
    searchFromHome: function () { var input = document.getElementById('home-search'); Progress.setFilters({ query: input ? input.value.trim() : '' }); Router.navigate('catalog'); },
    openArea: function (area) { Progress.setFilters({ area: area }); Router.navigate('catalog'); },
    toggleFavorite: function (id, button) { var selected = Progress.toggleFavorite(id); if (button) { button.classList.toggle('selected', selected); button.setAttribute('aria-label', selected ? 'Remover dos favoritos' : 'Adicionar aos favoritos'); } },
    renderProgressBar: renderProgressBar,
    renderSidebar: renderSidebar,
    renderPhaseBar: renderPhaseBar,
    decorateTopic: decorateTopic,
    renderBreadcrumb: renderBreadcrumb,
    setActiveRoute: setActiveRoute,
    showLoading: showLoading,
    showError: showError,
  };
})();
