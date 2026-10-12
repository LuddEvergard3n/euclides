/**
 * sidebar.js
 * Single responsibility: toggle mobile sidebar open/closed.
 * Also closes the sidebar on navigation (called from Router).
 */

var Sidebar = (function () {
  var _trigger = null;

  function open() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('sidebar-overlay');
    if (s) s.classList.add('sidebar-open');
    if (o) o.classList.add('sidebar-open');
    _trigger = document.activeElement;
    if (s) {
      if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) s.setAttribute('aria-hidden', 'false');
      var first = s.querySelector('button');
      if (first) first.focus();
    }
  }

  function close() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('sidebar-overlay');
    if (s) s.classList.remove('sidebar-open');
    if (o) o.classList.remove('sidebar-open');
    if (s && window.matchMedia && window.matchMedia('(max-width: 720px)').matches) s.setAttribute('aria-hidden', 'true');
    else if (s) s.removeAttribute('aria-hidden');
    if (_trigger && typeof _trigger.focus === 'function') _trigger.focus();
    _trigger = null;
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  return { open: open, close: close };

})();
