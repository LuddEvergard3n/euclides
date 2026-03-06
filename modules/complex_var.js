(function(){
  var TOPIC_ID='complex_var';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawCanvas(){var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();Renderer.clear();
    var cx=W/2,cy=H/2,sc=60;
    ctx.strokeStyle='#1a1a28';ctx.lineWidth=0.7;
    for(var i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,30);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();ctx.beginPath();ctx.moveTo(30,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(30,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,30);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('Re',W-14,cy-6);ctx.textAlign='left';ctx.fillText('Im',cx+6,34);
    ctx.strokeStyle='rgba(74,184,178,0.25)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(cx,cy,sc,0,Math.PI*2);ctx.stroke();
    var px=cx+3*sc,py=cy-4*sc;
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,py);ctx.lineTo(px,py);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c8a44a';ctx.font='bold 12px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('z = 3+4i',px+8,py-6);
    ctx.fillStyle='#4ab8b2';ctx.font='11px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('|z|=5',cx+(px-cx)/2-14,cy+(py-cy)/2-8);
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    for(var i=1;i<=3;i++)ctx.fillText(i,cx+i*sc,cy+12);
    ctx.textAlign='right';for(var i=1;i<=3;i++)ctx.fillText(i,cx-4,cy-i*sc+4);
}
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Variável Complexa'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Variável Complexa</h1>'+
      '<p class="topic-meta">módulo · argumento · conjugado · forma polar · fórmula de Euler</p>'+
      '<div class="content-block">'+'<div class="concept-highlight"><div class="hl-label">Forma algébrica e módulo</div>z = a + bi,  a = Re(z),  b = Im(z)<br>|z| = √(a² + b²) &nbsp; (distância à origem)<br>Conjugado: ̅z = a - bi  →  z·̅z = |z|²</div>'+'<div class="concept-highlight"><div class="hl-label">Forma polar e argumento</div>z = r(cosθ + i·senθ) = re^(iθ)<br>r = |z|,  θ = arg(z) = arctan(b/a)  (ajustado ao quadrante)<br>Multiplicação: r₁r₂ e^(i(θ₁+θ₂)) — módulos multiplicam, argumentos somam</div>'+'<div class="concept-highlight"><div class="hl-label">Fórmula de Euler</div>e^(iθ) = cosθ + i·senθ<br>e^(iπ) + 1 = 0  (identidade de Euler)<br>Potências: z^n = r^n(cos nθ + i·sen nθ)  (De Moivre)</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/complex_var/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawCanvas();
  }
  var _exSteps=[{"equation": "Calcule |z| para z = 3 + 4i.", "note": "módulo de um número complexo"}, {"equation": "|z| = √(3² + 4²) = √(9+16) = √25", "note": "aplicando a fórmula"}, {"equation": "|z| = 5", "note": "resultado"}, {"equation": "arg(z) = arctan(4/3) = 53.13°", "note": "argumento no 1º quadrante"}, {"equation": "Forma polar: z = 5 e^(i·53.13°)", "note": "representação completa"}, {"equation": "Verificação: 5(cos53° + i·sen53°) = 3+4i ✓", "note": "consistência"}];
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
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Variável Complexa',href:'topic/complex_var/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo passo a passo</h1>'+
      '<p class="topic-meta">módulo · argumento · conjugado · forma polar · fórmula de Euler</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="ComplexVar.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="ComplexVar.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Variável Complexa',href:'topic/complex_var/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="ComplexVar.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="ComplexVar.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="ComplexVar.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="ComplexVar.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')ComplexVar.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/complex_var/practice');}},
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
  window.ComplexVar=_pub;
})();
