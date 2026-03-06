(function(){
  var TOPIC_ID='interpolation';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawCanvas(){var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();Renderer.clear();
    var ox=50,oy=H-50,sc=80;
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ox,30);ctx.lineTo(ox,oy+8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ox-8,oy);ctx.lineTo(W-20,oy);ctx.stroke();
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    [1,2].forEach(function(i){ctx.fillText(i,ox+i*sc,oy+13);});
    ctx.textAlign='right';[1,2,3,5,7].forEach(function(v){ctx.fillText(v,ox-5,oy-v*sc*0.37+4);});
    ctx.strokeStyle='#4ab8b2';ctx.lineWidth=2;
    ctx.beginPath();
    for(var i=0;i<=120;i++){
      var xv=-0.15+i*2.3/120,yv=xv*xv+xv+1;
      var xp=ox+xv*sc,yp=oy-yv*sc*0.37;
      if(i===0)ctx.moveTo(xp,yp);else ctx.lineTo(xp,yp);
    }
    ctx.stroke();
    [[0,1],[1,3],[2,7]].forEach(function(p){
      ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(ox+p[0]*sc,oy-p[1]*sc*0.37,6,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#13131c';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono';ctx.textAlign='left';
      ctx.fillText('('+p[0]+','+p[1]+')',ox+p[0]*sc+8,oy-p[1]*sc*0.37-4);
    });
    ctx.fillStyle='#4ab8b2';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('P(x) = x\u00b2 + x + 1',W/2,20);
}
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Interpolação Polinomial'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Interpolação Polinomial</h1>'+
      '<p class="topic-meta">Lagrange · Newton · diferenças divididas · erro de truncamento</p>'+
      '<div class="content-block">'+'<div class="concept-highlight"><div class="hl-label">Interpolação de Lagrange</div>P(x) = Σ f(xᵢ) Lᵢ(x)<br>Lᵢ(x) = ∏_{j≠i} (x-x_j)/(xᵢ-x_j)<br>Polinômio único de grau ≤ n passando pelos n+1 nós.</div>'+'<div class="concept-highlight"><div class="hl-label">Diferenças divididas (Newton)</div>f[xᵢ,x_j] = (f(x_j)-f(xᵢ))/(x_j-xᵢ)<br>P(x) = f[x₀] + f[x₀,x₁](x-x₀) + f[x₀,x₁,x₂](x-x₀)(x-x₁) + ...<br>Eficiente para adicionar novos nós sem recalcular tudo.</div>'+'<div class="concept-highlight"><div class="hl-label">Erro de interpolação</div>E(x) = f^(n+1)(ξ)/(n+1)! · ω(x)<br>ω(x) = (x-x₀)(x-x₁)⋯(x-x_n) = polinômio nodal<br>Fenômeno de Runge: nós equidistantes com grau alto diverge nas bordas.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/interpolation/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawCanvas();
  }
  var _exSteps=[{"equation": "Interpolar f(x) com nós (0,1), (1,3), (2,7).", "note": "dados tabelados"}, {"equation": "Diferenças divididas: f[0,1]=(3-1)/1=2,  f[1,2]=(7-3)/1=4", "note": "1ª ordem"}, {"equation": "f[0,1,2] = (4-2)/(2-0) = 1", "note": "2ª ordem"}, {"equation": "P(x) = 1 + 2(x-0) + 1(x-0)(x-1)", "note": "forma de Newton"}, {"equation": "P(x) = 1 + 2x + x(x-1) = x² + x + 1", "note": "expandido"}, {"equation": "Verificação: P(0)=1, P(1)=3, P(2)=7 ✓", "note": "passa pelos 3 pontos"}];
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
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Interpolação Polinomial',href:'topic/interpolation/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo passo a passo</h1>'+
      '<p class="topic-meta">Lagrange · Newton · diferenças divididas · erro de truncamento</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Interpolation.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Interpolation.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Interpolação Polinomial',href:'topic/interpolation/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="Interpolation.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Interpolation.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Interpolation.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Interpolation.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Interpolation.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/interpolation/practice');}},
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
  window.Interpolation=_pub;
})();
