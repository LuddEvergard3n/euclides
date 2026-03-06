/**
 * math/generators/calc_III.js
 * Cálculo III: derivadas parciais, integrais múltiplas, cálculo vetorial.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  // ── partial_deriv ────────────────────────────────────────────────────────
  MathGenerators['partial_deriv'] = function (difficulty) {
    _reseed();
    var types = ['basic_partial', 'gradient_eval', 'second_partial', 'directional', 'chain_partial'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'basic_partial') {
      var a = _randInt(1, 4), b = _randInt(1, 4), c = _randInt(1, 3);
      // f = ax² + bxy + cy²
      // ∂f/∂x = 2ax + by
      // ∂f/∂y = bx + 2cy
      var x0 = _randInt(-2, 3), y0 = _randInt(-2, 3);
      var dfdx = 2 * a * x0 + b * y0;
      return {
        statement: 'f(x,y) = ' + a + 'x² + ' + b + 'xy + ' + c + 'y². Calcule ∂f/∂x em (' + x0 + ', ' + y0 + ').',
        equation:  '∂f/∂x = ' + (2*a) + 'x + ' + b + 'y',
        answer:    String(dfdx),
        hints: ['Trate y como constante ao derivar em relação a x.',
                '∂f/∂x = ' + (2*a) + 'x + ' + b + 'y. Em ('+x0+','+y0+'): ' + (2*a) + '·'+x0+' + '+b+'·'+y0+'.',
                String(dfdx)]
      };
    }
    if (type === 'gradient_eval') {
      var a = _randInt(1, 4), b = _randInt(1, 4);
      var x0 = _randInt(1, 3), y0 = _randInt(1, 3);
      // f = ax² + by²  → ∇f = (2ax, 2by)
      var gx = 2 * a * x0, gy = 2 * b * y0;
      return {
        statement: 'f(x,y) = ' + a + 'x² + ' + b + 'y². Calcule ∇f em (' + x0 + ', ' + y0 + ').',
        equation:  '∇f = (∂f/∂x, ∂f/∂y)',
        answer:    '(' + gx + ', ' + gy + ')',
        hints: ['∂f/∂x = ' + (2*a) + 'x  |  ∂f/∂y = ' + (2*b) + 'y.',
                '∇f(' + x0 + ',' + y0 + ') = (' + (2*a) + '·' + x0 + ', ' + (2*b) + '·' + y0 + ').',
                '(' + gx + ', ' + gy + ')']
      };
    }
    if (type === 'second_partial') {
      var a = _randInt(1, 3), b = _randInt(1, 3);
      // f = ax³y + by²  → ∂²f/∂x² = 6ax·y  → at (1,1) = 6a
      // ∂²f/∂x∂y = 3ax²  → at (1,1) = 3a
      var x0 = 1, y0 = _randInt(1, 3);
      var fxy = 3 * a;
      return {
        statement: 'f(x,y) = ' + a + 'x³y + ' + b + 'y². Calcule ∂²f/∂x∂y em (1, ' + y0 + ').',
        equation:  '∂f/∂x = ' + (3*a) + 'x²y  →  ∂²f/∂x∂y = ' + (3*a) + 'x²',
        answer:    String(fxy),
        hints: ['Passo 1: ∂f/∂x = ' + (3*a) + 'x²y.',
                'Passo 2: ∂/∂y[' + (3*a) + 'x²y] = ' + (3*a) + 'x². Em (1,' + y0 + '): ' + (3*a) + '·1².',
                String(fxy)]
      };
    }
    if (type === 'directional') {
      var a = _randInt(1, 3), b = _randInt(1, 3);
      var x0 = _randInt(1, 3), y0 = _randInt(1, 3);
      // f = ax + by²; ∇f = (a, 2by); direction (1/√2, 1/√2)
      var gx = a, gy = 2 * b * y0;
      var du = Math.round((gx + gy) / Math.sqrt(2) * 100) / 100;
      return {
        statement: 'f(x,y) = ' + a + 'x + ' + b + 'y². Derivada direcional em (' + x0 + ',' + y0 + ') na direção (1/√2, 1/√2).',
        equation:  'Dᵤf = ∇f · û',
        answer:    String(du),
        hints: ['∇f = (' + a + ', ' + (2*b) + 'y). Em ('+x0+','+y0+'): ('+gx+', '+gy+').',
                'û = (1/√2, 1/√2). Produto escalar: ('+gx+'+'+gy+')/√2.',
                String(du)]
      };
    }
    // critical point: f = x² + y² + axy → f_x=2x+ay=0, f_y=2y+ax=0 → only (0,0)
    var a = _randInt(1, 2);
    return {
      statement: 'f(x,y) = x² + y² + ' + a + 'xy. Ache os pontos críticos.',
      equation:  '∂f/∂x = 2x + ' + a + 'y = 0  |  ∂f/∂y = 2y + ' + a + 'x = 0',
      answer:    '(0, 0)',
      hints: ['Sistema: 2x+'+a+'y=0 e 2y+'+a+'x=0.',
              'Substitua y=−'+a+'x/2 em 2y+'+a+'x=0: −'+a+'x+'+a+'x=0 → x=0.',
              '(0, 0)']
    };
  };

  // ── multiple_integrals ───────────────────────────────────────────────────
  MathGenerators['multiple_integrals'] = function (difficulty) {
    _reseed();
    var types = ['iterated_basic', 'switch_order', 'polar_simple', 'volume_solid', 'mass_density'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'iterated_basic') {
      var a = _randInt(1, 3), b = _randInt(1, 3), hx = _randInt(1, 3), hy = _randInt(1, 3);
      // ∫[0,hx]∫[0,hy] (ax+by) dy dx
      var ans = hx * hy * (a * hx / 2 + b * hy / 2);
      return {
        statement: '∫₀^' + hx + '∫₀^' + hy + ' (' + a + 'x + ' + b + 'y) dy dx',
        equation:  'integral iterada sobre [0,' + hx + ']×[0,' + hy + ']',
        answer:    String(ans),
        hints: ['Passo 1: integre em y: ∫₀^'+hy+' ('+a+'x+'+b+'y)dy = '+a+'x·'+hy+' + '+b+'·'+hy+'²/2.',
                'Passo 2: integre em x: ∫₀^'+hx+' ['+a+'x·'+hy+' + '+b*hy*hy/2+'] dx.',
                String(ans)]
      };
    }
    if (type === 'switch_order') {
      // ∫[0,1]∫[x,1] f dy dx = ∫[0,1]∫[0,y] f dx dy (same region)
      return {
        statement: 'Inverta a ordem: ∫₀¹∫ₓ¹ f(x,y) dy dx.',
        equation:  'Região: 0≤x≤1, x≤y≤1',
        answer:    '∫₀¹∫₀ʸ f(x,y) dx dy',
        hints: ['Desenhe a região: triângulo com x de 0 a y, y de 0 a 1.',
                'Ao inverter: y de 0 a 1, x de 0 a y.',
                '∫₀¹∫₀ʸ f(x,y) dx dy']
      };
    }
    if (type === 'polar_simple') {
      // ∫∫_{x²+y²≤r²} 1 dA = π r²
      var r = _randInt(1, 4);
      return {
        statement: 'Calcule ∫∫_{D} dA onde D é o disco x² + y² ≤ ' + (r*r) + ' (use coordenadas polares).',
        equation:  '∫₀^{2π}∫₀^' + r + ' r dr dθ',
        answer:    String(Math.PI * r * r).slice(0, 6) + ' (= ' + r + '²π)',
        hints: ['Polar: x=r cosθ, y=r senθ, dA = r dr dθ.',
                '∫₀^{2π}dθ · ∫₀^'+r+' r dr = 2π · '+r+'²/2 = π·'+r+'².',
                r + '²π = ' + Math.round(Math.PI*r*r*100)/100]
      };
    }
    if (type === 'volume_solid') {
      // Volume under z=1 over square [0,a]×[0,a] = a²
      var a = _randInt(1, 4);
      return {
        statement: 'Volume sob z = 1 sobre o quadrado [0,' + a + ']×[0,' + a + '].',
        equation:  'V = ∫₀^' + a + '∫₀^' + a + ' 1 dy dx',
        answer:    String(a * a) + ' u³',
        hints: ['V = ∫₀^'+a+' [∫₀^'+a+' 1 dy] dx = ∫₀^'+a+' '+a+' dx.',
                '= ' + a + '·[x]₀^'+a+' = '+a+'·'+a+'.',
                a*a + ' u³']
      };
    }
    // mass: density ρ = x+y over [0,1]×[0,1]
    return {
      statement: 'Massa de lâmina [0,1]×[0,1] com densidade ρ(x,y) = x + y.',
      equation:  'M = ∫₀¹∫₀¹ (x+y) dx dy',
      answer:    '1',
      hints: ['∫₀¹(x+y)dx = [x²/2+xy]₀¹ = 1/2+y.',
              '∫₀¹(1/2+y)dy = [y/2+y²/2]₀¹ = 1/2+1/2 = 1.',
              '1']
    };
  };

  // ── vector_calc ──────────────────────────────────────────────────────────
  MathGenerators['vector_calc'] = function (difficulty) {
    _reseed();
    var types = ['divergence', 'curl_2d', 'conservative', 'line_integral', 'green_theorem'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'divergence') {
      var a = _randInt(1, 4), b = _randInt(1, 4), c = _randInt(1, 3);
      // F = (ax, by, cz)  →  div F = a + b + c
      var ans = a + b + c;
      return {
        statement: 'Campo F = (' + a + 'x, ' + b + 'y, ' + c + 'z). Calcule div F.',
        equation:  'div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z',
        answer:    String(ans),
        hints: ['div F = ∂('+a+'x)/∂x + ∂('+b+'y)/∂y + ∂('+c+'z)/∂z.',
                '= ' + a + ' + ' + b + ' + ' + c + '.',
                String(ans)]
      };
    }
    if (type === 'curl_2d') {
      var a = _randInt(1, 4), b = _randInt(1, 4);
      // F = (ay, bx)  →  rot F = (b-a)k
      var ans = b - a;
      return {
        statement: 'F = (' + a + 'y, ' + b + 'x). Componente z do rotacional (rot F)ₖ.',
        equation:  '(rot F)_z = ∂Q/∂x − ∂P/∂y',
        answer:    String(ans),
        hints: ['∂Q/∂x = ∂(' + b + 'x)/∂x = ' + b + '.',
                '∂P/∂y = ∂(' + a + 'y)/∂y = ' + a + '.',
                '(rot F)_z = ' + b + ' − ' + a + ' = ' + ans]
      };
    }
    if (type === 'conservative') {
      var a = _randInt(1, 3);
      // F = (2xy, x²) is conservative because ∂P/∂y = 2x = ∂Q/∂x
      var choices = [
        { F: '(' + (2*a) + 'xy, ' + a + 'x²)', ans: 'Sim', reason: '∂('+2*a+'xy)/∂y = '+2*a+'x = ∂('+a+'x²)/∂x' },
        { F: '(y, x+1)',  ans: 'Sim',  reason: '∂y/∂y = 1 = ∂(x+1)/∂x' },
        { F: '(x, y²)',   ans: 'Não',  reason: '∂x/∂y = 0 ≠ ∂y²/∂x = 0... rotacional ≠ 0 pois dom. não é simplesmente conexo' },
        { F: '(y², 2xy)', ans: 'Sim',  reason: '∂(y²)/∂y = 2y = ∂(2xy)/∂x' },
      ];
      var c = choices[_randInt(0, choices.length - 1)];
      return {
        statement: 'F = ' + c.F + ' é conservativo?',
        equation:  'Condição: ∂P/∂y = ∂Q/∂x',
        answer:    c.ans,
        hints: ['Campo F=(P,Q) é conservativo se ∂P/∂y = ∂Q/∂x (domínio simplesmente conexo).',
                c.reason,
                c.ans]
      };
    }
    if (type === 'line_integral') {
      // ∫_C F·dr where F=(x,y), C: straight line from (0,0) to (1,1), r(t)=(t,t), dr=(1,1)dt
      // ∫₀¹ (t+t)dt = ∫₀¹ 2t dt = 1
      var a = _randInt(1, 3);
      return {
        statement: 'Integral de linha de F = (' + a + 'x, ' + a + 'y) ao longo de C: reta de (0,0) a (1,1).',
        equation:  '∫_C F·dr,  r(t)=(t,t), 0≤t≤1',
        answer:    String(a),
        hints: ['r(t)=(t,t), r\'(t)=(1,1). F(r(t)) = ('+a+'t, '+a+'t).',
                '∫₀¹ ('+a+'t·1 + '+a+'t·1) dt = ∫₀¹ '+2*a+'t dt = '+2*a+'·[t²/2]₀¹ = '+a+'.',
                String(a)]
      };
    }
    // Green: ∮_C P dx + Q dy = ∬_D (∂Q/∂x - ∂P/∂y) dA
    // F=(−y,x), C: unit circle. rot=2. Area=π. Integral=2π
    return {
      statement: 'Teorema de Green: ∮_C (−y dx + x dy), C: círculo unitário (sentido antihorário).',
      equation:  '∬_D (∂x/∂x − ∂(−y)/∂y) dA = ∬_D 2 dA',
      answer:    '2π',
      hints: ['∂Q/∂x = ∂x/∂x = 1. ∂P/∂y = ∂(−y)/∂y = −1. Integral do rotacional = 2.',
              '∬_D 2 dA = 2·Área(D) = 2·π·1² = 2π.',
              '2π']
    };
  };

})();
