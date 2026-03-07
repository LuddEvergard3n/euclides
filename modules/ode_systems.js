(function(){
  var TOPIC_ID='ode_systems';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;
  function _drawCanvas(){var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();Renderer.clear();
    var cx=W/2,cy=H/2,sc=55;
    ctx.strokeStyle='#1a1a28';ctx.lineWidth=0.6;
    for(var i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();ctx.beginPath();ctx.moveTo(20,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();}
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('x\u2081',W-12,cy-5);ctx.textAlign='left';ctx.fillText('x\u2082',cx+5,28);
    ctx.strokeStyle='rgba(200,164,74,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(cx-3*sc,cy);ctx.lineTo(cx+3*sc,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-3*sc,cy+3*sc);ctx.lineTo(cx+3*sc,cy-3*sc);ctx.stroke();
    ctx.setLineDash([]);
    var tColors=['#4ab8b2','#5a8fd2','#c45252'];
    [0.25,0.5,0.8].forEach(function(r,ci){
      ctx.strokeStyle=tColors[ci];ctx.lineWidth=1.5;ctx.beginPath();
      for(var k=0;k<=60;k++){
        var t=-0.7+k*0.012;
        var xv=r*(Math.exp(3*t)+Math.exp(2*t));
        var yv=-r*Math.exp(2*t);
        var xp=cx+xv*sc,yp=cy+yv*sc;
        if(xp<5||xp>W-5||yp<5||yp>H-5){ctx.beginPath();continue;}
        if(k===0)ctx.moveTo(xp,yp);else ctx.lineTo(xp,yp);
      }
      ctx.stroke();
    });
    ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('\u03bb\u2081=3, \u03bb\u2082=2 \u2014 N\u00f3 inst\u00e1vel',W/2,H-6);
}
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Sistemas de EDO'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Sistemas de EDO</h1>'+
      '<p class="topic-meta">sistemas lineares · autovalores · retrato de fase · estabilidade</p>'+
      '<div class="content-block">'+'<div class="concept-highlight"><div class="hl-label">Redução a sistema de 1ª ordem</div>y&#39;&#39; + py&#39; + qy = 0  →  x₁=y, x₂=y&#39;<br>x₁&#39; = x₂<br>x₂&#39; = -qx₁ - px₂<br>Qualquer EDO de ordem n vira sistema n×n.</div>'+'<div class="concept-highlight"><div class="hl-label">Solução via autovalores</div>x&#39; = Ax  →  det(A-λI) = 0<br>Autovalores reais distintos: x = c₁v₁e^(λ₁t) + c₂v₂e^(λ₂t)<br>Autovalores complexos α±βi: soluções oscilatórias com e^(αt).</div>'+'<div class="concept-highlight"><div class="hl-label">Estabilidade e retrato de fase</div>Re(λ)<0: equilíbrio estável (espiral/nó)<br>Re(λ)>0: instável (trajetórias se afastam)<br>Re(λ)=0: centro (orb. fechadas)<br>Autovalores de sinais opostos: ponto de sela</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/ode_systems/example\')">Ver exemplo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawCanvas();
  }
  var _exSteps=[{"equation": "x' = Ax, A = [[3,1],[0,2]]", "note": "sistema 2x2 triangular superior"}, {"equation": "det(A-λI) = (3-λ)(2-λ) = 0", "note": "equação característica"}, {"equation": "λ₁=3, λ₂=2  (autovalores reais positivos)", "note": "sistema instável"}, {"equation": "v₁=(1,0), v₂=(1,-1)  (autovetores)", "note": "de (A-λI)v=0"}, {"equation": "x(t) = c₁(1,0)e^(3t) + c₂(1,-1)e^(2t)", "note": "solução geral"}, {"equation": "Como λ>0: trajetórias divergem → Nó instável", "note": "classificação do retrato de fase"}];
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
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Sistemas de EDO',href:'topic/ode_systems/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo passo a passo</h1>'+
      '<p class="topic-meta">sistemas lineares · autovalores · retrato de fase · estabilidade</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="OdeSystems.prevStep()" disabled>\u2190 Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="OdeSystems.nextStep()">Pr\u00f3ximo \u2192</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'In\u00edcio',href:''},{label:'Sistemas de EDO',href:'topic/ode_systems/concept'},{label:'Pr\u00e1tica'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exerc\u00edcio 1</span>'+
      '<label class="hint-toggle" onclick="OdeSystems.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="OdeSystems.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="OdeSystems.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="OdeSystems.nextExercise()" style="display:none">Pr\u00f3ximo \u2192</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')OdeSystems.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/ode_systems/practice');}},
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
  window.OdeSystems=_pub;
})();
