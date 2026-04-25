/**
 * modules/factoring.js
 * Produtos Notáveis e Fatoração.
 * Canvas: representação geométrica (a+b)² como área.
 */
(function () {
  var TOPIC_ID = 'factoring';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAreaModel(a,b){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var total=a+b,pad=50,size=Math.min(W,H)-2*pad;
    var ax=size*a/total,bx=size*b/total;
    var x0=pad,y0=pad;
    // (a+b)² = a² + 2ab + b²
    var regions=[
      {x:x0,y:y0,w:ax,h:ax,color:'rgba(90,143,210,0.5)',label:'a²'},
      {x:x0+ax,y:y0,w:bx,h:ax,color:'rgba(200,164,74,0.35)',label:'ab'},
      {x:x0,y:y0+ax,w:ax,h:bx,color:'rgba(200,164,74,0.35)',label:'ab'},
      {x:x0+ax,y:y0+ax,w:bx,h:bx,color:'rgba(74,184,178,0.5)',label:'b²'},
    ];
    regions.forEach(function(r){
      ctx.fillStyle=r.color;ctx.fillRect(r.x,r.y,r.w,r.h);
      ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;ctx.strokeRect(r.x,r.y,r.w,r.h);
      ctx.fillStyle='#e8e8f2';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';
      if(r.w>20&&r.h>14)ctx.fillText(r.label,r.x+r.w/2,r.y+r.h/2+4);
    });
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('a',x0+ax/2,y0-8);ctx.fillText('b',x0+ax+bx/2,y0-8);
    ctx.textAlign='right';
    ctx.fillText('a',x0-6,y0+ax/2+4);ctx.fillText('b',x0-6,y0+ax+bx/2+4);
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('('+a+'+'+b+')² = '+a+'² + 2×'+a+'×'+b+' + '+b+'² = '+(a*a+2*a*b+b*b),W/2,H-8);
  }

  function _initCanvas(){_drawAreaModel(3,2);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Produtos Notáveis'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Produtos Notáveis e Fatoração</h1>'+
          '<p class="topic-meta">(a±b)² · diferença de quadrados · fatoração de trinômios</p>'+
          '<div class="content-block">'+
            '<p>Produtos notáveis são expansões com padrão fixo. Reconhecê-los permite fatorar expressões sem divisão longa.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Quadrado da soma e da diferença</div>'+
              '(a+b)² = a² + 2ab + b²<br>'+
              '(a−b)² = a² − 2ab + b²'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Diferença de quadrados</div>'+
              '(a+b)(a−b) = a² − b²<br>'+
              'Ex: x² − 9 = (x+3)(x−3)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Fatoração de trinômio</div>'+
              'x² + bx + c = (x+r₁)(x+r₂)<br>'+
              'onde r₁+r₂ = b  e  r₁×r₂ = c'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Fator comum</div>'+
              'ka + kb = k(a+b)  — retire o MDC.'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Fact.showModel(3,2)">(3+2)²</div>'+
            '<div class="phase-step" onclick="Fact.showModel(4,1)">(4+1)²</div>'+
            '<div class="phase-step" onclick="Fact.showModel(2,3)">(2+3)²</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/factoring/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Fatore completamente: 2x² − 8',note:'problema'},
    {equation:'MDC(2x², 8) = 2 → retire o fator comum',note:'passo 1 — fator comum'},
    {equation:'2(x² − 4)',note:'após retirar o fator 2'},
    {equation:'x² − 4 = x² − 2²',note:'reconhecer diferença de quadrados'},
    {equation:'= (x+2)(x−2)',note:'a² − b² = (a+b)(a−b)'},
    {equation:'2x² − 8 = 2(x+2)(x−2)',note:'resultado final completo'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Produtos Notáveis',href:'topic/factoring/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: fatorar 2x² − 8</h1>'+
          '<p class="topic-meta">fator comum + diferença de quadrados</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Fact.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Fact.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Fatorar: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/factoring/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Fact.nextStep();};}}
    _initCanvas();Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Produtos Notáveis',href:'topic/factoring/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Fact.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isExpand=ex.factType==='expand_sq';
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: '+
      (isExpand?'4x² + 12x + 9':'(x+3)(x−3) ou 2(x+1)')+
      '</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Fact.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Fact.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Fact.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Fact.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  function _norm(s){return s.replace(/\s+/g,'').replace(/×/g,'*').replace(/−/g,'-');}
  var _pub={
    showModel:function(a,b){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var vals=[[3,2],[4,1],[2,3]];
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',vals[i][0]===a&&vals[i][1]===b);});
      _drawAreaModel(a,b);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/factoring/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=_norm(inp.value.trim()),c=_norm(String(_pr.exercise.answer));
      var ok=s===c;
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Use o formato exato: (x+3)(x−5)';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Fact=_pub;
})();
