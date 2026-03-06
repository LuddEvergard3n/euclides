/**
 * modules/progressions.js
 * Progressões Aritmética (PA) e Geométrica (PG).
 * Canvas: sequência plotada como pontos no plano.
 */
(function () {
  var TOPIC_ID = 'progressions';
  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas ────────────────────────────────────────────────────────
  function _drawSequence(terms, color, label) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var n=terms.length;
    var minV=Math.min.apply(null,terms),maxV=Math.max.apply(null,terms);
    var rangeV=maxV-minV||1;
    var padX=40,padY=36,chartW=W-padX*2,chartH=H-padY*2;
    // Axes
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padX,padY);ctx.lineTo(padX,padY+chartH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(padX,padY+chartH);ctx.lineTo(padX+chartW,padY+chartH);ctx.stroke();
    // Points and connecting lines
    var pts=terms.map(function(v,i){
      return {x:padX+i*(chartW/(n-1||1)),y:padY+chartH-(v-minV)/rangeV*chartH};
    });
    ctx.strokeStyle='rgba(200,164,74,0.3)';ctx.lineWidth=1;
    ctx.beginPath();pts.forEach(function(p,i){i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});ctx.stroke();
    pts.forEach(function(p,i){
      ctx.fillStyle=color||'#c8a44a';
      ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(terms[i],p.x,p.y-10);
      ctx.fillText('a'+(i+1),p.x,padY+chartH+14);
    });
    if(label){ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(label,W/2,16);}
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Progressões'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Progressões</h1>'+
          '<p class="topic-meta">PA — progressão aritmética · PG — progressão geométrica</p>'+
          '<div class="content-block">'+
            '<p>Uma progressão é uma sequência de números onde cada termo se relaciona ao anterior por uma regra fixa.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Progressão Aritmética (PA)</div>'+
              'Razão constante r: diferença entre termos consecutivos.<br>'+
              'Termo geral: aₙ = a₁ + (n−1)r<br>'+
              'Soma dos n termos: Sₙ = n(a₁ + aₙ) / 2'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Progressão Geométrica (PG)</div>'+
              'Razão constante q: quociente entre termos consecutivos (q ≠ 0).<br>'+
              'Termo geral: aₙ = a₁ × q^(n−1)<br>'+
              'Soma (q≠1): Sₙ = a₁(qⁿ − 1) / (q − 1)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Prog.showAP()">PA</div>'+
            '<div class="phase-step" onclick="Prog.showGP()">PG</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/progressions/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">PA: 2, 5, 8, 11, 14</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawSequence([2,5,8,11,14],'#5a8fd2','PA: a1=2, r=3');
  }

  var _exSteps=[
    {equation:'PA: a1=3, r=4, n=6',         note:'dados da progressão'},
    {equation:'a6 = a1 + (n-1)×r',           note:'fórmula do termo geral'},
    {equation:'a6 = 3 + 5×4 = 3 + 20',       note:'substituição'},
    {equation:'a6 = 23',                      note:'6º termo'},
    {equation:'S6 = 6×(a1+a6)/2',            note:'fórmula da soma'},
    {equation:'S6 = 6×(3+23)/2 = 6×13',      note:'substituição'},
    {equation:'S6 = 78',                      note:'soma dos 6 primeiros termos'},
  ];
  var _exStep=0;

  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Progressões',href:'topic/progressions/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">PA: a1=3, r=4  ·  termo geral e soma</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Prog.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Prog.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">3, 7, 11, 15, 19, 23</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawSequence([3,7,11,15,19,23],'#5a8fd2','PA: a1=3, r=4');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Dados: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/progressions/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Prog.nextStep();};}}
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Progressões',href:'topic/progressions/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Prog.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">sequência</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    // Build visible terms for canvas
    var terms=[];
    if(ex.progType==='ap'){for(var i=0;i<Math.min(ex.n||6,8);i++)terms.push(ex.a1+i*ex.r);}
    else if(ex.progType==='gp'){for(var i=0;i<Math.min(ex.n||5,6);i++)terms.push(ex.a1*Math.pow(ex.q,i));}
    if(terms.length>1)_drawSequence(terms,ex.progType==='gp'?'#4ab8b2':'#5a8fd2',ex.progType==='ap'?'PA':'PG');
    var lbl=document.getElementById('canvas-label');if(lbl)lbl.textContent=ex.progType==='ap'?'PA':'PG';
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="número" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Prog.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Prog.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Prog.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Prog.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    showAP:function(){var panel=document.getElementById('canvas-panel'),lbl=document.getElementById('canvas-label');if(!panel)return;_mc(panel,420,380);if(lbl)lbl.textContent='PA: 2, 5, 8, 11, 14';document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===0);});_drawSequence([2,5,8,11,14],'#5a8fd2','PA: a1=2, r=3');},
    showGP:function(){var panel=document.getElementById('canvas-panel'),lbl=document.getElementById('canvas-label');if(!panel)return;_mc(panel,420,380);if(lbl)lbl.textContent='PG: 1, 2, 4, 8, 16';document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===1);});_drawSequence([1,2,4,8,16],'#4ab8b2','PG: a1=1, q=2');},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/progressions/practice');}},
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
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Prog=_pub;
})();
