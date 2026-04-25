/**
 * modules/series.js
 * Sequências e Séries — recursivas, soma PG finita/infinita, Fibonacci, aplicações.
 * Canvas: visualização da convergência de série geométrica.
 */
(function () {
  var TOPIC_ID = 'series';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawGeoSeries(a1,q,n,showInfinite){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var maxTerms=showInfinite?Math.min(n+4,12):n;
    var barH=Math.min(28,Math.floor((H-60)/maxTerms));
    var padL=60,padR=20,padT=30;
    // Compute terms and partial sums
    var terms=[],sum=0,cumSums=[];
    for(var i=0;i<maxTerms;i++){var t=a1*Math.pow(q,i);terms.push(t);sum+=t;cumSums.push(sum);}
    var maxW=terms[0],barW=W-padL-padR;
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Termos da PG: a₁='+a1+', q='+q+(showInfinite?' → S∞='+(a1/(1-q)):''),W/2,18);
    terms.forEach(function(t,i){
      var y=padT+i*(barH+3);
      var bw=barW*(t/maxW);
      var alpha=showInfinite&&i>=n?0.3:0.7;
      ctx.fillStyle='rgba(90,143,210,'+alpha+')';
      ctx.fillRect(padL,y,Math.max(bw,2),barH-2);
      ctx.fillStyle=showInfinite&&i>=n?'#3e3e58':'#72728c';
      ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='right';
      ctx.fillText('T'+(i+1)+'='+Math.round(t*100)/100,padL-3,y+barH/2+3);
      ctx.fillStyle='#e8e8f2';ctx.textAlign='left';
      ctx.fillText('Σ='+Math.round(cumSums[i]*100)/100,padL+bw+4,y+barH/2+3);
    });
  }

  function _initCanvas(){_drawGeoSeries(64,0.5,4,true);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Sequências e Séries'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Sequências e Séries</h1>'+
          '<p class="topic-meta">recorrência · soma PG finita · série infinita · Fibonacci</p>'+
          '<div class="content-block">'+
            '<p>Uma sequência define termos por regra. Uma série é a soma desses termos. Séries geométricas com |q|&lt;1 têm soma infinita finita — propriedade central em cálculo e probabilidade.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Sequência recursiva</div>'+
              'aₙ = f(aₙ₋₁) — cada termo depende do anterior.<br>'+
              'Fibonacci: a₁=1, a₂=1, aₙ=aₙ₋₁+aₙ₋₂<br>'+
              '1, 1, 2, 3, 5, 8, 13, 21, 34, 55...'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Soma de PG finita</div>'+
              'Sₙ = a₁×(qⁿ−1)/(q−1)  (q≠1)<br>'+
              'Sₙ = n×a₁  (q=1)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Série geométrica infinita</div>'+
              'Válida para |q| &lt; 1:<br>'+
              'S∞ = a₁/(1−q)<br>'+
              'Ex: 1 + 1/2 + 1/4 + ... = 1/(1−1/2) = 2'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/series/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Soma infinita: 1 + 1/3 + 1/9 + 1/27 + ...',note:'série geométrica com q=1/3'},
    {equation:'a₁ = 1,  q = 1/3  →  |q| < 1 → converge',note:'verificar convergência'},
    {equation:'S∞ = a₁ / (1−q)',note:'fórmula da série infinita'},
    {equation:'S∞ = 1 / (1 − 1/3) = 1 / (2/3)',note:'substituir valores'},
    {equation:'S∞ = 1 × 3/2 = 3/2',note:'simplificar'},
    {equation:'1 + 1/3 + 1/9 + ... = 3/2 = 1,5',note:'resposta final'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Séries',href:'topic/series/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: série infinita 1 + 1/3 + 1/9 + ...</h1>'+
          '<p class="topic-meta">S∞ = a₁/(1−q) com |q|&lt;1</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Ser.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Ser.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawGeoSeries(1,1/3,3,true);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Calcular: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/series/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Ser.nextStep();};}}
    _drawGeoSeries(1,1/3,3,true);Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Séries',href:'topic/series/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Ser.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    if(ex.serType==='geo_inf')_drawGeoSeries(ex.a1||1,ex.q||0.5,3,true);
    else _initCanvas();
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
          '<button class="btn btn-primary" onclick="Ser.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Ser.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Ser.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Ser.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/series/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(',','.'),c=String(_pr.exercise.answer).replace(',','.');
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=Math.max(1,Math.abs(cn)*0.01));
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
  window.Ser=_pub;
})();
