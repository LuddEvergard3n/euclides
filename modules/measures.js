/**
 * modules/measures.js
 * Grandezas e Medidas — conversão de unidades, escala, notação científica.
 * Canvas: régua de conversão visual.
 */
(function () {
  var TOPIC_ID = 'measures';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawConvTable(category) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var tables={
      length:[['km','÷ 1000','m','÷ 100','cm','÷ 10','mm']],
      mass:[['t','÷ 1000','kg','÷ 1000','g','÷ 1000','mg']],
      volume:[['m³','× 1000','L','× 1000','mL']],
      time:[['dia','× 24','h','× 60','min','× 60','s']],
    };
    var rows=tables[category]||tables.length;
    var padL=20,padT=50,cellW=54,cellH=44;
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    var labels={length:'Comprimento',mass:'Massa',volume:'Volume',time:'Tempo'};
    ctx.fillText(labels[category]||'Comprimento',W/2,22);
    ctx.fillStyle='#3e3e58';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('← ÷ para converter para maior   |   × para converter para menor →',W/2,38);
    rows[0].forEach(function(item,i){
      var x=padL+i*cellW+cellW/2,y=padT;
      var isUnit=i%2===0;
      if(isUnit){
        ctx.fillStyle='rgba(90,143,210,0.35)';ctx.fillRect(padL+i*cellW,padT,cellW,cellH);
        ctx.strokeStyle='#5a8fd2';ctx.lineWidth=1;ctx.strokeRect(padL+i*cellW,padT,cellW,cellH);
        ctx.fillStyle='#e8e8f2';ctx.font='bold 12px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(item,x,padT+cellH/2+5);
      }else{
        ctx.fillStyle='#c8a44a';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText(item,x,padT+cellH/2+5);
        // arrows
        ctx.strokeStyle='#c8a44a';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(padL+i*cellW-8,padT+cellH/2);ctx.lineTo(padL+i*cellW+8,padT+cellH/2);ctx.stroke();
      }
    });
  }
  function _initCanvas(){_drawConvTable('length');}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Grandezas e Medidas'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Grandezas e Medidas</h1>'+
          '<p class="topic-meta">comprimento · massa · volume · tempo · escala · notação científica</p>'+
          '<div class="content-block">'+
            '<p>Converter unidades é multiplicar ou dividir pela relação entre elas. O erro mais comum é dividir quando deveria multiplicar — a tabela torna isso visual.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Comprimento</div>'+
              'km → m: × 1000  |  m → cm: × 100  |  cm → mm: × 10<br>'+
              'mm → cm: ÷ 10  |  cm → m: ÷ 100  |  m → km: ÷ 1000'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Massa e Volume</div>'+
              't → kg: × 1000  |  kg → g: × 1000  |  g → mg: × 1000<br>'+
              'm³ → L: × 1000  |  L → mL: × 1000'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Notação científica</div>'+
              'Forma a × 10ⁿ com 1 ≤ a &lt; 10.<br>'+
              'Mova a vírgula: direita → n negativo, esquerda → n positivo.<br>'+
              'Ex: 0,00045 = 4,5 × 10⁻⁴  |  300000 = 3 × 10⁵'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Meas.showTable(\'length\')">Comprimento</div>'+
            '<div class="phase-step" onclick="Meas.showTable(\'mass\')">Massa</div>'+
            '<div class="phase-step" onclick="Meas.showTable(\'volume\')">Volume</div>'+
            '<div class="phase-step" onclick="Meas.showTable(\'time\')">Tempo</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/measures/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Converta 2,5 km para metros.',note:'problema — comprimento'},
    {equation:'1 km = 1000 m  →  km → m: × 1000',note:'relação entre as unidades'},
    {equation:'2,5 × 1000 = 2500 m',note:'multiplicar pela relação'},
    {equation:'Agora: 4500 g para kg.',note:'segundo problema — massa'},
    {equation:'1 kg = 1000 g  →  g → kg: ÷ 1000',note:'unidade maior: dividir'},
    {equation:'4500 ÷ 1000 = 4,5 kg',note:'resultado'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Medidas',href:'topic/measures/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: conversões de unidades</h1>'+
          '<p class="topic-meta">comprimento e massa</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Meas.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Meas.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_initCanvas();
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/measures/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Meas.nextStep();};}}
    _drawConvTable(i>=3?'mass':'length');
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Medidas',href:'topic/measures/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Meas.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    var cat=ex.measType||'length';if(cat==='sci')cat='length';
    _drawConvTable(cat);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Inclua a unidade. Ex: 2500 m  ou  4,5 × 10⁻³</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="valor + unidade" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Meas.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Meas.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Meas.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Meas.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showTable:function(cat){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var cats=['length','mass','volume','time'];
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',cats[i]===cat);});
      _drawConvTable(cat);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/measures/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(/\s+/g,' '),c=String(_pr.exercise.answer);
      var sn=parseFloat(s.replace(',','.')),cn=parseFloat(c.replace(',','.'));
      var ok=s===c||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=Math.max(0.01,Math.abs(cn)*0.01)&&s.replace(/[0-9.,\s]/g,'').trim()===c.replace(/[0-9.,\s]/g,'').trim());
      if(!ok)ok=s.replace(/\s/g,'')===c.replace(/\s/g,'');
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+c;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Inclua a unidade (ex: 2500 m).';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Meas=_pub;
})();
