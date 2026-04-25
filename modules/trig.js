/**
 * modules/trig.js
 * Single responsibility: teach trigonometry (notable values, sin/cos/tan, unit circle).
 */
(function () {
  var TOPIC_ID = 'trig';
  var _rafId = null;
  function _stopRaf() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; } }
  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 380; c.height = h || 380;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }
  var _practice = { exercise: null, difficulty: 1, history: [], hintsEnabled: false, hintIndex: 0, solved: false };

  // ── Unit circle drawing ───────────────────────────────────────────
  function _drawUnitCircle(highlightAngleDeg) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.36;

    // Grid
    ctx.strokeStyle = '#1a1a28'; ctx.lineWidth = 0.5;
    for (var i = -3; i <= 3; i++) {
      var px = cx + i * r / 2, py = cy + i * r / 2;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#3e3e58'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - r * 1.3, cy); ctx.lineTo(cx + r * 1.3, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.3); ctx.lineTo(cx, cy + r * 1.3); ctx.stroke();

    // Unit circle
    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    // Notable angles
    var angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
    angles.forEach(function(deg) {
      var rad = deg * Math.PI / 180;
      var px  = cx + Math.cos(rad) * r, py = cy - Math.sin(rad) * r;
      ctx.fillStyle = deg === highlightAngleDeg ? '#c8a44a' : '#2e2e4a';
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      if (deg % 90 === 0 || deg === 30 || deg === 45 || deg === 60) {
        ctx.fillStyle = '#3e3e58'; ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        var lx = cx + Math.cos(rad) * (r + 18), ly = cy - Math.sin(rad) * (r + 18);
        ctx.fillText(deg + '°', lx, ly + 4);
      }
    });

    // Highlighted angle
    if (highlightAngleDeg !== undefined && highlightAngleDeg !== null) {
      var rad = highlightAngleDeg * Math.PI / 180;
      var px  = cx + Math.cos(rad) * r, py = cy - Math.sin(rad) * r;

      // Radius line
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

      // Point on circle
      ctx.fillStyle = '#c8a44a'; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

      // sin line (vertical)
      ctx.strokeStyle = '#4ab8b2'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();

      // cos line (horizontal)
      ctx.strokeStyle = '#5a8fd2'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
      ctx.setLineDash([]);

      // Labels
      var sinVal = Math.sin(rad), cosVal = Math.cos(rad);
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = '#4ab8b2'; ctx.textAlign = px > cx ? 'left' : 'right';
      ctx.fillText('sin=' + sinVal.toFixed(2), px + (px > cx ? 4 : -4), (cy + py) / 2);
      ctx.fillStyle = '#5a8fd2'; ctx.textAlign = 'center';
      ctx.fillText('cos=' + cosVal.toFixed(2), (cx + px) / 2, cy + 14);

      // Angle arc
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 1.5; ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, -rad, rad > 0); ctx.stroke();
      ctx.fillStyle = '#c8a44a'; ctx.textAlign = 'center';
      ctx.fillText(highlightAngleDeg + '°', cx + r * 0.28, cy - 4);
    }

    // Origin dot
    ctx.fillStyle = '#5a8fd2'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

    // Axis labels
    ctx.fillStyle = '#72728c'; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText('1', cx + r + 10, cy + 14);
    ctx.fillText('-1', cx - r - 14, cy + 14);
    ctx.fillText('1', cx + 10, cy - r);
  }

  // ── Notable values table ──────────────────────────────────────────
  function _drawNotableTable() {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var rows = [
      ['θ',   'sin(θ)',  'cos(θ)',  'tan(θ)'],
      ['0°',  '0',       '1',       '0'],
      ['30°', '1/2',     '√3/2',    '√3/3'],
      ['45°', '√2/2',    '√2/2',    '1'],
      ['60°', '√3/2',    '1/2',     '√3'],
      ['90°', '1',       '0',       'indef.'],
    ];
    var colW = W / 4, rowH = 38, startY = (H - rows.length * rowH) / 2;
    rows.forEach(function(row, ri) {
      row.forEach(function(cell, ci) {
        var x = ci * colW + colW / 2, y = startY + ri * rowH;
        if (ri === 0) {
          ctx.fillStyle = '#c8a44a'; ctx.font = 'bold 12px JetBrains Mono, monospace';
        } else {
          ctx.fillStyle = ci === 0 ? '#72728c' : '#e8e8f2';
          ctx.font = '12px JetBrains Mono, monospace';
        }
        ctx.textAlign = 'center'; ctx.fillText(cell, x, y + rowH * 0.6);
      });
      // Row separator
      if (ri < rows.length - 1) {
        ctx.strokeStyle = '#1a1a28'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, startY + (ri+1) * rowH); ctx.lineTo(W, startY + (ri+1) * rowH); ctx.stroke();
      }
    });
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Trigonometria' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Trigonometria</h1>' +
          '<p class="topic-meta">seno · cosseno · tangente · valores notáveis</p>' +
          '<div class="content-block">' +
            '<p>Trigonometria relaciona ângulos com razões entre lados de triângulos. No círculo unitário (raio = 1), essas razões se tornam coordenadas.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Definições no triângulo retângulo</div>' +
              'sin(θ) = oposto / hipotenusa<br>' +
              'cos(θ) = adjacente / hipotenusa<br>' +
              'tan(θ) = oposto / adjacente = sin(θ) / cos(θ)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Identidade fundamental</div>' +
              'sin²(θ) + cos²(θ) = 1' +
            '</div>' +
            '<p>No círculo unitário, um ponto no ângulo θ tem coordenadas (cos θ, sin θ). Os valores notáveis (0°, 30°, 45°, 60°, 90°) devem ser memorizados.</p>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn" onclick="Trig.showTable()">Tabela de valores</button>' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/trig/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">círculo unitário  ·  θ = 45°</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 380);
    _drawUnitCircle(45);
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────
  var _example = {
    steps: [
      { equation: 'calcular sin(60°), cos(60°), tan(60°)',  note: 'problema'                    },
      { equation: 'sin(60°) = √3/2 ≈ 0,866',               note: 'valor notável — memorize'    },
      { equation: 'cos(60°) = 1/2 = 0,5',                  note: 'valor notável'               },
      { equation: 'tan(60°) = sin/cos = (√3/2) / (1/2)',   note: 'tangente como razão'         },
      { equation: 'tan(60°) = √3 ≈ 1,732',                 note: 'resultado'                   },
      { equation: 'verificar: sin² + cos² = 1',            note: 'identidade fundamental'       },
      { equation: '(√3/2)² + (1/2)² = 3/4 + 1/4 = 1 ✓',  note: 'confirmado'                  },
    ],
    current: 0,
  };

  function renderExample(view) {
    _example.current = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Trigonometria', href: 'topic/trig/concept' }, { label: 'Exemplo' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">sin, cos, tan de 60°  ·  passo a passo</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _example.steps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">' + _buildStepDesc(0) + '</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Trig.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Trig.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">θ = 60°</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);
    _drawUnitCircle(60);
    Renderer.drawEquationSteps(_example.steps, 0);
  }

  function _buildStepDesc(idx) {
    var s = _example.steps[idx], prev = idx > 0 ? _example.steps[idx-1] : null;
    if (!prev) return 'Objetivo: <span class="text-mono text-gold">' + s.equation + '</span>';
    return '<strong>' + s.note + '</strong><br><span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _updateExampleUI() {
    var idx = _example.current, n = _example.steps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo ' + (idx+1) + ' de ' + n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(idx / (n-1) * 100) + '%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_buildStepDesc(idx);
    var prev = document.getElementById('btn-prev'), next = document.getElementById('btn-next');
    if (prev) prev.disabled = idx === 0;
    if (next) {
      if (idx === n - 1) { next.textContent = 'Praticar →'; next.onclick = function() { Progress.markExample(TOPIC_ID); Router.navigate('topic/trig/practice'); }; }
      else { next.textContent = 'Próximo →'; next.onclick = function() { Trig.nextStep(); }; }
    }
    Renderer.drawEquationSteps(_example.steps, idx);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────
  function renderPractice(view) {
    _practice.exercise = null; _practice.hintsEnabled = false; _practice.hintIndex = 0; _practice.solved = false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Trigonometria', href: 'topic/trig/concept' }, { label: 'Prática' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Trig.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">círculo unitário</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 380);
    _loadNext();
  }

  function _loadNext() {
    var custom = Teacher.getCustomExercises(TOPIC_ID);
    _practice.exercise = (custom.length > 0 && Math.random() < 0.3)
      ? custom[Math.floor(Math.random() * custom.length)]
      : MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    _practice.hintIndex = 0; _practice.solved = false;
    _renderCard();
    var ex = _practice.exercise;
    if (ex && ex.angle !== undefined) _drawUnitCircle(ex.angle);
    else _drawUnitCircle(null);
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
          '<input class="answer-input" id="answer-input" type="text" placeholder="ex: 1/2 ou √3/2" autocomplete="off" /></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Use a forma exata: 0, 1/2, √2/2, √3/2, 1, √3, √3/3, indef.</p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Trig.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Trig.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Trig.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var input = document.getElementById('answer-input');
    if (input) { input.addEventListener('keydown', function(e) { if (e.key === 'Enter') Trig.checkAnswer(); }); input.focus(); }
    _updateHintButton();
  }

  function _updateHintButton() {
    var btn = document.getElementById('btn-hint');
    if (btn) btn.style.display = _practice.hintsEnabled && !_practice.solved ? '' : 'none';
  }

  var _public = {
    showTable: function() {
      var panel = document.getElementById('canvas-panel');
      if (!panel) return;
      _makeCanvas(panel, 380, 280);
      _drawNotableTable();
    },
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
      var student = input.value.trim().toLowerCase().replace(',', '.');
      var correct = MathCore.validate(TOPIC_ID, student, _practice.exercise.answer);
      input.classList.toggle('correct', correct); input.classList.toggle('wrong', !correct);
      if (correct) {
        fb.className = 'feedback-line correct'; fb.textContent = '✓ Correto! = ' + _practice.exercise.answer;
        _practice.solved = true; _practice.history.push(true); Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled = true;
        var btnNext = document.getElementById('btn-next-ex'); if (btnNext) btnNext.style.display = '';
        _updateHintButton();
      } else {
        fb.className = 'feedback-line wrong'; fb.textContent = '✗ Use a forma exata (ex: √3/2, 1/2).';
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
  window.Trig = _public;

})();
