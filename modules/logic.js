/**
 * modules/logic.js
 * Raciocínio Lógico e Conjuntos — proposições, conectivos, tabela verdade, Venn.
 * Canvas: diagrama de Venn dinâmico + tabela verdade visual.
 */
(function () {
  var TOPIC_ID = 'logic';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: truth table ──────────────────────────────────────────
  function _drawTruthTable(op) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var rows=[['V','V'],['V','F'],['F','V'],['F','F']];
    var ops={AND:function(p,q){return p==='V'&&q==='V'?'V':'F';},OR:function(p,q){return p==='F'&&q==='F'?'F':'V';},IMPLIES:function(p,q){return p==='V'&&q==='F'?'F':'V';}};
    var sym=op==='AND'?'∧':op==='OR'?'∨':'→';
    var fn=ops[op]||ops.AND;
    var colW=80,rowH=36,startX=(W-(colW*3))/2,startY=60;
    // Header
    ['P','Q','P '+sym+' Q'].forEach(function(h,i){
      ctx.fillStyle='#5a8fd2';ctx.font='bold 13px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(h,startX+i*colW+colW/2,startY);
    });
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(startX,startY+8);ctx.lineTo(startX+colW*3,startY+8);ctx.stroke();
    // Rows
    rows.forEach(function(r,i){
      var y=startY+rowH*(i+1);
      var res=fn(r[0],r[1]);
      [r[0],r[1],res].forEach(function(v,j){
        ctx.fillStyle=v==='V'?'#4ab8b2':'#c87272';
        ctx.font='13px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(v,startX+j*colW+colW/2,y);
      });
    });
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Tabela verdade: P '+sym+' Q',W/2,30);
  }

  // ── Canvas: Venn ─────────────────────────────────────────────────
  function _drawVenn(nA,nB,nAB,nU,highlight){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var r=Math.min(W,H)*0.27,off=r*0.52,cx=W/2,cy=H/2;
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.strokeRect(18,18,W-36,H-46);
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('U ('+(nU||'?')+')',26,34);
    // Circle A
    ctx.beginPath();ctx.arc(cx-off,cy,r,0,Math.PI*2);
    ctx.fillStyle=highlight==='A'?'rgba(90,143,210,0.35)':'rgba(90,143,210,0.18)';ctx.fill();
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.stroke();
    // Circle B
    ctx.beginPath();ctx.arc(cx+off,cy,r,0,Math.PI*2);
    ctx.fillStyle=highlight==='B'?'rgba(74,184,178,0.35)':'rgba(74,184,178,0.18)';ctx.fill();
    ctx.strokeStyle='#4ab8b2';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#5a8fd2';ctx.font='bold 13px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText('A',cx-off-r*0.5,cy-r*0.6);
    ctx.fillStyle='#4ab8b2';ctx.fillText('B',cx+off+r*0.5,cy-r*0.6);
    ctx.fillStyle='#e8e8f2';ctx.font='14px JetBrains Mono,monospace';
    ctx.fillText(nA-nAB,cx-off-r*0.35,cy+6);ctx.fillText(nAB,cx,cy+6);ctx.fillText(nB-nAB,cx+off+r*0.35,cy+6);
  }

  // ── Concept ──────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Lógica e Conjuntos'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Raciocínio Lógico e Conjuntos</h1>'+
          '<p class="topic-meta">proposições · tabela verdade · conjuntos · Venn</p>'+
          '<div class="content-block">'+
            '<p>Lógica formal estuda a validade de argumentos. Teoria dos conjuntos organiza elementos com propriedades comuns.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Conectivos lógicos</div>'+
              '∧ (e / conjunção): V somente quando ambos são V.<br>'+
              '∨ (ou / disjunção): F somente quando ambos são F.<br>'+
              '→ (se…então / condicional): F somente quando P=V e Q=F.<br>'+
              '¬ (negação): inverte o valor de verdade.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Conjuntos — operações</div>'+
              '|A∪B| = |A| + |B| − |A∩B|  (princípio da inclusão-exclusão)<br>'+
              '|Aᶜ| = |U| − |A|  (complementar)<br>'+
              'A ⊆ B: todo elemento de A está em B.'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Logic.showTT(\'AND\')">P ∧ Q</div>'+
            '<div class="phase-step" onclick="Logic.showTT(\'OR\')">P ∨ Q</div>'+
            '<div class="phase-step" onclick="Logic.showTT(\'IMPLIES\')">P → Q</div>'+
            '<div class="phase-step" onclick="Logic.showVenn()">Venn</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/logic/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">P ∧ Q</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawTruthTable('AND');
  }

  var _exSteps=[
    {equation:'P: "2 é par"  — Verdadeiro',          note:'proposição P'},
    {equation:'Q: "5 é primo" — Verdadeiro',          note:'proposição Q'},
    {equation:'P ∧ Q: V ∧ V = V',                    note:'conjunção (∧)'},
    {equation:'P ∨ ¬Q: V ∨ F = V',                   note:'disjunção com negação'},
    {equation:'¬P → Q: F → V = V',                   note:'condicional com negação'},
    {equation:'|A|=8, |B|=6, |A∩B|=3',              note:'dados de conjuntos'},
    {equation:'|A∪B| = 8+6−3 = 11',                  note:'inclusão-exclusão'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Lógica',href:'topic/logic/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">proposições · conectivos · conjuntos</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Logic.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Logic.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">tabela verdade</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawTruthTable('AND');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Proposição: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/logic/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Logic.nextStep();};}}
    if(i<=4)_drawTruthTable(i<=2?'AND':i===3?'OR':'IMPLIES');
    else _drawVenn(8,6,3,20);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Lógica',href:'topic/logic/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Logic.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">tabela</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    if(ex.logicType==='truth')_drawTruthTable(ex.op||'AND');
    else if(ex.logicType==='set_union'||ex.logicType==='set_inter')_drawVenn(ex.a,ex.b,ex.ab,ex.a+ex.b+5);
    else{Renderer.clear();var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();ctx.fillStyle='#3e3e58';ctx.font='14px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(ex.equation||'',W/2,H/2);}
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt=ex.logicType==='truth'?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Resposta: V ou F</p>':
            ex.logicType==='negate'?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Escreva a negação completa.</p>':'';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Logic.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Logic.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Logic.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Logic.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    showTT:function(op){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);var sym=op==='AND'?'∧':op==='OR'?'∨':'→';document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',['AND','OR','IMPLIES','VENN'].indexOf(op)===i);});if(l)l.textContent='P '+sym+' Q';_drawTruthTable(op);},
    showVenn:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===3);});if(l)l.textContent='Diagrama de Venn';_drawVenn(8,6,3,20);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/logic/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim().toUpperCase(),correct=String(_pr.exercise.answer).toUpperCase();
      var ok=student===correct;
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
  window.Logic=_pub;
})();
