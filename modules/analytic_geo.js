/**
 * modules/analytic_geo.js
 * Geometria Analítica Avançada
 */
(function () {
  var TOPIC_ID = 'analytic_geo';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawGrid(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2;
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    for(var i=-4;i<=4;i++){var x=cx+i*40,y=cy+i*40;
      ctx.beginPath();ctx.moveTo(x,20);ctx.lineTo(x,H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-20,y);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    // draw line 3x+4y-12=0 (passes (4,0),(0,3))
    var x1=20,y1=cy-(3*((x1-cx)/40))*(-40/4);
    // simpler: parametric
    var pts=[];
    for(var xi=-5;xi<=5;xi+=0.1){var yi=-(3*xi+(-12))/4;pts.push([cx+xi*40,cy-yi*40]);}
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    pts.forEach(function(p,i){if(i===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);});ctx.stroke();
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('3x+4y−12=0',cx+5,cy-3*40-10);
    // Point P(1,1)
    ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(cx+40,cy-40,5,0,Math.PI*2);ctx.fill();
    ctx.fillText('P(1,1)',cx+44,cy-36);
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('d=|3·1+4·1−12|/√(9+16)=|−5|/5=1',W/2,H-8);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Geometria Analítica Avançada'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Geometria Analítica Avançada</h1>'+
      '<p class="topic-meta">reta geral · distância ponto-reta · posição relativa · área por coordenadas</p>'+
      '<div class="content-block">'+'<p>A forma geral Ax+By+C=0 é mais poderosa que y=mx+b: funciona para retas verticais e facilita cálculo de distâncias.</p>'+'<div class="concept-highlight"><div class="hl-label">Forma geral da reta</div>Ax + By + C = 0 (A,B não ambos nulos)<br>Inclinação: m = −A/B | Ordenada: y₀ = −C/B</div>'+'<div class="concept-highlight"><div class="hl-label">Distância ponto-reta</div>d(P,r) = |Ax₀ + By₀ + C| / √(A²+B²)<br>P=(x₀,y₀), reta r: Ax+By+C=0</div>'+'<div class="concept-highlight"><div class="hl-label">Posição relativa (duas retas)</div>Paralelas: mesma razão A/B, C diferente<br>Coincidentes: equação idêntica<br>Concorrentes: razão A/B diferente</div>'+'<div class="concept-highlight"><div class="hl-label">Área por coordenadas</div>A = |x_A(y_B−y_C)+x_B(y_C−y_A)+x_C(y_A−y_B)| / 2</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/analytic_geo/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawGrid();
  }

  var _exSteps=[{"equation":"d(P, r): reta 3x+4y−12=0, ponto P(1,1)","note":"problema"},{"equation":"d = |Ax₀ + By₀ + C| / √(A²+B²)","note":"fórmula da distância ponto-reta"},{"equation":"= |3·1 + 4·1 − 12| / √(9+16)","note":"substituir A=3,B=4,C=−12,P=(1,1)"},{"equation":"= |3 + 4 − 12| / √25 = |−5| / 5","note":"calcular numerador e denominador"},{"equation":"d = 5/5 = 1","note":"resultado"},{"equation":"Área △ com A(0,0),B(4,0),C(0,3): A=|0(0−3)+4(3−0)+0(0−0)|/2=6","note":"área por coordenadas"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Geometria Analítica Avançada',href:'topic/analytic_geo/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: distância ponto-reta</h1>'+
      '<p class="topic-meta">reta 3x+4y−12=0, ponto P(1,1)</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="AG.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="AG.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawGrid();
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/analytic_geo/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){AG.nextStep();};}}
    _drawGrid();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Geometria Analítica Avançada',href:'topic/analytic_geo/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="AG.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawGrid();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="AG.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="AG.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="AG.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')AG.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/analytic_geo/practice');}},
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
  window.AG=_pub;
})();
