/**
 * task-input.js
 * Renders and reads the native controls used by review and exam tasks.
 */

var TaskInput = (function () {
  function _escape(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
  }

  function render(task, id) {
    var choices = Array.isArray(task.choices) ? task.choices : [];
    if (!choices.length) {
      return '<div class="answer-row" id="' + id + '-control">' +
        '<span class="answer-label">= </span>' +
        '<input class="answer-input" id="' + id + '" type="text" placeholder="resposta" autocomplete="off"/>' +
      '</div>';
    }
    return '<fieldset class="task-choices" id="' + id + '-control">' +
      '<legend class="sr-only">Escolha uma resposta</legend>' +
      choices.map(function (choice) {
        var safe = _escape(choice);
        return '<label class="task-choice"><input type="radio" name="' + id + '" value="' + safe + '"><span>' + safe + '</span></label>';
      }).join('') +
    '</fieldset>';
  }

  function value(id) {
    var text = document.getElementById(id);
    if (text) return text.value.trim();
    var selected = document.querySelector('input[name="' + id + '"]:checked');
    return selected ? selected.value : '';
  }

  function focus(id) {
    var input = document.getElementById(id) || document.querySelector('input[name="' + id + '"]');
    if (input) input.focus();
  }

  function setResult(id, correct, disabled) {
    var control = document.getElementById(id + '-control');
    if (!control) return;
    control.classList.toggle('correct', correct);
    control.classList.toggle('wrong', !correct);
    control.querySelectorAll('input').forEach(function (input) { input.disabled = Boolean(disabled); });
  }

  return { render: render, value: value, focus: focus, setResult: setResult };
})();
