/**
 * review.js
 * Single responsibility: render the review mode session.
 * Picks random exercises from topics the student has already practiced.
 * Registered as Router route 'review'.
 */

var Review = (function () {

  var _topics   = [];   // full topic list, set at boot
  var _session  = {
    exercise:     null,
    topicId:      null,
    topicTitle:   null,
    difficulty:   3,    // fixed mid difficulty in review
    streak:       0,
    total:        0,
    correct:      0,
    solved:       false,
    hintsEnabled: false,
    hintIndex:    0,
  };

  // ── Inject topic list (called from main.js after load) ────────────

  function setTopics(topics) {
    _topics = topics;
  }

  // ── Pick a random practiced topic ────────────────────────────────

  function _practicedTopics() {
    return _topics.filter(function (t) {
      return t.status === 'available' && Progress.get(t.id).practiceCount > 0;
    });
  }

  // Weighted random: topics with lower accuracy get proportionally more weight.
  // A topic with 0% accuracy gets weight 5; 100% accuracy gets weight 1.
  // Topics with no recorded accuracy (practiceCount=0) are excluded upstream.
  function _randomTopic() {
    var pool = _practicedTopics();
    if (!pool.length) return null;

    // Build cumulative weight array
    var weights = pool.map(function (t) {
      var acc = Progress.accuracy(t.id); // 0–100 or -1
      if (acc < 0) return 3;             // never attempted: neutral weight
      // Map 0%→5, 50%→3, 100%→1 (linear)
      return 1 + Math.round((1 - acc / 100) * 4);
    });

    var total = weights.reduce(function (s, w) { return s + w; }, 0);
    var r = Math.random() * total;
    var cum = 0;
    for (var i = 0; i < pool.length; i++) {
      cum += weights[i];
      if (r < cum) return pool[i];
    }
    return pool[pool.length - 1];
  }

  // ── Load next exercise ────────────────────────────────────────────

  function _loadNext() {
    var topic = _randomTopic();
    if (!topic) return false;

    _session.topicId    = topic.id;
    _session.topicTitle = topic.title;
    _session.exercise   = MathCore.generateExercise(topic.id, _session.difficulty);
    _session.solved     = false;
    _session.hintIndex  = 0;
    return true;
  }

  // ── Render ────────────────────────────────────────────────────────

  function render(view) {
    _session.streak  = 0;
    _session.total   = 0;
    _session.correct = 0;

    var pool = _practicedTopics();
    if (!pool.length) {
      view.innerHTML =
        '<div class="review-screen">' +
          '<div class="review-empty">' +
            '<p>Nenhum tópico praticado ainda.</p>' +
            '<p class="text-dim text-mono" style="font-size:13px;margin-top:8px">Complete a prática de pelo menos um tópico para desbloquear a revisão.</p>' +
            '<button class="btn btn-primary" style="margin-top:24px" onclick="Router.navigate(\'\')">← Voltar</button>' +
          '</div>' +
        '</div>';
      return;
    }

    _loadNext();
    _renderCard(view);
  }

  function _renderCard(view) {
    var ex = _session.exercise;
    if (!ex) { Router.navigate(''); return; }

    view.innerHTML =
      '<div class="review-screen">' +
        '<div class="review-header">' +
          '<div class="review-meta">' +
            '<span class="review-label">Revisão</span>' +
            '<span class="review-topic text-gold">' + _session.topicTitle + '</span>' +
          '</div>' +
          '<div class="review-stats">' +
            '<span class="stat-item"><span class="stat-val" id="rv-correct">' + _session.correct + '</span> corretas</span>' +
            '<span class="stat-sep">/</span>' +
            '<span class="stat-item"><span class="stat-val" id="rv-total">' + _session.total + '</span> total</span>' +
            (_session.streak >= 3
              ? '<span class="streak-badge">× ' + _session.streak + '</span>'
              : '') +
          '</div>' +
        '</div>' +

        '<div class="review-body">' +
          '<div class="exercise-card" style="max-width:560px;margin:0 auto">' +
            '<p class="exercise-statement">' + ex.statement + '</p>' +
            '<div class="exercise-equation">' + ex.equation + '</div>' +
            '<div class="answer-row">' +
              '<span class="answer-label">= </span>' +
              '<input class="answer-input" id="rv-input" type="text" placeholder="resposta" autocomplete="off"/>' +
            '</div>' +
            '<p class="feedback-line" id="rv-feedback"></p>' +
            '<div id="rv-hint-area"></div>' +
            '<div class="btn-row" style="margin-top:16px">' +
              '<button class="btn btn-primary" onclick="Review.check()">Verificar</button>' +
              '<button class="btn" id="rv-hint-btn" onclick="Review.hint()" style="display:none">Ver dica</button>' +
              '<button class="btn" id="rv-next-btn" onclick="Review.next()" style="display:none">Próximo →</button>' +
              '<button class="btn" style="margin-left:auto;opacity:.5" onclick="Router.navigate(\'\')">Sair</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="review-footer">' +
          '<label class="hint-toggle" onclick="Review.toggleHints()">' +
            'Dicas' +
            '<div class="toggle-switch' + (_session.hintsEnabled ? ' on' : '') + '" id="rv-hint-sw"><div class="toggle-knob"></div></div>' +
          '</label>' +
          '<button class="btn" style="font-size:12px;opacity:.5" onclick="Review.skip()">Pular →</button>' +
        '</div>' +
      '</div>';

    var inp = document.getElementById('rv-input');
    if (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') Review.check();
      });
      inp.focus();
    }
    _updateHintBtn();
  }

  function _updateHintBtn() {
    var b = document.getElementById('rv-hint-btn');
    if (b) b.style.display = (_session.hintsEnabled && !_session.solved) ? '' : 'none';
  }

  // ── Public API (called from inline onclick) ───────────────────────

  return {

    setTopics: setTopics,

    render: render,

    check: function () {
      if (_session.solved) return;
      var inp = document.getElementById('rv-input');
      var fb  = document.getElementById('rv-feedback');
      if (!inp || !fb || !_session.exercise) return;

      var s  = inp.value.trim();
      var c  = String(_session.exercise.answer);
      var sn = parseFloat(s.replace(',', '.'));
      var cn = parseFloat(c.replace(',', '.'));
      var ok = s === c ||
               s.toLowerCase() === c.toLowerCase() ||
               (!isNaN(sn) && !isNaN(cn) && Math.abs(sn - cn) <= 0.05);

      _session.total++;
      inp.classList.toggle('correct', ok);
      inp.classList.toggle('wrong',  !ok);

      if (ok) {
        _session.correct++;
        _session.streak++;
        _session.solved = true;
        Progress.recordAttempt(_session.topicId, true);
        fb.className     = 'feedback-line correct';
        fb.textContent   = '✓ Correto! = ' + c;
        inp.disabled     = true;
        var nb = document.getElementById('rv-next-btn');
        if (nb) nb.style.display = '';
        _updateHintBtn();
        // Update counters
        var vc = document.getElementById('rv-correct');
        var vt = document.getElementById('rv-total');
        if (vc) vc.textContent = _session.correct;
        if (vt) vt.textContent = _session.total;
      } else {
        _session.streak = 0;
        Progress.recordAttempt(_session.topicId, false);
        fb.className   = 'feedback-line wrong';
        fb.textContent = '✗ Não é isso. Tente novamente.';
        var vt2 = document.getElementById('rv-total');
        if (vt2) vt2.textContent = _session.total;
        if (_session.hintsEnabled && _session.hintIndex === 0) Review.hint();
      }
      UI.renderSidebar(null);
    },

    hint: function () {
      var ex = _session.exercise;
      if (!ex || !ex.hints || _session.hintIndex >= ex.hints.length) return;
      var ha = document.getElementById('rv-hint-area');
      if (ha && ex.hints[_session.hintIndex]) {
        ha.innerHTML += '<div class="hint-box"><div class="hint-label">Dica ' +
          (_session.hintIndex + 1) + '</div>' + ex.hints[_session.hintIndex] + '</div>';
      }
      _session.hintIndex++;
      var b = document.getElementById('rv-hint-btn');
      if (b && _session.hintIndex >= ex.hints.length) b.style.display = 'none';
    },

    toggleHints: function () {
      _session.hintsEnabled = !_session.hintsEnabled;
      var sw = document.getElementById('rv-hint-sw');
      if (sw) sw.classList.toggle('on', _session.hintsEnabled);
      _updateHintBtn();
      if (!_session.hintsEnabled) {
        var ha = document.getElementById('rv-hint-area');
        if (ha) ha.innerHTML = '';
        _session.hintIndex = 0;
      }
    },

    next: function () {
      _loadNext();
      var view = document.getElementById('view');
      if (view) _renderCard(view);
    },

    skip: function () {
      _session.total++;
      var vt = document.getElementById('rv-total');
      if (vt) vt.textContent = _session.total;
      Review.next();
    },
  };

})();
