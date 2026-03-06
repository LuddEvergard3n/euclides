/**
 * modules/functions.js
 * Single responsibility: teach functions — linear, quadratic, exponential, logarithmic.
 * Canvas: real-time plot of selected function type.
 */
(function () {

  var TOPIC_ID = 'functions';

  function _makeCanvas(panel, w, h) {
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w || 420; c.height = h || 380;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }

  var _practice = {
    exercise: null, difficulty: 1, history: [],
    hintsEnabled: false, hintIndex: 0, solved: false,
  };

  // ── Canvas helpers ────────────────────────────────────────────────

  function _plotLinear(a, b) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    Renderer.plotFunction(function(x){ return a*x + b; }, '#c8a44a', 2);
    // y-intercept
    if (Math.abs(b) < 50) Renderer.drawPoint(0, b, '#4ab8b2', 4, 'b='+b);
    // zero
    if (a !== 0 && Math.abs(b/a) < 14) Renderer.drawPoint(-b/a, 0, '#5a8fd2', 4, 'zero');
  }

  function _plotQuadratic(a, b, c) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    Renderer.plotFunction(function(x){ return a*x*x + b*x + c; }, '#c8a44a', 2);
    var vx = -b/(2*a), vy = a*vx*vx + b*vx + c;
    if (Math.abs(vx) < 14 && Math.abs(vy) < 14) Renderer.drawPoint(vx, vy, '#4ab8b2', 5, 'V');
    var delta = b*b - 4*a*c;
    if (delta >= 0) {
      var sq = Math.sqrt(delta);
      var r1 = (-b+sq)/(2*a), r2 = (-b-sq)/(2*a);
      if (Math.abs(r1) < 14) Renderer.drawRootsOnAxis([r1], '#5a8fd2');
      if (Math.abs(r2 - r1) > 0.01 && Math.abs(r2) < 14) Renderer.drawRootsOnAxis([r2], '#5a8fd2');
    }
  }

  function _plotExponential(base) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    Renderer.plotFunction(function(x){ return Math.pow(base, x); }, '#c8a44a', 2);
    Renderer.drawPoint(0, 1, '#4ab8b2', 4, '(0,1)');
    Renderer.drawPoint(1, base, '#5a8fd2', 4, '(1,'+base+')');
  }

  function _plotLogarithmic(base) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    var logBase = Math.log(base);
    Renderer.plotFunction(function(x){ return x > 0 ? Math.log(x)/logBase : NaN; }, '#c8a44a', 2);
    Renderer.drawPoint(1, 0, '#4ab8b2', 4, '(1,0)');
    Renderer.drawPoint(base, 1, '#5a8fd2', 4, '('+base+',1)');
    // Asymptote at x=0
    Renderer.drawVerticalLine(0, 'rgba(200,82,82,0.35)');
  }

  // ── CONCEPT ───────────────────────────────────────────────────────

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Funções'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Funções</h1>' +
          '<p class="topic-meta">linear · quadrática · exponencial · logarítmica</p>' +
          '<div class="content-block">' +
            '<p>Uma função f associa cada valor de x a exatamente um valor y = f(x). O conjunto dos x possíveis é o <strong>domínio</strong>; os y resultantes formam a <strong>imagem</strong>.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Linear — f(x) = ax + b</div>' +
              'Reta no plano. a = inclinação, b = ponto no eixo y.<br>' +
              'a > 0: crescente · a < 0: decrescente · a = 0: constante' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Quadrática — f(x) = ax² + bx + c</div>' +
              'Parábola. a > 0: abre pra cima · a < 0: abre pra baixo.<br>' +
              'Vértice: V = (−b/2a, f(−b/2a))' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Exponencial — f(x) = aˣ  (a > 0, a ≠ 1)</div>' +
              'a > 1: crescente · 0 < a < 1: decrescente.<br>' +
              'Sempre passa por (0, 1). Assíntota em y = 0.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Logarítmica — f(x) = logₐ(x)  (a > 0, a ≠ 1)</div>' +
              'Inversa da exponencial. Domínio: x > 0.<br>' +
              'Sempre passa por (1, 0) e (a, 1). Assíntota em x = 0.' +
            '</div>' +
          '</div>' +
          '<div class="phase-bar" style="margin-top:20px">' +
            '<div class="phase-step active" onclick="Func.plotType(\'linear\')">Linear</div>' +
            '<div class="phase-step" onclick="Func.plotType(\'quadratic\')">Quadrática</div>' +
            '<div class="phase-step" onclick="Func.plotType(\'exponential\')">Exponencial</div>' +
            '<div class="phase-step" onclick="Func.plotType(\'logarithmic\')">Logarítmica</div>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/functions/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">f(x) = 2x − 1</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380); _plotLinear(2, -1);
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────

  var _exSteps = [
    { equation: 'f(x) = x² − 3x + 2',       note: 'função quadrática dada'            },
    { equation: 'a=1, b=−3, c=2',             note: 'identificar coeficientes'          },
    { equation: 'Vx = −b/2a = 3/2 = 1,5',    note: 'coordenada x do vértice'           },
    { equation: 'Vy = f(1,5) = 2,25−4,5+2',  note: 'coordenada y do vértice'           },
    { equation: 'V = (1,5 ; −0,25)',           note: 'vértice (ponto mínimo)'            },
    { equation: 'delta = 9 − 8 = 1',          note: 'discriminante'                     },
    { equation: 'x = (3 ± 1) / 2 → x=2 ou x=1', note: 'raízes por Bhaskara'           },
  ];
  var _exStep = 0;

  function renderExample(view) {
    _exStep = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Funções',href:'topic/functions/concept'},{label:'Exemplo'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">f(x) = x² − 3x + 2  ·  vértice e raízes</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">'+_buildExDesc(0)+'</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Func.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Func.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">f(x) = x² − 3x + 2</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 340);
    _plotQuadratic(1, -3, 2);
    Renderer.drawEquationSteps(_exSteps, 0);
  }

  function _buildExDesc(i) {
    var s = _exSteps[i], p = i > 0 ? _exSteps[i-1] : null;
    if (!p) return 'Partimos de: <span class="text-mono text-gold">'+s.equation+'</span>';
    return '<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>';
  }

  function _updateExUI() {
    var i = _exStep, n = _exSteps.length;
    document.getElementById('step-counter').textContent = 'Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width = Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML = _buildExDesc(i);
    var prev = document.getElementById('btn-prev'), next = document.getElementById('btn-next');
    if (prev) prev.disabled = i === 0;
    if (next) {
      if (i === n-1) { next.textContent='Praticar →'; next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/functions/practice');}; }
      else { next.textContent='Próximo →'; next.onclick=function(){Func.nextStep();}; }
    }
    Renderer.drawEquationSteps(_exSteps, i);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────

  function renderPractice(view) {
    _practice.exercise=null; _practice.hintsEnabled=false; _practice.hintIndex=0; _practice.solved=false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Funções',href:'topic/functions/concept'},{label:'Prática'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Func.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">gráfico</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 380);
    _loadNext();
  }

  function _loadNext() {
    _practice.exercise = MathCore.generateExercise(TOPIC_ID, _practice.difficulty);
    _practice.hintIndex=0; _practice.solved=false;
    _renderCard(); _drawPracticeCanvas();
  }

  function _renderCard() {
    var area = document.getElementById('exercise-area'); if(!area) return;
    var ex = _practice.exercise;
    document.getElementById('ex-counter').textContent = 'Exercício '+(_practice.history.length+1);
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">'+ex.statement+'</p>' +
        '<div class="exercise-equation">'+ex.equation+'</div>' +
        '<div class="answer-row"><span class="answer-label">= </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="sua resposta" autocomplete="off"/></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Func.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Func.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Func.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var inp = document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Func.checkAnswer();});inp.focus();}
    _updateHintBtn();
  }

  function _drawPracticeCanvas() {
    var ex = _practice.exercise; if(!ex) return;
    var lbl = document.getElementById('canvas-label');
    var ft  = ex.funcType;
    if (ft==='linear')      { if(lbl) lbl.textContent='f(x) = '+ex.a+'x + '+ex.b; _plotLinear(ex.a, ex.b); }
    else if(ft==='quadratic'){ if(lbl) lbl.textContent='parábola'; _plotQuadratic(ex.a, ex.b, ex.c); }
    else if(ft==='exponential'){ if(lbl) lbl.textContent='f(x) = '+ex.base+'^x'; _plotExponential(ex.base); }
    else if(ft==='logarithmic'){ if(lbl) lbl.textContent='f(x) = log_'+ex.base+'(x)'; _plotLogarithmic(ex.base); }
    else { Renderer.clear(); Renderer.drawAxes(true,true); }
  }

  function _updateHintBtn() {
    var b=document.getElementById('btn-hint'); if(b) b.style.display=_practice.hintsEnabled&&!_practice.solved?'':'none';
  }

  var _public = {
    plotType: function(type) {
      var panel = document.getElementById('canvas-panel'); if(!panel) return;
      var lbl   = document.getElementById('canvas-label');
      _makeCanvas(panel, 420, 380);
      var tabs = document.querySelectorAll('.phase-step');
      var idx  = ['linear','quadratic','exponential','logarithmic'].indexOf(type);
      tabs.forEach(function(t,i){ t.classList.toggle('active', i===idx); });
      if (type==='linear')      { if(lbl) lbl.textContent='f(x) = 2x − 1'; _plotLinear(2,-1); }
      if (type==='quadratic')   { if(lbl) lbl.textContent='f(x) = x² − 2'; _plotQuadratic(1,0,-2); }
      if (type==='exponential') { if(lbl) lbl.textContent='f(x) = 2^x'; _plotExponential(2); }
      if (type==='logarithmic') { if(lbl) lbl.textContent='f(x) = log₂(x)'; _plotLogarithmic(2); }
    },
    nextStep: function(){if(_exStep<_exSteps.length-1){_exStep++;_updateExUI();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/functions/practice');}},
    prevStep: function(){if(_exStep>0){_exStep--;_updateExUI();}},
    toggleHints: function(){
      _practice.hintsEnabled=!_practice.hintsEnabled;
      var sw=document.getElementById('hint-toggle-sw'); if(sw) sw.classList.toggle('on',_practice.hintsEnabled);
      _updateHintBtn();
      if(!_practice.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_practice.hintIndex=0;}
    },
    showNextHint: function(){
      var ex=_practice.exercise; if(!ex||!ex.hints||_practice.hintIndex>=ex.hints.length) return;
      var ha=document.getElementById('hint-area');
      if(ha&&ex.hints[_practice.hintIndex]) ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_practice.hintIndex+1)+'</div>'+ex.hints[_practice.hintIndex]+'</div>';
      _practice.hintIndex++;
      var b=document.getElementById('btn-hint'); if(b&&_practice.hintIndex>=ex.hints.length) b.style.display='none';
    },
    checkAnswer: function(){
      if(_practice.solved) return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_practice.exercise) return;
      var student=inp.value.trim(), ok=MathCore.validate(TOPIC_ID,student,_practice.exercise.answer);
      inp.classList.toggle('correct',ok); inp.classList.toggle('wrong',!ok);
      if(ok){
        fb.className='feedback-line correct'; fb.textContent='✓ Correto! = '+_practice.exercise.answer;
        _practice.solved=true; _practice.history.push(true); Progress.recordAttempt(TOPIC_ID,true);
        _practice.difficulty=MathCore.nextDifficulty(_practice.history); inp.disabled=true;
        var bn=document.getElementById('btn-next-ex'); if(bn) bn.style.display='';
        _updateHintBtn();
      } else {
        fb.className='feedback-line wrong'; fb.textContent='✗ Não é isso. Tente novamente.';
        _practice.history.push(false); Progress.recordAttempt(TOPIC_ID,false);
        if(_practice.hintsEnabled&&_practice.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_practice.exercise.answer);if(hi>0)_public.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise: function(){_practice.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };

  Router.register(TOPIC_ID, {renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Func = _public;

})();
