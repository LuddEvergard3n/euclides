/**
 * modules/decimals.js
 * Números Decimais e Percentuais — conversões, porcentagem, acréscimo/desconto.
 * Canvas: barra de porcentagem interativa.
 */
(function () {
  var TOPIC_ID = 'decimals';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawPctBar(pct, label) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    pct = Math.max(0, Math.min(100, pct));
    var padH=40, padV=100, bH=56, bW=W-2*padH;
    var by=(H-bH)/2;
    // Background
    ctx.fillStyle='rgba(30,30,50,0.6)';ctx.fillRect(padH,by,bW,bH);
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.strokeRect(padH,by,bW,bH);
    // Fill
    ctx.fillStyle='rgba(90,143,210,0.55)';ctx.fillRect(padH+1,by+1,bW*pct/100-2,bH-2);
    // Percentage marks every 10%
    for(var i=0;i<=10;i++){
      var x=padH+i*bW/10;
      ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x,by+bH);ctx.lineTo(x,by+bH+8);ctx.stroke();
      ctx.fillStyle='#72728c';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(i*10+'%',x,by+bH+20);
    }
    // Value marker
    var mx=padH+bW*pct/100;
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx,by-8);ctx.lineTo(mx,by+bH+8);ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.font='bold 12px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(pct+'% = '+(label||pct/100),mx,by-14);
  }
  function _initCanvas(){_drawPctBar(25,'0,25');}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Decimais e Percentuais'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Números Decimais e Percentuais</h1>'+
          '<p class="topic-meta">conversão · porcentagem · acréscimo · desconto · descontos sucessivos</p>'+
          '<div class="content-block">'+
            '<p>Decimais e porcentagens são representações do mesmo número. Dominar as conversões é essencial para problemas de finanças, estatística e cotidiano.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Conversões</div>'+
              'Fração → decimal: divida. Ex: 3/4 = 0,75<br>'+
              'Decimal → %: multiplique por 100. Ex: 0,75 = 75%<br>'+
              '% → decimal: divida por 100. Ex: 30% = 0,30'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Cálculo de porcentagem</div>'+
              'p% de N = p/100 × N<br>'+
              'Ex: 15% de 80 = 0,15 × 80 = 12'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Acréscimo e desconto</div>'+
              'Acréscimo r%: novo = N × (1 + r/100)<br>'+
              'Desconto r%: novo = N × (1 − r/100)<br>'+
              'Descontos sucessivos: aplique um por vez.'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Dec.show(25,\'0,25\')">25%</div>'+
            '<div class="phase-step" onclick="Dec.show(50,\'0,5\')">50%</div>'+
            '<div class="phase-step" onclick="Dec.show(75,\'0,75\')">75%</div>'+
            '<div class="phase-step" onclick="Dec.show(10,\'0,1\')">10%</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/decimals/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Um produto custa R$120. Há desconto de 15%. Qual o preço final?',note:'problema — desconto percentual'},
    {equation:'Desconto = 15% de 120 = 0,15 × 120 = 18',note:'calcular o desconto'},
    {equation:'Preço final = 120 − 18 = 102',note:'subtrair o desconto'},
    {equation:'Alternativa: 120 × (1 − 0,15) = 120 × 0,85',note:'método direto — fator de desconto'},
    {equation:'120 × 0,85 = 102',note:'mesmo resultado'},
    {equation:'Preço final = R$ 102',note:'resposta'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Decimais',href:'topic/decimals/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: desconto de 15% sobre R$120</h1>'+
          '<p class="topic-meta">dois métodos equivalentes</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Dec.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Dec.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawPctBar(85,'R$102');
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i];return i>0?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':'Problema: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/decimals/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Dec.nextStep();};}}
    _drawPctBar(i>=2?85:15,i>=2?'R$102':'15%');
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Decimais',href:'topic/decimals/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Dec.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    if(ex.decType==='pct_of'||ex.decType==='pct_change'||ex.decType==='successive'){
      var pct=parseFloat(String(ex.answer).replace(/[^0-9.,]/g,''))||50;
      _drawPctBar(Math.min(pct,100),ex.answer);
    }else _initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isFrac=ex.decType==='frac_dec';
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">'+
      (isFrac?'Ex: 1/4 ou 3/5':'Ex: 0,25 ou 12 ou R$102')+'</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Dec.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Dec.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Dec.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Dec.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    show:function(pct,lbl){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var vals=[25,50,75,10];document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',vals[i]===pct);});
      _drawPctBar(pct,lbl);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/decimals/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(',','.'),c=String(_pr.exercise.answer).replace(',','.');
      var sn=parseFloat(s.replace(/[^0-9.-]/g,'')),cn=parseFloat(c.replace(/[^0-9.-]/g,''));
      var ok=s===c||inp.value.trim()===String(_pr.exercise.answer)||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.01);
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
  window.Dec=_pub;
})();
