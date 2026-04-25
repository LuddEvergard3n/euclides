/**
 * modules/systems.js
 * Sistemas de equações lineares 2×2 — substituição e eliminação.
 * Canvas: duas retas no plano cartesiano, ponto de interseção destacado.
 */
(function () {
  var TOPIC_ID = 'systems';

  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas ────────────────────────────────────────────────────────
  function _drawSystem(a1,b1,c1,a2,b2,c2,x0,y0){
    Renderer.clear();Renderer.drawAxes(true,true);
    // f1: a1*x + b1*y = c1  →  y = (c1 - a1*x)/b1
    if(b1!==0) Renderer.plotFunction(function(x){return(c1-a1*x)/b1;},'#5a8fd2',2);
    if(b2!==0) Renderer.plotFunction(function(x){return(c2-a2*x)/b2;},'#4ab8b2',2);
    if(x0!==undefined&&y0!==undefined&&Math.abs(x0)<13&&Math.abs(y0)<13)
      Renderer.drawPoint(x0,y0,'#c8a44a',6,'('+x0+','+y0+')');
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas de Equações'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Sistemas de Equações</h1>'+
          '<p class="topic-meta">substituição · eliminação · interpretação geométrica</p>'+
          '<div class="content-block">'+
            '<p>Um sistema de equações lineares busca valores que satisfaçam todas as equações simultaneamente. Geometricamente, cada equação 2D é uma reta — a solução é o ponto de interseção.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Método da substituição</div>'+
              '1. Isole uma variável em uma das equações.<br>'+
              '2. Substitua na outra equação.<br>'+
              '3. Resolva e substitua de volta para encontrar a segunda variável.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Método da eliminação (adição)</div>'+
              '1. Multiplique as equações para que um coeficiente se cancele.<br>'+
              '2. Some as equações para eliminar uma variável.<br>'+
              '3. Resolva e substitua para encontrar a outra.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Classificação</div>'+
              'Sistema possível determinado (SPD): uma solução — retas se cruzam.<br>'+
              'Sistema possível indeterminado (SPI): infinitas soluções — retas coincidentes.<br>'+
              'Sistema impossível (SI): sem solução — retas paralelas.'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/systems/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">interseção das retas</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawSystem(1,1,4, 1,-1,2, 3,1);
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────
  var _exSteps=[
    {equation:'2x + y = 7  |  x − y = 2',          note:'sistema dado'},
    {equation:'y = 7 − 2x',                          note:'isolar y na 1ª equação'},
    {equation:'x − (7 − 2x) = 2',                   note:'substituir na 2ª'},
    {equation:'3x − 7 = 2  →  3x = 9',              note:'simplificar'},
    {equation:'x = 3',                               note:'solução de x'},
    {equation:'y = 7 − 2×3 = 1',                    note:'substituir para encontrar y'},
    {equation:'solução: (x=3, y=1)',                 note:'verificar: 6+1=7 ✓  3−1=2 ✓'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas',href:'topic/systems/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">2x + y = 7  e  x − y = 2  ·  substituição</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Sys.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Sys.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">2x+y=7 e x−y=2</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawSystem(2,1,7, 1,-1,2, 3,1);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Sistema: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/systems/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Sys.nextStep();};}}
    Renderer.drawEquationSteps(_exSteps,i);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas',href:'topic/systems/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Sys.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">interseção</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    _drawSystem(ex.a1,ex.b1,ex.c1,ex.a2,ex.b2,ex.c2,ex.x0,ex.y0);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: x=3, y=1</p>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="x=?, y=?" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Sys.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Sys.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Sys.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Sys.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/systems/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_pr.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
        var ex=_pr.exercise;_drawSystem(ex.a1,ex.b1,ex.c1,ex.a2,ex.b2,ex.c2,ex.x0,ex.y0);
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Use o formato x=?, y=?';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Sys=_pub;
})();
