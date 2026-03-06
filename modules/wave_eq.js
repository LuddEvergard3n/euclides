(function(){
  var TOPIC_ID='wave_eq';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawCanvas(){var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();Renderer.clear();
    var x0=40,botY=H-40,amplitude=65,L=W-80;
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(x0,botY);ctx.lineTo(x0+L,botY);ctx.stroke();
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono';
    ctx.textAlign='left';ctx.fillText('x=0',x0-4,botY+14);
    ctx.textAlign='right';ctx.fillText('x=L',x0+L+6,botY+14);
    ctx.textAlign='center';ctx.fillText('Modos normais da equa\u00e7\u00e3o de onda',x0+L/2,18);
    var wColors=['#4ab8b2','#5a8fd2','rgba(200,164,74,0.7)'];
    [1,2,3].forEach(function(n,ni){
      ctx.strokeStyle=wColors[ni];ctx.lineWidth=ni===0?2.5:1.5;
      if(ni>0)ctx.setLineDash([4,3]);else ctx.setLineDash([]);
      ctx.beginPath();
      for(var i=0;i<=200;i++){
        var xf=i/200,xp=x0+xf*L,yv=Math.sin(n*xf*Math.PI)*amplitude*(1-ni*0.25);
        if(i===0)ctx.moveTo(xp,botY-yv);else ctx.lineTo(xp,botY-yv);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.font='10px JetBrains Mono';ctx.textAlign='left';
    [['#4ab8b2','n=1 (fundamental)'],['#5a8fd2','n=2'],['rgba(200,164,74,0.9)','n=3']].forEach(function(e,i){
      ctx.fillStyle=e[0];ctx.fillText(e[1],x0+4,38+i*14);
    });
}
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Equação de Onda'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Equação de Onda</h1>'+
      '<p class="topic-meta">EDP hiperbólica · d'Alembert · modos normais · velocidade de propagação</p>'+
      '<div class="content-block">'+'<div class="concept-highlight"><div class="hl-label">Equação e classificação</div>u_tt = c² u_xx  (EDP hiperbólica)<br>c = velocidade de propagação.<br>Modela: cordas vibrantes, ondas acústicas, eletromagnéticas.</div>'+'<div class="concept-highlight"><div class="hl-label">Solução de d'Alembert</div>u(x,t) = f(x-ct) + g(x+ct)<br>f(x-ct): onda viajando para a direita.<br>g(x+ct): onda viajando para a esquerda.<br>Condições iniciais determinam f e g.</div>'+'<div class="concept-highlight"><div class="hl-label">Modos normais (corda fixada)</div>X_n = sen(nπx/L), ω_n = nπc/L<br>u_n(x,t) = sen(nπx/L)(A_n cosω_n t + B_n senω_n t)<br>Freqüência fundamental: f₁ = c/(2L)</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/wave_eq/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawCanvas();
  }
  var _exSteps=[{"equation": "Corda L=π, c=1. Cond: u(0,t)=u(π,t)=0, u(x,0)=sen(x), u_t(x,0)=0.", "note": "problema bem-posto"}, {"equation": "Forma dos modos: u_n = sen(nx)(A_n cos nt + B_n sen nt)", "note": "separação de variáveis com L=π"}, {"equation": "u(x,0)=sen(x) → só n=1 contribui: A₁=1", "note": "condição inicial"}, {"equation": "u_t(x,0)=0 → B₁=0", "note": "velocidade inicial nula"}, {"equation": "u(x,t) = sen(x)·cos(t)", "note": "onda estacionária"}, {"equation": "Energia conservada: E = (1/2)∫(u_t² + u_x²)dx = const", "note": "verificação"}];
  function _updateEx(){
    var s=_exSteps[_exStep];
    var desc=document.getElementById('step-desc');
    if(desc)desc.innerHTML='<span class="text-mono text-gold">'+s.equation+'</span>'+(s.note?'<br><span class="text-dim" style="font-size:12px">'+s.note+'</span>':'');
    var ctr=document.getElementById('step-counter');if(ctr)ctr.textContent='Passo '+(_exStep+1)+' de '+_exSteps.length;
    var fill=document.getElementById('step-fill');if(fill)fill.style.width=(_exStep/(_exSteps.length-1)*100)+'%';
    document.getElementById('btn-prev').disabled=_exStep===0;
    document.getElementById('btn-next').textContent=_exStep===_exSteps.length-1?'Ir para pr\u00e1tica \u2192':'Pr\u00f3ximo \u2192';
    Renderer.drawEquationSteps(_exSteps,_exStep);
  }
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Equação de Onda',href:'topic/wave_eq/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo passo a passo</h1>'+
      '<p class="topic-meta">EDP hiperbólica · d'Alembert · modos normais · velocidade de propagação</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="WaveEq.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="WaveEq.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Equação de Onda',href:'topic/wave_eq/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="WaveEq.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){_pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);_pr.hintIndex=0;_pr.solved=false;_renderCard();var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawCanvas();}
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exerc\u00edcio '+(_pr.history.length+1);
    area.innerHTML='<div class="exercise-card">'+
      '<p class="exercise-statement">'+ex.statement+'</p>'+
      '<div class="exercise-equation">'+ex.equation+'</div>'+
      '<div class="answer-row"><span class="answer-label">= </span>'+
      '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
      '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
      '<div class="btn-row"><button class="btn btn-primary" onclick="WaveEq.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="WaveEq.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="WaveEq.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')WaveEq.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/wave_eq/practice');}},
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
  window.WaveEq=_pub;
})();
