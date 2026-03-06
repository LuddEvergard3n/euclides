/**
 * exam.js
 * Single responsibility: timed exam session.
 * 20 questions drawn from all available topics, difficulty 3,
 * 15-minute countdown timer, result screen at the end.
 * Route: 'exam'
 */

var Exam = (function () {

  var _topics  = [];
  var _TOTAL   = 20;
  var _MINUTES = 15;

  var _s = {
    queue:     [],   // [{topicId, topicTitle, exercise}]
    index:     0,
    correct:   0,
    answered:  0,
    solved:    false,
    timerSecs: _MINUTES * 60,
    timerInterval: null,
    hintsEnabled: false,
    hintIndex: 0,
  };

  function setTopics(topics) { _topics = topics; }

  // ── Build exam queue ──────────────────────────────────────────────

  function _buildQueue() {
    var available = _topics.filter(function (t) { return t.status === 'available'; });
    // Shuffle
    var pool = available.slice().sort(function () { return Math.random() - 0.5; });
    var queue = [];
    for (var i = 0; i < _TOTAL && i < pool.length; i++) {
      var t = pool[i];
      var ex;
      try { ex = MathCore.generateExercise(t.id, 3); } catch (_) { continue; }
      queue.push({ topicId: t.id, topicTitle: t.title, exercise: ex });
    }
    // If not enough unique topics, repeat from shuffled pool
    var attempts = 0;
    while (queue.length < _TOTAL && attempts < 100) {
      var t2 = pool[Math.floor(Math.random() * pool.length)];
      try {
        var ex2 = MathCore.generateExercise(t2.id, 3);
        queue.push({ topicId: t2.id, topicTitle: t2.title, exercise: ex2 });
      } catch (_) {}
      attempts++;
    }
    return queue;
  }

  // ── Timer ─────────────────────────────────────────────────────────

  function _startTimer() {
    _s.timerInterval = setInterval(function () {
      _s.timerSecs--;
      _updateTimerDisplay();
      if (_s.timerSecs <= 0) {
        clearInterval(_s.timerInterval);
        _showResults();
      }
    }, 1000);
  }

  function _stopTimer() {
    if (_s.timerInterval) {
      clearInterval(_s.timerInterval);
      _s.timerInterval = null;
    }
  }

  function _formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function _updateTimerDisplay() {
    var el = document.getElementById('exam-timer');
    if (!el) return;
    el.textContent = _formatTime(_s.timerSecs);
    el.className = 'exam-timer' + (_s.timerSecs <= 60 ? ' exam-timer-urgent' : '');
  }

  // ── Render question card ──────────────────────────────────────────

  function _renderCard(view) {
    if (_s.index >= _s.queue.length) { _showResults(); return; }

    var item = _s.queue[_s.index];
    var ex   = item.exercise;
    var pct  = Math.round(_s.index / _TOTAL * 100);

    view.innerHTML =
      '<div class="exam-screen">' +
        '<div class="exam-header">' +
          '<div class="exam-progress-wrap">' +
            '<div class="exam-progress-row">' +
              '<span class="exam-label">Prova</span>' +
              '<span class="exam-counter">' + (_s.index + 1) + '\u200a/\u200a' + _TOTAL + '</span>' +
            '</div>' +
            '<div class="exam-prog-track"><div class="exam-prog-fill" style="width:' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="exam-timer-wrap">' +
            '<span class="exam-timer-label">Tempo</span>' +
            '<span class="exam-timer" id="exam-timer">' + _formatTime(_s.timerSecs) + '</span>' +
          '</div>' +
        '</div>' +

        '<div class="exam-body">' +
          '<div class="exercise-card" style="max-width:560px;margin:0 auto">' +
            '<p class="exam-topic-tag">' + item.topicTitle + '</p>' +
            '<p class="exercise-statement">' + ex.statement + '</p>' +
            '<div class="exercise-equation">' + ex.equation + '</div>' +
            '<div class="answer-row">' +
              '<span class="answer-label">= </span>' +
              '<input class="answer-input" id="exam-input" type="text" placeholder="resposta" autocomplete="off"/>' +
            '</div>' +
            '<p class="feedback-line" id="exam-feedback"></p>' +
            '<div id="exam-hint-area"></div>' +
            '<div class="btn-row" style="margin-top:16px">' +
              '<button class="btn btn-primary" onclick="Exam.check()">Verificar</button>' +
              '<button class="btn" id="exam-hint-btn" onclick="Exam.hint()" style="display:none">Ver dica</button>' +
              '<button class="btn" id="exam-next-btn" onclick="Exam.next()" style="display:none">Próxima \u2192</button>' +
              '<button class="btn" style="margin-left:auto;opacity:.4;font-size:12px" onclick="Exam.abort()">Encerrar</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="exam-footer">' +
          '<label class="hint-toggle" onclick="Exam.toggleHints()">' +
            'Dicas' +
            '<div class="toggle-switch' + (_s.hintsEnabled ? ' on' : '') + '" id="exam-hint-sw"><div class="toggle-knob"></div></div>' +
          '</label>' +
          '<span class="exam-score-live">' + _s.correct + ' corretas</span>' +
        '</div>' +
      '</div>';

    var inp = document.getElementById('exam-input');
    if (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') Exam.check(); });
      inp.focus();
    }
    _updateHintBtn();
  }

  function _updateHintBtn() {
    var b = document.getElementById('exam-hint-btn');
    if (b) b.style.display = (_s.hintsEnabled && !_s.solved) ? '' : 'none';
  }

  // ── Result screen ─────────────────────────────────────────────────

  function _showResults() {
    _stopTimer();
    Progress.unmuteEvents();
    var view = document.getElementById('view');
    if (!view) return;

    var pct    = _s.answered ? Math.round(_s.correct / _TOTAL * 100) : 0;
    var grade  = pct >= 90 ? 'Excelente' : pct >= 70 ? 'Bom' : pct >= 50 ? 'Regular' : 'Precisa melhorar';
    var color  = pct >= 70 ? 'var(--teal)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
    var timeUsed = _MINUTES * 60 - _s.timerSecs;
    var timeTxt  = _s.timerSecs <= 0 ? 'Tempo esgotado' : ('Concluído em ' + _formatTime(timeUsed));

    view.innerHTML =
      '<div class="exam-screen exam-results">' +
        '<div class="result-card">' +
          '<div class="result-score-ring">' +
            '<svg viewBox="0 0 120 120" width="120" height="120">' +
              '<circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-2)" stroke-width="8"/>' +
              '<circle cx="60" cy="60" r="52" fill="none" stroke="' + color + '" stroke-width="8"' +
                ' stroke-dasharray="' + (2 * Math.PI * 52).toFixed(1) + '"' +
                ' stroke-dashoffset="' + ((1 - pct / 100) * 2 * Math.PI * 52).toFixed(1) + '"' +
                ' stroke-linecap="round"' +
                ' transform="rotate(-90 60 60)"/>' +
              '<text x="60" y="56" text-anchor="middle" fill="' + color + '" font-family="JetBrains Mono,monospace" font-size="22" font-weight="600">' + pct + '%</text>' +
              '<text x="60" y="74" text-anchor="middle" fill="var(--text-dim)" font-family="Inter,sans-serif" font-size="11">' + grade + '</text>' +
            '</svg>' +
          '</div>' +

          '<h2 class="result-title">Prova concluída</h2>' +

          '<div class="result-stats">' +
            '<div class="result-stat">' +
              '<span class="result-stat-val" style="color:var(--teal)">' + _s.correct + '</span>' +
              '<span class="result-stat-label">corretas</span>' +
            '</div>' +
            '<div class="result-stat">' +
              '<span class="result-stat-val" style="color:var(--red)">' + (_TOTAL - _s.correct) + '</span>' +
              '<span class="result-stat-label">erradas</span>' +
            '</div>' +
            '<div class="result-stat">' +
              '<span class="result-stat-val">' + _TOTAL + '</span>' +
              '<span class="result-stat-label">total</span>' +
            '</div>' +
          '</div>' +

          '<p class="result-time">' + timeTxt + '</p>' +

          '<div class="btn-row" style="justify-content:center;margin-top:32px;gap:12px">' +
            '<button class="btn btn-primary" onclick="Exam.start()">Nova prova</button>' +
            '<button class="btn" onclick="Router.navigate(\'review\')">Revisão</button>' +
            '<button class="btn" onclick="Router.navigate(\'\')">Início</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ── Public API ────────────────────────────────────────────────────

  return {

    setTopics: setTopics,

    // Called by Router for route 'exam'
    render: function (view) {
      Exam.start();
    },

    start: function () {
      _stopTimer();
      Progress.muteEvents();
      _s.queue    = _buildQueue();
      _s.index    = 0;
      _s.correct  = 0;
      _s.answered = 0;
      _s.solved   = false;
      _s.timerSecs = _MINUTES * 60;
      _s.hintsEnabled = false;
      _s.hintIndex = 0;

      var view = document.getElementById('view');
      if (!view) return;
      _renderCard(view);
      _startTimer();
    },

    check: function () {
      if (_s.solved) return;
      var inp = document.getElementById('exam-input');
      var fb  = document.getElementById('exam-feedback');
      if (!inp || !fb) return;

      var item = _s.queue[_s.index];
      if (!item) return;
      var s  = inp.value.trim();
      var c  = String(item.exercise.answer);
      var sn = parseFloat(s.replace(',', '.'));
      var cn = parseFloat(c.replace(',', '.'));
      var ok = s === c ||
               s.toLowerCase() === c.toLowerCase() ||
               (!isNaN(sn) && !isNaN(cn) && Math.abs(sn - cn) <= 0.05);

      _s.answered++;
      _s.solved = true;
      inp.classList.toggle('correct', ok);
      inp.classList.toggle('wrong',  !ok);
      inp.disabled = true;

      if (ok) {
        _s.correct++;
        Progress.recordAttempt(item.topicId, true);
        fb.className   = 'feedback-line correct';
        fb.textContent = '\u2713 Correto! = ' + c;
      } else {
        Progress.recordAttempt(item.topicId, false);
        fb.className   = 'feedback-line wrong';
        fb.textContent = '\u2717 Incorreto. Resposta: ' + c;
        if (_s.hintsEnabled && _s.hintIndex === 0) Exam.hint();
      }

      var nb = document.getElementById('exam-next-btn');
      if (nb) {
        nb.style.display  = '';
        nb.textContent    = _s.index + 1 >= _TOTAL ? 'Ver resultado' : 'Pr\u00f3xima \u2192';
      }
      _updateHintBtn();
    },

    next: function () {
      _s.index++;
      _s.solved    = false;
      _s.hintIndex = 0;
      if (_s.index >= _s.queue.length) {
        _showResults();
        return;
      }
      var view = document.getElementById('view');
      if (view) _renderCard(view);
    },

    hint: function () {
      var item = _s.queue[_s.index];
      if (!item || !item.exercise.hints || _s.hintIndex >= item.exercise.hints.length) return;
      var ha = document.getElementById('exam-hint-area');
      if (ha && item.exercise.hints[_s.hintIndex]) {
        ha.innerHTML += '<div class="hint-box"><div class="hint-label">Dica ' +
          (_s.hintIndex + 1) + '</div>' + item.exercise.hints[_s.hintIndex] + '</div>';
      }
      _s.hintIndex++;
      var b = document.getElementById('exam-hint-btn');
      if (b && _s.hintIndex >= item.exercise.hints.length) b.style.display = 'none';
    },

    toggleHints: function () {
      _s.hintsEnabled = !_s.hintsEnabled;
      var sw = document.getElementById('exam-hint-sw');
      if (sw) sw.classList.toggle('on', _s.hintsEnabled);
      _updateHintBtn();
      if (!_s.hintsEnabled) {
        var ha = document.getElementById('exam-hint-area');
        if (ha) ha.innerHTML = '';
        _s.hintIndex = 0;
      }
    },

    abort: function () {
      _stopTimer();
      _showResults();
    },

  };

})();
