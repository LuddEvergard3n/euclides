/**
 * math/generators/efI.js
 * Ensino Fundamental I generators.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;

  // ── File-scoped helpers ──────────────────────────────────────────
  function _fmtFrac(a, b) {
    if (b === 0) return '∞';
    if (a % b === 0) return String(a / b);
    var g = _gcd(Math.abs(a), Math.abs(b));
    var sign = (a < 0) !== (b < 0) ? '-' : '';
    return sign + Math.abs(a / g) + '/' + Math.abs(b / g);
  }
  
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  function _g(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a||1;}
  function _lcm(a,b){return Math.abs(a*b)/_g(a,b);}
  function _frac(n,d){if(d===0)return '0';var g=_g(Math.abs(n),Math.abs(d));if(d<0){n=-n;d=-d;}n/=g;d/=g;return d===1?String(n):n+'/'+d;}

  var _shapes = ['square', 'rectangle', 'triangle', 'circle'];


  // ── arithmetic ─────────────────────────────────────────────
  var _arithTypes = ['addition', 'subtraction', 'multiplication', 'division',
                     'fraction', 'percentage'];

  MathGenerators['arithmetic'] = function _genArithmetic(difficulty) {
  _reseed();
  var type = _arithTypes[_randInt(0, Math.min(difficulty + 1, _arithTypes.length - 1))];
  var max  = difficulty <= 2 ? 20 : difficulty <= 4 ? 100 : 999;

  if (type === 'addition') {
    var a = _randInt(1, max), b = _randInt(1, max);
    return {
      statement: 'Calcule a soma.',
      equation:  a + ' + ' + b,
      answer:    String(a + b),
      hints: [
        'Some os algarismos da direita para a esquerda.',
        'Se a soma de uma coluna passar de 9, carregue 1 para a próxima.',
        a + ' + ' + b + ' = ' + (a + b),
      ],
    };
  }

  if (type === 'subtraction') {
    var a = _randInt(1, max), b = _randInt(1, a);
    return {
      statement: 'Calcule a subtração.',
      equation:  a + ' - ' + b,
      answer:    String(a - b),
      hints: [
        'Subtraia coluna por coluna da direita para a esquerda.',
        'Se precisar, pegue emprestado da coluna seguinte.',
        a + ' - ' + b + ' = ' + (a - b),
      ],
    };
  }

  if (type === 'multiplication') {
    var maxM = difficulty <= 2 ? 10 : 25;
    var a = _randInt(2, maxM), b = _randInt(2, maxM);
    return {
      statement: 'Calcule o produto.',
      equation:  a + ' × ' + b,
      answer:    String(a * b),
      hints: [
        'Multiplique ' + a + ' pelo algarismo das unidades de ' + b + '.',
        difficulty > 2 ? 'Some os produtos parciais alinhando pelas colunas.' : 'Use a tabuada.',
        a + ' × ' + b + ' = ' + (a * b),
      ],
    };
  }

  if (type === 'division') {
    var b = _randInt(2, difficulty <= 2 ? 9 : 12);
    var q = _randInt(2, difficulty <= 2 ? 9 : 20);
    var a = b * q;
    return {
      statement: 'Calcule o quociente (divisão exata).',
      equation:  a + ' ÷ ' + b,
      answer:    String(q),
      hints: [
        'Quantas vezes ' + b + ' cabe em ' + a + '?',
        'Ou: ' + a + ' ÷ ' + b + ' é o mesmo que encontrar x em ' + b + 'x = ' + a + '.',
        a + ' ÷ ' + b + ' = ' + q,
      ],
    };
  }

  if (type === 'fraction') {
    // a/b + c/b = (a+c)/b  (same denominator for d≤2, different for d>2)
    var den = _randInt(2, 9);
    var n1  = _randInt(1, den - 1);
    var n2  = _randInt(1, den - 1);
    var num = n1 + n2;
    var g   = _gcd(num, den);
    var rn  = num / g, rd = den / g;
    var ans = rd === 1 ? String(rn) : rn + '/' + rd;
    return {
      statement: 'Some as frações.',
      equation:  n1 + '/' + den + ' + ' + n2 + '/' + den,
      answer:    ans,
      hints: [
        'Denominadores iguais: some apenas os numeradores.',
        'Resultado: ' + num + '/' + den + (g > 1 ? ' — simplifique dividindo por ' + g : '') + '.',
        'Resposta: ' + ans,
      ],
    };
  }

  // percentage
  var pct  = [10, 20, 25, 50, 75][_randInt(0, 4)];
  var base = _randInt(2, 20) * (difficulty <= 2 ? 10 : 5);
  var res  = base * pct / 100;
  return {
    statement: 'Calcule a porcentagem.',
    equation:  pct + '% de ' + base,
    answer:    String(res),
    hints: [
      pct + '% = ' + pct + '/100.',
      'Multiplique: ' + base + ' × ' + pct + '/100 = ' + base + ' × ' + (pct/100) + '.',
      pct + '% de ' + base + ' = ' + res,
    ],
  };
};

  // ── Arithmetic op-specific aliases ────────────────────────────────────
  // arithmetic.js requests generators by operation type (e.g. 'arith_subtraction').
  // Named function declarations avoid the ASI pitfall of calling the previous
  // expression when an IIFE follows a closing brace without semicolon.
  function _makeArithGen(forcedType) {
    return function(difficulty) {
      _reseed();
      var max = difficulty <= 2 ? 20 : difficulty <= 4 ? 100 : 999;
      if (forcedType === 'addition') {
        var a = _randInt(1, max), b = _randInt(1, max);
        return { statement: 'Calcule a soma.', equation: a + ' + ' + b, answer: String(a + b),
          hints: ['Some os algarismos da direita para a esquerda.',
                  'Se a soma de uma coluna passar de 9, carregue 1 para a próxima.',
                  a + ' + ' + b + ' = ' + (a + b)] };
      }
      if (forcedType === 'subtraction') {
        var a = _randInt(1, max), b = _randInt(1, a);
        return { statement: 'Calcule a subtração.', equation: a + ' - ' + b, answer: String(a - b),
          hints: ['Subtraia coluna por coluna da direita para a esquerda.',
                  'Se precisar, pegue emprestado da coluna seguinte.',
                  a + ' - ' + b + ' = ' + (a - b)] };
      }
      if (forcedType === 'multiplication') {
        var maxM = difficulty <= 2 ? 10 : 25;
        var a = _randInt(2, maxM), b = _randInt(2, maxM);
        return { statement: 'Calcule o produto.', equation: a + ' × ' + b, answer: String(a * b),
          hints: ['Multiplique ' + a + ' pelo algarismo das unidades de ' + b + '.',
                  difficulty > 2 ? 'Some os produtos parciais alinhando pelas colunas.' : 'Use a tabuada.',
                  a + ' × ' + b + ' = ' + (a * b)] };
      }
      // division
      var b = _randInt(2, difficulty <= 2 ? 9 : 12);
      var q = _randInt(2, difficulty <= 2 ? 9 : 20);
      var a = b * q;
      return { statement: 'Calcule o quociente (divisão exata).', equation: a + ' ÷ ' + b, answer: String(q),
        hints: ['Quantas vezes ' + b + ' cabe em ' + a + '?',
                'Ou: ' + a + ' ÷ ' + b + ' é o mesmo que encontrar x em ' + b + 'x = ' + a + '.',
                a + ' ÷ ' + b + ' = ' + q] };
    };
  }
  var _arithOps = ['addition', 'subtraction', 'multiplication', 'division'];
  for (var _oi = 0; _oi < _arithOps.length; _oi++) {
    MathGenerators['arith_' + _arithOps[_oi]] = _makeArithGen(_arithOps[_oi]);
    MathGenerators[_arithOps[_oi]]            = _makeArithGen(_arithOps[_oi]);
  }

  // ── geometry ─────────────────────────────────────────────
  MathGenerators['geometry'] = function _genGeometry(difficulty) {
  _reseed();
  var idx   = _randInt(0, Math.min(difficulty, _shapes.length - 1));
  var shape = _shapes[idx];
  var type  = difficulty <= 3 ? 'area' : (Math.random() < 0.5 ? 'area' : 'perimeter');

  if (shape === 'square') {
    var s = _randInt(2, 15);
    if (type === 'area') {
      return {
        statement: 'Calcule a área do quadrado de lado ' + s + '.',
        equation:  'A = l²  |  l = ' + s,
        answer:    String(s * s),
        shape: 'square', s: s, type: 'area',
        hints: ['A = l²', 'A = ' + s + '² = ' + s + ' × ' + s, 'A = ' + (s*s)],
      };
    }
    return {
      statement: 'Calcule o perímetro do quadrado de lado ' + s + '.',
      equation:  'P = 4l  |  l = ' + s,
      answer:    String(4 * s),
      shape: 'square', s: s, type: 'perimeter',
      hints: ['P = 4l (quatro lados iguais)', 'P = 4 × ' + s, 'P = ' + (4*s)],
    };
  }

  if (shape === 'rectangle') {
    var w = _randInt(2, 20), h = _randInt(2, 15);
    while (w === h) w = _randInt(2, 20);
    if (type === 'area') {
      return {
        statement: 'Calcule a área do retângulo de base ' + w + ' e altura ' + h + '.',
        equation:  'A = b × h  |  b = ' + w + ', h = ' + h,
        answer:    String(w * h),
        shape: 'rectangle', w: w, h: h, type: 'area',
        hints: ['A = base × altura', 'A = ' + w + ' × ' + h, 'A = ' + (w*h)],
      };
    }
    return {
      statement: 'Calcule o perímetro do retângulo de base ' + w + ' e altura ' + h + '.',
      equation:  'P = 2(b + h)  |  b = ' + w + ', h = ' + h,
      answer:    String(2 * (w + h)),
      shape: 'rectangle', w: w, h: h, type: 'perimeter',
      hints: ['P = 2(b + h)', 'P = 2(' + w + ' + ' + h + ') = 2 × ' + (w+h), 'P = ' + (2*(w+h))],
    };
  }

  if (shape === 'triangle') {
    // Right triangle — area or Pythagorean theorem
    var a = _randInt(3, 12), b = _randInt(3, 12);
    var area = (a * b) / 2;
    if (type === 'area') {
      return {
        statement: 'Calcule a área do triângulo retângulo com catetos ' + a + ' e ' + b + '.',
        equation:  'A = (b × h) / 2  |  b = ' + a + ', h = ' + b,
        answer:    String(area),
        shape: 'triangle', a: a, b: b, type: 'area',
        hints: ['A = base × altura / 2', 'A = ' + a + ' × ' + b + ' / 2', 'A = ' + area],
      };
    }
    // Perimeter via Pythagoras: c = sqrt(a²+b²)
    var c2 = a*a + b*b;
    var c  = Math.sqrt(c2);
    var cStr = Number.isInteger(c) ? String(c) : c.toFixed(2);
    return {
      statement: 'Calcule a hipotenusa do triângulo retângulo com catetos ' + a + ' e ' + b + ' (use Pitágoras).',
      equation:  'c² = a² + b²  |  a = ' + a + ', b = ' + b,
      answer:    cStr,
      shape: 'triangle', a: a, b: b, type: 'hypotenuse',
      hints: [
        'Teorema de Pitágoras: c² = a² + b²',
        'c² = ' + a + '² + ' + b + '² = ' + (a*a) + ' + ' + (b*b) + ' = ' + c2,
        'c = √' + c2 + ' = ' + cStr,
      ],
    };
  }

  // circle
  var r = _randInt(2, 10);
  if (type === 'area') {
    var area = Math.round(Math.PI * r * r * 100) / 100;
    return {
      statement: 'Calcule a área do círculo de raio ' + r + '. Use π ≈ 3,14.',
      equation:  'A = π × r²  |  r = ' + r,
      answer:    String(Math.round(3.14 * r * r * 100) / 100),
      shape: 'circle', r: r, type: 'area',
      hints: ['A = π × r²', 'A = 3,14 × ' + r + '² = 3,14 × ' + (r*r), 'A = ' + (Math.round(3.14*r*r*100)/100)],
    };
  }
  var circ = Math.round(2 * 3.14 * r * 100) / 100;
  return {
    statement: 'Calcule a circunferência do círculo de raio ' + r + '. Use π ≈ 3,14.',
    equation:  'C = 2πr  |  r = ' + r,
    answer:    String(circ),
    shape: 'circle', r: r, type: 'circumference',
    hints: ['C = 2 × π × r', 'C = 2 × 3,14 × ' + r + ' = ' + (2*3.14) + ' × ' + r, 'C = ' + circ],
  };
}

  // ── fractions ─────────────────────────────────────────────
  MathGenerators['fractions'] = function _genFractions(difficulty) {
  _reseed();
  var types=['simplify','add','subtract','multiply','divide'];
  var type=types[Math.min(difficulty-1,4)];
  function rf(mx){var d=_randInt(2,mx),n=_randInt(1,d*2-1);return{n:n,d:d};}
  if(type==='simplify'){
    var d=_randInt(2,12),k=_randInt(2,6),n=_randInt(1,d-1);
    return{statement:'Simplifique a fração '+(n*k)+'/'+(d*k)+'.',equation:(n*k)+'/'+(d*k)+' = ?',answer:_frac(n,d),fracType:'simplify',
      hints:['MDC('+n*k+','+d*k+') = '+_g(n*k,d*k),'Divida numerador e denominador pelo MDC.',_frac(n,d)]};
  }
  if(type==='add'||type==='subtract'){
    var a=rf(8),b=rf(8),sign=type==='add'?1:-1,op=type==='add'?'+':'−';
    var rn=a.n*b.d+sign*b.n*a.d,rd=a.d*b.d;
    return{statement:'Calcule: '+_frac(a.n,a.d)+' '+op+' '+_frac(b.n,b.d)+'.',equation:_frac(a.n,a.d)+' '+op+' '+_frac(b.n,b.d),answer:_frac(rn,rd),fracType:type,
      hints:['MMC('+a.d+','+b.d+') = '+_lcm(a.d,b.d),'Ajuste os numeradores.',_frac(rn,rd)]};
  }
  if(type==='multiply'){
    var a=rf(8),b=rf(8),rn=a.n*b.n,rd=a.d*b.d;
    return{statement:'Calcule: '+_frac(a.n,a.d)+' × '+_frac(b.n,b.d)+'.',equation:_frac(a.n,a.d)+' × '+_frac(b.n,b.d),answer:_frac(rn,rd),fracType:'multiply',
      hints:['Multiplique numeradores e denominadores.',a.n+'×'+b.n+'='+rn+'  e  '+a.d+'×'+b.d+'='+rd,_frac(rn,rd)]};
  }
  var a=rf(8),b=rf(6);while(b.n===0)b=rf(6);
  var rn=a.n*b.d,rd=a.d*b.n;
  return{statement:'Calcule: '+_frac(a.n,a.d)+' ÷ '+_frac(b.n,b.d)+'.',equation:_frac(a.n,a.d)+' ÷ '+_frac(b.n,b.d),answer:_frac(rn,rd),fracType:'divide',
    hints:['Divisão: inverta e multiplique.',_frac(a.n,a.d)+' × '+_frac(b.d,b.n),_frac(rn,rd)]};
}

  // ── mmc_mdc ─────────────────────────────────────────────
  MathGenerators['mmc_mdc'] = function _genMmcMdc(difficulty) {
  _reseed();
  var a=_randInt(2,difficulty<=2?20:60),b=_randInt(2,difficulty<=2?20:60);
  if(difficulty===5){
    var c=_randInt(2,20);
    var ask=_randInt(0,1)===0;
    var ans=ask?String(_lcm(_lcm(a,b),c)):String(_g(_g(a,b),c));
    return{statement:(ask?'MMC':'MDC')+' de '+a+', '+b+' e '+c+'.',equation:(ask?'MMC':'MDC')+'('+a+','+b+','+c+')',answer:ans,mmcType:ask?'mmc':'mdc',
      hints:['Fatore cada número em primos.',ask?'MMC: maior expoente de cada fator.':'MDC: fatores comuns com menor expoente.',ans]};
  }
  var ask=_randInt(0,1)===0;
  var ans=ask?String(_lcm(a,b)):String(_g(a,b));
  return{statement:(ask?'Calcule o MMC':'Calcule o MDC')+' de '+a+' e '+b+'.',equation:(ask?'MMC':'MDC')+'('+a+','+b+')',answer:ans,mmcType:ask?'mmc':'mdc',
    hints:['Fatore: '+a+' e '+b+'.',ask?'MMC: produto dos fatores com maior expoente.':'MDC: produto dos fatores comuns.',ans]};
}

  // ── ratio ─────────────────────────────────────────────
  MathGenerators['ratio'] = function _genRatioProportion(difficulty) {
  _reseed();
  var types=['ratio','proportion','rule3_direct','rule3_inverse','rule3_compound'];
  var type=types[Math.min(difficulty-1,4)];
  if(type==='ratio'){
    var a=_randInt(2,20)*_randInt(1,4),b=_randInt(2,20)*_randInt(1,4),g=_g(a,b);
    return{statement:'Simplifique a razão '+a+':'+b+'.',equation:a+':'+b,answer:(a/g)+':'+(b/g),ratioType:'ratio',
      hints:['Divida ambos pelo MDC('+a+','+b+') = '+g,''+(a/g)+':'+(b/g),(a/g)+':'+(b/g)]};
  }
  if(type==='proportion'){
    var a=_randInt(2,10),b=_randInt(2,10),c=_randInt(2,10)*a,x=c*b/a;
    return{statement:'Se '+a+'/'+b+' = '+c+'/x, qual é x?',equation:a+'/'+b+' = '+c+'/x',answer:String(x),ratioType:'proportion',
      hints:['Produto cruzado: '+a+'×x = '+b+'×'+c,'x = '+(b*c)+'/'+a,String(x)]};
  }
  if(type==='rule3_direct'){
    var u=_randInt(2,20),q1=_randInt(2,12),q2=_randInt(2,15);
    return{statement:q1+' produtos custam R$ '+(u*q1)+',00. Quanto custam '+q2+' produtos?',
      equation:'Regra de três direta',answer:String(u*q2),ratioType:'r3d',
      hints:['Relação direta: mais quantidade → mais custo.','Valor unitário = R$ '+u,String(u*q2)]};
  }
  if(type==='rule3_inverse'){
    var w=_randInt(2,8),d=_randInt(3,15),w2=_randInt(2,w*2);
    var d2=w*d/w2;
    return{statement:w+' operários fazem um trabalho em '+d+' dias. Em quantos dias '+w2+' operários fariam o mesmo?',
      equation:'Regra de três inversa',answer:String(d2),ratioType:'r3i',
      hints:['Relação inversa: mais operários → menos dias.',w+'×'+d+' = '+w2+'×x','x = '+(w*d)+'/'+w2+' = '+d2]};
  }
  var m=_randInt(2,6),h=_randInt(4,8),d=_randInt(3,10);
  var m2=_randInt(2,8),h2=_randInt(4,10),d2=(m*h*d)/(m2*h2);
  return{statement:m+' máquinas '+h+' h/dia fazem um lote em '+d+' dias. Em quantos dias '+m2+' máquinas '+h2+' h/dia fariam o mesmo?',
    equation:'Regra de três composta',answer:String(d2),ratioType:'r3c',
    hints:['Produto constante: '+m+'×'+h+'×'+d+' = '+m2+'×'+h2+'×x',
           'x = '+(m*h*d)+'/('+m2+'×'+h2+')',String(d2)]};
}

  // ── powers ─────────────────────────────────────────────
  MathGenerators['powers'] = function _genPowersRoots(difficulty) {
  _reseed();
  var types=['power_int','sqrt','nth_root','power_frac','rationalize'];
  var type=types[Math.min(difficulty-1,4)];
  if(type==='power_int'){
    var base=_randInt(-5,5),exp=_randInt(2,4);
    while(base===0||base===1||base===-1)base=_randInt(-5,5);
    return{statement:'Calcule '+base+'^'+exp+'.',equation:base+'^'+exp,answer:String(Math.pow(base,exp)),powType:'int',
      hints:['Multiplique '+base+' por si mesmo '+exp+' vezes.',Array.from({length:exp},function(){return base;}).join('×'),String(Math.pow(base,exp))]};
  }
  if(type==='sqrt'){
    var perfs=[4,9,16,25,36,49,64,81,100,121,144];
    var v=perfs[_randInt(0,perfs.length-1)];
    return{statement:'Calcule √'+v+'.',equation:'√'+v,answer:String(Math.sqrt(v)),powType:'sqrt',
      hints:['√'+v+' = qual número ao quadrado = '+v+'?','Quadrados perfeitos: 1,4,9,16,25,36...',String(Math.sqrt(v))]};
  }
  if(type==='nth_root'){
    var cubes=[8,27,64,125,216],fours=[16,81,256];
    var useCube=_randInt(0,1)===0;
    var arr=useCube?cubes:fours,n=useCube?3:4;
    var val=arr[_randInt(0,arr.length-1)];
    var root=Math.round(Math.pow(val,1/n));
    return{statement:'Calcule '+n+'√'+val+' (raiz '+n+'ª de '+val+').',equation:n+'√'+val,answer:String(root),powType:'nth',
      hints:['Qual número elevado a '+n+' dá '+val+'?',root+'^'+n+' = '+Math.pow(root,n),String(root)]};
  }
  if(type==='power_frac'){
    var base=_randInt(2,5),p=_randInt(1,3),q=_randInt(2,4);
    var val=Math.pow(base,p/q),ans=Number.isInteger(val)?String(val):String(Math.round(val*100)/100);
    return{statement:'Calcule '+base+'^('+p+'/'+q+').',equation:base+'^('+p+'/'+q+')',answer:ans,powType:'frac',
      hints:['a^(p/q) = (ᵠ√a)^p','Raiz '+q+'ª de '+base+' primeiro, depois eleve a '+p,ans]};
  }
  var b=_randInt(2,7);
  return{statement:'Racionalize: 1/√'+b+'.',equation:'1/√'+b,answer:'√'+b+'/'+b,powType:'rat',
    hints:['Multiplique por √'+b+'/√'+b+'.','(1×√'+b+')/(√'+b+'×√'+b+') = √'+b+'/'+b,'√'+b+'/'+b]};
}
})();
