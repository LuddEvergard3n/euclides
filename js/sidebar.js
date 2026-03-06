/**
 * sidebar.js
 * Single responsibility: toggle mobile sidebar open/closed.
 * Also closes the sidebar on navigation (called from Router).
 */

var Sidebar = (function () {

  function open() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('sidebar-overlay');
    if (s) s.classList.add('sidebar-open');
    if (o) o.classList.add('sidebar-open');
  }

  function close() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('sidebar-overlay');
    if (s) s.classList.remove('sidebar-open');
    if (o) o.classList.remove('sidebar-open');
  }

  return { open: open, close: close };

})();
