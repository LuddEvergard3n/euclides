(function(){
  var TOPIC_ID='graph_theory';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,sc=40;
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=0.8;
    for(var i=-5;i<=5;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('G = (V, E) — vértices e arestas',W/2,H-5);
  }
  function _drawGraph(){
    Renderer.clear();
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var verts=[[W/2,60],[W/2-120,H/2],[W/2+120,H/2],[W/2-70,H-60],[W/2+70,H-60]];
    var edges=[[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]];
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    edges.forEach(function(e){
      ctx.beginPath();ctx.moveTo(verts[e[0]][0],verts[e[0]][1]);ctx.lineTo(verts[e[1]][0],verts[e[1]][1]);ctx.stroke();
    });
    var labels=['A','B','C','D','E'];
    verts.forEach(function(v,i){
      ctx.fillStyle='#1e1e30';ctx.beginPath();ctx.arc(v[0],v[1],18,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='#e8e8f2';ctx.font='13px JetBrains Mono';ctx.textAlign='center';
      ctx.fillText(labels[i],v[0],v[1]+5);
    });
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('V=5, E=6,  Σgraus=12',W/2,H-5);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Teoria dos Grafos'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Teoria dos Grafos</h1>'+
      '<p class="topic-meta">grau · Euler · caminhos · árvores geradoras · coloracão</p>'+
      '<div class="content-block">'+'<p>Um grafo G=(V,E) consiste em vértices V e arestas E. Grafos modelam redes, rotas, dependências e estruturas combinatórias.</p>'+'<div class="concept-highlight"><div class="hl-label">Conceitos básicos</div>Grau d(v) = número de arestas incidentes em v.<br>Lema do aperto de mãos: Σd(v) = 2|E|<br>Caminho: sequência de vértices conectados. Ciclo: caminho fechado.</div>'+'<div class="concept-highlight"><div class="hl-label">Euler e Hamilton</div>Circuito Euleriano: percorre todas as ARESTAS exatamente uma vez.<br>Existe ⇔ grafo conexo e todos os graus são pares.<br>Circuito Hamiltoniano: percorre todos os VÉRTICES exatamente uma vez (NP-completo verificar).</div>'+'<div class="concept-highlight"><div class="hl-label">Árvore geradora e coloracão</div>Árvore geradora: subgrafo conexo acíclico com todos os vértices.<br>Cayley: Kₙ tem n^(n-2) árvores geradoras.<br>Número cromático χ(G): mínimo de cores para colorir G sem conflito.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/graph_theory/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawGraph();
  }

  var _exSteps=[{"equation":"K₄: grafo completo com 4 vértices.  |E| = 4·3/2 = 6.","note":"número de arestas em Kₙ: n(n-1)/2"},{"equation":"Grau de cada vértice: 3 (conectado a todos os outros).","note":"grafo regular de grau 3"},{"equation":"Σd(v) = 4·3 = 12 = 2|E| = 2·6 = 12. ✓","note":"lema do aperto de mãos"},{"equation":"Todos os graus pares? Não (3 é ímpar) → K₄ não tem circuito Euleriano.","note":"critério de Euler"},{"equation":"Árvores geradoras: 4^(4-2) = 16 (Cayley).","note":"fórmula de Cayley"},{"equation":"χ(K₄) = 4 (cada vértice conectado a todos: precisamos 4 cores).","note":"número cromático = n para grafo completo"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Teoria dos Grafos',href:'topic/graph_theory/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: grafo K₄</h1>'+
      '<p class="topic-meta">graus, Euler, árvores geradoras, coloracão</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="GraphTh.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="GraphTh.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawGraph();
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
    if(next){if(i===n-1){next.textContent='Praticar \u2192';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/graph_theory/practice');};}    else{next.textContent='Pr\u00f3ximo \u2192';next.onclick=function(){GraphTh.nextStep();};}}
    _drawGraph();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Teoria dos Grafos',href:'topic/graph_theory/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="GraphTh.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawGraph();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="GraphTh.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="GraphTh.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="GraphTh.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')GraphTh.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/graph_theory/practice');}},
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
  window.GraphTh=_pub;
})();
