/** Loads the exercise generator set only when a screen needs exercises. */
var GeneratorLoader = (function () {
  var _promise = null;
  var FILES = [
    'efI','efII','algebra','functions','geometry','trig','prob','matrices_logic',
    'calculus_adv','calc_I','calc_II','calc_III','lin_alg','ode_prob',
    'numeric_transforms','lin_alg_adv','batch3','batch4'
  ];

  function prepare() {
    if (_promise) return _promise;
    _promise = Promise.all(FILES.map(function (name) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = 'math/generators/' + name + '.js?v=5.0.1';
        script.onload = resolve;
        script.onerror = function () { reject(new Error('Não foi possível preparar os exercícios.')); };
        document.head.appendChild(script);
      });
    })).catch(function (error) {
      _promise = null;
      throw error;
    });
    return _promise;
  }

  return { prepare: prepare, isReady: function () { return !!_promise; } };
})();
