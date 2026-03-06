/**
 * math/generators/ode_prob.js
 * EDO + Probabilidade & Estatística avançada: distribuições, inferência, regressão.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  // ── ode_first ─────────────────────────────────────────────────────────────
  MathGenerators['ode_first'] = function (difficulty) {
    _reseed();
    var types = ['separable_simple', 'separable_pvi', 'linear_if', 'growth_decay', 'bernoulli_notion'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'separable_simple') {
      var a = _randInt(1, 4);
      // dy/dx = ay → y = Ce^(ax)
      return {
        statement: 'Resolva: dy/dx = ' + a + 'y.',
        equation:  'dy/y = ' + a + ' dx',
        answer:    'y = Ce^(' + a + 'x)',
        hints: ['Separe: dy/y = ' + a + 'dx. Integre ambos os lados.',
                'ln|y| = ' + a + 'x + C₁  →  |y| = e^(' + a + 'x)·e^(C₁).',
                'y = Ce^(' + a + 'x)']
      };
    }
    if (type === 'separable_pvi') {
      var a = _randInt(1, 3), y0 = _randInt(1, 5);
      // dy/dx = ay, y(0) = y0 → y = y0·e^(ax)
      return {
        statement: 'PVI: dy/dx = ' + a + 'y,  y(0) = ' + y0 + '.',
        equation:  'dy/y = ' + a + 'dx,  y(0)=' + y0,
        answer:    'y = ' + y0 + 'e^(' + a + 'x)',
        hints: ['Solução geral: y = Ce^(' + a + 'x).',
                'y(0) = C·1 = ' + y0 + ' → C = ' + y0 + '.',
                'y = ' + y0 + 'e^(' + a + 'x)']
      };
    }
    if (type === 'linear_if') {
      // dy/dx + ay = b → IF = e^(ax); solução y = b/a + Ce^(-ax)
      var a = _randInt(1, 4), b = _randInt(1, 6);
      var yp = Math.round(b / a * 100) / 100;
      return {
        statement: 'Resolva (FI): dy/dx + ' + a + 'y = ' + b + '.',
        equation:  'dy/dx + ' + a + 'y = ' + b + '  (linear 1ª ordem)',
        answer:    'y = ' + (b + '/' + a) + ' + Ce^(−' + a + 'x)',
        hints: ['FI = e^(∫' + a + 'dx) = e^(' + a + 'x). Multiplique ambos os lados.',
                'd/dx[e^(' + a + 'x)y] = ' + b + 'e^(' + a + 'x). Integre: e^(' + a + 'x)y = (' + b + '/' + a + ')e^(' + a + 'x) + C.',
                'y = ' + b + '/' + a + ' + Ce^(−' + a + 'x)']
      };
    }
    if (type === 'growth_decay') {
      var k = _randInt(1, 4), t_half = Math.round(Math.log(2) / k * 100) / 100;
      return {
        statement: 'Decaimento radioativo: dN/dt = −' + k + 'N. N(0)=N₀. Qual a meia-vida?',
        equation:  'N(t) = N₀e^(−' + k + 't)',
        answer:    't₁/₂ = ln2/' + k + ' ≈ ' + t_half,
        hints: ['Solução: N(t) = N₀e^(−' + k + 't).',
                'Meia-vida: N(t₁/₂) = N₀/2 → e^(−' + k + 't₁/₂) = 1/2 → t₁/₂ = ln2/' + k + '.',
                't₁/₂ = ln2/' + k + ' ≈ ' + t_half]
      };
    }
    // Bernoulli concept
    return {
      statement: 'dy/dx + y = y²  é do tipo Bernoulli (n=2). Qual a substituição canônica?',
      equation:  'dy/dx + P(x)y = Q(x)yⁿ',
      answer:    'v = y^(1−n) = y^(−1)',
      hints: ['Equação de Bernoulli: dy/dx + P(x)y = Q(x)yⁿ.',
              'Substituição padrão: v = y^(1−n). Aqui n=2 → v = y^(−1).',
              'v = y^(−1)']
    };
  };

  // ── ode_second ────────────────────────────────────────────────────────────
  MathGenerators['ode_second'] = function (difficulty) {
    _reseed();
    var types = ['char_roots_real', 'char_roots_complex', 'pvi_second', 'particular_poly', 'undetermined_coef'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'char_roots_real') {
      // y'' - (r1+r2)y' + r1*r2*y = 0
      var r1 = _randInt(-3, 3), r2 = _randInt(-3, 3);
      while (r2 === r1) r2 = _randInt(-3, 3);
      var b = -(r1 + r2), c = r1 * r2;
      var bstr = b >= 0 ? '+' + b : String(b);
      var cstr = c >= 0 ? '+' + c : String(c);
      return {
        statement: 'Resolva: y\'\' ' + bstr + 'y\' ' + cstr + 'y = 0.',
        equation:  'Eq. característica: λ² ' + bstr + 'λ ' + cstr + ' = 0',
        answer:    'y = C₁e^(' + r1 + 'x) + C₂e^(' + r2 + 'x)',
        hints: ['Eq. característica: λ² ' + bstr + 'λ ' + cstr + ' = 0.',
                'Raízes: λ₁=' + r1 + ', λ₂=' + r2 + ' (reais e distintas).',
                'y = C₁e^(' + r1 + 'x) + C₂e^(' + r2 + 'x)']
      };
    }
    if (type === 'char_roots_complex') {
      // y'' + b²y = 0 → roots ±bi → y = C1cos(bx) + C2sin(bx)
      var b = _randInt(1, 4);
      return {
        statement: 'Resolva: y\'\' + ' + (b*b) + 'y = 0.',
        equation:  'Eq. característica: λ² + ' + (b*b) + ' = 0',
        answer:    'y = C₁cos(' + b + 'x) + C₂sen(' + b + 'x)',
        hints: ['Eq. característica: λ² = −' + (b*b) + ' → λ = ±' + b + 'i (raízes complexas).',
                'Raízes α±βi com α=0, β='+b+' → y = e^(0)·[C₁cos('+b+'x)+C₂sen('+b+'x)].',
                'y = C₁cos(' + b + 'x) + C₂sen(' + b + 'x)']
      };
    }
    if (type === 'pvi_second') {
      // y'' - y = 0, y(0)=2, y'(0)=0 → y=e^x+e^(-x) → C1+C2=2, C1-C2=0 → C1=C2=1
      return {
        statement: 'PVI: y\'\' − y = 0,  y(0)=2,  y\'(0)=0.',
        equation:  'Raízes: λ=±1 → y=C₁eˣ+C₂e^(−x)',
        answer:    'y = eˣ + e^(−x)',
        hints: ['Solução geral: y = C₁eˣ + C₂e^(−x).',
                'y(0): C₁+C₂=2. y\'(0): C₁−C₂=0 → C₁=C₂=1.',
                'y = eˣ + e^(−x)']
      };
    }
    if (type === 'particular_poly') {
      var a = _randInt(1, 4);
      // y'' + y = a → yp = a (constante)
      return {
        statement: 'Ache a solução particular de y\'\' + y = ' + a + '.',
        equation:  'Tente yₚ = A (constante)',
        answer:    'yₚ = ' + a,
        hints: ['g(x)=' + a + ' (constante) → yₚ = A.',
                'yₚ\'\' + yₚ = 0 + A = ' + a + ' → A = ' + a + '.',
                'yₚ = ' + a]
      };
    }
    // undetermined coefficients: y'' + y = sin(x) → resonance
    return {
      statement: 'y\'\' + 4y = cos(2x). Por que o método dos coeficientes indeterminados exige modificação?',
      equation:  'y\'\' + 4y = cos(2x)',
      answer:    'ressonância (cos(2x) é solução homogênea)',
      hints: ['A frequência da forçante (2) coincide com a natural (√4=2).',
              'Em ressonância, tenta-se yₚ = x(A cos2x + B sen2x).',
              'ressonância (cos(2x) é solução homogênea)']
    };
  };

  // ── distributions ─────────────────────────────────────────────────────────
  MathGenerators['distributions'] = function (difficulty) {
    _reseed();
    var types = ['normal_prob', 'exp_dist', 'poisson', 'normal_params', 'clt'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'normal_prob') {
      // P(Z < z) for standard normal
      var cases = [
        { z: 0, p: '0.5', desc: 'P(Z < 0)' },
        { z: 1, p: '0.8413', desc: 'P(Z < 1)' },
        { z: 2, p: '0.9772', desc: 'P(Z < 2)' },
        { z: -1, p: '0.1587', desc: 'P(Z < −1)' },
      ];
      var c = cases[_randInt(0, 3)];
      return {
        statement: 'Z ~ N(0,1). Calcule ' + c.desc + ' (use a tabela normal padrão).',
        equation:  'Z ~ N(0,1)',
        answer:    c.p,
        hints: ['Use a tabela de distribuição normal padrão Φ(z).',
                'Φ(' + c.z + ') é tabelada.',
                c.p]
      };
    }
    if (type === 'exp_dist') {
      var lam = _randInt(1, 4);
      var t = _randInt(1, 3);
      var p = Math.round((1 - Math.exp(-lam * t)) * 1000) / 1000;
      return {
        statement: 'T ~ Exp(λ=' + lam + '). Calcule P(T ≤ ' + t + ').',
        equation:  'P(T ≤ t) = 1 − e^(−λt)',
        answer:    String(p),
        hints: ['F(t) = 1 − e^(−' + lam + 't).',
                'F(' + t + ') = 1 − e^(−' + (lam*t) + ') ≈ 1 − ' + Math.round(Math.exp(-lam*t)*1000)/1000 + '.',
                String(p)]
      };
    }
    if (type === 'poisson') {
      var lam = _randInt(2, 5), k = _randInt(0, 3);
      var fac = [1, 1, 2, 6, 24][k];
      var p = Math.round(Math.exp(-lam) * Math.pow(lam, k) / fac * 1000) / 1000;
      return {
        statement: 'X ~ Poisson(λ=' + lam + '). Calcule P(X = ' + k + ').',
        equation:  'P(X=k) = e^(−λ)·λᵏ/k!',
        answer:    String(p),
        hints: ['P(X=' + k + ') = e^(−' + lam + ')·' + lam + '^' + k + '/' + k + '!',
                '= e^(−' + lam + ')·' + Math.pow(lam, k) + '/' + fac + '.',
                String(p)]
      };
    }
    if (type === 'normal_params') {
      var mu = _randInt(50, 80), sigma = _randInt(5, 15);
      var x = mu + sigma;
      var z = 1;
      return {
        statement: 'X ~ N(' + mu + ', ' + sigma + '²). Calcule P(X < ' + x + ').',
        equation:  'Z = (X − μ)/σ',
        answer:    '0.8413',
        hints: ['Padronize: Z = (' + x + ' − ' + mu + ')/' + sigma + ' = 1.',
                'P(Z < 1) = Φ(1) ≈ 0.8413.',
                '0.8413']
      };
    }
    // CLT
    var n = _randInt(30, 100), mu = _randInt(5, 20), sig = _randInt(2, 8);
    var se = Math.round(sig / Math.sqrt(n) * 100) / 100;
    return {
      statement: 'Pop. com μ=' + mu + ', σ=' + sig + '. Amostras n=' + n + '. Qual o erro padrão da média?',
      equation:  'SE = σ/√n',
      answer:    String(se),
      hints: ['Teorema Central do Limite: X̄ ~ N(μ, σ²/n).',
              'SE = ' + sig + '/√' + n + ' = ' + sig + '/' + Math.round(Math.sqrt(n)*100)/100 + '.',
              String(se)]
    };
  };

  // ── inference ─────────────────────────────────────────────────────────────
  MathGenerators['inference'] = function (difficulty) {
    _reseed();
    var types = ['ci_mean', 'hypothesis_z', 'hypothesis_t', 'p_value', 'error_types'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'ci_mean') {
      var xbar = _randInt(40, 80), sigma = _randInt(4, 12), n = _randInt(25, 100);
      var z95 = 1.96;
      var me = Math.round(z95 * sigma / Math.sqrt(n) * 100) / 100;
      var lo = Math.round((xbar - me) * 100) / 100;
      var hi = Math.round((xbar + me) * 100) / 100;
      return {
        statement: 'IC 95% para μ: x̄=' + xbar + ', σ=' + sigma + ', n=' + n + '.',
        equation:  'IC = x̄ ± z_{α/2}·σ/√n',
        answer:    '(' + lo + ', ' + hi + ')',
        hints: ['z_{0.025} = 1,96. ME = 1,96·' + sigma + '/√' + n + ' ≈ ' + me + '.',
                'IC = ' + xbar + ' ± ' + me + '.',
                '(' + lo + ', ' + hi + ')']
      };
    }
    if (type === 'hypothesis_z') {
      var mu0 = _randInt(50, 70), xbar = mu0 + _randInt(3, 8), sigma = _randInt(5, 15), n = 100;
      var z = Math.round((xbar - mu0) / (sigma / Math.sqrt(n)) * 100) / 100;
      var rejeita = Math.abs(z) > 1.96;
      return {
        statement: 'Teste H₀: μ=' + mu0 + '  H₁: μ≠' + mu0 + '. x̄=' + xbar + ', σ=' + sigma + ', n=' + n + ', α=0,05.',
        equation:  'Z = (x̄ − μ₀)/(σ/√n)',
        answer:    (rejeita ? 'Rejeitar H₀' : 'Não rejeitar H₀') + ' (Z=' + z + ')',
        hints: ['Z = (' + xbar + ' − ' + mu0 + ')/(' + sigma + '/√' + n + ') = ' + z + '.',
                '|Z|=' + Math.abs(z) + ' ' + (rejeita ? '> 1,96 → região crítica.' : '< 1,96 → não rejeita.'),
                (rejeita ? 'Rejeitar H₀' : 'Não rejeitar H₀') + ' (Z=' + z + ')']
      };
    }
    if (type === 'hypothesis_t') {
      var mu0 = _randInt(10, 20), xbar = mu0 + _randInt(2, 5), s = _randInt(3, 8), n = _randInt(10, 25);
      var t = Math.round((xbar - mu0) / (s / Math.sqrt(n)) * 100) / 100;
      return {
        statement: 'Teste t com n=' + n + ', x̄=' + xbar + ', s=' + s + ', μ₀=' + mu0 + ', α=0,05 (unilateral direita). Calcule t.',
        equation:  't = (x̄ − μ₀)/(s/√n)',
        answer:    String(t),
        hints: ['t = (' + xbar + ' − ' + mu0 + ')/(' + s + '/√' + n + ').',
                'Denominador: s/√n = ' + Math.round(s/Math.sqrt(n)*100)/100 + '.',
                String(t)]
      };
    }
    if (type === 'p_value') {
      return {
        statement: 'Teste bilateral com Z = 2,5. Qual o p-valor aproximado?',
        equation:  'p = 2·P(Z > 2,5)',
        answer:    '0.0124',
        hints: ['P(Z > 2,5) ≈ 0,0062 (tabela normal).',
                'Bilateral: p = 2·0,0062 = 0,0124.',
                '0.0124']
      };
    }
    // error types
    return {
      statement: 'Rejeitar H₀ quando ela é verdadeira é chamado de:',
      equation:  'Erros tipo I e tipo II',
      answer:    'Erro tipo I (falso positivo)',
      hints: ['Erro tipo I (α): rejeitar H₀ verdadeira.',
              'Erro tipo II (β): não rejeitar H₀ falsa.',
              'Erro tipo I (falso positivo)']
    };
  };

  // ── regression ────────────────────────────────────────────────────────────
  MathGenerators['regression'] = function (difficulty) {
    _reseed();
    var types = ['slope_formula', 'intercept', 'predict', 'r_squared', 'residual'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'slope_formula') {
      // Simple data: x=[1,2,3], y=[2,4,6] → β1=2, β0=0
      var b1 = _randInt(1, 4), b0 = _randInt(-3, 3);
      var xs = [1, 2, 3, 4], ys = xs.map(function(x){return b1*x+b0+0;});
      var xbar = 2.5, ybar = b1*2.5+b0;
      var sxy = xs.reduce(function(s,x,i){return s+(x-xbar)*(ys[i]-ybar);},0);
      var sxx = xs.reduce(function(s,x){return s+(x-xbar)*(x-xbar);},0);
      var b1calc = Math.round(sxy/sxx*100)/100;
      return {
        statement: 'Dados (x,y): '+xs.map(function(x,i){return '('+x+','+ys[i]+')';}).join(', ')+'. Calcule o coeficiente angular β₁.',
        equation:  'β₁ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²',
        answer:    String(b1calc),
        hints: ['x̄=' + xbar + ', ȳ=' + ybar + '.',
                'Σ(xᵢ−x̄)(yᵢ−ȳ) = ' + sxy + ',  Σ(xᵢ−x̄)² = ' + sxx + '.',
                String(b1calc)]
      };
    }
    if (type === 'intercept') {
      var b1 = _randInt(1, 3), b0 = _randInt(-4, 4);
      var xbar = _randInt(2, 5), ybar = b1 * xbar + b0;
      return {
        statement: 'β₁ = ' + b1 + ', x̄ = ' + xbar + ', ȳ = ' + ybar + '. Calcule β₀.',
        equation:  'β₀ = ȳ − β₁·x̄',
        answer:    String(b0),
        hints: ['β₀ = ȳ − β₁·x̄.',
                '= ' + ybar + ' − ' + b1 + '·' + xbar + ' = ' + ybar + ' − ' + (b1*xbar) + '.',
                String(b0)]
      };
    }
    if (type === 'predict') {
      var b1 = _randInt(1, 4), b0 = _randInt(-5, 5), xnew = _randInt(5, 10);
      var ypred = b1 * xnew + b0;
      return {
        statement: 'Modelo: ŷ = ' + b1 + 'x + ' + b0 + '. Prediga y para x = ' + xnew + '.',
        equation:  'ŷ = ' + b1 + 'x + ' + b0,
        answer:    String(ypred),
        hints: ['Substitua x=' + xnew + ' na equação da reta.',
                'ŷ = ' + b1 + '·' + xnew + ' + ' + b0 + ' = ' + (b1*xnew) + ' + ' + b0 + '.',
                String(ypred)]
      };
    }
    if (type === 'r_squared') {
      // Perfect fit: R²=1
      return {
        statement: 'Um modelo de regressão explica 85% da variância total em y. Qual o R²?',
        equation:  'R² = SQReg / SQTotal = 1 − SQRes/SQTotal',
        answer:    '0.85',
        hints: ['R² mede a proporção da variância explicada pelo modelo.',
                '"Explica 85% da variância" → R² = 0,85.',
                '0.85']
      };
    }
    // residual
    var yi = _randInt(5, 15), yhat = _randInt(5, 15);
    return {
      statement: 'y observado = ' + yi + ', ŷ predito = ' + yhat + '. Qual o resíduo?',
      equation:  'e = y − ŷ',
      answer:    String(yi - yhat),
      hints: ['Resíduo = valor observado − valor predito.',
              'e = ' + yi + ' − ' + yhat + '.',
              String(yi - yhat)]
    };
  };

})();
