/**
 * modules/geometry.js
 * Single responsibility: teach plane geometry (area, perimeter, Pythagorean theorem).
 */
(function () {
  var TOPIC_ID = 'geometry';
  var _rafId = null;
  function _stopRaf() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; } }
  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 380; c.height = h || 340;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }
  var _practice = { exercise: null, difficulty: 1, history: [], hintsEnabled: false, hintIndex: 0, solved: false };

  // ── Shape drawing helpers ─────────────────────────────────────────
  function _drawShape(ex) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    ctx.font = '12px JetBrains Mono, monospace';

    if (!ex || !ex.shape) return;

    var cx = W / 2, cy = H * 0.48;

    if (ex.shape === 'square') {
      var s = ex.s, px = Math.min(180, s * 14);
      var x0 = cx - px/2, y0 = cy - px/2;
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
      ctx.strokeRect(x0, y0, px, px);
      ctx.fillStyle = 'rgba(200,164,74,0.06)'; ctx.fillRect(x0, y0, px, px);
      // Label sides
      ctx.fillStyle = '#72728c'; ctx.textAlign = 'center';
      ctx.fillText('l = ' + s, cx, y0 - 10);
      ctx.fillText('l = ' + s, cx, y0 + px + 18);
      ctx.save(); ctx.translate(x0 - 14, cy); ctx.rotate(-Math.PI/2);
      ctx.fillText('l = ' + s, 0, 0); ctx.restore();
    }

    if (ex.shape === 'rectangle') {
      var w = ex.w, h = ex.h;
      var pw = Math.min(220, w * 12), ph = Math.min(160, h * 12);
      pw = Math.max(pw, 80); ph = Math.max(ph, 60);
      var x0 = cx - pw/2, y0 = cy - ph/2;
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
      ctx.strokeRect(x0, y0, pw, ph);
      ctx.fillStyle = 'rgba(200,164,74,0.06)'; ctx.fillRect(x0, y0, pw, ph);
      ctx.fillStyle = '#72728c'; ctx.textAlign = 'center';
      ctx.fillText('b = ' + w, cx, y0 - 10);
      ctx.save(); ctx.translate(x0 - 14, cy); ctx.rotate(-Math.PI/2);
      ctx.fillText('h = ' + h, 0, 0); ctx.restore();
    }

    if (ex.shape === 'triangle') {
      var a = ex.a, b = ex.b;
      var pa = Math.min(180, a * 14), pb = Math.min(140, b * 14);
      var x0 = cx - pa/2, y0 = cy - pb/2;
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0 + pb); ctx.lineTo(x0 + pa, y0 + pb); ctx.lineTo(x0, y0); ctx.closePath();
      ctx.stroke(); ctx.fillStyle = 'rgba(200,164,74,0.06)'; ctx.fill();
      // Right angle marker
      var sq = 10;
      ctx.strokeStyle = '#5a8fd2'; ctx.lineWidth = 1;
      ctx.strokeRect(x0, y0 + pb - sq, sq, sq);
      ctx.fillStyle = '#72728c'; ctx.textAlign = 'center';
      ctx.fillText('a = ' + a, cx - pa/4, y0 + pb + 18);
      ctx.save(); ctx.translate(x0 - 14, cy); ctx.rotate(-Math.PI/2);
      ctx.fillText('b = ' + b, 0, 0); ctx.restore();
    }

    if (ex.shape === 'circle') {
      var r = ex.r, pr = Math.min(120, r * 14);
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(200,164,74,0.06)'; ctx.fill();
      // Radius line
      ctx.strokeStyle = '#5a8fd2'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + pr, cy); ctx.stroke();
      ctx.fillStyle = '#72728c'; ctx.textAlign = 'left';
      ctx.fillText('r = ' + r, cx + pr/2 - 10, cy - 8);
      ctx.fillStyle = '#4ab8b2'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
    }

    // Formula label at bottom
    ctx.fillStyle = '#3e3e58'; ctx.textAlign = 'center';
    var formulaY = H * 0.88;
    if (ex.type === 'area')          ctx.fillText(ex.equation, cx, formulaY);
    else if (ex.type === 'perimeter') ctx.fillText(ex.equation, cx, formulaY);
    else if (ex.type === 'hypotenuse') ctx.fillText(ex.equation, cx, formulaY);
    else if (ex.type === 'circumference') ctx.fillText(ex.equation, cx, formulaY);
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Geometria' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Geometria Plana</h1>' +
          '<p class="topic-meta">área · perímetro · Pitágoras · círculo</p>' +
          '<div class="content-block">' +
            '<p>Geometria plana estuda figuras em duas dimensões. As duas medidas fundamentais são <strong>área</strong> (espaço interno) e <strong>perímetro</strong> (comprimento do contorno).</p>' +
            '<div class="concept-highlight"><div class="hl-label">Fórmulas essenciais</div>' +
              'Quadrado:   A = l²  |  P = 4l<br>' +
              'Retângulo:  A = b×h  |  P = 2(b+h)<br>' +
              'Triângulo:  A = (b×h)/2<br>' +
              'Círculo:    A = πr²  |  C = 2πr' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Teorema de Pitágoras</div>' +
              'Em todo triângulo retângulo:<br>' +
              'c² = a² + b²  (c = hipotenusa)' +
            '</div>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/geometry/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">retângulo 6 × 4</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);
    _drawShape({ shape: 'rectangle', w: 6, h: 4, type: 'area', equation: 'A = 6 × 4 = 24' });
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────
  var _example = {
    steps: [
      { equation: 'triângulo retângulo: a=3, b=4',   note: 'dados'                           },
      { equation: 'Área = (b × h) / 2',               note: 'fórmula da área'                 },
      { equation: 'A = (3 × 4) / 2 = 6',              note: 'área do triângulo = 6'           },
      { equation: 'c² = a² + b²',                     note: 'Teorema de Pitágoras'            },
      { equation: 'c² = 3² + 4² = 9 + 16 = 25',       note: 'substituição'                   },
      { equation: 'c = √25 = 5',                      note: 'hipotenusa = 5'                  },
    ],
    current: 0,
  };

  function renderExample(view) {
    _example.current = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Geometria', href: 'topic/geometry/concept' }, { label: 'Exemplo' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">triângulo retângulo 3-4-5  ·  área e hipotenusa</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _example.steps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">' + _buildStepDesc(0) + '</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Geo.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Geo.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">triângulo 3-4-5</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 300);
    _drawShape({ shape: 'triangle', a: 3, b: 4, type: 'hypotenuse', equation: 'a=3, b=4' });
    Renderer.drawEquationSteps(_example.steps, 0);
  }

  function _buildStepDesc(idx) {
    var s = _example.steps[idx], prev = idx > 0 ? _example.steps[idx-1] : null;
    if (!prev) return 'Dados: <span class="text-mono text-gold">' + s.equation + '</span>';
    return '<strong>' + s.note + '</strong><br><span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _updateExampleUI() {
    var idx = _example.current, n = _example.steps.length;
    document.getElementById('step-counter').textContent = 'Passo ' + (idx+1) + ' de ' + n;
    document.getElementById('step-fill').style.width    = Math.round(idx / (n-1) * 100) + '%';
    document.getElementById('step-desc').innerHTML      = _buildStepDesc(idx);
    var prev = document.getElementById('btn-prev'), next = document.getElementById('btn-next');
    if (prev) prev.disabled = idx === 0;
    if (next) {
      if (idx === n - 1) { next.textContent = 'Praticar →'; next.onclick = function() { Progress.markExample(TOPIC_ID); Router.navigate('topic/geometry/practice'); }; }
      else { next.textContent = 'Próximo →'; next.onclick = function() { Geo.nextStep(); }; }
    }
    Renderer.drawEquationSteps(_example.steps, idx);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────
  function renderPractice(view) {
    _practice.exercise = null; _practice.hintsEnabled = false; _practice.hintIndex = 0; _practice.solved = false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Geometria', href: 'topic/geometry/concept' }, { label: 'Prática' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Geo.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">figura</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);
    _loadNext();
  }

  function _loadNext() {
    var custom = Teacher.getCustomExercises(TOPIC_ID);
    _practice.exercise = (custom.length > 0 && Math.random() < 0.3)
      ? custom[Math.floor(Math.random() * custom.length)]
      : MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    _practice.hintIndex = 0; _practice.solved = false;
    _renderCard(); _drawShape(_practice.exercise);
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
          '<input class="answer-input" id="answer-input" type="text" placeholder="número" autocomplete="off" /></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Geo.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Geo.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Geo.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var input = document.getElementById('answer-input');
    if (input) { input.addEventListener('keydown', function(e) { if (e.key === 'Enter') Geo.checkAnswer(); }); input.focus(); }
    _updateHintButton();
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
        fb.className = 'feedback-line correct'; fb.textContent = '✓ Correto! = ' + _practice.exercise.answer;
        _practice.solved = true; _practice.history.push(true); Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled = true;
        var btnNext = document.getElementById('btn-next-ex'); if (btnNext) btnNext.style.display = '';
        _updateHintButton();
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
  window.Geo = _public;

})();
