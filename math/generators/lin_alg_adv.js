/**
 * math/generators/lin_alg_adv.js
 * Generators: Gram-Schmidt, Fatoração LU, Formas Quadráticas
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  function _round(v, dec) {
    var f = Math.pow(10, dec); return Math.round(v * f) / f;
  }
  function _dot(a, b)  { return a.reduce(function(s,v,i){ return s+v*b[i]; }, 0); }
  function _norm(v)    { return Math.sqrt(_dot(v,v)); }
  function _scale(v,s) { return v.map(function(x){ return _round(x*s,4); }); }
  function _sub(a,b)   { return a.map(function(v,i){ return _round(v-b[i],4); }); }
  function _proj(u,v)  { var d=_dot(u,v),n=_dot(u,u); return u.map(function(x){ return _round(x*d/n,4); }); }

  // ── gram_schmidt ──────────────────────────────────────────────────
  MathGenerators['gram_schmidt'] = function (difficulty) {
    _reseed();
    var sets = [
      { vecs:[[1,0],[1,1]],           dim:2 },
      { vecs:[[1,1],[1,-1]],          dim:2 },
      { vecs:[[1,0,0],[1,1,0],[0,1,1]],dim:3 },
      { vecs:[[2,1],[3,-1]],          dim:2 },
      { vecs:[[1,1,0],[0,1,1],[1,0,1]],dim:3 },
    ];
    var s = sets[Math.min(difficulty-1, sets.length-1)];
    var vs = s.vecs;

    // Gram-Schmidt
    var us = [];
    vs.forEach(function(v) {
      var u = v.slice();
      us.forEach(function(uj) { u = _sub(u, _proj(uj, v)); });
      us.push(u);
    });
    var qs = us.map(function(u) { var n=_norm(u); return u.map(function(x){return _round(x/n,4);}); });

    var types = ['first_vec','second_vec','orthogonal_check','normalize','full'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'first_vec') {
      return {
        statement: 'Aplique Gram-Schmidt ao conjunto {' + vs.map(function(v){return '('+v.join(',')+')';}).join(', ') + '}. Qual é o primeiro vetor ortonormal q₁?',
        equation:  'q₁ = v₁/||v₁||',
        answer:    '(' + qs[0].join(', ') + ')',
        hints: ['||v₁|| = ' + _round(_norm(vs[0]),4), 'q₁ = v₁/' + _round(_norm(vs[0]),4)],
      };
    }
    if (type === 'second_vec') {
      return {
        statement: 'No processo de Gram-Schmidt, calcule u₂ = v₂ − proj_{u₁}(v₂) para v₁=' + JSON.stringify(vs[0]) + ', v₂=' + JSON.stringify(vs[1]) + '.',
        equation:  'u₂ = v₂ − (v₂·u₁/u₁·u₁)u₁',
        answer:    '(' + us[1].join(', ') + ')',
        hints: [
          'v₂·u₁ = ' + _round(_dot(vs[1], us[0]),4),
          'u₁·u₁ = ' + _round(_dot(us[0], us[0]),4),
          'proj = ' + JSON.stringify(_proj(us[0], vs[1])),
        ],
      };
    }
    if (type === 'orthogonal_check') {
      var dot12 = _round(_dot(qs[0], qs[1]),4);
      return {
        statement: 'Após Gram-Schmidt em {' + vs.slice(0,2).map(function(v){return '('+v.join(',')+')';}).join(', ') + '}, os vetores q₁ e q₂ são ortogonais? Calcule q₁·q₂.',
        equation:  'q₁·q₂ = ?',
        answer:    String(dot12 === 0 ? '0' : dot12),
        hints: [
          'q₁ = (' + qs[0].join(',') + ')',
          'q₂ = (' + qs[1].join(',') + ')',
          'Produto interno = soma dos produtos componente a componente',
        ],
      };
    }
    if (type === 'normalize') {
      return {
        statement: 'Dado u₂ = (' + us[1].join(', ') + '), calcule q₂ = u₂/||u₂||.',
        equation:  '||u₂|| = √(u₂·u₂)',
        answer:    '(' + qs[1].join(', ') + ')',
        hints: ['||u₂|| = ' + _round(_norm(us[1]),4)],
      };
    }
    // full: return q2
    return {
      statement: 'Aplique Gram-Schmidt completo a {' + vs.map(function(v){return '('+v.join(',')+')';}).join(', ') + '}. Qual é q₂ (segundo vetor ortonormal)?',
      equation:  'qₙ = uₙ/||uₙ||,  uₙ = vₙ − Σproj_{uⱼ}(vₙ)',
      answer:    '(' + qs[1].join(', ') + ')',
      hints: [
        'u₂ = (' + us[1].join(',') + ')',
        '||u₂|| = ' + _round(_norm(us[1]),4),
      ],
    };
  };

  // ── lu_factoring ──────────────────────────────────────────────────
  MathGenerators['lu_factoring'] = function (difficulty) {
    _reseed();
    // Work with explicit known LU pairs
    var cases = [
      { A:[[2,1],[4,3]],
        L:[[1,0],[2,1]],      U:[[2,1],[0,1]],
        desc:'A = [[2,1],[4,3]]' },
      { A:[[1,2],[3,8]],
        L:[[1,0],[3,1]],      U:[[1,2],[0,2]],
        desc:'A = [[1,2],[3,8]]' },
      { A:[[2,4,2],[4,9,3],[2,3,7]],
        L:[[1,0,0],[2,1,0],[1,-1,1]], U:[[2,4,2],[0,1,-1],[0,0,4]],
        desc:'A 3×3' },
      { A:[[4,3],[6,3]],
        L:[[1,0],[1.5,1]],    U:[[4,3],[0,-1.5]],
        desc:'A = [[4,3],[6,3]]' },
      { A:[[1,0,1],[2,1,3],[1,1,2]],
        L:[[1,0,0],[2,1,0],[1,1,1]], U:[[1,0,1],[0,1,1],[0,0,-1]],
        desc:'A 3×3 v2' },
    ];
    var cas = cases[Math.min(difficulty-1, cases.length-1)];
    var types = ['identify_L','identify_U','solve_Ly','solve_Ux','interpret'];
    var type  = types[Math.min(difficulty-1, 4)];

    function matStr(M) {
      return '[' + M.map(function(r){return '['+r.join(', ')+']';}).join(', ') + ']';
    }

    if (type === 'identify_L') {
      return {
        statement: 'Na fatoração LU de ' + cas.desc + ', qual é a diagonal de L?',
        equation:  'A = LU, L triangular inferior com 1s na diagonal',
        answer:    Array(cas.L.length).fill(1).join(', '),
        hints: ['L sempre tem 1s na diagonal principal na fatoração LU padrão.'],
      };
    }
    if (type === 'identify_U') {
      return {
        statement: 'Para ' + cas.desc + ', qual é U[1][1] (elemento (1,1) de U)?',
        equation:  'A = LU',
        answer:    String(cas.U[0][0]),
        hints: ['U[0][0] = A[0][0] (o pivô da primeira linha).', 'U = ' + matStr(cas.U)],
      };
    }
    if (type === 'solve_Ly') {
      // Solve Ly = b with b = [5,11] for 2x2 case
      var b = [5, 11];
      var y0 = b[0];
      var y1 = b[1] - cas.L[1][0]*y0;
      return {
        statement: 'Dada L = ' + matStr(cas.L.slice(0,2)) + ', resolva Ly = [5, 11]ᵀ.',
        equation:  'Ly = b — substituição progressiva',
        answer:    '(' + y0 + ', ' + y1 + ')',
        hints: [
          'y₁ = b₁ = 5',
          'y₂ = b₂ − L₂₁·y₁ = 11 − ' + cas.L[1][0] + '·5',
        ],
      };
    }
    if (type === 'solve_Ux') {
      // Solve Ux = y with y = [5, 1] for 2x2
      var y = [5, 1];
      var x1 = y[1] / cas.U[1][1];
      var x0 = (y[0] - cas.U[0][1]*x1) / cas.U[0][0];
      return {
        statement: 'Dada U = ' + matStr(cas.U.slice(0,2).map(function(r){return r.slice(0,2);})) + ', resolva Ux = [5, 1]ᵀ.',
        equation:  'Ux = y — substituição regressiva',
        answer:    '(' + _round(x0,4) + ', ' + _round(x1,4) + ')',
        hints: [
          'x₂ = y₂/U₂₂ = 1/' + cas.U[1][1],
          'x₁ = (y₁ − U₁₂·x₂)/U₁₁',
        ],
      };
    }
    return {
      statement: 'Qual a principal vantagem da fatoração LU sobre eliminação de Gauss direta ao resolver Ax=b para múltiplos vetores b?',
      equation:  'A = LU → Ly=b (progressiva) + Ux=y (regressiva)',
      answer:    'Reutilizar LU para qualquer b',
      hints: ['A fatoração A=LU é feita uma vez (O(n³)). Cada sistema Ax=b custa apenas O(n²).'],
    };
  };

  // ── quadratic_forms ───────────────────────────────────────────────
  MathGenerators['quadratic_forms'] = function (difficulty) {
    _reseed();
    var cases = [
      { A:[[2,0],[0,3]],  lambda:[2,3],  def:'definida positiva',  xAx:'2x²+3y²' },
      { A:[[1,0],[0,-1]], lambda:[1,-1], def:'indefinida',          xAx:'x²−y²'   },
      { A:[[4,1],[1,4]],  lambda:[3,5],  def:'definida positiva',  xAx:'4x²+2xy+4y²' },
      { A:[[-2,0],[0,-3]],lambda:[-2,-3],def:'definida negativa',  xAx:'−2x²−3y²' },
      { A:[[1,2],[2,4]],  lambda:[0,5],  def:'semidefinida positiva',xAx:'x²+4xy+4y²' },
    ];
    var cas = cases[Math.min(difficulty-1, cases.length-1)];
    var types = ['evaluate','classify','eigenvals','definition','identify'];
    var type  = types[Math.min(difficulty-1, 4)];

    if (type === 'evaluate') {
      var x=[1,1], val = x[0]*(cas.A[0][0]*x[0]+cas.A[0][1]*x[1])+x[1]*(cas.A[1][0]*x[0]+cas.A[1][1]*x[1]);
      return {
        statement: 'Avalie a forma quadrática Q(x) = xᵀAx para A=' + JSON.stringify(cas.A) + ' em x=(1,1).',
        equation:  'Q(x) = xᵀAx = ' + cas.xAx,
        answer:    String(val),
        hints: ['Substitua x=1, y=1 em ' + cas.xAx],
      };
    }
    if (type === 'classify') {
      return {
        statement: 'Classifique a forma quadrática com A=' + JSON.stringify(cas.A) + '.',
        equation:  'Autovalores: λ = ' + cas.lambda.join(', '),
        answer:    cas.def,
        hints: [
          'Calcule os autovalores de A',
          'λ₁=' + cas.lambda[0] + ', λ₂=' + cas.lambda[1],
          cas.lambda.every(function(l){return l>0;}) ? 'Todos positivos → def. positiva' :
          cas.lambda.every(function(l){return l<0;}) ? 'Todos negativos → def. negativa' :
          cas.lambda.some(function(l){return l===0;}) ? 'Algum zero → semidefinida' : 'Sinais mistos → indefinida',
        ],
      };
    }
    if (type === 'eigenvals') {
      return {
        statement: 'Calcule os autovalores de A=' + JSON.stringify(cas.A) + ' para classificar a forma quadrática.',
        equation:  'det(A−λI) = 0',
        answer:    cas.lambda.join(' e '),
        hints: [
          'det([[' + (cas.A[0][0]+'-λ') + ',' + cas.A[0][1] + '],[' + cas.A[1][0] + ',' + (cas.A[1][1]+'-λ') + ']])=0',
          'Expanda e resolva a equação de 2º grau',
        ],
      };
    }
    if (type === 'definition') {
      return {
        statement: 'Uma matriz A é definida positiva se e somente se xᵀAx __ 0 para todo x ≠ 0.',
        equation:  'A DP ⟺ todos autovalores > 0 ⟺ todos menores principais > 0',
        answer:    '>',
        hints: ['DP: Q(x)>0 para x≠0. DN: Q(x)<0. Indefinida: Q muda de sinal.'],
      };
    }
    // identify expression
    return {
      statement: 'A forma quadrática ' + cas.xAx + ' é __ (classifique).',
      equation:  'Verificar sinais dos autovalores de A=' + JSON.stringify(cas.A),
      answer:    cas.def,
      hints: ['λ = ' + cas.lambda.join(', '), cas.def],
    };
  };

})();
