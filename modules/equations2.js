/**
 * modules/equations2.js
 * Single responsibility: teach 2nd degree equations and Bhaskara formula.
 * Renders concept, example, and practice phases.
 * Delegates math to MathCore. Delegates drawing to Renderer.
 */

(function () {

  var TOPIC_ID = 'equations2';

  var _rafId = null;
  function _stopRaf() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; } }

  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id = 'main-canvas';
    c.width = w || 380; c.height = h || 340;
    panel.innerHTML = '';
    panel.appendChild(c);
    Renderer.init(c);
    return c;
  }

  // ── Practice state ────────────────────────────────────────────────
  var _practice = {
    exercise:     null,
    difficulty:   1,
    history:      [],
    hintsEnabled: false,
    hintIndex:    0,
    solved:       false,
  };

  // ═══════════════════════════════════════════════════════════════════
  //  CONCEPT
  // ═══════════════════════════════════════════════════════════════════

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);

    view.innerHTML =
      '<div class="topic-screen">' +

        '<div class="topic-content">' +
          UI.renderBreadcrumb([
            { label: 'Início', href: '' },
            { label: 'Equações de 2º Grau' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +

          '<h1 class="topic-title">Equações de 2º Grau</h1>' +
          '<p class="topic-meta">ax² + bx + c = 0  ·  Bhaskara  ·  discriminante Δ</p>' +

          '<div class="content-block">' +
            '<p>Uma equação de 2º grau tem a incógnita elevada ao quadrado como maior potência. Pode ter duas raízes reais, uma raiz dupla, ou nenhuma raiz real — dependendo do discriminante.</p>' +

            '<div class="concept-highlight">' +
              '<div class="hl-label">Forma geral</div>' +
              'ax² + bx + c = 0&nbsp;&nbsp;(a ≠ 0)' +
            '</div>' +

            '<p>O <strong>discriminante Δ</strong> determina a natureza das raízes antes de calculá-las:</p>' +

            '<div class="concept-highlight">' +
              '<div class="hl-label">Discriminante</div>' +
              'Δ = b² − 4ac<br><br>' +
              'Δ > 0 → duas raízes reais distintas<br>' +
              'Δ = 0 → uma raiz real (raiz dupla)<br>' +
              'Δ &lt; 0 → nenhuma raiz real' +
            '</div>' +

            '<p>Quando Δ ≥ 0, as raízes são calculadas pela <strong>fórmula de Bhaskara</strong>:</p>' +

            '<div class="concept-highlight">' +
              '<div class="hl-label">Bhaskara</div>' +
              'x = (−b ± √Δ) / 2a' +
            '</div>' +

            '<p>No plano cartesiano, f(x) = ax² + bx + c é uma parábola. As raízes são os pontos onde a parábola cruza o eixo x.</p>' +
          '</div>' +

          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/equations2/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">f(x) = x² − x − 6</p>' +
        '</div>' +

      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);

    // Illustrate f(x) = x² - x - 6, roots at x = 3 and x = -2
    Renderer.clear();
    Renderer.drawAxes(true, true);
    Renderer.drawXRegion(-2.5, 3.5, 'rgba(200,164,74,0.05)');
    Renderer.plotFunction(function (x) { return x * x - x - 6; }, '#c8a44a', 2);
    Renderer.drawRootsOnAxis([3, -2], '#4ab8b2');
  }

  // ═══════════════════════════════════════════════════════════════════
  //  EXAMPLE
  // ═══════════════════════════════════════════════════════════════════

  var _example = {
    steps: [
      { equation: 'x² − x − 6 = 0',                    note: 'equação original'             },
      { equation: 'a = 1,  b = −1,  c = −6',            note: 'identificar coeficientes'     },
      { equation: 'Δ = (−1)² − 4 · 1 · (−6)',           note: 'calcular discriminante'       },
      { equation: 'Δ = 1 + 24 = 25',                    note: 'Δ > 0: duas raízes reais'     },
      { equation: 'x = (−(−1) ± √25) / (2 · 1)',        note: 'aplicar Bhaskara'             },
      { equation: 'x = (1 ± 5) / 2',                    note: 'simplificar'                  },
      { equation: 'x₁ = 3     x₂ = −2',                 note: 'raízes da equação'            },
    ],
    current: 0,
  };

  function renderExample(view) {
    _example.current = 0;

    view.innerHTML =
      '<div class="topic-screen">' +

        '<div class="topic-content">' +
          UI.renderBreadcrumb([
            { label: 'Início', href: '' },
            { label: 'Eq. 2º Grau', href: 'topic/equations2/concept' },
            { label: 'Exemplo' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +

          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">x² − x − 6 = 0  ·  passo a passo</p>' +

          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _example.steps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +

          '<div class="step-description" id="step-desc">' +
            _buildStepDesc(0) +
          '</div>' +

          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Eq2.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Eq2.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">x² − x − 6 = 0</p>' +
        '</div>' +

      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 300);
    _drawExampleStep(0);
  }

  function _buildStepDesc(idx) {
    var s    = _example.steps[idx];
    var prev = idx > 0 ? _example.steps[idx - 1] : null;
    if (!prev) return 'Partimos da equação original: <span class="text-mono text-gold">' + s.equation + '</span>';
    return '<strong>' + s.note + '</strong><br>De <span class="text-mono">' + prev.equation +
           '</span> chegamos a <span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _drawExampleStep(idx) {
    Renderer.drawEquationSteps(_example.steps, idx);
    // After revealing roots, show parabola on step 5+
    if (idx >= 5 && Renderer.canvas()) {
      // Overlay tiny parabola preview not possible with current canvas (text-only)
      // This is acceptable — canvas is used for parabola in concept and practice.
    }
  }

  function _updateExampleUI() {
    var idx = _example.current;
    var n   = _example.steps.length;
    var pct = Math.round((idx / (n - 1)) * 100);

    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo ' + (idx + 1) + ' de ' + n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=pct + '%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_buildStepDesc(idx);

    var prev = document.getElementById('btn-prev');
    var next = document.getElementById('btn-next');
    if (prev) prev.disabled = idx === 0;
    if (next) {
      if (idx === n - 1) {
        next.textContent = 'Praticar →';
        next.onclick     = function () {
          Progress.markExample(TOPIC_ID);
          Router.navigate('topic/equations2/practice');
        };
      } else {
        next.textContent = 'Próximo →';
        next.onclick     = function () { Eq2.nextStep(); };
      }
    }

    _drawExampleStep(idx);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PRACTICE
  // ═══════════════════════════════════════════════════════════════════

  function renderPractice(view) {
    _practice.exercise     = null;
    _practice.hintsEnabled = false;
    _practice.hintIndex    = 0;
    _practice.solved       = false;

    view.innerHTML =
      '<div class="topic-screen">' +

        '<div class="topic-content">' +
          UI.renderBreadcrumb([
            { label: 'Início', href: '' },
            { label: 'Eq. 2º Grau', href: 'topic/equations2/concept' },
            { label: 'Prática' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +

          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Eq2.toggleHints()">' +
              'Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +

          '<div id="exercise-area">' +
            '<p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando exercício...</p>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">parábola</p>' +
        '</div>' +

      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);

    _loadNext();
  }

  function _loadNext() {
    var custom = Teacher.getCustomExercises(TOPIC_ID);
    var ex;
    if (custom.length > 0 && Math.random() < 0.3) {
      ex = custom[Math.floor(Math.random() * custom.length)];
    } else {
      ex = MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    }
    _practice.exercise  = ex;
    _practice.hintIndex = 0;
    _practice.solved    = false;
    _renderCard();
    _drawParabola(false);
  }

  function _renderCard() {
    var area = document.getElementById('exercise-area');
    if (!area) return;
    var ex  = _practice.exercise;
    var cnt = _practice.history.length + 1;

    var counter = document.getElementById('ex-counter');
    if (counter) counter.textContent = 'Exercício ' + cnt;

    // Equations 2 have two answers; label accordingly
    var answerRow =
      '<div class="answer-row">' +
        '<span class="answer-label" style="white-space:nowrap">x₁, x₂ =</span>' +
        '<input class="answer-input" id="answer-input" type="text" ' +
          'placeholder="ex: 3 ou -2" autocomplete="off" style="max-width:260px"/>' +
      '</div>';

    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">' + ex.statement + '</p>' +
        '<div class="exercise-equation">' + ex.equation + '</div>' +
        answerRow +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Eq2.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Eq2.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Eq2.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>' +
      '<p class="text-dim" style="font-size:12px;margin-top:10px;max-width:580px">' +
        'Para duas raízes, escreva como <span class="text-mono">x₁ ou x₂</span>. ' +
        'Se não houver raízes reais, escreva <span class="text-mono">sem raízes reais</span>.' +
      '</p>';

    var input = document.getElementById('answer-input');
    if (input) {
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') Eq2.checkAnswer(); });
      input.focus();
    }
    _updateHintButton();
  }

  function _drawParabola(showRoots) {
    var ex = _practice.exercise;
    if (!ex || ex.a === undefined) { Renderer.clear(); return; }

    var a = ex.a, b = ex.b, c = ex.c;
    Renderer.clear();
    Renderer.drawAxes(true, true);
    Renderer.plotFunction(function (x) { return a * x * x + b * x + c; }, '#c8a44a', 2);

    if (showRoots && ex.delta >= 0) {
      var sqrtD = Math.sqrt(ex.delta);
      var r1    = (-b + sqrtD) / (2 * a);
      var r2    = (-b - sqrtD) / (2 * a);
      if (Math.abs(r1 - r2) < 1e-9) {
        Renderer.drawRootsOnAxis([r1], '#4ab8b2');
      } else {
        Renderer.drawRootsOnAxis([r1, r2], '#4ab8b2');
      }
    }

    // Vertex
    var vx = -b / (2 * a);
    var vy = a * vx * vx + b * vx + c;
    Renderer.drawPoint(vx, vy, '#5a8fd2', 4, 'V');
  }

  function _updateHintButton() {
    var btn = document.getElementById('btn-hint');
    if (!btn) return;
    btn.style.display = _practice.hintsEnabled && !_practice.solved ? '' : 'none';
  }

  // ── Public ────────────────────────────────────────────────────────

  var _public = {

    nextStep: function () {
      if (_example.current < _example.steps.length - 1) {
        _example.current++;
        _updateExampleUI();
      }
    },

    prevStep: function () {
      if (_example.current > 0) {
        _example.current--;
        _updateExampleUI();
      }
    },

    toggleHints: function () {
      _practice.hintsEnabled = !_practice.hintsEnabled;
      var sw = document.getElementById('hint-toggle-sw');
      if (sw) sw.classList.toggle('on', _practice.hintsEnabled);
      _updateHintButton();
      if (!_practice.hintsEnabled) {
        var ha = document.getElementById('hint-area');
        if (ha) ha.innerHTML = '';
        _practice.hintIndex = 0;
      }
    },

    showNextHint: function () {
      var ex = _practice.exercise;
      if (!ex || !ex.hints || !ex.hints.length) return;
      var idx  = _practice.hintIndex;
      if (idx >= ex.hints.length) return;
      var ha   = document.getElementById('hint-area');
      if (ha && ex.hints[idx]) {
        ha.innerHTML +=
          '<div class="hint-box">' +
            '<div class="hint-label">Dica ' + (idx + 1) + '</div>' +
            ex.hints[idx] +
          '</div>';
      }
      _practice.hintIndex++;
      var btn = document.getElementById('btn-hint');
      if (btn && _practice.hintIndex >= ex.hints.length) btn.style.display = 'none';
    },

    checkAnswer: function () {
      if (_practice.solved) return;
      var input = document.getElementById('answer-input');
      var fb    = document.getElementById('feedback');
      if (!input || !fb || !_practice.exercise) return;

      var student = input.value.trim();
      var correct = MathCore.validate(TOPIC_ID, student, _practice.exercise.answer);

      input.classList.toggle('correct', correct);
      input.classList.toggle('wrong', !correct);

      if (correct) {
        fb.className   = 'feedback-line correct';
        fb.textContent = '✓ Correto! ' + _practice.exercise.answer;
        _practice.solved = true;
        _practice.history.push(true);
        Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled = true;
        var btnNext = document.getElementById('btn-next-ex');
        if (btnNext) btnNext.style.display = '';
        _updateHintButton();
        _drawParabola(true);
      } else {
        fb.className   = 'feedback-line wrong';
        fb.textContent = '✗ Não é isso. Tente novamente.';
        _practice.history.push(false);
        Progress.recordAttempt(TOPIC_ID, false);
        if (_practice.hintsEnabled && _practice.hintIndex === 0) {
          var hi = MathCore.analyzeError(TOPIC_ID, student, _practice.exercise.answer);
          if (hi > 0) _public.showNextHint();
        }
      }

      UI.renderSidebar(TOPIC_ID);
    },

    nextExercise: function () {
      _practice.hintIndex = 0;
      var ha = document.getElementById('hint-area');
      if (ha) ha.innerHTML = '';
      _loadNext();
    },
  };

  Router.register(TOPIC_ID, {
    renderConcept:  renderConcept,
    renderExample:  renderExample,
    renderPractice: renderPractice,
  });

  window.Eq2 = _public;

})();
