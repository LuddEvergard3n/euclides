/**
 * modules/rationals.js
 * Números Racionais — teoria formal, ℚ, reta numérica, negativos, densidade.
 * Canvas: reta numérica com ℚ e negativos marcados.
 */
(function () {
  var TOPIC_ID = 'rationals';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawNumberLine(highlights) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cy=H/2,pad=30,len=W-2*pad,lo=-4,hi=4,range=hi-lo;
    function tx(v){return pad+len*(v-lo)/range;}
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad,cy);ctx.stroke();
    // Arrow
    ctx.beginPath();ctx.moveTo(W-pad,cy);ctx.lineTo(W-pad-10,cy-5);ctx.lineTo(W-pad-10,cy+5);ctx.closePath();ctx.fillStyle='#2e2e4a';ctx.fill();
    for(var v=lo;v<=hi;v++){
      var px=tx(v);
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,cy-8);ctx.lineTo(px,cy+8);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v,px,cy+22);
    }
    // Rational fractions between integers
    var fracs=[[-3,2],[1,2],[1,3],[2,3],[-1,4],[3,4]];
    fracs.forEach(function(f){
      var v=f[0]/f[1],px=tx(v);
      ctx.fillStyle='rgba(90,143,210,0.6)';ctx.beginPath();ctx.arc(px,cy,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#5a8fd2';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(f[0]+'/'+f[1],px,cy-12);
    });
    if(highlights){highlights.forEach(function(h){
      var px=tx(h.v);
      ctx.fillStyle=h.color||'#c8a44a';ctx.beginPath();ctx.arc(px,cy,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=h.color||'#c8a44a';ctx.font='bold 10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(h.label,px,cy-20);
    });}
  }
  function _initCanvas(){_drawNumberLine(null);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Números Racionais'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Números Racionais</h1>'+
      '<p class="topic-meta">conjunto ℚ · reta numérica · negativos · densidade · decimais periódicos</p>'+
      '<div class="content-block">'+
        '<p>Os racionais (ℚ) são todos os números expressáveis como p/q com p∈ℤ e q∈ℤ*. Incluem inteiros, frações e decimais periódicos.</p>'+
        '<div class="concept-highlight"><div class="hl-label">Hierarquia dos conjuntos</div>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ<br>ℕ: naturais (0,1,2,...) | ℤ: inteiros (...,-2,-1,0,1,...)<br>ℚ: racionais = p/q | ℝ: todos os reais</div>'+
        '<div class="concept-highlight"><div class="hl-label">Representação decimal</div>Racional → decimal finito ou periódico.<br>1/4 = 0,25 (finito) | 1/3 = 0,333... (periódico simples)<br>1/7 = 0,142857... (periódico composto)</div>'+
        '<div class="concept-highlight"><div class="hl-label">Densidade de ℚ</div>Entre dois racionais quaisquer há sempre outro racional.<br>A média (a+b)/2 é sempre um racional entre a e b.</div>'+
        '<div class="concept-highlight"><div class="hl-label">Operações com negativos</div>(−)×(−) = + | (−)×(+) = − | (−)+(−) = soma negativa<br>|x| = distância até 0 na reta numérica</div>'+
      '</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/rationals/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Onde está −3/4 na reta numérica?',note:'localizar racional negativo'},
    {equation:'−3/4 = −0,75 → entre −1 e 0, mais perto de −1',note:'converter para decimal'},
    {equation:'Entre −1 e −3/4, cite um racional.',note:'densidade de ℚ'},
    {equation:'Média: (−1 + −3/4)/2 = −7/8',note:'a média sempre funciona'},
    {equation:'1/3 em decimal: 1 ÷ 3 = 0,333... (periódico)',note:'representação decimal'},
    {equation:'0,333... = 3/10 + 3/100 + ... = 1/3 ✓',note:'verificação'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Racionais',href:'topic/rationals/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: −3/4 na reta e densidade de ℚ</h1>'+
      '<p class="topic-meta">localização, decimal periódico</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Rat.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Rat.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawNumberLine([{v:-0.75,label:'-3/4',color:'#c8a44a'}]);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    var s=_exSteps[i];
    document.getElementById('step-desc').innerHTML=i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'<span class="text-mono text-gold">'+s.equation+'</span>';
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/rationals/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Rat.nextStep();};}}
    _drawNumberLine([{v:-0.75,label:'-3/4'},{v:-0.875,label:'-7/8',color:'#4ab8b2'}]);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Racionais',href:'topic/rationals/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Rat.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
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
    area.innerHTML='<div class="exercise-card">'+
      '<p class="exercise-statement">'+ex.statement+'</p>'+
      '<div class="exercise-equation">'+ex.equation+'</div>'+
      '<div class="answer-row"><span class="answer-label">= </span>'+
      '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
      '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
      '<div class="btn-row"><button class="btn btn-primary" onclick="Rat.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Rat.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Rat.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Rat.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/rationals/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s.replace(',','.')),cn=parseFloat(c.replace(',','.'));
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
  window.Rat=_pub;
})();
