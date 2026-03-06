/**
 * modules/distributions.js
 * Distribuições Contínuas
 */
(function () {
  var TOPIC_ID = 'distributions';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(label){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,sc=40;
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=0.8;
    for(var i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    if(label){ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(label,W/2,H-5);}
    // Draw normal bell curve
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    for(var xi=-4;xi<=4;xi+=0.05){var yi=Math.exp(-xi*xi/2)/Math.sqrt(2*Math.PI);if(xi===-4)ctx.moveTo(cx+xi*sc,cy-yi*sc*8);else ctx.lineTo(cx+xi*sc,cy-yi*sc*8);}
    ctx.stroke();
    // Shade μ±1σ
    ctx.fillStyle='rgba(90,143,210,0.2)';
    ctx.beginPath();ctx.moveTo(cx-sc,cy);
    for(var xi=-1;xi<=1;xi+=0.05){var yi=Math.exp(-xi*xi/2)/Math.sqrt(2*Math.PI);ctx.lineTo(cx+xi*sc,cy-yi*sc*8);}
    ctx.lineTo(cx+sc,cy);ctx.closePath();ctx.fill();
    ctx.fillStyle='#c8a44a';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('~68%',cx,cy-sc*2.5);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Distribuições Contínuas'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Distribuições Contínuas</h1>'+
      '<p class="topic-meta">normal · exponencial · Poisson · t de Student · cálculo de probabilidades</p>'+
      '<div class="content-block">'+'<p>Variáveis aleatórias contínuas têm função de densidade f(x)≥0 com ∫f=1. A probabilidade é a área sob a curva.</p>'+'<div class="concept-highlight"><div class="hl-label">Normal N(μ,σ²)</div>f(x) = (1/σ√2π)·exp(−(x−μ)²/2σ²)<br>Padronização: Z=(X−μ)/σ ~ N(0,1)<br>Regra 68-95-99,7%: μ±σ, μ±2σ, μ±3σ</div>'+'<div class="concept-highlight"><div class="hl-label">Exponencial Exp(λ)</div>f(x)=λe^{−λx} (x≥0) | E(X)=1/λ | Var(X)=1/λ²<br>P(X>t)=e^{−λt} | Sem memória: P(X>s+t|X>s)=P(X>t)</div>'+'<div class="concept-highlight"><div class="hl-label">Poisson Po(λ)</div>P(X=k)=e^{−λ}λᵏ/k! | E(X)=Var(X)=λ<br>Modelo: eventos raros em tempo/espaço fixo.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/distributions/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawAxes('Distribuição Normal N(μ,σ²)');
  }

  var _exSteps=[{"equation":"X~N(100,25). Calcule P(X>110).","note":"distribuição normal — padronizar"},{"equation":"Z=(X−100)/5 ~ N(0,1). P(X>110)=P(Z>2)","note":"padronização Z=(X−μ)/σ"},{"equation":"P(Z>2) = 1−Φ(2) ≈ 1−0,9772 = 0,0228 ≈ 2,3%","note":"usar tabela ou regra 2σ"},{"equation":"Tempo de espera T~Exp(0,5) (média 2 min). P(T>3)?","note":"distribuição exponencial"},{"equation":"P(T>3) = e^{−0,5·3} = e^{−1,5} ≈ 0,223","note":"P(X>t)=e^{−λt}"},{"equation":"P(1<T<4) = e^{−0,5}−e^{−2} ≈ 0,607−0,135 = 0,472","note":"P(a<X<b) = e^{−λa}−e^{−λb}"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Distribuições Contínuas',href:'topic/distributions/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: Normal e Exponencial</h1>'+
      '<p class="topic-meta">padronização e P(X>t)</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Dist.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Dist.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawAxes('curva de densidade');
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/distributions/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){Dist.nextStep();};}}
    _drawAxes('curva de densidade');
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Distribuições Contínuas',href:'topic/distributions/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Dist.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawAxes('Distribuição Normal N(μ,σ²)');
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Dist.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Dist.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Dist.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Dist.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/distributions/practice');}},
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
  window.Dist=_pub;
})();
