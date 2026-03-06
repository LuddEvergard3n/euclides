/**
 * modules/logarithms.js
 * Logaritmos — definição, propriedades, mudança de base, ln, equações logarítmicas.
 * Canvas: curva log₂(x) e 2^x como funções inversas.
 */
(function () {
  var TOPIC_ID = 'logarithms';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _initCanvas(){
    Renderer.clear();Renderer.drawAxes(true,true);
    Renderer.plotFunction(function(x){return x>0?Math.log(x)/Math.log(2):NaN;},'#c8a44a',2);
    Renderer.plotFunction(function(x){return Math.pow(2,x);},'#5a8fd2',2);
    // y=x reference
    var ctx=Renderer.ctx();
    ctx.strokeStyle='rgba(62,62,88,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    Renderer.plotFunction(function(x){return x;},'#3e3e58',0.8);
    ctx.setLineDash([]);
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('y = log₂(x)',8,28);
    ctx.fillStyle='#5a8fd2';ctx.fillText('y = 2^x',8,42);
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('funções inversas — simétricas em y = x',Renderer.width()/2,Renderer.height()-6);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Logaritmos'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Logaritmos</h1>'+
          '<p class="topic-meta">definição · propriedades · mudança de base · ln · equações</p>'+
          '<div class="content-block">'+
            '<p>log_b(x) = e significa b^e = x. O logaritmo responde: "a que expoente elevar b para obter x?"</p>'+
            '<div class="concept-highlight"><div class="hl-label">Definição e casos especiais</div>'+
              'log_b(b) = 1  |  log_b(1) = 0  |  log_b(b^n) = n<br>'+
              'log₁₀ = log (comum)  |  log_e = ln (natural, e ≈ 2,718)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Propriedades operatórias</div>'+
              'log(A×B) = log A + log B<br>'+
              'log(A/B) = log A − log B<br>'+
              'log(Aⁿ) = n × log A'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Mudança de base</div>'+
              'log_a(x) = log(x)/log(a) = ln(x)/ln(a)<br>'+
              'Permite calcular qualquer base com calculadora (base 10 ou e).'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/logarithms/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Calcule log₂(32)',note:'problema — definição'},
    {equation:'log₂(32) = e ↔ 2^e = 32',note:'converter para exponencial'},
    {equation:'2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32',note:'potências de 2'},
    {equation:'log₂(32) = 5',note:'resposta'},
    {equation:'Propriedade: log(1000 × 0,001) = ?',note:'novo exercício — produto'},
    {equation:'= log(1000) + log(0,001) = 3 + (−3)',note:'log(A×B) = log A + log B'},
    {equation:'= 0  (log(1) = 0 pois 10⁰ = 1)',note:'verificação: 1000×0,001=1'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Logaritmos',href:'topic/logarithms/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">definição e propriedades dos logaritmos</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Log.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Log.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Calcular: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/logarithms/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Log.nextStep();};}}
    _initCanvas();Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Logaritmos',href:'topic/logarithms/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Log.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var p=document.getElementById('canvas-panel');if(p){_mc(p,420,380);_initCanvas();}
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="número" autocomplete="off" style="max-width:160px"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Log.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Log.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Log.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Log.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/logarithms/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+c;
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
  window.Log=_pub;
})();
