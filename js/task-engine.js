/**
 * task-engine.js
 * Normalises legacy generated exercises into the Euclides 5 task contract.
 */

var TaskEngine = (function () {
  var _counter = 0;

  function _inferType(answer) {
    var value = String(answer === undefined ? '' : answer).trim();
    if (/\bou\b/i.test(value)) return 'multiple-answer';
    if (/^[+-]?\d+\s*\/\s*\d+$/.test(value)) return 'fraction';
    if (/^[\[(].+,.+[\])]$/.test(value)) return 'interval-or-pair';
    if (/^-?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?%$/i.test(value)) return 'percentage';
    if (/^-?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(value)) return 'number';
    return 'symbolic';
  }

  function normalise(exercise, topicId, difficulty) {
    exercise = exercise || {};
    var hints = Array.isArray(exercise.hints) ? exercise.hints.slice() : [];
    return Object.assign({}, exercise, {
      id: exercise.id || topicId + '-' + (++_counter),
      type: exercise.type || _inferType(exercise.answer),
      prompt: exercise.prompt || exercise.statement || '',
      data: exercise.data || {},
      answer: exercise.answer === undefined ? '' : exercise.answer,
      validation: exercise.validation || null,
      difficulty: difficulty || exercise.difficulty || 1,
      skills: Array.isArray(exercise.skills) ? exercise.skills : [topicId],
      misconceptionId: exercise.misconceptionId || null,
      hintSteps: Array.isArray(exercise.hintSteps) ? exercise.hintSteps : hints,
      solutionSteps: Array.isArray(exercise.solutionSteps) ? exercise.solutionSteps : (Array.isArray(exercise.steps) ? exercise.steps : []),
      hints: hints,
    });
  }

  return { normalise: normalise, inferType: _inferType };
})();
