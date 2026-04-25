(function(){
  var TOPIC_ID='fourier_series';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,sc=50;
    // Fine grid
    ctx.strokeStyle='#17172a';ctx.lineWidth=0.6;
    for(var i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();ctx.beginPath();ctx.moveTo(20,cy+i*sc*0.5);ctx.lineTo(W-20,cy+i*sc*0.5);ctx.stroke();}
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    // Tick labels (π units)
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    [-2,-1,1,2].forEach(function(v){ctx.fillText(v+'π',cx+v*sc,cy+12);});
    ctx.textAlign='right';ctx.fillText('1',cx-4,cy-sc*0.5+4);ctx.fillText('-1',cx-4,cy+sc*0.5+4);
    // Target: square wave (dashed gold)
    ctx.strokeStyle='rgba(200,164,74,0.35)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();
    for(var k=-2;k<=2;k++){
      var x0=cx+k*sc,x1=cx+(k+0.5)*sc,sg=(k%2===0)?1:-1;
      ctx.moveTo(x0,cy-sg*sc*0.5);ctx.lineTo(x1,cy-sg*sc*0.5);
      ctx.moveTo(x1,cy-sg*sc*0.5);ctx.lineTo(x1,cy+sg*sc*0.5);
    }
    ctx.stroke();ctx.setLineDash([]);
    // Partial sums N=1,3,9
    var pal=['#c45252','#5a8fd2','#4ab8b2'];
    [1,3,9].forEach(function(N,ni){
      ctx.strokeStyle=pal[ni];ctx.lineWidth=ni===2?2.2:1.4;
      ctx.beginPath();var first=true;
      for(var xi=-3*Math.PI;xi<=3*Math.PI;xi+=0.04){
        var y=0;
        for(var k=1;k<=2*N-1;k+=2){y+=Math.sin(k*xi)/k;}
        y=y*(4/Math.PI);
        var xp=cx+xi/Math.PI*sc,yp=cy-y*sc*0.5;
        if(xp<18||xp>W-18){first=true;continue;}
        if(first){ctx.moveTo(xp,yp);first=false;}else ctx.lineTo(xp,yp);
      }
      ctx.stroke();
    });
    // Legend
    ctx.font='9px JetBrains Mono';ctx.textAlign='left';
    [['#c45252','N=1'],['#5a8fd2','N=3'],['#4ab8b2','N=9 (fen. Gibbs)']].forEach(function(e,i){
      ctx.fillStyle=e[0];ctx.fillText(e[1],W-100,28+i*13);
    });
    ctx.fillStyle='rgba(200,164,74,0.6)';ctx.fillText('onda quadrada',W-100,28+3*13);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Série de Fourier'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Série de Fourier</h1>'+
      '<p class="topic-meta">coeficientes aₙ, bₙ · funções pares/ímpares · Parseval</p>'+
      '<div class="content-block">'+'<p>A Série de Fourier representa funções periódicas como soma infinita de senos e cossenos, revelando o conteúdo de frequência.</p>'+'<div class="concept-highlight"><div class="hl-label">Fórmulas dos coeficientes (período 2π)</div>a₀ = (1/π)∫₋π^π f(x)dx<br>aₙ = (1/π)∫₋π^π f(x)cos(nx)dx<br>bₙ = (1/π)∫₋π^π f(x)sin(nx)dx</div>'+'<div class="concept-highlight"><div class="hl-label">Simetria</div>f par (f(−x)=f(x)): bₙ=0, só termos cosseno.<br>f ímpar (f(−x)=−f(x)): aₙ=0, só termos seno.<br>Economiza metade do trabalho!</div>'+'<div class="concept-highlight"><div class="hl-label">Igualdade de Parseval</div>(1/π)∫₋π^π |f(x)|²dx = a₀²/2 + Σ(aₙ²+bₙ²)<br>Energia no tempo = energia nas frequências.<br>Fornece somas exatas de séries numéricas.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/fourier_series/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawAxes();
  }

  var _exSteps=[{"equation":"f(x) = x em [−π, π], extensão periódica de período 2π.","note":"f é função ímpar → aₙ = 0 para todo n"},{"equation":"a₀ = (1/π)∫₋π^π x dx = 0  (integral de função ímpar em [−π,π])","note":"coeficiente constante"},{"equation":"bₙ = (1/π)∫₋π^π x·sin(nx)dx","note":"integrar por partes"},{"equation":"= (1/π)·[2(-1)ⁿ₊¹π/n] = 2(-1)ⁿ₊¹/n","note":"resultado da integração por partes"},{"equation":"f(x) = 2sin(x) − sin(2x) + (2/3)sin(3x) − ...","note":"série: Σ 2(-1)ⁿ₊¹/n · sin(nx)"},{"equation":"Parseval: Σ 4/n² = 2π²/3 → Σ(1/n²) = π²/6","note":"é assim que se prova π²/6!"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Série de Fourier',href:'topic/fourier_series/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: Série de Fourier de f(x) = x em [−π,π]</h1>'+
      '<p class="topic-meta">calcular coeficientes e escrever a série</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="FourierS.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="FourierS.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawAxes();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var s=_exSteps[i];
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
      '<span class="text-mono text-gold">'+s.equation+'</span>';
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar \u2192';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/fourier_series/practice');};}    else{next.textContent='Pr\u00f3ximo \u2192';next.onclick=function(){FourierS.nextStep();};}}
    _drawAxes();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Série de Fourier',href:'topic/fourier_series/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="FourierS.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawAxes();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="FourierS.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="FourierS.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="FourierS.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')FourierS.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/fourier_series/practice');}},
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
  window.FourierS=_pub;
})();
