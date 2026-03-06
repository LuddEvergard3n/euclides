/**
 * modules/integrals.js
 * Integrais
 */
(function () {
  var TOPIC_ID = 'integrals';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(label){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var ox=55,oy=H-50,sc=70;
    ctx.strokeStyle='#17172a';ctx.lineWidth=0.6;
    for(var i=1;i<=4;i++){ctx.beginPath();ctx.moveTo(ox+i*sc,28);ctx.lineTo(ox+i*sc,oy);ctx.stroke();ctx.beginPath();ctx.moveTo(ox,oy-i*sc*0.6);ctx.lineTo(W-20,oy-i*sc*0.6);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ox,28);ctx.lineTo(ox,oy+8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ox-8,oy);ctx.lineTo(W-20,oy);ctx.stroke();
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    [1,2,3].forEach(function(v){ctx.fillText(v,ox+v*sc,oy+13);});
    ctx.textAlign='right';[1,2,3,4].forEach(function(v){ctx.fillText(v,ox-5,oy-v*sc*0.6+4);});
    // Shaded area under x² from 0 to 2
    ctx.fillStyle='rgba(74,184,178,0.18)';
    ctx.beginPath();ctx.moveTo(ox,oy);
    for(var xi=0;xi<=2;xi+=0.05){ctx.lineTo(ox+xi*sc,oy-xi*xi*sc*0.6);}
    ctx.lineTo(ox+2*sc,oy);ctx.closePath();ctx.fill();
    // f(x)=x² curve
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2.5;ctx.beginPath();
    for(var xi=0;xi<=3.2;xi+=0.04){var yp=oy-xi*xi*sc*0.6;if(yp<28)break;if(xi===0)ctx.moveTo(ox,oy);else ctx.lineTo(ox+xi*sc,yp);}
    ctx.stroke();
    // Bound at x=2
    ctx.strokeStyle='rgba(200,164,74,0.6)';ctx.lineWidth=1;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(ox+2*sc,oy);ctx.lineTo(ox+2*sc,oy-4*sc*0.6);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#5a8fd2';ctx.font='bold 11px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('f(x)=x²',ox+3.1*sc,oy-3.1*3.1*sc*0.6);
    ctx.fillStyle='#4ab8b2';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('∫₀²x²dx = 8/3',ox+sc,oy-sc*0.25);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Integrais'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Integrais</h1>'+
      '<p class="topic-meta">substituição · integração por partes · frações parciais</p>'+
      '<div class="content-block">'+'<p>A integral indefinida ∯f(x)dx busca F(x) tal que F′(x)=f(x). Constante de integração C sempre presente.</p>'+'<div class="concept-highlight"><div class="hl-label">Regras básicas</div>∯xⁿdx = xⁿ⁺¹/(n+1)+C | ∯eˣdx = eˣ+C<br>∯1/x dx = ln|x|+C | ∯sin x dx = −cos x+C</div>'+'<div class="concept-highlight"><div class="hl-label">Substituição (u-sub)</div>∯f(g(x))g′(x)dx: faça u=g(x), du=g′(x)dx → ∯f(u)du<br>Exemplo: ∯2x·eˣ² dx: u=x², du=2x dx → ∯eᵘdu = eˣ²+C</div>'+'<div class="concept-highlight"><div class="hl-label">Integração por partes</div>∯u dv = uv − ∯v du<br>LIATE: Logarítmica, Inversa trig., Algébrica, Trigon., Exponencial.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/integrals/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawAxes('∯f(x)dx — área sob a curva');
  }

  var _exSteps=[{"equation":"∯x·eˣ dx — integração por partes","note":"problema 1"},{"equation":"u=x, dv=eˣdx → du=dx, v=eˣ","note":"escolha de u e dv (LIATE)"},{"equation":"= xeˣ − ∯eˣdx = xeˣ − eˣ + C","note":"aplicar fórmula"},{"equation":"∯cos(2x) dx — substituição","note":"problema 2"},{"equation":"u=2x, du=2dx → dx=du/2","note":"u-sub"},{"equation":"= (1/2)∯cos(u)du = (1/2)sin(2x) + C","note":"resultado"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Integrais',href:'topic/integrals/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: por partes e substituição</h1>'+
      '<p class="topic-meta">∯x·eˣdx e ∯cos(2x)dx</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Integ.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Integ.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawAxes('antiderivadas');
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/integrals/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){Integ.nextStep();};}}
    _drawAxes('antiderivadas');
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Integrais',href:'topic/integrals/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Integ.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawAxes('∯f(x)dx — área sob a curva');
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Integ.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Integ.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Integ.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Integ.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/integrals/practice');}},
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
  window.Integ=_pub;
})();
