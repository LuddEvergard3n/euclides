/**
 * completion.js
 * Single responsibility: show a congratulatory overlay when a topic
 * reaches 5 correct answers for the first time.
 * Listens for the 'euclides:topicComplete' CustomEvent fired by progress.js.
 * No module files need modification.
 */

var Completion = (function () {

  var _topics = [];

  function setTopics(topics) { _topics = topics; }

  function _titleFor(id) {
    for (var i = 0; i < _topics.length; i++) {
      if (_topics[i].id === id) return _topics[i].title;
    }
    return id;
  }

  // ── Overlay ───────────────────────────────────────────────────────

  function _show(topicId) {
    // Remove any existing overlay
    var old = document.getElementById('completion-overlay');
    if (old) old.remove();

    var title = _titleFor(topicId);

    var overlay = document.createElement('div');
    overlay.id = 'completion-overlay';
    overlay.innerHTML =
      '<div class="cpl-backdrop" id="cpl-backdrop"></div>' +
      '<div class="cpl-card" id="cpl-card">' +
        '<div class="cpl-icon">' +
          '<svg viewBox="0 0 64 64" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="32" cy="32" r="30" stroke="#c8a44a" stroke-width="2" stroke-opacity="0.3"/>' +
            '<circle cx="32" cy="32" r="22" stroke="#c8a44a" stroke-width="1.5" stroke-opacity="0.5"/>' +
            '<polyline points="20,33 28,41 44,24" stroke="#4ab8b2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</div>' +
        '<div class="cpl-title">Tópico concluído</div>' +
        '<div class="cpl-topic">' + title + '</div>' +
        '<p class="cpl-body">Você acertou 5 exercícios deste tópico.<br>Continue praticando para manter o desempenho.</p>' +
        '<div class="cpl-actions">' +
          '<button class="btn btn-primary" onclick="Completion.close()">Continuar</button>' +
          '<button class="btn" onclick="Completion.close();Router.navigate(\'review\')">Ir para revisão</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('cpl-visible');
      });
    });

    // Close on backdrop click
    document.getElementById('cpl-backdrop').addEventListener('click', function () {
      Completion.close();
    });

    // Spawn ring of particles around the card
    _celebrationParticles();
  }

  function _celebrationParticles() {
    var card = document.getElementById('cpl-card');
    if (!card) return;
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var colors = ['#c8a44a', '#e8c860', '#4ab8b2', '#5de8e0', '#e8e8f2', '#d4a030'];
    for (var i = 0; i < 36; i++) {
      _particle(cx, cy, colors[i % colors.length], i);
    }
  }

  function _particle(ox, oy, color, index) {
    var el = document.createElement('div');
    el.style.cssText = [
      'position:fixed',
      'left:' + ox + 'px',
      'top:'  + oy + 'px',
      'width:7px',
      'height:7px',
      'border-radius:50%',
      'background:' + color,
      'pointer-events:none',
      'z-index:10001',
      'transform:translate(-50%,-50%)',
    ].join(';');
    document.body.appendChild(el);

    var delay  = index * 18;
    var angle  = (index / 36) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    var speed  = 120 + Math.random() * 160;
    var vx     = Math.cos(angle) * speed;
    var vy     = Math.sin(angle) * speed - 80;
    var life   = 0.7 + Math.random() * 0.4;
    var size   = 4 + Math.random() * 6;
    var start  = null;

    el.style.width  = size + 'px';
    el.style.height = size + 'px';

    setTimeout(function () {
      function frame(ts) {
        if (!start) start = ts;
        var t = (ts - start) / 1000;
        if (t >= life) { el.remove(); return; }
        var p   = t / life;
        var x   = ox + vx * t;
        var y   = oy + vy * t + 280 * t * t;
        el.style.left      = x + 'px';
        el.style.top       = y + 'px';
        el.style.opacity   = 1 - p;
        el.style.transform = 'translate(-50%,-50%) scale(' + (1 - p * 0.6) + ')';
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, delay);
  }

  // ── Public API ────────────────────────────────────────────────────

  return {

    setTopics: setTopics,

    init: function () {
      document.addEventListener('euclides:topicComplete', function (e) {
        _show(e.detail.id);
      });
    },

    close: function () {
      var overlay = document.getElementById('completion-overlay');
      if (!overlay) return;
      overlay.classList.remove('cpl-visible');
      overlay.classList.add('cpl-hiding');
      setTimeout(function () { overlay.remove(); }, 300);
    },

  };

})();
