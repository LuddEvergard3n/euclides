/**
 * math/generators/lin_alg.js
 * Álgebra Linear: eliminação de Gauss, espaços vetoriais, transformações lineares, autovalores.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed  = MathRNG.reseed;
  var _randInt = MathRNG.randInt;

  // ── gauss_elim ────────────────────────────────────────────────────────────
  MathGenerators['gauss_elim'] = function (difficulty) {
    _reseed();
    var types = ['two_by_two', 'three_by_three', 'parametric', 'row_echelon', 'rank'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'two_by_two') {
      var x = _randInt(-3, 4), y = _randInt(-3, 4);
      var a11 = _randInt(1, 3), a12 = _randInt(1, 3);
      var a21 = _randInt(1, 3), a22 = _randInt(1, 3);
      var b1 = a11 * x + a12 * y, b2 = a21 * x + a22 * y;
      return {
        statement: 'Resolva: ' + a11 + 'x + ' + a12 + 'y = ' + b1 + '  e  ' + a21 + 'x + ' + a22 + 'y = ' + b2 + '.',
        equation:  '['+a11+' '+a12+' | '+b1+']\n['+a21+' '+a22+' | '+b2+']',
        answer:    'x=' + x + ', y=' + y,
        hints: ['Escalone: multiplique L1 por '+a21+'/'+a11+' e subtraia de L2.',
                'Resolva o sistema triangular resultante.',
                'x=' + x + ', y=' + y]
      };
    }
    if (type === 'three_by_three') {
      // Use a triangular system for clean answers
      var z = _randInt(-2, 3), y = _randInt(-2, 3), x = _randInt(-2, 3);
      // Row 3: z = z; Row 2: 2y + z = 2y+z; Row 1: x + y + z = x+y+z
      var r3 = [0, 0, 1, z], r2 = [0, 2, 1, 2*y+z], r1 = [1, 1, 1, x+y+z];
      return {
        statement: 'Resolva o sistema:\n' + r1[0]+'x+'+r1[1]+'y+'+r1[2]+'z='+r1[3] + '\n' + r2[1]+'y+'+r2[2]+'z='+r2[3] + '\n' + r3[2]+'z='+r3[3],
        equation:  'Sistema 3×3 triangular superior',
        answer:    'x=' + x + ', y=' + y + ', z=' + z,
        hints: ['Substitução regressiva: z=' + z + ' (da 3ª eq.)',
                '2y + ' + z + ' = ' + (2*y+z) + ' → y=' + y + '. Então x+' + y + '+' + z + ' = ' + (x+y+z) + ' → x='+x+'.',
                'x=' + x + ', y=' + y + ', z=' + z]
      };
    }
    if (type === 'parametric') {
      var t = 'k';
      return {
        statement: 'Resolva: x + 2y = 4  (um parâmetro livre).',
        equation:  '[1  2 | 4]',
        answer:    'x = 4−2k, y = k (k∈ℝ)',
        hints: ['Sistema subdeterminado: 1 eq., 2 incógnitas → 1 grau de liberdade.',
                'Expresse x em função de y: x = 4 − 2y. Faça y = k.',
                'x = 4−2k, y = k (k∈ℝ)']
      };
    }
    if (type === 'row_echelon') {
      return {
        statement: 'Reduza à forma escalonada e ache o posto:\n[1 2 3]\n[2 4 7]\n[3 6 10]',
        equation:  'Eliminação gaussiana',
        answer:    'posto = 2',
        hints: ['L2 ← L2−2L1: [0 0 1]. L3 ← L3−3L1: [0 0 1]. L3 ← L3−L2: [0 0 0].',
                'Dois pivôs → posto 2.',
                'posto = 2']
      };
    }
    // rank-nullity
    return {
      statement: 'Matriz 3×5 com posto 3. Qual a nulidade (dim do núcleo)?',
      equation:  'Teorema do posto-nulidade: posto + nulidade = n (colunas)',
      answer:    '2',
      hints: ['Teorema: posto(A) + nulidade(A) = n.',
              '3 + nulidade = 5 → nulidade = 2.',
              '2']
    };
  };

  // ── vector_spaces ─────────────────────────────────────────────────────────
  MathGenerators['vector_spaces'] = function (difficulty) {
    _reseed();
    var types = ['li_ld_2', 'li_ld_3', 'subspace_check', 'basis_dim', 'span_check'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'li_ld_2') {
      var a = _randInt(1, 4), b = _randInt(1, 4), k = _randInt(2, 4);
      var choices = [
        { v1: '('+a+','+b+')', v2: '('+(a*k)+','+(b*k)+')', ans: 'linearmente dependentes', why: 'v2 = '+k+'v1' },
        { v1: '(1,0)', v2: '(0,1)', ans: 'linearmente independentes', why: 'nenhum é múltiplo do outro' },
        { v1: '('+a+',0)', v2: '(0,'+b+')', ans: 'linearmente independentes', why: 'vetores nos eixos distintos' },
      ];
      var c = choices[_randInt(0, 2)];
      return {
        statement: 'v₁ = ' + c.v1 + ' e v₂ = ' + c.v2 + ' são LI ou LD?',
        equation:  'αv₁ + βv₂ = 0 → α=β=0?',
        answer:    c.ans,
        hints: ['Verifique se um é múltiplo escalar do outro.',
                c.why + '.',
                c.ans]
      };
    }
    if (type === 'li_ld_3') {
      // Three vectors; one is sum of others → LD
      var a = _randInt(1, 3), b = _randInt(1, 3);
      return {
        statement: 'v₁=('+a+',0,0), v₂=(0,'+b+',0), v₃=('+a+','+b+',0). São LI ou LD?',
        equation:  'det = 0?',
        answer:    'linearmente dependentes',
        hints: ['v₃ = v₁ + v₂ → combinação linear.',
                'Qualquer conjunto onde um vetor é CL dos outros é LD.',
                'linearmente dependentes']
      };
    }
    if (type === 'subspace_check') {
      var choices = [
        { S: 'W = {(x,y) : x+y=0}', ans: 'Sim (subespaço)', why: 'fechado sob adição e escalar; contém zero' },
        { S: 'W = {(x,y) : x+y=1}', ans: 'Não (não é subespaço)', why: 'não contém o vetor zero' },
        { S: 'W = {(x,y,z) : z=0}', ans: 'Sim (subespaço)', why: 'plano xy é subespaço de ℝ³' },
      ];
      var c = choices[_randInt(0, 2)];
      return {
        statement: c.S + ' é subespaço de ℝ²?',
        equation:  'Verificar: 0∈W, fechado (+), fechado (·)',
        answer:    c.ans,
        hints: ['1) (0,0)∈W?  2) u,v∈W → u+v∈W?  3) u∈W, α∈ℝ → αu∈W?',
                c.why + '.',
                c.ans]
      };
    }
    if (type === 'basis_dim') {
      var n = _randInt(2, 4);
      var choices = [
        { S: 'ℝ^' + n, dim: n, basis: 'vetores canônicos e₁,...,e_' + n },
        { S: 'polinômios grau ≤ ' + (n-1), dim: n, basis: '{1, x, x², ..., x^'+(n-1)+'}' },
        { S: 'matrizes 2×2 simétricas', dim: 3, basis: '{[[1,0],[0,0]], [[0,1],[1,0]], [[0,0],[0,1]]}' },
      ];
      var c = choices[_randInt(0, 2)];
      return {
        statement: 'Qual a dimensão de ' + c.S + '?',
        equation:  'dim = número de vetores de uma base',
        answer:    String(c.dim),
        hints: ['Uma base é um conjunto LI gerador.',
                c.basis,
                String(c.dim)]
      };
    }
    // span: (1,0),(0,1) span R²?
    return {
      statement: 'Os vetores (1,0) e (0,1) geram ℝ²? Qual a dimensão do span?',
      equation:  'span{v₁,v₂}',
      answer:    'Sim, dim = 2',
      hints: ['Dois vetores LI em ℝ² geram ℝ².',
              '(1,0) e (0,1) são a base canônica — claramente LI e geram ℝ².',
              'Sim, dim = 2']
    };
  };

  // ── lin_transformations ───────────────────────────────────────────────────
  MathGenerators['lin_transformations'] = function (difficulty) {
    _reseed();
    var types = ['apply_matrix', 'kernel_dim', 'image_dim', 'compose', 'find_matrix'];
    var type  = types[Math.min(difficulty - 1, 4)];

    if (type === 'apply_matrix') {
      var a=_randInt(1,3),b=_randInt(0,2),c=_randInt(0,2),d=_randInt(1,3);
      var x=_randInt(-2,3),y=_randInt(-2,3);
      var rx=a*x+b*y, ry=c*x+d*y;
      return {
        statement: 'T([['+a+','+b+'],['+c+','+d+']]). Calcule T(' + x + ', ' + y + ').',
        equation:  '[['+a+','+b+'],['+c+','+d+']]·['+x+','+y+']ᵀ',
        answer:    '(' + rx + ', ' + ry + ')',
        hints: ['Multiplicação matriz-vetor: cada linha da matriz · vetor.',
                '('+a+'·'+x+'+'+b+'·'+y+', '+c+'·'+x+'+'+d+'·'+y+') = ('+rx+', '+ry+').',
                '(' + rx + ', ' + ry + ')']
      };
    }
    if (type === 'kernel_dim') {
      return {
        statement: 'T: ℝ⁵→ℝ³ com posto(T)=3. Qual dim(ker T)?',
        equation:  'Teorema: dim(ker) + posto = dim(domínio)',
        answer:    '2',
        hints: ['Teorema Rank-Nullity: dim(ker T) + posto(T) = dim(domínio).',
                'dim(ker T) + 3 = 5 → dim(ker T) = 2.',
                '2']
      };
    }
    if (type === 'image_dim') {
      var m = _randInt(2, 4), n = _randInt(m, 5), r = _randInt(1, m);
      return {
        statement: 'Matriz '+m+'×'+n+' com posto '+r+'. Qual dim(imagem de T)?',
        equation:  'Im(T) = colspace(A)',
        answer:    String(r),
        hints: ['dim(Im T) = posto(A).',
                'O posto informa a dimensão do espaço-coluna (imagem).',
                String(r)]
      };
    }
    if (type === 'compose') {
      var a=_randInt(1,3),b=_randInt(1,3),c=_randInt(1,3),d=_randInt(1,3);
      // S∘T where T=[[a,0],[0,b]], S=[[c,0],[0,d]] → S∘T = [[ac,0],[0,bd]]
      return {
        statement: 'T = diag('+a+','+b+'), S = diag('+c+','+d+'). Matriz de S∘T?',
        equation:  '(S∘T)(x) = S(T(x))',
        answer:    'diag(' + (a*c) + ', ' + (b*d) + ')',
        hints: ['Composição = produto de matrizes: M_{S∘T} = M_S · M_T.',
                'diag('+c+','+d+')·diag('+a+','+b+') = diag('+c+'·'+a+', '+d+'·'+b+').',
                'diag(' + (a*c) + ', ' + (b*d) + ')']
      };
    }
    // find matrix: T(1,0)=(a,b), T(0,1)=(c,d)
    var a=_randInt(1,4),b=_randInt(0,3),c=_randInt(0,3),d=_randInt(1,4);
    return {
      statement: 'T: ℝ²→ℝ² linear com T(1,0)=('+a+','+b+') e T(0,1)=('+c+','+d+'). Qual a matriz de T?',
      equation:  'M_T = [T(e₁) | T(e₂)]',
      answer:    '[['+a+','+c+'],['+b+','+d+']]',
      hints: ['A matriz de T em bases canônicas: colunas = imagens dos e_i.',
              'Col 1 = T(e₁) = ('+a+','+b+'), Col 2 = T(e₂) = ('+c+','+d+').',
              '[['+a+','+c+'],['+b+','+d+']]']
    };
  };

  // ── eigenvalues_adv ───────────────────────────────────────────────────────
  MathGenerators['eigenvalues_adv'] = function (difficulty) {
    _reseed();
    var types = ['eigenvalue_2x2', 'eigenvector', 'diagonalize', 'spectral_radius', 'char_poly'];
    var type  = types[Math.min(difficulty - 1, 4)];

    // Use matrices with integer eigenvalues for clean answers
    var l1 = _randInt(-3, 4), l2 = _randInt(-3, 4);
    while (l2 === l1) l2 = _randInt(-3, 4);
    // A = [[l1, 0],[0, l2]] for simplest case
    // Or [[a,b],[c,d]] where trace=l1+l2, det=l1*l2
    var tr = l1 + l2, det = l1 * l2;
    // Build A = [[l1, 1],[0, l2]] (upper triangular → eigenvalues = diagonal)
    var a11 = l1, a12 = _randInt(1, 3), a21 = 0, a22 = l2;

    if (type === 'eigenvalue_2x2') {
      return {
        statement: 'Ache os autovalores de A = [[' + a11 + ',' + a12 + '],[' + a21 + ',' + a22 + ']].',
        equation:  'det(A − λI) = 0',
        answer:    'λ₁=' + l1 + ', λ₂=' + l2,
        hints: ['Polinômio característico: ('+a11+'−λ)('+a22+'−λ) − '+a12+'·'+a21+' = 0.',
                'Raízes de ('+a11+'−λ)('+a22+'−λ) = 0: λ='+l1+' e λ='+l2+'.',
                'λ₁=' + l1 + ', λ₂=' + l2]
      };
    }
    if (type === 'eigenvector') {
      // A = [[2,1],[0,3]] → λ=2: Av=2v → (A-2I)v=0 → [[0,1],[0,1]]v=0 → v=(1,0)
      return {
        statement: 'A = [[2,1],[0,3]]. Ache o autovetor associado a λ=2.',
        equation:  '(A−2I)v = 0',
        answer:    '(1, 0)',
        hints: ['A−2I = [[0,1],[0,1]]. Sistema: y=0.',
                'v = (x, 0) com x livre. Tome x=1.',
                '(1, 0)']
      };
    }
    if (type === 'diagonalize') {
      return {
        statement: 'A = [[3,0],[0,5]] é diagonalizável? Qual a forma diagonal?',
        equation:  'A = PDP⁻¹',
        answer:    'Sim, D = [[3,0],[0,5]]',
        hints: ['Matriz diagonal já é diagonalizada. Autovalores = entradas da diagonal.',
                'D = A = [[3,0],[0,5]], P = I.',
                'Sim, D = [[3,0],[0,5]]']
      };
    }
    if (type === 'spectral_radius') {
      var ev = [_randInt(-4, 4), _randInt(-4, 4), _randInt(1, 4)];
      var rho = Math.max(Math.abs(ev[0]), Math.abs(ev[1]), Math.abs(ev[2]));
      return {
        statement: 'Autovalores de A são ' + ev[0] + ', ' + ev[1] + ', ' + ev[2] + '. Qual o raio espectral ρ(A)?',
        equation:  'ρ(A) = max|λᵢ|',
        answer:    String(rho),
        hints: ['Raio espectral = maior autovalor em módulo.',
                'max(|' + ev[0] + '|, |' + ev[1] + '|, |' + ev[2] + '|) = ' + rho + '.',
                String(rho)]
      };
    }
    // characteristic polynomial
    return {
      statement: 'A = [['+a11+','+a12+'],[0,'+a22+']]. Escreva o polinômio característico p(λ).',
      equation:  'p(λ) = det(A−λI)',
      answer:    '(λ−' + l1 + ')(λ−' + l2 + ')',
      hints: ['det([['+a11+'−λ, '+a12+'],[0, '+a22+'−λ]]) = ('+a11+'−λ)('+a22+'−λ).',
              'Fatorado: (λ−'+l1+')(λ−'+l2+').',
              '(λ−' + l1 + ')(λ−' + l2 + ')']
    };
  };

})();
