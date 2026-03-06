/**
 * modules/similarity.js
 * Semelhança e Congruência — critérios, razão, escala, Pitágoras, área proporcional.
 * Canvas: dois triângulos semelhantes sobrepostos com razão indicada.
 */
(function () {
  var TOPIC_ID = 'similarity';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  function _drawSimilarTriangles(k){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    k=k||2;
    var cx=W/2,cy=H/2;
    var r1=60,r2=r1*k/2;
    // Small triangle
    var s1=[[cx-r1,cy+r1*0.6],[cx+r1,cy+r1*0.6],[cx,cy-r1*0.8]];
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(s1[0][0],s1[0][1]);ctx.lineTo(s1[1][0],s1[1][1]);ctx.lineTo(s1[2][0],s1[2][1]);ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(90,143,210,0.1)';ctx.fill();
    // Large triangle offset
    var ox=80,r2s=r2*0.55;
    var s2=[[cx-r2s+ox,cy+r2s*0.6],[cx+r2s+ox,cy+r2s*0.6],[cx+ox,cy-r2s*0.8]];
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(s2[0][0],s2[0][1]);ctx.lineTo(s2[1][0],s2[1][1]);ctx.lineTo(s2[2][0],s2[2][1]);ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(200,164,74,0.08)';ctx.fill();
    // Labels
    ctx.fillStyle='#5a8fd2';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Triângulo menor',cx-30,cy+r1*0.6+18);
    ctx.fillStyle='#c8a44a';
    ctx.fillText('Triângulo maior (k='+k+')',cx+ox+10,cy+r2s*0.6+18);
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('Razão de semelhança k='+k+'  |  Áreas: razão k²='+(k*k),W/2,H-8);
  }

  function _drawPythagorean(a,b,c){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var px=80,py=H-80,qx=px+180,qy=py,rx=px,ry=py-140;
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.lineTo(rx,ry);ctx.closePath();ctx.stroke();
    ctx.fillStyle='rgba(90,143,210,0.08)';ctx.fill();
    // Right angle mark
    ctx.strokeStyle='#4ab8b2';ctx.lineWidth=1.5;
    ctx.strokeRect(px,py-16,16,-16);
    // Labels
    ctx.fillStyle='#c8a44a';ctx.font='bold 12px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(b,px+(qx-px)/2,py+18);      // base
    ctx.fillText(a,px-18,py-(py-ry)/2);       // height
    ctx.fillText(c+'(c)',px+(qx-rx)/2+14,(py+ry)/2-12);  // hyp
    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('a²+b²=c²  →  '+a+'²+'+b+'²='+c+'²',W/2,H-8);
  }

  function _initCanvas(){_drawSimilarTriangles(2);}

  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Semelhança e Congruência'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Semelhança e Congruência</h1>'+
          '<p class="topic-meta">critérios · razão de semelhança · escala · Pitágoras · área proporcional</p>'+
          '<div class="content-block">'+
            '<p>Dois triângulos são semelhantes se têm os mesmos ângulos. São congruentes se têm os mesmos ângulos E os mesmos lados.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Critérios de semelhança</div>'+
              'AA: dois ângulos iguais (o terceiro é automático)<br>'+
              'LAL: dois lados proporcionais e o ângulo entre eles igual<br>'+
              'LLL: os três lados proporcionais'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Razão de semelhança k</div>'+
              'Lados correspondentes: proporcional por k<br>'+
              'Perímetros: proporcional por k<br>'+
              'Áreas: proporcional por k²'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Teorema de Pitágoras</div>'+
              'Em triângulo retângulo: a² + b² = c² (c = hipotenusa)<br>'+
              'Ternos pitagóricos: (3,4,5), (5,12,13), (8,15,17)'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Escala em mapas</div>'+
              'Escala 1:n → 1 cm no mapa = n cm na realidade.<br>'+
              'distância real = distância no mapa × n'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Sim.showSimilar(2)">k=2</div>'+
            '<div class="phase-step" onclick="Sim.showSimilar(3)">k=3</div>'+
            '<div class="phase-step" onclick="Sim.showPyth(3,4,5)">(3,4,5)</div>'+
            '<div class="phase-step" onclick="Sim.showPyth(5,12,13)">(5,12,13)</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/similarity/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_initCanvas();
  }

  var _exSteps=[
    {equation:'Triângulos △ABC ~ △DEF com k=3. △ABC tem lados 4, 5, 6. Ache os lados de △DEF e a razão das áreas.',note:'problema de semelhança'},
    {equation:'Lados de △DEF: 4×3=12, 5×3=15, 6×3=18',note:'multiplicar por k=3'},
    {equation:'Razão das áreas = k² = 3² = 9',note:'áreas crescem com k²'},
    {equation:'Se área de △ABC = 10 cm², área de △DEF = 10×9 = 90 cm²',note:'aplicar a razão'},
    {equation:'Pitágoras: triângulo retângulo com catetos 5 e 12.',note:'segundo problema'},
    {equation:'c² = 5² + 12² = 25 + 144 = 169',note:'aplicar a²+b²=c²'},
    {equation:'c = √169 = 13',note:'terno (5,12,13)'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Semelhança',href:'topic/similarity/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo: semelhança e Pitágoras</h1>'+
          '<p class="topic-meta">razão k=3 e terno (5,12,13)</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Sim.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Sim.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);_drawSimilarTriangles(3);
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
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/similarity/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Sim.nextStep();};}}
    if(i>=4)_drawPythagorean(5,12,13);else _drawSimilarTriangles(3);
    Renderer.drawEquationSteps(_exSteps,i);
  }
  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Semelhança',href:'topic/similarity/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Sim.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
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
    if(ex.simType==='pyth'){var t=[[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];var tr=t[0];_drawPythagorean(tr[0],tr[1],tr[2]);}
    else _drawSimilarTriangles(ex.k||2);
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    var isCrit=ex.simType==='congruence';
    var fmt='<p class="text-dim" style="font-size:12px;margin-bottom:12px">'+
      (isCrit?'Ex: LAL (Lado-Ângulo-Lado)':'Ex: 12, 15, 18  ou  13  ou  90 cm²')+
      '</p>';
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+fmt+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Sim.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Sim.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Sim.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Sim.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}
  var _pub={
    showSimilar:function(k){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===(k===2?0:1));});
      _drawSimilarTriangles(k);},
    showPyth:function(a,b,c){var p=document.getElementById('canvas-panel');if(!p)return;_mc(p,420,380);
      document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===(a===3?2:3));});
      _drawPythagorean(a,b,c);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/similarity/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');if(!inp||!fb||!_pr.exercise)return;
      var s=inp.value.trim(),c=String(_pr.exercise.answer);
      var sn=parseFloat(s.replace(/[^0-9.-]/g,'')),cn=parseFloat(c.replace(/[^0-9.-]/g,''));
      var ok=s===c||s.toLowerCase()===c.toLowerCase()||(!isNaN(sn)&&!isNaN(cn)&&Math.abs(sn-cn)<=0.05&&s.replace(/[0-9.,\s]/g,'')===c.replace(/[0-9.,\s]/g,''));
      if(!ok)ok=s.replace(/\s/g,'')===c.replace(/\s/g,'');
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
  window.Sim=_pub;
})();
