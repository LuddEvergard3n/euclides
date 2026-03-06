/**
 * math/generators/calc_I.js
 * Cálculo I: limites avançados, derivadas, análise de curvas, otimização.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 *
 * Design decisions:
 *   - All answers are numbers or short strings ("crescente", "mínimo local", etc.)
 *   - Exercises are parameterized from small integer sets to guarantee clean answers
 *   - Difficulty 1-2: direct application; 3-4: composed rules; 5: multi-step
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  // ── calc_limits ──────────────────────────────────────────────────────────
  MathGenerators['calc_limits'] = function (difficulty) {
    _reseed();
    var types = ['poly_direct', 'factor_cancel', 'lhopital_0_0', 'lateral', 'infinite'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'poly_direct') {
      var a = _randInt(-4, 4), b = _randInt(1, 5), c = _randInt(-6, 6);
      var ans = a * a + b * a + c;
      return {
        statement: 'Calcule o limite: lim(x→' + a + ') [x² + ' + b + 'x + ' + c + '].',
        equation:  'lim(x→' + a + ') (x² + ' + b + 'x + ' + c + ')',
        answer:    String(ans),
        hints: ['Substituição direta funciona quando o denominador ≠ 0.',
                'f(' + a + ') = ' + a + '² + ' + b + '·' + a + ' + ' + c,
                String(ans)]
      };
    }
    if (type === 'factor_cancel') {
      // lim(x→a) (x²-a²)/(x-a) = 2a
      var a = _randInt(1, 5);
      return {
        statement: 'Calcule: lim(x→' + a + ') (x² − ' + (a*a) + ') / (x − ' + a + ').',
        equation:  'lim(x→' + a + ') (x² − ' + (a*a) + ') / (x − ' + a + ')',
        answer:    String(2 * a),
        hints: ['Fatorize: x² − ' + (a*a) + ' = (x−' + a + ')(x+' + a + ').',
                'Cancele o fator (x−' + a + ') presente no numerador e denominador.',
                'Limite = x + ' + a + ' avaliado em x = ' + a + ' = ' + (2*a)]
      };
    }
    if (type === 'lhopital_0_0') {
      // lim(x→0) sin(ax)/x = a  (use linear approx)
      var a = _randInt(1, 4);
      return {
        statement: 'Use L\'Hôpital: lim(x→0) sen(' + a + 'x) / x.',
        equation:  'lim(x→0) sen(' + a + 'x) / x  [forma 0/0]',
        answer:    String(a),
        hints: ['Forma 0/0 → derivar numerador e denominador separadamente.',
                'Num: d/dx [sen(' + a + 'x)] = ' + a + 'cos(' + a + 'x). Den: d/dx [x] = 1.',
                'lim(x→0) ' + a + 'cos(' + a + 'x) / 1 = ' + a]
      };
    }
    if (type === 'lateral') {
      var a = _randInt(-3, 3);
      // lim x→a+ |x-a|/(x-a) = 1
      return {
        statement: 'Calcule o limite lateral: lim(x→' + a + '⁺) |x − ' + a + '| / (x − ' + a + ').',
        equation:  'lim(x→' + a + '⁺) |x − ' + a + '| / (x − ' + a + ')',
        answer:    '1',
        hints: ['Para x→' + a + '⁺: x > ' + a + ', logo x − ' + a + ' > 0.',
                '|x − ' + a + '| = x − ' + a + ' (positivo pela direita).',
                '(x − ' + a + ')/(x − ' + a + ') = 1']
      };
    }
    // infinite: lim(x→∞) (ax²+b)/(cx²+d)
    var a = _randInt(1, 5), c = _randInt(1, 5), b = _randInt(-4, 4), d = _randInt(-4, 4);
    var numAns = a + '/' + c;
    return {
      statement: 'Calcule: lim(x→+∞) (' + a + 'x² + ' + b + ') / (' + c + 'x² + ' + d + ').',
      equation:  'lim(x→∞) (' + a + 'x² + ' + b + ') / (' + c + 'x² + ' + d + ')',
      answer:    numAns,
      hints: ['Divida todos os termos por x² (o maior grau no denominador).',
              'Termos b/x² e d/x² → 0. Restam ' + a + '/' + c + '.',
              numAns]
    };
  };

  // ── derivatives ─────────────────────────────────────────────────────────
  MathGenerators['derivatives'] = function (difficulty) {
    _reseed();
    var types = ['power_eval', 'product', 'quotient', 'chain', 'implicit_eval'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'power_eval') {
      var n = _randInt(2, 5), a = _randInt(-3, 4), c = _randInt(1, 6);
      // f(x) = ax^n + c  →  f'(x) = a*n*x^(n-1)
      var xval = _randInt(-2, 3);
      var fprime_at = a * n * Math.pow(xval, n - 1) + 0; // c disappears
      return {
        statement: 'Derive f(x) = ' + a + 'x^' + n + ' + ' + c + ' e calcule f\'(' + xval + ').',
        equation:  'f(x) = ' + a + 'x^' + n + ' + ' + c,
        answer:    String(fprime_at),
        hints: ['Regra da potência: d/dx[xⁿ] = nxⁿ⁻¹. Constante → 0.',
                'f\'(x) = ' + (a * n) + 'x^' + (n - 1),
                'f\'(' + xval + ') = ' + (a * n) + '·' + xval + '^' + (n-1) + ' = ' + fprime_at]
      };
    }
    if (type === 'product') {
      // f = x^a * (x + b)  →  f' = a*x^(a-1)*(x+b) + x^a
      var a = _randInt(2, 4), b = _randInt(-4, 4), xval = _randInt(-2, 3);
      var fpa = a * Math.pow(xval, a-1) * (xval + b) + Math.pow(xval, a);
      return {
        statement: 'Derive f(x) = x^' + a + '·(x + ' + b + ') e calcule f\'(' + xval + ').',
        equation:  'f(x) = x^' + a + '·(x + ' + b + ')',
        answer:    String(fpa),
        hints: ['Regra do produto: (u·v)\' = u\'v + uv\'.',
                'u = x^' + a + ', v = x+' + b + ' → u\' = ' + a + 'x^' + (a-1) + ', v\' = 1.',
                'f\'(' + xval + ') = ' + a + '·' + xval + '^' + (a-1) + '·' + (xval+b) + ' + ' + xval + '^' + a + ' = ' + fpa]
      };
    }
    if (type === 'quotient') {
      // f = (ax + b)/(cx + d)  →  f' = (a(cx+d) - c(ax+b))/(cx+d)²
      var a = _randInt(1, 4), b = _randInt(-3, 3), c = _randInt(1, 3), d = _randInt(1, 4);
      // f'(x) = (ad - bc)/(cx+d)²
      var num = a * d - b * c;
      var xval = _randInt(0, 3);
      var denom = (c * xval + d) * (c * xval + d);
      var ans = num + '/' + denom;
      return {
        statement: 'Derive f(x) = (' + a + 'x + ' + b + ')/(' + c + 'x + ' + d + ') e calcule f\'(' + xval + ').',
        equation:  'f(x) = (' + a + 'x + ' + b + ') / (' + c + 'x + ' + d + ')',
        answer:    ans,
        hints: ['Regra do quociente: (u/v)\' = (u\'v − uv\') / v².',
                'f\'(x) = (' + a + '·(' + c + 'x+' + d + ') − ' + c + '·(' + a + 'x+' + b + ')) / (' + c + 'x+' + d + ')² = ' + num + '/(' + c + 'x+' + d + ')²',
                ans]
      };
    }
    if (type === 'chain') {
      // f = (ax + b)^n  →  f' = na(ax+b)^(n-1)
      var a = _randInt(1, 3), b = _randInt(-4, 4), n = _randInt(2, 4), xval = _randInt(-1, 3);
      var inner = a * xval + b;
      var fprime = n * a * Math.pow(inner, n - 1);
      return {
        statement: 'Derive f(x) = (' + a + 'x + ' + b + ')^' + n + ' e calcule f\'(' + xval + ').',
        equation:  'f(x) = (' + a + 'x + ' + b + ')^' + n,
        answer:    String(fprime),
        hints: ['Regra da cadeia: d/dx[g(h(x))] = g\'(h(x))·h\'(x).',
                'f\'(x) = ' + n + '·(' + a + 'x+' + b + ')^' + (n-1) + '·' + a,
                'f\'(' + xval + ') = ' + n + '·' + inner + '^' + (n-1) + '·' + a + ' = ' + fprime]
      };
    }
    // implicit: x² + y² = r²  →  dy/dx = -x/y  at (x₀,y₀)
    var r = _randInt(3, 6), x0 = _randInt(1, r - 1);
    var y0sq = r * r - x0 * x0;
    var y0 = Math.round(Math.sqrt(y0sq));
    if (y0 * y0 !== y0sq) { x0 = 3; y0 = 4; } // fallback to Pythagorean triple
    return {
      statement: 'Diferenciação implícita: x² + y² = ' + (x0*x0 + y0*y0) + '. Calcule dy/dx em (' + x0 + ', ' + y0 + ').',
      equation:  'x² + y² = ' + (x0*x0 + y0*y0),
      answer:    '-' + x0 + '/' + y0,
      hints: ['Derive ambos os lados em relação a x: 2x + 2y·(dy/dx) = 0.',
              'Isole: dy/dx = −x/y.',
              'Em (' + x0 + ',' + y0 + '): dy/dx = −' + x0 + '/' + y0]
    };
  };

  // ── curve_analysis ──────────────────────────────────────────────────────
  MathGenerators['curve_analysis'] = function (difficulty) {
    _reseed();
    var types = ['monotone_interval', 'critical_classify', 'concavity', 'inflection', 'full_analysis'];
    var type  = types[Math.min(difficulty - 1, 4)];

    // f(x) = x³ − 3ax² + b  (template with clean roots)
    var a = _randInt(1, 4), b = _randInt(-8, 8);

    if (type === 'monotone_interval') {
      // f(x) = x² - 2ax  → f'=0 at x=a; decreasing (-∞,a), increasing (a,+∞)
      return {
        statement: 'f(x) = x² − ' + (2*a) + 'x + ' + b + '. Em qual intervalo f é crescente?',
        equation:  'f\'(x) = 2x − ' + (2*a),
        answer:    '(' + a + ', +∞)',
        hints: ['Calcule f\'(x) e ache onde f\'(x) > 0.',
                'f\'(x) = 2x − ' + (2*a) + ' > 0 → x > ' + a + '.',
                '(' + a + ', +∞)']
      };
    }
    if (type === 'critical_classify') {
      // f = x³ - 3x  →  f'=3x²-3=0 → x=±1; f''=6x; f''(1)=6>0 mín; f''(-1)=-6<0 máx
      var k = _randInt(1, 3);
      var xmin = k, xmax = -k;
      return {
        statement: 'f(x) = x³ − ' + (3*k*k) + 'x. Classifique os pontos críticos.',
        equation:  'f\'(x) = 3x² − ' + (3*k*k),
        answer:    'x=' + xmax + ' máximo local; x=' + xmin + ' mínimo local',
        hints: ['f\'(x) = 0 → x = ±' + k + '. Use f\'\'(x) = 6x para classificar.',
                'f\'\'(' + k + ') = ' + (6*k) + ' > 0 → mínimo. f\'\'(−' + k + ') = ' + (-6*k) + ' < 0 → máximo.',
                'x=' + xmax + ' máximo local; x=' + xmin + ' mínimo local']
      };
    }
    if (type === 'concavity') {
      // f = x³ + ax²  →  f'' = 6x + 2a; concave up when x > -a/3
      return {
        statement: 'f(x) = x³ + ' + a + 'x². Em que intervalo f é côncava para cima?',
        equation:  'f\'\'(x) = 6x + ' + (2*a),
        answer:    '(−' + Math.round(a/3*10)/10 + ', +∞)',
        hints: ['Côncava para cima: f\'\'(x) > 0.',
                'f\'\'(x) = 6x + ' + (2*a) + ' > 0 → x > −' + a + '/3.',
                '(−' + Math.round(a/3*10)/10 + ', +∞)']
      };
    }
    if (type === 'inflection') {
      // f = x³ − 3ax  →  f'' = 6x − 0 = 6x; inflection at x=0
      var xI = _randInt(-3, 3);
      // f = (x - xI)³  →  f'' = 6(x - xI) = 0 at x = xI
      return {
        statement: 'f(x) = (x − ' + xI + ')³. Ache o ponto de inflexão.',
        equation:  'f\'\'(x) = 6(x − ' + xI + ')',
        answer:    'x = ' + xI,
        hints: ['Ponto de inflexão: f\'\'(x) = 0 e troca de sinal.',
                'f\'(x) = 3(x−' + xI + ')², f\'\'(x) = 6(x−' + xI + ') = 0 → x = ' + xI + '.',
                'x = ' + xI]
      };
    }
    // full: monotone + concavity + inflection for f = x³ - 3x
    return {
      statement: 'f(x) = x³ − 3x. Ache: pontos críticos, classificação e inflexão.',
      equation:  'f\'(x) = 3x² − 3  |  f\'\'(x) = 6x',
      answer:    'mín x=1, máx x=−1, inflexão x=0',
      hints: ['f\'=0: x=±1. f\'\'(1)=6>0 → mín. f\'\'(−1)=−6<0 → máx.',
              'Inflexão: f\'\'=0 → x=0.',
              'mín x=1, máx x=−1, inflexão x=0']
    };
  };

  // ── optimization ────────────────────────────────────────────────────────
  MathGenerators['optimization'] = function (difficulty) {
    _reseed();
    var types = ['area_max', 'fence_min', 'box_volume', 'revenue_max', 'distance_min'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'area_max') {
      var P = _randInt(4, 12) * 2; // perimeter
      // Rectangle with fixed perimeter P: A = x(P/2 - x), max at x = P/4
      var xopt = P / 4;
      return {
        statement: 'Retângulo com perímetro fixo ' + P + ' m. Qual largura maximiza a área?',
        equation:  'A(x) = x·(' + (P/2) + ' − x)',
        answer:    String(xopt) + ' m',
        hints: ['Com perímetro P, o lado y = ' + (P/2) + ' − x.',
                'A(x) = x(' + (P/2) + '−x). A\'(x) = ' + P/2 + ' − 2x = 0.',
                'x = ' + xopt + ' m (quadrado maximiza área)']
      };
    }
    if (type === 'fence_min') {
      var A = _randInt(2, 8) * 100; // area to enclose
      // 3-sided fence (wall on one side): A = x·y, cost = x + 2y
      // Minimize C = x + 2(A/x). C' = 1 - 2A/x² = 0 → x = sqrt(2A)
      var xopt = Math.round(Math.sqrt(2 * A));
      return {
        statement: 'Cercar área de ' + A + ' m² com 3 lados (parede no 4º). Minimize o comprimento total de cerca. Qual o valor de x (lado paralelo à parede)?',
        equation:  'C(x) = x + 2A/x  onde A = ' + A,
        answer:    String(xopt) + ' m',
        hints: ['C(x) = x + 2·' + A + '/x. Derive e iguale a zero.',
                'C\'(x) = 1 − ' + (2*A) + '/x² = 0 → x² = ' + (2*A) + '.',
                'x = √' + (2*A) + ' ≈ ' + xopt + ' m']
      };
    }
    if (type === 'box_volume') {
      var L = _randInt(3, 8) * 4; // side of square sheet
      // Volume = x(L-2x)². V' = (L-2x)²+ x·2(L-2x)(-2) = (L-2x)(L-6x) = 0
      // x = L/6
      var xopt = Math.round(L / 6 * 100) / 100;
      return {
        statement: 'Caixa sem tampa: folha quadrada ' + L + '×' + L + ' cm. Quadrados de lado x cortados nos cantos. Qual x maximiza o volume?',
        equation:  'V(x) = x·(' + L + '−2x)²',
        answer:    String(xopt) + ' cm',
        hints: ['V\'(x) = (' + L + '−2x)² + x·2(' + L + '−2x)·(−2) = (' + L + '−2x)(' + L + '−6x).',
                'V\'=0 → x=' + L + '/2 (inválido) ou x=' + L + '/6.',
                'x = ' + L + '/6 = ' + xopt + ' cm']
      };
    }
    if (type === 'revenue_max') {
      var p0 = _randInt(5, 12) * 10; // base price
      var q0 = _randInt(4, 8) * 100; // demand at p0
      var slope = _randInt(2, 5) * 10; // units dropped per $ increase
      // q(x) = q0 - slope*x  where x = price increase
      // R = (p0+x)(q0-slope*x). R' = q0 - slope*x + (p0+x)(-slope) = 0
      // q0 - 2*slope*x - slope*p0 = 0 → x = (q0-slope*p0)/(2*slope)
      var xopt = Math.round((q0 - slope * p0) / (2 * slope));
      var popt = p0 + xopt;
      return {
        statement: 'Preço base: R$' + p0 + ', demanda: ' + q0 + ' unid. Para cada R$1 de aumento, vende ' + slope + ' a menos. Qual preço maximiza a receita?',
        equation:  'R(x) = (p₀+x)(q₀−' + slope + 'x)',
        answer:    'R$' + popt,
        hints: ['R(x) = (' + p0 + '+x)(' + q0 + '−' + slope + 'x). Expanda e derive.',
                'R\'(x) = 0 → x = (' + q0 + ' − ' + slope + '·' + p0 + ')/(2·' + slope + ') = ' + xopt + '.',
                'R$' + popt]
      };
    }
    // distance: closest point on line y=ax+b to origin
    var a = _randInt(1, 3), b = _randInt(2, 6);
    // d²= x² + (ax+b)² → minimize: 2x + 2(ax+b)a = 0 → x(1+a²) = -ab → x = -ab/(1+a²)
    var xopt = -a * b / (1 + a * a);
    xopt = Math.round(xopt * 100) / 100;
    var yopt = Math.round((a * xopt + b) * 100) / 100;
    return {
      statement: 'Ache o ponto da reta y = ' + a + 'x + ' + b + ' mais próximo da origem.',
      equation:  'd²(x) = x² + (' + a + 'x + ' + b + ')²',
      answer:    '(' + xopt + ', ' + yopt + ')',
      hints: ['Minimize d²(x) = x² + (' + a + 'x+' + b + ')².',
              'D\'(x) = 2x + 2(' + a + 'x+' + b + ')·' + a + ' = 0 → x = −' + a + 'b/(1+' + a + '²).',
              '(' + xopt + ', ' + yopt + ')']
    };
  };

})();
