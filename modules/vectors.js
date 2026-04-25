/**
 * modules/vectors.js
 * Vetores e Geometria Analítica — soma de vetores, módulo, produto escalar,
 * equação da reta, equação da circunferência.
 * Canvas: vetores no plano cartesiano com operações visuais.
 */
(function () {
  var TOPIC_ID = 'vectors';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: vector plane ──────────────────────────────────────────
  function _drawVectors(vecs) {
    // vecs: [{x,y,color,label}]
    Renderer.clear();Renderer.drawAxes(true,true);
    (vecs||[]).forEach(function(v){
      if(v.x===undefined||v.y===undefined)return;
      // Arrow from origin
      Renderer.drawArrow(0,0,v.x,v.y,v.color||'#c8a44a');
      if(Math.abs(v.x)<13&&Math.abs(v.y)<13)
        Renderer.drawPoint(v.x,v.y,v.color||'#c8a44a',4,v.label||(v.x+','+v.y));
    });
  }

  function _drawCircle(cx,cy,r){
    Renderer.clear();Renderer.drawAxes(true,true);
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    var scale=W/28, ox=W/2, oy=H/2;
    function toX(mx){return ox+mx*scale;}
    function toY(my){return oy-my*scale;}
    ctx.beginPath();ctx.arc(toX(cx),toY(cy),r*scale,0,Math.PI*2);
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(90,143,210,0.08)';ctx.fill();
    Renderer.drawPoint(cx,cy,'#c8a44a',5,'C('+cx+','+cy+')');
    // Radius line
    ctx.strokeStyle='rgba(200,164,74,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(toX(cx),toY(cy));ctx.lineTo(toX(cx+r),toY(cy));ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('r='+r,toX(cx+r/2+0.2),toY(cy)-6);
  }

  function _drawLine(x1,y1,x2,y2){
    Renderer.clear();Renderer.drawAxes(true,true);
    Renderer.plotFunction(function(x){
      if(x2===x1)return NaN;
      return y1+(y2-y1)/(x2-x1)*(x-x1);
    },'#5a8fd2',2);
    Renderer.drawPoint(x1,y1,'#c8a44a',5,'P1');
    Renderer.drawPoint(x2,y2,'#4ab8b2',5,'P2');
  }

  // ── Concept ──────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Vetores e G.A.'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Vetores e Geometria Analítica</h1>'+
          '<p class="topic-meta">vetores no plano · módulo · produto escalar · reta · circunferência</p>'+
          '<div class="content-block">'+
            '<p>Geometria Analítica descreve figuras geométricas com equações algébricas usando um sistema de coordenadas.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Vetores no plano</div>'+
              'v = (x, y)  |  |v| = √(x² + y²)  (módulo)<br>'+
              'Soma: u+v = (u₁+v₁, u₂+v₂)<br>'+
              'Produto escalar: u·v = u₁v₁ + u₂v₂  |  u⊥v ↔ u·v = 0'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Equação da reta</div>'+
              'Forma geral: ax + by + c = 0<br>'+
              'Declive-linear: y = mx + b  (m = inclinação)<br>'+
              'Dados dois pontos P₁ e P₂: vetor diretor d = P₂ − P₁.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Circunferência</div>'+
              '(x − h)² + (y − k)² = r²  — centro (h,k), raio r.<br>'+
              'Distância entre pontos: d = √((x₂−x₁)² + (y₂−y₁)²)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Vec.showVec()">Vetores</div>'+
            '<div class="phase-step" onclick="Vec.showCircle()">Circunferência</div>'+
            '<div class="phase-step" onclick="Vec.showLine()">Reta</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/vectors/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">vetores</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawVectors([{x:3,y:2,color:'#5a8fd2',label:'u'},{x:-1,y:4,color:'#4ab8b2',label:'v'},{x:2,y:6,color:'#c8a44a',label:'u+v'}]);
  }

  var _exSteps=[
    {equation:'u = (3, 2),  v = (1, 4)',             note:'vetores dados'},
    {equation:'u + v = (3+1, 2+4) = (4, 6)',         note:'soma componente a componente'},
    {equation:'|u| = √(3² + 2²) = √13 ≈ 3,61',      note:'módulo de u'},
    {equation:'u · v = 3×1 + 2×4 = 3 + 8 = 11',     note:'produto escalar'},
    {equation:'u · v ≠ 0 → vetores não são perpend.', note:'interpretação'},
    {equation:'reta por (1,2) e (4,6): d=(3,4)',      note:'vetor diretor'},
    {equation:'4(x−1) − 3(y−2) = 0 → 4x−3y+2=0',   note:'equação da reta'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Vetores',href:'topic/vectors/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">u=(3,2), v=(1,4) — soma, módulo, produto escalar, reta</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Vec.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Vec.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">u=(3,2) v=(1,4)</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawVectors([{x:3,y:2,color:'#5a8fd2',label:'u'},{x:1,y:4,color:'#4ab8b2',label:'v'}]);
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/vectors/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Vec.nextStep();};}}
    if(i<=1)_drawVectors([{x:3,y:2,color:'#5a8fd2',label:'u'},{x:1,y:4,color:'#4ab8b2',label:'v'},{x:4,y:6,color:'#c8a44a',label:'u+v'}]);
    else if(i<=4)_drawVectors([{x:3,y:2,color:'#5a8fd2',label:'u'},{x:1,y:4,color:'#4ab8b2',label:'v'}]);
    else _drawLine(1,2,4,6);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Vetores',href:'topic/vectors/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Vec.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">plano</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    if(ex.vecType==='add')  _drawVectors([{x:ex.ax,y:ex.ay,color:'#5a8fd2',label:'u'},{x:ex.bx,y:ex.by,color:'#4ab8b2',label:'v'}]);
    else if(ex.vecType==='mod'||ex.vecType==='dot') _drawVectors([{x:ex.x||ex.ax,y:ex.y||ex.ay,color:'#5a8fd2',label:'v'}]);
    else if(ex.vecType==='circle') _drawCircle(ex.cx,ex.cy,ex.r);
    else if(ex.vecType==='line')   _drawLine(ex.x1,ex.y1,ex.x2,ex.y2);
    else{Renderer.clear();Renderer.drawAxes(true,true);}
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt=ex.vecType==='add'?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: (x, y)</p>':
            ex.vecType==='circle'?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: (x - 2)² + (y + 1)² = 9</p>':'';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Vec.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Vec.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Vec.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Vec.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    showVec:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===0);});if(l)l.textContent='vetores';_drawVectors([{x:3,y:2,color:'#5a8fd2',label:'u'},{x:-1,y:4,color:'#4ab8b2',label:'v'},{x:2,y:6,color:'#c8a44a',label:'u+v'}]);},
    showCircle:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===1);});if(l)l.textContent='circunferência';_drawCircle(1,-1,4);},
    showLine:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===2);});if(l)l.textContent='reta';_drawLine(-3,-2,4,5);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/vectors/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim().replace(/\s+/g,''),ok=MathCore.validate(TOPIC_ID,student,_pr.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Vec=_pub;
})();
