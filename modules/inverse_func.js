/**
 * modules/inverse_func.js
 * Função Inversa e Bijeção
 */
(function () {
  var TOPIC_ID = 'inverse_func';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawInverse(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,scale=35;
    function px(x){return cx+x*scale;} function py(y){return cy-y*scale;}
    // Grid
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=0.8;
    for(var i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(px(i),20);ctx.lineTo(px(i),H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,py(i));ctx.lineTo(W-20,py(i));ctx.stroke();}
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    // y=x symmetry line
    ctx.strokeStyle='rgba(114,114,140,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(px(-4),py(-4));ctx.lineTo(px(4),py(4));ctx.stroke();ctx.setLineDash([]);
    // f(x) = 2x+1
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px(-3),py(-5));ctx.lineTo(px(3),py(7));ctx.stroke();
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('f(x)=2x+1',px(1.5),py(5)-8);
    // f⁻¹(x) = (x-1)/2
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px(-5),py(-3));ctx.lineTo(px(7),py(3));ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.textAlign='right';
    ctx.fillText('f⁻¹(x)=(x−1)/2',px(3.5),py(1.5)+14);
    ctx.fillStyle='#72728c';ctx.textAlign='center';
    ctx.fillText('reflexão em y=x',W/2,H-8);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Função Inversa e Bijeção'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Função Inversa e Bijeção</h1>'+
      '<p class="topic-meta">injetora · sobrejetora · bijetora · f⁻¹ · gráfico como reflexão</p>'+
      '<div class="content-block">'+'<p>Uma função é invertível se e somente se é bijetora. A inversa desfaz a operação original, e seu gráfico é a reflexão de f em y=x.</p>'+'<div class="concept-highlight"><div class="hl-label">Tipos de função</div>Injetora: x₁≠x₂ → f(x₁)≠f(x₂)  (todo y tem no máximo 1 pré-imagem)<br>Sobrejetora: para todo y∈Im, existe x com f(x)=y<br>Bijetora: injetora E sobrejetora → existe f⁻¹</div>'+'<div class="concept-highlight"><div class="hl-label">Encontrar f⁻¹</div>1. Escreva y=f(x)<br>2. Troque x e y: x=f(y)<br>3. Resolva para y: y=f⁻¹(x)<br>Domínio de f⁻¹ = imagem de f</div>'+'<div class="concept-highlight"><div class="hl-label">Propriedade fundamental</div>f⁻¹(f(x)) = x  e  f(f⁻¹(x)) = x<br>Gráfico de f⁻¹ = reflexão de f no eixo y=x</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/inverse_func/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawInverse();
  }

  var _exSteps=[{"equation":"f(x) = 2x + 1. Encontre f⁻¹(x).","note":"problema"},{"equation":"Passo 1: escreva y = 2x + 1","note":"nomear a saída"},{"equation":"Passo 2: troque x↔y: x = 2y + 1","note":"inverter papéis"},{"equation":"Passo 3: resolva para y: 2y = x − 1 → y = (x−1)/2","note":"isolar a nova variável dependente"},{"equation":"f⁻¹(x) = (x−1)/2","note":"função inversa"},{"equation":"Verificação: f⁻¹(f(3)) = f⁻¹(7) = (7−1)/2 = 3 ✓","note":"confirmar f⁻¹(f(x))=x"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Função Inversa e Bijeção',href:'topic/inverse_func/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: inversa de f(x) = 2x + 1</h1>'+
      '<p class="topic-meta">procedimento passo a passo</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="InvF.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="InvF.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawInverse();
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/inverse_func/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){InvF.nextStep();};}}
    _drawInverse();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Função Inversa e Bijeção',href:'topic/inverse_func/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="InvF.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawInverse();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="InvF.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="InvF.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="InvF.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')InvF.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/inverse_func/practice');}},
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
  window.InvF=_pub;
})();
