/**
 * modules/angles.js
 * Geometria: Ângulos e Polígonos — classificação, triângulos, soma interna, Tales.
 * Canvas: triângulo com ângulos destacados e polígono regular.
 */
(function () {
  var TOPIC_ID = 'angles';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawTriangle(a,b,c){
    // a,b,c are angles in degrees
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2+20,r=100;
    // Place vertices: A at top, B bottom-left, C bottom-right based on angles
    var aRad=a*Math.PI/180,bRad=b*Math.PI/180;
    var Ax=cx,Ay=cy-r*0.85;
    var Bx=cx-r*Math.cos(Math.PI/6)*1.1,By=cy+r*0.55;
    var Cx=cx+r*Math.cos(Math.PI/6)*1.1,Cy=cy+r*0.55;
    // Draw triangle
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(Ax,Ay);ctx.lineTo(Bx,By);ctx.lineTo(Cx,Cy);ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(90,143,210,0.08)';ctx.fill();
    // Angle arcs
    [[Ax,Ay,a,'A'],[Bx,By,b,'B'],[Cx,Cy,c,'C']].forEach(function(v){
      ctx.strokeStyle='#c8a44a';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(v[0],v[1],18,0,2*Math.PI);ctx.strokeStyle='rgba(200,164,74,0.3)';ctx.stroke();
      ctx.fillStyle='#c8a44a';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v[2]+'°',v[0],v[1]+(v[3]==='A'?-22:20));
    });
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(a+'°+'+b+'°+'+c+'° = 180°',W/2,H-10);
  }

  function _drawPolygon(n){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var cx=W/2,cy=H/2,r=100;
    var sum=(n-2)*180,each=sum/n;
    ctx.strokeStyle='#4ab8b2';ctx.lineWidth=2;ctx.beginPath();
    for(var i=0;i<n;i++){
      var angle=2*Math.PI*i/n - Math.PI/2;
      var x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(74,184,178,0.08)';ctx.fill();
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    var names={3:'Triângulo',4:'Quadrilátero',5:'Pentágono',6:'Hexágono',7:'Heptágono',8:'Octógono'};
    ctx.fillText((names[n]||n+'-ágono')+' — S=('+n+'-2)×180°='+sum+'°',W/2,H-22);
    ctx.fillText('Cada ângulo interno (regular) = '+Math.round(each*10)/10+'°',W/2,H-8);
  }

  function _initCanvas(){_drawTriangle(60,70,50);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Ângulos e Polígonos'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Geometria: Ângulos e Polígonos</h1>'+
          '<p class="topic-meta">classificação · triângulos · soma interna · polígonos · Teorema de Tales</p>'+
          '<div class="content-block">'+
            '<p>Os ângulos são a base da geometria. Conhecer a soma dos ângulos internos de qualquer polígono permite resolver a maioria dos problemas geométricos do EF II.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Classificação de ângulos</div>'+
              'Agudo: 0° &lt; α &lt; 90°  |  Reto: α = 90°<br>'+
              'Obtuso: 90° &lt; α &lt; 180°  |  Raso: α = 180°'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Triângulos</div>'+
              'Soma interna = 180°  (sempre)<br>'+
              'Ângulo externo = soma dos dois internos não adjacentes<br>'+
              'Por lados: equilátero, isósceles, escaleno<br>'+
              'Por ângulos: acutângulo, retângulo, obtusângulo'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Polígonos</div>'+
              'Soma ângulos internos = (n−2) × 180°<br>'+
              'Cada ângulo de regular n-ágono = (n−2)×180°/n<br>'+
              'Soma ângulos externos = sempre 360°'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Teorema de Tales</div>'+
              'Retas paralelas cortadas por transversais → segmentos proporcionais.<br>'+
              'a/b = c/d  (produto cruzado: ad = bc)'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Ang.showFig(\'tri\')">Triângulo</div>'+
            '<div class="phase-step" onclick="Ang.showFig(\'hex\')">Hexágono</div>'+
            '<div class="phase-step" onclick="Ang.showFig(\'pent\')">Pentágono</div>'+
            '<div class="phase-step" onclick="Ang.showFig(\'oct\')">Octógono</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/angles/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Soma dos ângulos internos de um hexágono (6 lados)?',note:'problema — polígono'},
    {equation:'Fórmula: S = (n−2) × 180°',note:'soma de ângulos internos'},
    {equation:'S = (6−2) × 180° = 4 × 180°',note:'substituir n=6'},
    {equation:'S = 720°',note:'resultado'},
    {equation:'Em um triângulo, dois ângulos são 65° e 80°. Qual o terceiro?',note:'segundo problema'},
    {equation:'x = 180° − 65° − 80° = 35°',note:'soma = 180°'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Ângulos',href:'topic/angles/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: ângulos internos</h1>'+
          '<p class="topic-meta">hexágono e triângulo</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Ang.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Ang.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawPolygon(6);
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/angles/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Ang.nextStep();};}}
    if(i>=4)_drawTriangle(65,80,35);else _drawPolygon(6);
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Ângulos',href:'topic/angles/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Ang.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    if(ex.angType==='triangle'||ex.angType==='exterior')_drawTriangle(60,70,50);
    else if(ex.angType==='polygon'){var sides={4:4,5:5,6:6,7:7,8:8};_drawPolygon(sides[ex.n]||5);}
    else _initCanvas();
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isTxt=ex.angType==='type';
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">'+
      (isTxt?'Resposta: agudo, reto, obtuso ou raso':'Ex: 35°  ou  720°  ou  12')+
      '</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Ang.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Ang.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Ang.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Ang.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showFig:function(fig){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      var figs=['tri','hex','pent','oct'];
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',figs[i]===fig);});
      if(fig==='tri')_drawTriangle(60,70,50);
      else if(fig==='hex')_drawPolygon(6);
      else if(fig==='pent')_drawPolygon(5);
      else _drawPolygon(8);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/angles/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s),cn=parseFloat(c);
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.5);
      if(!ok&&s.replace('°','')===c.replace('°',''))ok=true;
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
  window.Ang=_pub;
})();
