(function(){
  var TOPIC_ID='numeric_integ';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,sc=38;
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=0.8;
    for(var i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('∫f(x)dx − aproximação por trapézios',W/2,H-5);
  }
  function _drawTrap(){
    _drawAxes();
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var cx=W/2,cy=H/2,sc=38,n=4,a=0,b=2;
    var h=(b-a)/n;
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    for(var xi=-1;xi<=3;xi+=0.04){var yi=xi*xi+0.5;if(xi===-1)ctx.moveTo(cx+xi*sc,cy-yi*sc);else ctx.lineTo(cx+xi*sc,cy-yi*sc);}ctx.stroke();
    for(var i=0;i<n;i++){
      var xa=a+i*h,xb=xa+h,ya=xa*xa+0.5,yb=xb*xb+0.5;
      ctx.fillStyle='rgba(90,143,210,0.15)';
      ctx.beginPath();ctx.moveTo(cx+xa*sc,cy);ctx.lineTo(cx+xa*sc,cy-ya*sc);ctx.lineTo(cx+xb*sc,cy-yb*sc);ctx.lineTo(cx+xb*sc,cy);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=0.8;ctx.strokeRect(cx+xa*sc,cy-Math.max(ya,yb)*sc,(xb-xa)*sc,Math.max(ya,yb)*sc);
    }
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Integração Numérica'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Integração Numérica</h1>'+
      '<p class="topic-meta">trapézio · Simpson 1/3 · erro · número de subintervalos</p>'+
      '<div class="content-block">'+'<p>Quando ∫f(x)dx não tem forma fechada, usamos fórmulas numéricas que aproximam a área por figuras simples.</p>'+'<div class="concept-highlight"><div class="hl-label">Regra do Trapézio (T)</div>T = (h/2)[f(x₀)+2f(x₁)+⋯+2f(xₙ₋₁)+f(xₙ)]<br>Erro = −(b−a)h²/12 · f″(ξ) — O(h²)</div>'+'<div class="concept-highlight"><div class="hl-label">Simpson 1/3 (S)</div>S = (h/3)[f₀+4f₁+2f₂+4f₃+⋯+4fₙ₋₁+fₙ]  (n par)<br>Padrão de coeficientes: 1,4,2,4,2,...,4,1<br>Erro = −(b−a)h⁴/180 · fⁿ(4⁾)(ξ) — O(h⁴) — muito mais preciso</div>'+'<div class="concept-highlight"><div class="hl-label">Escolha de n</div>Dobrar n divide o erro do trapézio por 4 e o de Simpson por 16.<br>Simpson é exato para polinômios até grau 3.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/numeric_integ/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawTrap();
  }

  var _exSteps=[{"equation":"∯₀¹ x² dx,  n=4,  h = (1−0)/4 = 0,25","note":"subintervalos: x₀=0, x₁=0,25, x₂=0,5, x₃=0,75, x₄=1"},{"equation":"f(xᵢ): 0 | 0,0625 | 0,25 | 0,5625 | 1","note":"avaliar f(x)=x² nos 5 nós"},{"equation":"T = (0,25/2)(0+2·0,0625+2·0,25+2·0,5625+1) = 0,34375","note":"regra do trapézio"},{"equation":"S = (0,25/3)(0+4·0,0625+2·0,25+4·0,5625+1) = 0,3333","note":"Simpson 1/3 (padrão 1,4,2,4,1)"},{"equation":"Valor exato: [x³/3]₀¹ = 1/3 ≈ 0,3333","note":"TFC II"},{"equation":"Erro T = 0,0104 | Erro S ≈ 0 — Simpson exato para grau 2!","note":"Simpson exato até grau 3"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Integração Numérica',href:'topic/numeric_integ/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: ∯₀¹ x² dx com n=4</h1>'+
      '<p class="topic-meta">trapézio e Simpson, comparar com valor exato 1/3</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="NumInt.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="NumInt.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawTrap();
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
    if(next){if(i===n-1){next.textContent='Praticar \u2192';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/numeric_integ/practice');};}    else{next.textContent='Pr\u00f3ximo \u2192';next.onclick=function(){NumInt.nextStep();};}}
    _drawTrap();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Integração Numérica',href:'topic/numeric_integ/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="NumInt.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawTrap();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="NumInt.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="NumInt.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="NumInt.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')NumInt.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/numeric_integ/practice');}},
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
  window.NumInt=_pub;
})();
