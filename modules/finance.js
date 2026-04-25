/**
 * modules/finance.js
 * Matemática Financeira — porcentagem, markup, juros simples/compostos,
 * desconto comercial, desconto racional, inflação e poder de compra.
 *
 * Canvas:
 *   - Juros: curva simples (linear) vs composta (exponencial)
 *   - Desconto: comparação comercial vs racional
 *   - Inflação: erosão do poder de compra ao longo do tempo
 */
(function () {
  var TOPIC_ID = 'finance';

  function _mc(p, w, h) {
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 420; c.height = h || 380;
    p.innerHTML = ''; p.appendChild(c); Renderer.init(c); return c;
  }

  var _pr = { exercise: null, difficulty: 1, history: [], hintsEnabled: false, hintIndex: 0, solved: false };
  var _exStep = 0;

  // ── Canvas helpers ────────────────────────────────────────────────

  /**
   * Plot capital growth: one or two curves (simple and/or compound).
   * @param {number} C     - principal
   * @param {number} iRate - rate per period (decimal)
   * @param {number} n     - number of periods
   * @param {string} mode  - 'simple' | 'compound' | 'both'
   */
  function _drawGrowth(C, iRate, n, mode) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var padL = 60, padB = 38, padT = 30, padR = 14;
    var cW = W - padL - padR, cH = H - padB - padT;

    var simpleVals   = [], compoundVals = [];
    for (var t = 0; t <= n; t++) {
      simpleVals.push(C * (1 + iRate * t));
      compoundVals.push(C * Math.pow(1 + iRate, t));
    }
    var maxV = Math.max.apply(null, mode === 'simple' ? simpleVals : compoundVals);
    var minV = C;
    var range = maxV - minV || 1;

    // Grid and axes
    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + cH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT + cH); ctx.lineTo(padL + cW, padT + cH); ctx.stroke();

    for (var k = 0; k <= 4; k++) {
      var v = minV + range * k / 4;
      var py = padT + cH - cH * k / 4;
      ctx.strokeStyle = '#1a1a28'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(padL + cW, py); ctx.stroke();
      ctx.fillStyle = '#3e3e58'; ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText('R$' + Math.round(v), padL - 4, py + 4);
    }

    function _plotCurve(vals, color, dash) {
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.setLineDash(dash ? [5, 3] : []);
      ctx.beginPath();
      vals.forEach(function (v, t) {
        var px = padL + t * (cW / n);
        var py = padT + cH - cH * (v - minV) / range;
        t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke(); ctx.setLineDash([]);
    }

    if (mode === 'simple' || mode === 'both') _plotCurve(simpleVals, '#5a8fd2', mode === 'both');
    if (mode === 'compound' || mode === 'both') _plotCurve(compoundVals, '#c8a44a', false);

    // Legend when comparing
    if (mode === 'both') {
      ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = '#5a8fd2'; ctx.fillText('-- simples', padL + 8, padT + 14);
      ctx.fillStyle = '#c8a44a'; ctx.fillText('—  composto', padL + 8, padT + 26);
    }

    // Label final values
    var lastIdx = n;
    if (mode === 'simple' || mode === 'both') {
      var px = padL + lastIdx * (cW / n), v = simpleVals[lastIdx];
      var py = padT + cH - cH * (v - minV) / range;
      ctx.fillStyle = '#5a8fd2'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'left';
      ctx.fillText('R$' + Math.round(v), px + 4, py);
    }
    if (mode === 'compound' || mode === 'both') {
      var px = padL + lastIdx * (cW / n), v = compoundVals[lastIdx];
      var py = padT + cH - cH * (v - minV) / range;
      ctx.fillStyle = '#c8a44a'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'left';
      ctx.fillText('R$' + Math.round(v), px + 4, py + 12);
    }
  }

  /**
   * Bar chart comparing two discount methods (commercial vs rational).
   * @param {number} N    - nominal value
   * @param {number} dcPV - commercial present value
   * @param {number} drPV - rational present value
   */
  function _drawDiscountComparison(N, dcPV, drPV) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var padL = 50, padB = 48, padT = 36, padR = 20;
    var cW = W - padL - padR, cH = H - padB - padT;

    ctx.fillStyle = '#3e3e58'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Desconto comercial vs racional (N = R$' + N + ')', W / 2, 20);

    var maxV = N, entries = [
      { label: 'Nominal (N)', value: N, color: '#3e3e58' },
      { label: 'Com. (Dc)', value: dcPV, color: '#5a8fd2' },
      { label: 'Rac. (Dr)', value: drPV, color: '#c8a44a' },
    ];
    var bW = Math.floor(cW / entries.length * 0.55);
    var gap = cW / entries.length;

    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + cH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL, padT + cH); ctx.lineTo(padL + cW, padT + cH); ctx.stroke();

    entries.forEach(function (e, i) {
      var bh = cH * (e.value / maxV);
      var bx = padL + i * gap + (gap - bW) / 2;
      var by = padT + cH - bh;
      ctx.fillStyle = e.color + '99';
      ctx.fillRect(bx, by, bW, bh);
      ctx.strokeStyle = e.color; ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bW, bh);
      ctx.fillStyle = e.color; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('R$' + Math.round(e.value), bx + bW / 2, by - 6);
      ctx.fillStyle = '#72728c'; ctx.font = '9px JetBrains Mono,monospace';
      ctx.fillText(e.label, bx + bW / 2, padT + cH + 14);
    });

    // Note: rational > commercial
    ctx.fillStyle = '#4ab8b2'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Racional > Comercial → favorece o devedor', W / 2, H - 8);
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Mat. Financeira' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Matemática Financeira</h1>' +
          '<p class="topic-meta">porcentagem · juros simples/compostos · desconto · inflação</p>' +
          '<div class="content-block">' +
            '<p>Entender dinheiro no tempo é a habilidade financeira mais ignorada na educação básica. São esses conceitos que os bancos usam em todo contrato.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Porcentagem e markup</div>' +
              'Valor = Base × (taxa / 100)<br>' +
              'Markup: Preço = Custo × (1 + markup/100)<br>' +
              'Desconto sobre preço: Valor = N × (1 − taxa/100)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Juros simples</div>' +
              'J = C·i·t  |  M = C(1 + i·t)<br>' +
              'Crescimento linear — juros sempre sobre o capital inicial.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Juros compostos</div>' +
              'M = C·(1+i)^t  (i em decimal)<br>' +
              'Juros sobre juros — crescimento exponencial.<br>' +
              'Todo financiamento bancário usa juros compostos.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Desconto comercial (bancário)</div>' +
              'D_c = N·d·t  |  PV = N − D_c<br>' +
              'Calculado sobre o valor nominal N.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Desconto racional (por dentro)</div>' +
              'PV = N / (1 + i·t)  |  D_r = N − PV<br>' +
              'Calculado sobre o valor presente. Sempre D_r &lt; D_c → PV racional &gt; PV comercial.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Inflação e poder de compra</div>' +
              'V_futuro = V_atual × (1 + inf)^anos<br>' +
              'Com inflação de 6% a.a.: em 12 anos o real perde ~50% do valor.' +
            '</div>' +
          '</div>' +
          '<div class="phase-bar" style="margin-top:20px">' +
            '<div class="phase-step active" onclick="Fin.showTab(\'both\')">Simples vs Comp.</div>' +
            '<div class="phase-step" onclick="Fin.showTab(\'discount\')">Desconto</div>' +
            '<div class="phase-step" onclick="Fin.showTab(\'inflation\')">Inflação</div>' +
          '</div>' +
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/finance/example\')">Ver exemplo →</button></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">simples vs composto</p></div>' +
      '</div>';
    _mc(view.querySelector('#canvas-panel'), 420, 380);
    _drawGrowth(1000, 0.05, 12, 'both');
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────
  var _exSteps = [
    { equation: 'Capital: R$ 5.000,00  |  i = 3% a.m.  |  t = 6 meses', note: 'problema' },
    { equation: 'Juros simples: J = 5000 × 0,03 × 6 = R$ 900,00', note: 'cálculo simples' },
    { equation: 'Montante simples: M = 5000 + 900 = R$ 5.900,00', note: 'montante simples' },
    { equation: 'Juros compostos: M = 5000 × (1,03)^6', note: 'fórmula composta' },
    { equation: '(1,03)^6 ≈ 1,1941  →  M ≈ R$ 5.970,26', note: 'montante composto' },
    { equation: 'Diferença: 5970,26 − 5900 = R$ 70,26 a mais em compostos', note: 'comparação' },
    { equation: 'Desconto comercial vs racional (N=1000, d=2%a.m., t=3m)', note: 'mudando para desconto' },
    { equation: 'D_c = 1000×0,02×3 = 60  →  PV = R$ 940,00', note: 'desconto comercial' },
    { equation: 'PV racional = 1000/(1+0,02×3) = 1000/1,06 ≈ R$ 943,40', note: 'desconto racional (favorece devedor)' },
  ];

  function renderExample(view) {
    _exStep = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Mat. Financeira', href: 'topic/finance/concept' }, { label: 'Exemplo' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">R$ 5.000 · 3% a.m. · 6 meses — simples vs compostos · desconto</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de ' + _exSteps.length + '</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">' + _desc(0) + '</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Fin.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Fin.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">crescimento</p></div>' +
      '</div>';
    _mc(view.querySelector('#canvas-panel'), 420, 340);
    _drawGrowth(5000, 0.03, 6, 'both');
    Renderer.drawEquationSteps(_exSteps, 0);
  }

  function _desc(i) {
    var s = _exSteps[i], p = i > 0 ? _exSteps[i - 1] : null;
    return p
      ? '<strong>' + s.note + '</strong><br><span class="text-mono text-gold">' + s.equation + '</span>'
      : 'Dados: <span class="text-mono text-gold">' + s.equation + '</span>';
  }

  function _updateEx() {
    var i = _exStep, n = _exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo ' + (i + 1) + ' de ' + n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i / (n - 1) * 100) + '%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev = document.getElementById('btn-prev'), next = document.getElementById('btn-next');
    if (prev) prev.disabled = i === 0;
    if (next) {
      if (i === n - 1) {
        next.textContent = 'Praticar →';
        next.onclick = function () { Progress.markExample(TOPIC_ID); Router.navigate('topic/finance/practice'); };
      } else {
        next.textContent = 'Próximo →';
        next.onclick = function () { Fin.nextStep(); };
      }
    }
    var lbl = document.getElementById('canvas-label');
    if (i <= 5) {
      if (lbl) lbl.textContent = 'simples vs composto';
      _drawGrowth(5000, 0.03, 6, i === 0 ? 'both' : i <= 2 ? 'simple' : 'both');
    } else {
      if (lbl) lbl.textContent = 'desconto comercial vs racional';
      _drawDiscountComparison(1000, 940, 943.40);
    }
    Renderer.drawEquationSteps(_exSteps, i);
  }

  // ── PRACTICE ─────────────────────────────────────────────────────
  function renderPractice(view) {
    _pr.exercise = null; _pr.hintsEnabled = false; _pr.hintIndex = 0; _pr.solved = false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{ label: 'Início', href: '' }, { label: 'Mat. Financeira', href: 'topic/finance/concept' }, { label: 'Prática' }]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Fin.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>' +
          '</div>' +
          '<div id="exercise-area"></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">visualização</p></div>' +
      '</div>';
    _mc(view.querySelector('#canvas-panel'), 420, 380); _loadNext();
  }

  function _loadNext() {
    _pr.exercise = MathCore.generateExercise(TOPIC_ID, _pr.difficulty);
    _pr.hintIndex = 0; _pr.solved = false; _renderCard();
    var ex = _pr.exercise, lbl = document.getElementById('canvas-label');
    if (ex.finType === 'simple') {
      if (lbl) lbl.textContent = 'juros simples';
      _drawGrowth(ex.C, ex.i / 100, ex.t, 'simple');
    } else if (ex.finType === 'compound') {
      if (lbl) lbl.textContent = 'juros compostos';
      _drawGrowth(ex.C, ex.i / 100, ex.t, 'compound');
    } else if (ex.finType === 'discount') {
      if (lbl) lbl.textContent = 'desconto comercial';
      var D = ex.N * ex.d / 100 * ex.t;
      _drawDiscountComparison(ex.N, ex.N - D, ex.N / (1 + ex.d / 100 * ex.t));
    } else if (ex.finType === 'rational') {
      if (lbl) lbl.textContent = 'desconto racional';
      var dcPV = ex.N - ex.N * ex.i / 100 * ex.t;
      _drawDiscountComparison(ex.N, dcPV, parseFloat(String(ex.answer).replace(',', '.')));
    } else if (ex.finType === 'inflation') {
      if (lbl) lbl.textContent = 'inflação';
      _drawGrowth(ex.valor, ex.inflacao / 100, ex.anos, 'compound');
    } else {
      Renderer.clear();
      var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
      ctx.fillStyle = '#72728c'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(ex.equation || '', W / 2, H / 2);
    }
  }

  function _renderCard() {
    var area = document.getElementById('exercise-area'); if (!area) return;
    var ex = _pr.exercise;
    document.getElementById('ex-counter').textContent = 'Exercício ' + (_pr.history.length + 1);
    var fmt = '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: 1234,56 (vírgula para decimais)</p>';
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">' + ex.statement + '</p>' +
        '<div class="exercise-equation">' + ex.equation + '</div>' + fmt +
        '<div class="answer-row"><span class="answer-label">R$ </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="0,00" autocomplete="off" style="max-width:200px"/></div>' +
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Fin.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Fin.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Fin.nextExercise()" style="display:none">Próximo →</button>' +
        '</div></div>';
    var inp = document.getElementById('answer-input');
    if (inp) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') Fin.checkAnswer(); }); inp.focus(); }
    _uhb();
  }

  function _uhb() {
    var b = document.getElementById('btn-hint');
    if (b) b.style.display = _pr.hintsEnabled && !_pr.solved ? '' : 'none';
  }

  var _pub = {
    showTab: function (mode) {
      var p = document.getElementById('canvas-panel'), l = document.getElementById('canvas-label');
      if (!p) return; _mc(p, 420, 380);
      var tabs = document.querySelectorAll('.phase-step');
      var idx  = { both: 0, discount: 1, inflation: 2 }[mode] || 0;
      tabs.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
      if (mode === 'both') {
        if (l) l.textContent = 'simples vs composto';
        _drawGrowth(1000, 0.05, 12, 'both');
      } else if (mode === 'discount') {
        if (l) l.textContent = 'desconto comercial vs racional';
        _drawDiscountComparison(1000, 940, 943.40);
      } else {
        if (l) l.textContent = 'inflação';
        _drawGrowth(1000, 0.06, 12, 'compound');
      }
    },
    nextStep: function () {
      if (_exStep < _exSteps.length - 1) { _exStep++; _updateEx(); }
      else { Progress.markExample(TOPIC_ID); Router.navigate('topic/finance/practice'); }
    },
    prevStep: function () { if (_exStep > 0) { _exStep--; _updateEx(); } },
    toggleHints: function () {
      _pr.hintsEnabled = !_pr.hintsEnabled;
      var sw = document.getElementById('hint-toggle-sw'); if (sw) sw.classList.toggle('on', _pr.hintsEnabled);
      _uhb();
      if (!_pr.hintsEnabled) { var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = ''; _pr.hintIndex = 0; }
    },
    showNextHint: function () {
      var ex = _pr.exercise; if (!ex || !ex.hints || _pr.hintIndex >= ex.hints.length) return;
      var ha = document.getElementById('hint-area');
      if (ha && ex.hints[_pr.hintIndex])
        ha.innerHTML += '<div class="hint-box"><div class="hint-label">Dica ' + (_pr.hintIndex + 1) + '</div>' + ex.hints[_pr.hintIndex] + '</div>';
      _pr.hintIndex++;
      var b = document.getElementById('btn-hint'); if (b && _pr.hintIndex >= ex.hints.length) b.style.display = 'none';
    },
    checkAnswer: function () {
      if (_pr.solved) return;
      var inp = document.getElementById('answer-input'), fb = document.getElementById('feedback');
      if (!inp || !fb || !_pr.exercise) return;
      var s = parseFloat(inp.value.trim().replace(',', '.'));
      var c = parseFloat(String(_pr.exercise.answer).replace(',', '.'));
      var ok = !isNaN(s) && Math.abs(s - c) <= 0.05;
      inp.classList.toggle('correct', ok); inp.classList.toggle('wrong', !ok);
      if (ok) {
        fb.className = 'feedback-line correct'; fb.textContent = '✓ Correto! R$ ' + _pr.exercise.answer;
        _pr.solved = true; _pr.history.push(true); Progress.recordAttempt(TOPIC_ID, true);
        _pr.difficulty = MathCore.nextDifficulty(_pr.history); inp.disabled = true;
        var bn = document.getElementById('btn-next-ex'); if (bn) bn.style.display = ''; _uhb();
      } else {
        fb.className = 'feedback-line wrong'; fb.textContent = '✗ Não é isso. Tente novamente.';
        _pr.history.push(false); Progress.recordAttempt(TOPIC_ID, false);
        if (_pr.hintsEnabled && _pr.hintIndex === 0) _pub.showNextHint();
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise: function () {
      _pr.hintIndex = 0;
      var ha = document.getElementById('hint-area'); if (ha) ha.innerHTML = '';
      _loadNext();
    },
  };

  Router.register(TOPIC_ID, { renderConcept: renderConcept, renderExample: renderExample, renderPractice: renderPractice });
  window.Fin = _pub;
})();
