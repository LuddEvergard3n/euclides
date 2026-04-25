/**
 * modules/combinatorics.js
 * Combinatória — princípio multiplicativo, permutações, arranjos, combinações, Pascal.
 * Canvas: triângulo de Pascal e diagrama de árvore.
 */
(function () {
  var TOPIC_ID = 'combinatorics';
  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: Triângulo de Pascal ───────────────────────────────────
  function _drawPascal(highlightN, highlightK){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var rows=7,cellH=Math.floor(H*0.85/rows),cellW=Math.floor(W*0.9/(rows));
    var startY=Math.floor(H*0.06);
    function _comb(n,k){if(k<0||k>n)return 0;var r=1;for(var i=0;i<k;i++)r=r*(n-i)/(i+1);return Math.round(r);}
    for(var n=0;n<rows;n++){
      var rowW=(n+1)*cellW;
      var startX=(W-rowW)/2+cellW/2;
      for(var k=0;k<=n;k++){
        var val=_comb(n,k);
        var x=startX+k*cellW,y=startY+n*cellH;
        var active=(n===highlightN&&k===highlightK);
        if(active){ctx.fillStyle='rgba(200,164,74,0.25)';ctx.beginPath();ctx.arc(x,y,cellH*0.38,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle=active?'#c8a44a':n===0?'#5a8fd2':'#72728c';
        ctx.font=(active?'bold ':'')+Math.min(14,cellH*0.55)+'px JetBrains Mono,monospace';
        ctx.textAlign='center';ctx.fillText(val,x,y+4);
      }
    }
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Triângulo de Pascal',W/2,H-8);
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Combinatória'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Combinatória e Contagem</h1>'+
          '<p class="topic-meta">princípio multiplicativo · P · A · C · Pascal</p>'+
          '<div class="content-block">'+
            '<p>Combinatória conta o número de formas de selecionar ou arranjar objetos sob certas condições.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Princípio multiplicativo</div>'+
              'Se uma tarefa tem k etapas com n₁, n₂, …, nₖ possibilidades independentes,<br>o total é n₁ × n₂ × … × nₖ.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Permutação  Pₙ = n!</div>'+
              'Arranjos de todos os n elementos (a ordem importa).'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Arranjo  A(n,k) = n! / (n−k)!</div>'+
              'Selecionar k de n elementos, a ordem importa.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Combinação  C(n,k) = n! / (k! × (n−k)!)</div>'+
              'Selecionar k de n elementos, a ordem NÃO importa.<br>'+
              'C(n,k) = C(n−1,k−1) + C(n−1,k)  → Triângulo de Pascal.'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/combinatorics/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">Triângulo de Pascal</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawPascal(-1,-1);
  }

  var _exSteps=[
    {equation:'C(5,2) = ?',                       note:'problema'},
    {equation:'C(n,k) = n! / (k! × (n-k)!)',      note:'fórmula da combinação'},
    {equation:'C(5,2) = 5! / (2! × 3!)',           note:'substituição'},
    {equation:'= (5×4×3!) / (2×1 × 3!)',           note:'expandir e cancelar 3!'},
    {equation:'= 20 / 2 = 10',                     note:'resultado'},
    {equation:'No Pascal: linha 5, posição 2 = 10',note:'confirmação visual'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Combinatória',href:'topic/combinatorics/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">C(5,2) — combinação sem repetição</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Comb.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Comb.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">C(5,2) no Pascal</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawPascal(5,2);
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/combinatorics/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Comb.nextStep();};}}
    _drawPascal(i>=5?5:-1,i>=5?2:-1);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Combinatória',href:'topic/combinatorics/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Comb.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">Triângulo de Pascal</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    _drawPascal(ex.combType==='pascal'||ex.combType==='comb'?ex.n:-1,
                ex.combType==='pascal'||ex.combType==='comb'?ex.k:-1);
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
          '<input class="answer-input" id="answer-input" type="text" placeholder="número inteiro" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Comb.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Comb.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Comb.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Comb.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/combinatorics/practice');}},
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
        var ex=_pr.exercise;_drawPascal(ex.n||-1,ex.k||-1);
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Comb=_pub;
})();
