/**
 * progress.js
 * Single responsibility: read/write student progress to localStorage.
 * No DOM, no math logic.
 */

var Progress = (function () {
  var KEY = 'euclides_progress';
  var _state = {};
  var _suppressEvents = false;

  function _load() {
    try { _state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(_) { _state = {}; }
  }

  function _save() {
    try { localStorage.setItem(KEY, JSON.stringify(_state)); } catch(_) {}
  }

  function _ensure(id) {
    if (!_state[id]) _state[id] = { conceptDone: false, exampleDone: false, practiceCount: 0, practiceCorrect: 0 };
    return _state[id];
  }

  return {
    init: function() { _load(); },
    markConcept:  function(id) { _ensure(id).conceptDone  = true; _save(); },
    markExample:  function(id) { _ensure(id).exampleDone  = true; _save(); },
    recordAttempt: function(id, correct) {
      var t = _ensure(id);
      t.practiceCount++;
      if (correct) {
        t.practiceCorrect++;
        // Fire topic-complete event the first time 5 correct are reached
        if (t.practiceCorrect === 5 && !_suppressEvents) {
          try {
            document.dispatchEvent(new CustomEvent('euclides:topicComplete', { detail: { id: id } }));
          } catch(_) {}
        }
      }
      _save();
    },
    get: function(id) { return _ensure(id); },
    accuracy: function(id) {
      var t = _ensure(id);
      return t.practiceCount === 0 ? -1 : Math.round(t.practiceCorrect / t.practiceCount * 100);
    },
    resetAll:       function() { _state = {}; _save(); },
    muteEvents:     function() { _suppressEvents = true;  },
    unmuteEvents:   function() { _suppressEvents = false; },
  };
})();
