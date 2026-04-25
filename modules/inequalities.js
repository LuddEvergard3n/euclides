/**
 * modules/inequalities.js
 * Inequações — 1º grau, 2º grau, sistemas.
 * Canvas: reta numérica com conjunto solução destacado.
 */
(function () {
  var TOPIC_ID = 'inequalities';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawNumberLine(lo,hi,openLo,openHi,mode){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var padH=50,cy=H/2,len=W-2*padH;
    var finLo=isFinite(lo)?lo:hi-4,finHi=isFinite(hi)?hi:lo+4;
    var minV=Math.min(finLo,finHi)-2,maxV=Math.max(finLo,finHi)+2;
    function tx(v){return padH+len*(v-minV)/(maxV-minV);}
    // Shade
    ctx.fillStyle='rgba(90,143,210,0.18)';
    if(mode==='lt')ctx.fillRect(padH,cy-14,tx(hi)-padH,28);
    else if(mode==='gt')ctx.fillRect(tx(lo),cy-14,W-padH-tx(lo),28);
    else if(mode==='between')ctx.fillRect(tx(lo),cy-14,tx(hi)-tx(lo),28);
    else if(mode==='outside'){ctx.fillRect(padH,cy-14,tx(lo)-padH,28);ctx.fillRect(tx(hi),cy-14,W-padH-tx(hi),28);}
    // Axis
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(padH,cy);ctx.lineTo(W-padH,cy);ctx.stroke();
    for(var v=Math.ceil(minV);v<=Math.floor(maxV);v++){
      var px=tx(v);
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,cy-6);ctx.lineTo(px,cy+6);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v,px,cy+20);
    }
    // Endpoints
    [[lo,openLo],[hi,openHi]].forEach(function(pair){
      var v=pair[0],open=pair[1];if(!isFinite(v))return;
      var px=tx(v);
      ctx.lineWidth=2;ctx.strokeStyle='#c8a44a';
      ctx.beginPath();ctx.arc(px,cy,7,0,Math.PI*2);ctx.stroke();
      if(!open){ctx.fillStyle='#c8a44a';ctx.fill();}else{ctx.fillStyle='#0f0f1a';ctx.fill();ctx.strokeStyle='#c8a44a';ctx.stroke();}
    });
  }

  function _initCanvas(){_drawNumberLine(-2,3,true,false,'between');}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inequações'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Inequações</h1>'+
          '<p class="topic-meta">1º grau · 2º grau · sistemas · notação de intervalo</p>'+
          '<div class="content-block">'+
            '<p>Uma inequação define um conjunto de soluções — um intervalo — em vez de um valor único. O passo crítico é saber quando inverter o sinal.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Inequação do 1º grau</div>'+
              'ax + b &gt; c → x &gt; (c−b)/a  (se a &gt; 0)<br>'+
              'REGRA: ao multiplicar ou dividir por negativo, o sinal INVERTE.<br>'+
              'Ex: −2x &gt; 4 → x &lt; −2'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Inequação do 2º grau (a &gt; 0)</div>'+
              'ax²+bx+c &gt; 0 e raízes x₁ &lt; x₂:<br>'+
              '&gt; 0: x &lt; x₁ ou x &gt; x₂  (fora das raízes)<br>'+
              '&lt; 0: x₁ &lt; x &lt; x₂  (entre as raízes)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Notação de intervalo</div>'+
              '( ) aberto (excluído)  |  [ ] fechado (incluído)<br>'+
              'x &gt; 2 → (2,+∞)  |  x ≤ 5 → (−∞,5]  |  −1 &lt; x ≤ 3 → (−1,3]'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Ineq.showExample(\'between\')">Entre raízes</div>'+
            '<div class="phase-step" onclick="Ineq.showExample(\'outside\')">Fora das raízes</div>'+
            '<div class="phase-step" onclick="Ineq.showExample(\'gt\')">1º grau (&gt;)</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/inequalities/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Resolva: 2x − 3 > 1',note:'inequação 1º grau'},
    {equation:'2x > 1 + 3 = 4',note:'somar 3 dos dois lados'},
    {equation:'x > 2  (a=2>0: sinal mantém)',note:'dividir por 2'},
    {equation:'Solução: x ∈ (2, +∞)',note:'notação de intervalo'},
    {equation:'Agora: x² − x − 6 < 0',note:'inequação 2º grau'},
    {equation:'Raízes: x=3 e x=−2 (Bhaskara ou fatoração)',note:'(x−3)(x+2)=0'},
    {equation:'a=1>0 e < 0 → solução entre as raízes: −2 < x < 3',note:'conjunto solução'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inequações',href:'topic/inequalities/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">1º grau e 2º grau passo a passo</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Ineq.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Ineq.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawNumberLine(2,Infinity,true,false,'gt');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Resolver: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/inequalities/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Ineq.nextStep();};}}
    if(i<=3)_drawNumberLine(2,Infinity,true,false,'gt');
    else _drawNumberLine(-2,3,true,true,'between');
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Inequações',href:'topic/inequalities/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Ineq.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var ex=_pr.exercise,p=document.getElementById('canvas-panel');
    if(!p)return;_mc(p,420,380);
    if(ex.ineqType==='ineq2'&&ex.r1!==undefined){
      var lo=Math.min(ex.r1,ex.r2),hi=Math.max(ex.r1,ex.r2);
      if(ex.answer.indexOf('ou')>=0)_drawNumberLine(lo,hi,true,true,'outside');
      else _drawNumberLine(lo,hi,true,true,'between');
    }else _initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: x &gt; 2  ou  −1 &lt; x &lt; 3  ou  x &lt; −2 ou x &gt; 5</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="x > ... ou intervalo" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Ineq.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Ineq.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Ineq.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Ineq.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  // Normalize inequality string for comparison
  function _normIneq(s){return s.replace(/\s+/g,'').replace(/<=|≤/g,'<=').replace(/>=|≥/g,'>=');}
  var _pub={
    showExample:function(mode){
      var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var tabs=document.querySelectorAll('.phase-step');
      var idx={between:0,outside:1,gt:2}[mode]||0;
      tabs.forEach(function(t,i){t.classList.toggle('active',i===idx);});
      if(mode==='between')_drawNumberLine(-2,3,true,true,'between');
      else if(mode==='outside')_drawNumberLine(-2,3,true,true,'outside');
      else _drawNumberLine(2,Infinity,true,false,'gt');
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/inequalities/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var ok=_normIneq(inp.value.trim())===_normIneq(String(_pr.exercise.answer));
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Use o formato: x > 2 ou -1 < x < 3';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Ineq=_pub;
})();
