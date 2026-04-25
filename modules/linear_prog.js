(function(){
  var TOPIC_ID='linear_prog';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(){
    // Minimal first-quadrant axes: origin at bottom-left, only x>=0 y>=0
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var ox=60,oy=H-50,sc=40,mx=Math.floor((W-ox-20)/sc),my=Math.floor((oy-20)/sc);
    // Grid lines (first quadrant only)
    ctx.strokeStyle='#1e1e2e';ctx.lineWidth=0.8;
    for(var i=1;i<=mx;i++){ctx.beginPath();ctx.moveTo(ox+i*sc,20);ctx.lineTo(ox+i*sc,oy);ctx.stroke();}
    for(var j=1;j<=my;j++){ctx.beginPath();ctx.moveTo(ox,oy-j*sc);ctx.lineTo(W-20,oy-j*sc);ctx.stroke();}
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ox,20);ctx.lineTo(ox,oy+8);ctx.stroke();   // y-axis
    ctx.beginPath();ctx.moveTo(ox-8,oy);ctx.lineTo(W-20,oy);ctx.stroke(); // x-axis
    // Tick labels
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    for(var i=1;i<=mx;i++) ctx.fillText(i,ox+i*sc,oy+14);
    ctx.textAlign='right';
    for(var j=1;j<=my;j++) ctx.fillText(j,ox-6,oy-j*sc+4);
    // Axis labels
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('x',W-14,oy+4);
    ctx.fillText('y',ox,14);
  }
  function _drawLP(){
    _drawAxes();
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var ox=60,oy=H-50,sc=40;
    // Feasible region: x+y<=4, x>=0, y>=0 — triangle (0,0),(4,0),(0,4)
    ctx.fillStyle='rgba(90,143,210,0.18)';
    ctx.beginPath();
    ctx.moveTo(ox,oy);
    ctx.lineTo(ox+4*sc,oy);
    ctx.lineTo(ox,oy-4*sc);
    ctx.closePath();ctx.fill();
    // Constraint line x+y=4
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(ox+4*sc,oy);ctx.lineTo(ox,oy-4*sc);ctx.stroke();
    // Objective line z=3x+2y=12 (dashed, through optimum (4,0))
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.moveTo(ox+4*sc,oy);ctx.lineTo(ox,oy-6*sc);ctx.stroke();
    ctx.setLineDash([]);
    // Vertices
    [[0,0],[4,0],[0,4]].forEach(function(p,i){
      ctx.fillStyle=i===1?'#c8a44a':'#4ab8b2';
      ctx.beginPath();ctx.arc(ox+p[0]*sc,oy-p[1]*sc,5,0,Math.PI*2);ctx.fill();
    });
    // Labels
    ctx.fillStyle='#c8a44a';ctx.font='9px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('(4,0) z=12',ox+4*sc+6,oy-4);
    ctx.fillStyle='#4ab8b2';
    ctx.fillText('(0,4)',ox+4,oy-4*sc-8);
    ctx.fillStyle='#72728c';ctx.textAlign='center';
    ctx.fillText('x+y≤4  z=3x+2y',W/2,20);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Programação Linear'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Programação Linear</h1>'+
      '<p class="topic-meta">método gráfico · região viável · vértices · simplex</p>'+
      '<div class="content-block">'+'<p>A PL otimiza uma função objetivo linear sujeita a restrições lineares. O ótimo sempre ocorre em um vértice da região viável.</p>'+'<div class="concept-highlight"><div class="hl-label">Forma padrão</div>max cᵀx sujeito a Ax ≤ b, x ≥ 0<br>Função objetivo: z = c₁x + c₂y + ...<br>Restrições definem a região viável (políedro).</div>'+'<div class="concept-highlight"><div class="hl-label">Método gráfico (2D)</div>1. Desenhar as restrições e identificar a região viável<br>2. Encontrar os vértices (interseções das fronteiras)<br>3. Avaliar z em cada vértice<br>4. O maior (ou menor) valor é o ótimo</div>'+'<div class="concept-highlight"><div class="hl-label">Método Simplex</div>Percorre os vértices da região viável em direção ao ótimo.<br>Complexidade exponencial no pior caso, mas muito eficiente na prática.<br>Usado em milhares de otimizações industriais.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/linear_prog/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawLP();
  }

  var _exSteps=[{"equation":"max z = 3x+2y,  x+y ≤ 4,  x ≥ 0,  y ≥ 0.","note":"problema"},{"equation":"Região viável: triângulo com vértices (0,0), (4,0), (0,4).","note":"desenhar restrições"},{"equation":"z(0,0) = 0 | z(4,0) = 12 | z(0,4) = 8","note":"avaliar z nos vértices"},{"equation":"z_max = 12 em (4,0).","note":"escolher o maior"},{"equation":"Linha de nível z=12: 3x+2y=12 — tangencia a região no vértice (4,0).","note":"interpretação gráfica"},{"equation":"Solução ótima: x=4, y=0, z=12.","note":"resultado"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Programação Linear',href:'topic/linear_prog/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: max 3x+2y s.t. x+y≤4</h1>'+
      '<p class="topic-meta">método gráfico passo a passo</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="LinProg.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="LinProg.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawLP();
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
    if(next){if(i===n-1){next.textContent='Praticar \u2192';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/linear_prog/practice');};}    else{next.textContent='Pr\u00f3ximo \u2192';next.onclick=function(){LinProg.nextStep();};}}
    _drawLP();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Programação Linear',href:'topic/linear_prog/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="LinProg.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawLP();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="LinProg.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="LinProg.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="LinProg.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')LinProg.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/linear_prog/practice');}},
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
  window.LinProg=_pub;
})();
