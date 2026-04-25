/**
 * modules/mmc_mdc.js
 * MMC e MDC — Mínimo Múltiplo Comum e Máximo Divisor Comum.
 * Canvas: crivo de múltiplos destacados.
 */
(function () {
  var TOPIC_ID = 'mmc_mdc';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawGrid(a,b){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var limit=Math.max(a,b)*6,cols=12,rows=Math.ceil(limit/cols);
    var cw=Math.floor((W-24)/cols),ch=Math.min(32,Math.floor((H-50)/rows));
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Múltiplos de '+a+' (azul) e '+b+' (dourado)',W/2,18);
    for(var i=0;i<rows*cols;i++){
      var v=i+1;if(v>limit)break;
      var isA=v%a===0,isB=v%b===0;
      var col=i%cols,row=Math.floor(i/cols);
      var x=12+col*cw,y=28+row*ch;
      ctx.fillStyle=isA&&isB?'rgba(200,164,74,0.75)':isA?'rgba(90,143,210,0.45)':isB?'rgba(74,184,178,0.35)':'transparent';
      if(isA||isB){ctx.fillRect(x,y,cw-2,ch-2);ctx.strokeStyle=isA&&isB?'#c8a44a':isA?'#5a8fd2':'#4ab8b2';ctx.lineWidth=1;ctx.strokeRect(x,y,cw-2,ch-2);}
      ctx.fillStyle=isA||isB?'#e8e8f2':'#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v,x+cw/2,y+ch/2+4);
    }
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';ctx.fillText('azul=múlt.'+a,10,H-18);
    ctx.fillStyle='#4ab8b2';ctx.fillText('verde=múlt.'+b,10+90,H-18);
    ctx.fillStyle='#c8a44a';ctx.fillText('dourado=ambos=MMC',10+180,H-18);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'MMC e MDC'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">MMC e MDC</h1>'+
          '<p class="topic-meta">Mínimo Múltiplo Comum · Máximo Divisor Comum · Algoritmo de Euclides</p>'+
          '<div class="content-block">'+
            '<p>MDC e MMC são ferramentas fundamentais para simplificar frações, encontrar denominadores comuns e resolver problemas de divisão periódica.</p>'+
            '<div class="concept-highlight"><div class="hl-label">MDC — Algoritmo de Euclides</div>'+
              'MDC(a,b) = MDC(b, a mod b), repita até resto = 0.<br>'+
              'Ex: MDC(48,18) → MDC(18,12) → MDC(12,6) → MDC(6,0) = 6'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">MMC a partir do MDC</div>'+
              'MMC(a,b) = |a×b| / MDC(a,b)<br>'+
              'Ex: MMC(4,6) = 24 / MDC(4,6) = 24/2 = 12'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Para 3 ou mais números</div>'+
              'MDC(a,b,c) = MDC(MDC(a,b), c)<br>'+
              'MMC(a,b,c) = MMC(MMC(a,b), c)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Mmc.showGrid(4,6)">MMC(4,6)</div>'+
            '<div class="phase-step" onclick="Mmc.showGrid(3,8)">MMC(3,8)</div>'+
            '<div class="phase-step" onclick="Mmc.showGrid(6,9)">MMC(6,9)</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/mmc_mdc/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawGrid(4,6);
  }

  var _exSteps=[
    {equation:'Calcule MDC(48, 18) e MMC(48, 18)',note:'problema'},
    {equation:'48 = 18×2 + 12',note:'passo 1 — Algoritmo de Euclides'},
    {equation:'18 = 12×1 + 6',note:'passo 2'},
    {equation:'12 = 6×2 + 0',note:'passo 3 — resto 0, parar'},
    {equation:'MDC(48,18) = 6',note:'último divisor não nulo'},
    {equation:'MMC(48,18) = 48×18 / 6 = 864 / 6',note:'fórmula MMC×MDC = a×b'},
    {equation:'MMC(48,18) = 144',note:'resultado'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'MMC e MDC',href:'topic/mmc_mdc/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: MDC(48,18) e MMC(48,18)</h1>'+
          '<p class="topic-meta">Algoritmo de Euclides passo a passo</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Mmc.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Mmc.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawGrid(6,8);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Calcular: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/mmc_mdc/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Mmc.nextStep();};}}
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'MMC e MDC',href:'topic/mmc_mdc/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Mmc.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var p=document.getElementById('canvas-panel');if(p){_mc(p,420,380);_drawGrid(4,6);}
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="número inteiro" autocomplete="off" style="max-width:160px"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Mmc.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Mmc.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Mmc.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Mmc.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showGrid:function(a,b){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawGrid(a,b);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/mmc_mdc/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var ok=inp.value.trim()===String(_pr.exercise.answer);
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
  window.Mmc=_pub;
})();
