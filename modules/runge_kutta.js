(function(){
  var TOPIC_ID='runge_kutta';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawCanvas(){var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();Renderer.clear();
    var labels=['Euler','RK2','RK4'],colors=['#c45252','#5a8fd2','#4ab8b2'],errs=[16,4,0.5];
    var barW=70,gap=30,startX=55,botY=H-50,maxE=16;
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(startX-10,30);ctx.lineTo(startX-10,botY+8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(startX-10,botY);ctx.lineTo(W-20,botY);ctx.stroke();
    labels.forEach(function(lbl,i){
      var x=startX+i*(barW+gap);
      var bh=Math.max(4,errs[i]/maxE*(botY-50));
      ctx.fillStyle=colors[i]+'33';ctx.fillRect(x,botY-bh,barW,bh);
      ctx.strokeStyle=colors[i];ctx.lineWidth=1.5;ctx.strokeRect(x,botY-bh,barW,bh);
      ctx.fillStyle=colors[i];ctx.font='bold 11px JetBrains Mono';ctx.textAlign='center';
      ctx.fillText(lbl,x+barW/2,botY+14);
      var ord=['O(h)','O(h\u00b2)','O(h\u2074)'][i];
      ctx.fillStyle='#e8e8f2';ctx.font='10px JetBrains Mono';
      ctx.fillText(ord,x+barW/2,botY-bh-7);
    });
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('Erro global (menor \u00e9 melhor)',W/2,18);
}
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Runge-Kutta'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Runge-Kutta</h1>'+
      '<p class="topic-meta">RK2 · RK4 · erro global · avaliações de função · convergência</p>'+
      '<div class="content-block">'+'<div class="concept-highlight"><div class="hl-label">Método de Euler (revisão)</div>y₁ = y₀ + h·f(x₀,y₀)<br>Erro global O(h) — 1 avaliação de f por passo.<br>Base para entender métodos de ordem superior.</div>'+'<div class="concept-highlight"><div class="hl-label">Runge-Kutta de 4ª ordem (RK4)</div>k₁=f(x,y), k₂=f(x+h/2, y+hk₁/2)<br>k₃=f(x+h/2, y+hk₂/2), k₄=f(x+h, y+hk₃)<br>y₁ = y₀ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)</div>'+'<div class="concept-highlight"><div class="hl-label">Precisão e custo</div>RK4: erro global O(h⁴) — 4 avaliações de f por passo.<br>RK2 (Heun): O(h²), 2 avaliações.<br>Duplicar a ordem custa o dobro de avaliações.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/runge_kutta/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawCanvas();
  }
  var _exSteps=[{"equation": "Resolver y'=y, y(0)=1, estimar y(0.2) com RK4 (h=0.2).", "note": "solução exata: e^0.2 = 1.22140"}, {"equation": "k₁ = f(0,1) = 1", "note": "inclinação no ponto inicial"}, {"equation": "k₂ = f(0.1, 1+0.1·1) = 1.1", "note": "inclinação no meio (Euler)"}, {"equation": "k₃ = f(0.1, 1+0.1·1.1) = 1.11", "note": "inclinação no meio (melhorada)"}, {"equation": "k₄ = f(0.2, 1+0.2·1.11) = 1.222", "note": "inclinação no fim"}, {"equation": "y₁ = 1 + (0.2/6)(1+2.2+2.22+1.222) = 1.22140", "note": "RK4 praticamente igual ao valor exato"}];
  function _updateEx(){
    var s=_exSteps[_exStep];
    var desc=document.getElementById('step-desc');
    if(desc)desc.innerHTML='<span class="text-mono text-gold">'+s.equation+'</span>'+(s.note?'<br><span class="text-dim" style="font-size:12px">'+s.note+'</span>':'');
    var ctr=document.getElementById('step-counter');if(ctr)ctr.textContent='Passo '+(_exStep+1)+' de '+_exSteps.length;
    var fill=document.getElementById('step-fill');if(fill)fill.style.width=(_exStep/(_exSteps.length-1)*100)+'%';
    var _bp=document.getElementById('btn-prev');if(_bp)_bp.disabled=_exStep===0;
    var _bn=document.getElementById('btn-next');if(_bn)_bn.textContent=_exStep===_exSteps.length-1?'Ir para pr\u00e1tica \u2192':'Pr\u00f3ximo \u2192';
    Renderer.drawEquationSteps(_exSteps,_exStep);
  }
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Runge-Kutta',href:'topic/runge_kutta/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo passo a passo</h1>'+
      '<p class="topic-meta">RK2 · RK4 · erro global · avaliações de função · convergência</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="RungeKutta.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="RungeKutta.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Runge-Kutta',href:'topic/runge_kutta/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="RungeKutta.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="RungeKutta.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="RungeKutta.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="RungeKutta.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')RungeKutta.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/runge_kutta/practice');}},
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
  window.RungeKutta=_pub;
})();
