/**
 * math/generators/matrices_logic.js
 * Matrices, logic, data analysis, statistics
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;

  // ── File-scoped helpers ──────────────────────────────────────────
  var _matTypes = ['add', 'multiply', 'det2', 'det3', 'inverse2'];
  
  function _genMatrices(difficulty) {
    _reseed();
    var type = _matTypes[Math.min(difficulty - 1, _matTypes.length - 1)];
  
    if (type === 'add') {
      var a = [[_randInt(-5,5),_randInt(-5,5)],[_randInt(-5,5),_randInt(-5,5)]];
      var b = [[_randInt(-5,5),_randInt(-5,5)],[_randInt(-5,5),_randInt(-5,5)]];
      var r = [[a[0][0]+b[0][0], a[0][1]+b[0][1]],[a[1][0]+b[1][0], a[1][1]+b[1][1]]];
      return {
        statement: 'Calcule a soma das matrizes A + B.',
        equation:  _matStr(a) + ' + ' + _matStr(b),
        answer:    _matStr(r),
        matType:   'add', matA: a, matB: b, matR: r,
        hints: [
          'Some os elementos correspondentes: (A+B)[i][j] = A[i][j] + B[i][j].',
          'Linha 1: [' + (a[0][0]+'+'+b[0][0]) + ', ' + (a[0][1]+'+'+b[0][1]) + ']',
          'Resultado: ' + _matStr(r),
        ],
      };
    }
  
    if (type === 'multiply') {
      var a = [[_randInt(-3,3),_randInt(-3,3)],[_randInt(-3,3),_randInt(-3,3)]];
      var b = [[_randInt(-3,3),_randInt(-3,3)],[_randInt(-3,3),_randInt(-3,3)]];
      var r = [
        [a[0][0]*b[0][0]+a[0][1]*b[1][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]],
        [a[1][0]*b[0][0]+a[1][1]*b[1][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]],
      ];
      return {
        statement: 'Calcule o produto A × B.',
        equation:  _matStr(a) + ' × ' + _matStr(b),
        answer:    _matStr(r),
        matType:   'multiply', matA: a, matB: b, matR: r,
        hints: [
          'r[i][j] = soma dos produtos da linha i de A pela coluna j de B.',
          'r[0][0] = ' + a[0][0] + '×' + b[0][0] + ' + ' + a[0][1] + '×' + b[1][0] + ' = ' + r[0][0],
          'Resultado: ' + _matStr(r),
        ],
      };
    }
  
    if (type === 'det2') {
      var a = [[_randInt(-6,6),_randInt(-6,6)],[_randInt(-6,6),_randInt(-6,6)]];
      var det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
      return {
        statement: 'Calcule o determinante da matriz 2×2.',
        equation:  'det' + _matStr(a),
        answer:    String(det),
        matType:   'det2', matA: a,
        hints: [
          'det(A) = a₁₁×a₂₂ − a₁₂×a₂₁',
          'det = ' + a[0][0] + '×' + a[1][1] + ' - ' + a[0][1] + '×' + a[1][0],
          'det = ' + (a[0][0]*a[1][1]) + ' - ' + (a[0][1]*a[1][0]) + ' = ' + det,
        ],
      };
    }
  
    if (type === 'det3') {
      var a = [];
      for (var i = 0; i < 3; i++) { a.push([]); for (var j = 0; j < 3; j++) a[i].push(_randInt(-4,4)); }
      var det = a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])
               -a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])
               +a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
      return {
        statement: 'Calcule o determinante da matriz 3×3 (Regra de Sarrus).',
        equation:  'det' + _mat3Str(a),
        answer:    String(det),
        matType:   'det3', matA: a,
        hints: [
          'Regra de Sarrus: some as diagonais principais, subtraia as secundárias.',
          'Principal: ' + a[0][0]+'×'+a[1][1]+'×'+a[2][2] + ' + ' + a[0][1]+'×'+a[1][2]+'×'+a[2][0] + ' + ' + a[0][2]+'×'+a[1][0]+'×'+a[2][1],
          'det = ' + det,
        ],
      };
    }
  
    // inverse 2x2
    var a = [[_randInt(-4,4),_randInt(-4,4)],[_randInt(-4,4),_randInt(-4,4)]];
    var det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
    while (det === 0) {
      a[0][0] = _randInt(-4,4); a[0][1] = _randInt(-4,4);
      a[1][0] = _randInt(-4,4); a[1][1] = _randInt(-4,4);
      det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
    }
    return {
      statement: 'Calcule o determinante de A para verificar se a inversa existe.',
      equation:  'det' + _matStr(a),
      answer:    String(det),
      matType:   'det2', matA: a,
      hints: [
        'det(A) = a₁₁×a₂₂ − a₁₂×a₂₁',
        'det = ' + a[0][0]+'×'+a[1][1]+' - '+a[0][1]+'×'+a[1][0],
        'det = ' + det + (det !== 0 ? ' ≠ 0: inversa existe.' : ' = 0: sem inversa.'),
      ],
    };
  }
  
  function _matStr(m) {
    return '[[' + m[0][0] + ',' + m[0][1] + ']['+ m[1][0] + ',' + m[1][1] + ']]';
  }
  
  function _mat3Str(m) {
    return '[['+m[0][0]+','+m[0][1]+','+m[0][2]+']['+m[1][0]+','+m[1][1]+','+m[1][2]+']['+m[2][0]+','+m[2][1]+','+m[2][2]+']]';
  }
  
  // ── Calculus generators ───────────────────────────────────────────
  
  var _calcTypes = ['limit_poly', 'deriv_power', 'deriv_sum', 'integral_power', 'deriv_apply'];

  var _dataTypes = ['mean_weighted', 'variance', 'std_dev', 'frequency', 'percentile'];
  
  function _genDataAnalysis(difficulty) {
    _reseed();
    var type = _dataTypes[Math.min(difficulty - 1, _dataTypes.length - 1)];
  
    if (type === 'mean_weighted') {
      var n = _randInt(3, 5);
      var vals = [], weights = [];
      for (var i = 0; i < n; i++) { vals.push(_randInt(1, 10)); weights.push(_randInt(1, 5)); }
      var sumW = weights.reduce(function(a,b){return a+b;}, 0);
      var sumVW = vals.reduce(function(s,v,i){return s+v*weights[i];}, 0);
      var mean = Math.round(sumVW / sumW * 100) / 100;
      return {
        statement: 'Calcule a média ponderada. Notas: ' + vals.join(', ') + '. Pesos: ' + weights.join(', ') + '.',
        equation:  'x̄ = Σ(xi × pi) / Σpi',
        answer:    String(mean),
        dataType:  'mean_w', vals: vals, weights: weights,
        hints: ['Multiplique cada nota pelo seu peso: ' + vals.map(function(v,i){return v+'×'+weights[i];}).join(' + '),
                'Soma ponderada = ' + sumVW + '  |  Soma dos pesos = ' + sumW,
                'x̄ = ' + sumVW + ' / ' + sumW + ' = ' + mean],
      };
    }
  
    if (type === 'variance' || type === 'std_dev') {
      var n = _randInt(4, 6);
      var vals = [];
      for (var i = 0; i < n; i++) vals.push(_randInt(1, 10));
      var mean = vals.reduce(function(a,b){return a+b;}, 0) / n;
      var variance = vals.reduce(function(s,v){return s + Math.pow(v-mean,2);}, 0) / n;
      var sd = Math.sqrt(variance);
      var isSd = type === 'std_dev';
      var ans = Math.round((isSd ? sd : variance) * 100) / 100;
      return {
        statement: 'Calcule ' + (isSd?'o desvio padrão':'a variância') + ' de: ' + vals.join(', ') + '.',
        equation:  isSd ? 'σ = √(Σ(xi − x̄)² / n)' : 'σ² = Σ(xi − x̄)² / n',
        answer:    String(ans),
        dataType:  type, vals: vals, mean: mean,
        hints: ['Média = ' + mean,
                'Desvios²: ' + vals.map(function(v){return '('+v+'−'+mean+')²='+Math.round(Math.pow(v-mean,2)*100)/100;}).join(', '),
                (isSd?'σ':'σ²') + ' = ' + ans],
      };
    }
  
    if (type === 'frequency') {
      var vals = [];
      for (var i = 0; i < 8; i++) vals.push(_randInt(1, 6));
      var counts = {};
      vals.forEach(function(v){ counts[v] = (counts[v]||0) + 1; });
      var moda = Object.keys(counts).reduce(function(a,b){return counts[a]>counts[b]?a:b;});
      return {
        statement: 'Encontre a moda do conjunto: ' + vals.join(', ') + '.',
        equation:  'Moda = valor de maior frequência',
        answer:    moda,
        dataType:  'frequency', vals: vals,
        hints: ['Conte a frequência de cada valor.',
                'Frequências: ' + Object.keys(counts).map(function(k){return k+'→'+counts[k]+'x';}).join(', '),
                'Moda = ' + moda],
      };
    }
  
    // percentile
    var n = _randInt(8, 12);
    var vals = [];
    for (var i = 0; i < n; i++) vals.push(_randInt(10, 100));
    var sorted = vals.slice().sort(function(a,b){return a-b;});
    var p = [25, 50, 75][_randInt(0, 2)];
    var idx = Math.ceil(p / 100 * n) - 1;
    var perc = sorted[idx];
    return {
      statement: 'Calcule o P' + p + ' (percentil ' + p + ') do conjunto: ' + vals.join(', ') + '.',
      equation:  'P' + p + ': posição = ceil(' + p + '/100 × n)',
      answer:    String(perc),
      dataType:  'percentile', vals: vals, sorted: sorted, p: p,
      hints: ['Ordene os valores: ' + sorted.join(', '),
              'Posição = ceil(' + p + '/100 × ' + n + ') = ' + (idx+1),
              'P' + p + ' = ' + perc],
    };
  }
  
  // ── Logic & Sets generator ────────────────────────────────────────

  var _logicTypes = ['truth_table', 'set_union', 'set_inter', 'set_complement', 'proposition'];
  
  function _genLogic(difficulty) {
    _reseed();
    var type = _logicTypes[Math.min(difficulty - 1, _logicTypes.length - 1)];
  
    if (type === 'truth_table') {
      // Evaluate a compound proposition for given truth values
      var ops  = ['AND','OR','IMPLIES'];
      var op   = ops[_randInt(0, 2)];
      var P    = _randInt(0, 1) === 1;
      var Q    = _randInt(0, 1) === 1;
      var result = op === 'AND' ? P && Q : op === 'OR' ? P || Q : !P || Q;
      var opSym  = op === 'AND' ? '∧' : op === 'OR' ? '∨' : '→';
      return {
        statement: 'P = ' + (P?'V':'F') + ', Q = ' + (Q?'V':'F') + '. Qual o valor de P ' + opSym + ' Q?',
        equation:  'P ' + opSym + ' Q',
        answer:    result ? 'V' : 'F',
        logicType: 'truth', op: op, P: P, Q: Q,
        hints: [op==='AND'?'Conjunção (∧): verdadeira só quando ambos são V.':
                op==='OR'?'Disjunção (∨): falsa só quando ambos são F.':
                'Condicional (→): falsa apenas quando P=V e Q=F.',
                'P=' + (P?'V':'F') + ', Q=' + (Q?'V':'F'),
                'P ' + opSym + ' Q = ' + (result?'V':'F')],
      };
    }
  
    if (type === 'set_union' || type === 'set_inter') {
      var n   = 10 + _randInt(0, 5);
      var a   = _randInt(3, 7);
      var b   = _randInt(3, 7);
      var ab  = _randInt(1, Math.min(a, b));
      var uni = a + b - ab;
      var isUnion = type === 'set_union';
      return {
        statement: '|A| = ' + a + ', |B| = ' + b + ', |A∩B| = ' + ab + '. Calcule |' + (isUnion?'A∪B':'A∩B') + '|.',
        equation:  isUnion ? '|A∪B| = |A| + |B| − |A∩B|' : '|A∩B| = ' + ab,
        answer:    String(isUnion ? uni : ab),
        logicType: type, a: a, b: b, ab: ab,
        hints: [isUnion ? '|A∪B| = |A| + |B| − |A∩B| (evitar dupla contagem)' : '|A∩B| é dado diretamente.',
                isUnion ? a + ' + ' + b + ' − ' + ab + ' = ' + uni : '|A∩B| = ' + ab,
                (isUnion?'|A∪B|':'|A∩B|') + ' = ' + (isUnion?uni:ab)],
      };
    }
  
    if (type === 'set_complement') {
      var nU = 20 + _randInt(0, 30);
      var nA = _randInt(5, nU - 5);
      var nAc = nU - nA;
      return {
        statement: '|U| = ' + nU + ', |A| = ' + nA + '. Calcule |Aᶜ| (complementar de A).',
        equation:  '|Aᶜ| = |U| − |A|',
        answer:    String(nAc),
        logicType: 'complement',
        hints: ['O complementar contém todos os elementos de U que não estão em A.',
                '|Aᶜ| = ' + nU + ' − ' + nA,
                '|Aᶜ| = ' + nAc],
      };
    }
  
    // proposition: negate
    var props = [
      {p:'Todo número par é divisível por 2.', neg:'Existe número par não divisível por 2.'},
      {p:'Nenhum primo é par.', neg:'Existe primo que é par.'},
      {p:'Todos os quadrados são retângulos.', neg:'Existe quadrado que não é retângulo.'},
    ];
    var chosen = props[_randInt(0, props.length - 1)];
    return {
      statement: 'Qual é a negação de: "' + chosen.p + '"',
      equation:  '¬(∀x P(x)) = ∃x ¬P(x)',
      answer:    chosen.neg,
      logicType: 'negate',
      hints: ['Negação do universal (∀): torna-se existencial (∃).',
              'Negação do existencial (∃): torna-se universal (∀).',
              chosen.neg],
    };
  }
  
  // ── Vectors generator ────────────────────────────────────────────
  
  var _vecTypes = ['add', 'modulus', 'dot_product', 'line_eq', 'circle_eq'];


  // ── matrices
  MathGenerators['matrices'] = function _genMatrices(difficulty) {
  _reseed();
  var type = _matTypes[Math.min(difficulty - 1, _matTypes.length - 1)];

  if (type === 'add') {
    var a = [[_randInt(-5,5),_randInt(-5,5)],[_randInt(-5,5),_randInt(-5,5)]];
    var b = [[_randInt(-5,5),_randInt(-5,5)],[_randInt(-5,5),_randInt(-5,5)]];
    var r = [[a[0][0]+b[0][0], a[0][1]+b[0][1]],[a[1][0]+b[1][0], a[1][1]+b[1][1]]];
    return {
      statement: 'Calcule a soma das matrizes A + B.',
      equation:  _matStr(a) + ' + ' + _matStr(b),
      answer:    _matStr(r),
      matType:   'add', matA: a, matB: b, matR: r,
      hints: [
        'Some os elementos correspondentes: (A+B)[i][j] = A[i][j] + B[i][j].',
        'Linha 1: [' + (a[0][0]+'+'+b[0][0]) + ', ' + (a[0][1]+'+'+b[0][1]) + ']',
        'Resultado: ' + _matStr(r),
      ],
    };
  }

  if (type === 'multiply') {
    var a = [[_randInt(-3,3),_randInt(-3,3)],[_randInt(-3,3),_randInt(-3,3)]];
    var b = [[_randInt(-3,3),_randInt(-3,3)],[_randInt(-3,3),_randInt(-3,3)]];
    var r = [
      [a[0][0]*b[0][0]+a[0][1]*b[1][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]],
      [a[1][0]*b[0][0]+a[1][1]*b[1][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]],
    ];
    return {
      statement: 'Calcule o produto A × B.',
      equation:  _matStr(a) + ' × ' + _matStr(b),
      answer:    _matStr(r),
      matType:   'multiply', matA: a, matB: b, matR: r,
      hints: [
        'r[i][j] = soma dos produtos da linha i de A pela coluna j de B.',
        'r[0][0] = ' + a[0][0] + '×' + b[0][0] + ' + ' + a[0][1] + '×' + b[1][0] + ' = ' + r[0][0],
        'Resultado: ' + _matStr(r),
      ],
    };
  }

  if (type === 'det2') {
    var a = [[_randInt(-6,6),_randInt(-6,6)],[_randInt(-6,6),_randInt(-6,6)]];
    var det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
    return {
      statement: 'Calcule o determinante da matriz 2×2.',
      equation:  'det' + _matStr(a),
      answer:    String(det),
      matType:   'det2', matA: a,
      hints: [
        'det(A) = a₁₁×a₂₂ − a₁₂×a₂₁',
        'det = ' + a[0][0] + '×' + a[1][1] + ' - ' + a[0][1] + '×' + a[1][0],
        'det = ' + (a[0][0]*a[1][1]) + ' - ' + (a[0][1]*a[1][0]) + ' = ' + det,
      ],
    };
  }

  if (type === 'det3') {
    var a = [];
    for (var i = 0; i < 3; i++) { a.push([]); for (var j = 0; j < 3; j++) a[i].push(_randInt(-4,4)); }
    var det = a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])
             -a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])
             +a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);
    return {
      statement: 'Calcule o determinante da matriz 3×3 (Regra de Sarrus).',
      equation:  'det' + _mat3Str(a),
      answer:    String(det),
      matType:   'det3', matA: a,
      hints: [
        'Regra de Sarrus: some as diagonais principais, subtraia as secundárias.',
        'Principal: ' + a[0][0]+'×'+a[1][1]+'×'+a[2][2] + ' + ' + a[0][1]+'×'+a[1][2]+'×'+a[2][0] + ' + ' + a[0][2]+'×'+a[1][0]+'×'+a[2][1],
        'det = ' + det,
      ],
    };
  }

  // inverse 2x2
  var a = [[_randInt(-4,4),_randInt(-4,4)],[_randInt(-4,4),_randInt(-4,4)]];
  var det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
  while (det === 0) {
    a[0][0] = _randInt(-4,4); a[0][1] = _randInt(-4,4);
    a[1][0] = _randInt(-4,4); a[1][1] = _randInt(-4,4);
    det = a[0][0]*a[1][1] - a[0][1]*a[1][0];
  }
  return {
    statement: 'Calcule o determinante de A para verificar se a inversa existe.',
    equation:  'det' + _matStr(a),
    answer:    String(det),
    matType:   'det2', matA: a,
    hints: [
      'det(A) = a₁₁×a₂₂ − a₁₂×a₂₁',
      'det = ' + a[0][0]+'×'+a[1][1]+' - '+a[0][1]+'×'+a[1][0],
      'det = ' + det + (det !== 0 ? ' ≠ 0: inversa existe.' : ' = 0: sem inversa.'),
    ],
  };
}

  // ── logic
  MathGenerators['logic'] = function _genLogic(difficulty) {
  _reseed();
  var type = _logicTypes[Math.min(difficulty - 1, _logicTypes.length - 1)];

  if (type === 'truth_table') {
    // Evaluate a compound proposition for given truth values
    var ops  = ['AND','OR','IMPLIES'];
    var op   = ops[_randInt(0, 2)];
    var P    = _randInt(0, 1) === 1;
    var Q    = _randInt(0, 1) === 1;
    var result = op === 'AND' ? P && Q : op === 'OR' ? P || Q : !P || Q;
    var opSym  = op === 'AND' ? '∧' : op === 'OR' ? '∨' : '→';
    return {
      statement: 'P = ' + (P?'V':'F') + ', Q = ' + (Q?'V':'F') + '. Qual o valor de P ' + opSym + ' Q?',
      equation:  'P ' + opSym + ' Q',
      answer:    result ? 'V' : 'F',
      logicType: 'truth', op: op, P: P, Q: Q,
      hints: [op==='AND'?'Conjunção (∧): verdadeira só quando ambos são V.':
              op==='OR'?'Disjunção (∨): falsa só quando ambos são F.':
              'Condicional (→): falsa apenas quando P=V e Q=F.',
              'P=' + (P?'V':'F') + ', Q=' + (Q?'V':'F'),
              'P ' + opSym + ' Q = ' + (result?'V':'F')],
    };
  }

  if (type === 'set_union' || type === 'set_inter') {
    var n   = 10 + _randInt(0, 5);
    var a   = _randInt(3, 7);
    var b   = _randInt(3, 7);
    var ab  = _randInt(1, Math.min(a, b));
    var uni = a + b - ab;
    var isUnion = type === 'set_union';
    return {
      statement: '|A| = ' + a + ', |B| = ' + b + ', |A∩B| = ' + ab + '. Calcule |' + (isUnion?'A∪B':'A∩B') + '|.',
      equation:  isUnion ? '|A∪B| = |A| + |B| − |A∩B|' : '|A∩B| = ' + ab,
      answer:    String(isUnion ? uni : ab),
      logicType: type, a: a, b: b, ab: ab,
      hints: [isUnion ? '|A∪B| = |A| + |B| − |A∩B| (evitar dupla contagem)' : '|A∩B| é dado diretamente.',
              isUnion ? a + ' + ' + b + ' − ' + ab + ' = ' + uni : '|A∩B| = ' + ab,
              (isUnion?'|A∪B|':'|A∩B|') + ' = ' + (isUnion?uni:ab)],
    };
  }

  if (type === 'set_complement') {
    var nU = 20 + _randInt(0, 30);
    var nA = _randInt(5, nU - 5);
    var nAc = nU - nA;
    return {
      statement: '|U| = ' + nU + ', |A| = ' + nA + '. Calcule |Aᶜ| (complementar de A).',
      equation:  '|Aᶜ| = |U| − |A|',
      answer:    String(nAc),
      logicType: 'complement',
      hints: ['O complementar contém todos os elementos de U que não estão em A.',
              '|Aᶜ| = ' + nU + ' − ' + nA,
              '|Aᶜ| = ' + nAc],
    };
  }

  // proposition: negate
  var props = [
    {p:'Todo número par é divisível por 2.', neg:'Existe número par não divisível por 2.'},
    {p:'Nenhum primo é par.', neg:'Existe primo que é par.'},
    {p:'Todos os quadrados são retângulos.', neg:'Existe quadrado que não é retângulo.'},
  ];
  var chosen = props[_randInt(0, props.length - 1)];
  return {
    statement: 'Qual é a negação de: "' + chosen.p + '"',
    equation:  '¬(∀x P(x)) = ∃x ¬P(x)',
    answer:    chosen.neg,
    logicType: 'negate',
    hints: ['Negação do universal (∀): torna-se existencial (∃).',
            'Negação do existencial (∃): torna-se universal (∀).',
            chosen.neg],
  };
}

  // ── dataanalysis
  MathGenerators['dataanalysis'] = function _genDataAnalysis(difficulty) {
  _reseed();
  var type = _dataTypes[Math.min(difficulty - 1, _dataTypes.length - 1)];

  if (type === 'mean_weighted') {
    var n = _randInt(3, 5);
    var vals = [], weights = [];
    for (var i = 0; i < n; i++) { vals.push(_randInt(1, 10)); weights.push(_randInt(1, 5)); }
    var sumW = weights.reduce(function(a,b){return a+b;}, 0);
    var sumVW = vals.reduce(function(s,v,i){return s+v*weights[i];}, 0);
    var mean = Math.round(sumVW / sumW * 100) / 100;
    return {
      statement: 'Calcule a média ponderada. Notas: ' + vals.join(', ') + '. Pesos: ' + weights.join(', ') + '.',
      equation:  'x̄ = Σ(xi × pi) / Σpi',
      answer:    String(mean),
      dataType:  'mean_w', vals: vals, weights: weights,
      hints: ['Multiplique cada nota pelo seu peso: ' + vals.map(function(v,i){return v+'×'+weights[i];}).join(' + '),
              'Soma ponderada = ' + sumVW + '  |  Soma dos pesos = ' + sumW,
              'x̄ = ' + sumVW + ' / ' + sumW + ' = ' + mean],
    };
  }

  if (type === 'variance' || type === 'std_dev') {
    var n = _randInt(4, 6);
    var vals = [];
    for (var i = 0; i < n; i++) vals.push(_randInt(1, 10));
    var mean = vals.reduce(function(a,b){return a+b;}, 0) / n;
    var variance = vals.reduce(function(s,v){return s + Math.pow(v-mean,2);}, 0) / n;
    var sd = Math.sqrt(variance);
    var isSd = type === 'std_dev';
    var ans = Math.round((isSd ? sd : variance) * 100) / 100;
    return {
      statement: 'Calcule ' + (isSd?'o desvio padrão':'a variância') + ' de: ' + vals.join(', ') + '.',
      equation:  isSd ? 'σ = √(Σ(xi − x̄)² / n)' : 'σ² = Σ(xi − x̄)² / n',
      answer:    String(ans),
      dataType:  type, vals: vals, mean: mean,
      hints: ['Média = ' + mean,
              'Desvios²: ' + vals.map(function(v){return '('+v+'−'+mean+')²='+Math.round(Math.pow(v-mean,2)*100)/100;}).join(', '),
              (isSd?'σ':'σ²') + ' = ' + ans],
    };
  }

  if (type === 'frequency') {
    var vals = [];
    for (var i = 0; i < 8; i++) vals.push(_randInt(1, 6));
    var counts = {};
    vals.forEach(function(v){ counts[v] = (counts[v]||0) + 1; });
    var moda = Object.keys(counts).reduce(function(a,b){return counts[a]>counts[b]?a:b;});
    return {
      statement: 'Encontre a moda do conjunto: ' + vals.join(', ') + '.',
      equation:  'Moda = valor de maior frequência',
      answer:    moda,
      dataType:  'frequency', vals: vals,
      hints: ['Conte a frequência de cada valor.',
              'Frequências: ' + Object.keys(counts).map(function(k){return k+'→'+counts[k]+'x';}).join(', '),
              'Moda = ' + moda],
    };
  }

  // percentile
  var n = _randInt(8, 12);
  var vals = [];
  for (var i = 0; i < n; i++) vals.push(_randInt(10, 100));
  var sorted = vals.slice().sort(function(a,b){return a-b;});
  var p = [25, 50, 75][_randInt(0, 2)];
  var idx = Math.ceil(p / 100 * n) - 1;
  var perc = sorted[idx];
  return {
    statement: 'Calcule o P' + p + ' (percentil ' + p + ') do conjunto: ' + vals.join(', ') + '.',
    equation:  'P' + p + ': posição = ceil(' + p + '/100 × n)',
    answer:    String(perc),
    dataType:  'percentile', vals: vals, sorted: sorted, p: p,
    hints: ['Ordene os valores: ' + sorted.join(', '),
            'Posição = ceil(' + p + '/100 × ' + n + ') = ' + (idx+1),
            'P' + p + ' = ' + perc],
  };
}

  // ── statistics
  MathGenerators['statistics'] = function _genStatistics(difficulty) {
  _reseed();
  var types = ['variance','std_dev','quartiles','boxplot_read','normal_notion'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'variance') {
    var n = _randInt(4, 6);
    var vals = []; for(var _i=0;_i<n;_i++) vals.push(_randInt(1,10));
    var mean = vals.reduce(function(a,b){return a+b;},0)/n;
    var variance = vals.reduce(function(a,v){return a+(v-mean)*(v-mean);},0)/n;
    variance = Math.round(variance*100)/100;
    return { statement: 'Calcule a variância de: ' + vals.join(', ') + '.',
      equation: 'σ² = Σ(xᵢ−x̄)²/n',
      answer: String(variance), statType: 'variance',
      hints: ['1) Calcule a média: x̄ = ' + Math.round(mean*100)/100, '2) Para cada valor: (xᵢ − ' + Math.round(mean*100)/100 + ')²  |  3) Some e divida por ' + n, String(variance)] };
  }
  if (type === 'std_dev') {
    var data = [[2,4,4,4,5,5,7,9],[1,3,5,7],[2,2,4,4,4,6,6]];
    var d = data[_randInt(0, data.length-1)];
    var mean = d.reduce(function(a,b){return a+b;},0)/d.length;
    var variance = d.reduce(function(a,v){return a+(v-mean)*(v-mean);},0)/d.length;
    var std = Math.round(Math.sqrt(variance)*100)/100;
    return { statement: 'Desvio padrão de: ' + d.join(', ') + '.',
      equation: 'σ = √(variância)', answer: String(std), statType: 'std_dev',
      hints: ['1) Média = ' + mean, '2) Variância = ' + Math.round(variance*100)/100, 'σ = √' + Math.round(variance*100)/100 + ' = ' + std] };
  }
  if (type === 'quartiles') {
    var d = [2,4,6,8,10,12,14,16];
    return { statement: 'Para os dados: 2, 4, 6, 8, 10, 12, 14, 16. Calcule Q1, Q2, Q3.',
      equation: 'Dados ordenados em 4 partes iguais',
      answer: 'Q1=5, Q2=9, Q3=13', statType: 'quartiles',
      hints: ['Q2 = mediana (8 valores → média dos 4º e 5º = (8+10)/2 = 9)', 'Q1 = mediana dos 4 primeiros: (4+6)/2 = 5', 'Q3 = mediana dos 4 últimos: (12+14)/2 = 13'] };
  }
  if (type === 'boxplot_read') {
    var min=2,q1=5,q2=9,q3=13,max=16,iqr=q3-q1;
    return { statement: 'Boxplot: mín=2, Q1=5, Q2=9, Q3=13, máx=16. Qual o IQR (amplitude interquartil)?',
      equation: 'IQR = Q3 − Q1', answer: String(iqr), statType: 'boxplot',
      hints: ['IQR mede a dispersão dos 50% centrais dos dados.', 'IQR = Q3 − Q1 = ' + q3 + ' − ' + q1, String(iqr)] };
  }
  // normal notion
  return { statement: 'Em uma distribuição normal com média μ=50 e desvio σ=10, aprox. qual % dos dados cai entre 40 e 60?',
    equation: 'Regra empírica: μ±1σ',
    answer: '68%', statType: 'normal',
    hints: ['Regra 68-95-99,7%: μ±1σ contém ~68%, μ±2σ ~95%, μ±3σ ~99,7% dos dados.', '40 = 50−10 = μ−σ  e  60 = 50+10 = μ+σ', '68%'] };
}
})();
