/**
 * math/generators/calculus_adv.js
 * Calculus, real numbers, nonlinear systems generators.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  // ── File-scoped helpers
  var _calcTypes = ['limit_poly', 'deriv_power', 'deriv_sum', 'integral_power', 'deriv_apply'];


  // ── calculus
  MathGenerators['calculus'] = function _genCalculus(difficulty) {
  _reseed();
  var type = _calcTypes[Math.min(difficulty - 1, _calcTypes.length - 1)];

  if (type === 'limit_poly') {
    var a = _randInt(-5, 5), b = _randInt(-5, 5);
    var xVal = _randInt(-3, 3);
    var result = a * xVal + b;
    var eqStr = (a === 1 ? '' : a === -1 ? '-' : String(a)) + 'x' + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b));
    return {
      statement: 'Calcule lim(x→' + xVal + ') de f(x) = ' + eqStr + '.',
      equation:  'lim(x→' + xVal + ') ' + eqStr,
      answer:    String(result),
      calcType:  'limit', a: a, b: b, xVal: xVal,
      hints: [
        'Para polinômios, substitua diretamente: lim(x→c) f(x) = f(c).',
        'f(' + xVal + ') = ' + a + '×' + xVal + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b)),
        'lim = ' + result,
      ],
    };
  }

  if (type === 'deriv_power') {
    var n = _randInt(2, 6), a = _randInt(-4, 4); while (a === 0) a = _randInt(-4, 4);
    return {
      statement: "Calcule a derivada de f(x) = " + (a === 1 ? '' : a === -1 ? '-' : String(a)) + "x^" + n + ".",
      equation:  "f'(x) = ?",
      answer:    (a*n) + 'x^' + (n-1),
      calcType:  'deriv_power', a: a, n: n,
      hints: [
        "Regra da potência: d/dx(ax^n) = a·n·x^(n-1).",
        "f'(x) = " + a + " × " + n + " × x^" + (n-1),
        "f'(x) = " + (a*n) + "x^" + (n-1),
      ],
    };
  }

  if (type === 'deriv_sum') {
    var a = _randInt(-4, 4); while (a === 0) a = _randInt(-4, 4);
    var b = _randInt(-4, 4); while (b === 0) b = _randInt(-4, 4);
    var c = _randInt(-6, 6);
    var eqStr = (a===1?'':a===-1?'-':String(a))+'x^2' + (b>0?' + '+(b===1?'':b)+'x':' - '+(Math.abs(b)===1?'':Math.abs(b))+'x') + (c>0?' + '+c:c<0?' - '+Math.abs(c):'');
    return {
      statement: "Calcule a derivada de f(x) = " + eqStr + ".",
      equation:  "f'(x) = ?",
      answer:    (2*a)+'x' + (b>0?' + '+b:b<0?' - '+Math.abs(b):''),
      calcType:  'deriv_sum', a: a, b: b, c: c,
      hints: [
        "Derive termo a termo: d/dx(ax²) = 2ax, d/dx(bx) = b, d/dx(c) = 0.",
        "d/dx(" + a + "x²) = " + (2*a) + "x  |  d/dx(" + b + "x) = " + b + "  |  d/dx(" + c + ") = 0",
        "f'(x) = " + (2*a)+'x' + (b>0?' + '+b:b<0?' - '+Math.abs(b):''),
      ],
    };
  }

  if (type === 'integral_power') {
    var n = _randInt(1, 5), a = _randInt(-4, 4); while (a === 0) a = _randInt(-4, 4);
    var num = a, den = n + 1;
    var g   = _gcd(Math.abs(num), den);
    var ansCoef = (num/g === 1 ? '' : num/g === -1 ? '-' : String(num/g)) + (den/g === 1 ? '' : '/' + (den/g));
    return {
      statement: "Calcule ∫" + (a===1?'':a===-1?'-':String(a)) + "x^" + n + " dx.",
      equation:  "∫" + (a===1?'':a===-1?'-':String(a)) + "x^" + n + " dx = ?",
      answer:    ansCoef + 'x^' + (n+1) + ' + C',
      calcType:  'integral_power', a: a, n: n,
      hints: [
        "Regra da potência para integrais: ∫ax^n dx = (a/(n+1))x^(n+1) + C.",
        "∫" + a + "x^" + n + " dx = (" + a + "/" + (n+1) + ")x^" + (n+1) + " + C",
        "= " + ansCoef + "x^" + (n+1) + " + C",
      ],
    };
  }

  // deriv_apply: evaluate derivative at a point
  var a = _randInt(-3, 3); while (a === 0) a = _randInt(-3, 3);
  var n = _randInt(2, 4);
  var xVal = _randInt(-2, 3);
  var derivVal = a * n * Math.pow(xVal, n - 1);
  return {
    statement: "Calcule f'(" + xVal + ") para f(x) = " + (a===1?'':a===-1?'-':String(a)) + "x^" + n + ".",
    equation:  "f'(x) = " + (a*n) + "x^" + (n-1) + "  →  f'(" + xVal + ") = ?",
    answer:    String(derivVal),
    calcType:  'deriv_apply', a: a, n: n, xVal: xVal,
    hints: [
      "Primeiro derive: f'(x) = " + (a*n) + "x^" + (n-1),
      "Substitua x = " + xVal + ": f'(" + xVal + ") = " + (a*n) + " × " + xVal + "^" + (n-1),
      "f'(" + xVal + ") = " + derivVal,
    ],
  };
}

  // ── real_numbers
  MathGenerators['real_numbers'] = function _genRealNumbers(difficulty) {
  _reseed();
  var types = ['classify','sqrt2_proof','density','decimal_rep','operations'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'classify') {
    var nums = [
      { n: '√4', set: 'ℤ ⊂ ℚ ⊂ ℝ', why: '√4=2, inteiro' },
      { n: '√2', set: 'ℝ\ℚ (irracional)', why: 'não é fração p/q' },
      { n: 'π', set: 'ℝ\ℚ (irracional)', why: 'decimal infinito não periódico' },
      { n: '0,333...', set: 'ℚ ⊂ ℝ', why: '= 1/3, racional' },
      { n: '√9', set: 'ℤ ⊂ ℚ ⊂ ℝ', why: '√9=3, inteiro' },
      { n: 'e (de eˣ)', set: 'ℝ\ℚ (irracional)', why: 'transcendente, irracional' },
    ];
    var num = nums[_randInt(0, nums.length - 1)];
    return { statement: 'Em qual(is) conjunto(s) numérico(s) está ' + num.n + '?',
      equation: 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', answer: num.set, realType: 'classify',
      hints: ['Lembre a hierarquia: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.', num.why, num.set] };
  }
  if (type === 'sqrt2_proof') {
    return { statement: 'Qual é a estratégia clássica para provar que √2 é irracional?',
      equation: 'Hipótese: √2 = p/q irredutível',
      answer: 'Redução ao absurdo', realType: 'proof',
      hints: ['Assume-se √2 racional, i.e. √2 = p/q com MDC(p,q)=1.', 'Então 2 = p²/q² → p² = 2q² → p é par → p=2k → q² = 2k² → q é par. Contradição!', 'Redução ao absurdo'] };
  }
  if (type === 'density') {
    var a = _randInt(1, 5), b = a + 1;
    return { statement: 'Cite um número irracional entre ' + a + ' e ' + b + '.',
      equation: a + ' < ? < ' + b,
      answer: '√' + (a*a + 1), realType: 'density',
      hints: ['Raízes de inteiros não quadrados perfeitos são irracionais.', '√' + (a*a+1) + ' ≈ ' + Math.round(Math.sqrt(a*a+1)*100)/100 + ' — está entre ' + a + ' e ' + b + '?', '√' + (a*a+1)] };
  }
  if (type === 'decimal_rep') {
    var types2 = [
      { n: '1/3', dec: '0,333... (periódico simples)', type: 'racional' },
      { n: '√2', dec: '1,41421356... (infinito não periódico)', type: 'irracional' },
      { n: '1/7', dec: '0,142857142857... (periódico composto)', type: 'racional' },
      { n: 'π', dec: '3,14159265... (infinito não periódico)', type: 'irracional' },
    ];
    var t = types2[_randInt(0, types2.length - 1)];
    return { statement: 'Como é a representação decimal de ' + t.n + ' e que tipo de número é?',
      equation: t.n + ' = ?', answer: t.type, realType: 'decimal',
      hints: ['Racionais → decimal finito ou periódico. Irracionais → decimal infinito não periódico.', t.dec, t.type] };
  }
  // operations with irrationals
  var a = _randInt(2, 5);
  return { statement: 'Simplifique: √' + a*a + ' + √' + (a*a) + '.',
    equation: '√' + (a*a) + ' + √' + (a*a),
    answer: String(2*a), realType: 'ops',
    hints: ['√' + (a*a) + ' = ' + a + ' (quadrado perfeito).', a + ' + ' + a, String(2*a)] };
}

  // ── nonlinear
  MathGenerators['nonlinear'] = function _genNonlinear(difficulty) {
  _reseed();
  var types = ['line_parabola','line_circle','subs_method','count_solutions','mixed'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'line_parabola') {
    // y = x² and y = x + 2  → x²-x-2=0 → x=2,x=-1
    var pairs = [
      { line: 'y = x + 2', para: 'y = x²', sols: '(2,4) e (−1,1)' },
      { line: 'y = 2x + 3', para: 'y = x²', sols: '(3,9) e (−1,1)' },
      { line: 'y = x + 6', para: 'y = x²', sols: '(3,9) e (−2,4)' },
    ];
    var p = pairs[_randInt(0, pairs.length - 1)];
    return { statement: 'Resolva o sistema: ' + p.line + '  e  ' + p.para + '.',
      equation: '{' + p.line + ' / {' + p.para,
      answer: p.sols, nlType: 'lp',
      hints: ['Iguale as duas expressões de y.', 'Você obterá uma equação do 2º grau em x.', p.sols] };
  }
  if (type === 'line_circle') {
    // x² + y² = 25 and y = 4  → x² = 9 → x=±3
    var pairs = [
      { circ: 'x² + y² = 25', line: 'y = 4', sols: '(3,4) e (−3,4)' },
      { circ: 'x² + y² = 25', line: 'x = 3', sols: '(3,4) e (3,−4)' },
      { circ: 'x² + y² = 9', line: 'y = 0', sols: '(3,0) e (−3,0)' },
    ];
    var p = pairs[_randInt(0, pairs.length - 1)];
    return { statement: 'Interseções: ' + p.circ + '  e  ' + p.line + '.',
      equation: '{' + p.circ + ' / {' + p.line,
      answer: p.sols, nlType: 'lc',
      hints: ['Substitua a equação da reta na da circunferência.', 'Resolva a equação resultante em x (ou y).', p.sols] };
  }
  if (type === 'subs_method') {
    var a = _randInt(1, 3);
    // y = ax, x²+y²=r², r = a*(smth)
    var x1 = _randInt(2, 4);
    var r2 = x1*x1*(1+a*a);
    return { statement: 'Resolva: x² + y² = ' + r2 + '  e  y = ' + a + 'x.',
      equation: '{x² + y² = ' + r2 + ' / {y = ' + a + 'x',
      answer: '(' + x1 + ',' + a*x1 + ') e (−' + x1 + ',−' + a*x1 + ')', nlType: 'subs',
      hints: ['Substitua y = ' + a + 'x na equação da circunferência.', 'x² + ' + a*a + 'x² = ' + r2 + ' → x² = ' + Math.round(r2/(1+a*a)), '(±' + x1 + ', ±' + a*x1 + ')'] };
  }
  if (type === 'count_solutions') {
    var d = _randInt(0, 2); // 0=nenhuma,1=tangente,2=secante
    var scenarios = [
      { desc: 'reta tangente à parábola y=x²', n: '1 solução (tangente)', d: 0 },
      { desc: 'reta y=−1 e circunferência x²+y²=1', n: '2 soluções', d: 1 },
      { desc: 'reta y=5 e circunferência x²+y²=1', n: '0 soluções (externa)', d: 2 },
    ];
    var s = scenarios[d];
    return { statement: 'Quantas soluções tem o sistema com ' + s.desc + '?',
      equation: 'Análise geométrica', answer: s.n, nlType: 'count',
      hints: ['Pense graficamente: quantas interseções há entre as curvas?', s.desc, s.n] };
  }
  // mixed
  var b = _randInt(1, 5);
  // x+y=b and x*y=b-1
  var disc = b*b - 4*(b-1);
  var x1 = Math.round(((b + Math.sqrt(disc))/2)*100)/100;
  var x2 = Math.round(((b - Math.sqrt(disc))/2)*100)/100;
  if(disc < 0){ b=4; disc=b*b-4*(b-1); x1=3; x2=1; }
  return { statement: 'Resolva: x + y = ' + b + '  e  x × y = ' + (b-1) + '.',
    equation: '{x + y = ' + b + ' / {x × y = ' + (b-1),
    answer: '(' + x1 + ', ' + x2 + ') ou (' + x2 + ', ' + x1 + ')', nlType: 'mixed',
    hints: ['y = ' + b + ' − x. Substitua em xy = ' + (b-1) + '.', 'Você obterá: x(' + b + '−x) = ' + (b-1) + ' → equação 2º grau.', '(' + x1 + ',' + x2 + ')'] };
}

})();
