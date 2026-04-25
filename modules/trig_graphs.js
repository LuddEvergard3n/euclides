/**
 * modules/trig_graphs.js
 * Funções Trigonométricas — gráficos: y=A·sen(Bx+C)+D, amplitude, período, fase.
 * Canvas: curva interativa com parâmetros ajustáveis.
 */
(function () {
  var TOPIC_ID = 'trig_graphs';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawTrigGraph(A,B,C,D,fn,label){
    A=A||1;B=B||1;C=C||0;D=D||0;
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var padL=36,padR=16,padT=30,padB=30;
    var cW=W-padL-padR,cH=H-padT-padB;
    var xMin=0,xMax=720,yMin=-Math.abs(A)-Math.abs(D)-0.5,yMax=Math.abs(A)+Math.abs(D)+0.5;
    var yRange=yMax-yMin;
    function px(deg){return padL+cW*(deg-xMin)/(xMax-xMin);}
    function py(y){return padT+cH*(1-(y-yMin)/yRange);}
    // Grid lines y=0, y=A+D, y=-(A)+D
    [0,A+D,-A+D,D].forEach(function(yv){
      ctx.strokeStyle='rgba(46,46,74,0.6)';ctx.lineWidth=0.5;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(padL,py(yv));ctx.lineTo(padL+cW,py(yv));ctx.stroke();
    });
    ctx.setLineDash([]);
    // X axis
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padL,py(0));ctx.lineTo(padL+cW,py(0));ctx.stroke();
    // Degree ticks
    for(var d=0;d<=720;d+=90){
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=0.8;
      ctx.beginPath();ctx.moveTo(px(d),py(0)-4);ctx.lineTo(px(d),py(0)+4);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(d+'°',px(d),py(0)+14);
    }
    // Plot
    var useFn=fn==='cos'?Math.cos:Math.sin;
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<=400;i++){
      var deg=xMin+i*(xMax-xMin)/400;
      var rad=(B*deg+C)*Math.PI/180;
      var y=A*useFn(rad)+D;
      if(i===0)ctx.moveTo(px(deg),py(y));else ctx.lineTo(px(deg),py(y));
    }
    ctx.stroke();
    // Labels
    ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('A='+A,padL+4,padT+14);
    ctx.fillStyle='#4ab8b2';ctx.fillText('T='+(360/B)+'°',padL+4+40,padT+14);
    ctx.fillStyle='#e8e8f2';ctx.fillText(label||(fn||'sen'),padL+4+90,padT+14);
    // Amplitude markers
    ctx.strokeStyle='rgba(200,164,74,0.4)';ctx.lineWidth=1;ctx.setLineDash([2,2]);
    ctx.beginPath();ctx.moveTo(padL,py(A+D));ctx.lineTo(padL+cW,py(A+D));ctx.stroke();
    ctx.beginPath();ctx.moveTo(padL,py(-A+D));ctx.lineTo(padL+cW,py(-A+D));ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(200,164,74,0.6)';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='right';
    ctx.fillText(A+D,padL-2,py(A+D)+4);ctx.fillText(-A+D,padL-2,py(-A+D)+4);
  }

  function _initCanvas(){_drawTrigGraph(2,1,0,0,'sen','y=2·sen(x)');}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Gráficos'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Funções Trigonométricas — Gráficos</h1>'+
          '<p class="topic-meta">y=A·sen(Bx+C)+D · amplitude · período · fase · deslocamento</p>'+
          '<div class="content-block">'+
            '<p>Os parâmetros A, B, C, D transformam o gráfico da função seno/cosseno padrão de forma independente e previsível.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Forma geral: y = A·f(Bx + C) + D</div>'+
              '|A| = amplitude (distância do eixo ao máximo/mínimo)<br>'+
              'T = 360°/B = período<br>'+
              'C/B = fase (deslocamento horizontal, em graus)<br>'+
              'D = deslocamento vertical (novo eixo de simetria)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Máximo e mínimo</div>'+
              'Máx = A + D  |  Mín = −A + D<br>'+
              'Ex: y=3·sen(x)−1 → máx=2, mín=−4'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Efeito de B</div>'+
              'B=2 → comprime para metade do período (T=180°)<br>'+
              'B=1/2 → estica para dobro do período (T=720°)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="TG.showGraph(2,1,0,0,\'sen\')">A=2</div>'+
            '<div class="phase-step" onclick="TG.showGraph(1,2,0,0,\'sen\')">B=2</div>'+
            '<div class="phase-step" onclick="TG.showGraph(1,1,0,2,\'sen\')">D=2</div>'+
            '<div class="phase-step" onclick="TG.showGraph(3,1,0,0,\'cos\')">cos</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/trig_graphs/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Analise: y = 3·sen(2x) − 1',note:'identificar parâmetros'},
    {equation:'A = 3 → amplitude = 3',note:'|A| = 3'},
    {equation:'B = 2 → período T = 360°/2 = 180°',note:'período comprimido'},
    {equation:'C = 0 → sem deslocamento horizontal',note:'fase = 0'},
    {equation:'D = −1 → eixo de simetria em y = −1',note:'deslocamento vertical'},
    {equation:'Máximo = A+D = 3+(−1) = 2  |  Mínimo = −A+D = −4',note:'valores extremos'},
    {equation:'Zeros em: 2x = 0°, 180°, 360°... → x = 0°, 90°, 180°...',note:'encontrar zeros'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Gráficos',href:'topic/trig_graphs/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: y = 3·sen(2x) − 1</h1>'+
          '<p class="topic-meta">leitura de todos os parâmetros</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="TG.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="TG.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawTrigGraph(3,2,0,-1,'sen','y=3·sen(2x)−1');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Analisar: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/trig_graphs/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){TG.nextStep();};}}
    _drawTrigGraph(3,2,0,-1,'sen','y=3·sen(2x)−1');Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Gráficos',href:'topic/trig_graphs/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="TG.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    _drawTrigGraph(ex.A,ex.B,ex.C||0,ex.D||0,ex.fn);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isCompose=ex.tgType==='compose';
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">'+
      (isCompose?'Ex: y = 3·sen(2x)':'Número inteiro ou grau: 180°')+
      '</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="TG.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="TG.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="TG.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')TG.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showGraph:function(A,B,C,D,fn){
      var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var defs=[[2,1,0,0],[1,2,0,0],[1,1,0,2],[3,1,0,0]];
      document.querySelectorAll('.phase-step').forEach(function(t,i){
        t.classList.toggle('active',defs[i][0]===A&&defs[i][1]===B&&defs[i][2]===C&&defs[i][3]===D);});
      _drawTrigGraph(A,B,C,D,fn);
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/trig_graphs/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(/\s+/g,''),c=String(_pr.exercise.answer).replace(/\s+/g,'');
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.5);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
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
  window.TG=_pub;
})();
