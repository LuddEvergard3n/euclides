/**
 * modules/ratio.js
 * Razão, Proporção e Regra de Três — direta, inversa e composta.
 * Canvas: barras proporcionais comparativas.
 */
(function () {
  var TOPIC_ID = 'ratio';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawPropBars(pairs,title){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var maxV=Math.max.apply(null,pairs.map(function(p){return p.val;}));
    var padL=80,padR=12,padT=36,bH=28,gap=14;
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(title||'',W/2,20);
    var cW=W-padL-padR;
    pairs.forEach(function(p,i){
      var y=padT+i*(bH+gap);
      var bw=cW*(p.val/maxV);
      ctx.fillStyle=p.color||'rgba(90,143,210,0.45)';
      ctx.fillRect(padL,y,bw,bH);
      ctx.strokeStyle=p.color?p.color.replace('0.45','1'):'#5a8fd2';ctx.lineWidth=1.5;
      ctx.strokeRect(padL,y,bw,bH);
      ctx.fillStyle='#72728c';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='right';
      ctx.fillText(p.label,padL-6,y+bH/2+4);
      ctx.fillStyle='#e8e8f2';ctx.textAlign='left';
      ctx.fillText(p.val,padL+bw+4,y+bH/2+4);
    });
  }

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Razão e Proporção'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Razão, Proporção e Regra de Três</h1>'+
          '<p class="topic-meta">razão · proporção · regra de três direta · inversa · composta</p>'+
          '<div class="content-block">'+
            '<p>Proporção é a igualdade entre duas razões. A regra de três é a técnica que resolve proporções com um valor desconhecido.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Razão e Proporção</div>'+
              'Razão a:b = a/b. Proporção: a/b = c/d ↔ a×d = b×c (produto cruzado).<br>'+
              'Simplificar: divida pelo MDC(a,b).'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Regra de Três Simples</div>'+
              'Direta: A/B = C/X → X = B×C/A (mais de um → mais do outro).<br>'+
              'Inversa: A×B = C×X → X = A×B/C (mais de um → menos do outro).'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Regra de Três Composta</div>'+
              'Múltiplas grandezas: identifique sentido (direto/inverso) de cada par,<br>'+
              'então escreva o produto constante e resolva para x.'+
            '</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/ratio/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawPropBars([
      {label:'3 prod.',val:3,color:'rgba(90,143,210,0.45)'},
      {label:'R$ 9',val:9,color:'rgba(90,143,210,0.45)'},
      {label:'7 prod.',val:7,color:'rgba(200,164,74,0.45)'},
      {label:'R$ ?',val:21,color:'rgba(200,164,74,0.45)'},
    ],'3 prod. = R$9  →  7 prod. = R$21');
  }

  var _exSteps=[
    {equation:'4 operários terminam uma obra em 15 dias. Quantos dias para 6 operários?',note:'problema — relação inversa'},
    {equation:'Mais operários → menos dias: grandeza INVERSA',note:'identificar tipo'},
    {equation:'Produto constante: operários × dias = constante',note:'relação inversa'},
    {equation:'4×15 = 6×x',note:'montar a equação'},
    {equation:'x = 60/6 = 10',note:'resolver para x'},
    {equation:'Verificação: 4×15 = 60 = 6×10 ✓',note:'conferir'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Razão',href:'topic/ratio/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: Regra de Três Inversa</h1>'+
          '<p class="topic-meta">4 operários × 15 dias → 6 operários × ? dias</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Ratio.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Ratio.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawPropBars([
      {label:'4 op.',val:4,color:'rgba(90,143,210,0.45)'},{label:'15 dias',val:15,color:'rgba(90,143,210,0.45)'},
      {label:'6 op.',val:6,color:'rgba(200,164,74,0.45)'},{label:'10 dias',val:10,color:'rgba(200,164,74,0.45)'},
    ],'inversa: mais operários → menos dias');
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/ratio/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Ratio.nextStep();};}}
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Razão',href:'topic/ratio/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Ratio.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var p=document.getElementById('canvas-panel');if(p){_mc(p,420,380);}
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isRatio=ex.ratioType==='ratio';
    var fmt=isRatio?'<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: a:b (ex: 3:4)</p>':
                    '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Resposta numérica (inteiro ou decimal)</p>';
    var placeholder=isRatio?'a:b':'número';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="'+placeholder+'" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Ratio.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Ratio.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Ratio.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Ratio.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/ratio/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sNum=parseFloat(s.replace(',','.')),cNum=parseFloat(c.replace(',','.'));
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sNum)&&Math.abs(sNum-cNum)<=0.05);
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
  window.Ratio=_pub;
})();
