/**
 * modules/statistics.js
 * Estatística Avançada
 */
(function () {
  var TOPIC_ID = 'statistics';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawBoxplot(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var min=2,q1=5,q2=9,q3=13,max=16;
    var pad=40,y=H/2,scale=(W-2*pad)/(max-min);
    function px(v){return pad+(v-min)*scale;}
    // whiskers
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(px(min),y);ctx.lineTo(px(q1),y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px(q3),y);ctx.lineTo(px(max),y);ctx.stroke();
    [[px(min),y-12],[px(max),y-12]].forEach(function(p){ctx.beginPath();ctx.moveTo(p[0],y-12);ctx.lineTo(p[0],y+12);ctx.stroke();});
    // box
    ctx.fillStyle='rgba(90,143,210,0.25)';ctx.fillRect(px(q1),y-20,px(q3)-px(q1),40);
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.strokeRect(px(q1),y-20,px(q3)-px(q1),40);
    // median
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(px(q2),y-20);ctx.lineTo(px(q2),y+20);ctx.stroke();
    // labels
    var lbls=[[min,'mín=2'],[q1,'Q1=5'],[q2,'Q2=9'],[q3,'Q3=13'],[max,'máx=16']];
    ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
    lbls.forEach(function(l){ctx.fillText(l[1],px(l[0]),y+34);});
    ctx.fillStyle='#c8a44a';ctx.fillText('IQR='+(q3-q1),px((q1+q3)/2),y-28);
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Estatística Avançada'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Estatística Avançada</h1>'+
      '<p class="topic-meta">variância · desvio padrão · quartis · boxplot · distribuição normal</p>'+
      '<div class="content-block">'+'<p>Estatística avançada vai além da média: mede dispersão (variância, desvio padrão) e distribuição dos dados (quartis, boxplot).</p>'+'<div class="concept-highlight"><div class="hl-label">Variância e desvio padrão</div>σ² = Σ(xᵢ−x̄)²/n  (variância populacional)<br>σ = √σ²  (desvio padrão)<br>Quanto maior, mais dispersos os dados.</div>'+'<div class="concept-highlight"><div class="hl-label">Quartis e IQR</div>Q1=25%, Q2=50% (mediana), Q3=75% dos dados.<br>IQR = Q3−Q1 (amplitude interquartil)<br>Outliers: abaixo de Q1−1,5·IQR ou acima de Q3+1,5·IQR</div>'+'<div class="concept-highlight"><div class="hl-label">Regra empírica (dist. normal)</div>μ±1σ → ~68% | μ±2σ → ~95% | μ±3σ → ~99,7%</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/statistics/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawBoxplot();
  }

  var _exSteps=[{"equation":"Dados: 2, 4, 4, 4, 5, 5, 7, 9","note":"problema — calcular σ"},{"equation":"x̄ = (2+4+4+4+5+5+7+9)/8 = 40/8 = 5","note":"calcular a média"},{"equation":"Desvios ao quadrado: (2-5)²=9, (4-5)²=1, (4-5)²=1, (4-5)²=1, (5-5)²=0, (5-5)²=0, (7-5)²=4, (9-5)²=16","note":"(xᵢ−x̄)² para cada valor"},{"equation":"σ² = (9+1+1+1+0+0+4+16)/8 = 32/8 = 4","note":"variância = soma/n"},{"equation":"σ = √4 = 2","note":"desvio padrão = raiz da variância"},{"equation":"Interpretação: dados variam ±2 em torno da média 5","note":"leitura do resultado"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Estatística Avançada',href:'topic/statistics/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: variância e desvio padrão</h1>'+
      '<p class="topic-meta">dados: 2, 4, 4, 4, 5, 5, 7, 9</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Stat.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Stat.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawBoxplot();
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var s=_exSteps[i];
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
      '<span class="text-mono text-gold">'+s.equation+'</span>';
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/statistics/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){Stat.nextStep();};}}
    _drawBoxplot();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Estatística Avançada',href:'topic/statistics/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Stat.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawBoxplot();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Stat.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Stat.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Stat.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Stat.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/statistics/practice');}},
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
  window.Stat=_pub;
})();
