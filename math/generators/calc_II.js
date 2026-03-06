/**
 * math/generators/calc_II.js
 * Cálculo II: integrais, integrais definidas, séries e convergência.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  // ── integrals ────────────────────────────────────────────────────────────
  MathGenerators['integrals'] = function (difficulty) {
    _reseed();
    var types = ['poly_antideriv', 'u_sub', 'by_parts', 'partial_frac', 'trig_int'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'poly_antideriv') {
      var a = _randInt(1, 5), n = _randInt(1, 4), b = _randInt(-4, 4);
      var denom = n + 1;
      var ans = a + '/' + denom + ' x^' + denom + ' + ' + b + 'x + C';
      return {
        statement: 'Calcule: ∫(' + a + 'x^' + n + ' + ' + b + ') dx.',
        equation:  '∫(' + a + 'x^' + n + ' + ' + b + ') dx',
        answer:    ans,
        hints: ['Regra da potência: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C.',
                '∫' + a + 'x^' + n + ' dx = ' + a + 'x^' + denom + '/' + denom,
                ans]
      };
    }
    if (type === 'u_sub') {
      // ∫(ax+b)^n dx: u = ax+b, du = a dx
      var a = _randInt(1, 4), b = _randInt(-3, 3), n = _randInt(2, 5);
      var coef = Math.round(1 / (a * (n + 1)) * 100) / 100;
      var ans = '1/' + (a * (n + 1)) + ' · ('+a+'x+'+b+')^'+(n+1)+' + C';
      return {
        statement: 'Calcule por substituição: ∫(' + a + 'x + ' + b + ')^' + n + ' dx.',
        equation:  '∫(' + a + 'x + ' + b + ')^' + n + ' dx',
        answer:    ans,
        hints: ['u = ' + a + 'x + ' + b + ',  du = ' + a + ' dx  →  dx = du/' + a,
                '∫u^' + n + '/'+a+' du = u^'+(n+1)+'/'+(a*(n+1))+' + C',
                ans]
      };
    }
    if (type === 'by_parts') {
      // ∫x·e^x dx = xe^x - e^x + C
      var a = _randInt(1, 3);
      var ans = 'x·e^(' + a + 'x)/' + a + ' − e^(' + a + 'x)/' + (a*a) + ' + C';
      return {
        statement: 'Calcule por partes: ∫x·e^(' + a + 'x) dx.',
        equation:  '∫x·e^(' + a + 'x) dx',
        answer:    ans,
        hints: ['Partes: u=x, dv=e^('+a+'x)dx → du=dx, v=e^('+a+'x)/'+a+'.',
                '∫x·e^('+a+'x)dx = x·e^('+a+'x)/'+a+' − ∫e^('+a+'x)/'+a+' dx',
                ans]
      };
    }
    if (type === 'partial_frac') {
      // ∫1/(x(x+a)) dx = (1/a)ln|x| - (1/a)ln|x+a| + C
      var a = _randInt(1, 4);
      var ans = '1/' + a + ' ln|x| − 1/' + a + ' ln|x+' + a + '| + C';
      return {
        statement: 'Frações parciais: ∫1/(x(x+' + a + ')) dx.',
        equation:  '∫1/(x(x+' + a + ')) dx',
        answer:    ans,
        hints: ['1/(x(x+'+a+')) = A/x + B/(x+'+a+'). Ache A,B.',
                'A·(x+'+a+') + B·x = 1  →  A=1/'+a+', B=−1/'+a+'.',
                ans]
      };
    }
    // trig: ∫sin(ax)dx = -cos(ax)/a + C
    var a = _randInt(1, 5);
    var ans = '−cos(' + a + 'x)/' + a + ' + C';
    return {
      statement: 'Calcule: ∫sen(' + a + 'x) dx.',
      equation:  '∫sen(' + a + 'x) dx',
      answer:    ans,
      hints: ['∫sen(ax)dx = −cos(ax)/a + C.',
              'Derivada de −cos('+a+'x)/'+a+' = sen('+a+'x). ✓',
              ans]
    };
  };

  // ── definite_integrals ───────────────────────────────────────────────────
  MathGenerators['definite_integrals'] = function (difficulty) {
    _reseed();
    var types = ['poly_def', 'ftc_apply', 'area_between', 'trig_def', 'volume_rev'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'poly_def') {
      var a = _randInt(1, 4), n = _randInt(1, 3), lo = 0, hi = _randInt(1, 4);
      // ∫[0,hi] a·xⁿ = a·hi^(n+1)/(n+1)
      var ans = Math.round(a * Math.pow(hi, n+1) / (n+1) * 100) / 100;
      return {
        statement: 'Calcule: ∫₀^' + hi + ' ' + a + 'x^' + n + ' dx.',
        equation:  '∫₀^' + hi + ' ' + a + 'x^' + n + ' dx',
        answer:    String(ans),
        hints: ['Antiderivada: F(x) = ' + a + 'x^'+(n+1)+'/'+(n+1),
                'F(' + hi + ') − F(0) = ' + a + '·' + hi + '^' + (n+1) + '/' + (n+1),
                String(ans)]
      };
    }
    if (type === 'ftc_apply') {
      // TFC: d/dx ∫[0,x] t³ dt = x³
      var n = _randInt(2, 4);
      return {
        statement: 'TFC: d/dx [∫₀^x t^' + n + ' dt] = ?',
        equation:  'd/dx ∫₀^x t^' + n + ' dt',
        answer:    'x^' + n,
        hints: ['Teorema Fundamental do Cálculo Parte 1: d/dx ∫₀^x f(t)dt = f(x).',
                'Aqui f(t) = t^' + n + '.',
                'x^' + n]
      };
    }
    if (type === 'area_between') {
      // Area between y=x² and y=x: from 0 to 1 = 1/2 - 1/3 = 1/6
      var a = _randInt(1, 3);
      // y=ax and y=x²: intersect at x=0 and x=a
      // Area = ∫[0,a] (ax - x²)dx = a·a²/2 - a³/3 = a³/6
      var ans = Math.round(Math.pow(a, 3) / 6 * 100) / 100;
      return {
        statement: 'Área entre y = ' + a + 'x e y = x² (de x=0 a x=' + a + ').',
        equation:  '∫₀^' + a + ' (' + a + 'x − x²) dx',
        answer:    String(ans) + ' u²',
        hints: ['A curva superior é y='+a+'x; inferior é y=x² (para 0≤x≤'+a+').',
                '∫₀^'+a+' ('+a+'x−x²)dx = '+a+'·'+a+'²/2 − '+a+'³/3.',
                String(ans) + ' u²']
      };
    }
    if (type === 'trig_def') {
      // ∫[0,π] sin(x) dx = 2
      return {
        statement: 'Calcule: ∫₀^π sen(x) dx.',
        equation:  '∫₀^π sen(x) dx',
        answer:    '2',
        hints: ['Antiderivada de sen(x) = −cos(x).',
                '[−cos(x)]₀^π = −cos(π) − (−cos(0)) = −(−1) + 1 = 2.',
                '2']
      };
    }
    // volume of revolution: y=√x from 0 to a, around x-axis
    var a = _randInt(1, 4);
    var vol = Math.round(Math.PI * a * a / 2 * 100) / 100;
    return {
      statement: 'Volume de revolução de y=√x, 0≤x≤' + a + ', em torno do eixo x (método dos discos).',
      equation:  'V = π∫₀^' + a + ' x dx',
      answer:    String(vol) + ' ≈ ' + vol + ' u³',
      hints: ['V = π∫[f(x)]²dx = π∫₀^' + a + ' (√x)² dx = π∫₀^' + a + ' x dx.',
              'π·[x²/2]₀^' + a + ' = π·' + a + '²/2.',
              String(vol) + ' u³']
    };
  };

  // ── series_calc ──────────────────────────────────────────────────────────
  MathGenerators['series_calc'] = function (difficulty) {
    _reseed();
    var types = ['geom_conv', 'ratio_test', 'taylor_coef', 'interval_conv', 'maclaurin'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'geom_conv') {
      var r_num = _randInt(1, 3), r_den = _randInt(r_num + 1, 6);
      var r = r_num + '/' + r_den;
      var sum = Math.round(r_den / (r_den - r_num) * 100) / 100;
      return {
        statement: 'Série geométrica com a=1 e r=' + r + '. Converge? Se sim, qual a soma?',
        equation:  'Σ (' + r_num + '/' + r_den + ')ⁿ,  n=0 a ∞',
        answer:    String(sum),
        hints: ['|r| = ' + r + ' < 1 → converge.',
                'S = a/(1−r) = 1/(1−'+r_num+'/'+r_den+') = '+r_den+'/'+(r_den-r_num)+'.',
                String(sum)]
      };
    }
    if (type === 'ratio_test') {
      var n_choice = _randInt(0, 2);
      var series_data = [
        { s: 'Σ n!/nⁿ', ans: 'convergente', reason: 'L = 1/e < 1 (razão)' },
        { s: 'Σ nⁿ/n!', ans: 'divergente',  reason: 'L = e > 1 (razão)' },
        { s: 'Σ 1/n²',  ans: 'convergente', reason: 'p-série com p=2 > 1' },
      ];
      var d = series_data[n_choice];
      return {
        statement: d.s + ': convergente ou divergente?',
        equation:  d.s,
        answer:    d.ans,
        hints: ['Aplique o teste da razão: L = lim |aₙ₊₁/aₙ|.',
                d.reason,
                d.ans]
      };
    }
    if (type === 'taylor_coef') {
      // Coef de x³ em e^x = 1/3! = 1/6
      var n = _randInt(2, 5);
      var fac = [1, 1, 2, 6, 24, 120][n];
      var funcs = [
        { f: 'eˣ',     coef: '1/' + fac },
        { f: 'sen(x)', coef: n % 2 === 0 ? '0' : (n % 4 === 1 ? '1/' + fac : '−1/' + fac) },
        { f: 'cos(x)', coef: n % 2 !== 0 ? '0' : (n % 4 === 0 ? '1/' + fac : '−1/' + fac) },
      ];
      var fn = funcs[_randInt(0, 2)];
      return {
        statement: 'Qual o coeficiente de x^' + n + ' na série de Maclaurin de ' + fn.f + '?',
        equation:  'f(x) = Σ f^(n)(0)/n! · xⁿ',
        answer:    fn.coef,
        hints: ['Coef. de xⁿ = f^(n)(0) / n!.',
                'Para ' + fn.f + ', calcule a n-ésima derivada em x=0.',
                fn.coef]
      };
    }
    if (type === 'interval_conv') {
      var a = _randInt(1, 5);
      // Σ (x/a)^n converges for |x| < a
      return {
        statement: 'Intervalo de convergência de Σ xⁿ/'+Math.pow(a,_randInt(1,2)+1)+' (use teste da razão).',
        equation:  'Σ (x/' + a + ')ⁿ,  n=0 a ∞',
        answer:    '|x| < ' + a,
        hints: ['Teste da razão: L = |x/'+a+'|. Converge quando L < 1.',
                '|x/'+a+'| < 1 → |x| < '+a+'.',
                '|x| < ' + a]
      };
    }
    // Maclaurin: approx e^x ≈ 1 + x + x²/2 + x³/6 at x=1 (2 terms)
    return {
      statement: 'Aproxime e^0.1 usando os 3 primeiros termos de Maclaurin de eˣ.',
      equation:  'eˣ ≈ 1 + x + x²/2',
      answer:    '1.105',
      hints: ['eˣ ≈ 1 + x + x²/2 + ...',
              '1 + 0.1 + 0.01/2 = 1 + 0.1 + 0.005.',
              '1.105']
    };
  };

})();
