(function(){
  var TOPIC_ID='markov';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawAxes(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var cx=W/2,cy=H/2;
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Estados A \u2194 B \u2014 probabilidades de transição',W/2,H-5);
  }
  function _drawMarkov(){
    Renderer.clear();
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var cx=W/2,cy=H/2;
    // Draw two state nodes
    var ax=cx-100,bx=cx+100;
    [ax,bx].forEach(function(x,i){
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(x,cy,36,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#e8e8f2';ctx.font='16px JetBrains Mono';ctx.textAlign='center';
      ctx.fillText(i===0?'A':'B',x,cy+6);
    });
    // A->B arrow
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ax+36,cy-10);ctx.lineTo(bx-36,cy-10);ctx.stroke();
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('0.3',cx,cy-18);
    // B->A arrow
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(bx-36,cy+10);ctx.lineTo(ax+36,cy+10);ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.fillText('0.4',cx,cy+22);
    // self-loops labels
    ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono';
    ctx.fillText('0.7',ax,cy-46);
    ctx.fillText('0.6',bx,cy-46);
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('P = [[0.7,0.3],[0.4,0.6]]',W/2,H-5);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Cadeias de Markov'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Cadeias de Markov</h1>'+
      '<p class="topic-meta">matriz de transição · distribuição estacionária · estado absorvente</p>'+
      '<div class="content-block">'+'<p>Uma cadeia de Markov é um processo estocástico onde a probabilidade do próximo estado depende apenas do estado atual (propriedade de Markov).</p>'+'<div class="concept-highlight"><div class="hl-label">Matriz de transição P</div>P[i][j] = P(estado j | estado i atual)<br>Linhas somam 1. Pⁿ[i][j] = prob de ir de i a j em n passos.</div>'+'<div class="concept-highlight"><div class="hl-label">Distribuição estacionária π</div>πP = π  e  Σπᵢ = 1<br>π é o autovetor esquerdo de P para autovalor 1.<br>Para 2 estados: π₁/π₂ = P[B][A]/P[A][B]</div>'+'<div class="concept-highlight"><div class="hl-label">Ergodicidade</div>Cadeia irredutível e aperiodicidade → distribuição estacionária única.<br>No longo prazo: P(estado i) → πᵢ independente do estado inicial.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/markov/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawMarkov();
  }

  var _exSteps=[{"equation":"P = [[0.7, 0.3], [0.4, 0.6]]. Encontrar π tal que πP = π.","note":"problema"},{"equation":"π₂P[A][B] = π₁P[B][A] (balanceamento detalhado)","note":"para 2 estados: π₁·0.3 = π₂·0.4"},{"equation":"0.3π₁ = 0.4π₂ → π₂ = (0.3/0.4)π₁ = (3/4)π₁","note":"expressão de π₂ em função de π₁"},{"equation":"π₁ + π₂ = 1 → π₁ + (3/4)π₁ = 1 → (7/4)π₁ = 1","note":"normalizar"},{"equation":"π₁ = 4/7 ≈ 0.5714,  π₂ = 3/7 ≈ 0.4286","note":"distribuição estacionária"},{"equation":"No longo prazo: ~57% do tempo no estado A, ~43% no estado B.","note":"interpretação"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Cadeias de Markov',href:'topic/markov/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: distribuição estacionária de P</h1>'+
      '<p class="topic-meta">P = [[0.7,0.3],[0.4,0.6]]</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Markov.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Markov.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawMarkov();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    var s=_exSteps[i];
    document.getElementById('step-desc').innerHTML=i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
      '<span class="text-mono text-gold">'+s.equation+'</span>';
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar \u2192';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/markov/practice');};}    else{next.textContent='Pr\u00f3ximo \u2192';next.onclick=function(){Markov.nextStep();};}}
    _drawMarkov();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Cadeias de Markov',href:'topic/markov/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="Markov.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawMarkov();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exerc\u00edcio '+(_pr.history.length+1);
    area.innerHTML='<div class="exercise-card">'+
      '<p class="exercise-statement">'+ex.statement+'</p>'+
      '<div class="exercise-equation">'+ex.equation+'</div>'+
      '<div class="answer-row"><span class="answer-label">= </span>'+
      '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
      '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
      '<div class="btn-row"><button class="btn btn-primary" onclick="Markov.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Markov.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Markov.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Markov.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/markov/practice');}},
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
      if(ok){fb.className='feedback-line correct';fb.textContent='\u2713 Correto! = '+c;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='\u2717 N\u00e3o \u00e9 isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Markov=_pub;
})();
