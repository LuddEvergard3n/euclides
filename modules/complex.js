/**
 * modules/complex.js
 * Números Complexos — forma algébrica, módulo, conjugado, operações, plano de Argand.
 * Canvas: plano de Argand com os números plotados.
 */
(function () {
  var TOPIC_ID = 'complex';
  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: plano de Argand ───────────────────────────────────────
  function _drawArgand(points){
    // points: [{re, im, color, label}]
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var scale=Math.min(W,H)*0.06, ox=W/2, oy=H/2;
    // Axes
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(ox,20);ctx.lineTo(ox,H-20);ctx.stroke();
    ctx.beginPath();ctx.moveTo(20,oy);ctx.lineTo(W-20,oy);ctx.stroke();
    // Axis labels
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Im',ox-14,28);ctx.fillText('Re',W-24,oy-6);
    // Tick marks
    for(var i=-6;i<=6;i++){
      if(i===0)continue;
      var px=ox+i*scale,py=oy+i*scale;
      ctx.strokeStyle='#1e1e30';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(px,oy-4);ctx.lineTo(px,oy+4);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ox-4,py);ctx.lineTo(ox+4,py);ctx.stroke();
      ctx.fillStyle='#2e2e4a';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(i,px,oy+14);
    }
    // Plot each point
    (points||[]).forEach(function(p){
      var x=ox+p.re*scale, y=oy-p.im*scale;
      // Vector from origin
      ctx.strokeStyle=(p.color||'#c8a44a')+'88';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(x,y);ctx.stroke();
      // Dot
      ctx.fillStyle=p.color||'#c8a44a';
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
      // Label
      ctx.fillStyle=p.color||'#c8a44a';ctx.font='11px JetBrains Mono,monospace';
      ctx.textAlign=p.re>=0?'left':'right';
      ctx.fillText((p.label||'')+' ('+p.re+','+p.im+'i)',x+(p.re>=0?8:-8),y-6);
    });
  }

  function _pointsForExercise(ex){
    if(!ex)return[];
    var a=ex.a||0,b=ex.b||0,c=ex.c||0,d=ex.d||0;
    if(ex.compType==='add')   return [{re:a,im:b,color:'#5a8fd2',label:'z1'},{re:c,im:d,color:'#4ab8b2',label:'z2'},{re:a+c,im:b+d,color:'#c8a44a',label:'z1+z2'}];
    if(ex.compType==='mult')  return [{re:a,im:b,color:'#5a8fd2',label:'z1'},{re:c,im:d,color:'#4ab8b2',label:'z2'}];
    if(ex.compType==='mod')   return [{re:a,im:b,color:'#c8a44a',label:'z'}];
    if(ex.compType==='conj')  return [{re:a,im:b,color:'#5a8fd2',label:'z'},{re:a,im:-b,color:'#c8a44a',label:'z̄'}];
    if(ex.compType==='div')   return [{re:a,im:b,color:'#5a8fd2',label:'z1'},{re:c,im:d,color:'#4ab8b2',label:'z2'}];
    return [];
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Números Complexos'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Números Complexos</h1>'+
          '<p class="topic-meta">forma algébrica · módulo · conjugado · operações · Argand</p>'+
          '<div class="content-block">'+
            '<p>Números complexos estendem os reais para incluir raízes de números negativos. A unidade imaginária é i, onde i² = −1.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Forma algébrica  z = a + bi</div>'+
              'Parte real: Re(z) = a  |  Parte imaginária: Im(z) = b<br>'+
              'Plano de Argand: ponto (a, b) no plano complexo.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Módulo  |z| = √(a² + b²)</div>'+
              'Distância da origem ao ponto (a,b). Sempre real e não-negativo.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Conjugado  z̄ = a − bi</div>'+
              'Reflexão em relação ao eixo real.  z × z̄ = |z|² (sempre real).'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Operações</div>'+
              'Soma: (a+bi)+(c+di) = (a+c)+(b+d)i<br>'+
              'Produto: (a+bi)(c+di) = (ac−bd)+(ad+bc)i<br>'+
              'Divisão: z1/z2 = (z1·z̄2)/|z2|²'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/complex/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">plano de Argand</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawArgand([{re:3,im:2,color:'#5a8fd2',label:'z'},{re:3,im:-2,color:'#c8a44a',label:'z̄'}]);
  }

  var _exSteps=[
    {equation:'z1 = 2 + 3i,  z2 = 1 − i',             note:'números dados'},
    {equation:'z1 + z2 = (2+1) + (3-1)i',              note:'soma: partes separadas'},
    {equation:'z1 + z2 = 3 + 2i',                      note:'resultado da soma'},
    {equation:'z1 × z2 = (2×1 − 3×(-1)) + (2×(-1) + 3×1)i', note:'produto'},
    {equation:'z1 × z2 = (2+3) + (-2+3)i = 5 + i',    note:'simplificar'},
    {equation:'|z1| = √(4+9) = √13',                   note:'módulo de z1'},
    {equation:'z̄1 = 2 − 3i',                           note:'conjugado de z1'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Complexos',href:'topic/complex/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">z1 = 2+3i, z2 = 1−i  ·  soma, produto, módulo, conjugado</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Comp.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Comp.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">plano de Argand</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawArgand([{re:2,im:3,color:'#5a8fd2',label:'z1'},{re:1,im:-1,color:'#4ab8b2',label:'z2'}]);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Dados: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/complex/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Comp.nextStep();};}}
    // Update argand based on step
    if(i<=2)_drawArgand([{re:2,im:3,color:'#5a8fd2',label:'z1'},{re:1,im:-1,color:'#4ab8b2',label:'z2'},{re:3,im:2,color:'#c8a44a',label:'soma'}]);
    else if(i<=4)_drawArgand([{re:5,im:1,color:'#c8a44a',label:'produto'}]);
    else if(i===5)_drawArgand([{re:2,im:3,color:'#5a8fd2',label:'z1'},{re:0,im:0,color:'#c8a44a',label:'|z1|=√13'}]);
    else _drawArgand([{re:2,im:3,color:'#5a8fd2',label:'z1'},{re:2,im:-3,color:'#c8a44a',label:'z̄1'}]);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Complexos',href:'topic/complex/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Comp.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">plano de Argand</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    _drawArgand(_pointsForExercise(_pr.exercise));
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt=(ex.compType==='add'||ex.compType==='mult'||ex.compType==='div')
      ?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: 3 + 2i  ou  3 - 2i</p>':'';
    var modFmt=(ex.compType==='mod')?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: √13  ou  5</p>':'';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+modFmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Comp.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Comp.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Comp.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Comp.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/complex/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_pr.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
        _drawArgand(_pointsForExercise(_pr.exercise));
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Comp=_pub;
})();
