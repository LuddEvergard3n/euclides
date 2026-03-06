/**
 * modules/modular.js
 * Equações Modulares e Irracionais — |ax+b|=c, √(f(x))=k.
 * Canvas: reta numérica com os dois casos do módulo.
 */
(function () {
  var TOPIC_ID = 'modular';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawVshape(a,b,c,highlight){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    // Draw y = |ax+b| and horizontal y=c
    var padL=40,padR=20,padT=24,padB=30;
    var cW=W-padL-padR,cH=H-padT-padB;
    var xv=-b/a; // vertex x
    var xMin=xv-4,xMax=xv+4;
    function px(x){return padL+cW*(x-xMin)/(xMax-xMin);}
    function py(y){return padT+cH*(1-y/(c*2+1));}
    // Axes
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.2;
    var y0=py(0);
    ctx.beginPath();ctx.moveTo(padL,y0);ctx.lineTo(padL+cW,y0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px(xv),padT);ctx.lineTo(px(xv),padT+cH);ctx.stroke();
    // V shape: y=|ax+b|
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<=200;i++){var x=xMin+i*(xMax-xMin)/200,y=Math.abs(a*x+b);if(i===0)ctx.moveTo(px(x),py(y));else ctx.lineTo(px(x),py(y));}ctx.stroke();
    // y = c horizontal
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);
    ctx.beginPath();ctx.moveTo(padL,py(c));ctx.lineTo(padL+cW,py(c));ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';ctx.fillText('y = '+c,padL+cW-30,py(c)-5);
    // Intersection points
    var x1=(c-b)/a,x2=(-c-b)/a;
    [x1,x2].forEach(function(xp){
      if(xp>=xMin&&xp<=xMax){ctx.fillStyle='#c8a44a';ctx.beginPath();ctx.arc(px(xp),py(c),5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('x='+Math.round(xp*100)/100,px(xp),py(c)+16);}
    });
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';ctx.fillText('y=|'+a+'x'+(b>=0?'+':'')+b+'|',padL+4,padT+14);
  }

  function _initCanvas(){_drawVshape(1,0,3);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Modulares e Irracionais'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Equações Modulares e Irracionais</h1>'+
          '<p class="topic-meta">|ax+b|=c · √(f(x))=k · condições de existência · verificação</p>'+
          '<div class="content-block">'+
            '<p>Equações com módulo ou raiz exigem atenção especial: o módulo cria dois casos, e a raiz exige verificação pois pode gerar soluções extrañas.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Equação modular |expr| = k</div>'+
              'Se k < 0 → sem solução.<br>'+
              'Se k ≥ 0: expr = k  ou  expr = −k<br>'+
              'Ex: |2x−1| = 5 → 2x−1=5 (x=3) ou 2x−1=−5 (x=−2)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Inequação modular |expr| &lt; k</div>'+
              '|expr| &lt; k ↔ −k &lt; expr &lt; k<br>'+
              '|expr| &gt; k ↔ expr &lt; −k ou expr &gt; k'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Equação irracional √(f(x)) = k</div>'+
              'Condições: k ≥ 0 e f(x) ≥ 0.<br>'+
              'Passo: eleve ao quadrado → f(x) = k².<br>'+
              'SEMPRE verifique: substituir pode gerar raízes estranhas.'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/modular/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Resolva: |3x − 6| = 9',note:'equação modular — 2 casos'},
    {equation:'Caso 1: 3x − 6 = 9',note:'expressão = valor positivo'},
    {equation:'3x = 15  →  x = 5',note:'resolver caso 1'},
    {equation:'Caso 2: 3x − 6 = −9',note:'expressão = valor negativo'},
    {equation:'3x = −3  →  x = −1',note:'resolver caso 2'},
    {equation:'S = {−1, 5}',note:'conjunto solução — verificar ambos'},
    {equation:'|3×5−6| = |9| = 9 ✓  |  |3×(−1)−6| = |−9| = 9 ✓',note:'verificação'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Modulares',href:'topic/modular/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: |3x − 6| = 9</h1>'+
          '<p class="topic-meta">dois casos do módulo, verificação</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Mod.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Mod.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawVshape(3,-6,9);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Resolver: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/modular/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Mod.nextStep();};}}
    _drawVshape(3,-6,9);Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Modulares',href:'topic/modular/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Mod.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: x=3 ou x=−1  ou  −2 &lt; x &lt; 5  ou  x=16</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Mod.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Mod.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Mod.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Mod.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  function _normAns(s){return s.replace(/\s+/g,'').replace(/ou/g,'ou').replace(/−/g,'-');}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/modular/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=_normAns(inp.value.trim()),c=_normAns(String(_pr.exercise.answer));
      var sn=parseFloat(s.replace(/x=/,'')),cn=parseFloat(c.replace(/x=/,''));
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Ex: x=3 ou x=−1';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Mod=_pub;
})();
