/**
 * modules/algebraic.js
 * Expressões Algébricas — monômios, valor numérico, termos semelhantes, distributiva.
 * Canvas: representação de monômios como áreas/comprimentos.
 */
(function () {
  var TOPIC_ID = 'algebraic';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawSubstitution(expr, xVal, steps) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var padL=24, padT=20, lineH=36;
    ctx.fillStyle='#3e3e58';ctx.font='12px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('Substituição: x = '+xVal,padL,padT+lineH*0);
    steps.forEach(function(s,i){
      var y=padT+lineH*(i+1)+8;
      ctx.fillStyle=i===steps.length-1?'#c8a44a':'#72728c';
      ctx.font=(i===steps.length-1?'bold ':'')+'11px JetBrains Mono,monospace';
      ctx.fillText(s,padL+16,y);
    });
    // Box around final result
    if(steps.length>0){
      var lastY=padT+lineH*steps.length+8;
      var tw=ctx.measureText(steps[steps.length-1]).width;
      ctx.strokeStyle='#c8a44a';ctx.lineWidth=1.5;
      ctx.strokeRect(padL+10,lastY-18,tw+12,24);
    }
  }
  function _initCanvas(){_drawSubstitution('3x + 2', 4, ['3×4 + 2', '12 + 2', '= 14']);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Expressões Algébricas'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Expressões Algébricas</h1>'+
          '<p class="topic-meta">monômios · valor numérico · termos semelhantes · distributiva</p>'+
          '<div class="content-block">'+
            '<p>Uma expressão algébrica combina números e letras (variáveis). Simplificá-la é a habilidade base de toda a álgebra.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Monômios e termos semelhantes</div>'+
              'Monômio: número × variável(s). Ex: 3x, −2y², 5ab<br>'+
              'Termos semelhantes: mesma parte literal. Podem ser somados.<br>'+
              'Ex: 4x + 2x = 6x  |  3x + 5y não simplifica'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Valor numérico</div>'+
              'Substitua cada variável pelo valor dado e calcule.<br>'+
              'Ex: 2x² − 3x para x=4 → 2×16 − 3×4 = 32 − 12 = 20'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Propriedade distributiva</div>'+
              'a(b + c) = ab + ac<br>'+
              'Ex: 3(2x + 5) = 6x + 15'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/algebraic/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Simplifique: 5x + 3 + 2x − 1',note:'expressão com termos semelhantes'},
    {equation:'Termos com x: 5x + 2x = 7x',note:'agrupar termos com variável'},
    {equation:'Termos independentes: 3 − 1 = 2',note:'agrupar termos numéricos'},
    {equation:'5x + 3 + 2x − 1 = 7x + 2',note:'resultado simplificado'},
    {equation:'Valor numérico para x = 3:',note:'calcular para x=3'},
    {equation:'7×3 + 2 = 21 + 2 = 23',note:'substituição e cálculo'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Expr. Algébricas',href:'topic/algebraic/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: 5x + 3 + 2x − 1</h1>'+
          '<p class="topic-meta">simplificação e valor numérico</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Alg.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Alg.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Simplificar: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/algebraic/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Alg.nextStep();};}}
    if(i>=4)_drawSubstitution('7x+2',3,['7×3+2','21+2','= 23']);else _initCanvas();
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Expr. Algébricas',href:'topic/algebraic/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Alg.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: 5x + 3  ou  14</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Alg.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Alg.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Alg.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Alg.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  function _normExpr(s){return s.replace(/\s+/g,'').replace(/−/g,'-');}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/algebraic/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=_normExpr(inp.value.trim()),c=_normExpr(String(_pr.exercise.answer));
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Sem espaços desnecessários (ex: 5x+3).';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Alg=_pub;
})();
