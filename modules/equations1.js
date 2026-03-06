/**
 * modules/equations1.js
 * Single responsibility: teach 1st degree equations (ax + b = c).
 * Renders concept, example, and practice phases.
 * Delegates math to MathCore. Delegates drawing to Renderer. Delegates DOM to UI.
 */

(function () {

  var TOPIC_ID = 'equations1';

  // ── Shared canvas instance (created once per phase render) ────────
  var _canvas = null;
  var _rafId  = null;

  function _stopRaf() {
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  }

  // ── Practice state ────────────────────────────────────────────────
  var _practice = {
    exercise:     null,   // current exercise object from MathCore
    difficulty:   1,
    history:      [],     // boolean[] of past attempts
    hintsEnabled: false,
    hintIndex:    0,      // which hint is currently shown (0 = none)
    solved:       false,
  };

  // ── Canvas setup helper ───────────────────────────────────────────

  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id     = 'main-canvas';
    c.width  = w || 380;
    c.height = h || 340;
    panel.innerHTML = '';
    panel.appendChild(c);
    Renderer.init(c);
    return c;
  }

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
            { label: 'Equações de 1º Grau' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +

          '<h1 class="topic-title">Equações de 1º Grau</h1>' +
          '<p class="topic-meta">ax + b = c  ·  uma incógnita  ·  grau 1</p>' +

          '<div class="content-block">' +
            '<p>Uma equação de 1º grau é uma igualdade entre dois lados onde a incógnita (x) aparece com expoente 1. O objetivo é descobrir o valor de x que torna a equação verdadeira.</p>' +

            '<div class="concept-highlight">' +
              '<div class="hl-label">Forma geral</div>' +
              'ax + b = c' +
            '</div>' +

            '<p>Onde a, b e c são números reais conhecidos e a ≠ 0. Para resolver, isolamos x: passamos tudo que não é x para o outro lado da igualdade.</p>' +

            '<div class="concept-highlight">' +
              '<div class="hl-label">Solução</div>' +
              'ax + b = c<br>' +
              'ax = c − b<br>' +
              'x = (c − b) / a' +
            '</div>' +

            '<p><strong>Regra da transposição:</strong> qualquer termo que troca de lado muda de sinal. Somar vira subtrair; multiplicar vira dividir.</p>' +

            '<p>No plano cartesiano, f(x) = ax + b é uma reta. A solução da equação ax + b = c corresponde ao ponto onde essa reta intercepta y = c.</p>' +
          '</div>' +

          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/equations1/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">f(x) = 2x − 4</p>' +
        '</div>' +

      '</div>';

    // Draw the concept illustration: f(x) = 2x - 4, root at x = 2
    var panel = view.querySelector('#canvas-panel');
    _canvas   = _makeCanvas(panel, 380, 340);

    function _draw() {
      Renderer.clear();
      Renderer.drawAxes(true, true);
      Renderer.drawXRegion(-0.5, 2.5, 'rgba(200,164,74,0.05)');
      Renderer.plotFunction(function (x) { return 2 * x - 4; }, '#c8a44a', 2);
      Renderer.drawPoint(2, 0, '#4ab8b2', 5, 'x = 2');
      Renderer.drawVerticalLine(2, 'rgba(74,184,178,0.4)');
    }

    _draw();
  }

  // ═══════════════════════════════════════════════════════════════════
  //  EXAMPLE
  // ═══════════════════════════════════════════════════════════════════

  var _example = {
    steps: [
      { equation: '3x + 6 = 15',         note: 'equação original'            },
      { equation: '3x = 15 − 6',         note: 'transpõe +6 → −6'           },
      { equation: '3x = 9',              note: 'simplifica o lado direito'   },
      { equation: 'x = 9 / 3',           note: 'divide ambos os lados por 3' },
      { equation: 'x = 3',              note: 'solução'                      },
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
            { label: 'Eq. 1º Grau', href: 'topic/equations1/concept' },
            { label: 'Exemplo' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +

          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">3x + 6 = 15  ·  passo a passo</p>' +

          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _example.steps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +

          '<div class="step-description" id="step-desc">' +
            _buildStepDesc(0) +
          '</div>' +

          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Eq1.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Eq1.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">transformação passo a passo</p>' +
        '</div>' +

      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _canvas   = _makeCanvas(panel, 380, 300);
    _drawExampleStep(0);
  }

  function _buildStepDesc(idx) {
    var s    = _example.steps[idx];
    var prev = idx > 0 ? _example.steps[idx - 1] : null;
    var desc = prev
      ? '<strong>' + s.note + '</strong><br>De <span class="text-mono">' + prev.equation + '</span> para <span class="text-mono text-gold">' + s.equation + '</span>'
      : 'Partimos da equação original: <span class="text-mono text-gold">' + s.equation + '</span>';
    return desc;
  }

  function _drawExampleStep(idx) {
    Renderer.drawEquationSteps(_example.steps, idx);
  }

  function _updateExampleUI() {
    var idx  = _example.current;
    var n    = _example.steps.length;
    var pct  = Math.round(((idx) / (n - 1)) * 100);

    document.getElementById('step-counter').textContent = 'Passo ' + (idx + 1) + ' de ' + n;
    document.getElementById('step-fill').style.width    = pct + '%';
    document.getElementById('step-desc').innerHTML      = _buildStepDesc(idx);

    var btnPrev = document.getElementById('btn-prev');
    var btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.disabled = idx === 0;
    if (btnNext) {
      if (idx === n - 1) {
        btnNext.textContent = 'Praticar →';
        btnNext.onclick     = function () {
          Progress.markExample(TOPIC_ID);
          Router.navigate('topic/equations1/practice');
        };
      } else {
        btnNext.textContent = 'Próximo →';
        btnNext.onclick     = function () { Eq1.nextStep(); };
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
            { label: 'Eq. 1º Grau', href: 'topic/equations1/concept' },
            { label: 'Prática' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +

          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Eq1.toggleHints()">' +
              'Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +

          '<div id="exercise-area">' +
            '<p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando exercício...</p>' +
          '</div>' +
        '</div>' +

        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">visualização</p>' +
        '</div>' +

      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _canvas   = _makeCanvas(panel, 380, 340);

    _loadNextExercise();
  }

  function _loadNextExercise() {
    // Prefer custom exercises from Teacher, fall back to generated
    var custom = Teacher.getCustomExercises(TOPIC_ID);
    var ex;

    if (custom.length > 0 && Math.random() < 0.3) {
      // 30% chance of showing a teacher-created exercise
      ex = custom[Math.floor(Math.random() * custom.length)];
    } else {
      ex = MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    }

    _practice.exercise  = ex;
    _practice.hintIndex = 0;
    _practice.solved    = false;

    _renderExerciseCard();
    _drawPracticeCanvas();
  }

  function _renderExerciseCard() {
    var area = document.getElementById('exercise-area');
    if (!area) return;
    var ex   = _practice.exercise;
    var cnt  = _practice.history.length + 1;

    var counter = document.getElementById('ex-counter');
    if (counter) counter.textContent = 'Exercício ' + cnt;

    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">' + ex.statement + '</p>' +
        '<div class="exercise-equation">' + ex.equation + '</div>' +

        '<div class="answer-row">' +
          '<span class="answer-label">x =</span>' +
          '<input class="answer-input" id="answer-input" type="text" ' +
            'placeholder="sua resposta" autocomplete="off" />' +
        '</div>' +

        '<p class="feedback-line" id="feedback"></p>' +

        '<div id="hint-area"></div>' +

        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Eq1.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Eq1.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Eq1.nextExercise()" style="display:none">Próximo exercício →</button>' +
        '</div>' +
      '</div>';

    var input = document.getElementById('answer-input');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') Eq1.checkAnswer();
      });
      input.focus();
    }

    _updateHintButton();
  }

  function _drawPracticeCanvas() {
    var ex = _practice.exercise;
    if (!ex || !ex.equation) return;

    // Try to extract coefficients and plot f(x) = ax + b − c
    // For equations like "3x + 6 = 15" → f(x) = 3x + 6 - 15 = 3x - 9
    var parsed = _parseLinear(ex.equation);
    if (!parsed) {
      Renderer.clear();
      return;
    }

    Renderer.clear();
    Renderer.drawAxes(true, true);

    var a = parsed.a, b = parsed.b - parsed.c; // f(x) = ax + (b - c)
    Renderer.plotFunction(function (x) { return a * x + b; }, '#c8a44a', 2);

    // Draw root if answer is known
    if (_practice.solved && ex.answer) {
      var xVal = parseFloat(ex.answer);
      if (!isNaN(xVal)) {
        Renderer.drawPoint(xVal, 0, '#4ab8b2', 5, 'x = ' + xVal);
        Renderer.drawVerticalLine(xVal, 'rgba(74,184,178,0.35)');
      }
    }
  }

  // Parse "ax + b = c" into { a, b, c }. Returns null if unparseable.
  function _parseLinear(eq) {
    eq = String(eq).replace(/\s/g, '');
    var sides = eq.split('=');
    if (sides.length !== 2) return null;
    var c = parseFloat(sides[1]);
    if (isNaN(c)) return null;

    var lhs = sides[0];
    // Match patterns like: 3x+6, -x+5, 2x, x, -5x-3 etc.
    var m = lhs.match(/^([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?$/);
    if (!m) return null;

    var aStr = m[1];
    var a    = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    var b    = m[2] ? parseFloat(m[2]) : 0;
    if (isNaN(a) || isNaN(b)) return null;
    return { a: a, b: b, c: c };
  }

  function _updateHintButton() {
    var btn = document.getElementById('btn-hint');
    if (!btn) return;
    btn.style.display = _practice.hintsEnabled && !_practice.solved ? '' : 'none';
  }

  // ── Public methods (called from inline onclick) ───────────────────

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

      var hints   = ex.hints;
      var idx     = _practice.hintIndex;

      if (idx >= hints.length) return;

      var ha   = document.getElementById('hint-area');
      var text = hints[idx];
      if (ha && text) {
        ha.innerHTML +=
          '<div class="hint-box">' +
            '<div class="hint-label">Dica ' + (idx + 1) + '</div>' +
            text +
          '</div>';
      }

      _practice.hintIndex++;
      var btn = document.getElementById('btn-hint');
      if (btn && _practice.hintIndex >= hints.length) btn.style.display = 'none';
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
        fb.className      = 'feedback-line correct';
        fb.textContent    = '✓ Correto! x = ' + _practice.exercise.answer;
        _practice.solved  = true;
        _practice.history.push(true);
        Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled    = true;

        var btnNext = document.getElementById('btn-next-ex');
        if (btnNext) btnNext.style.display = '';
        _updateHintButton();
        _drawPracticeCanvas(); // show root on graph
      } else {
        fb.className   = 'feedback-line wrong';
        fb.textContent = '✗ Não é isso. Tente novamente.';
        _practice.history.push(false);
        Progress.recordAttempt(TOPIC_ID, false);

        // Auto-show error-specific hint if hints are enabled
        if (_practice.hintsEnabled && _practice.hintIndex === 0) {
          var hintIdx = MathCore.analyzeError(TOPIC_ID, student, _practice.exercise.answer);
          if (hintIdx > 0) {
            _public.showNextHint();
          }
        }
      }

      // Update accuracy badge in sidebar
      UI.renderSidebar(TOPIC_ID);
    },

    nextExercise: function () {
      _practice.hintIndex = 0;
      var ha = document.getElementById('hint-area');
      if (ha) ha.innerHTML = '';
      _loadNextExercise();
    },

  };

  // Register with router
  Router.register(TOPIC_ID, {
    renderConcept:  renderConcept,
    renderExample:  renderExample,
    renderPractice: renderPractice,
  });

  // Expose to inline onclick handlers
  window.Eq1 = _public;

})();
