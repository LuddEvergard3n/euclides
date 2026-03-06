/**
 * modules/spatial.js
 * Geometria Espacial — cubo, paralelepípedo, cilindro, cone, esfera.
 * Canvas: projeção isométrica dos sólidos.
 */
(function () {
  var TOPIC_ID = 'spatial';
  function _mc(panel,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;panel.innerHTML='';panel.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: isometric solids ──────────────────────────────────────
  function _iso(x,y,z){
    // isometric projection
    var ix = (x-z)*Math.cos(Math.PI/6);
    var iy = (x+z)*Math.sin(Math.PI/6)-y;
    return {x:ix,y:iy};
  }

  function _drawCube(cx,cy,a,color){
    var ctx=Renderer.ctx();
    var s=a*18; // scale
    // 8 corners
    function corner(dx,dy,dz){var p=_iso(dx*s,dy*s,dz*s);return{x:cx+p.x,y:cy+p.y};}
    var v=[corner(0,0,0),corner(1,0,0),corner(1,1,0),corner(0,1,0),
           corner(0,0,1),corner(1,0,1),corner(1,1,1),corner(0,1,1)];
    function face(pts,fill){ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(function(p){ctx.lineTo(p.x,p.y);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.stroke();}
    face([v[4],v[5],v[6],v[7]],'rgba(200,164,74,0.25)'); // top
    face([v[0],v[1],v[5],v[4]],'rgba(90,143,210,0.18)'); // front
    face([v[1],v[2],v[6],v[5]],'rgba(74,184,178,0.12)'); // right
    // Edge labels
    ctx.fillStyle=color||'#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText('a='+a,cx,cy+s*0.9+16);
  }

  function _drawCylinder(cx,cy,r,h){
    var ctx=Renderer.ctx();
    var rs=r*14,hs=h*12;
    // Ellipse top
    ctx.beginPath();ctx.ellipse(cx,cy-hs/2,rs,rs*0.35,0,0,Math.PI*2);
    ctx.fillStyle='rgba(200,164,74,0.25)';ctx.fill();ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.stroke();
    // Body
    ctx.beginPath();ctx.moveTo(cx-rs,cy-hs/2);ctx.lineTo(cx-rs,cy+hs/2);
    ctx.ellipse(cx,cy+hs/2,rs,rs*0.35,0,0,Math.PI);
    ctx.lineTo(cx+rs,cy-hs/2);ctx.strokeStyle='#2e2e4a';ctx.stroke();
    ctx.fillStyle='rgba(90,143,210,0.15)';
    ctx.beginPath();ctx.rect(cx-rs,cy-hs/2,rs*2,hs);ctx.fill();
    // Labels
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('r='+r,cx+rs+6,cy);
    ctx.fillText('h='+h,cx+rs+6,cy+14);
  }

  function _drawCone(cx,cy,r,h){
    var ctx=Renderer.ctx();
    var rs=r*14,hs=h*12;
    // Base ellipse
    ctx.beginPath();ctx.ellipse(cx,cy+hs/2,rs,rs*0.35,0,0,Math.PI*2);
    ctx.fillStyle='rgba(90,143,210,0.15)';ctx.fill();ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.stroke();
    // Sides
    ctx.beginPath();ctx.moveTo(cx-rs,cy+hs/2);ctx.lineTo(cx,cy-hs/2);ctx.lineTo(cx+rs,cy+hs/2);
    ctx.fillStyle='rgba(200,164,74,0.2)';ctx.fill();ctx.strokeStyle='#2e2e4a';ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('r='+r,cx+rs+6,cy+hs/2);ctx.fillText('h='+h,cx+rs+6,cy);
  }

  function _drawSphere(cx,cy,r){
    var ctx=Renderer.ctx();
    var rs=r*16;
    var g=ctx.createRadialGradient(cx-rs*0.3,cy-rs*0.3,rs*0.1,cx,cy,rs);
    g.addColorStop(0,'rgba(200,164,74,0.45)');g.addColorStop(1,'rgba(200,164,74,0.08)');
    ctx.beginPath();ctx.arc(cx,cy,rs,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.stroke();
    // Equator ellipse
    ctx.beginPath();ctx.ellipse(cx,cy,rs,rs*0.35,0,0,Math.PI*2);ctx.strokeStyle='rgba(46,46,74,0.5)';ctx.stroke();
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='left';
    ctx.fillText('r='+r,cx+rs+6,cy);
  }

  function _drawBox(cx,cy,l,w,h){
    var ctx=Renderer.ctx();
    var ls=l*14,ws=w*10,hs=h*12;
    function corner(dx,dy,dz){var p=_iso(dx*ls,dy*hs,dz*ws);return{x:cx+p.x,y:cy+p.y};}
    var v=[corner(0,0,0),corner(1,0,0),corner(1,1,0),corner(0,1,0),
           corner(0,0,1),corner(1,0,1),corner(1,1,1),corner(0,1,1)];
    function face(pts,fill){ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(function(p){ctx.lineTo(p.x,p.y);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;ctx.stroke();}
    face([v[4],v[5],v[6],v[7]],'rgba(200,164,74,0.25)');
    face([v[0],v[1],v[5],v[4]],'rgba(90,143,210,0.18)');
    face([v[1],v[2],v[6],v[5]],'rgba(74,184,178,0.12)');
    ctx.fillStyle='#c8a44a';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(l+'×'+w+'×'+h,cx,cy+Math.max(ls,ws)*0.6+24);
  }

  function _drawForExercise(ex){
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var s=ex.geoShape,cx=W/2,cy=H/2;
    if(s==='cube')     _drawCube(cx,cy,ex.a);
    else if(s==='box') _drawBox(cx,cy,ex.l,ex.w,ex.h);
    else if(s==='cylinder')_drawCylinder(cx,cy,ex.r,ex.h);
    else if(s==='cone')    _drawCone(cx,cy,ex.r,ex.h);
    else if(s==='sphere')  _drawSphere(cx,cy,ex.r);
    // Formula label bottom
    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(ex.equation||'',cx,H-12);
  }

  // ── CONCEPT ───────────────────────────────────────────────────────
  function renderConcept(view){
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Geometria Espacial'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Geometria Espacial</h1>'+
          '<p class="topic-meta">cubo · paralelepípedo · cilindro · cone · esfera</p>'+
          '<div class="content-block">'+
            '<p>Geometria espacial estuda figuras em três dimensões. As medidas principais são volume (espaço interno) e área total (superfície).</p>'+
            '<div class="concept-highlight"><div class="hl-label">Prismas e paralelepípedos</div>'+
              'V = base × altura  |  Cubo: V = a³, At = 6a²'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Cilindro</div>'+
              'V = πr²h  |  At = 2πr² + 2πrh  |  Al = 2πrh'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Cone</div>'+
              'V = πr²h/3  |  At = πr² + πrl  (l = geratriz = √(r²+h²))'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Esfera</div>'+
              'V = (4/3)πr³  |  At = 4πr²'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            ['cube','box','cylinder','cone','sphere'].map(function(s,i){
              return '<div class="phase-step'+(i===0?' active':'')+'" onclick="Spat.showShape(\''+s+'\')">'+
                {cube:'Cubo',box:'Paralelepípedo',cylinder:'Cilindro',cone:'Cone',sphere:'Esfera'}[s]+'</div>';
            }).join('')+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/spatial/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">cubo</p></div>'+
      '</div>';
    var panel=view.querySelector('#canvas-panel');_mc(panel,420,380);
    Renderer.clear();_drawCube(210,190,4);
  }

  var _exSteps=[
    {equation:'Cilindro: r=3, h=7',                    note:'sólido dado'},
    {equation:'V = π × r² × h',                        note:'fórmula do volume'},
    {equation:'V = 3,14 × 9 × 7',                      note:'substituição (π≈3,14)'},
    {equation:'V = 3,14 × 63',                         note:'simplificar'},
    {equation:'V = 197,82',                             note:'volume do cilindro'},
    {equation:'Al = 2 × 3,14 × 3 × 7 = 131,88',       note:'área lateral'},
    {equation:'At = Al + 2πr² = 131,88 + 56,52 = 188,4',note:'área total'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'G. Espacial',href:'topic/spatial/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">cilindro: r=3, h=7  ·  volume e área total</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Spat.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Spat.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">cilindro r=3 h=7</p></div>'+
      '</div>';
    var panel=view.querySelector('#canvas-panel');_mc(panel,420,340);
    Renderer.clear();_drawCylinder(210,170,3,7);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Dado: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/spatial/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Spat.nextStep();};}}
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'G. Espacial',href:'topic/spatial/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Spat.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">sólido</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    Renderer.clear();_drawForExercise(_pr.exercise);
    var lbl=document.getElementById('canvas-label');if(lbl)lbl.textContent=_pr.exercise.geoShape||'sólido';
  }
  function _renderCard(){
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_pr.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_pr.history.length+1);
    area.innerHTML=
      '<div class="exercise-card">'+
        '<p class="exercise-statement">'+ex.statement+'</p>'+
        '<div class="exercise-equation">'+ex.equation+'</div>'+
        '<div class="answer-row"><span class="answer-label">= </span>'+
          '<input class="answer-input" id="answer-input" type="text" placeholder="número" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Spat.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Spat.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Spat.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Spat.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _shapeNames={cube:'Cubo',box:'Paralelepípedo',cylinder:'Cilindro',cone:'Cone',sphere:'Esfera'};
  var _pub={
    showShape:function(s){
      var panel=document.getElementById('canvas-panel'),lbl=document.getElementById('canvas-label');
      if(!panel)return;_mc(panel,420,380);Renderer.clear();
      var tabs=document.querySelectorAll('.phase-step');
      var idx=['cube','box','cylinder','cone','sphere'].indexOf(s);
      tabs.forEach(function(t,i){t.classList.toggle('active',i===idx);});
      if(lbl)lbl.textContent=_shapeNames[s]||s;
      if(s==='cube')_drawCube(210,190,4);
      else if(s==='box')_drawBox(210,190,5,3,2);
      else if(s==='cylinder')_drawCylinder(210,190,3,5);
      else if(s==='cone')_drawCone(210,190,3,5);
      else if(s==='sphere')_drawSphere(210,190,4);
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/spatial/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_pr.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_pr.exercise.answer);if(hi>0)_pub.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Spat=_pub;
})();
