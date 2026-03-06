/**
 * stats.js
 * Single responsibility: render the statistics screen.
 * Reads from Progress — no writes, no math.
 * Route: 'stats'
 */

var Stats = (function () {

  var _topics = [];

  function setTopics(topics) { _topics = topics; }

  // ── Helpers ───────────────────────────────────────────────────────

  function _levelLabel(key) {
    return { EFI: 'Fundamental I', EFII: 'Fundamental II', EM: 'Ensino Médio', ES: 'Ensino Superior' }[key] || key;
  }

  function _grade(pct) {
    if (pct >= 90) return { label: 'Excelente', color: 'var(--teal)' };
    if (pct >= 70) return { label: 'Bom',       color: 'var(--blue)' };
    if (pct >= 50) return { label: 'Regular',   color: 'var(--gold)' };
    return               { label: 'Fraco',      color: 'var(--red)'  };
  }

  // ── Summary numbers ───────────────────────────────────────────────

  function _summary() {
    var available = _topics.filter(function (t) { return t.status === 'available'; });
    var started   = available.filter(function (t) { return Progress.get(t.id).practiceCount > 0; });
    var completed = available.filter(function (t) { return Progress.get(t.id).practiceCorrect >= 5; });

    var totalAttempts = 0;
    var totalCorrect  = 0;
    started.forEach(function (t) {
      var p = Progress.get(t.id);
      totalAttempts += p.practiceCount;
      totalCorrect  += p.practiceCorrect;
    });

    return {
      available:     available.length,
      started:       started.length,
      completed:     completed.length,
      totalAttempts: totalAttempts,
      totalCorrect:  totalCorrect,
      globalAcc:     totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : -1,
    };
  }

  // ── Per-level breakdown ───────────────────────────────────────────

  function _levelRows() {
    var levels = ['EFI', 'EFII', 'EM', 'ES'];
    return levels.map(function (lv) {
      var group  = _topics.filter(function (t) { return t.level === lv && t.status === 'available'; });
      if (!group.length) return null;
      var started   = group.filter(function (t) { return Progress.get(t.id).practiceCount > 0; });
      var completed = group.filter(function (t) { return Progress.get(t.id).practiceCorrect >= 5; });
      var attempts  = 0, correct = 0;
      started.forEach(function (t) {
        var p = Progress.get(t.id);
        attempts += p.practiceCount;
        correct  += p.practiceCorrect;
      });
      var acc = attempts ? Math.round(correct / attempts * 100) : -1;
      return {
        label:     _levelLabel(lv),
        total:     group.length,
        started:   started.length,
        completed: completed.length,
        acc:       acc,
      };
    }).filter(Boolean);
  }

  // ── Per-topic table (only practiced) ─────────────────────────────

  function _topicRows() {
    return _topics
      .filter(function (t) { return t.status === 'available' && Progress.get(t.id).practiceCount > 0; })
      .map(function (t) {
        var p   = Progress.get(t.id);
        var acc = Progress.accuracy(t.id);
        var g   = _grade(acc);
        return { id: t.id, title: t.title, level: t.level, group: t.group,
                 attempts: p.practiceCount, correct: p.practiceCorrect,
                 acc: acc, grade: g,
                 conceptDone: p.conceptDone, exampleDone: p.exampleDone };
      })
      .sort(function (a, b) { return a.acc - b.acc; }); // worst first
  }

  // ── Render ────────────────────────────────────────────────────────

  function render(view) {
    var s    = _summary();
    var lvls = _levelRows();
    var rows = _topicRows();

    if (s.started === 0) {
      view.innerHTML =
        '<div class="stats-screen">' +
          '<div class="stats-title">Estatísticas</div>' +
          '<p class="stats-empty">Nenhum tópico praticado ainda.<br>' +
          '<span class="text-mono text-dim" style="font-size:12px">Complete exercícios para ver seu desempenho aqui.</span></p>' +
          '<div class="btn-row" style="margin-top:24px"><button class="btn btn-primary" onclick="Router.navigate(\'\')">Começar agora</button></div>' +
        '</div>';
      return;
    }

    // ── Summary cards ─────────────────────────────────────────────
    var globalAccHTML = s.globalAcc >= 0
      ? '<div class="stat-card stat-card-accent">' +
          '<div class="stat-card-val">' + s.globalAcc + '%</div>' +
          '<div class="stat-card-label">Precisão global</div>' +
        '</div>'
      : '';

    var summaryHTML =
      '<div class="stats-cards">' +
        globalAccHTML +
        '<div class="stat-card">' +
          '<div class="stat-card-val">' + s.completed + '</div>' +
          '<div class="stat-card-label">Concluídos</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-card-val">' + s.started + '</div>' +
          '<div class="stat-card-label">Iniciados</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-card-val">' + s.totalAttempts + '</div>' +
          '<div class="stat-card-label">Exercícios feitos</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-card-val">' + s.totalCorrect + '</div>' +
          '<div class="stat-card-label">Acertos totais</div>' +
        '</div>' +
      '</div>';

    // ── Level breakdown ───────────────────────────────────────────
    var levelHTML = '<div class="stats-section-title">Por nível</div>' +
      '<div class="stats-level-grid">' +
      lvls.map(function (lv) {
        var pct = lv.total ? Math.round(lv.started / lv.total * 100) : 0;
        var accTxt = lv.acc >= 0 ? lv.acc + '%' : '—';
        return (
          '<div class="stats-level-card">' +
            '<div class="stats-level-name">' + lv.label + '</div>' +
            '<div class="stats-level-row">' +
              '<span class="stats-level-num">' + lv.started + '/' + lv.total + '</span>' +
              '<span class="stats-level-sub">iniciados</span>' +
            '</div>' +
            '<div class="stats-prog-track">' +
              '<div class="stats-prog-fill" style="width:' + pct + '%"></div>' +
            '</div>' +
            '<div class="stats-level-acc">' + accTxt + ' precisão</div>' +
          '</div>'
        );
      }).join('') +
      '</div>';

    // ── Per-topic table ───────────────────────────────────────────
    var worst  = rows.slice(0, 5);
    var best   = rows.slice().sort(function (a, b) { return b.acc - a.acc; }).slice(0, 5);

    function _topicRow(r) {
      var barW = Math.max(0, r.acc);
      return (
        '<div class="stats-topic-row" onclick="Router.navigate(\'topic/' + r.id + '/practice\')">' +
          '<div class="stats-topic-name">' + r.title + '</div>' +
          '<div class="stats-topic-bar-wrap">' +
            '<div class="stats-topic-bar" style="width:' + barW + '%;background:' + r.grade.color + '"></div>' +
          '</div>' +
          '<div class="stats-topic-acc" style="color:' + r.grade.color + '">' + r.acc + '%</div>' +
          '<div class="stats-topic-count text-dim">' + r.correct + '/' + r.attempts + '</div>' +
        '</div>'
      );
    }

    var topicHTML =
      '<div class="stats-two-col">' +
        '<div>' +
          '<div class="stats-section-title">Pontos fracos</div>' +
          worst.map(_topicRow).join('') +
        '</div>' +
        '<div>' +
          '<div class="stats-section-title">Pontos fortes</div>' +
          best.map(_topicRow).join('') +
        '</div>' +
      '</div>';

    // ── Full table toggle ─────────────────────────────────────────
    var allHTML =
      '<div class="stats-section-title" style="margin-top:24px">' +
        'Todos os tópicos praticados' +
        '<span class="stats-count-badge">' + rows.length + '</span>' +
      '</div>' +
      '<div class="stats-full-table">' +
      rows.map(_topicRow).join('') +
      '</div>';

    view.innerHTML =
      '<div class="stats-screen">' +
        '<div class="stats-title">Estatísticas</div>' +
        summaryHTML +
        levelHTML +
        topicHTML +
        allHTML +
        '<div class="stats-footer">' +
          '<button class="btn" style="opacity:.5;font-size:11px" onclick="Stats._confirmReset()">Resetar progresso</button>' +
        '</div>' +
      '</div>';
  }

  // ── Reset with confirmation ───────────────────────────────────────

  function _confirmReset() {
    var overlay = document.createElement('div');
    overlay.id = 'reset-overlay';
    overlay.innerHTML =
      '<div class="reset-backdrop" onclick="Stats._closeReset()"></div>' +
      '<div class="reset-card">' +
        '<div class="reset-title">Resetar todo o progresso?</div>' +
        '<p class="reset-body">Esta ação apaga todos os dados de prática, conceitos e exemplos. Não pode ser desfeita.</p>' +
        '<div class="btn-row" style="justify-content:center;gap:12px;margin-top:20px">' +
          '<button class="btn btn-danger" onclick="Stats._doReset()">Resetar tudo</button>' +
          '<button class="btn" onclick="Stats._closeReset()">Cancelar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('reset-visible'); });
  }

  function _closeReset() {
    var o = document.getElementById('reset-overlay');
    if (o) o.remove();
  }

  function _doReset() {
    Progress.resetAll();
    _closeReset();
    var view = document.getElementById('view');
    if (view) render(view);
    UI.renderSidebar(null);
  }

  // ── Public API ────────────────────────────────────────────────────

  return {
    setTopics:      setTopics,
    render:         render,
    _confirmReset:  _confirmReset,
    _closeReset:    _closeReset,
    _doReset:       _doReset,
  };

})();
