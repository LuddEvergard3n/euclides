/**
 * math/generators/prob.js
 * Probability, combinatorics, complex numbers
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  // ── File-scoped helpers ──────────────────────────────────────────
  var _probTypes = ['classic', 'conditional', 'combination', 'mean', 'median'];
  
  function _genProbability(difficulty) {
    _reseed();
    var type = _probTypes[Math.min(_randInt(0, difficulty), _probTypes.length - 1)];
  
    if (type === 'classic') {
      // P(A) = favourable / total
      var total = _randInt(4, 20);
      var fav   = _randInt(1, total - 1);
      var g     = _gcd(fav, total);
      var ans   = (fav/g) + '/' + (total/g);
      return {
        statement: 'Uma urna tem ' + total + ' bolas. ' + fav + ' são vermelhas. Qual a probabilidade de sortear uma vermelha?',
        equation:  'P(V) = casos favoráveis / total',
        answer:    ans,
        probType:  'classic', fav: fav, total: total,
        hints: [
          'P(A) = número de casos favoráveis / número total de casos.',
          'P(V) = ' + fav + ' / ' + total,
          g > 1 ? 'Simplificando: ' + ans : 'P(V) = ' + ans,
        ],
      };
    }
  
    if (type === 'conditional') {
      var n = _randInt(10, 30);
      var a = _randInt(3, n - 3);
      var b = _randInt(2, a);
      var pA = a + '/' + n;
      var pAB= b + '/' + n;
      var g  = _gcd(b, a);
      var ans = (b/g) + '/' + (a/g);
      return {
        statement: 'Em um grupo de ' + n + ' alunos, ' + a + ' passaram na prova. Desses, ' + b + ' tiraram 10. Qual P(nota 10 | aprovado)?',
        equation:  'P(B|A) = P(A∩B) / P(A)',
        answer:    ans,
        probType:  'conditional',
        hints: [
          'P(B|A) = probabilidade de B dado que A ocorreu.',
          'P(B|A) = ' + b + ' / ' + a,
          g > 1 ? 'Simplificando: ' + ans : 'P(B|A) = ' + ans,
        ],
      };
    }
  
    if (type === 'combination') {
      var n = _randInt(4, 8), k = _randInt(1, Math.min(3, n-1));
      var cn = _comb(n, k);
      return {
        statement: 'Quantas combinações de ' + k + ' elementos podem ser feitas com ' + n + ' elementos (C(' + n + ',' + k + '))?',
        equation:  'C(' + n + ',' + k + ') = ' + n + '! / (' + k + '! × ' + (n-k) + '!)',
        answer:    String(cn),
        probType:  'combination', n: n, k: k,
        hints: [
          'C(n,k) = n! / (k! × (n-k)!)',
          n + '! / (' + k + '! × ' + (n-k) + '!) = ?',
          'C(' + n + ',' + k + ') = ' + cn,
        ],
      };
    }
  
    if (type === 'mean') {
      var len  = _randInt(4, 7);
      var vals = [];
      for (var i = 0; i < len; i++) vals.push(_randInt(1, 20));
      var sum  = vals.reduce(function(a,b){return a+b;}, 0);
      var mean = sum / len;
      var ans  = Number.isInteger(mean) ? String(mean) : mean.toFixed(2);
      return {
        statement: 'Calcule a média aritmética dos valores: ' + vals.join(', ') + '.',
        equation:  'Média = soma / quantidade',
        answer:    ans,
        probType:  'mean', vals: vals,
        hints: [
          'Some todos os valores: ' + vals.join(' + ') + ' = ' + sum,
          'Divida pela quantidade: ' + sum + ' / ' + len,
          'Média = ' + ans,
        ],
      };
    }
  
    // median
    var len  = _randInt(5, 9);
    var vals = [];
    for (var i = 0; i < len; i++) vals.push(_randInt(1, 30));
    var sorted = vals.slice().sort(function(a,b){return a-b;});
    var mid    = Math.floor(len / 2);
    var median = len % 2 === 1 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
    return {
      statement: 'Calcule a mediana dos valores: ' + vals.join(', ') + '.',
      equation:  'Ordene e encontre o valor central.',
      answer:    String(median),
      probType:  'median', vals: vals, sorted: sorted,
      hints: [
        'Ordene os valores: ' + sorted.join(', '),
        len % 2 === 1 ? 'Posição central: ' + (mid+1) + 'º valor = ' + sorted[mid] : 'Média dos dois centrais: (' + sorted[mid-1] + ' + ' + sorted[mid] + ') / 2',
        'Mediana = ' + median,
      ],
    };
  }
  
  function _comb(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    var result = 1;
    for (var i = 0; i < k; i++) result = result * (n - i) / (i + 1);
    return Math.round(result);
  }
  
  // ── Matrices generators ───────────────────────────────────────────
  
  var _matTypes = ['add', 'multiply', 'det2', 'det3', 'inverse2'];

  function _comb(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    var result = 1;
    for (var i = 0; i < k; i++) result = result * (n - i) / (i + 1);
    return Math.round(result);
  }
  
  // ── Matrices generators ───────────────────────────────────────────
  
  var _matTypes = ['add', 'multiply', 'det2', 'det3', 'inverse2'];


  // ── complex
  MathGenerators['complex'] = function _genComplex(difficulty) {
  _reseed();
  var types=['add','multiply','modulus','conjugate','division'];
  var type=types[Math.min(difficulty-1,4)];

  var a=_randInt(-6,6),b=_randInt(-6,6);
  var c=_randInt(-6,6),d=_randInt(-6,6);
  while(b===0)b=_randInt(-6,6);
  while(d===0)d=_randInt(-6,6);

  function _fmtC(re,im){return re+(im>=0?' + '+im+'i':' - '+Math.abs(im)+'i');}

  if(type==='add') {
    var re=a+c,im=b+d;
    return {
      statement:'Calcule ('+_fmtC(a,b)+') + ('+_fmtC(c,d)+').',
      equation:'z1 + z2 = (a+c) + (b+d)i',
      answer:_fmtC(re,im),
      compType:'add',
      hints:['Some as partes reais e imaginárias separadamente.','Real: '+a+'+'+c+'='+re+'  Imag: '+b+'+'+d+'='+im,_fmtC(re,im)],
    };
  }
  if(type==='multiply') {
    var re=a*c-b*d,im=a*d+b*c;
    return {
      statement:'Calcule ('+_fmtC(a,b)+') × ('+_fmtC(c,d)+').',
      equation:'z1 × z2 = (ac−bd) + (ad+bc)i',
      answer:_fmtC(re,im),
      compType:'mult', a:a,b:b,c:c,d:d,
      hints:['(a+bi)(c+di) = ac + adi + bci + bdi²','i² = −1, portanto bdi² = −bd',_fmtC(re,im)],
    };
  }
  if(type==='modulus') {
    var mod=Math.sqrt(a*a+b*b);
    var ans=Number.isInteger(mod)?String(mod):'√'+(a*a+b*b);
    return {
      statement:'Calcule o módulo de z = '+_fmtC(a,b)+'.',
      equation:'|z| = √(a² + b²)',
      answer:ans,
      compType:'mod', a:a,b:b,
      hints:['|z| = √(a² + b²)','|z| = √('+a+'² + '+b+'²) = √'+(a*a+b*b),'|z| = '+ans],
    };
  }
  if(type==='conjugate') {
    return {
      statement:'Encontre o conjugado de z = '+_fmtC(a,b)+'.',
      equation:'z̄ = a − bi',
      answer:_fmtC(a,-b),
      compType:'conj',
      hints:['O conjugado troca o sinal da parte imaginária.','Se z = '+_fmtC(a,b)+', então z̄ = '+a+' − '+Math.abs(b)+'i',_fmtC(a,-b)],
    };
  }
  // division
  var den=c*c+d*d;
  var re=Math.round((a*c+b*d)/den*100)/100;
  var im=Math.round((b*c-a*d)/den*100)/100;
  return {
    statement:'Calcule ('+_fmtC(a,b)+') ÷ ('+_fmtC(c,d)+').',
    equation:'z1/z2 = (z1 × z̄2) / |z2|²',
    answer:_fmtC(re,im),
    compType:'div', a:a,b:b,c:c,d:d,den:den,
    hints:['Multiplique numerador e denominador pelo conjugado de z2.','Conjugado de z2: '+_fmtC(c,-d)+', |z2|² = '+den,_fmtC(re,im)],
  };
}

  // ── combinatorics
  MathGenerators['combinatorics'] = function _genCombinatorics(difficulty) {
  _reseed();
  var types=['mult_principle','permutation','arrangement','combination','binomial'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='mult_principle') {
    var a=_randInt(2,8),b=_randInt(2,8),c=difficulty>1?_randInt(2,5):1;
    var total=a*b*(c>1?c:1);
    var stmt=c>1
      ?'Um menu tem '+a+' entradas, '+b+' pratos principais e '+c+' sobremesas. Quantas refeições distintas são possíveis?'
      :'Uma camisa vem em '+a+' cores e '+b+' tamanhos. Quantas combinações existem?';
    return {
      statement: stmt, equation: c>1?a+' × '+b+' × '+c:a+' × '+b, answer:String(total),
      combType:'mult',
      hints:['Princípio multiplicativo: multiplique as opções de cada etapa.',
             c>1?a+' × '+b+' × '+c+' = '+a*b+' × '+c:a+' × '+b,
             'Total = '+total],
    };
  }
  if(type==='permutation') {
    var n=_randInt(3,7);
    var p=1; for(var i=1;i<=n;i++) p*=i;
    return {
      statement:'De quantas formas '+n+' pessoas podem se sentar em '+n+' cadeiras distintas?',
      equation:'P_'+n+' = '+n+'!', answer:String(p),
      combType:'perm', n:n,
      hints:['Permutação: P_n = n!',''+n+'! = '+Array.from({length:n},function(_,i){return i+1;}).join(' × '),'P_'+n+' = '+p],
    };
  }
  if(type==='arrangement') {
    var n=_randInt(5,8),k=_randInt(2,Math.min(3,n-1));
    var A=1; for(var i=0;i<k;i++) A*=(n-i);
    return {
      statement:'Quantos arranjos de '+k+' elementos podem ser feitos com '+n+' elementos?',
      equation:'A('+n+','+k+') = '+n+'! / ('+(n-k)+')!', answer:String(A),
      combType:'arr', n:n, k:k,
      hints:['A(n,k) = n! / (n-k)! — a ordem importa.',
             Array.from({length:k},function(_,i){return n-i;}).join(' × ')+' = ?',
             'A('+n+','+k+') = '+A],
    };
  }
  if(type==='combination') {
    var n=_randInt(5,9),k=_randInt(2,Math.min(4,n-1));
    var C=_comb(n,k);
    return {
      statement:'Quantas combinações de '+k+' elementos podem ser feitas com '+n+' (a ordem não importa)?',
      equation:'C('+n+','+k+') = '+n+'! / ('+k+'! × '+(n-k)+')!', answer:String(C),
      combType:'comb', n:n, k:k,
      hints:['C(n,k) = n! / (k! × (n-k)!) — a ordem não importa.',
             'C('+n+','+k+') = A('+n+','+k+') / '+k+'! = ?',
             'C('+n+','+k+') = '+C],
    };
  }
  // binomial coefficient in Pascal triangle
  var n=_randInt(4,7),k=_randInt(1,n-1);
  var C=_comb(n,k);
  return {
    statement:'Calcule o coeficiente binomial C('+n+','+k+') (Triângulo de Pascal).',
    equation:'C('+n+','+k+')', answer:String(C),
    combType:'pascal', n:n, k:k,
    hints:['C(n,k) = C(n-1,k-1) + C(n-1,k).',
           'Ou diretamente: '+n+'! / ('+k+'! × '+(n-k)+')!',
           'C('+n+','+k+') = '+C],
  };
}

  // ── binomial
  MathGenerators['binomial'] = function _genBinomialNewton(difficulty) {
  _reseed();
  var types=['coeff','expand2','term_k','max_coeff','apply_x'];
  var type=types[Math.min(difficulty-1,4)];
  function bn(n,k){if(k<0||k>n)return 0;var r=1;for(var i=0;i<k;i++)r=r*(n-i)/(i+1);return Math.round(r);}
  if(type==='coeff'){
    var n=_randInt(4,8),k=_randInt(1,n-1),c=bn(n,k);
    return{statement:'Calcule C('+n+','+k+') (coeficiente binomial).',equation:'C('+n+','+k+')',answer:String(c),binomType:'coeff',
      hints:['C(n,k)=n!/(k!(n−k)!)',''+n+'!/('+k+'!×'+(n-k)+'!)',String(c)]};
  }
  if(type==='expand2'){
    var a=_randInt(1,3),b=_randInt(1,3);
    var c0=a*a,c1=2*a*b,c2=b*b;
    return{statement:'Expanda ('+a+'x+'+b+')² pelo Binômio de Newton.',
      equation:'('+a+'x+'+b+')²',answer:c0+'x² + '+c1+'x + '+c2,binomType:'expand',
      hints:['(a+b)²=C(2,0)a²+C(2,1)ab+C(2,2)b²',a+'²x²+2×'+a+'×'+b+'x+'+b+'²',c0+'x²+'+c1+'x+'+c2]};
  }
  if(type==='term_k'){
    var n=_randInt(4,7),k=_randInt(1,n-1),c=bn(n,k);
    return{statement:'Coeficiente do '+(k+1)+'º termo na expansão de (a+b)^'+n+'.',
      equation:'T_{k+1}=C('+n+','+k+')a^'+(n-k)+'b^'+k,answer:String(c),binomType:'term',
      hints:['T_{k+1}=C(n,k)a^(n-k)b^k','C('+n+','+k+')',String(c)]};
  }
  if(type==='max_coeff'){
    var n=_randInt(4,8),mid=Math.floor(n/2),c=bn(n,mid);
    return{statement:'Maior coeficiente binomial de (a+b)^'+n+'.',equation:'max C('+n+',k)',answer:String(c),binomType:'max',
      hints:['Coeficientes simétricos; máximo no centro.','k='+mid+': C('+n+','+mid+')',String(c)]};
  }
  var n=_randInt(4,7),k=_randInt(1,n-1),c=bn(n,k);
  return{statement:'Coeficiente de x^'+k+' em (1+x)^'+n+'.',
    equation:'T_{'+k+'+1}=C('+n+','+k+')×1^'+(n-k)+'×x^'+k,answer:String(c),binomType:'apply',
    hints:['1^(n−k)=1, logo coef=C(n,k).','C('+n+','+k+')',String(c)]};
}

  // ── probability
  MathGenerators['probability'] = function _genProbability(difficulty) {
  _reseed();
  var type = _probTypes[Math.min(_randInt(0, difficulty), _probTypes.length - 1)];

  if (type === 'classic') {
    // P(A) = favourable / total
    var total = _randInt(4, 20);
    var fav   = _randInt(1, total - 1);
    var g     = _gcd(fav, total);
    var ans   = (fav/g) + '/' + (total/g);
    return {
      statement: 'Uma urna tem ' + total + ' bolas. ' + fav + ' são vermelhas. Qual a probabilidade de sortear uma vermelha?',
      equation:  'P(V) = casos favoráveis / total',
      answer:    ans,
      probType:  'classic', fav: fav, total: total,
      hints: [
        'P(A) = número de casos favoráveis / número total de casos.',
        'P(V) = ' + fav + ' / ' + total,
        g > 1 ? 'Simplificando: ' + ans : 'P(V) = ' + ans,
      ],
    };
  }

  if (type === 'conditional') {
    var n = _randInt(10, 30);
    var a = _randInt(3, n - 3);
    var b = _randInt(2, a);
    var pA = a + '/' + n;
    var pAB= b + '/' + n;
    var g  = _gcd(b, a);
    var ans = (b/g) + '/' + (a/g);
    return {
      statement: 'Em um grupo de ' + n + ' alunos, ' + a + ' passaram na prova. Desses, ' + b + ' tiraram 10. Qual P(nota 10 | aprovado)?',
      equation:  'P(B|A) = P(A∩B) / P(A)',
      answer:    ans,
      probType:  'conditional',
      hints: [
        'P(B|A) = probabilidade de B dado que A ocorreu.',
        'P(B|A) = ' + b + ' / ' + a,
        g > 1 ? 'Simplificando: ' + ans : 'P(B|A) = ' + ans,
      ],
    };
  }

  if (type === 'combination') {
    var n = _randInt(4, 8), k = _randInt(1, Math.min(3, n-1));
    var cn = _comb(n, k);
    return {
      statement: 'Quantas combinações de ' + k + ' elementos podem ser feitas com ' + n + ' elementos (C(' + n + ',' + k + '))?',
      equation:  'C(' + n + ',' + k + ') = ' + n + '! / (' + k + '! × ' + (n-k) + '!)',
      answer:    String(cn),
      probType:  'combination', n: n, k: k,
      hints: [
        'C(n,k) = n! / (k! × (n-k)!)',
        n + '! / (' + k + '! × ' + (n-k) + '!) = ?',
        'C(' + n + ',' + k + ') = ' + cn,
      ],
    };
  }

  if (type === 'mean') {
    var len  = _randInt(4, 7);
    var vals = [];
    for (var i = 0; i < len; i++) vals.push(_randInt(1, 20));
    var sum  = vals.reduce(function(a,b){return a+b;}, 0);
    var mean = sum / len;
    var ans  = Number.isInteger(mean) ? String(mean) : mean.toFixed(2);
    return {
      statement: 'Calcule a média aritmética dos valores: ' + vals.join(', ') + '.',
      equation:  'Média = soma / quantidade',
      answer:    ans,
      probType:  'mean', vals: vals,
      hints: [
        'Some todos os valores: ' + vals.join(' + ') + ' = ' + sum,
        'Divida pela quantidade: ' + sum + ' / ' + len,
        'Média = ' + ans,
      ],
    };
  }

  // median
  var len  = _randInt(5, 9);
  var vals = [];
  for (var i = 0; i < len; i++) vals.push(_randInt(1, 30));
  var sorted = vals.slice().sort(function(a,b){return a-b;});
  var mid    = Math.floor(len / 2);
  var median = len % 2 === 1 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
  return {
    statement: 'Calcule a mediana dos valores: ' + vals.join(', ') + '.',
    equation:  'Ordene e encontre o valor central.',
    answer:    String(median),
    probType:  'median', vals: vals, sorted: sorted,
    hints: [
      'Ordene os valores: ' + sorted.join(', '),
      len % 2 === 1 ? 'Posição central: ' + (mid+1) + 'º valor = ' + sorted[mid] : 'Média dos dois centrais: (' + sorted[mid-1] + ' + ' + sorted[mid] + ') / 2',
      'Mediana = ' + median,
    ],
  };
}

  // ── prob_advanced
  MathGenerators['prob_advanced'] = function _genProbAdvanced(difficulty) {
  _reseed();
  var types = ['conditional','bayes','binomial_prob','binomial_exp','combined'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'conditional') {
    var pA = _randInt(3, 7) / 10, pAB = Math.round(_randInt(1, Math.floor(pA*10)-1)) / 10;
    var pB = _randInt(3, 7) / 10;
    var pAcB = Math.round(pAB / pB * 100) / 100;
    return { statement: 'P(A∩B) = ' + pAB + ' e P(B) = ' + pB + '. Calcule P(A|B).',
      equation: 'P(A|B) = P(A∩B) / P(B)',
      answer: String(pAcB), paType: 'cond',
      hints: ['P(A|B) = probabilidade de A dado que B ocorreu.', pAB + ' / ' + pB + ' = ?', String(pAcB)] };
  }
  if (type === 'bayes') {
    // Simple Bayes: disease test
    var prev = 0.01, sens = 0.95, spec = 0.90;
    var ppos = sens * prev + (1 - spec) * (1 - prev);
    var ppd = Math.round(sens * prev / ppos * 100) / 100;
    return { statement: 'Doença prevalência 1%. Teste: sensibilidade 95%, especificidade 90%. Dado teste +, qual P(doente)?',
      equation: 'P(D|+) = P(+|D)×P(D) / P(+)',
      answer: String(ppd), paType: 'bayes',
      hints: ['P(+) = P(+|D)×P(D) + P(+|saudável)×P(saudável)', '= 0,95×0,01 + 0,10×0,99 = ' + Math.round(ppos*1000)/1000, String(ppd)] };
  }
  if (type === 'binomial_prob') {
    var n = _randInt(3, 6), k = _randInt(0, 2), p = [0.5, 0.25, 0.3][_randInt(0, 2)];
    function comb(a,b){var r=1;for(var i=0;i<b;i++){r*=(a-i)/(i+1);}return Math.round(r);}
    var ans = Math.round(comb(n,k) * Math.pow(p,k) * Math.pow(1-p,n-k) * 1000) / 1000;
    return { statement: 'Binomial B(' + n + ', ' + p + '). Calcule P(X = ' + k + ').',
      equation: 'P(X=k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ',
      answer: String(ans), paType: 'binom',
      hints: ['C(' + n + ',' + k + ') = ' + comb(n,k), comb(n,k) + ' × ' + p + '^' + k + ' × ' + (1-p) + '^' + (n-k), String(ans)] };
  }
  if (type === 'binomial_exp') {
    var n = _randInt(4, 10), p = _randInt(1, 4) / 10;
    var e = Math.round(n * p * 100) / 100, v = Math.round(n * p * (1 - p) * 100) / 100;
    return { statement: 'Binomial B(' + n + ', ' + p + '). Calcule E(X) e Var(X).',
      equation: 'E(X) = np  |  Var(X) = np(1−p)',
      answer: 'E=' + e + ', Var=' + v, paType: 'expect',
      hints: ['E(X) = n×p = ' + n + '×' + p, 'Var(X) = n×p×(1−p) = ' + n + '×' + p + '×' + (1-p), 'E=' + e + ', Var=' + v] };
  }
  // combined
  var pA = _randInt(2, 5) / 10, pB = _randInt(2, 5) / 10;
  var pAuB = Math.round((pA + pB - pA * pB) * 100) / 100;
  return { statement: 'A e B independentes. P(A)=' + pA + ', P(B)=' + pB + '. Calcule P(A∪B).',
    equation: 'P(A∪B) = P(A) + P(B) − P(A∩B)',
    answer: String(pAuB), paType: 'union',
    hints: ['Independentes: P(A∩B) = P(A)×P(B) = ' + Math.round(pA*pB*100)/100, pA + ' + ' + pB + ' − ' + Math.round(pA*pB*100)/100, String(pAuB)] };
}
})();
