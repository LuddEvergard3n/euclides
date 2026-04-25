/**
 * modules/calculus.js
 * Single responsibility: teach introductory calculus — limits, derivatives, integrals.
 * Canvas: function plot with tangent line (derivative) or shaded area (integral).
 */
(function () {

  var TOPIC_ID = 'calculus';

  function _makeCanvas(panel, w, h) {
    var c = document.createElement('canvas');
    c.id='main-canvas'; c.width=w||420; c.height=h||380;
    panel.innerHTML=''; panel.appendChild(c); Renderer.init(c); return c;
  }

  var _practice = {exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};

  // ── Canvas helpers ────────────────────────────────────────────────

  // Plot f(x) = ax^n with tangent at xVal (derivative visualisation)
  function _drawDerivative(a, n, xVal) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    // Plot the function
    Renderer.plotFunction(function(x){ return a*Math.pow(x,n); }, '#5a8fd2', 2);
    // Tangent line: slope = a*n*xVal^(n-1), passes through (xVal, f(xVal))
    var slope = a * n * Math.pow(xVal, n-1);
    var y0    = a * Math.pow(xVal, n);
    Renderer.plotFunction(function(x){ return slope*(x-xVal) + y0; }, '#c8a44a', 1.5);
    // Point of tangency
    Renderer.drawPoint(xVal, y0, '#4ab8b2', 5, 'x='+xVal);
    // Slope label
    var ctx=Renderer.ctx(), W=Renderer.width();
    ctx.fillStyle='#72728c'; ctx.font='11px JetBrains Mono,monospace'; ctx.textAlign='right';
    ctx.fillText("f'("+xVal+") = "+_round(slope), W-12, 20);
  }

  // Shade area under f(x) = a*x^n from 0 to xVal (integral visualisation)
  function _drawIntegral(a, n, xVal) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    // Shaded area
    var ctx=Renderer.ctx();
    var toCanvasX = Renderer._toCanvasX || null;
    // Use renderer's coordinate transform if exposed, else raw canvas coords
    // We'll draw the fill directly by sampling
    var W=Renderer.width(), H=Renderer.height();
    // Map math coords to canvas (approximate — assumes scale ~30px per unit, center at W/2, H/2)
    var scaleX = W / 28, scaleY = H / 28;  // ±14 unit range
    var ox = W/2, oy = H/2;
    function toX(mx){ return ox + mx*scaleX; }
    function toY(my){ return oy - my*scaleY; }

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    var steps = 80;
    for (var i = 0; i <= steps; i++) {
      var x = xVal * i / steps;
      ctx.lineTo(toX(x), toY(a*Math.pow(x,n)));
    }
    ctx.lineTo(toX(xVal), toY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(200,164,74,0.18)';
    ctx.fill();
    ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 1;
    ctx.stroke();

    Renderer.plotFunction(function(x){ return a*Math.pow(x,n); }, '#5a8fd2', 2);
    Renderer.drawPoint(xVal, a*Math.pow(xVal,n), '#4ab8b2', 5, 'x='+xVal);

    // Area label
    var integral = a/(n+1)*Math.pow(xVal,n+1);
    ctx.fillStyle='#72728c'; ctx.font='11px JetBrains Mono,monospace'; ctx.textAlign='right';
    ctx.fillText('∫₀^'+xVal+' = '+_round(integral), W-12, 20);
  }

  // Plot limit approach: show f(x) = ax+b with vertical approach line
  function _drawLimit(a, b, xVal) {
    Renderer.clear(); Renderer.drawAxes(true, true);
    Renderer.plotFunction(function(x){ return a*x+b; }, '#5a8fd2', 2);
    var yVal = a*xVal+b;
    Renderer.drawPoint(xVal, yVal, '#c8a44a', 5, 'lim='+yVal);
    Renderer.drawVerticalLine(xVal, 'rgba(200,164,74,0.3)');
  }

  function _round(v) {
    if(!isFinite(v)) return '∞';
    return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/,'');
  }

  // Choose canvas based on exercise
  function _drawExCanvas(ex) {
    if(!ex) return;
    var ct = ex.calcType;
    if (ct==='limit')        _drawLimit(ex.a||1, ex.b||0, ex.xVal||1);
    else if(ct==='deriv_power'||ct==='deriv_sum') _drawDerivative(ex.a||1, ex.n||2, 1);
    else if(ct==='deriv_apply') _drawDerivative(ex.a||1, ex.n||2, ex.xVal||1);
    else if(ct==='integral_power') _drawIntegral(ex.a||1, ex.n||1, 2);
    else { Renderer.clear(); Renderer.drawAxes(true,true); }
  }

  // ── CONCEPT ───────────────────────────────────────────────────────

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cálculo'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Cálculo Diferencial e Integral</h1>' +
          '<p class="topic-meta">limites · derivadas · integrais</p>' +
          '<div class="content-block">' +
            '<p>Cálculo estuda variação e acumulação. A derivada mede a taxa de variação instantânea; a integral mede acumulação (área sob a curva).</p>' +
            '<div class="concept-highlight"><div class="hl-label">Limite</div>' +
              'lim(x→c) f(x) = L — o valor que f(x) se aproxima quando x→c.<br>' +
              'Para polinômios: substitua diretamente.' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Derivada</div>' +
              "f'(x) = lim(h→0) [f(x+h) − f(x)] / h<br>" +
              'Regra da potência: d/dx(axⁿ) = a·n·xⁿ⁻¹<br>' +
              "Interpretação geométrica: inclinação da reta tangente a f em x." +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Integral indefinida</div>' +
              '∫axⁿ dx = (a/(n+1))xⁿ⁺¹ + C  (n ≠ −1)<br>' +
              'A integral é a operação inversa da derivada (Teorema Fundamental).' +
            '</div>' +
          '</div>' +
          '<div class="phase-bar" style="margin-top:20px">' +
            '<div class="phase-step active" onclick="Calc.showCanvas(\'deriv\')">Derivada</div>' +
            '<div class="phase-step" onclick="Calc.showCanvas(\'integral\')">Integral</div>' +
            '<div class="phase-step" onclick="Calc.showCanvas(\'limit\')">Limite</div>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/calculus/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">reta tangente em x=2</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380);
    _drawDerivative(1, 2, 2);
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────

  var _exSteps = [
    { equation: "f(x) = 3x²",                      note: 'função dada'                        },
    { equation: "Regra da potência: d/dx(axⁿ) = anx^(n-1)", note: 'fórmula'                  },
    { equation: "f'(x) = 3 · 2 · x^(2-1)",         note: 'aplicar a regra'                   },
    { equation: "f'(x) = 6x",                       note: 'derivada'                          },
    { equation: "f'(2) = 6 · 2 = 12",               note: 'avaliar em x=2'                    },
    { equation: "∫6x dx = 3x² + C",                 note: 'integral de f\'(x) = f(x) + C'     },
  ];
  var _exStep = 0;

  function renderExample(view) {
    _exStep = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cálculo',href:'topic/calculus/concept'},{label:'Exemplo'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">f(x) = 3x²  ·  derivada, avaliação, integral</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">'+_buildDesc(0)+'</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Calc.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Calc.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">f(x) = 3x²</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 340);
    _drawDerivative(3, 2, 2);
    Renderer.drawEquationSteps(_exSteps, 0);
  }

  function _buildDesc(i) {
    var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    if(!p) return 'Partimos de: <span class="text-mono text-gold">'+s.equation+'</span>';
    return '<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>';
  }

  function _updateExUI() {
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_buildDesc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev) prev.disabled=i===0;
    if(next){
      if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/calculus/practice');};}
      else{next.textContent='Próximo →';next.onclick=function(){Calc.nextStep();};}
    }
    // Update canvas to match step
    if(i<=3)      _drawDerivative(3,2,2);
    else if(i===4) _drawDerivative(3,2,2);
    else           _drawIntegral(6,1,2);
    Renderer.drawEquationSteps(_exSteps, i);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────

  function renderPractice(view) {
    _practice.exercise=null;_practice.hintsEnabled=false;_practice.hintIndex=0;_practice.solved=false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cálculo',href:'topic/calculus/concept'},{label:'Prática'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Calc.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">gráfico</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 380);
    _loadNext();
  }

  function _loadNext() {
    _practice.exercise=MathCore.generateExercise(TOPIC_ID,_practice.difficulty);
    _practice.hintIndex=0;_practice.solved=false;
    _renderCard(); _drawExCanvas(_practice.exercise);
  }

  function _renderCard() {
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_practice.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_practice.history.length+1);
    // Format hint for derivative/integral answers
    var fmtHint = (ex.calcType&&ex.calcType.indexOf('deriv')!==-1)
      ? '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: 6x^1 ou 6x  (use ^ para potência)</p>' : '';
    if(ex.calcType==='integral_power')
      fmtHint='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: 3x^2 + C  (inclua + C)</p>';
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">'+ex.statement+'</p>' +
        '<div class="exercise-equation">'+ex.equation+'</div>' +
        fmtHint +
        '<div class="answer-row"><span class="answer-label">= </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Calc.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Calc.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Calc.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Calc.checkAnswer();});inp.focus();}
    _updateHintBtn();
  }

  function _updateHintBtn(){var b=document.getElementById('btn-hint');if(b)b.style.display=_practice.hintsEnabled&&!_practice.solved?'':'none';}

  var _public = {
    showCanvas: function(type) {
      var panel=document.getElementById('canvas-panel'),lbl=document.getElementById('canvas-label');
      if(!panel)return;
      _makeCanvas(panel,420,380);
      var tabs=document.querySelectorAll('.phase-step');
      var idx=['deriv','integral','limit'].indexOf(type);
      tabs.forEach(function(t,i){t.classList.toggle('active',i===idx);});
      if(type==='deriv')   {if(lbl)lbl.textContent='reta tangente em x=2';_drawDerivative(1,2,2);}
      if(type==='integral'){if(lbl)lbl.textContent='área sob a curva';_drawIntegral(1,2,2);}
      if(type==='limit')   {if(lbl)lbl.textContent='limite em x=3';_drawLimit(2,-1,3);}
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateExUI();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/calculus/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateExUI();}},
    toggleHints:function(){
      _practice.hintsEnabled=!_practice.hintsEnabled;
      var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_practice.hintsEnabled);
      _updateHintBtn();
      if(!_practice.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_practice.hintIndex=0;}
    },
    showNextHint:function(){
      var ex=_practice.exercise;if(!ex||!ex.hints||_practice.hintIndex>=ex.hints.length)return;
      var ha=document.getElementById('hint-area');
      if(ha&&ex.hints[_practice.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_practice.hintIndex+1)+'</div>'+ex.hints[_practice.hintIndex]+'</div>';
      _practice.hintIndex++;
      var b=document.getElementById('btn-hint');if(b&&_practice.hintIndex>=ex.hints.length)b.style.display='none';
    },
    checkAnswer:function(){
      if(_practice.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_practice.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_practice.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){
        fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_practice.exercise.answer;
        _practice.solved=true;_practice.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _practice.difficulty=MathCore.nextDifficulty(_practice.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_updateHintBtn();
        _drawExCanvas(_practice.exercise);
      }else{
        fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _practice.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_practice.hintsEnabled&&_practice.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_practice.exercise.answer);if(hi>0)_public.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_practice.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };

  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Calc = _public;

})();
