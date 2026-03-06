/**
 * modules/conics.js
 * Cônicas — parábola, elipse, hipérbole, circunferência.
 * Canvas: plotagem das curvas no plano cartesiano.
 */
(function () {
  var TOPIC_ID = 'conics';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawConic(type){
    Renderer.clear();Renderer.drawAxes(true,true);
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    if(type==='parabola'){
      Renderer.plotFunction(function(x){return x*x/2;},'#c8a44a',2);
      ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('y = x²/2  (parábola)',W/2,22);
    }else if(type==='ellipse'){
      Renderer.plotFunction(function(x){return Math.abs(x)<=3?2*Math.sqrt(Math.max(0,1-x*x/9)):NaN;},'#4ab8b2',2);
      Renderer.plotFunction(function(x){return Math.abs(x)<=3?-2*Math.sqrt(Math.max(0,1-x*x/9)):NaN;},'#4ab8b2',2);
      ctx.fillStyle='#4ab8b2';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('x²/9 + y²/4 = 1  (elipse)',W/2,22);
    }else if(type==='hyperbola'){
      Renderer.plotFunction(function(x){return Math.abs(x)>=2?1.5*Math.sqrt(Math.max(0,x*x/4-1)):NaN;},'#c87272',2);
      Renderer.plotFunction(function(x){return Math.abs(x)>=2?-1.5*Math.sqrt(Math.max(0,x*x/4-1)):NaN;},'#c87272',2);
      ctx.strokeStyle='rgba(200,100,100,0.3)';ctx.lineWidth=1;ctx.setLineDash([5,3]);
      Renderer.plotFunction(function(x){return 0.75*x;},'#c87272',0.6);
      Renderer.plotFunction(function(x){return -0.75*x;},'#c87272',0.6);
      ctx.setLineDash([]);
      ctx.fillStyle='#c87272';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('x²/4 − y²/(9/4) = 1  (hipérbole)',W/2,22);
    }else{
      Renderer.plotFunction(function(x){return Math.sqrt(Math.max(0,16-x*x));},'#5a8fd2',2);
      Renderer.plotFunction(function(x){return -Math.sqrt(Math.max(0,16-x*x));},'#5a8fd2',2);
      ctx.fillStyle='#5a8fd2';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('x² + y² = 16  (circunferência r=4)',W/2,22);
    }
  }
  function _initCanvas(){_drawConic('ellipse');}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cônicas'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Cônicas</h1>'+
          '<p class="topic-meta">parábola · elipse · hipérbole · identificação de cônicas</p>'+
          '<div class="content-block">'+
            '<p>Cônicas são curvas formadas pela interseção de um cone com um plano. Cada tipo tem propriedades reflexivas com aplicações em física, astronomia e engenharia.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Parábola</div>'+
              'y = a(x−h)² + k  — vértice (h,k), eixo x=h.<br>'+
              'Forma canônica: x² = 4py  (foco em (0,p))'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Elipse</div>'+
              'x²/a² + y²/b² = 1  (a &gt; b &gt; 0)<br>'+
              'Focos em (±c,0) com c²=a²−b². Soma dist. focos = 2a.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Hipérbole</div>'+
              'x²/a² − y²/b² = 1  — vértices (±a,0).<br>'+
              'Assíntotas: y=±(b/a)x. Diferença dist. focos = 2a.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Identificação rápida</div>'+
              'Ambos + e iguais → circunferência<br>'+
              'Ambos + e diferentes → elipse<br>'+
              'Sinais opostos → hipérbole<br>'+
              'Só um quadrático → parábola'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step" onclick="Conic.showConic(\'parabola\')">Parábola</div>'+
            '<div class="phase-step active" onclick="Conic.showConic(\'ellipse\')">Elipse</div>'+
            '<div class="phase-step" onclick="Conic.showConic(\'hyperbola\')">Hipérbole</div>'+
            '<div class="phase-step" onclick="Conic.showConic(\'circle\')">Circunf.</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/conics/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Identificar: x²/9 + y²/4 = 1',note:'problema'},
    {equation:'Forma x²/a² + y²/b² = 1 com ambos + → ELIPSE',note:'ambos os termos positivos'},
    {equation:'a² = 9 → a = 3  |  b² = 4 → b = 2',note:'semi-eixos'},
    {equation:'c² = a² − b² = 9 − 4 = 5 → c = √5',note:'distância focal'},
    {equation:'Focos em (±√5, 0) ≈ (±2,24, 0)',note:'posição dos focos'},
    {equation:'Semi-eixo maior = 3 (eixo x)  |  menor = 2 (eixo y)',note:'orientação da elipse'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cônicas',href:'topic/conics/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">x²/9 + y²/4 = 1 — identificação e elementos da elipse</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Conic.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Conic.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawConic('ellipse');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Analisar: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/conics/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Conic.nextStep();};}}
    _drawConic('ellipse');Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Cônicas',href:'topic/conics/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Conic.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise,p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
    var typeMap={parabola:'parabola',focus:'parabola',ellipse:'ellipse',hyperbola:'hyperbola',circle:'circle',identify:'ellipse'};
    _drawConic(typeMap[ex.conicType]||'ellipse');
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Conic.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Conic.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Conic.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Conic.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showConic:function(type){
      var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var types=['parabola','ellipse','hyperbola','circle'];
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===types.indexOf(type));});
      _drawConic(type);
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/conics/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(/\s+/g,''),c=String(_pr.exercise.answer).replace(/\s+/g,'');
      var ok=s===c||s.toLowerCase()===c.toLowerCase();
      if(!ok){var sn=parseFloat(s),cn=parseFloat(c);if(!isNaN(sn)&&!isNaN(cn))ok=Math.abs(sn-cn)<=0.05;}
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Conic=_pub;
})();
