/**
 * modules/binomial.js
 * Binômio de Newton — coeficientes binomiais, Triângulo de Pascal, expansão, termo geral.
 * Canvas: Triângulo de Pascal com célula destacada.
 */
(function () {
  var TOPIC_ID = 'binomial';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _buildPascal(rows){
    var tri=[];
    for(var i=0;i<rows;i++){tri.push([]);for(var j=0;j<=i;j++)tri[i].push(j===0||j===i?1:tri[i-1][j-1]+tri[i-1][j]);}
    return tri;
  }

  function _drawPascal(highlightN,highlightK){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var rows=8,cellW=46,cellH=34,startX=W/2;
    var tri=_buildPascal(rows);
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Triângulo de Pascal',W/2,12);
    tri.forEach(function(row,i){
      var rowW=row.length*cellW,x0=startX-rowW/2,y=18+i*cellH;
      row.forEach(function(v,j){
        var cx2=x0+j*cellW+cellW/2,cy2=y+cellH/2;
        var isHL=(i===highlightN&&j===highlightK);
        ctx.fillStyle=isHL?'rgba(200,164,74,0.35)':'rgba(30,30,50,0.5)';
        ctx.fillRect(x0+j*cellW+1,y+1,cellW-2,cellH-2);
        if(isHL){ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;ctx.strokeRect(x0+j*cellW+1,y+1,cellW-2,cellH-2);}
        ctx.fillStyle=isHL?'#c8a44a':'#72728c';
        ctx.font=(isHL?'bold ':'')+'11px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(v,cx2,cy2+4);
      });
    });
  }
  function _initCanvas(){_drawPascal(5,2);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Binômio de Newton'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Binômio de Newton</h1>'+
          '<p class="topic-meta">coeficientes binomiais · Triângulo de Pascal · expansão · termo geral</p>'+
          '<div class="content-block">'+
            '<p>O Binômio de Newton fornece a expansão de (a+b)^n sem multiplicação repetida, usando os coeficientes C(n,k) do Triângulo de Pascal.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Fórmula geral</div>'+
              '(a+b)^n = Σ C(n,k) · a^(n−k) · b^k  para k=0..n<br>'+
              'C(n,k) = n! / (k!(n−k)!)  — coeficiente binomial'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Triângulo de Pascal</div>'+
              'Cada número = soma dos dois acima. Linha n = coeficientes de (a+b)^n.<br>'+
              'n=0: 1  |  n=1: 1 1  |  n=2: 1 2 1  |  n=3: 1 3 3 1'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Termo geral (k+1º termo)</div>'+
              'T_{k+1} = C(n,k) · a^(n−k) · b^k<br>'+
              'Para um termo específico: isole k e calcule C(n,k).'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/binomial/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Expanda (x+2)⁴',note:'problema'},
    {equation:'Linha n=4 do Triângulo de Pascal: 1, 4, 6, 4, 1',note:'coeficientes C(4,0)..C(4,4)'},
    {equation:'T₁ = C(4,0)·x⁴·2⁰ = 1·x⁴·1 = x⁴',note:'k=0'},
    {equation:'T₂ = C(4,1)·x³·2¹ = 4·x³·2 = 8x³',note:'k=1'},
    {equation:'T₃ = C(4,2)·x²·2² = 6·x²·4 = 24x²',note:'k=2'},
    {equation:'T₄ = C(4,3)·x·2³ = 4·x·8 = 32x',note:'k=3'},
    {equation:'T₅ = C(4,4)·2⁴ = 1·16 = 16',note:'k=4'},
    {equation:'(x+2)⁴ = x⁴ + 8x³ + 24x² + 32x + 16',note:'soma de todos os termos'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Binômio',href:'topic/binomial/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: (x+2)⁴</h1>'+
          '<p class="topic-meta">expansão completa pelo Binômio de Newton</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Binom.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Binom.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawPascal(4,0);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Expandir: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/binomial/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Binom.nextStep();};}}
    var k=Math.max(0,i-2);_drawPascal(4,Math.min(k,4));
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Binômio',href:'topic/binomial/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Binom.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    _drawPascal(ex.n||5,ex.k||2);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isExpand=ex.binomType==='expand';
    var fmt=isExpand?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: x² + 4x + 4</p>':
                     '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Número inteiro</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Binom.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Binom.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Binom.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Binom.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/binomial/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(/\s+/g,''),c=String(_pr.exercise.answer).replace(/\s+/g,'');
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
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
  window.Binom=_pub;
})();
