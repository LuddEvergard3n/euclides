/**
 * modules/arithmetic.js
 * Single responsibility: teach the four basic operations.
 * Each operation has its own example walkthrough.
 * Practice cycles through all four explicitly.
 */
(function () {

  var TOPIC_ID = 'arithmetic';

  var _rafId = null;
  function _stopRaf() { if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; } }

  function _makeCanvas(panel, w, h) {
    _stopRaf();
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 380; c.height = h || 340;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }

  // ── Practice state ────────────────────────────────────────────────
  var _practice = {
    exercise:      null,
    difficulty:    1,
    history:       [],
    hintsEnabled:  false,
    hintIndex:     0,
    solved:        false,
    // Explicit rotation through all 4 ops at difficulty 1–2
    opQueue:       [],
    opQueueIdx:    0,
  };

  // ── Canvas: number line ───────────────────────────────────────────
  function _drawNumberLine(a, b, op) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var opChar = op === '*' ? '×' : op === '/' ? '÷' : op;
    var result = op === '+' ? a + b
               : op === '-' ? a - b
               : op === '*' ? a * b
               : (b !== 0 ? a / b : 0);
    var maxVal = Math.max(Math.abs(a), Math.abs(result), 10);
    var scale  = (W * 0.76) / (maxVal * 2);
    var ox = W / 2, oy = H * 0.5;

    // Axis
    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W * 0.07, oy); ctx.lineTo(W * 0.93, oy); ctx.stroke();

    // Ticks and labels
    var step = Math.max(1, Math.ceil(maxVal / 6));
    ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    for (var i = -maxVal; i <= maxVal; i += step) {
      var px = ox + i * scale;
      if (px < W * 0.06 || px > W * 0.94) continue;
      ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, oy - 5); ctx.lineTo(px, oy + 5); ctx.stroke();
      ctx.fillStyle = '#3e3e58'; ctx.fillText(i, px, oy + 18);
    }

    var p0 = ox;
    var pa = ox + a * scale;
    var pr = ox + result * scale;

    if (op === '+' || op === '-') {
      // Blue arc: 0 → a
      if (Math.abs(pa - p0) > 1) {
        ctx.strokeStyle = '#5a8fd2'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc((p0 + pa) / 2, oy, Math.abs(pa - p0) / 2, Math.PI, 0, pa < p0);
        ctx.stroke();
      }
      ctx.fillStyle = '#5a8fd2';
      ctx.beginPath(); ctx.arc(pa, oy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#72728c'; ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(a, pa, oy - 24);

      // Gold arc: a → result
      if (Math.abs(pr - pa) > 1) {
        ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc((pa + pr) / 2, oy, Math.abs(pr - pa) / 2, Math.PI, 0, pr < pa);
        ctx.stroke();
      }
      ctx.fillStyle = '#c8a44a';
      ctx.beginPath(); ctx.arc(pr, oy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c8a44a'; ctx.font = 'bold 13px JetBrains Mono, monospace';
      ctx.fillText(result, pr, oy - 30);

    } else {
      // For × and ÷ just mark a and result
      ctx.fillStyle = '#5a8fd2';
      ctx.beginPath(); ctx.arc(pa, oy, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c8a44a';
      ctx.beginPath(); ctx.arc(pr, oy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c8a44a'; ctx.font = 'bold 13px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(result, pr, oy - 24);
    }

    // Operation label
    ctx.fillStyle = '#3e3e58'; ctx.font = '12px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(a + ' ' + opChar + ' ' + b + ' = ' + result, W / 2, H * 0.84);
  }

  // ── Canvas: multiplication grid ───────────────────────────────────
  function _drawMultGrid(a, b) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var cellSize = Math.min(Math.floor((W - 60) / b), Math.floor((H - 80) / a), 28);
    var gw = b * cellSize, gh = a * cellSize;
    var startX = (W - gw) / 2, startY = (H - gh) / 2 - 10;

    for (var row = 0; row < a; row++) {
      for (var col = 0; col < b; col++) {
        var x = startX + col * cellSize, y = startY + row * cellSize;
        ctx.fillStyle = 'rgba(200,164,74,0.12)';
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    // Bracket labels
    ctx.fillStyle = '#5a8fd2'; ctx.font = '12px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(b + ' colunas', startX + gw / 2, startY - 10);
    ctx.save(); ctx.translate(startX - 14, startY + gh / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#4ab8b2'; ctx.fillText(a + ' linhas', 0, 0); ctx.restore();

    ctx.fillStyle = '#c8a44a'; ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.fillText(a + ' × ' + b + ' = ' + (a * b), W / 2, startY + gh + 28);
  }

  // ── Canvas: division groups ───────────────────────────────────────
  function _drawDivGroups(a, b) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var q = Math.floor(a / b);
    var dotR = Math.min(12, Math.floor(W / (b * 4 + 4)));
    var groupW = b * (dotR * 2 + 4) + 8;
    var totalW = q * groupW + (q - 1) * 10;
    var startX = (W - totalW) / 2;
    var cy = H / 2;

    for (var g = 0; g < q; g++) {
      var gx = startX + g * (groupW + 10);
      // Group border
      ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
      ctx.strokeRect(gx, cy - dotR - 14, groupW, dotR * 2 + 28);
      // Dots
      for (var d = 0; d < b; d++) {
        ctx.fillStyle = '#c8a44a';
        ctx.beginPath();
        ctx.arc(gx + 8 + d * (dotR * 2 + 4) + dotR, cy, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
      // Group label
      ctx.fillStyle = '#3e3e58'; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText('g' + (g + 1), gx + groupW / 2, cy + dotR + 18);
    }

    ctx.fillStyle = '#c8a44a'; ctx.font = 'bold 14px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(a + ' ÷ ' + b + ' = ' + q + '  (' + q + ' grupos de ' + b + ')', W / 2, H * 0.88);
  }

  // ── Operation examples (one per op) ──────────────────────────────
  var _ops = {
    '+': {
      label: 'Adição',
      steps: [
        { equation: '346 + 278 = ?',    note: 'problema'                        },
        { equation: '6 + 8 = 14',       note: 'unidades: escreve 4, carrega 1'  },
        { equation: '4 + 7 + 1 = 12',   note: 'dezenas: escreve 2, carrega 1'   },
        { equation: '3 + 2 + 1 = 6',    note: 'centenas: escreve 6'             },
        { equation: '346 + 278 = 624',  note: 'resultado'                        },
      ],
      drawCanvas: function() { _drawNumberLine(346, 278, '+'); },
    },
    '-': {
      label: 'Subtração',
      steps: [
        { equation: '503 - 267 = ?',    note: 'problema'                               },
        { equation: '3 - 7: pegar 1 emprestado', note: 'unidades: 13 - 7 = 6'         },
        { equation: '0 - 6: pegar 1 emprestado', note: 'dezenas: 9 - 6 = 3 (virou 9)' },
        { equation: '4 - 2 = 2',        note: 'centenas: 5 virou 4, 4 - 2 = 2'        },
        { equation: '503 - 267 = 236',  note: 'resultado'                              },
      ],
      drawCanvas: function() { _drawNumberLine(503, 267, '-'); },
    },
    '*': {
      label: 'Multiplicação',
      steps: [
        { equation: '7 × 8 = ?',        note: 'tabuada / conta de vezes'        },
        { equation: '7 × 1 = 7',        note: 'uma vez 7'                       },
        { equation: '7 × 2 = 14',       note: 'duas vezes 7'                    },
        { equation: '7 × 4 = 28',       note: 'dobrar novamente: 14 + 14 = 28'  },
        { equation: '7 × 8 = 56',       note: 'dobrar novamente: 28 + 28 = 56'  },
      ],
      drawCanvas: function() { _drawMultGrid(7, 8); },
    },
    '/': {
      label: 'Divisão',
      steps: [
        { equation: '56 ÷ 7 = ?',       note: 'dividir em grupos iguais'        },
        { equation: '7 × ? = 56',       note: 'divisão é multiplicação inversa' },
        { equation: '7 × 1 = 7',        note: 'testar: 1 não basta'             },
        { equation: '7 × 5 = 35',       note: '5 não basta'                     },
        { equation: '7 × 8 = 56 ✓',    note: '8 grupos de 7 = 56'              },
        { equation: '56 ÷ 7 = 8',       note: 'resultado'                       },
      ],
      drawCanvas: function() { _drawDivGroups(56, 7); },
    },
  };

  var _selectedOp = '+';
  var _exampleStep = 0;

  // ═══════════════════════════════════════════════════════════════════
  //  CONCEPT
  // ═══════════════════════════════════════════════════════════════════

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);

    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Aritmética' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">As Quatro Operações</h1>' +
          '<p class="topic-meta">adição · subtração · multiplicação · divisão</p>' +
          '<div class="content-block">' +
            '<p>As quatro operações são a base de toda a matemática. Cada uma tem uma <strong>inversa</strong> — a operação que desfaz o efeito da outra.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Adição  ( + )</div>' +
              'a + b = s — somar duas quantidades.<br>' +
              'Inversa: subtração.&nbsp;&nbsp;<span class="text-dim">Exemplo: 7 + 5 = 12</span>' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Subtração  ( − )</div>' +
              'a − b = d — retirar uma quantidade de outra.<br>' +
              'Inversa: adição.&nbsp;&nbsp;<span class="text-dim">Exemplo: 12 − 5 = 7</span>' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Multiplicação  ( × )</div>' +
              'a × b = p — somar a repetidamente, b vezes.<br>' +
              'Inversa: divisão.&nbsp;&nbsp;<span class="text-dim">Exemplo: 4 × 3 = 12</span>' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Divisão  ( ÷ )</div>' +
              'a ÷ b = q — dividir em b grupos iguais.&nbsp;(b ≠ 0)<br>' +
              'Inversa: multiplicação.&nbsp;&nbsp;<span class="text-dim">Exemplo: 12 ÷ 3 = 4</span>' +
            '</div>' +
            '<p>A ordem das operações importa: multiplicação e divisão têm prioridade sobre adição e subtração. Parênteses definem a precedência explicitamente.</p>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/arithmetic/example\')">Ver exemplos →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">7 + 5 = 12</p>' +
        '</div>' +
      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);
    _drawNumberLine(7, 5, '+');
  }

  // ═══════════════════════════════════════════════════════════════════
  //  EXAMPLE — op selector + per-op steps
  // ═══════════════════════════════════════════════════════════════════

  function renderExample(view) {
    _exampleStep = 0;
    _selectedOp  = '+';
    _renderExampleView(view);
  }

  function _renderExampleView(view) {
    var op    = _ops[_selectedOp];
    var n     = op.steps.length;

    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([
            { label: 'Início', href: '' },
            { label: 'Aritmética', href: 'topic/arithmetic/concept' },
            { label: 'Exemplo' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplos resolvidos</h1>' +
          '<p class="topic-meta">escolha a operação abaixo</p>' +

          // Op selector tabs
          '<div class="phase-bar" style="margin-bottom:28px">' +
            _opTab('+', 'Adição')        +
            _opTab('-', 'Subtração')      +
            _opTab('*', 'Multiplicação')  +
            _opTab('/', 'Divisão')        +
          '</div>' +

          '<p class="topic-meta" style="margin-bottom:20px">' + op.label + ' — passo a passo</p>' +

          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + n + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">' + _buildStepDesc(_exampleStep) + '</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Arith.prevStep()" ' + (_exampleStep === 0 ? 'disabled' : '') + '>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Arith.nextStep()">' +
              (_exampleStep === n - 1 ? 'Praticar →' : 'Próximo →') +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">' + op.label.toLowerCase() + '</p>' +
        '</div>' +
      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 310);
    op.drawCanvas();
    Renderer.drawEquationSteps(op.steps, _exampleStep);
  }

  function _opTab(op, label) {
    var active = _selectedOp === op;
    return '<div class="phase-step' + (active ? ' active' : '') + '" onclick="Arith.selectOp(\'' + op + '\')">' + label + '</div>';
  }

  function _buildStepDesc(idx) {
    var op   = _ops[_selectedOp];
    var s    = op.steps[idx];
    var prev = idx > 0 ? op.steps[idx - 1] : null;
    if (!prev) return 'Problema: <span class="text-mono text-gold">' + s.equation + '</span>';
    return '<strong>' + s.note + '</strong><br>Chegamos a: <span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _updateExampleUI() {
    var op  = _ops[_selectedOp];
    var idx = _exampleStep, n = op.steps.length;
    var pct = Math.round(idx / (n - 1) * 100);

    var counter = document.getElementById('step-counter');
    var fill    = document.getElementById('step-fill');
    var desc    = document.getElementById('step-desc');
    var prev    = document.getElementById('btn-prev');
    var next    = document.getElementById('btn-next');

    if (counter) counter.textContent = 'Passo ' + (idx + 1) + ' de ' + n;
    if (fill)    fill.style.width    = pct + '%';
    if (desc)    desc.innerHTML      = _buildStepDesc(idx);
    if (prev)    prev.disabled       = idx === 0;
    if (next) {
      if (idx === n - 1) {
        next.textContent = 'Praticar →';
        next.onclick     = function() { Progress.markExample(TOPIC_ID); Router.navigate('topic/arithmetic/practice'); };
      } else {
        next.textContent = 'Próximo →';
        next.onclick     = function() { Arith.nextStep(); };
      }
    }

    op.drawCanvas();
    Renderer.drawEquationSteps(op.steps, idx);
  }

  // ═══════════════════════════════════════════════════════════════════
  //  PRACTICE
  // ═══════════════════════════════════════════════════════════════════

  // Build a shuffled queue ensuring all 4 ops appear before repeating.
  function _buildOpQueue() {
    var ops = ['+', '-', '*', '/'];
    // Shuffle
    for (var i = ops.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = ops[i]; ops[i] = ops[j]; ops[j] = t;
    }
    return ops;
  }

  // Map op char to topicId-style string for the generator
  var _opToType = { '+': 'addition', '-': 'subtraction', '*': 'multiplication', '/': 'division' };

  function renderPractice(view) {
    _practice.exercise     = null;
    _practice.hintsEnabled = false;
    _practice.hintIndex    = 0;
    _practice.solved       = false;
    _practice.opQueue      = _buildOpQueue();
    _practice.opQueueIdx   = 0;

    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([
            { label: 'Início', href: '' },
            { label: 'Aritmética', href: 'topic/arithmetic/concept' },
            { label: 'Prática' }
          ]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Arith.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">visualização</p>' +
        '</div>' +
      '</div>';

    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 380, 340);
    _loadNext();
  }

  function _loadNext() {
    // Pick next op from queue; rebuild queue when exhausted
    if (_practice.opQueueIdx >= _practice.opQueue.length) {
      _practice.opQueue    = _buildOpQueue();
      _practice.opQueueIdx = 0;
    }

    var opChar = _practice.opQueue[_practice.opQueueIdx++];
    var opType = _opToType[opChar];

    // Generate exercise for this specific type
    var ex = _genForType(opType, _practice.difficulty);

    _practice.exercise  = ex;
    _practice.hintIndex = 0;
    _practice.solved    = false;
    _renderCard(opChar);
    _drawPracticeCanvas(ex, opChar);
  }

  // Generate one exercise for a specific type (bypasses the random dispatch)
  function _genForType(opType, difficulty) {
    // Call MathCore with a special key — if WASM doesn't know it,
    // fallback handles it; otherwise call fallback directly.
    var ex;
    try { ex = MathCore.generateExercise('arith_' + opType, difficulty); } catch(e) { ex = null; }
    // Always fall back to MathFallback which knows all types
    if (!ex || !ex.answer) ex = MathFallback._genByType(opType, difficulty);
    return ex;
  }

  function _renderCard(opChar) {
    var area = document.getElementById('exercise-area'); if (!area) return;
    var ex = _practice.exercise, cnt = _practice.history.length + 1;
    var counter = document.getElementById('ex-counter'); if (counter) counter.textContent = 'Exercício ' + cnt;

    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">' + ex.statement + '</p>' +
        '<div class="exercise-equation">' + ex.equation + '</div>' +
        '<div class="answer-row"><span class="answer-label">= </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="sua resposta" autocomplete="off" /></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Arith.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Arith.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Arith.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';

    var input = document.getElementById('answer-input');
    if (input) {
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter') Arith.checkAnswer(); });
      input.focus();
    }
    _updateHintButton();
  }

  function _drawPracticeCanvas(ex, opChar) {
    var label = document.getElementById('canvas-label');

    // Extract numbers from equation for canvas
    var eq  = String(ex.equation);
    var sym = opChar === '*' ? '×' : opChar === '/' ? '÷' : opChar;
    // Match "a OP b" with unicode op symbols
    var re  = /(-?\d+(?:\.\d+)?)\s*[+\-×÷]\s*(\d+(?:\.\d+)?)/;
    var m   = eq.match(re);

    if (m) {
      var a = parseFloat(m[1]), b = parseFloat(m[2]);
      if (opChar === '*' && a <= 12 && b <= 12) {
        if (label) label.textContent = 'grade ' + a + ' × ' + b;
        _drawMultGrid(a, b);
      } else if (opChar === '/' && Number.isInteger(a) && Number.isInteger(b) && b <= 9 && a / b <= 12) {
        if (label) label.textContent = 'grupos de ' + b;
        _drawDivGroups(a, b);
      } else {
        if (label) label.textContent = 'linha numérica';
        _drawNumberLine(a, b, opChar);
      }
    } else {
      Renderer.clear();
    }
  }

  function _updateHintButton() {
    var btn = document.getElementById('btn-hint');
    if (btn) btn.style.display = _practice.hintsEnabled && !_practice.solved ? '' : 'none';
  }

  // ── Public ────────────────────────────────────────────────────────

  var _public = {

    selectOp: function(op) {
      _selectedOp  = op;
      _exampleStep = 0;
      var view = document.getElementById('view');
      if (view) _renderExampleView(view);
    },

    nextStep: function() {
      var n = _ops[_selectedOp].steps.length;
      if (_exampleStep < n - 1) { _exampleStep++; _updateExampleUI(); }
      else { Progress.markExample(TOPIC_ID); Router.navigate('topic/arithmetic/practice'); }
    },

    prevStep: function() {
      if (_exampleStep > 0) { _exampleStep--; _updateExampleUI(); }
    },

    toggleHints: function() {
      _practice.hintsEnabled = !_practice.hintsEnabled;
      var sw = document.getElementById('hint-toggle-sw');
      if (sw) sw.classList.toggle('on', _practice.hintsEnabled);
      _updateHintButton();
      if (!_practice.hintsEnabled) {
        var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = '';
        _practice.hintIndex = 0;
      }
    },

    showNextHint: function() {
      var ex = _practice.exercise;
      if (!ex || !ex.hints || _practice.hintIndex >= ex.hints.length) return;
      var ha = document.getElementById('hint-area');
      if (ha && ex.hints[_practice.hintIndex]) {
        ha.innerHTML += '<div class="hint-box"><div class="hint-label">Dica ' + (_practice.hintIndex + 1) + '</div>' + ex.hints[_practice.hintIndex] + '</div>';
      }
      _practice.hintIndex++;
      var btn = document.getElementById('btn-hint');
      if (btn && _practice.hintIndex >= ex.hints.length) btn.style.display = 'none';
    },

    checkAnswer: function() {
      if (_practice.solved) return;
      var input = document.getElementById('answer-input'), fb = document.getElementById('feedback');
      if (!input || !fb || !_practice.exercise) return;
      var student = input.value.trim();
      var correct = MathCore.validate(TOPIC_ID, student, _practice.exercise.answer);
      input.classList.toggle('correct', correct);
      input.classList.toggle('wrong', !correct);
      if (correct) {
        fb.className = 'feedback-line correct';
        fb.textContent = '✓ Correto! = ' + _practice.exercise.answer;
        _practice.solved = true; _practice.history.push(true);
        Progress.recordAttempt(TOPIC_ID, true);
        _practice.difficulty = MathCore.nextDifficulty(_practice.history);
        input.disabled = true;
        var btnNext = document.getElementById('btn-next-ex'); if (btnNext) btnNext.style.display = '';
        _updateHintButton();
      } else {
        fb.className = 'feedback-line wrong';
        fb.textContent = '✗ Não é isso. Tente novamente.';
        _practice.history.push(false); Progress.recordAttempt(TOPIC_ID, false);
        if (_practice.hintsEnabled && _practice.hintIndex === 0) {
          var hi = MathCore.analyzeError(TOPIC_ID, student, _practice.exercise.answer);
          if (hi > 0) _public.showNextHint();
        }
      }
      UI.renderSidebar(TOPIC_ID);
    },

    nextExercise: function() {
      _practice.hintIndex = 0;
      var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = '';
      _loadNext();
    },
  };

  Router.register(TOPIC_ID, {
    renderConcept:  renderConcept,
    renderExample:  renderExample,
    renderPractice: renderPractice,
  });

  window.Arith = _public;

})();
