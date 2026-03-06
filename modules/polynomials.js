/**
 * modules/polynomials.js
 * Polinômios — grau, avaliação, fatoração, raízes, produto notável.
 * Canvas: gráfico do polinômio com raízes marcadas.
 */
(function () {
  var TOPIC_ID = 'polynomials';
  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas ────────────────────────────────────────────────────────
  function _drawPoly(ex){
    Renderer.clear();Renderer.drawAxes(true,true);
    if(!ex)return;
    var a=ex.a||1,b=ex.b||0,c=ex.c||0;
    if(ex.polyType==='factor'||ex.polyType==='roots'||ex.polyType==='expand'){
      Renderer.plotFunction(function(x){return a*x*x+b*x+c;},'#5a8fd2',2);
      if(ex.r1!==undefined&&Math.abs(ex.r1)<13)Renderer.drawPoint(ex.r1,0,'#c8a44a',5,'r='+ex.r1);
      if(ex.r2!==undefined&&Math.abs(ex.r2-ex.r1)>0.01&&Math.abs(ex.r2)<13)Renderer.drawPoint(ex.r2,0,'#c8a44a',5,'r='+ex.r2);
    } else if(ex.polyType==='eval'&&ex.xv!==undefined){
      // Show degree-2 approximation
      Renderer.plotFunction(function(x){return x*x;},'#5a8fd2',1.5);
      Renderer.drawPoint(ex.xv,ex.xv*ex.xv,'#c8a44a',5,'p('+ex.xv+')');
    } else {
      Renderer.plotFunction(function(x){return x*x-x;},'#5a8fd2',1.5);
    }
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Polinômios'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Polinômios e Fatoração</h1>'+
          '<p class="topic-meta">grau · avaliação · raízes · fatoração · produtos notáveis</p>'+
          '<div class="content-block">'+
            '<p>Um polinômio de grau n é uma expressão p(x) = aₙxⁿ + ... + a₁x + a₀, com aₙ ≠ 0. O valor de p em x=c é obtido por substituição direta.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Raízes (zeros)</div>'+
              'São os valores de x onde p(x) = 0.<br>'+
              'Todo polinômio de grau n tem exatamente n raízes (em ℂ).<br>'+
              'Para grau 2: use Bhaskara. p(x) = a(x−r₁)(x−r₂).'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Produtos notáveis</div>'+
              '(a+b)² = a² + 2ab + b²<br>'+
              '(a−b)² = a² − 2ab + b²<br>'+
              '(a+b)(a−b) = a² − b²'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Teorema do Resto</div>'+
              'p(c) = resto da divisão de p(x) por (x−c).'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/polynomials/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">p(x) = x² − x − 6</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    Renderer.clear();Renderer.drawAxes(true,true);
    Renderer.plotFunction(function(x){return x*x-x-6;},'#5a8fd2',2);
    Renderer.drawPoint(3,0,'#c8a44a',5,'r=3');
    Renderer.drawPoint(-2,0,'#c8a44a',5,'r=−2');
  }

  var _exSteps=[
    {equation:'p(x) = x² − x − 6',          note:'polinômio dado'},
    {equation:'Δ = (-1)² − 4×1×(-6)',        note:'calcular discriminante'},
    {equation:'Δ = 1 + 24 = 25',             note:'Δ > 0: duas raízes reais'},
    {equation:'x = (1 ± 5) / 2',             note:'Bhaskara: x = (-b ± √Δ) / 2a'},
    {equation:'x₁ = 3  |  x₂ = -2',         note:'raízes'},
    {equation:'p(x) = (x − 3)(x + 2)',       note:'forma fatorada'},
    {equation:'verificar: (3−3)(3+2) = 0 ✓', note:'confirmação'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Polinômios',href:'topic/polynomials/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">p(x) = x² − x − 6  ·  raízes e fatoração</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Poly.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Poly.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">x² − x − 6</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    Renderer.clear();Renderer.drawAxes(true,true);
    Renderer.plotFunction(function(x){return x*x-x-6;},'#5a8fd2',2);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Partimos de: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/polynomials/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Poly.nextStep();};}}
    if(i>=4){Renderer.drawPoint(3,0,'#c8a44a',5,'r=3');Renderer.drawPoint(-2,0,'#c8a44a',5,'r=−2');}
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Polinômios',href:'topic/polynomials/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Poly.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">polinômio</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();_drawPoly(_pr.exercise);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt=(ex.polyType==='factor')?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: (x - 3)(x + 2)</p>':
            (ex.polyType==='expand')?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: x² + 5x + 6</p>':'';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Poly.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Poly.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Poly.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Poly.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/polynomials/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_pr.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Poly=_pub;
})();
