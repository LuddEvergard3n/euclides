/**
 * modules/fractions.js
 * Frações e Números Racionais — simplificação, operações (±×÷).
 * Canvas: representação visual de frações numa reta numérica.
 */
(function () {
  var TOPIC_ID = 'fractions';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawNumberLine(fracs) {
    // fracs: [{n,d,color,label}]
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var padH=48,cy=H/2,len=W-2*padH;
    // Axis
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(padH,cy);ctx.lineTo(W-padH,cy);ctx.stroke();
    // Ticks -2 to 2
    for(var i=-2;i<=2;i++){
      var px=padH+len*(i+2)/4;
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,cy-8);ctx.lineTo(px,cy+8);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(i,px,cy+22);
    }
    // Plot fractions
    (fracs||[]).forEach(function(f){
      var val=f.n/f.d;
      var px=padH+len*(val+2)/4;
      ctx.fillStyle=f.color||'#c8a44a';
      ctx.beginPath();ctx.arc(px,cy,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=f.color||'#c8a44a';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(f.label||f.n+'/'+f.d,px,cy-14);
    });
  }

  function _drawFracBar(n,d,color){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var padH=40,padV=80,bW=W-2*padH,bH=60;
    var by=(H-bH)/2;
    // Denominator parts
    for(var i=0;i<d;i++){
      var x=padH+i*(bW/d);
      ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
      ctx.strokeRect(x,by,bW/d,bH);
      if(i<n){ctx.fillStyle=(color||'rgba(90,143,210,0.5)');ctx.fillRect(x+1,by+1,bW/d-2,bH-2);}
    }
    ctx.fillStyle='#c8a44a';ctx.font='14px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(n+'/'+d,W/2,by+bH+30);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Frações'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Frações e Números Racionais</h1>'+
          '<p class="topic-meta">simplificação · adição · subtração · multiplicação · divisão</p>'+
          '<div class="content-block">'+
            '<p>Uma fração n/d representa n partes de um todo dividido em d partes iguais. O conjunto dos racionais inclui todas as frações e inteiros.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Simplificação</div>'+
              'Divida numerador e denominador pelo MDC.<br>'+
              'Ex: 12/18 → MDC(12,18)=6 → 2/3'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Adição e Subtração</div>'+
              'Iguale os denominadores (use o MMC).<br>'+
              'a/b ± c/d = (a·d ± c·b) / (b·d) → simplifique'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Multiplicação e Divisão</div>'+
              'Mult: (a/b)×(c/d) = (a·c)/(b·d)<br>'+
              'Div: (a/b)÷(c/d) = (a/b)×(d/c)  — inverta e multiplique'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Frac.showBar(3,4)">Barra 3/4</div>'+
            '<div class="phase-step" onclick="Frac.showBar(2,3)">Barra 2/3</div>'+
            '<div class="phase-step" onclick="Frac.showLine()">Reta num.</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/fractions/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawFracBar(3,4);
  }

  var _exSteps=[
    {equation:'1/2 + 1/3 = ?',note:'problema'},
    {equation:'MMC(2,3) = 6',note:'denominador comum'},
    {equation:'1/2 = 3/6  e  1/3 = 2/6',note:'frações equivalentes'},
    {equation:'3/6 + 2/6 = 5/6',note:'soma dos numeradores'},
    {equation:'MDC(5,6) = 1 → já simplificado',note:'verificar simplificação'},
    {equation:'1/2 + 1/3 = 5/6',note:'resultado final'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Frações',href:'topic/fractions/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: 1/2 + 1/3</h1>'+
          '<p class="topic-meta">adição de frações com denominadores diferentes</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Frac.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Frac.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawFracBar(5,6);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Calcular: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/fractions/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Frac.nextStep();};}}
    if(i<4)_drawFracBar([1,1,3,3,5,5][i],[2,3,6,6,6,6][i]);
    else _drawNumberLine([{n:1,d:2,color:'#5a8fd2',label:'1/2'},{n:1,d:3,color:'#4ab8b2',label:'1/3'},{n:5,d:6,color:'#c8a44a',label:'5/6'}]);
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Frações',href:'topic/fractions/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Frac.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var ex=_pr.exercise;
    // Try to draw the answer as a fraction bar
    var parts=String(ex.answer).split('/');
    if(parts.length===2){var n=parseInt(parts[0]),d=parseInt(parts[1]);if(!isNaN(n)&&!isNaN(d)&&d>0&&d<=12&&n<=d)_drawFracBar(n,d);}
    else _drawNumberLine([]);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: 3/4 ou 2 (inteiro reduzido)</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="a/b" autocomplete="off" style="max-width:140px"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Frac.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Frac.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Frac.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Frac.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  // Fraction equality: reduce both and compare
  function _fracEq(s,c){
    function red(str){var p=str.split('/');if(p.length===1)return{n:parseInt(p[0]),d:1};var n=parseInt(p[0]),d=parseInt(p[1]);if(isNaN(n)||isNaN(d)||d===0)return null;function g(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a||1;}var gv=g(Math.abs(n),d);return{n:n/gv,d:d/gv};}
    var a=red(s.replace(/\s/g,'')),b=red(c.replace(/\s/g,''));
    if(!a||!b)return false;
    return a.n===b.n&&a.d===b.d;
  }
  var _pub={
    showBar:function(n,d){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',(n===3&&d===4&&i===0)||(n===2&&d===3&&i===1));});_drawFracBar(n,d);},
    showLine:function(){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===2);});_drawNumberLine([{n:1,d:4,color:'#5a8fd2',label:'1/4'},{n:1,d:2,color:'#4ab8b2',label:'1/2'},{n:3,d:4,color:'#c8a44a',label:'3/4'}]);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/fractions/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var ok=_fracEq(inp.value.trim(),String(_pr.exercise.answer));
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Resposta em a/b reduzida.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Frac=_pub;
})();
