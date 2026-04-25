/**
 * modules/trig_circle.js
 * Trigonometria no Círculo Trigonométrico.
 * Canvas: círculo unitário com ângulo destacado e projeções.
 */
(function () {
  var TOPIC_ID = 'trig_circle';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawUnitCircle(highlightDeg){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,r=Math.min(W,H)*0.37;
    // Circle
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
    // Axes
    ctx.strokeStyle='#3e3e58';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx-r-12,cy);ctx.lineTo(cx+r+12,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,cy-r-12);ctx.lineTo(cx,cy+r+12);ctx.stroke();
    // Key angles
    var keyAngles=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330];
    keyAngles.forEach(function(deg){
      var rad=deg*Math.PI/180;
      var px=cx+r*Math.cos(rad),py=cy-r*Math.sin(rad);
      var isHL=deg===highlightDeg;
      ctx.fillStyle=isHL?'#c8a44a':'#3e3e58';
      ctx.beginPath();ctx.arc(px,py,isHL?5:3,0,Math.PI*2);ctx.fill();
      if(deg%45===0){
        ctx.fillStyle=isHL?'#c8a44a':'#72728c';ctx.font=(isHL?'bold ':'')+'9px JetBrains Mono,monospace';
        var lx=cx+(r+18)*Math.cos(rad),ly=cy-(r+18)*Math.sin(rad);
        ctx.textAlign='center';ctx.fillText(deg+'°',lx,ly+4);
      }
    });
    if(highlightDeg!==undefined){
      var rad=highlightDeg*Math.PI/180;
      var px=cx+r*Math.cos(rad),py=cy-r*Math.sin(rad);
      // Radius line
      ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
      // Drop lines (projections)
      ctx.strokeStyle='rgba(200,164,74,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,3]);
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(cx,py);ctx.stroke();
      ctx.setLineDash([]);
      // Labels
      ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText('cos',px,cy+14);
      ctx.fillStyle='#4ab8b2';ctx.textAlign='left';
      ctx.fillText('sen',cx+4,py-4);
    }
    ctx.fillStyle='#3e3e58';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Círculo Unitário (r=1)',W/2,H-6);
  }
  function _initCanvas(){_drawUnitCircle(45);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Círculo'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Trigonometria no Círculo</h1>'+
          '<p class="topic-meta">círculo unitário · radianos · identidades · ângulo duplo · inversas</p>'+
          '<div class="content-block">'+
            '<p>O círculo unitário generaliza seno e cosseno para qualquer ângulo, positivo ou negativo, além dos 90° do triângulo retângulo.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Círculo unitário</div>'+
              'Para ângulo θ: ponto P = (cos θ, sen θ).<br>'+
              'Identidade fundamental: sen²θ + cos²θ = 1<br>'+
              'tan θ = sen θ / cos θ  (indef. em 90° e 270°)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Conversão graus ↔ radianos</div>'+
              'π rad = 180°  →  1° = π/180 rad<br>'+
              '30°=π/6  45°=π/4  60°=π/3  90°=π/2  180°=π'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Sinais por quadrante</div>'+
              '1º: sen+, cos+  |  2º: sen+, cos−<br>'+
              '3º: sen−, cos−  |  4º: sen−, cos+'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Ângulo duplo</div>'+
              'sen(2α) = 2·sen(α)·cos(α)<br>'+
              'cos(2α) = cos²α − sen²α = 1−2sen²α = 2cos²α−1'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="TrigC.showAngle(45)">45°</div>'+
            '<div class="phase-step" onclick="TrigC.showAngle(30)">30°</div>'+
            '<div class="phase-step" onclick="TrigC.showAngle(120)">120°</div>'+
            '<div class="phase-step" onclick="TrigC.showAngle(270)">270°</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/trig_circle/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Calcule sen(150°) usando o círculo trigonométrico',note:'problema'},
    {equation:'150° está no 2º quadrante (entre 90° e 180°)',note:'localizar no círculo'},
    {equation:'Ângulo de referência = 180° − 150° = 30°',note:'ângulo agudo equivalente'},
    {equation:'No 2º quadrante: sen > 0  (y > 0)',note:'sinal do seno'},
    {equation:'sen(150°) = +sen(30°)',note:'seno do ângulo de referência com sinal correto'},
    {equation:'sen(30°) = 1/2',note:'valor tabelado'},
    {equation:'sen(150°) = 1/2  |  cos(150°) = −√3/2',note:'resultado final'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Círculo',href:'topic/trig_circle/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: sen(150°)</h1>'+
          '<p class="topic-meta">usando o círculo trigonométrico e ângulo de referência</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="TrigC.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="TrigC.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawUnitCircle(150);
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/trig_circle/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){TrigC.nextStep();};}}
    _drawUnitCircle(i<=2?150:i<=4?30:150);
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Trig. Círculo',href:'topic/trig_circle/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="TrigC.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    _drawUnitCircle(ex.deg||45);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">Ex: 1/2 ou √3/2 ou √2/2 ou 0 ou 1 ou indef. ou 30°</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="TrigC.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="TrigC.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="TrigC.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')TrigC.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showAngle:function(deg){
      var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var degs=[45,30,120,270];
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',degs[i]===deg);});
      _drawUnitCircle(deg);
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/trig_circle/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim().replace(/\s/g,''),c=String(_pr.exercise.answer).replace(/\s/g,'');
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Use: 1/2, √3/2, √2/2, 0, 1 ou indef.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();}
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.TrigC=_pub;
})();
