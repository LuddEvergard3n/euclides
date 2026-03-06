/**
 * math/generators/numeric_transforms.js
 * Generators: Cálculo Numérico (Newton-Raphson, integração numérica, Euler)
 *             + Transformadas (Laplace, Fourier)
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  function _round(v, dec) {
    var f = Math.pow(10, dec);
    return Math.round(v * f) / f;
  }

  // ── newton_raphson ────────────────────────────────────────────────
  MathGenerators['newton_raphson'] = function (difficulty) {
    _reseed();
    // f(x) = xⁿ − c  →  root = c^(1/n), easy to verify
    var cases = [
      { f:'x² − 2', fp:'2x', x0:1,   root:_round(Math.sqrt(2),4),   n:2, c:2  },
      { f:'x² − 3', fp:'2x', x0:2,   root:_round(Math.sqrt(3),4),   n:2, c:3  },
      { f:'x³ − 8', fp:'3x²',x0:3,   root:2,                         n:3, c:8  },
      { f:'x³ − 27',fp:'3x²',x0:4,   root:3,                         n:3, c:27 },
      { f:'x⁴ − 16',fp:'4x³',x0:3,   root:2,                         n:4, c:16 },
    ];
    var cas = cases[Math.min(difficulty - 1, cases.length - 1)];

    // Simulate one Newton step from x0
    function evalPoly(x, n, c) { return Math.pow(x, n) - c; }
    function evalDeriv(x, n)   { return n * Math.pow(x, n - 1); }

    var x0 = cas.x0;
    var x1 = _round(x0 - evalPoly(x0, cas.n, cas.c) / evalDeriv(x0, cas.n), 4);
    var x2 = _round(x1 - evalPoly(x1, cas.n, cas.c) / evalDeriv(x1, cas.n), 4);

    var types = ['one_step','two_steps','root','formula','convergence'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'one_step') {
      return {
        statement: 'Aplique uma iteração do método de Newton-Raphson para f(x)=' + cas.f + ' a partir de x₀=' + x0 + '.',
        equation:  'x₁ = x₀ − f(x₀)/f\'(x₀)',
        answer:    String(x1),
        hints: [
          'f\'(x) = ' + cas.fp,
          'f(x₀) = ' + _round(evalPoly(x0, cas.n, cas.c), 4),
          'x₁ = ' + x0 + ' − ' + _round(evalPoly(x0, cas.n, cas.c), 4) + '/' + _round(evalDeriv(x0, cas.n), 4),
        ],
      };
    }
    if (type === 'two_steps') {
      return {
        statement: 'Realize duas iterações de Newton-Raphson para f(x)=' + cas.f + ', x₀=' + x0 + '. Qual é x₂?',
        equation:  'xₙ₊₁ = xₙ − f(xₙ)/f\'(xₙ)',
        answer:    String(x2),
        hints: [
          'x₁ = ' + x1,
          'f(x₁) = ' + _round(evalPoly(x1, cas.n, cas.c), 6),
          'x₂ = x₁ − f(x₁)/f\'(x₁)',
        ],
      };
    }
    if (type === 'root') {
      return {
        statement: 'Use Newton-Raphson para aproximar a raiz de f(x)=' + cas.f + '. Após convergência, qual é a raiz (4 casas)?',
        equation:  'f(x) = ' + cas.f + ' = 0',
        answer:    String(cas.root),
        hints: [
          'A raiz é ' + cas.c + '^(1/' + cas.n + ')',
          'x₁ após x₀=' + x0 + ': ' + x1,
          'Raiz exata: ' + cas.root,
        ],
      };
    }
    if (type === 'formula') {
      return {
        statement: 'Escreva a fórmula de Newton-Raphson para f(x)=' + cas.f + '.',
        equation:  'xₙ₊₁ = xₙ − f(xₙ)/f\'(xₙ)',
        answer:    'xₙ₊₁ = xₙ − (' + cas.f + ')/(' + cas.fp + ')',
        hints: [
          'f\'(x) = ' + cas.fp,
          'Substitua f e f\' na fórmula geral',
        ],
      };
    }
    // convergence
    return {
      statement: 'Newton-Raphson tem convergência de ordem __ para raízes simples.',
      equation:  'eₙ₊₁ ≈ C·eₙ²',
      answer:    '2',
      hints: ['O erro da iteração n+1 é proporcional ao quadrado do erro da iteração n.'],
    };
  };

  // ── numeric_integ ─────────────────────────────────────────────────
  MathGenerators['numeric_integ'] = function (difficulty) {
    _reseed();
    // Integrate f on [a,b] with n subintervals using trapezoid or Simpson
    // Use simple polynomials so exact answer is known
    var cases = [
      // {f, a, b, n, trap, simp, label}
      { label:'∫₀¹ x² dx', a:0, b:1, n:4,
        exact:_round(1/3,4),
        trap:_round((1/4)*((0+1)/2 + 0.0625 + 0.25 + 0.5625),4),
        simp:_round((1/12)*(0+4*0.0625+2*0.25+4*0.5625+1),4) },
      { label:'∫₀² x³ dx', a:0, b:2, n:4,
        exact:4,
        trap:_round((2/4)*((0+8)/2+0.125+1+3.375),4),
        simp:_round((2/12)*(0+4*0.125+2*1+4*3.375+8),4) },
      { label:'∫₁³ 1/x dx', a:1, b:3, n:4,
        exact:_round(Math.log(3),4),
        trap:_round((2/4)*((1+1/3)/2+1/1.5+1/2+1/2.5),4),
        simp:_round((2/12)*(1+4/1.5+2/2+4/2.5+1/3),4) },
      { label:'∫₀¹ eˣ dx', a:0, b:1, n:4,
        exact:_round(Math.E-1,4),
        trap:_round((1/4)*((1+Math.E)/2+Math.exp(0.25)+Math.exp(0.5)+Math.exp(0.75)),4),
        simp:_round((1/12)*(1+4*Math.exp(0.25)+2*Math.exp(0.5)+4*Math.exp(0.75)+Math.E),4) },
      { label:'∫₀π sin(x) dx', a:0, b:Math.PI, n:4,
        exact:2,
        trap:_round((Math.PI/4)*((0+0)/2+Math.sin(Math.PI/4)+Math.sin(Math.PI/2)+Math.sin(3*Math.PI/4)),4),
        simp:_round((Math.PI/12)*(0+4*Math.sin(Math.PI/4)+2*Math.sin(Math.PI/2)+4*Math.sin(3*Math.PI/4)+0),4) },
    ];
    var cas = cases[Math.min(difficulty - 1, cases.length - 1)];

    var methods = ['trap_value','simp_value','exact','error_trap','compare'];
    var method  = methods[Math.min(difficulty - 1, 4)];

    if (method === 'trap_value') {
      return {
        statement: 'Aproxime ' + cas.label + ' pelo método do trapézio com n=4.',
        equation:  'T = (h/2)[f(x₀)+2f(x₁)+...+2f(xₙ₋₁)+f(xₙ)]',
        answer:    String(cas.trap),
        hints: [
          'h = (' + cas.b + '−' + cas.a + ')/4 = ' + _round((cas.b-cas.a)/4,4),
          'Avalie f nos 5 pontos igualmente espaçados',
          'T = (h/2)(f₀+2f₁+2f₂+2f₃+f₄)',
        ],
      };
    }
    if (method === 'simp_value') {
      return {
        statement: 'Aproxime ' + cas.label + ' pela regra de Simpson 1/3 com n=4.',
        equation:  'S = (h/3)[f₀+4f₁+2f₂+4f₃+f₄]',
        answer:    String(cas.simp),
        hints: [
          'h = ' + _round((cas.b-cas.a)/4,4),
          'Padrão de coeficientes: 1, 4, 2, 4, 1',
          'S = (h/3)(f₀+4f₁+2f₂+4f₃+f₄)',
        ],
      };
    }
    if (method === 'exact') {
      return {
        statement: 'Calcule o valor exato de ' + cas.label + '.',
        equation:  cas.label,
        answer:    String(cas.exact),
        hints: ['Use o TFC II: F(b)−F(a)'],
      };
    }
    if (method === 'error_trap') {
      var err = _round(Math.abs(cas.trap - cas.exact), 4);
      return {
        statement: 'Qual o erro absoluto da regra do trapézio (n=4) para ' + cas.label + '?',
        equation:  'Erro = |T − valor exato|',
        answer:    String(err),
        hints: [
          'T = ' + cas.trap,
          'Valor exato = ' + cas.exact,
          '|' + cas.trap + ' − ' + cas.exact + '|',
        ],
      };
    }
    // compare
    var errT = _round(Math.abs(cas.trap - cas.exact), 4);
    var errS = _round(Math.abs(cas.simp - cas.exact), 4);
    var melhor = errS < errT ? 'Simpson' : 'Trapézio';
    return {
      statement: 'Para ' + cas.label + ' com n=4, qual método é mais preciso: Trapézio ou Simpson?',
      equation:  'Erro T=' + errT + ' | Erro S=' + errS,
      answer:    melhor,
      hints: [
        'T = ' + cas.trap + ', exato = ' + cas.exact,
        'S = ' + cas.simp,
        'Compare os erros absolutos',
      ],
    };
  };

  // ── euler_method ──────────────────────────────────────────────────
  MathGenerators['euler_method'] = function (difficulty) {
    _reseed();
    // y' = f(x,y), y(x0)=y0, step h, n steps
    var cases = [
      { eq:"y' = x",        f:function(x,y){return x;},    x0:0, y0:1, h:0.2, n:2,
        exact:function(x){return 1+x*x/2;} },
      { eq:"y' = y",        f:function(x,y){return y;},    x0:0, y0:1, h:0.1, n:3,
        exact:function(x){return Math.exp(x);} },
      { eq:"y' = x+y",      f:function(x,y){return x+y;}, x0:0, y0:1, h:0.1, n:3,
        exact:function(x){return 2*Math.exp(x)-x-1;} },
      { eq:"y' = −y",       f:function(x,y){return -y;},  x0:0, y0:2, h:0.1, n:4,
        exact:function(x){return 2*Math.exp(-x);} },
      { eq:"y' = x²+y",     f:function(x,y){return x*x+y;},x0:0,y0:1,h:0.1,n:3,
        exact:null },
    ];
    var cas = cases[Math.min(difficulty - 1, cases.length - 1)];

    // Run Euler
    var xs = [cas.x0], ys = [cas.y0];
    for (var i = 0; i < cas.n; i++) {
      var xn = xs[xs.length-1], yn = ys[ys.length-1];
      ys.push(_round(yn + cas.h * cas.f(xn, yn), 4));
      xs.push(_round(xn + cas.h, 4));
    }

    var types = ['one_step','n_steps','value','error','stability'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'one_step') {
      return {
        statement: 'Aplique um passo de Euler para ' + cas.eq + ', y(' + cas.x0 + ')=' + cas.y0 + ', h=' + cas.h + '.',
        equation:  'yₙ₊₁ = yₙ + h·f(xₙ,yₙ)',
        answer:    String(ys[1]),
        hints: [
          'f(x₀,y₀) = ' + _round(cas.f(cas.x0, cas.y0), 4),
          'y₁ = ' + cas.y0 + ' + ' + cas.h + '·' + _round(cas.f(cas.x0, cas.y0), 4),
        ],
      };
    }
    if (type === 'n_steps') {
      return {
        statement: 'Aplique ' + cas.n + ' passos de Euler para ' + cas.eq + ', y(' + cas.x0 + ')=' + cas.y0 + ', h=' + cas.h + '.',
        equation:  'yₙ₊₁ = yₙ + h·f(xₙ,yₙ)',
        answer:    String(ys[cas.n]),
        hints: [
          'y₁ = ' + ys[1],
          cas.n >= 2 ? 'y₂ = ' + ys[2] : '',
          'Valor final em x=' + xs[cas.n] + ': y=' + ys[cas.n],
        ].filter(Boolean),
      };
    }
    if (type === 'value') {
      return {
        statement: 'Use Euler (h=' + cas.h + ', ' + cas.n + ' passos) para aproximar y(' + xs[cas.n] + ') dado ' + cas.eq + ', y(' + cas.x0 + ')=' + cas.y0 + '.',
        equation:  'yₙ₊₁ = yₙ + h·f(xₙ,yₙ)',
        answer:    String(ys[cas.n]),
        hints: ys.slice(0,-1).map(function(y,i){return 'y'+i+'='+y+' em x='+xs[i];}),
      };
    }
    if (type === 'error' && cas.exact) {
      var apx = ys[cas.n], ex = _round(cas.exact(xs[cas.n]), 4);
      return {
        statement: 'Euler (' + cas.n + ' passos, h=' + cas.h + ') dá y(' + xs[cas.n] + ')≈' + apx + '. O valor exato é ' + ex + '. Qual o erro absoluto?',
        equation:  'Erro = |y_Euler − y_exato|',
        answer:    String(_round(Math.abs(apx - ex), 4)),
        hints: ['|' + apx + ' − ' + ex + '|'],
      };
    }
    return {
      statement: 'O método de Euler tem ordem de convergência __. Reduzir h pela metade divide o erro por __.',
      equation:  'Erro global = O(h)',
      answer:    '2',
      hints: ['Euler é de 1ª ordem: erro global proporcional a h. Dividir h por 2 divide o erro por 2.'],
    };
  };

  // ── laplace ───────────────────────────────────────────────────────
  MathGenerators['laplace'] = function (difficulty) {
    _reseed();
    var pairs = [
      // {f, F, hint}
      { f:'1',        F:'1/s',         hint:'ℒ{1} = ∫₀∞ e⁻ˢᵗ dt = 1/s' },
      { f:'t',        F:'1/s²',        hint:'ℒ{t} = 1/s²' },
      { f:'t²',       F:'2/s³',        hint:'ℒ{tⁿ} = n!/s^(n+1). n=2: 2!/s³' },
      { f:'eᵃᵗ',      F:'1/(s−a)',     hint:'ℒ{eᵃᵗ} = 1/(s−a), s>a' },
      { f:'sin(ωt)',  F:'ω/(s²+ω²)',   hint:'ℒ{sin(ωt)} = ω/(s²+ω²)' },
      { f:'cos(ωt)',  F:'s/(s²+ω²)',   hint:'ℒ{cos(ωt)} = s/(s²+ω²)' },
      { f:'eᵃᵗsin(ωt)',F:'ω/((s−a)²+ω²)',hint:'Deslocamento: ℒ{eᵃᵗf(t)} = F(s−a)' },
      { f:'t·eᵃᵗ',   F:'1/(s−a)²',   hint:'ℒ{t·eᵃᵗ} = 1/(s−a)²' },
      { f:'δ(t)',     F:'1',           hint:'Delta de Dirac: ℒ{δ(t)} = 1' },
      { f:'u(t−a)',   F:'e⁻ᵃˢ/s',     hint:'Degrau unitário deslocado: e⁻ᵃˢ/s' },
    ];
    var types = ['direct','inverse','ode_apply','derivative','convolution'];
    var type  = types[Math.min(difficulty - 1, 4)];

    var pair = pairs[Math.min(difficulty - 1, pairs.length - 1)];

    if (type === 'direct') {
      return {
        statement: 'Calcule a Transformada de Laplace de f(t) = ' + pair.f + '.',
        equation:  'ℒ{f(t)} = ∫₀∞ f(t)e⁻ˢᵗ dt',
        answer:    pair.F,
        hints:     [pair.hint],
      };
    }
    if (type === 'inverse') {
      return {
        statement: 'Calcule a Transformada Inversa de Laplace de F(s) = ' + pair.F + '.',
        equation:  'ℒ⁻¹{F(s)} = ?',
        answer:    pair.f,
        hints:     ['Tabela inversa: ' + pair.F + ' ↔ ' + pair.f, pair.hint],
      };
    }
    if (type === 'ode_apply') {
      return {
        statement: 'Resolva y\' + 2y = 0, y(0)=3, usando Transformada de Laplace.',
        equation:  'ℒ{y\'} + 2ℒ{y} = 0',
        answer:    'y = 3e⁻²ᵗ',
        hints: [
          'ℒ{y\'} = sY(s) − y(0) = sY − 3',
          '(sY−3) + 2Y = 0 → Y(3+2) = 3 → Y = 3/(s+2)',
          'ℒ⁻¹{3/(s+2)} = 3e⁻²ᵗ',
        ],
      };
    }
    if (type === 'derivative') {
      return {
        statement: 'Qual é ℒ{y\'\'} em termos de Y(s) = ℒ{y}?',
        equation:  'ℒ{y⁽ⁿ⁾} = sⁿY(s) − sⁿ⁻¹y(0) − ... − y⁽ⁿ⁻¹⁾(0)',
        answer:    's²Y(s) − sy(0) − y\'(0)',
        hints: [
          'ℒ{y\'} = sY(s) − y(0)',
          'Aplicar novamente: ℒ{y\'\'} = s·ℒ{y\'} − y\'(0)',
          '= s(sY − y(0)) − y\'(0) = s²Y − sy(0) − y\'(0)',
        ],
      };
    }
    // convolution
    return {
      statement: 'O Teorema da Convolução afirma: ℒ{f*g} = ?',
      equation:  '(f*g)(t) = ∫₀ᵗ f(τ)g(t−τ)dτ',
      answer:    'F(s)·G(s)',
      hints: ['A convolução no domínio t corresponde ao produto no domínio s.'],
    };
  };

  // ── fourier_series ────────────────────────────────────────────────
  MathGenerators['fourier_series'] = function (difficulty) {
    _reseed();
    var types = ['coeff_a0','coeff_an','coeff_bn','reconstruct','parseval'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'coeff_a0') {
      return {
        statement: 'Calcule o coeficiente a₀ da série de Fourier de f(x)=x em [−π,π].',
        equation:  'a₀ = (1/π)∫₋π^π f(x)dx',
        answer:    '0',
        hints: [
          '∫₋π^π x dx = [x²/2]₋π^π = π²/2 − π²/2 = 0',
          'f(x)=x é função ímpar → a₀ = 0',
        ],
      };
    }
    if (type === 'coeff_an') {
      return {
        statement: 'Calcule aₙ da série de Fourier de f(x)=x² em [−π,π].',
        equation:  'aₙ = (1/π)∫₋π^π x²cos(nx)dx',
        answer:    '4(−1)ⁿ/n²',
        hints: [
          'x² é função par → bₙ = 0',
          'Integrar por partes duas vezes.',
          'Resultado: aₙ = 4(−1)ⁿ/n²',
        ],
      };
    }
    if (type === 'coeff_bn') {
      return {
        statement: 'Calcule bₙ da série de Fourier de f(x)=x em [−π,π].',
        equation:  'bₙ = (1/π)∫₋π^π x·sin(nx)dx',
        answer:    '2(−1)ⁿ⁺¹/n',
        hints: [
          'x é função ímpar → aₙ = 0',
          'bₙ = (1/π)·integração por partes',
          'bₙ = 2(−1)ⁿ⁺¹/n',
        ],
      };
    }
    if (type === 'reconstruct') {
      return {
        statement: 'A série de Fourier de f(x)=x em [−π,π] é Σbₙsin(nx). Com bₙ=2(−1)ⁿ⁺¹/n, qual é o primeiro termo (n=1)?',
        equation:  'f(x) = Σ 2(−1)ⁿ⁺¹/n · sin(nx)',
        answer:    '2sin(x)',
        hints: [
          'n=1: b₁ = 2(−1)²/1 = 2',
          'Primeiro termo: 2sin(x)',
        ],
      };
    }
    // parseval
    return {
      statement: 'A igualdade de Parseval para f(x)=x em [−π,π] afirma: Σ(1/n²) = π²/k. Qual o valor de k?',
      equation:  '(1/π)∫₋π^π x²dx = a₀²/2 + Σ(aₙ²+bₙ²)',
      answer:    '6',
      hints: [
        '||x||² = (1/π)∫x²dx = 2π²/3',
        'bₙ = 2/n → Σbₙ² = 4Σ(1/n²)',
        '4Σ(1/n²) = 2π²/3 → Σ(1/n²) = π²/6',
      ],
    };
  };

})();
