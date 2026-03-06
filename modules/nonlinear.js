/**
 * modules/nonlinear.js
 * Sistemas Não-lineares
 */
(function () {
  var TOPIC_ID = 'nonlinear';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawParabolaLine(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H*0.7,scale=35;
    function px(x){return cx+x*scale;} function py(y){return cy-y*scale;}
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-10);ctx.stroke();
    // y=x^2
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    for(var xi=-3;xi<=3;xi+=0.05){if(xi===-3)ctx.moveTo(px(xi),py(xi*xi));else ctx.lineTo(px(xi),py(xi*xi));}
    ctx.stroke();
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('y=x²',px(1.5)+4,py(2.25)-6);
    // y=x+2
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px(-3),py(-1));ctx.lineTo(px(3),py(5));ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.fillText('y=x+2',px(2)+4,py(4));
    // Intersection points (2,4) and (-1,1)
    [[2,4],[-1,1]].forEach(function(p){
      ctx.fillStyle='#4ab8b2';ctx.beginPath();ctx.arc(px(p[0]),py(p[1]),6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#4ab8b2';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText('('+p[0]+','+p[1]+')',px(p[0]),py(p[1])-10);});
    ctx.fillStyle='#72728c';ctx.textAlign='center';
    ctx.fillText('interseções: (2,4) e (−1,1)',W/2,H-5);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas Não-lineares'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Sistemas Não-lineares</h1>'+
      '<p class="topic-meta">reta + parábola · reta + circunferência · substituição · interseções</p>'+
      '<div class="content-block">'+'<p>Sistemas não-lineares surgem quando uma equação tem grau maior que 1. A técnica é sempre substituição: use a equação mais simples para eliminar uma variável.</p>'+'<div class="concept-highlight"><div class="hl-label">Reta + Parábola</div>Substitua y da reta na parábola → equação 2º grau em x.<br>Discriminante: Δ>0 → 2 pts | Δ=0 → tangente | Δ<0 → sem intersecção</div>'+'<div class="concept-highlight"><div class="hl-label">Reta + Circunferência</div>Substitua y (ou x) da reta na circunferência → equação 2º grau.<br>Compare d (distância centro-reta) com r: d<r secante, d=r tangente, d>r externa</div>'+'<div class="concept-highlight"><div class="hl-label">Estratégia geral</div>1. Isole uma variável na equação mais simples.<br>2. Substitua na outra.<br>3. Resolva e retorne para achar os pares.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/nonlinear/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawParabolaLine();
  }

  var _exSteps=[{"equation":"Resolver: y=x² e y=x+2","note":"sistema reta + parábola"},{"equation":"Igualar: x² = x+2","note":"ambas expressam y — substituir"},{"equation":"x² − x − 2 = 0","note":"equação 2º grau"},{"equation":"(x−2)(x+1) = 0  →  x=2 ou x=−1","note":"fatorar"},{"equation":"x=2 → y=4  |  x=−1 → y=1","note":"retornar para achar y"},{"equation":"Soluções: (2,4) e (−1,1)","note":"pares solução"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas Não-lineares',href:'topic/nonlinear/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: reta y=x+2 e parábola y=x²</h1>'+
      '<p class="topic-meta">substituição, equação 2º grau, interpretação</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="NL.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="NL.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawParabolaLine();
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/nonlinear/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){NL.nextStep();};}}
    _drawParabolaLine();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sistemas Não-lineares',href:'topic/nonlinear/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="NL.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawParabolaLine();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="NL.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="NL.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="NL.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')NL.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/nonlinear/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(',','.'),c=String(_pr.exercise.answer).replace(',','.');
      var sn=parseFloat(s.replace(/[^0-9.-]/g,'')),cn=parseFloat(c.replace(/[^0-9.-]/g,''));
      var ok=s===c||inp.value.trim()===String(_pr.exercise.answer)||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+String(_pr.exercise.answer);
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
  window.NL=_pub;
})();
