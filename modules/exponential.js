/**
 * modules/exponential.js
 * Funções Exponenciais — crescimento, decaimento, equações, modelagem.
 * Canvas: curvas de crescimento/decaimento com parâmetros interativos.
 */
(function () {
  var TOPIC_ID = 'exponential';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawExpCurves(showDecay){
    Renderer.clear();
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var padL=40,padR=20,padT=30,padB=30;
    var cW=W-padL-padR,cH=H-padT-padB;
    var xMin=0,xMax=6;
    function px(x){return padL+cW*(x-xMin)/(xMax-xMin);}
    function py(y,yMax){return padT+cH*(1-y/yMax);}
    // Axes
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(padL,padT);ctx.lineTo(padL,padT+cH);ctx.lineTo(padL+cW,padT+cH);ctx.stroke();
    for(var x=0;x<=xMax;x++){var pxx=px(x);ctx.strokeStyle='#3e3e58';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(pxx,padT+cH-5);ctx.lineTo(pxx,padT+cH+5);ctx.stroke();ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(x,pxx,padT+cH+16);}
    if(showDecay){
      // y = 100 × 0.5^x (decay)
      var yMax=120;
      ctx.strokeStyle='#c87272';ctx.lineWidth=2;ctx.beginPath();
      for(var i=0;i<=200;i++){var x=xMin+i*(xMax-xMin)/200,y=100*Math.pow(0.5,x);if(i===0)ctx.moveTo(px(x),py(y,yMax));else ctx.lineTo(px(x),py(y,yMax));}ctx.stroke();
      // y = 100 × 0.8^x
      ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.5;ctx.beginPath();
      for(var i=0;i<=200;i++){var x=xMin+i*(xMax-xMin)/200,y=100*Math.pow(0.8,x);if(i===0)ctx.moveTo(px(x),py(y,yMax));else ctx.lineTo(px(x),py(y,yMax));}ctx.stroke();
      ctx.fillStyle='#c87272';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';ctx.fillText('y=100×0,5^t (r=50%)',padL+4,padT+18);
      ctx.fillStyle='#c8a44a';ctx.fillText('y=100×0,8^t (r=20%)',padL+4,padT+32);
      ctx.fillStyle='#3e3e58';ctx.fillText('decaimento',padL+4,padT+46);
    }else{
      var yMax=300;
      ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
      for(var i=0;i<=200;i++){var x=xMin+i*(xMax-xMin)/200,y=Math.pow(2,x);if(i===0)ctx.moveTo(px(x),py(y,yMax));else ctx.lineTo(px(x),py(y,yMax));}ctx.stroke();
      ctx.strokeStyle='#4ab8b2';ctx.lineWidth=1.5;ctx.beginPath();
      for(var i=0;i<=200;i++){var x=xMin+i*(xMax-xMin)/200,y=Math.pow(1.5,x);if(i===0)ctx.moveTo(px(x),py(y,yMax));else ctx.lineTo(px(x),py(y,yMax));}ctx.stroke();
      ctx.fillStyle='#5a8fd2';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';ctx.fillText('y = 2^x',padL+4,padT+18);
      ctx.fillStyle='#4ab8b2';ctx.fillText('y = 1,5^x',padL+4,padT+32);
      ctx.fillStyle='#3e3e58';ctx.fillText('crescimento',padL+4,padT+46);
    }
  }

  function _initCanvas(){_drawExpCurves(false);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Funções Exponenciais'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Funções Exponenciais</h1>'+
          '<p class="topic-meta">crescimento · decaimento · equações exponenciais · modelagem</p>'+
          '<div class="content-block">'+
            '<p>Uma função exponencial f(x) = a·b^x tem a variável no expoente. É o modelo natural para crescimento e decaimento — juros, população, meia-vida.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Forma geral</div>'+
              'f(x) = a·bˣ  onde a = valor inicial, b = base (b>0, b≠1)<br>'+
              'b > 1 → crescimento  |  0 < b < 1 → decaimento<br>'+
              'Domínio: ℝ  |  Imagem: (0,+∞)  (se a>0)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Equações exponenciais</div>'+
              'Se bˣ = bʸ → x = y  (bases iguais, expoentes iguais)<br>'+
              'Se as bases diferem: iguale expressando ambos com a mesma base.<br>'+
              'Ex: 4^x = 8 → 2^(2x) = 2³ → 2x = 3 → x = 3/2'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Modelagem prática</div>'+
              'Crescimento: P(t) = P₀·(1+r)^t<br>'+
              'Decaimento: N(t) = N₀·(1−r)^t<br>'+
              'Meia-vida: N(t) = N₀·(1/2)^(t/T½)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Exp.show(false)">Crescimento</div>'+
            '<div class="phase-step" onclick="Exp.show(true)">Decaimento</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/exponential/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Uma colônia de bactérias duplica a cada hora. Parte de 500. Quantas há após 4 horas?',note:'problema — crescimento exponencial'},
    {equation:'Modelo: N(t) = N₀ × 2^t',note:'base = 2 (duplica a cada hora)'},
    {equation:'N(4) = 500 × 2⁴',note:'substituir t=4'},
    {equation:'2⁴ = 16',note:'calcular a potência'},
    {equation:'N(4) = 500 × 16 = 8000',note:'resultado'},
    {equation:'Verificação: 500→1000→2000→4000→8000 ✓',note:'conferir sequência de duplicações'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Exp.',href:'topic/exponential/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: crescimento de bactérias</h1>'+
          '<p class="topic-meta">N(t) = 500 × 2^t</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Exp.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Exp.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Problema: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/exponential/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Exp.nextStep();};}}
    _initCanvas();Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Exp.',href:'topic/exponential/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Exp.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise,p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
    _drawExpCurves(ex.expType==='decay'||ex.expType==='halflife');
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="número" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Exp.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Exp.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Exp.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Exp.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    show:function(decay){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===(decay?1:0));});
      _drawExpCurves(decay);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/exponential/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=Math.max(1,Math.abs(cn)*0.01));
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
  window.Exp=_pub;
})();
