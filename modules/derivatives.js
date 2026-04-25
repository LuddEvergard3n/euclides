/**
 * modules/derivatives.js
 * Derivadas
 */
(function () {
  var TOPIC_ID = 'derivatives';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawAxes(label){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W*0.45,cy=H*0.55,sc=50;
    // Fine grid
    ctx.strokeStyle='#17172a';ctx.lineWidth=0.6;
    for(var i=-4;i<=5;i++){
      ctx.beginPath();ctx.moveTo(cx+i*sc,20);ctx.lineTo(cx+i*sc,H-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(20,cy+i*sc);ctx.lineTo(W-20,cy+i*sc);ctx.stroke();
    }
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    // Axis labels
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono';ctx.textAlign='center';
    ctx.fillText('x',W-14,cy-6);ctx.textAlign='left';ctx.fillText('y',cx+5,28);
    // Tick marks
    ctx.fillStyle='#2e2e4a';ctx.font='9px JetBrains Mono';ctx.textAlign='center';
    [-2,-1,1,2,3].forEach(function(v){ctx.fillText(v,cx+v*sc,cy+12);});
    // f(x)=x² curve (blue)
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2.5;ctx.beginPath();
    var first=true;
    for(var xi=-3.2;xi<=3.2;xi+=0.04){
      var yi=xi*xi;
      var xp=cx+xi*sc,yp=cy-yi*sc;
      if(yp<18)continue;
      if(first){ctx.moveTo(xp,yp);first=false;}else ctx.lineTo(xp,yp);
    }
    ctx.stroke();
    // Tangent at x=1: f'(1)=2*1=2, point (1,1), line y-1=2(x-1) => y=2x-1
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.8;
    ctx.beginPath();
    ctx.moveTo(cx-1*sc,cy-(-3)*sc);   // x=-1, y=2*(-1)-1=-3
    ctx.lineTo(cx+2.5*sc,cy-(4)*sc);  // x=2.5, y=2*2.5-1=4
    ctx.stroke();
    // Point of tangency at (1,1)
    ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(cx+sc,cy-sc,5,0,Math.PI*2);ctx.fill();
    // Labels
    ctx.fillStyle='#5a8fd2';ctx.font='bold 11px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('f(x)=x²',cx+3.2*sc+4,cy-3.2*3.2*sc+4);
    ctx.fillStyle='#c8a44a';
    ctx.fillText("f'(1)=2",cx+sc+8,cy-sc-8);
    ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono';ctx.textAlign='left';
    ctx.fillText('tangente em x=1',cx-sc*0.5,cy-4*sc);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Derivadas'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Derivadas</h1>'+
      '<p class="topic-meta">regra da cadeia · produto · quociente · implícita · logarítmica</p>'+
      '<div class="content-block">'+'<p>A derivada f′(x) mede a taxa de variação instantânea de f. Geometricamente é a inclinação da reta tangente.</p>'+'<div class="concept-highlight"><div class="hl-label">Regras fundamentais</div>(xⁿ)′ = nxⁿ⁻¹ | (eˣ)′ = eˣ | (ln x)′ = 1/x<br>(sin x)′ = cos x | (cos x)′ = −sin x | (tan x)′ = sec²x</div>'+'<div class="concept-highlight"><div class="hl-label">Regras de cálculo</div>Produto: (fg)′ = f′g + fg′<br>Quociente: (f/g)′ = (f′g − fg′)/g²<br>Cadeia: (f(g(x)))′ = f′(g(x))·g′(x)</div>'+'<div class="concept-highlight"><div class="hl-label">Derivada implícita</div>F(x,y)=0: diferenciar ambos em x, tratar y como função de x.<br>Exemplo: x²+y²=1 → 2x+2y·y′=0 → y′=−x/y</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/derivatives/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawAxes('f(x)=x² e reta tangente em x=1');
  }

  var _exSteps=[{"equation":"f(x) = (x²+1)³. Calcule f′(x).","note":"regra da cadeia"},{"equation":"f′(x) = 3(x²+1)² · (x²+1)′","note":"derivada externa × derivada interna"},{"equation":"= 3(x²+1)² · 2x = 6x(x²+1)²","note":"resultado"},{"equation":"g(x) = x² · eˣ. Calcule g′(x).","note":"regra do produto"},{"equation":"g′(x) = (x²)′eˣ + x²(eˣ)′","note":"(fg)′ = f′g + fg′"},{"equation":"= 2xeˣ + x²eˣ = xeˣ(x+2)","note":"fatorar"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Derivadas',href:'topic/derivatives/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: regra da cadeia e produto</h1>'+
      '<p class="topic-meta">derivar composição e produto de funções</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Deriv.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Deriv.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawAxes('f′(x) = inclinação da tangente');
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/derivatives/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){Deriv.nextStep();};}}
    _drawAxes('f′(x) = inclinação da tangente');
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Derivadas',href:'topic/derivatives/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Deriv.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawAxes('f(x)=x² e reta tangente em x=1');
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Deriv.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Deriv.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Deriv.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Deriv.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/derivatives/practice');}},
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
  window.Deriv=_pub;
})();
