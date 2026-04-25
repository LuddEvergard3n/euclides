/**
 * modules/integers.js
 * Números Inteiros e Divisibilidade.
 * Canvas: reta numérica com inteiros negativos e módulo destacado.
 */
(function () {
  var TOPIC_ID = 'integers';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawIntLine(highlight){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cy=H/2,padH=30,len=W-2*padH;
    var lo=-8,hi=8,range=hi-lo;
    function tx(v){return padH+len*(v-lo)/range;}
    // Shade |highlight| if given
    if(highlight!==undefined&&highlight!==null){
      var x0=tx(0),x1=tx(highlight);
      ctx.fillStyle='rgba(200,164,74,0.15)';
      ctx.fillRect(Math.min(x0,x1),cy-14,Math.abs(x1-x0),28);
    }
    // Axis
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(padH,cy);ctx.lineTo(W-padH,cy);ctx.stroke();
    // Arrows
    ctx.beginPath();ctx.moveTo(W-padH,cy);ctx.lineTo(W-padH-10,cy-5);ctx.lineTo(W-padH-10,cy+5);ctx.closePath();ctx.fillStyle='#2e2e4a';ctx.fill();
    ctx.beginPath();ctx.moveTo(padH,cy);ctx.lineTo(padH+10,cy-5);ctx.lineTo(padH+10,cy+5);ctx.closePath();ctx.fill();
    for(var v=lo;v<=hi;v++){
      var px=tx(v);
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,cy-7);ctx.lineTo(px,cy+7);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v,px,cy+20);
    }
    if(highlight!==undefined&&highlight!==null){
      var px=tx(highlight);
      ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(px,cy,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#c8a44a';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText('|'+highlight+'|='+Math.abs(highlight),px,cy-18);
    }
  }

  function _initCanvas(){_drawIntLine(-5);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inteiros e Divisibilidade'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Números Inteiros e Divisibilidade</h1>'+
          '<p class="topic-meta">valor absoluto · divisibilidade · números primos · critérios</p>'+
          '<div class="content-block">'+
            '<p>Os inteiros incluem positivos, negativos e zero. Divisibilidade descreve quando um número divide outro sem resto.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Valor absoluto</div>'+
              '|x| = distância de x até 0 na reta numérica.<br>'+
              '|x| = x se x≥0  |  |x| = −x se x&lt;0<br>'+
              'Propriedade: |a×b| = |a|×|b|'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Critérios de divisibilidade</div>'+
              'Por 2: último dígito par<br>'+
              'Por 3: soma dos dígitos divisível por 3<br>'+
              'Por 5: termina em 0 ou 5<br>'+
              'Por 9: soma dos dígitos divisível por 9'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Números primos</div>'+
              'Primo: divisível apenas por 1 e por si mesmo.<br>'+
              '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...<br>'+
              'Todo inteiro >1 tem fatoração única em primos (TFA).'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Int.showVal(-5)">|−5|</div>'+
            '<div class="phase-step" onclick="Int.showVal(3)">|3|</div>'+
            '<div class="phase-step" onclick="Int.showVal(-8)">|−8|</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/integers/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Determine se 252 é divisível por 2, 3 e 9.',note:'problema de divisibilidade'},
    {equation:'Por 2: último dígito = 2 (par) → SIM',note:'critério do 2'},
    {equation:'Por 3: 2+5+2 = 9 → divisível por 3 → SIM',note:'critério do 3 — soma dos dígitos'},
    {equation:'Por 9: soma = 9 → divisível por 9 → SIM',note:'critério do 9'},
    {equation:'252 = 2² × 3² × 7',note:'fatoração em primos'},
    {equation:'|−7| = 7  e  |12| = 12  e  |0| = 0',note:'exemplos de valor absoluto'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inteiros',href:'topic/integers/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: divisibilidade de 252</h1>'+
          '<p class="topic-meta">critérios e fatoração em primos</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Int.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Int.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Verificar: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/integers/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Int.nextStep();};}}
    if(i===5)_drawIntLine(-7);else _initCanvas();
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inteiros',href:'topic/integers/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Int.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    if(ex.intType==='abs')_drawIntLine(null);else _initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isBool=ex.intType==='div'||ex.intType==='prime';
    var fmt=isBool?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Responda: Sim ou Não</p>':'';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Int.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Int.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Int.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Int.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showVal:function(v){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var tabs=document.querySelectorAll('.phase-step');tabs.forEach(function(t,i){t.classList.toggle('active',[-5,3,-8][i]===v);});_drawIntLine(v);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/integers/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
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
  window.Int=_pub;
})();
