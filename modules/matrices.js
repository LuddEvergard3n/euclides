/**
 * modules/matrices.js
 * Single responsibility: teach matrices and determinants (2×2 and 3×3).
 * Canvas: grid visualization of matrix elements with highlight.
 */
(function () {

  var TOPIC_ID = 'matrices';

  function _makeCanvas(panel, w, h) {
    var c = document.createElement('canvas');
    c.id='main-canvas'; c.width=w||420; c.height=h||380;
    panel.innerHTML=''; panel.appendChild(c); Renderer.init(c); return c;
  }

  var _practice = {exercise:null,difficulty:1,history:[],hintsEnabled:false,hintIndex:0,solved:false};

  // ── Canvas: draw a matrix as a grid ───────────────────────────────

  function _drawMatrix(ctx, m, x0, y0, cellW, cellH, highlightRC, color) {
    var rows = m.length, cols = m[0].length;
    color = color || '#c8a44a';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cx = x0 + c*cellW + cellW/2, cy = y0 + r*cellH + cellH/2;
        var active = highlightRC && highlightRC[0]===r && highlightRC[1]===c;
        if (active) {
          ctx.fillStyle = 'rgba(200,164,74,0.18)';
          ctx.fillRect(x0+c*cellW+1, y0+r*cellH+1, cellW-2, cellH-2);
        }
        ctx.fillStyle  = active ? color : '#72728c';
        ctx.font       = (active?'bold ':'')+'14px JetBrains Mono, monospace';
        ctx.textAlign  = 'center';
        ctx.fillText(m[r][c], cx, cy+5);
      }
    }
    // Border brackets
    var w = cols*cellW, h = rows*cellH, arm = 8;
    ctx.strokeStyle = '#3e3e58'; ctx.lineWidth = 2;
    // Left bracket
    ctx.beginPath(); ctx.moveTo(x0-2+arm,y0); ctx.lineTo(x0-2,y0); ctx.lineTo(x0-2,y0+h); ctx.lineTo(x0-2+arm,y0+h); ctx.stroke();
    // Right bracket
    ctx.beginPath(); ctx.moveTo(x0+w+2-arm,y0); ctx.lineTo(x0+w+2,y0); ctx.lineTo(x0+w+2,y0+h); ctx.lineTo(x0+w+2-arm,y0+h); ctx.stroke();
  }

  function _drawMatrixScene(ex) {
    var ctx=Renderer.ctx(), W=Renderer.width(), H=Renderer.height();
    Renderer.clear();
    if (!ex||!ex.matA) return;

    var size=ex.matA.length, cellW=48, cellH=40;
    var matW=size*cellW, matH=size*cellH;

    if (ex.matType==='add'||ex.matType==='multiply') {
      // Show A + op + B = R
      var totalW = matW*3 + 80;
      var startX = (W - totalW)/2;
      var y0 = (H - matH)/2 - 10;
      _drawMatrix(ctx, ex.matA, startX,            y0, cellW, cellH, null, '#5a8fd2');
      ctx.fillStyle='#72728c'; ctx.font='20px JetBrains Mono,monospace'; ctx.textAlign='center';
      ctx.fillText(ex.matType==='add'?'+':'×', startX+matW+18, y0+matH/2+7);
      _drawMatrix(ctx, ex.matB, startX+matW+36,    y0, cellW, cellH, null, '#4ab8b2');
      ctx.fillText('=', startX+matW*2+54, y0+matH/2+7);
      if (ex.matR) _drawMatrix(ctx, ex.matR, startX+matW*2+72, y0, cellW, cellH, null, '#c8a44a');
    } else {
      // Just show A centred
      var x0=(W-matW)/2, y0=(H-matH)/2-10;
      _drawMatrix(ctx, ex.matA, x0, y0, cellW, cellH, null, '#c8a44a');

      if (ex.matType==='det2') {
        // Draw crossing arrows for det
        var ax=x0, ay=y0;
        ctx.strokeStyle='rgba(200,164,74,0.4)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(ax+cellW*0.5,ay+cellH*0.25); ctx.lineTo(ax+cellW*1.5,ay+cellH*1.75); ctx.stroke();
        ctx.strokeStyle='rgba(196,82,82,0.4)'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(ax+cellW*1.5,ay+cellH*0.25); ctx.lineTo(ax+cellW*0.5,ay+cellH*1.75); ctx.stroke();
        ctx.fillStyle='#72728c'; ctx.font='11px JetBrains Mono,monospace'; ctx.textAlign='center';
        ctx.fillText('det = ad − bc', W/2, ay+matH+28);
      }

      if (ex.matType==='det3') {
        // Sarrus diagonal hints
        ctx.fillStyle='#72728c'; ctx.font='11px JetBrains Mono,monospace'; ctx.textAlign='center';
        ctx.fillText('Regra de Sarrus', W/2, y0+matH+28);
      }
    }
  }

  // ── CONCEPT ───────────────────────────────────────────────────────

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Matrizes'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'concept') +
          '<h1 class="topic-title">Matrizes e Determinantes</h1>' +
          '<p class="topic-meta">operações · determinante 2×2 e 3×3 · Sarrus</p>' +
          '<div class="content-block">' +
            '<p>Uma matriz é uma tabela retangular de números organizada em linhas e colunas. Matrizes m×n têm m linhas e n colunas; o elemento da linha i, coluna j é aᵢⱼ.</p>' +
            '<div class="concept-highlight"><div class="hl-label">Operações elementares</div>' +
              'Soma: (A+B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ  (mesma dimensão)<br>' +
              'Produto: Cᵢⱼ = Σ Aᵢₖ × Bₖⱼ  (colunas de A = linhas de B)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Determinante 2×2</div>' +
              '|A| = a₁₁·a₂₂ − a₁₂·a₂₁  (diagonal principal − diagonal secundária)' +
            '</div>' +
            '<div class="concept-highlight"><div class="hl-label">Determinante 3×3 — Regra de Sarrus</div>' +
              'Some os produtos das 3 diagonais principais (↘).<br>' +
              'Subtraia os produtos das 3 diagonais secundárias (↗).' +
            '</div>' +
            '<p>Se det(A) ≠ 0, a matriz é <strong>inversível</strong> (não-singular).</p>' +
          '</div>' +
          '<div class="btn-row mt-24">' +
            '<button class="btn btn-primary" onclick="Router.navigate(\'topic/matrices/example\')">Ver exemplo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">det 2×2</p>' +
        '</div>' +
      '</div>';
    var panel = view.querySelector('#canvas-panel');
    _makeCanvas(panel, 420, 380);
    _drawMatrixScene({ matType:'det2', matA:[[3,2],[1,4]] });
  }

  // ── EXAMPLE ───────────────────────────────────────────────────────

  var _exSteps = [
    { equation: 'A = [[2,3][1,4]]',              note: 'matriz 2×2 dada'               },
    { equation: 'det(A) = a₁₁·a₂₂ − a₁₂·a₂₁',  note: 'fórmula do determinante 2×2'   },
    { equation: 'det(A) = 2·4 − 3·1',            note: 'substituição'                  },
    { equation: 'det(A) = 8 − 3 = 5',            note: 'resultado'                     },
    { equation: 'det ≠ 0 → A é inversível',       note: 'interpretação'                 },
  ];
  var _exStep = 0;

  function renderExample(view) {
    _exStep = 0;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Matrizes',href:'topic/matrices/concept'},{label:'Exemplo'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'example') +
          '<h1 class="topic-title">Exemplo resolvido</h1>' +
          '<p class="topic-meta">det [[2,3][1,4]]  ·  passo a passo</p>' +
          '<div class="example-step-bar">' +
            '<span class="step-counter" id="step-counter">Passo 1 de '+_exSteps.length+'</span>' +
            '<div class="step-progress"><div class="step-progress-fill" id="step-fill" style="width:0%"></div></div>' +
          '</div>' +
          '<div class="step-description" id="step-desc">'+_buildDesc(0)+'</div>' +
          '<div class="btn-row">' +
            '<button class="btn" id="btn-prev" onclick="Mat.prevStep()" disabled>← Anterior</button>' +
            '<button class="btn btn-primary" id="btn-next" onclick="Mat.nextStep()">Próximo →</button>' +
          '</div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">[[2,3][1,4]]</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 340);
    _drawMatrixScene({matType:'det2',matA:[[2,3],[1,4]]});
    Renderer.drawEquationSteps(_exSteps, 0);
  }

  function _buildDesc(i) {
    var s=_exSteps[i],p=i>0?_exSteps[i-1]:null;
    if(!p) return 'Dada: <span class="text-mono text-gold">'+s.equation+'</span>';
    return '<strong>'+s.note+'</strong><br><span class="text-mono text-gold">'+s.equation+'</span>';
  }

  function _updateExUI() {
    var i=_exStep,n=_exSteps.length;
    document.getElementById('step-counter').textContent='Passo '+(i+1)+' de '+n;
    document.getElementById('step-fill').style.width=Math.round(i/(n-1)*100)+'%';
    document.getElementById('step-desc').innerHTML=_buildDesc(i);
    var prev=document.getElementById('btn-prev'),next=document.getElementById('btn-next');
    if(prev) prev.disabled=i===0;
    if(next){
      if(i===n-1){next.textContent='Praticar →';next.onclick=function(){Progress.markExample(TOPIC_ID);Router.navigate('topic/matrices/practice');};}
      else{next.textContent='Próximo →';next.onclick=function(){Mat.nextStep();};}
    }
    Renderer.drawEquationSteps(_exSteps, i);
  }

  // ── PRACTICE ──────────────────────────────────────────────────────

  function renderPractice(view) {
    _practice.exercise=null;_practice.hintsEnabled=false;_practice.hintIndex=0;_practice.solved=false;
    view.innerHTML =
      '<div class="topic-screen">' +
        '<div class="topic-content">' +
          UI.renderBreadcrumb([{label:'Início',href:''},{label:'Matrizes',href:'topic/matrices/concept'},{label:'Prática'}]) +
          UI.renderPhaseBar(TOPIC_ID, 'practice') +
          '<div class="practice-header">' +
            '<span class="exercise-counter" id="ex-counter">Exercício 1</span>' +
            '<label class="hint-toggle" onclick="Mat.toggleHints()">Dicas' +
              '<div class="toggle-switch" id="hint-toggle-sw"><div class="toggle-knob"></div></div>' +
            '</label>' +
          '</div>' +
          '<div id="exercise-area"><p class="text-dim text-mono" style="font-size:12px;padding:24px 0">Carregando...</p></div>' +
        '</div>' +
        '<div class="topic-canvas-panel" id="canvas-panel">' +
          '<p class="text-dim text-mono" style="font-size:11px">matriz</p>' +
        '</div>' +
      '</div>';
    _makeCanvas(view.querySelector('#canvas-panel'), 420, 380);
    _loadNext();
  }

  function _loadNext() {
    _practice.exercise=MathCore.generateExercise(TOPIC_ID,_practice.difficulty);
    _practice.hintIndex=0;_practice.solved=false;
    _renderCard(); _drawMatrixScene(_practice.exercise);
  }

  function _renderCard() {
    var area=document.getElementById('exercise-area');if(!area)return;
    var ex=_practice.exercise;
    document.getElementById('ex-counter').textContent='Exercício '+(_practice.history.length+1);
    // Hint for matrix answer format
    var fmt = (ex.matType==='add'||ex.matType==='multiply')
      ? '<p class="text-dim" style="font-size:12px;margin-bottom:12px">Formato: [[a,b][c,d]]</p>' : '';
    area.innerHTML =
      '<div class="exercise-card">' +
        '<p class="exercise-statement">'+ex.statement+'</p>' +
        '<div class="exercise-equation" style="font-size:13px">'+ex.equation+'</div>' +
        fmt +
        '<div class="answer-row"><span class="answer-label">= </span>' +
          '<input class="answer-input" id="answer-input" type="text" placeholder="resposta" autocomplete="off" style="max-width:260px"/></div>' +
        '<p class="feedback-line" id="feedback"></p>' +
        '<div id="hint-area"></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="Mat.checkAnswer()">Verificar</button>' +
          '<button class="btn" id="btn-hint" onclick="Mat.showNextHint()" style="display:none">Ver dica</button>' +
          '<button class="btn" id="btn-next-ex" onclick="Mat.nextExercise()" style="display:none">Próximo →</button>' +
        '</div>' +
      '</div>';
    var inp=document.getElementById('answer-input');
    if(inp){inp.addEventListener('keydown',function(e){if(e.key==='Enter')Mat.checkAnswer();});inp.focus();}
    _updateHintBtn();
  }

  function _updateHintBtn(){var b=document.getElementById('btn-hint');if(b)b.style.display=_practice.hintsEnabled&&!_practice.solved?'':'none';}

  var _public = {
    nextStep:function(){if(_exStep<_exSteps.length-1){_exStep++;_updateExUI();}else{Progress.markExample(TOPIC_ID);Router.navigate('topic/matrices/practice');}},
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
        _drawMatrixScene(_practice.exercise);
      } else {
        fb.className='feedback-line wrong';fb.textContent='✗ Não é isso. Tente novamente.';
        _practice.history.push(false);Progress.recordAttempt(TOPIC_ID,false);
        if(_practice.hintsEnabled&&_practice.hintIndex===0){var hi=MathCore.analyzeError(TOPIC_ID,student,_practice.exercise.answer);if(hi>0)_public.showNextHint();}
      }
      UI.renderSidebar(TOPIC_ID);
    },
    nextExercise:function(){_practice.hintIndex=0;var ha=document.getElementById('hint-area');if(ha)ha.innerHTML='';_loadNext();},
  };

  Router.register(TOPIC_ID,{renderConcept:renderConcept,renderExample:renderExample,renderPractice:renderPractice});
  window.Mat = _public;

})();
