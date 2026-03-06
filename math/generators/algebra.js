/**
 * math/generators/algebra.js
 * Algebra generators (equations, inequalities, systems, polynomials).
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;

  // ── File-scoped helpers ──────────────────────────────────────────
  function _fmtQuad(a, b, c) {
    var s = (a === 1 ? '' : a === -1 ? '-' : String(a)) + 'x²';
    if (b !== 0) s += (b > 0 ? ' + ' : ' - ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x';
    if (c !== 0) s += (c > 0 ? ' + ' : ' - ') + Math.abs(c);
    return s;
  }
  
  function _fmtNum(n) {
    if (!isFinite(n)) return '∞';
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/\.?0+$/, '');
  }
  
  // ── Probability / Statistics generators ──────────────────────────

  function _fmtPoly(cs) {
    var n=cs.length-1, s='';
    cs.forEach(function(c,i){
      var exp=n-i;
      if(c===0) return;
      var sign=c>0?(s?'+':''):(s?'-':'-');
      var abs=Math.abs(c);
      var term=exp===0?String(abs):exp===1?(abs===1?'x':abs+'x'):(abs===1?'x^'+exp:abs+'x^'+exp);
      s+=(s?' ':'')+sign+(s||c<0?abs===1&&exp>0?'':abs:term==='x'?'':'')+term;
    });
    return s||'0';
  }


  // ── equations1 ─────────────────────────────────────────────
  function _fmtFrac(a, b) {
    if (b === 0) return '∞';
    if (a % b === 0) return String(a / b);
    var g = _gcd(Math.abs(a), Math.abs(b));
    var sign = (a < 0) !== (b < 0) ? '-' : '';
    return sign + Math.abs(a / g) + '/' + Math.abs(b / g);
  }
  
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  MathGenerators['equations1'] = function _genEq1(difficulty) {
  _reseed();
  var maxCoef = difficulty <= 2 ? 9 : difficulty <= 4 ? 19 : 49;
  var a = _randInt(1, maxCoef);
  var x = _randInt(-maxCoef, maxCoef);
  if (x === 0) x = 1;
  var b = difficulty > 1 ? _randInt(-maxCoef, maxCoef) : 0;
  var c = a * x + b;

  var equation;
  if (b === 0)       equation = a === 1 ? 'x = ' + c : a + 'x = ' + c;
  else if (b > 0)    equation = (a === 1 ? 'x' : a + 'x') + ' + ' + b + ' = ' + c;
  else               equation = (a === 1 ? 'x' : a + 'x') + ' - ' + Math.abs(b) + ' = ' + c;

  var hints = [
    b !== 0
      ? 'Isole o termo com x: passe ' + (b > 0 ? b : b) + ' para o outro lado'
      : 'Você precisa isolar x.',
    a !== 1
      ? 'Divida os dois lados por ' + a
      : 'x já está isolado com coeficiente 1.',
    'x = ' + x,
  ];

  return {
    statement: 'Resolva a equação abaixo e encontre o valor de x.',
    equation:  equation,
    answer:    String(x),
    hints:     hints,
  };
}

  // ── equations2 ─────────────────────────────────────────────
  MathGenerators['equations2'] = function _genEq2(difficulty) {
  _reseed();
  // Generate from roots to guarantee integer solutions on lower difficulties
  if (difficulty <= 3) {
    var r1 = _randInt(-9, 9);
    var r2 = _randInt(-9, 9);
    if (r1 === r2 && difficulty < 3) r2++;
    // a(x - r1)(x - r2) = 0  → a=1 for simplicity
    var a = 1;
    var b = -(r1 + r2);
    var c = r1 * r2;
    var delta = b * b - 4 * a * c;

    var eq = 'x²';
    if (b > 0)  eq += ' + ' + b + 'x';
    else if (b < 0) eq += ' - ' + Math.abs(b) + 'x';
    if (c > 0)  eq += ' + ' + c + ' = 0';
    else if (c < 0) eq += ' - ' + Math.abs(c) + ' = 0';
    else eq += ' = 0';

    var answer = r1 === r2 ? String(r1) : r1 + ' ou ' + r2;
    var sqrtDelta = Math.sqrt(delta);

    return {
      statement: 'Resolva a equação de 2º grau usando Bhaskara.',
      equation:  eq,
      answer:    answer,
      delta:     delta,
      a: a, b: b, c: c,
      hints: [
        'Identifique: a = ' + a + ', b = ' + b + ', c = ' + c,
        'Δ = b² − 4ac = ' + b + '² − 4·' + a + '·' + c + ' = ' + delta,
        delta < 0
          ? 'Δ < 0: a equação não tem raízes reais.'
          : 'x = (−b ± √Δ) / 2a = (' + (-b) + ' ± ' + sqrtDelta + ') / ' + (2 * a),
      ],
    };
  }

  // Higher difficulty: random a, non-integer solutions possible
  var a2 = _randInt(1, 4);
  var b2 = _randInt(-10, 10);
  var c2 = _randInt(-10, 10);
  var delta2 = b2 * b2 - 4 * a2 * c2;

  var eq2 = (a2 === 1 ? '' : a2) + 'x²';
  if (b2 > 0)  eq2 += ' + ' + b2 + 'x';
  else if (b2 < 0) eq2 += ' - ' + Math.abs(b2) + 'x';
  if (c2 > 0)  eq2 += ' + ' + c2 + ' = 0';
  else if (c2 < 0) eq2 += ' - ' + Math.abs(c2) + ' = 0';
  else eq2 += ' = 0';

  var answer2;
  if (delta2 < 0) {
    answer2 = 'sem raízes reais';
  } else if (delta2 === 0) {
    answer2 = _fmtFrac(-b2, 2 * a2);
  } else {
    var s = Math.sqrt(delta2);
    if (Number.isInteger(s)) {
      answer2 = _fmtFrac(-b2 + s, 2 * a2) + ' ou ' + _fmtFrac(-b2 - s, 2 * a2);
    } else {
      answer2 = '(' + (-b2) + ' + √' + delta2 + ') / ' + (2 * a2)
              + ' ou (' + (-b2) + ' - √' + delta2 + ') / ' + (2 * a2);
    }
  }

  return {
    statement: 'Resolva a equação de 2º grau usando Bhaskara.',
    equation:  eq2,
    answer:    answer2,
    delta:     delta2,
    a: a2, b: b2, c: c2,
    hints: [
      'Identifique: a = ' + a2 + ', b = ' + b2 + ', c = ' + c2,
      'Δ = b² − 4ac = ' + delta2,
      delta2 < 0 ? 'Δ < 0: sem raízes reais.' : 'Aplique: x = (−b ± √Δ) / 2a',
    ],
  };
}

  // ── inequalities ─────────────────────────────────────────────
  MathGenerators['inequalities'] = function _genInequalities(difficulty) {
  _reseed();
  var types=['ineq1_basic','ineq1_neg','ineq2_pos','ineq2_neg','ineq_system'];
  var type=types[Math.min(difficulty-1,4)];
  var syms=['<','>','<=','>='],fsyms={'<':'>','>':'<','<=':'>=','>=':'<='};
  if(type==='ineq1_basic'){
    var a=_randInt(1,5),b=_randInt(-10,10),c=_randInt(-10,10),sym=syms[_randInt(0,3)];
    var rhs=(c-b)/a;
    return{statement:'Resolva: '+a+'x + '+b+' '+sym+' '+c+'.',equation:a+'x + '+b+' '+sym+' '+c,answer:'x '+sym+' '+rhs,ineqType:'ineq1',
      hints:['Subtraia '+b+' dos dois lados.',a+'x '+sym+' '+(c-b),'x '+sym+' '+rhs]};
  }
  if(type==='ineq1_neg'){
    var a=_randInt(-5,-1),b=_randInt(-10,10),c=_randInt(-10,10),sym=syms[_randInt(0,1)];
    var rhs=(c-b)/a,fsym=fsyms[sym];
    return{statement:'Resolva: '+a+'x + '+b+' '+sym+' '+c+'. (atenção ao sinal ao dividir)',
      equation:a+'x + '+b+' '+sym+' '+c,answer:'x '+fsym+' '+rhs,ineqType:'ineq1_neg',
      hints:['Ao dividir por número negativo, o sinal INVERTE.',a+'x '+sym+' '+(c-b),'÷('+a+'): x '+fsym+' '+rhs]};
  }
  if(type==='ineq2_pos'||type==='ineq2_neg'){
    var r1=_randInt(-5,5),r2=_randInt(-5,5);
    while(r1===r2)r2=_randInt(-5,5);
    var lo=Math.min(r1,r2),hi=Math.max(r1,r2);
    var b=-(r1+r2),c=r1*r2;
    function fmtQ(b,c){return 'x²'+(b>0?' + '+b:b<0?' − '+Math.abs(b):'')+(c>0?' + '+c:c<0?' − '+Math.abs(c):'');}
    var isPos=type==='ineq2_pos';
    var ask=isPos?'> 0':'< 0';
    var ans=isPos?'x < '+lo+' ou x > '+hi:lo+' < x < '+hi;
    return{statement:'Resolva: '+fmtQ(b,c)+' '+ask+'.',equation:fmtQ(b,c)+' '+ask,answer:ans,ineqType:'ineq2',
      hints:['Raízes: x₁='+lo+', x₂='+hi,'Parábola com a=1 > 0'+(isPos?': positiva fora das raízes.':': negativa entre as raízes.'),ans]};
  }
  var a1=_randInt(1,3),b1=_randInt(-8,8),c1=_randInt(-8,8);
  var a2=_randInt(1,3),b2=_randInt(-8,8),c2=_randInt(-8,8);
  var x1=(c1-b1)/a1,x2=(c2-b2)/a2;
  var lo2=Math.min(x1,x2),hi2=Math.max(x1,x2);
  var ans=x1===x2?'sem solução':lo2+' < x < '+hi2;
  return{statement:'Resolva: '+a1+'x+'+b1+' < '+c1+' e '+a2+'x+'+b2+' > '+c2+'.',
    equation:a1+'x+'+b1+'<'+c1+' ∩ '+a2+'x+'+b2+'>'+c2,answer:ans,ineqType:'system',
    hints:['Resolva cada inequação.',('x < '+x1)+' e '+'x > '+x2,ans]};
}

  // ── modular ─────────────────────────────────────────────
  MathGenerators['modular'] = function _genModular(difficulty) {
  _reseed();
  var types=['abs_basic','abs_ineq','irrational','abs_double','irrational_quad'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='abs_basic'){
    var a=_randInt(1,4),b=_randInt(-8,8),c=_randInt(1,12);
    // |ax+b|=c → ax+b=c or ax+b=-c
    var x1=(c-b)/a,x2=(-c-b)/a;
    var ans=x1===x2?'x='+x1:'x='+Math.min(x1,x2)+' ou x='+Math.max(x1,x2);
    return{statement:'Resolva: |'+a+'x + '+b+'| = '+c+'.',equation:'|'+a+'x + '+b+'| = '+c,answer:ans,modType:'abs',
      hints:['|expr|=k ↔ expr=k ou expr=−k',''+a+'x+'+b+'='+c+' e '+a+'x+'+b+'='+(-c),ans]};
  }
  if(type==='abs_ineq'){
    var a=_randInt(1,3),b=_randInt(-6,6),c=_randInt(1,10);
    var lo=(-c-b)/a,hi=(c-b)/a;
    if(lo>hi){var tmp=lo;lo=hi;hi=tmp;}
    return{statement:'Resolva: |'+a+'x + '+b+'| < '+c+'.',equation:'|'+a+'x + '+b+'| < '+c,
      answer:lo+' < x < '+hi,modType:'abs_ineq',
      hints:['|expr|<k ↔ −k < expr < k',''+(-c)+' < '+a+'x+'+b+' < '+c,lo+' < x < '+hi]};
  }
  if(type==='irrational'){
    var k=_randInt(1,8),a=_randInt(1,5);
    // √(ax+k²) = a  → ax+k²=a²  → x=(a²-k²)/a  but let's keep clean
    var n=_randInt(2,6),sq=n*n,b=_randInt(1,10);
    // √(x+b) = n  → x = n²-b
    var ans=sq-b;
    if(ans<0){b=1;ans=sq-1;}
    return{statement:'Resolva: √(x + '+b+') = '+n+'.',equation:'√(x + '+b+') = '+n,
      answer:ans>=0?'x='+ans:'sem solução',modType:'irr',
      hints:['√(expr)=k ↔ expr=k² (k≥0)','x+'+b+' = '+sq,'x = '+sq+'−'+b+' = '+ans]};
  }
  if(type==='abs_double'){
    var a=_randInt(1,4),b=_randInt(1,6),c=_randInt(1,6),d=_randInt(1,8);
    // |x-a|+|x+b|=c+d style... keep it simple: |x-a|=|x-b|
    // |x-a|=|x-b| → x-a=x-b (no sol unless a=b) or x-a=-(x-b)
    // → 2x=a+b → x=(a+b)/2
    var ans=(a+b)/2;
    return{statement:'Resolva: |x − '+a+'| = |x − '+b+'|.',equation:'|x−'+a+'| = |x−'+b+'|',
      answer:'x='+ans,modType:'abs2',
      hints:['|A|=|B| ↔ A=B ou A=−B','Caso A=B: x−'+a+'=x−'+b+' → sem sol (a≠b). Caso A=−B: x−'+a+'=−(x−'+b+').','2x='+a+'+'+b+' → x='+(a+b)+'/2='+ans]};
  }
  // irrational quadratic: √(ax²+b) = c
  var c=_randInt(2,5),b=_randInt(1,8),a=1;
  // √(x²+b)=c → x²=c²-b
  var rhs=c*c-b;
  var ans=rhs>=0?(Number.isInteger(Math.sqrt(rhs))?'x=±'+Math.sqrt(rhs):'x=±√'+rhs):'sem solução';
  return{statement:'Resolva: √(x² + '+b+') = '+c+'.',equation:'√(x² + '+b+') = '+c,answer:ans,modType:'irr_quad',
    hints:['Eleve ao quadrado: x²+'+b+' = '+c*c,'x² = '+(c*c)+' − '+b+' = '+rhs,ans]};
}

  // ── systems ─────────────────────────────────────────────
  MathGenerators['systems'] = function _genSystems(difficulty) {
  _reseed();
  // Generate 2x2 system: a1x + b1y = c1, a2x + b2y = c2 with integer solution
  var x0 = _randInt(-5, 5), y0 = _randInt(-5, 5);
  var a1 = _randInt(-4, 4); while (a1 === 0) a1 = _randInt(-4, 4);
  var b1 = _randInt(-4, 4); while (b1 === 0) b1 = _randInt(-4, 4);
  var a2 = _randInt(-4, 4); while (a2 === 0) a2 = _randInt(-4, 4);
  var b2 = _randInt(-4, 4);
  // Ensure det != 0
  while (a1*b2 - a2*b1 === 0) { b2 = _randInt(-4, 4); }
  var c1 = a1*x0 + b1*y0;
  var c2 = a2*x0 + b2*y0;
  function _fmtLine(a, b, c) {
    var s = (a===1?'':a===-1?'-':String(a))+'x';
    s += b>0?' + '+(b===1?'':String(b))+'y':b<0?' - '+(Math.abs(b)===1?'':String(Math.abs(b)))+'y':'';
    s += ' = '+c;
    return s;
  }
  var method = difficulty <= 2 ? 'substituição' : 'eliminação';
  return {
    statement: 'Resolva o sistema pelo método de '+method+'. Informe x e y.',
    equation:  _fmtLine(a1,b1,c1)+' | '+_fmtLine(a2,b2,c2),
    answer:    'x='+x0+', y='+y0,
    sysType:   method, a1:a1,b1:b1,c1:c1, a2:a2,b2:b2,c2:c2, x0:x0,y0:y0,
    hints: [
      method==='substituição'
        ? 'Isole x na 1ª equação: x = ('+c1+' - '+b1+'y) / '+a1
        : 'Multiplique as equações para eliminar uma variável.',
      method==='substituição'
        ? 'Substitua na 2ª equação e resolva para y.'
        : 'Some ou subtraia as equações resultantes.',
      'x = '+x0+', y = '+y0,
    ],
  };
}

  // ── polynomials ─────────────────────────────────────────────
  MathGenerators['polynomials'] = function _genPolynomials(difficulty) {
  _reseed();
  var type = ['eval','degree','factor','roots','expand'][Math.min(difficulty-1,4)];

  if (type==='eval'||type==='degree') {
    var n  = _randInt(2, 4);
    var cs = [];
    for (var i=0;i<=n;i++) { var c=_randInt(-5,5); if(i===n&&c===0)c=1; cs.push(c); }
    if (type==='degree') {
      return {
        statement: 'Qual o grau do polinômio p(x) = '+_fmtPoly(cs)+'?',
        equation:  'p(x) = '+_fmtPoly(cs),
        answer:    String(n),
        polyType:  'degree', coeffs:cs,
        hints:['O grau é o maior expoente com coeficiente não nulo.','O coeficiente líder é '+cs[0]+' (expoente '+n+').','Grau = '+n],
      };
    }
    var xv = _randInt(-3,3);
    var rv = cs.reduce(function(acc,c,i){return acc+c*Math.pow(xv,n-i);},0);
    return {
      statement: 'Calcule p('+xv+') para p(x) = '+_fmtPoly(cs)+'.',
      equation:  'p('+xv+') = ?',
      answer:    String(rv),
      polyType:  'eval', coeffs:cs, xv:xv,
      hints:['Substitua x = '+xv+' em cada termo.','Some: '+cs.map(function(c,i){return c+'×'+xv+'^'+(n-i);}).join(' + '),'p('+xv+') = '+rv],
    };
  }

  if (type==='factor') {
    // Factor x² + bx + c = (x-r1)(x-r2)
    var r1=_randInt(-6,6),r2=_randInt(-6,6);
    var b=-(r1+r2),c=r1*r2;
    var eq='x²'+(b>0?' + '+b:b<0?' - '+Math.abs(b):'')+(c>0?' + '+c:c<0?' - '+Math.abs(c):'');
    return {
      statement: 'Fatore completamente: p(x) = '+eq+'.',
      equation:  'p(x) = '+eq,
      answer:    '(x - '+r1+')(x - '+r2+')',
      polyType:  'factor', r1:r1, r2:r2,
      hints: [
        'Encontre r1 e r2 tais que r1+r2 = '+(r1+r2)+' e r1×r2 = '+c,
        'As raízes são x = '+r1+' e x = '+r2,
        'p(x) = (x - '+r1+')(x - '+r2+')',
      ],
    };
  }

  if (type==='roots') {
    var a=_randInt(1,3),b=_randInt(-8,8),c=_randInt(-8,8);
    var delta=b*b-4*a*c;
    while(delta<0){c=_randInt(-4,4);delta=b*b-4*a*c;}
    var eq=_fmtQuad(a,b,c);
    var r1=(-b+Math.sqrt(delta))/(2*a),r2=(-b-Math.sqrt(delta))/(2*a);
    var ans=Math.abs(r1-r2)<1e-9?String(_fmtNum(r1)):_fmtNum(r1)+' e '+_fmtNum(r2);
    return {
      statement: 'Encontre as raízes de p(x) = '+eq+'.',
      equation:  eq+' = 0',
      answer:    ans,
      polyType:  'roots', a:a,b:b,c:c,delta:delta,
      hints: [
        'Use Bhaskara: x = (-b ± √Δ) / 2a',
        'Δ = '+b+'² - 4×'+a+'×'+c+' = '+delta,
        'x = '+ans,
      ],
    };
  }

  // expand: (x+a)(x+b)
  var a=_randInt(-6,6),b=_randInt(-6,6);
  var B=a+b,C=a*b;
  var expanded='x²'+(B>0?' + '+B:B<0?' - '+Math.abs(B):'')+(C>0?' + '+C:C<0?' - '+Math.abs(C):'');
  return {
    statement: 'Expanda o produto (x + '+a+')(x + '+b+').',
    equation:  '(x + '+a+')(x + '+b+')',
    answer:    expanded,
    polyType:  'expand', a:a, b:b,
    hints: [
      'Use FOIL: Primeiros + Externos + Internos + Últimos.',
      'x²  +  '+(a+b)+'x  +  '+C,
      expanded,
    ],
  };
}

  // ── factoring ─────────────────────────────────────────────
  MathGenerators['factoring'] = function _genFactoring(difficulty) {
  _reseed();
  var types=['notable_expand','notable_identify','factor_common','factor_quad','factor_diff2'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='notable_expand'){
    var a=_randInt(1,5),b=_randInt(1,5),isPlus=_randInt(0,1)===0;
    if(isPlus){var res=a*a+'x² + '+2*a*b+'x + '+b*b;return{statement:'Expanda ('+a+'x+'+b+')².',equation:'('+a+'x+'+b+')²',answer:res,factType:'expand_sq',
      hints:['(a+b)² = a² + 2ab + b²','a='+a+'x, b='+b,''+a*a+'x² + '+2*a*b+'x + '+b*b]};}
    var res2=a*a+'x² − '+2*a*b+'x + '+b*b;return{statement:'Expanda ('+a+'x−'+b+')².',equation:'('+a+'x−'+b+')²',answer:res2,factType:'expand_sq',
      hints:['(a−b)² = a² − 2ab + b²','a='+a+'x, b='+b,res2]};
  }
  if(type==='notable_identify'){
    var a=_randInt(1,6),b=_randInt(1,6);
    var forms=[
      {eq:a*a+'x² + '+2*a*b+'x + '+b*b,ans:'('+a+'x+'+b+')²',note:'trinômio quadrado perfeito (a+b)²'},
      {eq:a*a+'x² − '+2*a*b+'x + '+b*b,ans:'('+a+'x−'+b+')²',note:'trinômio quadrado perfeito (a−b)²'},
      {eq:a*a+'x² − '+b*b,ans:'('+a+'x+'+b+')('+a+'x−'+b+')',note:'diferença de quadrados'},
    ];
    var f=forms[_randInt(0,forms.length-1)];
    return{statement:'Fatore: '+f.eq+'.',equation:f.eq,answer:f.ans,factType:'identify',
      hints:['Reconheça o padrão: '+f.note,'Produto notável inverso.',f.ans]};
  }
  if(type==='factor_common'){
    var k=_randInt(2,8),a=_randInt(1,6),b=_randInt(1,6);
    return{statement:'Fatore: '+k*a+'x + '+k*b+'.',equation:k*a+'x + '+k*b,answer:k+'('+a+'x + '+b+')',factType:'common',
      hints:['Encontre o fator comum: MDC('+k*a+','+k*b+') = '+k,k+'('+a+'x + '+b+')','Verifique: '+k+'×'+a+'x + '+k+'×'+b+' = '+k*a+'x + '+k*b]};
  }
  if(type==='factor_quad'){
    var r1=_randInt(-6,6),r2=_randInt(-6,6);while(r1===r2||r1===0||r2===0)r2=_randInt(-6,6);
    var b=-(r1+r2),c=r1*r2;
    var bStr=b>0?' + '+b:b<0?' − '+Math.abs(b):'';
    var cStr=c>0?' + '+c:c<0?' − '+Math.abs(c):'';
    var r1s=r1<0?'(x − '+(Math.abs(r1))+')':'(x + '+r1+')';
    var r2s=r2<0?'(x − '+(Math.abs(r2))+')':'(x + '+r2+')';
    // simpler: show as (x-r1)(x-r2)
    var ans='(x '+(r1>=0?'+ '+r1:'− '+Math.abs(r1))+')'+'(x '+(r2>=0?'+ '+r2:'− '+Math.abs(r2))+')';
    return{statement:'Fatore: x²'+bStr+'x'+cStr+'.',equation:'x²'+bStr+'x'+cStr,answer:ans,factType:'quad',
      hints:['Procure r₁ e r₂ com r₁+r₂='+(-b)+' e r₁×r₂='+c,'r₁='+r1+', r₂='+r2,ans]};
  }
  // difference of squares
  var a=_randInt(1,8);
  return{statement:'Fatore: x² − '+a*a+'.',equation:'x² − '+a*a,answer:'(x+'+a+')(x−'+a+')',factType:'diff2',
    hints:['a² − b² = (a+b)(a−b)','a=x, b='+a,'(x+'+a+')(x−'+a+')']};
}
})();
