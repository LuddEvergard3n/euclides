/**
 * modules/probability.js
 * Single responsibility: teach probability and descriptive statistics.
 * Canvas: bar chart, Venn diagram, histogram.
 */
(function () {

  var TOPIC_ID = 'probability';

  function _makeCanvas(panel, w, h) {
    var c = document.createElement('canvas');
    c.id = 'main-canvas'; c.width = w||420; c.height = h||380;
    panel.innerHTML = ''; panel.appendChild(c); Renderer.init(c); return c;
  }

  var _practice = {exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};

  // ── Canvas helpers ────────────────────────────────────────────────

  // Bar chart for frequency / probability
  function _drawBarChart(labels, values, title) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var n     = labels.length;
    var maxV  = Math.max.apply(null, values) || 1;
    var padL  = 40, padB = 36, padT = 32, padR = 16;
    var chartW = W - padL - padR, chartH = H - padB - padT;
    var barW  = Math.floor(chartW / n * 0.6);
    var gap   = Math.floor(chartW / n);

    // Title
    ctx.fillStyle = '#72728c'; ctx.font = '12px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText(title || '', W/2, 20);

    // Y axis
    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT+chartH); ctx.stroke();
    // X axis
    ctx.beginPath(); ctx.moveTo(padL, padT+chartH); ctx.lineTo(padL+chartW, padT+chartH); ctx.stroke();

    // Y ticks
    for (var i = 0; i <= 4; i++) {
      var yv = maxV * i / 4;
      var py = padT + chartH - chartH * (yv / maxV);
      ctx.strokeStyle = '#1a1a28'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(padL+chartW, py); ctx.stroke();
      ctx.fillStyle = '#3e3e58'; ctx.font = '10px JetBrains Mono,monospace'; ctx.textAlign = 'right';
      ctx.fillText(yv.toFixed(yv < 1 ? 2 : 0), padL-4, py+4);
    }

    // Bars
    values.forEach(function(v, i) {
      var bx = padL + i*gap + (gap-barW)/2;
      var bh = chartH * (v / maxV);
      var by = padT + chartH - bh;
      ctx.fillStyle = 'rgba(200,164,74,0.7)';
      ctx.fillRect(bx, by, barW, bh);
      ctx.strokeStyle = '#c8a44a'; ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barW, bh);
      // Value label on top
      ctx.fillStyle = '#c8a44a'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText(v, bx+barW/2, by-4);
      // X label
      ctx.fillStyle = '#72728c';
      ctx.fillText(labels[i], bx+barW/2, padT+chartH+16);
    });
  }

  // Venn diagram (two sets A and B with intersection)
  function _drawVenn(nA, nB, nAB, nTotal) {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    var cx = W/2, cy = H/2 - 10, r = Math.min(W,H)*0.28, offset = r*0.55;

    // Universe box
    ctx.strokeStyle = '#2e2e4a'; ctx.lineWidth = 1; ctx.strokeRect(20, 20, W-40, H-50);
    ctx.fillStyle = '#3e3e58'; ctx.font = '11px JetBrains Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText('U ('+nTotal+')', 28, 36);

    // Circle A
    ctx.beginPath(); ctx.arc(cx-offset, cy, r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(90,143,210,0.18)'; ctx.fill();
    ctx.strokeStyle = '#5a8fd2'; ctx.lineWidth = 2; ctx.stroke();

    // Circle B
    ctx.beginPath(); ctx.arc(cx+offset, cy, r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(74,184,178,0.18)'; ctx.fill();
    ctx.strokeStyle = '#4ab8b2'; ctx.lineWidth = 2; ctx.stroke();

    // Labels
    ctx.fillStyle = '#5a8fd2'; ctx.font = 'bold 13px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('A', cx-offset-r*0.5, cy-r*0.6);
    ctx.fillStyle = '#4ab8b2';
    ctx.fillText('B', cx+offset+r*0.5, cy-r*0.6);

    // Counts
    ctx.fillStyle = '#e8e8f2'; ctx.font = '14px JetBrains Mono,monospace';
    ctx.fillText(nA-nAB, cx-offset-r*0.35, cy+6);   // A only
    ctx.fillText(nAB,    cx,                cy+6);   // A∩B
    ctx.fillText(nB-nAB, cx+offset+r*0.35, cy+6);   // B only

    ctx.fillStyle = '#72728c'; ctx.font = '11px JetBrains Mono,monospace';
    ctx.fillText('A∩B = '+nAB, cx, cy+r+20);
  }

  // Histogram for mean/median data
  function _drawDataLine(vals) {
    var sorted = vals.slice().sort(function(a,b){return a-b;});
    var min = sorted[0], max = sorted[sorted.length-1];
    _drawBarChart(
      sorted.map(function(v){return String(v);}),
      sorted.map(function(){return 1;}),
      'Valores ordenados'
    );
  }

  // Choose canvas based on exercise type
  function _drawExCanvas(ex) {
    if (!ex) return;
    if (ex.probType === 'classic') {
      _drawBarChart(
        ['Favoráveis', 'Outros'],
        [ex.fav, ex.total - ex.fav],
        'Espaço amostral ('+ex.total+')'
      );
    } else if (ex.probType === 'mean' || ex.probType === 'median') {
      _drawDataLine(ex.vals || []);
    } else if (ex.probType === 'combination') {
      _drawBarChart(
        ['C('+ex.n+','+ex.k+')'],
        [ex ? MathCore.generateExercise(TOPIC_ID, 1).total || 1 : 1],
        'C('+ex.n+','+ex.k+')'
      );
      // Just show formula nicely
      var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
      Renderer.clear();
      ctx.fillStyle = '#72728c'; ctx.font = '13px JetBrains Mono,monospace'; ctx.textAlign = 'center';
      ctx.fillText('C(n, k) =     n!', W/2, H/2 - 20);
      ctx.fillText('          ─────────', W/2, H/2);
      ctx.fillText('          k! × (n-k)!', W/2, H/2 + 20);
      ctx.fillStyle = '#c8a44a';
      ctx.fillText('C('+ex.n+', '+ex.k+')', W/2, H/2 + 60);
    } else {
      Renderer.clear();
    }
  }

  // ── CONCEPT ───────────────────────────────────────────────────────

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Probabilidade'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Probabilidade e Estatística</h1>' +
          '<p class="topic-meta">espaço amostral · combinações · média · mediana</p>' +
          '<div class="content-block">' +
            '<p>Probabilidade mede a chance de um evento ocorrer. Estatística descreve e resume conjuntos de dados.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Probabilidade clássica</div>' +
              'P(A) = nº de casos favoráveis / nº total de casos<br>' +
              '0 ≤ P(A) ≤ 1  |  P(A) + P(Aᶜ) = 1' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Probabilidade condicional</div>' +
              'P(B|A) = P(A∩B) / P(A)  — probabilidade de B dado que A ocorreu' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Combinações</div>' +
              'C(n,k) = n! / (k! × (n−k)!)  — grupos de k entre n elementos (ordem não importa)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Medidas de tendência central</div>' +
              'Média: x̄ = Σxᵢ / n<br>' +
              'Mediana: valor central dos dados ordenados<br>' +
              'Moda: valor que aparece com maior frequência' +
            '</div>' +
          '</div>' +
          '<div class="phase-bar" style="margin-top:20px">' +
            '<div class="phase-step active" onclick="Prob.showCanvas(\'venn\')">Venn</div>' +
            '<div class="phase-step" onclick="Prob.showCanvas(\'bar\')">Frequência</div>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/probability/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">diagrama de Venn</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380);
    _drawVenn(8, 6, 3, 20);
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────

  var _exSteps = [
    { equation: 'Urna: 5 vermelhas, 3 azuis, 2 verdes (10 total)', note: 'problema'                        },
    { equation: 'P(vermelha) = 5 / 10',                            note: 'casos favoráveis / total'        },
    { equation: 'P(vermelha) = 1/2 = 0,5',                         note: 'simplificar'                    },
    { equation: 'P(não vermelha) = 1 − P(vermelha)',               note: 'evento complementar'             },
    { equation: 'P(não vermelha) = 1 − 1/2 = 1/2',                note: 'resultado'                       },
    { equation: 'Média das bolas por cor: (5+3+2)/3 = 10/3 ≈ 3,3', note: 'estatística descritiva'         },
  ];
  var _exStep = 0;

  function renderExample(view) {
    _exStep = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Probabilidade',href:'topic/probability/concept'},{label:'Exemplo'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">urna com 10 bolas  ·  probabilidade e complementar</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">'+_buildDesc(0)+'</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Prob.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Prob.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">urna: 5V 3A 2Ve</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 340);
    _drawBarChart(['Verm.','Azul','Verde'],[5,3,2],'Distribuição das bolas');
    Renderer.drawEquationSteps(_exSteps, 0);
  }

  function _buildDesc(i) {
    var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    if(!p) return 'Situação: <span class="text-mono text-gold">'+s.equation+'</span>';
    return '<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>';
  }

  function _updateExUI() {
    var i=_exStep,n=_exSteps.length;
    var _sc=document.getElementById('step-counter');if(_sc)_sc.textContent='Passo '+(i+1)+' de '+n;
    var _sf=document.getElementById('step-fill');if(_sf)_sf.style.width=Math.round(i/(n-1)*100)+'%';
    var _sd=document.getElementById('step-desc');if(_sd)_sd.innerHTML=_buildDesc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev) prev.disabled=i===0;
    if(next){
      if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/probability/practice');};}
      else{next.textContent='Próximo →';next.onclick=function(){Prob.nextStep();};}
    }
    Renderer.drawEquationSteps(_exSteps, i);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────

  function renderPractice(view) {
    _practice.exercise=null;_practice.hintsEnabled=false;_practice.hintIndex=0;_practice.solved=false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Probabilidade',href:'topic/probability/concept'},{label:'Prática'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Prob.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px" id="canvas-label">visualização</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 380);
    _loadNext();
  }

  function _loadNext() {
    _practice.exercise=MathCore.generateExercise(TOPIC_ID,_practice.difficulty);
    _practice.hintIndex=0;_practice.solved=false;
    _renderCard(); _drawExCanvas(_practice.exercise);
  }

  function _renderCard() {
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_practice.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_practice.history.length+1);
    var fmtHint = (ex.probType==='classic'||ex.probType==='conditional')
      ? '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Use a forma a/b (ex: 3/5)</p>' : '';
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">'+ex.statement+'</p>' +
        '<div class="exercise-equation">'+ex.equation+'</div>' +
        fmtHint +
        '<div class="answer-row"><span class="answer-label">= </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off"/></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Prob.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Prob.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Prob.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Prob.checkAnswer();});inp.focus();}
    _updateHintBtn();
  }

  function _updateHintBtn(){var b=document.getElementById('btn-hint');if(b)b.style.display=_practice.hintsEnabled&&!_practice.solved?'':'none';}

  var _public = {
    showCanvas: function(type) {
      var panel=document.getElementById('canvas-panel'),lbl=document.getElementById('canvas-label');
      if(!panel)return;
      _makeCanvas(panel,420,380);
      var tabs=document.querySelectorAll('.phase-step');
      tabs.forEach(function(t,i){t.classList.toggle('active',i===(type==='venn'?0:1));});
      if(type==='venn'){if(lbl)lbl.textContent='diagrama de Venn';_drawVenn(8,6,3,20);}
      else{if(lbl)lbl.textContent='frequência';_drawBarChart(['A','B','C','D'],[4,7,3,6],'Frequência');}
    },
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateExUI();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/probability/practice');}},
    prevStep:function(){if(_exStep>0){_exStep--;_updateExUI();}},
    toggleHints:function(){
      _practice.hintsEnabled=!_practice.hintsEnabled;
      var sw=document.getElementById('hint-toggle-sw');if(sw)sw.classList.toggle('on',_practice.hintsEnabled);
      _updateHintBtn();
      if(!_practice.hintsEnabled){var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_practice.hintIndex=0;}
    },
    showNextHint:function(){
      var ex=_practice.exercise;if(!ex||!ex.hints||_practice.hintIndex>=ex.hints.length)return;
      var ha=document.getElementById('hint-area');
      if(ha&&ex.hints[_practice.hintIndex])ha.innerHTML+='<div class="hint-box"><div class="hint-label">Dica '+(_practice.hintIndex+1)+'</div>'+ex.hints[_practice.hintIndex]+'</div>';
      _practice.hintIndex++;
      var b=document.getElementById('btn-hint');if(b&&_practice.hintIndex>=ex.hints.length)b.style.display='none';
    },
    checkAnswer:function(){
      if(_practice.solved)return;
      var inp=document.getElementById('answer-input'),fb=document.getElementById('feedback');
      if(!inp||!fb||!_practice.exercise)return;
      var student=inp.value.trim(),ok=MathCore.validate(TOPIC_ID,student,_practice.exercise.answer);
      inp.classList.toggle('correct',ok);inp.classList.toggle('wrong',!ok);
      if(ok){
        fb.className='feedback-line correct';fb.textContent='✓ Correto! = '+_practice.exercise.answer;
        _practice.solved=true;_practice.history.push(true);Progress.recordAttempt(TOPIC_ID,true);
        _practice.difficulty=MathCore.nextDifficulty(_practice.history);inp.disabled=true;
        var bn=document.getElementById('btn-next-ex');if(bn)bn.style.display='';_updateHintBtn();
      }else{
        fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _practice.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_practice.hintsEnabled&&_practice.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_practice.exercise.answer);if(hi>0)_public.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_practice.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };

  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Prob = _public;

})();
