/**
 * modules/calc_limits.js
 * Limites
 */
(function () {
  var TOPIC_ID = 'calc_limits';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(label){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H*0.5,sc=55;
    ctx.strokeStyle='#17172a';ctx.lineWidth=0.6;
    for(var i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();ctx.beginPath();ctx.moveTo(20,cy+i*sc*0.5);ctx.lineTo(W-20,cy+i*sc*0.5);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    [-3,-2,-1,1,2,3].forEach(function(v){ctx.fillText(v+'π',cx+v*sc,cy+12);});
    ctx.textAlign='right';ctx.fillText('1',cx-4,cy-sc*0.5+4);
    // sen(x)/x — left of origin
    ctx.strokeStyle='#4ab8b2';ctx.lineWidth=2.5;
    ctx.beginPath();var first=true;
    for(var xi=-3.1*Math.PI;xi<-0.05;xi+=0.05){
      var yi=Math.sin(xi)/xi,xp=cx+xi/Math.PI*sc,yp=cy-yi*sc*0.5;
      if(yp<18||yp>H-18){first=true;continue;}
      if(first){ctx.moveTo(xp,yp);first=false;}else ctx.lineTo(xp,yp);
    }
    ctx.stroke();
    // right of origin
    ctx.beginPath();first=true;
    for(var xi=0.05;xi<=3.1*Math.PI;xi+=0.05){
      var yi=Math.sin(xi)/xi,xp=cx+xi/Math.PI*sc,yp=cy-yi*sc*0.5;
      if(yp<18||yp>H-18){first=true;continue;}
      if(first){ctx.moveTo(xp,yp);first=false;}else ctx.lineTo(xp,yp);
    }
    ctx.stroke();
    // Removable discontinuity at x=0 (open circle at y=1)
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(cx,cy-sc*0.5,5,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#13131c';ctx.beginPath();ctx.arc(cx,cy-sc*0.5,4,0,Math.PI*2);ctx.fill();
    // Labels
    ctx.fillStyle='#c8a44a';ctx.font='bold 11px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('lim sen(x)/x = 1',W/2,22);
    ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono';
    ctx.fillText('x→0',cx+20,cy-sc*0.5-10);
    ctx.fillStyle='#4ab8b2';ctx.font='bold 10px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('f(x)=sen(x)/x',cx+sc*2+4,cy+8);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Limites'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Limites</h1>'+
      '<p class="topic-meta">L’Hôpital · formas indeterminadas · limites laterais · continuidade</p>'+
      '<div class="content-block">'+'<p>O limite descreve o comportamento de f(x) conforme x se aproxima de um ponto, independente do valor em x=a.</p>'+'<div class="concept-highlight"><div class="hl-label">Definição intuitiva</div>lim f(x) = L significa: para x próximo de a, f(x) fica próximo de L.<br>Limite lateral esquerdo (x→a⁻) pode diferir do direito (x→a⁺).<br>O limite existe ⇔ laterais são iguais.</div>'+'<div class="concept-highlight"><div class="hl-label">Formas indeterminadas</div>0/0, ∞/∞, 0·∞, ∞−∞, 0⁰, 1^∞, ∞⁰<br>Resolvidas por: fatoração, L’Hôpital, limites notáveis.</div>'+'<div class="concept-highlight"><div class="hl-label">Regra de L’Hôpital</div>Se lim f/g = 0/0 ou ∞/∞, então lim f/g = lim f′/g′ (se existir).<br>Aplique repetidamente até resolver a indeterminação.</div>'+'<div class="concept-highlight"><div class="hl-label">Limites notáveis</div>lim(sin x)/x = 1 (x→0) | lim(1+1/n)ⁿ = e (n→∞)<br>lim(eˣ−1)/x = 1 (x→0) | lim(ln(1+x))/x = 1 (x→0)</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/calc_limits/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawAxes('lim f(x) quando x→a');
  }

  var _exSteps=[{"equation":"lim (x²−4)/(x−2) quando x→2","note":"forma 0/0 — fatorar"},{"equation":"= lim (x−2)(x+2)/(x−2)","note":"fatorar numerador"},{"equation":"= lim (x+2) = 4","note":"cancelar (x−2), substituir x=2"},{"equation":"lim (sin 3x)/x quando x→0","note":"segundo exemplo — limite notável"},{"equation":"= lim 3·(sin 3x)/(3x) = 3·1 = 3","note":"usando lim(sin u)/u=1 com u=3x"},{"equation":"L’Hôpital: lim eˣ/x² (x→∞) → lim eˣ/(2x) → lim eˣ/2 = ∞","note":"forma ∞/∞ — derivar num. e denom."}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Limites',href:'topic/calc_limits/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: formas indeterminadas</h1>'+
      '<p class="topic-meta">0/0 por fatoração e L’Hôpital</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="CalcLim.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="CalcLim.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawAxes('lim f(x) quando x→a');
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/calc_limits/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){CalcLim.nextStep();};}}
    _drawAxes('lim f(x) quando x→a');
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Limites',href:'topic/calc_limits/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="CalcLim.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawAxes('lim f(x) quando x→a');
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="CalcLim.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="CalcLim.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="CalcLim.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')CalcLim.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/calc_limits/practice');}},
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
  window.CalcLim=_pub;
})();
