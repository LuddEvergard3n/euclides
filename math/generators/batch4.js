/**
 * math/generators/batch4.js
 * Generators: complex_var, runge_kutta, wave_eq, interpolation, ode_systems
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  function _round(v, dec) {
    var f = Math.pow(10, dec || 2); return Math.round(v * f) / f;
  }

  // ── complex_var ────────────────────────────────────────────────────
  // Topics: modulus, argument, conjugate, algebraic ops, polar form, Euler
  MathGenerators['complex_var'] = function (difficulty) {
    _reseed();
    var types = [
      // d1: modulus |a+bi|
      function () {
        var a = _randInt(1, 5), b = _randInt(1, 5);
        var mod = _round(Math.sqrt(a*a + b*b), 2);
        return {
          statement: 'Calcule o módulo do número complexo z = ' + a + ' + ' + b + 'i.',
          equation:  '|z| = \\u221a(' + a + '\u00b2 + ' + b + '\u00b2)',
          answer:    String(mod),
          hints: [
            '|a+bi| = \u221a(a\u00b2 + b\u00b2)',
            'Calcule a\u00b2 + b\u00b2 = ' + (a*a + b*b),
            '|z| = \u221a' + (a*a + b*b) + ' \u2248 ' + mod,
          ],
        };
      },
      // d2: conjugate
      function () {
        var a = _randInt(-4, 4) || 1, b = _randInt(1, 5);
        var bSign = b >= 0 ? ' + ' + b : ' - ' + Math.abs(b);
        var conjB = -b;
        var conjSign = conjB >= 0 ? ' + ' + conjB : ' - ' + Math.abs(conjB);
        return {
          statement: 'Qual o conjugado de z = ' + a + bSign + 'i?',
          equation:  '\u0305z = a - bi',
          answer:    a + conjSign + 'i',
          hints: [
            'O conjugado troca o sinal da parte imaginária.',
            'Se z = a + bi, então \u0305z = a - bi.',
            '\u0305z = ' + a + conjSign + 'i',
          ],
        };
      },
      // d3: multiplication (a+bi)(c+di)
      function () {
        var a = _randInt(1, 4), b = _randInt(1, 4);
        var c = _randInt(1, 4), d = _randInt(1, 4);
        var re = a*c - b*d, im = a*d + b*c;
        var imSign = im >= 0 ? ' + ' + im : ' - ' + Math.abs(im);
        return {
          statement: 'Calcule o produto (' + a + ' + ' + b + 'i)(' + c + ' + ' + d + 'i).',
          equation:  '(a+bi)(c+di) = (ac-bd) + (ad+bc)i',
          answer:    re + imSign + 'i',
          hints: [
            'Use FOIL: ac + adi + bci + bdi\u00b2',
            'Lembre que i\u00b2 = -1, então bdi\u00b2 = -bd',
            'Parte real: ac - bd = ' + re + '; Parte imag: ad+bc = ' + im,
          ],
        };
      },
      // d4: polar form — argument
      function () {
        var cases = [
          { z: '1 + i',     arg: '45', mod: '\u221a2' },
          { z: '\u221a3 + i',    arg: '30', mod: '2'     },
          { z: '1 + \u221a3i',   arg: '60', mod: '2'     },
          { z: '-1 + i',    arg: '135', mod: '\u221a2' },
          { z: 'i',         arg: '90', mod: '1'     },
        ];
        var pick = cases[_randInt(0, cases.length - 1)];
        return {
          statement: 'Qual o argumento (em graus) de z = ' + pick.z + '?',
          equation:  'arg(z) = arctan(b/a)',
          answer:    pick.arg,
          hints: [
            'arg(z) = arctan(Im(z)/Re(z)), ajustando para o quadrante correto.',
            '|z| = ' + pick.mod,
            'arg(z) = ' + pick.arg + '\u00b0',
          ],
        };
      },
      // d5: Euler formula / exponential form
      function () {
        var cases = [
          { desc: 'e^(i\u03c0/2)', re: '0', im: '1', ans: 'i' },
          { desc: 'e^(i\u03c0)',   re: '-1', im: '0', ans: '-1' },
          { desc: 'e^(i\u03c0/3)', re: '1/2', im: '\u221a3/2', ans: '1/2 + (\u221a3/2)i' },
          { desc: 'e^(i\u03c0/4)', re: '\u221a2/2', im: '\u221a2/2', ans: '\u221a2/2 + (\u221a2/2)i' },
        ];
        var pick = cases[_randInt(0, cases.length - 1)];
        return {
          statement: 'Pela fórmula de Euler, expresse ' + pick.desc + ' na forma algébrica.',
          equation:  'e^(i\u03b8) = cos(\u03b8) + i\u00b7sen(\u03b8)',
          answer:    pick.ans,
          hints: [
            'e^(i\u03b8) = cos\u03b8 + i\u00b7sen\u03b8 (fórmula de Euler)',
            'Parte real: cos(\u03b8) = ' + pick.re,
            'Resposta: ' + pick.ans,
          ],
        };
      },
    ];
    var idx = Math.min(difficulty - 1, types.length - 1);
    return types[idx]();
  };

  // ── runge_kutta ────────────────────────────────────────────────────
  // Topics: Euler method review, RK2, RK4 one step, order/error
  MathGenerators['runge_kutta'] = function (difficulty) {
    _reseed();
    var types = [
      // d1: Euler one step
      function () {
        var h = [0.1, 0.2, 0.5][_randInt(0, 2)];
        var y0 = _randInt(1, 3), cases2 = [
          { f: 'y', exact: _round(y0 * Math.exp(h), 4) },
          { f: '-y', exact: _round(y0 * Math.exp(-h), 4) },
        ];
        var pick = cases2[_randInt(0, 1)];
        var euler = _round(y0 + h * (pick.f === 'y' ? y0 : -y0), 4);
        return {
          statement: 'Aplique o método de Euler com h = ' + h + ' para y\' = ' + pick.f + ', y(0) = ' + y0 + '. Qual y(' + h + ')?',
          equation:  'y\u2081 = y\u2080 + h\u00b7f(x\u2080, y\u2080)',
          answer:    String(euler),
          hints: [
            'f(x\u2080, y\u2080) = ' + (pick.f === 'y' ? y0 : -y0),
            'y\u2081 = ' + y0 + ' + ' + h + '\u00b7' + (pick.f === 'y' ? y0 : -y0),
            'y\u2081 = ' + euler,
          ],
        };
      },
      // d2: RK2 (Heun) — k1
      function () {
        var h = 0.1, y0 = 1;
        var k1 = y0;
        var k1r = _round(k1, 4);
        return {
          statement: 'No método de Runge-Kutta de 2ª ordem (Heun), calcule k\u2081 para y\' = y, y(0)=1, h=0.1.',
          equation:  'k\u2081 = f(x\u2080, y\u2080)',
          answer:    '1',
          hints: [
            'k\u2081 = f(0, 1) = y\u2080 = 1',
            'k\u2081 é a inclinação no ponto inicial.',
            'k\u2081 = 1',
          ],
        };
      },
      // d3: RK4 — número de avaliações de função
      function () {
        return {
          statement: 'Quantas avaliações da função f(x,y) são necessárias por passo no método RK4?',
          equation:  'k\u2081, k\u2082, k\u2083, k\u2084',
          answer:    '4',
          hints: [
            'RK4 calcula quatro inclinações: k\u2081, k\u2082, k\u2083, k\u2084.',
            'Cada k\u1d62 requer uma avaliação de f(x,y).',
            'Total: 4 avaliações.',
          ],
        };
      },
      // d4: RK4 order of accuracy
      function () {
        return {
          statement: 'O erro global do método RK4 é da ordem O(h^n). Qual o valor de n?',
          equation:  'E = O(h\u207f)',
          answer:    '4',
          hints: [
            'RK4 tem erro local de O(h\u2075) por passo.',
            'O erro global acumula sobre N = (b-a)/h passos.',
            'Erro global: O(h\u2074), portanto n = 4.',
          ],
        };
      },
      // d5: RK4 one full step
      function () {
        var h = 0.1, y0 = 1;
        // y' = y → y(0.1) ≈ e^0.1 ≈ 1.10517
        var exact = _round(Math.exp(0.1), 5);
        var k1 = y0, k2 = y0 + h/2*k1, k3 = y0 + h/2*k2, k4 = y0 + h*k3;
        var y1 = _round(y0 + h/6*(k1 + 2*k2 + 2*k3 + k4), 5);
        return {
          statement: 'Use RK4 com h=0.1 para y\'=y, y(0)=1. Calcule y(0.1) (5 casas decimais).',
          equation:  'y\u2081 = y\u2080 + (h/6)(k\u2081+2k\u2082+2k\u2083+k\u2084)',
          answer:    String(y1),
          hints: [
            'k\u2081 = 1, k\u2082 = 1 + 0.05\u00b71 = 1.05',
            'k\u2083 = 1 + 0.05\u00b71.05 = 1.0525, k\u2084 = 1 + 0.1\u00b71.0525 = 1.10525',
            'y\u2081 = 1 + (0.1/6)(1 + 2.1 + 2.105 + 1.10525) \u2248 ' + y1,
          ],
        };
      },
    ];
    var idx = Math.min(difficulty - 1, types.length - 1);
    return types[idx]();
  };

  // ── wave_eq ────────────────────────────────────────────────────────
  // u_tt = c² u_xx — separation of variables, d'Alembert, modes
  MathGenerators['wave_eq'] = function (difficulty) {
    _reseed();
    var types = [
      // d1: identify wave equation
      function () {
        return {
          statement: 'A equação u_tt = 9u_xx representa uma equação de onda. Qual a velocidade de propagação c?',
          equation:  'u_tt = c\u00b2 u_xx',
          answer:    '3',
          hints: [
            'Comparando com u_tt = c\u00b2 u_xx, temos c\u00b2 = 9.',
            'c = \u221a9 = 3',
            'c = 3',
          ],
        };
      },
      // d2: d'Alembert solution form
      function () {
        return {
          statement: 'A solução geral de d\'Alembert para u_tt = c²u_xx é u(x,t) = f(x-ct) + g(x+ct). O que representa cada termo?',
          equation:  'u = f(x-ct) + g(x+ct)',
          answer:    'ondas viajantes',
          hints: [
            'f(x-ct): onda se propagando para a direita.',
            'g(x+ct): onda se propagando para a esquerda.',
            'Resposta: ondas viajantes',
          ],
        };
      },
      // d3: frequencies of modes
      function () {
        var c = _randInt(1, 3), L = _randInt(1, 3);
        var f1 = _round(c / (2*L), 4);
        return {
          statement: 'Para a equação de onda com c=' + c + ' e corda de comprimento L=' + L + ', qual a frequência fundamental (n=1)?',
          equation:  'f_n = nc/(2L)',
          answer:    String(f1),
          hints: [
            'f_n = nc/(2L)',
            'Para n=1: f\u2081 = c/(2L)',
            'f\u2081 = ' + c + '/(2\u00d7' + L + ') = ' + f1,
          ],
        };
      },
      // d4: normal mode
      function () {
        var n = _randInt(1, 3), L = 1;
        return {
          statement: 'Escreva o n-ésimo modo normal da equação de onda em [0,1] com condições u(0,t)=u(1,t)=0. Use n=' + n + '.',
          equation:  'u_n = sen(n\u03c0x/L)\u00b7(A cos(\u03c9t) + B sen(\u03c9t))',
          answer:    'sen(' + n + '\u03c0x)',
          hints: [
            'As condições de contorno exigem sen(n\u03c0x/L).',
            'Para L=1 e n=' + n + ': parte espacial = sen(' + n + '\u03c0x).',
            'Resposta: sen(' + n + '\u03c0x)',
          ],
        };
      },
      // d5: energy conservation
      function () {
        return {
          statement: 'A energia total E(t) = (1/2)∫[u_t² + c²u_x²]dx é conservada na equação de onda. Isso implica que dE/dt é igual a:',
          equation:  'E(t) = (1/2)\u222b(u_t\u00b2 + c\u00b2u_x\u00b2)dx',
          answer:    '0',
          hints: [
            'A equação de onda não dissipa energia.',
            'Multiplicando u_tt = c\u00b2u_xx por u_t e integrando: d/dt E(t) = 0.',
            'dE/dt = 0',
          ],
        };
      },
    ];
    var idx = Math.min(difficulty - 1, types.length - 1);
    return types[idx]();
  };

  // ── interpolation ──────────────────────────────────────────────────
  // Lagrange interpolation, Newton divided differences, error
  MathGenerators['interpolation'] = function (difficulty) {
    _reseed();
    var types = [
      // d1: linear interpolation
      function () {
        var x0 = _randInt(0, 3), y0 = _randInt(1, 5);
        var x1 = x0 + _randInt(1, 3), y1 = _randInt(1, 8);
        var xq = x0 + 1;
        var yq = _round(y0 + (y1 - y0) * (xq - x0) / (x1 - x0), 4);
        return {
          statement: 'Dado f(' + x0 + ')=' + y0 + ' e f(' + x1 + ')=' + y1 + ', estime f(' + xq + ') por interpolação linear.',
          equation:  'f(x) \u2248 f(x\u2080) + [f(x\u2081)-f(x\u2080)]/(x\u2081-x\u2080)\u00b7(x-x\u2080)',
          answer:    String(yq),
          hints: [
            'Inclinação: [' + y1 + '-' + y0 + ']/[' + x1 + '-' + x0 + '] = ' + _round((y1-y0)/(x1-x0), 4),
            'f(' + xq + ') = ' + y0 + ' + inclinação \u00d7 (' + xq + '-' + x0 + ')',
            'f(' + xq + ') = ' + yq,
          ],
        };
      },
      // d2: Lagrange basis polynomial L0
      function () {
        return {
          statement: 'Para os nós x\u2080=0 e x\u2081=2, qual é o polinômio de Lagrange L\u2080(x)?',
          equation:  'L\u2080(x) = \u220f_{j\u22600} (x-x_j)/(x\u2080-x_j)',
          answer:    '(x-2)/(-2)',
          hints: [
            'L\u2080(x) = (x-x\u2081)/(x\u2080-x\u2081)',
            '= (x-2)/(0-2)',
            '= (x-2)/(-2)',
          ],
        };
      },
      // d3: divided difference [x0,x1]
      function () {
        var x0 = 0, y0 = _randInt(1, 4);
        var x1 = _randInt(1, 3), y1 = y0 + _randInt(1, 6);
        var dd = _round((y1 - y0) / (x1 - x0), 4);
        return {
          statement: 'Calcule a diferença dividida f[x\u2080,x\u2081] com x\u2080=' + x0 + ', f(x\u2080)=' + y0 + ', x\u2081=' + x1 + ', f(x\u2081)=' + y1 + '.',
          equation:  'f[x\u2080,x\u2081] = (f(x\u2081)-f(x\u2080))/(x\u2081-x\u2080)',
          answer:    String(dd),
          hints: [
            'f[x\u2080,x\u2081] = (' + y1 + '-' + y0 + ')/(' + x1 + '-' + x0 + ')',
            '= ' + (y1-y0) + '/' + (x1-x0),
            '= ' + dd,
          ],
        };
      },
      // d4: Newton interpolation polynomial degree
      function () {
        var n = _randInt(3, 5);
        return {
          statement: 'Com ' + (n+1) + ' nós distintos, qual o grau máximo do polinômio interpolador de Newton?',
          equation:  'p_n(x) = f[x\u2080] + f[x\u2080,x\u2081](x-x\u2080) + ...',
          answer:    String(n),
          hints: [
            'Com n+1 nós, o polinômio tem grau \u2264 n.',
            (n+1) + ' nós → grau máximo = ' + n,
            'Resposta: ' + n,
          ],
        };
      },
      // d5: interpolation error bound
      function () {
        return {
          statement: 'O erro de interpolação com n+1 nós é E(x) = f^(n+1)(ξ)/(n+1)! · ω(x). O que é ω(x)?',
          equation:  'E(x) = f^(n+1)(\u03be)/(n+1)! \u00b7 \u03c9(x)',
          answer:    '\u220f(x-x\u1d62)',
          hints: [
            '\u03c9(x) é o polinômio nodal.',
            '\u03c9(x) = (x-x\u2080)(x-x\u2081)\u22ef(x-x_n)',
            '\u03c9(x) = \u220f(x-x\u1d62)',
          ],
        };
      },
    ];
    var idx = Math.min(difficulty - 1, types.length - 1);
    return types[idx]();
  };

  // ── ode_systems ────────────────────────────────────────────────────
  // 2×2 linear systems: eigenvalue method, phase plane, stability
  MathGenerators['ode_systems'] = function (difficulty) {
    _reseed();
    var types = [
      // d1: convert to system
      function () {
        return {
          statement: 'Converta a EDO de 2ª ordem y\'\' - 5y\' + 6y = 0 em sistema de 1ª ordem. Qual a dimensão do sistema?',
          equation:  'x\u2081 = y,  x\u2082 = y\'',
          answer:    '2',
          hints: [
            'Defina x\u2081 = y e x\u2082 = y\'.',
            'x\u2081\' = x\u2082; x\u2082\' = 5x\u2082 - 6x\u2081',
            'Sistema 2\u00d72 → dimensão 2.',
          ],
        };
      },
      // d2: eigenvalues of 2x2
      function () {
        var cases = [
          { A: '[[2,0],[0,3]]',   eigs: '2 e 3',  desc: '2\u00d72 diagonal' },
          { A: '[[1,1],[-1,3]]',  eigs: '2',       desc: 'autovalor repetido' },
          { A: '[[0,-1],[1,0]]',  eigs: '\u00b1i',  desc: 'puramente imaginários' },
        ];
        var pick = cases[_randInt(0, cases.length - 1)];
        return {
          statement: 'Quais os autovalores da matriz ' + pick.A + ' (' + pick.desc + ')?',
          equation:  'det(A - \u03bbI) = 0',
          answer:    pick.eigs,
          hints: [
            'Resolva det(A-\u03bbI)=0.',
            'Expanda o determinante e fatore.',
            'Autovalores: ' + pick.eigs,
          ],
        };
      },
      // d3: stability from eigenvalues
      function () {
        var cases2 = [
          { eigs: 'Re(\u03bb) < 0', stability: 'estável' },
          { eigs: 'Re(\u03bb) > 0', stability: 'instável' },
          { eigs: 'Re(\u03bb) = 0', stability: 'centro' },
        ];
        var pick = cases2[_randInt(0, 2)];
        return {
          statement: 'Se todos os autovalores de A satisfazem ' + pick.eigs + ', o ponto de equilíbrio é:',
          equation:  'x\' = Ax',
          answer:    pick.stability,
          hints: [
            'Autovalores com parte real negativa → soluções decaem.',
            'Autovalores com parte real positiva → soluções crescem.',
            'Resposta: ' + pick.stability,
          ],
        };
      },
      // d4: solution form
      function () {
        var l1 = _randInt(1, 3), l2 = _randInt(1, 3) + 3;
        return {
          statement: 'O sistema x\'=Ax tem autovalores \u03bb\u2081=' + l1 + ' e \u03bb\u2082=' + l2 + '. A solução geral tem a forma:',
          equation:  'x(t) = c\u2081v\u2081e^(\u03bb\u2081t) + c\u2082v\u2082e^(\u03bb\u2082t)',
          answer:    'c\u2081v\u2081e^(' + l1 + 't) + c\u2082v\u2082e^(' + l2 + 't)',
          hints: [
            'Autovalores distintos reais → solução é combinação linear.',
            'x(t) = c\u2081v\u2081e^(\u03bb\u2081t) + c\u2082v\u2082e^(\u03bb\u2082t)',
            'c\u2081v\u2081e^(' + l1 + 't) + c\u2082v\u2082e^(' + l2 + 't)',
          ],
        };
      },
      // d5: phase plane classification
      function () {
        var cases3 = [
          { desc: 'dois autovalores reais negativos distintos',  type: 'nó estável'  },
          { desc: 'dois autovalores reais positivos distintos',  type: 'nó instável' },
          { desc: 'autovalores reais de sinais opostos',         type: 'ponto de sela' },
          { desc: 'autovalores complexos com parte real < 0',    type: 'espiral estável' },
        ];
        var pick = cases3[_randInt(0, 3)];
        return {
          statement: 'Com ' + pick.desc + ', o retrato de fase é classificado como:',
          equation:  'x\' = Ax,  \u03bb\u2208\u2102',
          answer:    pick.type,
          hints: [
            'O tipo de ponto crítico depende do sinal e natureza dos autovalores.',
            'Autovalores reais do mesmo sinal → nó. Sinais opostos → sela.',
            'Resposta: ' + pick.type,
          ],
        };
      },
    ];
    var idx = Math.min(difficulty - 1, types.length - 1);
    return types[idx]();
  };

})();
