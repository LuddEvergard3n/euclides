/**
 * modules/gauss_elim.js
 * Eliminação de Gauss
 */
(function () {
  var TOPIC_ID = 'gauss_elim';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawMatrix(){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    ctx.fillStyle='#72728c';ctx.font='12px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Matriz aumentada [A|b]',W/2,30);
    var rows=[[2,-1,3,5],[0,3,-2,4],[1,1,1,6]];
    var cw=55,rh=32,ox=W/2-110,oy=60;
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(ox-4,oy-6);ctx.lineTo(ox-10,oy-6);ctx.lineTo(ox-10,oy+rows.length*rh+2);ctx.lineTo(ox-4,oy+rows.length*rh+2);ctx.stroke();
    var ex=ox+rows[0].length*cw+4;
    ctx.beginPath();ctx.moveTo(ex+4,oy-6);ctx.lineTo(ex+10,oy-6);ctx.lineTo(ex+10,oy+rows.length*rh+2);ctx.lineTo(ex+4,oy+rows.length*rh+2);ctx.stroke();
    rows.forEach(function(row,ri){row.forEach(function(v,ci){
      ctx.fillStyle=ci===rows[0].length-1?'#c8a44a':'#e8e8f2';
      ctx.fillText(v,ox+ci*cw+cw/2,oy+ri*rh+rh/2+4);
    });});
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';
    ctx.fillText('[A|b] — escalonamento de Gauss-Jordan',W/2,H-5);
  }


  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Eliminação de Gauss'}])+
      UI.renderPhaseBar(TOPIC_ID,'concept')+
      '<h1 class="topic-title">Eliminação de Gauss</h1>'+
      '<p class="topic-meta">escalonamento · sistemas com parâmetro · posto · solução geral</p>'+
      '<div class="content-block">'+'<p>A eliminação de Gauss reduz um sistema linear à forma escalonada por operações elementares de linha, revelando a estrutura da solução.</p>'+'<div class="concept-highlight"><div class="hl-label">Operações elementares</div>L_i ↔ L_j (troca) | L_i → α·L_i (escala) | L_i → L_i + β·L_j (combinação)<br>Não alteram o conjunto solução.</div>'+'<div class="concept-highlight"><div class="hl-label">Posto e classificação</div>post(A) = número de linhas não nulas na forma escalonada.<br>SPD: posto(A)=posto([A|b])=n | SI: posto(A)≠posto([A|b]) | SPI: posto(A)=posto([A|b])<n</div>'+'<div class="concept-highlight"><div class="hl-label">Solução geral (SPI)</div>Variáveis livres (n−posto delas): parametrize.<br>Solução = solução particular + combinação do núcleo.</div>'+'</div>'+
      '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/gauss_elim/example\')">Ver exemplo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_drawMatrix();
  }

  var _exSteps=[{"equation":"x+y+z=6, 2x−y+z=3, x+2y−z=2","note":"sistema 3×3"},{"equation":"[1 1 1 | 6]  L₂→L₂−2L₁: [0 −3 −1 | −9]  L₃→L₃−L₁: [0 1 −2 | −4]","note":"eliminar x das linhas 2 e 3"},{"equation":"L₃→L₃+(1/3)L₂: [0 0 −7/3 | −7]","note":"eliminar y da linha 3"},{"equation":"De L₃: z = 3. De L₂: −3y−3=−9 → y=2. De L₁: x=1.","note":"substituição reversa"},{"equation":"x=1, y=2, z=3.","note":"solução"},{"equation":"Verificação: 1+2+3=6 ✓ | 2−2+3=3 ✓ | 1+4−3=2 ✓","note":"verificar nas 3 equações"}];
  function renderExample(view){
    _exStep=0;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Eliminação de Gauss',href:'topic/gauss_elim/concept'},{label:'Exemplo'}])+
      UI.renderPhaseBar(TOPIC_ID,'example')+
      '<h1 class="topic-title">Exemplo: sistema 3×3 e forma escalonada</h1>'+
      '<p class="topic-meta">resolver por eliminação de Gauss</p>'+
      '<div class="example-step-bar"><span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
      '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div></div>'+
      '<div class="step-description" id="step-desc"><span class="text-mono text-gold">'+_exSteps[0].equation+'</span></div>'+
      '<div class="btn-row"><button class="btn" id="btn-prev" onclick="Gauss.prevStep()" disabled>← Anterior</button>'+
      '<button class="btn btn-primary" id="btn-next" onclick="Gauss.nextStep()">Próximo →</button></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawMatrix();
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/gauss_elim/practice');};}    else{next.textContent='Próximo →';next.onclick=function(){Gauss.nextStep();};}}
    _drawMatrix();
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML='<div class="topic-screen"><div class="topic-content">'+
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Eliminação de Gauss',href:'topic/gauss_elim/concept'},{label:'Prática'}])+
      UI.renderPhaseBar(TOPIC_ID,'practice')+
      '<div class="practice-header"><span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
      '<label class="hint-toggle" onclick="Gauss.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label></div>'+
      '<div id="exercise-area"></div>'+
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);_drawMatrix();
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
      '<div class="btn-row"><button class="btn btn-primary" onclick="Gauss.checkAnswer()">Verificar</button>'+
      '<button class="btn" id="btn-hint" onclick="Gauss.showNextHint()" style="display:none">Ver dica</button>'+
      '<button class="btn" id="btn-next-ex" onclick="Gauss.nextExercise()" style="display:none">Próximo →</button></div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Gauss.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/gauss_elim/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s.replace(',','.')),cn=parseFloat(c.replace(',','.'));
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+c;
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
  window.Gauss=_pub;
})();
