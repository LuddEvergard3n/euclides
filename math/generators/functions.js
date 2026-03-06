/**
 * math/generators/functions.js
 * Functions generators (including finance and inverse).
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;
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
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  // ── File-scoped helpers ──────────────────────────────────────────
  var _funcTypes = ['linear', 'quadratic', 'exponential', 'logarithmic'];
  
  function _genFunctions(difficulty) {
    _reseed();
    var type = _funcTypes[Math.min(_randInt(0, difficulty - 1), _funcTypes.length - 1)];
  
    if (type === 'linear') {
      var a = _randInt(-5, 5); while (a === 0) a = _randInt(-5, 5);
      var b = _randInt(-8, 8);
      var xVal = _randInt(-4, 4);
      var yVal = a * xVal + b;
      var eqStr = (a === 1 ? '' : a === -1 ? '-' : String(a)) + 'x' + (b > 0 ? ' + ' + b : b < 0 ? ' - ' + Math.abs(b) : '');
      return {
        statement: 'Dada f(x) = ' + eqStr + ', calcule f(' + xVal + ').',
        equation:  'f(' + xVal + ') = ?',
        answer:    String(yVal),
        funcType:  'linear', a: a, b: b,
        hints: [
          'Substitua x = ' + xVal + ' na função.',
          'f(' + xVal + ') = ' + a + ' × ' + xVal + (b >= 0 ? ' + ' : ' ') + b,
          'f(' + xVal + ') = ' + yVal,
        ],
      };
    }
  
    if (type === 'quadratic') {
      var a = _randInt(-3, 3); while (a === 0) a = _randInt(-3, 3);
      var b = _randInt(-6, 6), c = _randInt(-6, 6);
      var xVal = _randInt(-3, 3);
      var yVal = a*xVal*xVal + b*xVal + c;
      var vx = -b / (2 * a);
      var vy = a*vx*vx + b*vx + c;
      // Ask for vertex or f(x)
      if (difficulty <= 2) {
        return {
          statement: 'Calcule o vértice da parábola f(x) = ' + _fmtQuad(a, b, c) + '.',
          equation:  'V = (-b/2a, f(-b/2a))',
          answer:    '(' + _fmtNum(vx) + ', ' + _fmtNum(vy) + ')',
          funcType:  'quadratic', a: a, b: b, c: c,
          hints: [
            'Vértice: Vx = -b / (2a) = ' + (-b) + ' / ' + (2*a),
            'Vx = ' + _fmtNum(vx) + ' → Vy = f(' + _fmtNum(vx) + ')',
            'V = (' + _fmtNum(vx) + ', ' + _fmtNum(vy) + ')',
          ],
        };
      }
      var delta = b*b - 4*a*c;
      return {
        statement: 'Encontre as raízes de f(x) = ' + _fmtQuad(a, b, c) + '.',
        equation:  'f(x) = ' + _fmtQuad(a, b, c),
        answer:    delta < 0 ? 'sem raizes reais' : delta === 0
          ? String(_fmtNum(-b/(2*a)))
          : _fmtNum((-b + Math.sqrt(delta))/(2*a)) + ' ou ' + _fmtNum((-b - Math.sqrt(delta))/(2*a)),
        funcType:  'quadratic', a: a, b: b, c: c, delta: delta,
        hints: [
          'Use Bhaskara: x = (-b ± sqrt(delta)) / 2a',
          'delta = ' + b + '^2 - 4*' + a + '*' + c + ' = ' + delta,
          delta < 0 ? 'delta < 0: sem raizes reais.' : 'x = (' + (-b) + ' ± sqrt(' + delta + ')) / ' + (2*a),
        ],
      };
    }
  
    if (type === 'exponential') {
      var bases = [2, 3, 5, 10];
      var base  = bases[_randInt(0, 3)];
      var exp_  = _randInt(0, 4);
      var result = Math.pow(base, exp_);
      return {
        statement: 'Calcule f(' + exp_ + ') para f(x) = ' + base + '^x.',
        equation:  'f(' + exp_ + ') = ' + base + '^' + exp_,
        answer:    String(result),
        funcType:  'exponential', base: base,
        hints: [
          base + '^' + exp_ + ' = ' + base + ' multiplicado por si mesmo ' + exp_ + ' vezes.',
          exp_ <= 1 ? base + '^' + exp_ + ' = ' + result : base + '^' + (exp_-1) + ' = ' + Math.pow(base, exp_-1) + ', então × ' + base,
          base + '^' + exp_ + ' = ' + result,
        ],
      };
    }
  
    // logarithmic
    var bases = [2, 3, 10];
    var base  = bases[_randInt(0, 2)];
    var exp_  = _randInt(1, 4);
    var arg   = Math.pow(base, exp_);
    return {
      statement: 'Calcule log na base ' + base + ' de ' + arg + '.',
      equation:  'log_' + base + '(' + arg + ') = ?',
      answer:    String(exp_),
      funcType:  'logarithmic', base: base, arg: arg,
      hints: [
        'log_' + base + '(x) = y significa: ' + base + '^y = x.',
        base + '^? = ' + arg + ' → testar: ' + base + '^' + exp_ + ' = ' + arg,
        'log_' + base + '(' + arg + ') = ' + exp_,
      ],
    };
  }

  function _fmtBRL(v) {
    return v.toFixed(2).replace('.', ',');
  }
  
  // ── Data Analysis generator ────────────────────────────────────────
  
  var _dataTypes = ['mean_weighted', 'variance', 'std_dev', 'frequency', 'percentile'];


  // ── functions ─────────────────────────────────────────────
  MathGenerators['functions'] = function _genFunctions(difficulty) {
  _reseed();
  var type = _funcTypes[Math.min(_randInt(0, difficulty - 1), _funcTypes.length - 1)];

  if (type === 'linear') {
    var a = _randInt(-5, 5); while (a === 0) a = _randInt(-5, 5);
    var b = _randInt(-8, 8);
    var xVal = _randInt(-4, 4);
    var yVal = a * xVal + b;
    var eqStr = (a === 1 ? '' : a === -1 ? '-' : String(a)) + 'x' + (b > 0 ? ' + ' + b : b < 0 ? ' - ' + Math.abs(b) : '');
    return {
      statement: 'Dada f(x) = ' + eqStr + ', calcule f(' + xVal + ').',
      equation:  'f(' + xVal + ') = ?',
      answer:    String(yVal),
      funcType:  'linear', a: a, b: b,
      hints: [
        'Substitua x = ' + xVal + ' na função.',
        'f(' + xVal + ') = ' + a + ' × ' + xVal + (b >= 0 ? ' + ' : ' ') + b,
        'f(' + xVal + ') = ' + yVal,
      ],
    };
  }

  if (type === 'quadratic') {
    var a = _randInt(-3, 3); while (a === 0) a = _randInt(-3, 3);
    var b = _randInt(-6, 6), c = _randInt(-6, 6);
    var xVal = _randInt(-3, 3);
    var yVal = a*xVal*xVal + b*xVal + c;
    var vx = -b / (2 * a);
    var vy = a*vx*vx + b*vx + c;
    // Ask for vertex or f(x)
    if (difficulty <= 2) {
      return {
        statement: 'Calcule o vértice da parábola f(x) = ' + _fmtQuad(a, b, c) + '.',
        equation:  'V = (-b/2a, f(-b/2a))',
        answer:    '(' + _fmtNum(vx) + ', ' + _fmtNum(vy) + ')',
        funcType:  'quadratic', a: a, b: b, c: c,
        hints: [
          'Vértice: Vx = -b / (2a) = ' + (-b) + ' / ' + (2*a),
          'Vx = ' + _fmtNum(vx) + ' → Vy = f(' + _fmtNum(vx) + ')',
          'V = (' + _fmtNum(vx) + ', ' + _fmtNum(vy) + ')',
        ],
      };
    }
    var delta = b*b - 4*a*c;
    return {
      statement: 'Encontre as raízes de f(x) = ' + _fmtQuad(a, b, c) + '.',
      equation:  'f(x) = ' + _fmtQuad(a, b, c),
      answer:    delta < 0 ? 'sem raizes reais' : delta === 0
        ? String(_fmtNum(-b/(2*a)))
        : _fmtNum((-b + Math.sqrt(delta))/(2*a)) + ' ou ' + _fmtNum((-b - Math.sqrt(delta))/(2*a)),
      funcType:  'quadratic', a: a, b: b, c: c, delta: delta,
      hints: [
        'Use Bhaskara: x = (-b ± sqrt(delta)) / 2a',
        'delta = ' + b + '^2 - 4*' + a + '*' + c + ' = ' + delta,
        delta < 0 ? 'delta < 0: sem raizes reais.' : 'x = (' + (-b) + ' ± sqrt(' + delta + ')) / ' + (2*a),
      ],
    };
  }

  if (type === 'exponential') {
    var bases = [2, 3, 5, 10];
    var base  = bases[_randInt(0, 3)];
    var exp_  = _randInt(0, 4);
    var result = Math.pow(base, exp_);
    return {
      statement: 'Calcule f(' + exp_ + ') para f(x) = ' + base + '^x.',
      equation:  'f(' + exp_ + ') = ' + base + '^' + exp_,
      answer:    String(result),
      funcType:  'exponential', base: base,
      hints: [
        base + '^' + exp_ + ' = ' + base + ' multiplicado por si mesmo ' + exp_ + ' vezes.',
        exp_ <= 1 ? base + '^' + exp_ + ' = ' + result : base + '^' + (exp_-1) + ' = ' + Math.pow(base, exp_-1) + ', então × ' + base,
        base + '^' + exp_ + ' = ' + result,
      ],
    };
  }

  // logarithmic
  var bases = [2, 3, 10];
  var base  = bases[_randInt(0, 2)];
  var exp_  = _randInt(1, 4);
  var arg   = Math.pow(base, exp_);
  return {
    statement: 'Calcule log na base ' + base + ' de ' + arg + '.',
    equation:  'log_' + base + '(' + arg + ') = ?',
    answer:    String(exp_),
    funcType:  'logarithmic', base: base, arg: arg,
    hints: [
      'log_' + base + '(x) = y significa: ' + base + '^y = x.',
      base + '^? = ' + arg + ' → testar: ' + base + '^' + exp_ + ' = ' + arg,
      'log_' + base + '(' + arg + ') = ' + exp_,
    ],
  };
}

  // ── exponential ─────────────────────────────────────────────
  MathGenerators['exponential'] = function _genExponential(difficulty) {
  _reseed();
  var types=['eval','solve_eq','growth','decay','natural'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='eval'){
    var base=_randInt(2,4),exp=_randInt(0,4);
    var val=Math.pow(base,exp);
    return{statement:'Calcule: '+base+'^'+exp+'.',equation:base+'^'+exp,answer:String(val),expType:'eval',
      hints:['Multiplique '+base+' por si mesmo '+exp+' vezes.',Array.from({length:Math.max(exp,1)},function(){return base;}).join('×'),String(val)]};
  }
  if(type==='solve_eq'){
    var base=_randInt(2,4),exp=_randInt(2,5),val=Math.pow(base,exp);
    return{statement:'Resolva: '+base+'^x = '+val+'.',equation:base+'^x = '+val,answer:String(exp),expType:'solve',
      hints:['Expresse '+val+' como potência de '+base+'.',''+base+'^? = '+val,'x = '+exp]};
  }
  if(type==='growth'){
    var r=_randInt(5,30),t=_randInt(2,5),p0=_randInt(1,10)*1000;
    var pf=Math.round(p0*Math.pow(1+r/100,t));
    return{statement:'Uma população de '+p0+' cresce '+r+'% ao ano. Qual o tamanho após '+t+' anos?',
      equation:'P = '+p0+'×(1+'+r+'/100)^'+t,answer:String(pf),expType:'growth',
      hints:['P = P₀×(1+r)^t',''+p0+'×'+((1+r/100).toFixed(2))+'^'+t,String(pf)]};
  }
  if(type==='decay'){
    var r=_randInt(10,40),t=_randInt(2,4),v0=_randInt(2,20)*1000;
    var vf=Math.round(v0*Math.pow(1-r/100,t));
    return{statement:'Um equipamento de R$ '+v0+' deprecia '+r+'% ao ano. Qual seu valor após '+t+' anos?',
      equation:'V = '+v0+'×(1−'+r+'/100)^'+t,answer:String(vf),expType:'decay',
      hints:['V = V₀×(1−r)^t',''+v0+'×'+((1-r/100).toFixed(2))+'^'+t,String(vf)]};
  }
  // natural — half-life
  var hl=_randInt(2,8),t=hl*_randInt(1,3),n0=_randInt(2,8)*100;
  var nf=n0*Math.pow(0.5,t/hl);
  return{statement:'Uma substância tem meia-vida de '+hl+' horas. De '+n0+' g, quanto resta após '+t+' horas?',
    equation:'N = '+n0+'×(1/2)^('+t+'/'+hl+')',answer:String(nf),expType:'halflife',
    hints:['N = N₀×(1/2)^(t/T₁/₂)',''+n0+'×0,5^'+(t/hl),String(nf)]};
}

  // ── logarithms ─────────────────────────────────────────────
  MathGenerators['logarithms'] = function _genLogarithms(difficulty) {
  _reseed();
  var types=['def','change_base','props','log_eq','natural'];
  var type=types[Math.min(difficulty-1,4)];
  if(type==='def'){
    var bases=[2,3,5,10],base=bases[_randInt(0,3)],exp=_randInt(0,4);
    var val=Math.pow(base,exp);
    return{statement:'Calcule log_'+base+'('+val+').',equation:'log_'+base+'('+val+')',answer:String(exp),logType:'def',
      hints:['log_b(x) = e ↔ b^e = x',''+base+'^? = '+val,'log_'+base+'('+val+') = '+exp]};
  }
  if(type==='change_base'){
    var base=[2,3,5][_randInt(0,2)],exp=_randInt(2,4),val=Math.pow(base,exp);
    return{statement:'Calcule log_'+base+'('+val+') convertendo para base 10.',
      equation:'log('+val+') / log('+base+')',answer:String(exp),logType:'change_base',
      hints:['log_a(x) = log(x)/log(a)','log('+val+')/log('+base+')',String(exp)]};
  }
  if(type==='props'){
    var a=_randInt(2,4),b=_randInt(2,4),useAdd=_randInt(0,1)===0;
    var ans=useAdd?a+b:a-b;
    return{statement:useAdd?'log(10^'+a+' × 10^'+b+') = ?':'log(10^'+a+' / 10^'+b+') = ?',
      equation:useAdd?'log(A×B)=log A+log B':'log(A/B)=log A−log B',answer:String(ans),logType:'props',
      hints:[useAdd?'log(A×B) = log A + log B':'log(A/B) = log A − log B',
             useAdd?a+' + '+b:a+' − '+b,String(ans)]};
  }
  if(type==='log_eq'){
    var base=_randInt(2,5),rhs=_randInt(2,4),val=Math.pow(base,rhs);
    return{statement:'Resolva: log_'+base+'(x) = '+rhs+'.',equation:'log_'+base+'(x) = '+rhs,answer:String(val),logType:'eq',
      hints:['log_b(x) = e ↔ x = b^e','x = '+base+'^'+rhs,String(val)]};
  }
  var expMap={0:'1',1:'e',2:'e²','-1':'1/e'};
  var e=[-1,0,1,2][_randInt(0,3)];
  return{statement:'Calcule ln('+expMap[String(e)]+').',equation:'ln('+expMap[String(e)]+')',answer:String(e),logType:'natural',
    hints:['ln = log na base e','ln(e^k) = k',String(e)]};
}

  // ── progressions ─────────────────────────────────────────────
  MathGenerators['progressions'] = function _genProgressions(difficulty) {
  _reseed();
  var type = difficulty <= 3 ? 'ap' : 'gp';

  if (type === 'ap') {
    var a1 = _randInt(-10, 10), r = _randInt(-5, 5); while (r===0) r=_randInt(-5,5);
    var n  = _randInt(3, difficulty<=2?6:10);
    var an = a1 + (n-1)*r;
    var sn = n*(a1+an)/2;
    var ask = Math.random()<0.5 ? 'term' : 'sum';
    if (ask==='term') {
      return {
        statement: 'PA com primeiro termo '+a1+' e razão '+r+'. Calcule o '+n+'º termo.',
        equation:  'a_n = a1 + (n-1)r',
        answer:    String(an),
        progType:  'ap', a1:a1, r:r, n:n,
        hints: [
          'Fórmula do termo geral: a_n = a1 + (n-1)×r',
          'a_'+n+' = '+a1+' + '+(n-1)+'×'+r+' = '+a1+' + '+(n-1)*r,
          'a_'+n+' = '+an,
        ],
      };
    }
    return {
      statement: 'PA com a1='+a1+', r='+r+', '+n+' termos. Calcule a soma S_'+n+'.',
      equation:  'S_n = n(a1 + an) / 2',
      answer:    String(sn),
      progType:  'ap', a1:a1, r:r, n:n,
      hints: [
        'Primeiro calcule a_n = '+a1+' + '+(n-1)+'×'+r+' = '+an,
        'S_n = n×(a1 + a_n)/2 = '+n+'×('+a1+'+'+an+')/2',
        'S_'+n+' = '+sn,
      ],
    };
  }

  // GP
  var a1 = _randInt(1, 5), q = [-3,-2,2,3][_randInt(0,3)];
  var n  = _randInt(3, 5);
  var an = a1 * Math.pow(q, n-1);
  return {
    statement: 'PG com primeiro termo '+a1+' e razão '+q+'. Calcule o '+n+'º termo.',
    equation:  'a_n = a1 × q^(n-1)',
    answer:    String(an),
    progType:  'gp', a1:a1, q:q, n:n,
    hints: [
      'Fórmula do termo geral: a_n = a1 × q^(n-1)',
      'a_'+n+' = '+a1+' × '+q+'^'+(n-1)+' = '+a1+' × '+Math.pow(q,n-1),
      'a_'+n+' = '+an,
    ],
  };
}

  // ── series ─────────────────────────────────────────────
  MathGenerators['series'] = function _genSeries(difficulty) {
  _reseed();
  var types=['recursive','geo_sum_finite','geo_sum_infinite','arith_recursive','apply'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='recursive'){
    var a1=_randInt(1,6),d=_randInt(1,5),n=_randInt(4,8);
    // Fibonacci-style: a_n = a_{n-1} + a_{n-2}, or simple: a_n = a_{n-1} + d
    var seq=[a1];for(var i=1;i<n;i++)seq.push(seq[i-1]+d);
    return{statement:'A sequência é definida por a₁='+a1+' e aₙ=aₙ₋₁+'+d+'. Qual é a'+n+'?',
      equation:'aₙ = aₙ₋₁ + '+d,answer:String(seq[n-1]),serType:'recursive',
      hints:['Aplique a recorrência '+n-1+' vez(es).','Sequência: '+seq.slice(0,Math.min(n,5)).join(', ')+'...',String(seq[n-1])]};
  }
  if(type==='geo_sum_finite'){
    var a1=_randInt(1,6),r=_randInt(2,4),n=_randInt(3,6);
    var sum=a1*(Math.pow(r,n)-1)/(r-1);
    return{statement:'Calcule a soma dos '+n+' primeiros termos da PG: a₁='+a1+', q='+r+'.',
      equation:'Sₙ = a₁×(qⁿ−1)/(q−1)',answer:String(sum),serType:'geo_sum',
      hints:['Sₙ = a₁×(qⁿ−1)/(q−1)',''+a1+'×('+r+'^'+n+'−1)/('+r+'−1)',String(sum)]};
  }
  if(type==='geo_sum_infinite'){
    var a1=_randInt(1,8)*10,rs=[[1,2],[1,3],[1,4],[2,3]];
    var pair=rs[_randInt(0,rs.length-1)];
    var r=pair[0]/pair[1];
    var sum=a1/(1-r);
    var rStr=pair[0]+'/'+pair[1];
    return{statement:'Calcule a soma da PG infinita: a₁='+a1+', q='+rStr+'.',
      equation:'S∞ = a₁/(1−q)',answer:String(sum),serType:'geo_inf',
      hints:['S∞ = a₁/(1−q)  válido para |q|<1',''+a1+'/(1−'+rStr+')',String(sum)]};
  }
  if(type==='arith_recursive'){
    // Fibonacci: a1=1, a2=1, a_n=a_{n-1}+a_{n-2}
    var fib=[1,1];for(var i=2;i<10;i++)fib.push(fib[i-1]+fib[i-2]);
    var n=_randInt(5,9);
    return{statement:'Sequência de Fibonacci: a₁=1, a₂=1, aₙ=aₙ₋₁+aₙ₋₂. Qual é a'+n+'?',
      equation:'aₙ = aₙ₋₁ + aₙ₋₂',answer:String(fib[n-1]),serType:'fibonacci',
      hints:['Aplique a recorrência até o '+n+'º termo.','1, 1, 2, 3, 5, 8, 13, 21, 34...',String(fib[n-1])]};
  }
  // ball bounce: total distance
  var h=_randInt(2,8)*10,r=_randInt(3,8);
  var q=r/10;
  var total=h*(1+2*q/(1-q));
  return{statement:'Uma bola é solta de '+h+' m e cada quique sobe '+r*10+'% da altura anterior. Distância total percorrida?',
    equation:'D = h×(1+2q/(1−q)), q='+q,answer:String(Math.round(total)),serType:'bounce',
    hints:['Ida: '+h+'m. Cada salto: '+h+'×'+q+'^k (subida + descida)','S∞ da PG de saltos = '+h+'×'+q+'/(1−'+q+')','Total ≈ '+Math.round(total)+' m']};
}

  // ── finance ─────────────────────────────────────────────
  MathGenerators['finance'] = function _genFinance(difficulty) {
  _reseed();

  if (difficulty <= 1) {
    var useMarkup = _randInt(0, 1) === 1;
    if (useMarkup) {
      var custo  = _randInt(2, 20) * 50;
      var markup = [20, 30, 40, 50, 60, 80, 100][_randInt(0, 6)];
      var preco  = custo * (1 + markup / 100);
      return {
        statement: 'Um produto custa R$ ' + custo + ',00. O markup é de ' + markup + '%. Qual o preço de venda?',
        equation:  'Preço = Custo × (1 + markup/100)',
        answer:    _fmtBRL(preco), finType: 'markup',
        hints: ['Preço = Custo × (1 + markup/100)',
                custo + ' × ' + (1 + markup / 100), 'Preço = R$ ' + _fmtBRL(preco)],
      };
    }
    var base = _randInt(2, 20) * 50;
    var pct  = [5, 10, 15, 20, 25, 30, 40, 50][_randInt(0, 7)];
    return {
      statement: 'Calcule ' + pct + '% de R$ ' + base + ',00.',
      equation:  'Valor = Base × (taxa / 100)',
      answer:    _fmtBRL(base * pct / 100), finType: 'percentage',
      hints: ['Percentagem: valor = base × taxa / 100',
              base + ' × ' + pct + ' / 100',
              'Valor = R$ ' + _fmtBRL(base * pct / 100)],
    };
  }

  if (difficulty === 2) {
    var C = _randInt(1, 20) * 500;
    var i = [1, 2, 3, 5, 10][_randInt(0, 4)];
    var t = _randInt(2, 24);
    var J = C * i / 100 * t;
    var M = C + J;
    return {
      statement: 'Capital R$ ' + C + ',00 a ' + i + '% a.m. por ' + t + ' meses (juros simples). Calcule o montante.',
      equation:  'M = C(1 + i×t)',
      answer:    _fmtBRL(M), finType: 'simple', C: C, i: i, t: t, J: J,
      hints: ['J = C × i × t = ' + C + ' × ' + (i / 100) + ' × ' + t + ' = R$ ' + _fmtBRL(J),
              'M = C + J = ' + C + ' + ' + _fmtBRL(J),
              'M = R$ ' + _fmtBRL(M)],
    };
  }

  if (difficulty === 3) {
    var C = _randInt(1, 10) * 1000;
    var i = [1, 2, 3, 5][_randInt(0, 3)];
    var t = _randInt(2, 12);
    var M = C * Math.pow(1 + i / 100, t);
    return {
      statement: 'Capital R$ ' + C + ',00 a ' + i + '% a.m. por ' + t + ' meses (juros compostos). Calcule o montante.',
      equation:  'M = C × (1 + i)^t',
      answer:    _fmtBRL(M), finType: 'compound', C: C, i: i, t: t,
      hints: ['M = C × (1 + i)^t  (i em decimal)',
              'M = ' + C + ' × (1 + ' + (i / 100) + ')^' + t,
              'M ≈ R$ ' + _fmtBRL(M)],
    };
  }

  if (difficulty === 4) {
    // Desconto comercial (bancário): D = N × d × t, PV = N − D
    var N  = _randInt(2, 20) * 500;
    var d  = [5, 10, 15, 20][_randInt(0, 3)];
    var t  = _randInt(1, 6);
    var D  = N * d / 100 * t;
    var PV = N - D;
    return {
      statement: 'Título de R$ ' + N + ',00, desconto comercial de ' + d + '% a.m., antecipado ' + t + ' meses. Calcule o valor líquido.',
      equation:  'D = N×d×t  |  PV = N − D',
      answer:    _fmtBRL(PV), finType: 'discount', N: N, d: d, t: t,
      hints: ['Desconto comercial: D = N × d × t',
              'D = ' + N + ' × ' + (d / 100) + ' × ' + t + ' = R$ ' + _fmtBRL(D),
              'PV = ' + N + ' − ' + _fmtBRL(D) + ' = R$ ' + _fmtBRL(PV)],
    };
  }

  // d5: desconto racional (por dentro) ou inflação
  var useRational = _randInt(0, 1) === 1;

  if (useRational) {
    // Desconto racional: Dr = N × i × t / (1 + i × t), PV = N / (1 + i × t)
    var N  = _randInt(2, 20) * 500;
    var i  = [5, 10, 15, 20][_randInt(0, 3)];
    var t  = _randInt(1, 6);
    var PV = N / (1 + i / 100 * t);
    var Dr = N - PV;
    return {
      statement: 'Título de R$ ' + N + ',00, desconto racional de ' + i + '% a.m., antecipado ' + t + ' meses. Calcule o valor líquido.',
      equation:  'PV = N / (1 + i×t)',
      answer:    _fmtBRL(PV), finType: 'rational', N: N, i: i, t: t,
      hints: ['Desconto racional: PV = N / (1 + i × t)',
              'PV = ' + N + ' / (1 + ' + (i / 100) + ' × ' + t + ') = ' + N + ' / ' + (1 + i / 100 * t).toFixed(4),
              'PV = R$ ' + _fmtBRL(PV) + '  |  Dr = R$ ' + _fmtBRL(Dr)],
    };
  }

  // Inflação e poder de compra
  var valor    = _randInt(1, 10) * 1000;
  var inflacao = [5, 8, 10, 12, 15][_randInt(0, 4)];
  var anos     = _randInt(2, 5);
  var equiv    = valor * Math.pow(1 + inflacao / 100, anos);
  return {
    statement: 'Com inflação de ' + inflacao + '% a.a., quanto precisará em ' + anos + ' anos para manter o poder de compra de R$ ' + valor + ',00 hoje?',
    equation:  'V_futuro = V_atual × (1 + inf)^anos',
    answer:    _fmtBRL(equiv), finType: 'inflation', valor: valor, inflacao: inflacao, anos: anos,
    hints: ['Corrija pela inflação: V_futuro = V_atual × (1 + inf)^anos',
            valor + ' × (1 + ' + (inflacao / 100) + ')^' + anos,
            'V_futuro ≈ R$ ' + _fmtBRL(equiv)],
  };
}

  // ── inverse_func ─────────────────────────────────────────────
  MathGenerators['inverse_func'] = function _genInverseFunc(difficulty) {
  _reseed();
  var types = ['find_inverse','eval_inverse','injectivity','domain_inverse','compose_inv'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'find_inverse') {
    var a = _randInt(1, 5), b = _randInt(-6, 6);
    // f(x) = ax + b  →  f⁻¹(x) = (x-b)/a
    var numStr = b === 0 ? 'x' : b > 0 ? '(x − ' + b + ')' : '(x + ' + Math.abs(b) + ')';
    var ans = a === 1 ? numStr + '' : numStr + ' / ' + a;
    return { statement: 'Encontre a inversa de f(x) = ' + a + 'x' + (b >= 0 ? ' + ' + b : ' − ' + Math.abs(b)) + '.',
      equation: 'f(x) = ' + a + 'x ' + (b >= 0 ? '+ ' + b : '− ' + Math.abs(b)),
      answer: 'f⁻¹(x) = ' + ans, invType: 'find',
      hints: ['Troque x por y e y por x: x = ' + a + 'y ' + (b >= 0 ? '+' : '-') + ' ' + Math.abs(b), 'Resolva para y.', 'f⁻¹(x) = ' + ans] };
  }
  if (type === 'eval_inverse') {
    var a = _randInt(1, 4), b = _randInt(-4, 4), xval = _randInt(-3, 5);
    var fval = a * xval + b;
    return { statement: 'f(x) = ' + a + 'x + ' + b + '. Se f(' + xval + ') = ' + fval + ', qual é f⁻¹(' + fval + ')?',
      equation: 'f⁻¹(f(x)) = x', answer: String(xval), invType: 'eval',
      hints: ['f⁻¹ desfaz f: f⁻¹(f(x)) = x.', 'Se f(' + xval + ') = ' + fval + ', então f⁻¹(' + fval + ') = ...', String(xval)] };
  }
  if (type === 'injectivity') {
    var funcs = [
      { f: 'f(x) = x²', ans: 'Não', why: 'f(2) = f(−2) = 4: dois x para um y' },
      { f: 'f(x) = 2x + 1', ans: 'Sim', why: 'função afim com a≠0 é injetora' },
      { f: 'f(x) = |x|', ans: 'Não', why: 'f(1) = f(−1) = 1' },
      { f: 'f(x) = x³', ans: 'Sim', why: 'estritamente crescente → injetora' },
    ];
    var fn = funcs[_randInt(0, funcs.length - 1)];
    return { statement: fn.f + ' é injetora?', equation: fn.f + ' → bijeção?',
      answer: fn.ans, invType: 'inject',
      hints: ['Injetora: x₁≠x₂ → f(x₁)≠f(x₂).', fn.why, fn.ans] };
  }
  if (type === 'domain_inverse') {
    var a = _randInt(1, 4), b = _randInt(0, 6);
    // f: [0,+∞) → [b,+∞), f(x) = ax + b  → f⁻¹(x) = (x-b)/a
    return { statement: 'f(x) = ' + a + 'x + ' + b + ' com domínio ℝ. Qual o domínio de f⁻¹?',
      equation: 'f: ℝ → ?  →  f⁻¹: ? → ℝ', answer: 'ℝ', invType: 'domain',
      hints: ['Domínio de f⁻¹ = imagem de f.', 'f(x) = ' + a + 'x + ' + b + ' com x∈ℝ produz todos os reais.', 'ℝ'] };
  }
  // compose f⁻¹ ∘ f
  var a = _randInt(1, 4), b = _randInt(-4, 4), xval = _randInt(-3, 5);
  return { statement: 'f(x) = ' + a + 'x + ' + b + '. Calcule f⁻¹(f(' + xval + ')).',
    equation: 'f⁻¹(f(x)) = ?', answer: String(xval), invType: 'compose',
    hints: ['f⁻¹ é a função inversa: desfaz f.', 'Por definição: f⁻¹(f(x)) = x para todo x no domínio.', String(xval)] };
}
})();
