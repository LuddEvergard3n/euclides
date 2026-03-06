/**
 * modules/real_numbers.js
 * Números Reais e Irracionais
 */
(function () {
  var TOPIC_ID = 'real_numbers';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawRealLine(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var sets=[{label:'ℕ',color:'#5a8fd2',y:H*0.2},{label:'ℤ',color:'#4ab8b2',y:H*0.38},{label:'ℚ',color:'#c8a44a',y:H*0.56},{label:'ℝ',color:'#e8e8f2',y:H*0.74}];
    sets.forEach(function(s){
      ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.beginPath();
      var w=W-60;ctx.roundRect?ctx.roundRect(30,s.y,w,H*0.16,8):ctx.rect(30,s.y,w,H*0.16);
      ctx.stroke();
      ctx.fillStyle=s.color;ctx.font='bold 13px JetBrains Mono,monospace';ctx.textAlign='left';
      ctx.fillText(s.label,38,s.y+H*0.1+4);
    });
    ctx.fillStyle='#c87272';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='right';
    ctx.fillText('ℝ\ℚ = irracionais (√2, π, e...)',W-35,H*0.74+H*0.1+4);
    ctx.fillStyle='#72728c';ctx.textAlign='center';
    ctx.fillText('ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ',W/2,H-8);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Números Reais e Irracionais'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Números Reais e Irracionais</h1>'+
      '<p class="topic-meta">ℚ vs ℝ∖ℚ · √2 irracional · decimal infinito · densidade de ℝ</p>'+
      '<div class="content-block">'+'<p>Os reais (ℝ) incluem tudo: racionais e irracionais. Os irracionais (ℝ∖ℚ) têm representação decimal infinita e não periódica, e não podem ser escritos como p/q.</p>'+'<div class="concept-highlight"><div class="hl-label">Hierarquia dos conjuntos</div>ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ<br>ℝ∖ℚ = irracionais: √2, √3, π, e, φ (áureo)...<br>Todo real é racional ou irracional — não existe meio-termo.</div>'+'<div class="concept-highlight"><div class="hl-label">√2 é irracional — prova por absurdo</div>Hipótese: √2=p/q (irredutível) → 2=p²/q² → p²=2q² → p par → p=2k → q²=2k² → q par. Contradição com MDC(p,q)=1.</div>'+'<div class="concept-highlight"><div class="hl-label">Representação decimal</div>Racional: decimal finito (1/4=0,25) ou periódico (1/3=0,333...)<br>Irracional: decimal infinito NÃO periódico (√2=1,41421356...)</div>'+'<div class="concept-highlight"><div class="hl-label">Densidade de ℝ</div>Entre dois reais há sempre um racional e um irracional.<br>ℝ é "mais denso" que ℚ — mas ambos são densos.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/real_numbers/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawRealLine();
  }

  var _exSteps=[{"equation":"Classifique: √4, √2, 0,333..., π","note":"problema de classificação"},{"equation":"√4 = 2 ∈ ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ","note":"raiz de quadrado perfeito = inteiro"},{"equation":"0,333... = 1/3 ∈ ℚ (periódico simples)","note":"decimal periódico é racional"},{"equation":"√2 ∉ ℚ — irracional (prova por absurdo)","note":"não é fração"},{"equation":"π ∉ ℚ — irracional transcendente","note":"decimal infinito não periódico"},{"equation":"Hierarquia: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ  |  ℝ∖ℚ = irracionais","note":"mapa dos conjuntos"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Números Reais e Irracionais',href:'topic/real_numbers/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: classificar e provar irracionalidade</h1>'+
      '<p class="topic-meta">√2 irracional, hierarquia de conjuntos</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="RN.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="RN.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawRealLine();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    var s=_exSteps[i];
    document.getElementById('step-desc').innerHTML=i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
      '<span class="text-mono text-gold">'+s.equation+'</span>';
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/real_numbers/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){RN.nextStep();};}}
    _drawRealLine();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Números Reais e Irracionais',href:'topic/real_numbers/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="RN.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawRealLine();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML='<div class="exercise-card">'+
      '<p class="exercise-statement">'+ex.statement+'</p>'+
      '<div class="exercise-equation">'+ex.equation+'</div>'+
      '<div class="answer-row"><span class="answer-label">= </span>'+
      '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
      '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
      '<div class="btn-row"><button class="btn btn-primary" onclick="RN.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="RN.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="RN.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')RN.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/real_numbers/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(',','.'),c=String(_pr.exercise.answer).replace(',','.');
      var sn=parseFloat(s.replace(/[^0-9.-]/g,'')),cn=parseFloat(c.replace(/[^0-9.-]/g,''));
      var ok=s===c||inp.value.trim()===String(_pr.exercise.answer)||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+String(_pr.exercise.answer);
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
  window.RN=_pub;
})();
