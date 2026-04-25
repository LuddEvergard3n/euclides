/**
 * math/generators/batch3.js
 * Generators: lagrange, linear_prog, markov, graph_theory, heat_eq
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  function _round(v, dec) {
    var f = Math.pow(10, dec); return Math.round(v * f) / f;
  }

  // ── lagrange ──────────────────────────────────────────────────────
  MathGenerators['lagrange'] = function (difficulty) {
    _reseed();
    // Optimize f(x,y) subject to g(x,y)=0
    // All cases have closed-form integer or simple-decimal solutions
    var cases = [
      // maximize f=xy, s.t. x+y=8 → x=y=4, max=16
      { fDesc:'f(x,y) = xy', gDesc:'x + y = 8',
        answer:'16', answerDesc:'f_max = 16 em (4,4)',
        sol:'x=4, y=4',
        steps:[
          '\u2207f = \u03bb\u2207g: (y, x) = \u03bb(1, 1)',
          'y = \u03bb e x = \u03bb \u2192 x = y',
          'Substituir em x+y=8: 2x=8 \u2192 x=4, y=4',
          'f(4,4) = 16',
        ]},
      // minimize f=x²+y², s.t. x+y=4 → x=y=2, min=8
      { fDesc:'f(x,y) = x\u00b2 + y\u00b2', gDesc:'x + y = 4',
        answer:'8', answerDesc:'f_min = 8 em (2,2)',
        sol:'x=2, y=2',
        steps:[
          '\u2207f = \u03bb\u2207g: (2x, 2y) = \u03bb(1, 1)',
          '2x = \u03bb e 2y = \u03bb \u2192 x = y',
          'x+y=4 \u2192 x=y=2',
          'f(2,2) = 4+4 = 8',
        ]},
      // maximize f=x²y, s.t. x+2y=6 → x=4, y=1, max=16 (wait: critical: ∂f/∂x=2xy=λ, ∂f/∂y=x²=2λ → x²=4xy → x=4y, then 4y+2y=6→y=1,x=4, f=16)
      { fDesc:'f(x,y) = x\u00b2 y', gDesc:'x + 2y = 6',
        answer:'16', answerDesc:'f_max = 16 em (4,1)',
        sol:'x=4, y=1',
        steps:[
          '\u2207f = \u03bb\u2207g: (2xy, x\u00b2) = \u03bb(1, 2)',
          '2xy = \u03bb e x\u00b2 = 2\u03bb \u2192 x\u00b2 = 4xy \u2192 x = 4y',
          'Substituir: 4y+2y=6 \u2192 y=1, x=4',
          'f(4,1) = 16\u00b71 = 16',
        ]},
      // maximize f=xy, s.t. x²+y²=50 → x=y=5, max=25
      { fDesc:'f(x,y) = xy', gDesc:'x\u00b2 + y\u00b2 = 50',
        answer:'25', answerDesc:'f_max = 25 em (5,5)',
        sol:'x=5, y=5',
        steps:[
          '\u2207f = \u03bb\u2207g: (y, x) = \u03bb(2x, 2y)',
          'y = 2\u03bbx e x = 2\u03bby \u2192 y\u00b2 = 4\u03bb\u00b2x\u00b2 \u2192 y=x (ou y=\u2212x)',
          'x\u00b2+x\u00b2=50 \u2192 x=5, y=5',
          'f(5,5) = 25',
        ]},
      // 3-var: maximize f=xyz, s.t. x+y+z=3 → x=y=z=1, max=1
      { fDesc:'f(x,y,z) = xyz', gDesc:'x + y + z = 3',
        answer:'1', answerDesc:'f_max = 1 em (1,1,1)',
        sol:'x=y=z=1',
        steps:[
          '\u2207f = \u03bb\u2207g: (yz, xz, xy) = \u03bb(1,1,1)',
          'yz = xz = xy = \u03bb \u2192 x = y = z',
          'x+y+z=3 \u2192 x=y=z=1',
          'f(1,1,1) = 1',
        ]},
    ];
    var cas = cases[Math.min(difficulty-1, cases.length-1)];
    var types = ['find_max','find_point','lambda','verify','three_var'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'find_max') {
      return {
        statement: 'Use Multiplicadores de Lagrange para otimizar ' + cas.fDesc + ' sujeito a ' + cas.gDesc + '. Qual o valor ótimo?',
        equation:  '\u2207f = \u03bb\u2207g,  g(x,y) = 0',
        answer:    cas.answer,
        hints:     cas.steps,
      };
    }
    if (type === 'find_point') {
      return {
        statement: 'Qual o ponto ótimo de ' + cas.fDesc + ' com restrição ' + cas.gDesc + '?',
        equation:  '\u2207f = \u03bb\u2207g',
        answer:    cas.sol,
        hints:     cas.steps,
      };
    }
    if (type === 'lambda') {
      return {
        statement: 'Em que condição o método de Lagrange encontra extremos de f(x,y) sujeito a g(x,y)=0?',
        equation:  '\u2207f = \u03bb\u2207g  (gradientes paralelos)',
        answer:    '\u2207f = \u03bb\u2207g',
        hints: ['O gradiente de f deve ser paralelo ao gradiente de g no ponto ótimo.'],
      };
    }
    if (type === 'verify') {
      return {
        statement: 'Verifique que (' + cas.sol.replace(', ', ',') + ') satisfaz \u2207f = \u03bb\u2207g para ' + cas.fDesc + ' com g: ' + cas.gDesc + '.',
        equation:  '\u2207f = \u03bb\u2207g no ponto ótimo',
        answer:    cas.answer,
        hints:     cas.steps,
      };
    }
    return {
      statement: 'Otimize ' + cas.fDesc + ' com restrição ' + cas.gDesc + '. Valor ótimo?',
      equation:  '\u2207f = \u03bb\u2207g,  g = 0',
      answer:    cas.answer,
      hints:     cas.steps,
    };
  };

  // ── linear_prog ───────────────────────────────────────────────────
  MathGenerators['linear_prog'] = function (difficulty) {
    _reseed();
    // Simple 2D LP with graphical solution — vertices are integer points
    var problems = [
      // max 3x+2y, x+y≤4, x≥0, y≥0 → vertices: (0,0),(4,0),(0,4) → max at (4,0)=12
      { obj:'3x+2y', constraints:['x+y \u2264 4','x \u2265 0','y \u2265 0'],
        vertices:['(0,0)','(4,0)','(0,4)'], values:[0,12,8], max:12, maxPt:'(4,0)',
        type:'max'},
      // max 2x+3y, x+2y≤8, 2x+y≤8, x≥0,y≥0 → vertex (8/3,8/3) or check corners
      // corners: (0,0)→0, (4,0)→8, (0,4)→12, (8/3,8/3)→(16+24)/3=40/3≈13.3
      { obj:'2x+3y', constraints:['x+2y \u2264 8','2x+y \u2264 8','x \u2265 0','y \u2265 0'],
        vertices:['(0,0)','(4,0)','(0,4)','(8/3, 8/3)'], values:[0,8,12,_round(40/3,2)],
        max:_round(40/3,2), maxPt:'(8/3, 8/3)', type:'max'},
      // min x+2y, x+y≥3, x≥1, y≥0 → corners: (1,2)→5, (3,0)→3, (1,0)→N/A(not feasible since y≥0, x+y≥3,x≥1 → y≥2 at x=1)
      // Actually: x≥1, y≥0, x+y≥3. At x=1:y≥2→(1,2). At x=3:y≥0→(3,0). Min at (3,0)=3.
      { obj:'x+2y', constraints:['x+y \u2265 3','x \u2265 1','y \u2265 0'],
        vertices:['(1,2)','(3,0)'], values:[5,3], max:3, maxPt:'(3,0)', type:'min'},
      // max 5x+4y, 6x+4y≤24, x+2y≤6, x≥0,y≥0
      // corners: (0,0)→0, (4,0)→20, (3,1.5)→5*3+4*1.5=21, (0,3)→12
      { obj:'5x+4y', constraints:['6x+4y \u2264 24','x+2y \u2264 6','x \u2265 0','y \u2265 0'],
        vertices:['(0,0)','(4,0)','(3,1.5)','(0,3)'], values:[0,20,21,12],
        max:21, maxPt:'(3, 1.5)', type:'max'},
      // max z=x+y, 2x+y≤14, x+2y≤14, x≥0,y≥0 → corner (14/3,14/3)→28/3≈9.33
      { obj:'x+y', constraints:['2x+y \u2264 14','x+2y \u2264 14','x \u2265 0','y \u2265 0'],
        vertices:['(0,0)','(7,0)','(14/3,14/3)','(0,7)'], values:[0,7,_round(28/3,2),7],
        max:_round(28/3,2), maxPt:'(14/3, 14/3)', type:'max'},
    ];
    var pr = problems[Math.min(difficulty-1, problems.length-1)];
    var types = ['max_value','max_point','vertices','simplex_idea','feasible'];
    var type  = types[Math.min(difficulty-1, 4)];

    var constraintStr = pr.constraints.join(', ');

    if (type === 'max_value') {
      return {
        statement: (pr.type==='max'?'Maximize':'Minimize') + ' z = ' + pr.obj + ' sujeito a: ' + constraintStr + '. Qual o valor ótimo de z?',
        equation:  (pr.type==='max'?'max':'min') + ' z = ' + pr.obj,
        answer:    String(pr.max),
        hints: [
          'Identifique os vértices da região viável',
          'Vértices: ' + pr.vertices.join(', '),
          'Avalie z em cada vértice: ' + pr.vertices.map(function(v,i){return v+'→'+pr.values[i];}).join(', '),
        ],
      };
    }
    if (type === 'max_point') {
      return {
        statement: (pr.type==='max'?'Maximize':'Minimize') + ' z = ' + pr.obj + ' com: ' + constraintStr + '. Qual o ponto ótimo?',
        equation:  'Método gráfico: avaliar z nos vértices',
        answer:    pr.maxPt,
        hints: [
          'Vértices da região viável: ' + pr.vertices.join(', '),
          'Valores de z: ' + pr.vertices.map(function(v,i){return v+'→'+pr.values[i];}).join(', '),
        ],
      };
    }
    if (type === 'vertices') {
      return {
        statement: 'Quais são os vértices da região viável de: ' + constraintStr + '?',
        equation:  'Resolver interseções das fronteiras',
        answer:    pr.vertices.join(', '),
        hints: ['Cada vértice é a interseção de duas fronteiras ativas.'],
      };
    }
    if (type === 'simplex_idea') {
      return {
        statement: 'O Teorema Fundamental da PL afirma que o ótimo de uma PL, se existir, ocorre em um __.',
        equation:  'max/min z = cᵀx, Ax ≤ b, x ≥ 0',
        answer:    'vértice',
        hints: ['O ótimo sempre ocorre em um vértice (ponto extremo) da região viável poliédrica.'],
      };
    }
    return {
      statement: 'Um ponto (x,y) é viável para ' + constraintStr + ' se satisfaz todas as restrições. O ponto (2,1) é viável?',
      equation:  'Verificar todas as restrições',
      answer:    (function(){
        // Check (2,1) for first problem
        return 'Sim';
      })(),
      hints: ['Substitua x=2, y=1 em cada restrição e verifique.'],
    };
  };

  // ── markov ────────────────────────────────────────────────────────
  MathGenerators['markov'] = function (difficulty) {
    _reseed();
    // Markov chains with small state spaces, integer-ratio transitions
    var chains = [
      // 2-state: P=[[0.7,0.3],[0.4,0.6]], stationary: π=[4/7, 3/7]≈[0.571, 0.429]
      { P:[[0.7,0.3],[0.4,0.6]], states:['A','B'],
        stationary:[_round(4/7,4), _round(3/7,4)],
        stationaryStr:'(0.5714, 0.4286)',
        oneStep_from_A_to_B:'0.3',
        twoStep_AA: _round(0.7*0.7+0.3*0.4,4) },
      // 2-state: P=[[0.8,0.2],[0.5,0.5]], stationary: [5/7,2/7]≈[0.714, 0.286]
      { P:[[0.8,0.2],[0.5,0.5]], states:['A','B'],
        stationary:[_round(5/7,4), _round(2/7,4)],
        stationaryStr:'(0.7143, 0.2857)',
        oneStep_from_A_to_B:'0.2',
        twoStep_AA: _round(0.8*0.8+0.2*0.5,4) },
      { P:[[0.6,0.4],[0.2,0.8]], states:['A','B'],
        stationary:[_round(1/3,4), _round(2/3,4)],
        stationaryStr:'(0.3333, 0.6667)',
        oneStep_from_A_to_B:'0.4',
        twoStep_AA: _round(0.6*0.6+0.4*0.2,4) },
      { P:[[0.9,0.1],[0.3,0.7]], states:['A','B'],
        stationary:[_round(3/4,4), _round(1/4,4)],
        stationaryStr:'(0.75, 0.25)',
        oneStep_from_A_to_B:'0.1',
        twoStep_AA: _round(0.9*0.9+0.1*0.3,4) },
      // 3-state: uniform stationary
      { P:[[0.5,0.25,0.25],[0.25,0.5,0.25],[0.25,0.25,0.5]], states:['A','B','C'],
        stationary:[_round(1/3,4),_round(1/3,4),_round(1/3,4)],
        stationaryStr:'(1/3, 1/3, 1/3)',
        oneStep_from_A_to_B:'0.25',
        twoStep_AA: _round(0.5*0.5+0.25*0.25+0.25*0.25,4) },
    ];
    var ch = chains[Math.min(difficulty-1, chains.length-1)];
    var types = ['one_step','two_step','stationary_eqn','stationary_val','absorbing'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'one_step') {
      return {
        statement: 'Cadeia de Markov com P(A→B) = ' + ch.P[0][1] + ' e P(B→A) = ' + ch.P[1][0] + '. Qual a probabilidade de ir do estado A para B em um passo?',
        equation:  'P = matriz de transição',
        answer:    ch.oneStep_from_A_to_B,
        hints: ['P(A→B) é a entrada P[A][B] da matriz de transição.'],
      };
    }
    if (type === 'two_step') {
      return {
        statement: 'Com P = [[' + ch.P[0].join(',') + '],[' + ch.P[1].join(',') + ']], qual P²[A][A] (prob. de A→A em 2 passos)?',
        equation:  'P² = P\u00b7P,  P\u00b2[i][j] = \u03a3\u2096 P[i][k]\u00b7P[k][j]',
        answer:    String(ch.twoStep_AA),
        hints: [
          'P\u00b2[A][A] = P[A][A]\u00b7P[A][A] + P[A][B]\u00b7P[B][A]',
          '= ' + ch.P[0][0] + '\u00b7' + ch.P[0][0] + ' + ' + ch.P[0][1] + '\u00b7' + ch.P[1][0],
        ],
      };
    }
    if (type === 'stationary_eqn') {
      return {
        statement: 'A distribuição estacionária \u03c0 de uma cadeia de Markov satisfaz qual equação?',
        equation:  '\u03c0 = \u03c0P  e  \u03a3\u03c0\u1d62 = 1',
        answer:    '\u03c0P = \u03c0',
        hints: [
          '\u03c0 é o autovetor esquerdo de P para autovalor 1.',
          'Equivalentemente: \u03c0\u1d62 = \u03a3\u2c7c \u03c0\u2c7c P[\u2c7c][\u1d62]',
        ],
      };
    }
    if (type === 'stationary_val') {
      return {
        statement: 'Calcule a distribuição estacionária \u03c0 para P = [[' + ch.P[0].join(',') + '],[' + ch.P[1].join(',') + ']].',
        equation:  '\u03c0\u2081 = \u03c0\u2081P\u2081\u2081 + \u03c0\u2082P\u2082\u2081,  \u03c0\u2081+\u03c0\u2082 = 1',
        answer:    ch.stationaryStr,
        hints: [
          '\u03c0\u2081(1-' + ch.P[0][0] + ') = \u03c0\u2082\u00b7' + ch.P[1][0],
          '\u03c0\u2081\u00b7' + ch.P[0][1] + ' = \u03c0\u2082\u00b7' + ch.P[1][0],
          '\u03c0 = ' + ch.stationaryStr,
        ],
      };
    }
    return {
      statement: 'Uma cadeia de Markov tem estado absorvente. Qual propriedade define um estado absorvente?',
      equation:  'P[i][i] = 1  (estado absorvente)',
      answer:    'P(i\u2192i) = 1',
      hints: ['Uma vez no estado i, a cadeia nunca sai: P[i][i]=1 e P[i][j]=0 para j\u2260i.'],
    };
  };

  // ── graph_theory ──────────────────────────────────────────────────
  MathGenerators['graph_theory'] = function (difficulty) {
    _reseed();
    var types = ['degree','euler','path','spanning','chromatic'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'degree') {
      // Sum of degrees = 2|E|
      var E = _randInt(3,8) + difficulty;
      var V = _randInt(3,6);
      return {
        statement: 'Um grafo tem ' + V + ' vértices e ' + E + ' arestas. Qual a soma dos graus de todos os vértices?',
        equation:  '\u03a3 grau(v) = 2|E|',
        answer:    String(2*E),
        hints: ['Cada aresta contribui com 2 para a soma dos graus (um para cada extremo).'],
      };
    }
    if (type === 'euler') {
      // Euler circuit condition
      var opts = [
        { desc:'K\u2084 (4 vértices, todos conectados)', degrees:[3,3,3,3], hasEuler:true },
        { desc:'grafo com graus [2,2,3,3]', degrees:[2,2,3,3], hasEuler:false },
        { desc:'ciclo C\u2085 (5 vértices em ciclo)', degrees:[2,2,2,2,2], hasEuler:true },
        { desc:'K\u2083,\u2083 (bipartido completo)', degrees:[3,3,3,3,3,3], hasEuler:false },
      ];
      var opt = opts[Math.min(difficulty-1,3)];
      return {
        statement: 'O grafo ' + opt.desc + ' (graus: ' + opt.degrees.join(',') + ') possui circuito Euleriano?',
        equation:  'Circuito Euleriano \u21d4 todos os graus pares e grafo conexo',
        answer:    opt.hasEuler ? 'Sim' : 'Não',
        hints: [
          'Verifique se todos os graus são pares.',
          opt.hasEuler ? 'Todos pares \u2192 Sim' : 'Existem graus ímpares (' + opt.degrees.filter(function(d){return d%2!==0;}).join(',') + ') \u2192 Não',
        ],
      };
    }
    if (type === 'path') {
      // Shortest path / BFS distance
      var graphs = [
        { desc:'A-B-C-D (caminho linear)', from:'A', to:'D', edges:'AB,BC,CD', dist:3 },
        { desc:'A conectado a B,C; B e C conectados a D', from:'A', to:'D', edges:'AB,AC,BD,CD', dist:2 },
        { desc:'A-B(w=2), A-C(w=5), B-D(w=1), C-D(w=1)', from:'A', to:'D', edges:'A-B(2),A-C(5),B-D(1),C-D(1)', dist:3 },
      ];
      var g = graphs[Math.min(difficulty-1,2)];
      return {
        statement: 'No grafo com arestas {' + g.edges + '}, qual a distância (número de arestas no caminho mínimo) de ' + g.from + ' a ' + g.to + '?',
        equation:  'BFS: distância = menor número de arestas',
        answer:    String(g.dist),
        hints: ['Use BFS a partir de ' + g.from + '.'],
      };
    }
    if (type === 'spanning') {
      // Number of spanning trees (Cayley: n^(n-2))
      var cases = [
        {n:3, ans:1}, {n:4, ans:16}, {n:2, ans:1}, {n:5, ans:125},
      ];
      var cas = cases[Math.min(difficulty-1,3)];
      return {
        statement: 'Pelo Teorema de Cayley, quantas árvores geradoras rotuladas existem em K' + cas.n + ' (grafo completo com ' + cas.n + ' vértices)?',
        equation:  'T(K\u2099) = n^(n-2)',
        answer:    String(cas.ans),
        hints: [
          'Fórmula de Cayley: T = n^(n-2)',
          cas.n + '^(' + cas.n + '-2) = ' + cas.n + '^' + (cas.n-2) + ' = ' + cas.ans,
        ],
      };
    }
    // chromatic
    var graphs2 = [
      { desc:'K\u2083 (triângulo)', chr:3 },
      { desc:'C\u2084 (ciclo de 4 vértices)', chr:2 },
      { desc:'K\u2084', chr:4 },
      { desc:'caminho P\u2085 (5 vértices em sequência)', chr:2 },
      { desc:'K\u2083,\u2083 (bipartido completo)', chr:2 },
    ];
    var gr = graphs2[Math.min(difficulty-1,4)];
    return {
      statement: 'Qual o número cromático \u03c7 do grafo ' + gr.desc + '?',
      equation:  '\u03c7(G) = número mínimo de cores para colorir G sem conflitos',
      answer:    String(gr.chr),
      hints: [
        'Clique máximo \u2264 \u03c7(G)',
        'Grafo bipartido: \u03c7 = 2 (se não vazio)',
        '\u03c7(' + gr.desc + ') = ' + gr.chr,
      ],
    };
  };

  // ── heat_eq ───────────────────────────────────────────────────────
  MathGenerators['heat_eq'] = function (difficulty) {
    _reseed();
    var types = ['identify','solution_form','boundary','separation','fourier_coeff'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'identify') {
      return {
        statement: 'A equação do calor em 1D é \u2202u/\u2202t = k\u00b7\u2202\u00b2u/\u2202x\u00b2. Que tipo de EDP é essa?',
        equation:  'u\u209c = k\u00b7u\u2093\u2093',
        answer:    'parabólica',
        hints: [
          'Classificação: au\u2093\u2093 + bu\u2093\u209c + cu\u209c\u209c = ...',
          'Aqui a=k, b=0, c=0 \u2192 discriminante B\u00b2-4AC = 0 \u2192 parabólica.',
          'Equações parabólicas modelam difusão e condução de calor.',
        ],
      };
    }
    if (type === 'solution_form') {
      return {
        statement: 'A separação de variáveis u(x,t) = X(x)T(t) na equação do calor u\u209c = k\u00b7u\u2093\u2093 produz quais EDOs?',
        equation:  'T\'(t)/T(t) = k\u00b7X\'\'(x)/X(x) = \u2212\u03bbk',
        answer:    'X\'\'+ \u03bbX = 0 e T\' + \u03bbkT = 0',
        hints: [
          'Separar: T\'/(kT) = X\'\'/X = \u2212\u03bb (constante de separação)',
          'EDO em X: X\'\'+\u03bbX=0 (Sturm-Liouville)',
          'EDO em T: T\'+\u03bbkT=0 \u2192 T(t)=e^(-\u03bbkt)',
        ],
      };
    }
    if (type === 'boundary') {
      return {
        statement: 'Para a equação do calor com u(0,t)=u(L,t)=0 (extremos fixos a 0), quais são as autofunções Xₙ(x)?',
        equation:  'X\'\'+\u03bbX=0, X(0)=X(L)=0',
        answer:    'Xₙ(x) = sin(n\u03c0x/L)',
        hints: [
          'Com X(0)=0: X=A sin(\u221a\u03bb x) + B cos(\u221a\u03bb x), B=0',
          'Com X(L)=0: sin(\u221a\u03bb L)=0 \u2192 \u221a\u03bb = n\u03c0/L',
          'Xₙ(x) = sin(n\u03c0x/L),  \u03bbₙ = (n\u03c0/L)\u00b2',
        ],
      };
    }
    if (type === 'separation') {
      return {
        statement: 'Dadas autofunções Xₙ=sin(n\u03c0x/L) e T\'ₙ+\u03bbₙkTₙ=0, qual a forma geral de Tₙ(t)?',
        equation:  'T\'ₙ + (n\u03c0/L)\u00b2 k Tₙ = 0',
        answer:    'Tₙ(t) = e^(-(n\u03c0/L)\u00b2 kt)',
        hints: [
          'EDO linear de 1\u00aa ordem em T',
          'Fator integrante: \u03bc=e^(\u03bbₙkt)',
          'Tₙ(t) = Cₙ e^(-\u03bbₙkt)',
        ],
      };
    }
    // fourier_coeff
    return {
      statement: 'A solução u(x,0) = f(x) para a equação do calor em [0,L] determina os coeficientes Bₙ por qual fórmula?',
      equation:  'u(x,0) = \u03a3 Bₙ sin(n\u03c0x/L)',
      answer:    'Bₙ = (2/L)\u222f\u2080\u1d3f f(x) sin(n\u03c0x/L) dx',
      hints: [
        'Usar ortogonalidade: \u222f\u2080\u1d3f sin(m\u03c0x/L)sin(n\u03c0x/L)dx = L/2 \u03b4\u2098\u2099',
        'Multiplicar por sin(m\u03c0x/L) e integrar: Bₙ = (2/L)\u222f f(x)sin(n\u03c0x/L)dx',
      ],
    };
  };

})();
