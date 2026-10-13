/**
 * progress.js
 * Persists local learning state and migrates the legacy topic-only shape.
 * No DOM rendering or mathematical validation belongs here.
 */

var Progress = (function () {
  var KEY = 'euclides_progress';
  var VERSION = 2;
  var _state = _emptyState();
  var _suppressEvents = false;

  function _emptyState() {
    return {
      version: VERSION,
      topics: {},
      skillMastery: {},
      lastTopic: null,
      lastStep: null,
      favorites: [],
      recentTopics: [],
      recentFilters: {},
      preferences: {},
    };
  }

  function _isTopicProgress(value) {
    return value && typeof value === 'object' &&
      ('conceptDone' in value || 'exampleDone' in value || 'practiceCount' in value);
  }

  function _normaliseTopic(value) {
    value = value || {};
    return {
      conceptDone: value.conceptDone === true,
      exampleDone: value.exampleDone === true,
      practiceCount: Math.max(0, Number(value.practiceCount) || 0),
      practiceCorrect: Math.max(0, Number(value.practiceCorrect) || 0),
      lastVisited: value.lastVisited || null,
    };
  }

  function _migrate(raw) {
    var next = _emptyState();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return next;

    if (raw.version === VERSION && raw.topics && typeof raw.topics === 'object') {
      next.skillMastery = raw.skillMastery && typeof raw.skillMastery === 'object' ? raw.skillMastery : {};
      next.lastTopic = typeof raw.lastTopic === 'string' ? raw.lastTopic : null;
      next.lastStep = typeof raw.lastStep === 'string' ? raw.lastStep : null;
      next.favorites = Array.isArray(raw.favorites) ? raw.favorites.filter(function (id) { return typeof id === 'string'; }) : [];
      next.recentTopics = Array.isArray(raw.recentTopics) ? raw.recentTopics.filter(function (id) { return typeof id === 'string'; }).slice(0, 8) : [];
      next.recentFilters = raw.recentFilters && typeof raw.recentFilters === 'object' ? raw.recentFilters : {};
      next.preferences = raw.preferences && typeof raw.preferences === 'object' ? raw.preferences : {};
      Object.keys(raw.topics).forEach(function (id) { next.topics[id] = _normaliseTopic(raw.topics[id]); });
      return next;
    }

    Object.keys(raw).forEach(function (id) {
      if (_isTopicProgress(raw[id])) next.topics[id] = _normaliseTopic(raw[id]);
    });
    return next;
  }

  function _load() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) {}
    _state = _migrate(raw);
    _save();
  }

  function _save() {
    try { localStorage.setItem(KEY, JSON.stringify(_state)); } catch (_) {}
  }

  function _ensure(id) {
    if (!_state.topics[id]) _state.topics[id] = _normaliseTopic(null);
    return _state.topics[id];
  }

  function _recordSkills(skills, correct) {
    (skills || []).forEach(function (skill) {
      if (typeof skill !== 'string' || !skill) return;
      var item = _state.skillMastery[skill] || { attempts: 0, correct: 0 };
      item.attempts++;
      if (correct) item.correct++;
      _state.skillMastery[skill] = item;
    });
  }

  function _rememberTopic(id, step) {
    if (!id) return;
    _state.lastTopic = id;
    _state.lastStep = step || 'concept';
    _state.recentTopics = [id].concat(_state.recentTopics.filter(function (item) { return item !== id; })).slice(0, 8);
    _ensure(id).lastVisited = new Date().toISOString();
    _save();
  }

  function _mastery(id) {
    var topic = _ensure(id);
    if (!topic.practiceCount) return topic.conceptDone ? 'em prática' : 'em introdução';
    var accuracy = topic.practiceCorrect / topic.practiceCount;
    if (topic.practiceCount >= 8 && accuracy >= 0.8) return 'dominado';
    if (topic.practiceCount >= 4 && accuracy >= 0.6) return 'consolidando';
    return 'em prática';
  }

  return {
    init: function () { _load(); },
    markConcept: function (id) { _ensure(id).conceptDone = true; _save(); },
    markExample: function (id) { _ensure(id).exampleDone = true; _save(); },
    recordAttempt: function (id, correct, skills) {
      var topic = _ensure(id);
      topic.practiceCount++;
      if (correct) {
        topic.practiceCorrect++;
        if (topic.practiceCorrect === 5 && !_suppressEvents) {
          try { document.dispatchEvent(new CustomEvent('euclides:topicComplete', { detail: { id: id } })); } catch (_) {}
        }
      }
      _recordSkills(skills && skills.length ? skills : [id], correct);
      _save();
    },
    rememberTopic: _rememberTopic,
    get: function (id) { return _ensure(id); },
    accuracy: function (id) {
      var topic = _ensure(id);
      return topic.practiceCount === 0 ? -1 : Math.round(topic.practiceCorrect / topic.practiceCount * 100);
    },
    mastery: _mastery,
    state: function () { return JSON.parse(JSON.stringify(_state)); },
    isFavorite: function (id) { return _state.favorites.indexOf(id) !== -1; },
    toggleFavorite: function (id) {
      var index = _state.favorites.indexOf(id);
      if (index === -1) _state.favorites.push(id); else _state.favorites.splice(index, 1);
      _save();
      return index === -1;
    },
    setFilters: function (filters) { _state.recentFilters = filters || {}; _save(); },
    getFilters: function () { return _state.recentFilters; },
    setPreference: function (key, value) { _state.preferences[key] = value; _save(); },
    getPreference: function (key, fallback) { return key in _state.preferences ? _state.preferences[key] : fallback; },
    resetProgress: function () {
      var preferences = _state.preferences;
      _state = _emptyState();
      _state.preferences = preferences;
      _save();
    },
    resetAll: function () { _state = _emptyState(); _save(); },
    muteEvents: function () { _suppressEvents = true; },
    unmuteEvents: function () { _suppressEvents = false; },
    isMuted: function () { return _suppressEvents; },
  };
})();
