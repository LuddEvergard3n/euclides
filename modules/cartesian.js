/**
 * modules/cartesian.js
 * Single responsibility: teach the Cartesian plane (coordinates, slope, linear functions).
 */
(function () {
  var TOPIC_ID = 'cartesian';
  var _rafId = null;
  function _stopRaf() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; } }
  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 420; c.height = h || 380;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }
  var _practice = { exercise: null, difficulty: 1, history: [], hintsEnabled: false, hintIndex: 0, solved: false };

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Plano Cartesiano' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Plano Cartesiano</h1>' +
          '<p class="topic-meta">coordenadas · quadrantes · coeficiente angular</p>' +
          '<div class="content-block">' +
            '<p>O plano cartesiano é um sistema de dois eixos perpendiculares que permite localizar qualquer ponto no plano com um par de números (x, y).</p>' +
            '<div class="concept-highlight"><div class="hl-label">Coordenadas</div>' +
              'P(x, y): x é a posição horizontal, y é a vertical.<br>' +
              'A origem é O(0, 0), onde os eixos se cruzam.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Quadrantes</div>' +
              '1º: x > 0, y > 0 (direita e acima)<br>' +
              '2º: x < 0, y > 0 (esquerda e acima)<br>' +
              '3º: x < 0, y < 0 (esquerda e abaixo)<br>' +
              '4º: x > 0, y < 0 (direita e abaixo)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Reta e coeficiente angular</div>' +
              'f(x) = ax + b — uma reta no plano.<br>' +
              'a = coeficiente angular (inclinação): m = (y2 − y1) / (x2 − x1)<br>' +
              'b = coeficiente linear (onde a reta cruza o eixo y)' +
            '</div>' +
            '<p>Arraste o plano com o mouse e use o scroll para dar zoom.</p>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/cartesian/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">f(x) = 2x + 1  ·  arraste / scroll</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380);
    Renderer.clear(); Renderer.drawAxes(true, true);
    Renderer.plotFunction(function(x) { return 2*x + 1; }, '#c8a44a', 2);
    Renderer.drawPoint(-2, -3, '#4ab8b2', 5, 'P(-2,-3)');
    Renderer.drawPoint(1,  3,  '#4ab8b2', 5, 'P(1,3)');
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────
  var _example = {
    steps: [
      { equation: 'P1(1, 2)  P2(4, 8)',                note: 'dois pontos dados'               },
      { equation: 'm = (y2 - y1) / (x2 - x1)',         note: 'fórmula do coeficiente angular'  },
      { equation: 'm = (8 - 2) / (4 - 1)',              note: 'substituição dos valores'        },
      { equation: 'm = 6 / 3 = 2',                      note: 'coeficiente angular = 2'         },
      { equation: 'y - y1 = m(x - x1)',                 note: 'equação da reta ponto-inclinação'},
      { equation: 'y - 2 = 2(x - 1)',                   note: 'substituindo P1 e m'             },
      { equation: 'f(x) = 2x',                          note: 'equação da reta'                 },
    ],
    current: 0,
  };

  function renderExample(view) {
    _example.current = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Plano Cartesiano', href: 'topic/cartesian/concept' }, { label: 'Exemplo' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">P1(1,2) e P2(4,8)  ·  encontrar a equação da reta</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _example.steps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">' + _buildStepDesc(0) + '</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Cart.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Cart.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">P1(1,2) · P2(4,8)</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 340);
    _drawExampleCanvas(0);
  }

  function _buildStepDesc(idx) {
    var s = _example.steps[idx], prev = idx > 0 ? _example.steps[idx-1] : null;
    if (!prev) return 'Partimos de: <span class="text-mono text-gold">' + s.equation + '</span>';
    return '<strong>' + s.note + '</strong><br><span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _drawExampleCanvas(idx) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    // Always show the two points
    Renderer.drawPoint(1, 2, '#4ab8b2', 5, 'P1(1,2)');
    Renderer.drawPoint(4, 8, '#5a8fd2', 5, 'P2(4,8)');
    // Show the line from step 5 onward
    if (idx >= 5) Renderer.plotFunction(function(x) { return 2*x; }, '#c8a44a', 2);
    Renderer.drawEquationSteps(_example.steps, idx);
  }

  function _updateExampleUI() {
    var idx = _example.current, n = _example.steps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo ' + (idx+1) + ' de ' + n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(idx / (n-1) * 100) + '%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_buildStepDesc(idx);
    var prev = document.getElementById('btn-prev'), next = document.getElementById('btn-next');
    if (prev) prev.disabled = idx === 0;
    if (next) {
      if (idx === n - 1) { next.textContent = 'Praticar →'; next.onclick = function() { Progress.markExample(TOPIC_ID); Router.navigate('topic/cartesian/practice'); }; }
      else { next.textContent = 'Próximo →'; next.onclick = function() { Cart.nextStep(); }; }
    }
    Renderer.drawEquationSteps(_example.steps, idx);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────
  function renderPractice(view) {
    _practice.exercise = null; _practice.hintsEnabled = false; _practice.hintIndex = 0; _practice.solved = false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Plano Cartesiano', href: 'topic/cartesian/concept' }, { label: 'Prática' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Cart.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">plano cartesiano  ·  arraste / scroll</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380);
    _loadNext();
  }

  function _loadNext() {
    var custom = Teacher.getCustomExercises(TOPIC_ID);
    _practice.exercise = (custom.length > 0 && Math.random() < 0.3)
      ? custom[Math.floor(Math.random() * custom.length)]
      : MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    _practice.hintIndex = 0; _practice.solved = false;
    _renderCard(); _drawPracticeCanvas(false);
  }

  function _renderCard() {
    var area = document.getElementById('exercise-area'); if (!area) return;
    var ex = _practice.exercise, cnt = _practice.history.length + 1;
    var counter = document.getElementById('ex-counter'); if (counter) counter.textContent = 'Exercício ' + cnt;
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">' + ex.statement + '</p>' +
        '<div class="exercise-equation">' + ex.equation + '</div>' +
        '<div class="answer-row"><span class="answer-label">Resposta =</span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="ex: 2º ou -3" autocomplete="off" /></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Cart.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Cart.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Cart.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var input = document.getElementById('answer-input');
    if (input) { input.addEventListener('keydown', function(e) { if (e.key === 'Enter') Cart.checkAnswer(); }); input.focus(); }
    _updateHintButton();
  }

  function _drawPracticeCanvas(solved) {
    var ex = _practice.exercise; if (!ex) return;
    Renderer.clear(); Renderer.drawAxes(true, true);
    if (ex.plotX !== undefined && ex.plotY !== undefined) {
      Renderer.drawPoint(ex.plotX, ex.plotY, '#c8a44a', 6, 'P(' + ex.plotX + ',' + ex.plotY + ')');
    }
    if (solved && ex.a !== undefined) {
      Renderer.plotFunction(function(x) { return ex.a * x + (ex.b || 0); }, '#4ab8b2', 2);
    }
    if (ex.plotX2 !== undefined && solved) {
      Renderer.drawPoint(ex.plotX2, ex.plotY2, '#5a8fd2', 6, 'P2');
      // Draw line through P1 and P2
      var a = ex.a || 0, b = ex.b || 0;
      Renderer.plotFunction(function(x) { return a * x + b; }, '#c8a44a', 2);
    }
  }

  function _updateHintButton() {
    var btn = document.getElementById('btn-hint');
    if (btn) btn.style.display = _practice.hintsEnabled && !_practice.solved ? '' : 'none';
  }

  var _public = {
    nextStep: function() { if (_example.current < _example.steps.length - 1) { _example.current++; _updateExampleUI(); } },
    prevStep: function() { if (_example.current > 0) { _example.current--; _updateExampleUI(); } },
    toggleHints: function() {
      _practice.hintsEnabled = !_practice.hintsEnabled;
      var sw = document.getElementById('hint-toggle-sw'); if (sw) sw.classList.toggle('on', _practice.hintsEnabled);
      _updateHintButton();
      if (!_practice.hintsEnabled) { var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = ''; _practice.hintIndex = 0; }
    },
    showNextHint: function() {
      var ex = _practice.exercise; if (!ex || !ex.hints || _practice.hintIndex >= ex.hints.length) return;
      var ha = document.getElementById('hint-area');
      if (ha && ex.hints[_practice.hintIndex]) ha.innerHTML += '<div class="hint-box"><div class="hint-label">Dica ' + (_practice.hintIndex+1) + '</div>' + ex.hints[_practice.hintIndex] + '</div>';
      _practice.hintIndex++;
      var btn = document.getElementById('btn-hint'); if (btn && _practice.hintIndex >= ex.hints.length) btn.style.display = 'none';
    },
    checkAnswer: function() {
      if (_practice.solved) return;
      var input = document.getElementById('answer-input'), fb = document.getElementById('feedback');
      if (!input || !fb || !_practice.exercise) return;
      var student = input.value.trim(), correct = MathCore.validate(TOPIC_ID, student, _practice.exercise.answer);
      input.classList.toggle('correct', correct); input.classList.toggle('wrong', !correct);
      if (correct) {
        fb.className = 'feedback-line correct'; fb.textContent = '✓ Correto!';
        _practice.solved = true; _practice.history.push(true); Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled = true;
        var btnNext = document.getElementById('btn-next-ex'); if (btnNext) btnNext.style.display = '';
        _updateHintButton(); _drawPracticeCanvas(true);
      } else {
        fb.className = 'feedback-line wrong'; fb.textContent = '✗ Não é isso. Tente novamente.';
        _practice.history.push(false); Progress.recordAttempt(TOPIC_ID, false);
        if (_practice.hintsEnabled && _practice.hintIndex === 0) {
          var hi = MathCore.analyzeError(TOPIC_ID, student, _practice.exercise.answer); if (hi > 0) _public.showNextHint();
        }
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise: function() { _practice.hintIndex = 0; var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = ''; _loadNext(); },
  };

  Router.register(TOPIC_ID, { renderConcept: renderConcept, renderExample: renderExample, renderPractice: renderPractice });
  window.Cart = _public;

})();
