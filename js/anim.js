/**
 * anim.js
 * Single responsibility: visual feedback animations.
 * Watches for .correct class added to .answer-input and spawns
 * a gold particle burst. No changes needed in any module file.
 */

var Anim = (function () {

  // ── Particle burst ─────────────────────────────────────────────────

  function _burst(sourceEl) {
    var rect = sourceEl.getBoundingClientRect();
    var ox = rect.left + rect.width  * 0.5;
    var oy = rect.top  + rect.height * 0.5;

    var colors = ['#c8a44a', '#e8c860', '#5de8e0', '#ffffff', '#d4a030'];
    var count  = 22;

    for (var i = 0; i < count; i++) {
      _spawnParticle(ox, oy, colors[i % colors.length]);
    }
  }

  function _spawnParticle(ox, oy, color) {
    var el = document.createElement('div');
    el.className = 'anim-particle';
    el.style.cssText = [
      'position:fixed',
      'left:' + ox + 'px',
      'top:'  + oy + 'px',
      'width:6px',
      'height:6px',
      'border-radius:50%',
      'background:' + color,
      'pointer-events:none',
      'z-index:9999',
      'transform:translate(-50%,-50%)',
    ].join(';');
    document.body.appendChild(el);

    var angle = Math.random() * Math.PI * 2;
    var speed = 80 + Math.random() * 140;
    var vx    = Math.cos(angle) * speed;
    var vy    = Math.sin(angle) * speed - 60; // slight upward bias
    var life  = 0.55 + Math.random() * 0.3;   // seconds
    var size  = 4 + Math.random() * 5;
    var start = null;

    el.style.width  = size + 'px';
    el.style.height = size + 'px';

    function frame(ts) {
      if (!start) start = ts;
      var t = (ts - start) / 1000;
      if (t >= life) { el.remove(); return; }

      var progress = t / life;
      var x = ox + vx * t;
      var y = oy + vy * t + 200 * t * t; // gravity
      var opacity = 1 - progress;
      var scale   = 1 - progress * 0.5;

      el.style.left    = x + 'px';
      el.style.top     = y + 'px';
      el.style.opacity = opacity;
      el.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ── Flash highlight on the feedback line ──────────────────────────

  function _flashFeedback() {
    var fb = document.getElementById('feedback');
    if (!fb) return;
    fb.classList.remove('anim-flash');
    // Force reflow to restart animation
    void fb.offsetWidth;
    fb.classList.add('anim-flash');
  }

  // ── MutationObserver: watch for .correct on .answer-input ─────────

  function _observe() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          var el = m.target;
          if (el.classList.contains('answer-input') &&
              el.classList.contains('correct')       &&
              !el.dataset.burst) {
            el.dataset.burst = '1'; // prevent double-firing
            _burst(el);
            _flashFeedback();
          }
          // Reset burst flag when class is removed (next exercise)
          if (!el.classList.contains('correct')) {
            delete el.dataset.burst;
          }
        }
      });
    });

    // Observe the #view container subtree for class changes
    var view = document.getElementById('view');
    if (view) {
      observer.observe(view, {
        subtree:    true,
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  // ── Public API ────────────────────────────────────────────────────

  return {
    init: function () { _observe(); },
    // Exposed for direct use if needed
    burst: _burst,
  };

})();
