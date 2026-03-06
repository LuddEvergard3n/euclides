/**
 * teacher.js
 * Responsibilities:
 *   Tab A — "Criar Exercícios": create/list/delete custom exercises (localStorage).
 *   Tab B — "Folha de Exercícios": generate 10 exercises per topic, print-ready.
 * No math validation logic. No routing decisions.
 */

var Teacher = (function () {

  var STORAGE_KEY = 'euclides_teacher_exercises';
  var _topics     = [];
  var _activeTab  = 'create';

  function setTopics(topics) {
    _topics = topics.filter(function (t) { return t.status === 'available'; });
  }

  function _load()     { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) { return []; } }
  function _save(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (_) {} }

  function _add(exercise) {
    var list = _load();
    exercise.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    list.unshift(exercise);
    _save(list);
  }

  function _remove(id) { _save(_load().filter(function (e) { return e.id !== id; })); }

  function _topicLabel(id) {
    for (var i = 0; i < _topics.length; i++) {
      if (_topics[i].id === id) return _topics[i].title;
    }
    return id;
  }

  function _topicOptions(selectedId) {
    var levels = [
      { key: 'EFI',  label: 'Fundamental I'   },
      { key: 'EFII', label: 'Fundamental II'  },
      { key: 'EM',   label: 'Ensino Médio'    },
      { key: 'ES',   label: 'Ensino Superior' },
    ];
    var html = '';
    levels.forEach(function (lv) {
      var group = _topics.filter(function (t) { return t.level === lv.key; });
      if (!group.length) return;

      if (lv.key === 'ES') {
        // ES: nested by subgroup
        var subgroups = [], seen = {};
        group.forEach(function (t) {
          var g = t.group || 'Outros';
          if (!seen[g]) { seen[g] = true; subgroups.push(g); }
        });
        subgroups.forEach(function (sg) {
          html += '<optgroup label="' + lv.label + ' — ' + sg + '">';
          group.filter(function (t) { return (t.group || 'Outros') === sg; })
               .forEach(function (t) {
                 html += '<option value="' + t.id + '"' +
                   (t.id === selectedId ? ' selected' : '') + '>' + t.title + '</option>';
               });
          html += '</optgroup>';
        });
      } else {
        html += '<optgroup label="' + lv.label + '">';
        group.forEach(function (t) {
          html += '<option value="' + t.id + '"' +
            (t.id === selectedId ? ' selected' : '') + '>' + t.title + '</option>';
        });
        html += '</optgroup>';
      }
    });
    return html;
  }

  // ── Render ────────────────────────────────────────────────────────

  function render(view) {
    view.innerHTML = _shell();
    _renderTab(view);
  }

  function _shell() {
    return (
      '<div class="teacher-screen">' +
        '<div class="teacher-title">Modo Professor</div>' +
        '<div class="teacher-tabs">' +
          '<button class="t-tab' + (_activeTab === 'create' ? ' t-tab-active' : '') + '" onclick="Teacher._switchTab(\'create\')">Criar exercícios</button>' +
          '<button class="t-tab' + (_activeTab === 'sheet'  ? ' t-tab-active' : '') + '" onclick="Teacher._switchTab(\'sheet\')">Folha de exercícios</button>' +
        '</div>' +
        '<div id="teacher-tab-content"></div>' +
      '</div>'
    );
  }

  function _renderTab(view) {
    var content = view.querySelector('#teacher-tab-content');
    if (!content) return;
    if (_activeTab === 'create') {
      content.innerHTML = _buildCreateHTML();
      _bindCreateEvents(content);
    } else {
      content.innerHTML = _buildSheetHTML();
      _bindSheetEvents(content);
    }
  }

  // ── Tab A: Create ─────────────────────────────────────────────────

  function _buildCreateHTML() {
    return (
      '<p class="teacher-desc">Crie exercícios personalizados para qualquer tópico.</p>' +
      '<div class="form-group"><label class="form-label">Tópico</label>' +
        '<select id="t-topic" class="form-select">' + _topicOptions('') + '</select></div>' +
      '<div class="form-group"><label class="form-label">Enunciado</label>' +
        '<textarea id="t-statement" class="form-textarea" rows="3" placeholder="Ex: Uma turma tem o triplo de meninas em relação a meninos. No total são 40 alunos. Quantas meninas há?"></textarea></div>' +
      '<div class="form-group"><label class="form-label">Equação (como será exibida)</label>' +
        '<input id="t-equation" class="form-input" type="text" placeholder="Ex: 3x + x = 40" /></div>' +
      '<div class="form-group"><label class="form-label">Resposta correta</label>' +
        '<input id="t-answer" class="form-input" type="text" placeholder="Ex: 30" /></div>' +
      '<div class="form-group"><label class="form-label">Dicas (até 3)</label>' +
        '<div class="hint-fields">' +
          '<input id="t-hint1" class="form-input" type="text" placeholder="Dica 1" />' +
          '<input id="t-hint2" class="form-input" type="text" placeholder="Dica 2" />' +
          '<input id="t-hint3" class="form-input" type="text" placeholder="Dica 3" />' +
        '</div></div>' +
      '<div class="btn-row">' +
        '<button class="btn btn-primary" id="t-save">Salvar exercício</button>' +
        '<span id="t-status" class="text-mono text-dim" style="font-size:12px"></span>' +
      '</div>' +
      '<div class="exercise-list" id="t-list">' + _buildList() + '</div>'
    );
  }

  function _buildList() {
    var list = _load();
    if (!list.length) {
      return '<div class="exercise-list-title">Exercícios criados</div>' +
             '<p class="text-dim text-mono" style="font-size:12px">Nenhum exercício criado ainda.</p>';
    }
    var rows = list.map(function (e) {
      return (
        '<div class="exercise-item" data-id="' + e.id + '">' +
          '<div class="exercise-item-info">' +
            '<div class="exercise-item-topic">' + _topicLabel(e.topic) + '</div>' +
            '<div class="exercise-item-stmt">' + e.statement + '</div>' +
          '</div>' +
          '<button class="btn-icon" data-del="' + e.id + '" title="Remover">\u00d7</button>' +
        '</div>'
      );
    }).join('');
    return '<div class="exercise-list-title">Exercícios criados (' + list.length + ')</div>' + rows;
  }

  function _bindCreateEvents(content) {
    var saveBtn = content.querySelector('#t-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var statement = (content.querySelector('#t-statement').value || '').trim();
        var equation  = (content.querySelector('#t-equation').value  || '').trim();
        var answer    = (content.querySelector('#t-answer').value    || '').trim();
        var hint1     = (content.querySelector('#t-hint1').value     || '').trim();
        var hint2     = (content.querySelector('#t-hint2').value     || '').trim();
        var hint3     = (content.querySelector('#t-hint3').value     || '').trim();
        var topic     = content.querySelector('#t-topic').value;
        var status    = content.querySelector('#t-status');

        if (!statement || !equation || !answer) {
          status.textContent = 'Enunciado, equa\u00e7\u00e3o e resposta s\u00e3o obrigat\u00f3rios.';
          return;
        }
        _add({ topic: topic, statement: statement, equation: equation, answer: answer,
               hints: [hint1, hint2, hint3].filter(Boolean), custom: true });

        ['#t-statement','#t-equation','#t-answer','#t-hint1','#t-hint2','#t-hint3']
          .forEach(function (sel) { var el = content.querySelector(sel); if (el) el.value = ''; });

        status.textContent = '\u2713 Exerc\u00edcio salvo.';
        setTimeout(function () { status.textContent = ''; }, 2500);
        content.querySelector('#t-list').innerHTML = _buildList();
        _bindDeleteButtons(content);
      });
    }
    _bindDeleteButtons(content);
  }

  function _bindDeleteButtons(content) {
    content.querySelectorAll('[data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _remove(btn.dataset.del);
        content.querySelector('#t-list').innerHTML = _buildList();
        _bindDeleteButtons(content);
      });
    });
  }

  // ── Tab B: Print sheet ────────────────────────────────────────────

  var _diffLabels = ['', 'B\u00e1sico', 'F\u00e1cil', 'M\u00e9dio', 'Avan\u00e7ado', 'Desafio'];

  function _buildSheetHTML() {
    var firstId = _topics.length ? _topics[0].id : '';
    return (
      '<p class="teacher-desc">Gere uma folha com 10 exerc\u00edcios prontos para imprimir em PDF.</p>' +
      '<div class="sheet-controls">' +
        '<div class="form-group"><label class="form-label">T\u00f3pico</label>' +
          '<select id="sh-topic" class="form-select">' + _topicOptions(firstId) + '</select></div>' +
        '<div class="form-group"><label class="form-label">Dificuldade</label>' +
          '<select id="sh-diff" class="form-select">' +
            '<option value="1">B\u00e1sico (n\u00edvel 1)</option>' +
            '<option value="2">F\u00e1cil (n\u00edvel 2)</option>' +
            '<option value="3" selected>M\u00e9dio (n\u00edvel 3)</option>' +
            '<option value="4">Avan\u00e7ado (n\u00edvel 4)</option>' +
            '<option value="5">Desafio (n\u00edvel 5)</option>' +
            '<option value="mix">Misto (2 de cada n\u00edvel)</option>' +
          '</select></div>' +
        '<div class="form-group"><label class="form-label">Gabarito</label>' +
          '<select id="sh-answers" class="form-select">' +
            '<option value="no">Sem gabarito</option>' +
            '<option value="end">Gabarito ao final</option>' +
          '</select></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" id="sh-generate">Gerar folha</button>' +
          '<button class="btn" id="sh-print" style="display:none" onclick="Teacher._print()">Imprimir / Salvar PDF</button>' +
        '</div>' +
      '</div>' +
      '<div id="sh-preview"></div>'
    );
  }

  function _bindSheetEvents(content) {
    var genBtn = content.querySelector('#sh-generate');
    if (genBtn) {
      genBtn.addEventListener('click', function () {
        _generateSheet(
          content.querySelector('#sh-topic').value,
          content.querySelector('#sh-diff').value,
          content.querySelector('#sh-answers').value,
          content
        );
      });
    }
  }

  function _generateSheet(topicId, diffVal, showAnswers, content) {
    var exercises = [];

    if (diffVal === 'mix') {
      for (var d = 1; d <= 5; d++) {
        for (var k = 0; k < 2; k++) {
          try { exercises.push({ diff: d, ex: MathCore.generateExercise(topicId, d) }); } catch (_) {}
        }
      }
    } else {
      var diff = parseInt(diffVal, 10);
      for (var i = 0; i < 10; i++) {
        try { exercises.push({ diff: diff, ex: MathCore.generateExercise(topicId, diff) }); } catch (_) {}
      }
    }

    if (!exercises.length) {
      content.querySelector('#sh-preview').innerHTML =
        '<p class="text-dim" style="margin-top:16px">N\u00e3o foi poss\u00edvel gerar exerc\u00edcios para este t\u00f3pico.</p>';
      return;
    }

    var topicTitle = _topicLabel(topicId);
    var diffLabel  = diffVal === 'mix' ? 'Misto' : (_diffLabels[parseInt(diffVal, 10)] || '');
    var dateStr    = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

    var rows = exercises.map(function (item, idx) {
      var ex = item.ex;
      var badge = diffVal === 'mix'
        ? ' <span class="sh-diff-badge">' + _diffLabels[item.diff] + '</span>'
        : '';
      return (
        '<div class="sh-exercise">' +
          '<div class="sh-num">' + (idx + 1) + '.' + badge + '</div>' +
          '<div class="sh-body">' +
            '<p class="sh-statement">' + ex.statement + '</p>' +
            '<div class="sh-equation">' + ex.equation + '</div>' +
            '<div class="sh-answer-line">' +
              '<span class="sh-answer-label">Resposta:</span>' +
              '<span class="sh-blank"></span>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var answerKey = '';
    if (showAnswers === 'end') {
      var items = exercises.map(function (item, idx) {
        return '<span class="sh-key-item"><strong>' + (idx + 1) + '.</strong>\u00a0' + item.ex.answer + '</span>';
      }).join('');
      answerKey =
        '<div class="sh-answer-key">' +
          '<div class="sh-key-title">Gabarito</div>' +
          '<div class="sh-key-grid">' + items + '</div>' +
        '</div>';
    }

    content.querySelector('#sh-preview').innerHTML =
      '<div class="sh-sheet" id="sh-sheet">' +
        '<div class="sh-header">' +
          '<div class="sh-header-col">' +
            '<div class="sh-field-line"></div>' +
            '<div class="sh-field-label">Escola / Turma</div>' +
          '</div>' +
          '<div class="sh-header-center">' +
            '<div class="sh-title">Euclides</div>' +
            '<div class="sh-subtitle">' + topicTitle +
              (diffLabel ? ' \u2014 ' + diffLabel : '') + '</div>' +
          '</div>' +
          '<div class="sh-header-col sh-header-right">' +
            '<div class="sh-field-line"></div>' +
            '<div class="sh-field-label">Nome do Aluno</div>' +
            '<div class="sh-date">' + dateStr + '</div>' +
          '</div>' +
        '</div>' +
        '<hr class="sh-divider"/>' +
        '<div class="sh-exercises">' + rows + '</div>' +
        answerKey +
        '<div class="sh-footer">gerado por Euclides \u2014 ' + dateStr + '</div>' +
      '</div>';

    var pb = content.querySelector('#sh-print');
    if (pb) pb.style.display = '';
  }

  function _print() { window.print(); }

  function _switchTab(tab) {
    _activeTab = tab;
    var view = document.getElementById('view');
    if (view) render(view);
  }

  function getCustomExercises(topicId) {
    return _load().filter(function (e) { return e.topic === topicId; });
  }

  return {
    render:             render,
    getCustomExercises: getCustomExercises,
    setTopics:          setTopics,
    _switchTab:         _switchTab,
    _print:             _print,
  };

})();
