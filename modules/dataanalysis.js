/**
 * modules/dataanalysis.js
 * Análise de Dados — média ponderada, variância, desvio padrão, moda, percentil.
 * Canvas: histograma, gráfico de linha, box plot simples.
 */
(function () {
  var TOPIC_ID = 'dataanalysis';
  function _mc(p,w,h){var c=document.createElement('canvas');c.id='main-canvas';c.width=w||420;c.height=h||380;p.innerHTML='';p.appendChild(c);Renderer.init(c);return c;}
  var _pr={exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};
  var _exStep=0;

  // ── Canvas: histogram ────────────────────────────────────────────
  function _drawHistogram(vals, highlight, title) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var n=vals.length,padL=36,padB=36,padT=28,padR=12;
    var chartW=W-padL-padR,chartH=H-padB-padT;
    var maxV=Math.max.apply(null,vals)||1;
    var barW=Math.floor(chartW/n*0.7),gap=Math.floor(chartW/n);

    ctx.fillStyle='#3e3e58';ctx.font='11px JetBrains Mono,monospace';ctx.textAlign='center';
    ctx.fillText(title||'',W/2,18);

    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padL,padT);ctx.lineTo(padL,padT+chartH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(padL,padT+chartH);ctx.lineTo(padL+chartW,padT+chartH);ctx.stroke();

    vals.forEach(function(v,i){
      var bh=chartH*(v/maxV);
      var bx=padL+i*gap+(gap-barW)/2;
      var by=padT+chartH-bh;
      var isHL=(highlight!==undefined&&vals[i]===highlight);
      ctx.fillStyle=isHL?'rgba(200,164,74,0.8)':'rgba(90,143,210,0.5)';
      ctx.fillRect(bx,by,barW,bh);
      ctx.strokeStyle=isHL?'#c8a44a':'#5a8fd2';ctx.lineWidth=1;
      ctx.strokeRect(bx,by,barW,bh);
      ctx.fillStyle=isHL?'#c8a44a':'#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
      ctx.fillText(v,bx+barW/2,by-4);
      ctx.fillText(i+1,bx+barW/2,padT+chartH+14);
    });
  }

  // Box plot
  function _drawBoxPlot(vals) {
    var ctx=Renderer.ctx(),W=Renderer.width(),H=Renderer.height();
    Renderer.clear();
    var sorted=vals.slice().sort(function(a,b){return a-b;});
    var n=sorted.length;
    var min=sorted[0],max=sorted[n-1];
    var q1=sorted[Math.floor(n*0.25)],med=sorted[Math.floor(n*0.5)],q3=sorted[Math.floor(n*0.75)];
    var range=max-min||1;
    var cy=H/2,padH=80;
    function toX(v){return padH+(W-2*padH)*(v-min)/range;}

    ctx.strokeStyle='#2e2e4a';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padH,cy);ctx.lineTo(W-padH,cy);ctx.stroke();

    // Whiskers
    [[min,q1],[q3,max]].forEach(function(seg){
      ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(toX(seg[0]),cy);ctx.lineTo(toX(seg[1]),cy);ctx.stroke();
      [seg[0],seg[1]].forEach(function(v){
        ctx.beginPath();ctx.moveTo(toX(v),cy-10);ctx.lineTo(toX(v),cy+10);ctx.stroke();
      });
    });
    // Box
    ctx.fillStyle='rgba(90,143,210,0.2)';
    ctx.fillRect(toX(q1),cy-20,toX(q3)-toX(q1),40);
    ctx.strokeStyle='#5a8fd2';ctx.lineWidth=2;
    ctx.strokeRect(toX(q1),cy-20,toX(q3)-toX(q1),40);
    // Median
    ctx.strokeStyle='#c8a44a';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(toX(med),cy-20);ctx.lineTo(toX(med),cy+20);ctx.stroke();

    ctx.fillStyle='#72728c';ctx.font='10px JetBrains Mono,monospace';ctx.textAlign='center';
    [[min,'min'],[q1,'Q1'],[med,'Med'],[q3,'Q3'],[max,'max']].forEach(function(p){
      ctx.fillText(p[0],toX(p[0]),cy+34);
      ctx.fillStyle='#3e3e58';ctx.fillText(p[1],toX(p[0]),cy-28);
    });
    ctx.fillStyle='#3e3e58';ctx.fillText('Box plot',W/2,20);
  }

  // ── Concept ──────────────────────────────────────────────────────
  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Análise de Dados'}])+
          UI.renderPhaseBar(TOPIC_ID,'concept')+
          '<h1 class="topic-title">Análise de Dados e Gráficos</h1>'+
          '<p class="topic-meta">média ponderada · variância · desvio padrão · moda · percentil</p>'+
          '<div class="content-block">'+
            '<p>Estatística descritiva resume e organiza conjuntos de dados em medidas simples que revelam padrões.</p>'+
            '<div class="concept-highlight"><div class="hl-label">Medidas de tendência central</div>'+
              'Média: x̄ = Σxᵢ / n  |  Média ponderada: x̄ = Σ(xᵢ×pᵢ) / Σpᵢ<br>'+
              'Mediana: valor central (dados ordenados)  |  Moda: valor mais frequente'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Medidas de dispersão</div>'+
              'Variância: σ² = Σ(xᵢ − x̄)² / n<br>'+
              'Desvio padrão: σ = √σ²  — mesma unidade dos dados.<br>'+
              'σ pequeno: dados concentrados  |  σ grande: dados espalhados.'+
            '</div>'+
            '<div class="concept-highlight"><div class="hl-label">Percentis e quartis</div>'+
              'Pₖ: posição = ceil(k/100 × n)<br>'+
              'Q1=P25, Q2=P50 (mediana), Q3=P75.<br>'+
              'IQR = Q3 − Q1 — intervalo interquartil.'+
            '</div>'+
          '</div>'+
          '<div class="phase-bar" style="margin-top:20px">'+
            '<div class="phase-step active" onclick="Data.showHist()">Histograma</div>'+
            '<div class="phase-step" onclick="Data.showBox()">Box plot</div>'+
          '</div>'+
          '<div class="btn-row mt-24"><button class="btn btn-primary" onclick="Router.navigate(\'topic/dataanalysis/example\')">Ver exemplo →</button></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">histograma</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);
    _drawHistogram([3,7,5,9,4,8,6],'','Dados de exemplo');
  }

  var _exSteps=[
    {equation:'Dados: 4, 7, 3, 9, 5, 8, 6',                note:'conjunto dado'},
    {equation:'Ordene: 3, 4, 5, 6, 7, 8, 9',               note:'passo 1 — ordenar'},
    {equation:'Média: (4+7+3+9+5+8+6) / 7 = 42/7 = 6',    note:'média aritmética'},
    {equation:'Desvios: (4-6)²=4, (7-6)²=1, ...',          note:'calcular (xi − x̄)²'},
    {equation:'σ² = (4+1+9+9+1+4+0)/7 = 28/7 = 4',        note:'variância'},
    {equation:'σ = √4 = 2',                                 note:'desvio padrão'},
    {equation:'Mediana = 6, Moda: sem moda (todos únicos)', note:'outras medidas'},
  ];
  function renderExample(view){
    _exStep=0;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Dados',href:'topic/dataanalysis/concept'},{label:'Exemplo'}])+
          UI.renderPhaseBar(TOPIC_ID,'example')+
          '<h1 class="topic-title">Exemplo resolvido</h1>'+
          '<p class="topic-meta">conjunto: 4, 7, 3, 9, 5, 8, 6  ·  média, σ², σ</p>'+
          '<div class="example-step-bar">'+
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>'+
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>'+
          '</div>'+
          '<div class="step-description" id="step-desc">'+_desc(0)+'</div>'+
          '<div class="btn-row">'+
            '<button class="btn" id="btn-prev" onclick="Data.prevStep()" disabled>← Anterior</button>'+
            '<button class="btn btn-primary" id="btn-next" onclick="Data.nextStep()">Próximo →</button>'+
          '</div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px">histograma</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,340);
    _drawHistogram([3,4,5,6,7,8,9]);
    Renderer.drawEquationSteps(_exSteps,0);
  }
  function _desc(i){var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    return p?'<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>':
             'Dados: <span class="text-mono text-gold">'+s.equation+'</span>';}
  function _updateEx(){
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_desc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev)prev.disabled=i===0;
    if(next){if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/dataanalysis/practice');};}
    else{next.textContent='Próximo →';next.onclick=function(){Data.nextStep();};}}
    if(i>=6)_drawBoxPlot([3,4,5,6,7,8,9]);
    else _drawHistogram([3,4,5,6,7,8,9],i>=2?6:undefined);
    Renderer.drawEquationSteps(_exSteps,i);
  }

  function renderPractice(view){
    _pr.exercise=null;_pr.hintsEnabled=false;_pr.hintIndex=0;_pr.solved=false;
    view.innerHTML=
      '<div class="topic-screen">'+
        '<div class="topic-content">'+
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Dados',href:'topic/dataanalysis/concept'},{label:'Prática'}])+
          UI.renderPhaseBar(TOPIC_ID,'practice')+
          '<div class="practice-header">'+
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>'+
            '<label class="hint-toggle" onclick="Data.toggleHints()">Dicas<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div></label>'+
          '</div>'+
          '<div id="exercise-area"></div>'+
        '</div>'+
        '<div class="topic-canvas-panel" id="canvas-panel"><p class="text-dim text-mono" style="font-size:11px" id="canvas-label">dados</p></div>'+
      '</div>';
    _mc(view.querySelector('#canvas-panel'),420,380);_loadNext();
  }
  function _loadNext(){
    _pr.exercise=MathCore.generateExercise(TOPIC_ID,_pr.difficulty);
    _pr.hintIndex=0;_pr.solved=false;_renderCard();
    var ex=_pr.exercise;
    if(ex.vals)_drawHistogram(ex.vals,undefined,ex.dataType);
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
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>'+
        '<p class="feedback-line" id="feedback"></p><div id="hint-area"></div>'+
        '<div class="btn-row">'+
          '<button class="btn btn-primary" onclick="Data.checkAnswer()">Verificar</button>'+
          '<button class="btn" id="btn-hint" onclick="Data.showNextHint()" style="display:none">Ver dica</button>'+
          '<button class="btn" id="btn-next-ex" onclick="Data.nextExercise()" style="display:none">Próximo →</button>'+
        '</div></div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Data.checkAnswer();});inp.focus();}
    _uhb();
  }
  function _uhb(){var b=document.getElementById('btn-hint');if(b)b.style.display=_pr.hintsEnabled&&!_pr.solved?'':'none';}

  var _pub={
    showHist:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===0);});if(l)l.textContent='histograma';_drawHistogram([3,7,5,9,4,8,6]);},
    showBox:function(){var p=document.getElementById('canvas-panel'),l=document.getElementById('canvas-label');if(!p)return;_mc(p,420,380);document.querySelectorAll('.phase-step').forEach(function(t,i){t.classList.toggle('active',i===1);});if(l)l.textContent='box plot';_drawBoxPlot([3,4,5,6,7,8,9,12,15]);},
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateEx();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/dataanalysis/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateEx();}},
    toggleHints:function(){_pr.hintsEnabled=!_pr.hintsEnabled;var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_pr.hintsEnabled);_uhb();if(!_pr.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_pr.hintIndex=0;}},
    showNextHint:function(){var ex=_pr.exercise;if(!ex||!ex.hints||_pr.hintIndex>=ex.hints.length)return;var ha=document.getElementById('hint-area');if(ha&&ex.hints[_pr.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_pr.hintIndex+1)+'</div>'+ex.hints[_pr.hintIndex]+'</div>';_pr.hintIndex++;var b=document.getElementById('btn-hint');if(b&&_pr.hintIndex>=ex.hints.length)b.style.display='none';},
    checkAnswer:function(){
      if(_pr.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_pr.exercise)return;
      var student=inp.value.trim(),correct=String(_pr.exercise.answer);
      var ok=student===correct||Math.abs(parseFloat(student.replace(',','.'))-parseFloat(correct.replace(',','.')))<=0.01;
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_pr.exercise.answer;
        _pr.solved=true;_pr.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _pr.difficulty=MathCore.nextDifficulty(_pr.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_uhb();
      }else{fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _pr.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_pr.hintsEnabled&&_pr.hintIndex===0)_pub.showNextHint();
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_pr.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };
  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Data=_pub;
})();
