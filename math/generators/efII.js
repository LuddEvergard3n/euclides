/**
 * math/generators/efII.js
 * Ensino Fundamental II generators.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;

  // ── integers ─────────────────────────────────────────────
  MathGenerators['integers'] = function _genIntegers(difficulty) {
  _reseed();
  var types=['absval','divisibility','primes','gcd_div','lcm_word'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='absval'){
    var a=_randInt(-12,12);while(a===0)a=_randInt(-12,12);
    var ops=[
      {stmt:'Calcule |'+a+'|.',eq:'|'+a+'|',ans:String(Math.abs(a)),h:['|x| é sempre positivo ou zero.','|'+a+'| = distância de 0 na reta.',String(Math.abs(a))]},
      {stmt:'Simplifique: −('+a+').',eq:'−('+a+')',ans:String(-a),h:['−(negativo) = positivo.','Troque o sinal.',String(-a)]},
    ];
    var op=ops[_randInt(0,ops.length-1)];
    return{statement:op.stmt,equation:op.eq,answer:op.ans,intType:'abs',hints:op.h};
  }
  if(type==='divisibility'){
    var rules=[
      {n:_randInt(1,99)*2,d:2,rule:'par (último dígito par)'},
      {n:_randInt(1,33)*3,d:3,rule:'soma dos dígitos divisível por 3'},
      {n:_randInt(1,19)*5,d:5,rule:'termina em 0 ou 5'},
      {n:_randInt(1,11)*9,d:9,rule:'soma dos dígitos divisível por 9'},
    ];
    var r=rules[_randInt(0,rules.length-1)];
    return{statement:r.n+' é divisível por '+r.d+'?',equation:r.n+' ÷ '+r.d,answer:'Sim',intType:'div',
      hints:['Critério de divisibilidade por '+r.d+': '+r.rule,'Verifique: '+r.n,'Sim — '+r.n+'/'+r.d+' = '+(r.n/r.d)]};
  }
  if(type==='primes'){
    var primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
    var composites=[4,6,8,9,10,12,14,15,16,18,20,21,22,24,25];
    var usePrime=_randInt(0,1)===0;
    var n=usePrime?primes[_randInt(0,primes.length-1)]:composites[_randInt(0,composites.length-1)];
    return{statement:'O número '+n+' é primo?',equation:n+' = ?',answer:usePrime?'Sim':'Não',intType:'prime',
      hints:['Primo: divisível apenas por 1 e por si mesmo.',usePrime?'Tente dividir por 2,3,5,...,√'+n+'. Nenhum divide.':''+n+' = '+Math.round(n/_randInt(2,Math.ceil(Math.sqrt(n))))||n+'×...  — tem divisor além de 1 e '+n,usePrime?'Sim':'Não']};
  }
  if(type==='gcd_div'){
    var a=_randInt(12,60),b=_randInt(12,60);
    function g(x,y){while(y){var t=y;y=x%y;x=t;}return x;}
    var mdc=g(a,b);
    return{statement:'Quantos divisores comuns têm '+a+' e '+b+'? (conte-os)',
      equation:'MDC('+a+','+b+') = '+mdc+' → divisores de '+mdc,
      answer:String(Math.floor(Math.pow(mdc,0.5)*2-(Number.isInteger(Math.sqrt(mdc))?1:0))||String((function(){var _r=0;for(var _j=1;_j<=mdc+1;_j++){if(_j>0&&mdc%_j===0)_r++;}return _r;})())),
      intType:'gcd_div',
      hints:['Todo divisor comum de a e b divide MDC(a,b).','MDC('+a+','+b+') = '+mdc+'. Liste divisores de '+mdc+'.',String((function(){var _r=0;for(var _j=1;_j<=mdc+1;_j++){if(_j>0&&mdc%_j===0)_r++;}return _r;})())]};
  }
  // lcm word problem
  var a=_randInt(2,8),b=_randInt(2,8);while(a===b)b=_randInt(2,8);
  function lcm(x,y){function g(p,q){while(q){var t=q;q=p%q;p=t;}return p;}return Math.abs(x*y)/g(x,y);}
  var l=lcm(a,b);
  return{statement:'Um sinal pisca a cada '+a+' segundos e outro a cada '+b+' segundos. Após quantos segundos piscam juntos pela primeira vez?',
    equation:'MMC('+a+','+b+')',answer:String(l),intType:'lcm',
    hints:['Piscam juntos quando o tempo é múltiplo de ambos.','MMC('+a+','+b+') = ?',String(l)+' segundos']};
}

  // ── decimals ─────────────────────────────────────────────
  MathGenerators['decimals'] = function _genDecimals(difficulty) {
  _reseed();
  var types = ['dec_frac','frac_dec','pct_of','pct_change','discount'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'dec_frac') {
    var nums = [[1,4,'0,25'],[1,2,'0,5'],[3,4,'0,75'],[1,5,'0,2'],[2,5,'0,4'],[3,5,'0,6'],[1,10,'0,1'],[3,10,'0,3']];
    var p = nums[_randInt(0, nums.length - 1)];
    return { statement: 'Converta ' + p[0] + '/' + p[1] + ' para decimal.', equation: p[0] + '/' + p[1] + ' = ?',
      answer: p[2], decType: 'dec_frac',
      hints: ['Divida o numerador pelo denominador.', p[0] + ' ÷ ' + p[1] + ' = ' + p[2], p[2]] };
  }
  if (type === 'frac_dec') {
    var pairs = [['0,25','1/4'],['0,5','1/2'],['0,75','3/4'],['0,2','1/5'],['0,1','1/10'],['0,125','1/8']];
    var p = pairs[_randInt(0, pairs.length - 1)];
    return { statement: 'Escreva ' + p[0] + ' como fração irredutível.', equation: p[0] + ' = ?',
      answer: p[1], decType: 'frac_dec',
      hints: ['Leia os decimais como fração (ex: 0,25 = 25/100).', 'Simplifique pelo MDC.', p[1]] };
  }
  if (type === 'pct_of') {
    var pcts = [10,15,20,25,30,40,50,75];
    var pct = pcts[_randInt(0, pcts.length - 1)];
    var base = _randInt(2, 20) * 10;
    var ans = Math.round(base * pct / 100);
    return { statement: 'Calcule ' + pct + '% de ' + base + '.', equation: pct + '% × ' + base,
      answer: String(ans), decType: 'pct_of',
      hints: ['% = por cento = /100. Então ' + pct + '% = ' + pct + '/100.', pct + '/100 × ' + base + ' = ' + ans, String(ans)] };
  }
  if (type === 'pct_change') {
    var orig = _randInt(2, 20) * 50;
    var pct = _randInt(1, 8) * 5;
    var isInc = _randInt(0, 1) === 0;
    var ans = isInc ? orig + orig * pct / 100 : orig - orig * pct / 100;
    var word = isInc ? 'acréscimo' : 'desconto';
    return { statement: 'Um produto custa R$' + orig + ' e sofreu um ' + word + ' de ' + pct + '%. Qual o novo valor?',
      equation: orig + ' × (1 ' + (isInc ? '+' : '-') + ' ' + pct + '/100)',
      answer: String(ans), decType: 'pct_change',
      hints: ['Novo valor = original × (1 ± taxa).', orig + ' × ' + (isInc ? (1 + pct/100).toFixed(2) : (1 - pct/100).toFixed(2)), 'R$ ' + ans] };
  }
  // successive discounts
  var p1 = _randInt(1,4) * 10, p2 = _randInt(1,4) * 5;
  var base = _randInt(2, 10) * 100;
  var ans = Math.round(base * (1 - p1/100) * (1 - p2/100));
  return { statement: 'Descontos sucessivos de ' + p1 + '% e ' + p2 + '% sobre R$' + base + '. Valor final?',
    equation: base + ' × (1−' + p1 + '/100) × (1−' + p2 + '/100)',
    answer: String(ans), decType: 'successive',
    hints: ['Aplique um desconto por vez.', base + ' × ' + (1-p1/100).toFixed(2) + ' = ' + Math.round(base*(1-p1/100)), 'R$ ' + ans] };
}

  // ── algebraic ─────────────────────────────────────────────
  MathGenerators['algebraic'] = function _genAlgebraic(difficulty) {
  _reseed();
  var types = ['num_value','like_terms','simplify','expand_dist','sub_eval'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'num_value') {
    var a = _randInt(1, 6), b = _randInt(-4, 4), x = _randInt(1, 5);
    var expr = a + 'x' + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b));
    var ans = a * x + b;
    return { statement: 'Para x = ' + x + ', calcule: ' + expr + '.', equation: expr + '  (x = ' + x + ')',
      answer: String(ans), algType: 'num_value',
      hints: ['Substitua x = ' + x + ' na expressão.', a + '×' + x + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b)), String(ans)] };
  }
  if (type === 'like_terms') {
    var a = _randInt(1, 6), b = _randInt(1, 6), c = _randInt(1, 6), d = _randInt(1, 6);
    var ans = (a + c) + 'x + ' + (b + d);
    return { statement: 'Simplifique: ' + a + 'x + ' + b + ' + ' + c + 'x + ' + d + '.', equation: a + 'x + ' + b + ' + ' + c + 'x + ' + d,
      answer: ans, algType: 'like_terms',
      hints: ['Agrupe termos semelhantes (com x) e termos independentes.', '(' + a + '+' + c + ')x + (' + b + '+' + d + ')', ans] };
  }
  if (type === 'simplify') {
    var a = _randInt(2, 5), b = _randInt(1, 4), c = _randInt(1, 3);
    // a(bx + c) - simplify
    var ans = a*b + 'x + ' + a*c;
    return { statement: 'Expanda: ' + a + '(' + b + 'x + ' + c + ').', equation: a + '(' + b + 'x + ' + c + ')',
      answer: ans, algType: 'simplify',
      hints: ['Distributiva: a(b+c) = ab + ac.', a + '×' + b + 'x + ' + a + '×' + c, ans] };
  }
  if (type === 'expand_dist') {
    var a = _randInt(1, 4), b = _randInt(1, 4), c = _randInt(1, 4), d = _randInt(1, 4);
    // (ax+b)(cx+d) = acx² + (ad+bc)x + bd
    var ac = a*c, adbc = a*d + b*c, bd = b*d;
    var ans = ac + 'x² + ' + adbc + 'x + ' + bd;
    return { statement: 'Expanda: (' + a + 'x + ' + b + ')(' + c + 'x + ' + d + ').', equation: '(' + a + 'x + ' + b + ')(' + c + 'x + ' + d + ')',
      answer: ans, algType: 'expand',
      hints: ['Multiplique cada termo do 1º pelo 2º (FOIL).', a + 'x×' + c + 'x + ' + a + 'x×' + d + ' + ' + b + '×' + c + 'x + ' + b + '×' + d, ans] };
  }
  // evaluate with two variables
  var a = _randInt(1, 5), b = _randInt(1, 4), x = _randInt(1, 4), y = _randInt(1, 4);
  var ans = a*x + b*y;
  return { statement: 'Calcule ' + a + 'x + ' + b + 'y para x=' + x + ' e y=' + y + '.', equation: a + 'x + ' + b + 'y  (x=' + x + ', y=' + y + ')',
    answer: String(ans), algType: 'two_var',
    hints: ['Substitua x=' + x + ' e y=' + y + '.', a + '×' + x + ' + ' + b + '×' + y, String(ans)] };
}

  // ── measures ─────────────────────────────────────────────
  MathGenerators['measures'] = function _genMeasures(difficulty) {
  _reseed();
  var types = ['length','mass','volume','time','sci_notation'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'length') {
    var convs = [
      { from: _randInt(1,10), fromU: 'km', factor: 1000, toU: 'm' },
      { from: _randInt(1,20)*10, fromU: 'cm', factor: 0.01, toU: 'm' },
      { from: _randInt(1,10)*100, fromU: 'mm', factor: 0.001, toU: 'm' },
      { from: _randInt(1,5), fromU: 'm', factor: 100, toU: 'cm' },
    ];
    var c = convs[_randInt(0, convs.length - 1)];
    var ans = c.from * c.factor;
    return { statement: 'Converta ' + c.from + ' ' + c.fromU + ' para ' + c.toU + '.', equation: c.from + ' ' + c.fromU + ' = ? ' + c.toU,
      answer: String(ans) + ' ' + c.toU, measType: 'length',
      hints: ['1 km = 1000 m  |  1 m = 100 cm  |  1 cm = 10 mm', c.from + ' × ' + c.factor, String(ans) + ' ' + c.toU] };
  }
  if (type === 'mass') {
    var convs = [
      { from: _randInt(1,10), fromU: 'kg', factor: 1000, toU: 'g' },
      { from: _randInt(1,20)*100, fromU: 'g', factor: 0.001, toU: 'kg' },
      { from: _randInt(1,5), fromU: 't', factor: 1000, toU: 'kg' },
    ];
    var c = convs[_randInt(0, convs.length - 1)];
    var ans = c.from * c.factor;
    return { statement: 'Converta ' + c.from + ' ' + c.fromU + ' para ' + c.toU + '.', equation: c.from + ' ' + c.fromU + ' = ? ' + c.toU,
      answer: String(ans) + ' ' + c.toU, measType: 'mass',
      hints: ['1 t = 1000 kg  |  1 kg = 1000 g', c.from + ' × ' + c.factor, String(ans) + ' ' + c.toU] };
  }
  if (type === 'volume') {
    var convs = [
      { from: _randInt(1,5), fromU: 'L', factor: 1000, toU: 'mL' },
      { from: _randInt(1,10)*500, fromU: 'mL', factor: 0.001, toU: 'L' },
      { from: _randInt(1,5), fromU: 'm³', factor: 1000, toU: 'L' },
    ];
    var c = convs[_randInt(0, convs.length - 1)];
    var ans = c.from * c.factor;
    return { statement: 'Converta ' + c.from + ' ' + c.fromU + ' para ' + c.toU + '.', equation: c.from + ' ' + c.fromU + ' = ? ' + c.toU,
      answer: String(ans) + ' ' + c.toU, measType: 'volume',
      hints: ['1 L = 1000 mL  |  1 m³ = 1000 L', c.from + ' × ' + c.factor, String(ans) + ' ' + c.toU] };
  }
  if (type === 'time') {
    var convs = [
      { from: _randInt(1,5), fromU: 'h', factor: 60, toU: 'min' },
      { from: _randInt(1,5)*30, fromU: 'min', factor: 1/60, toU: 'h' },
      { from: _randInt(1,4), fromU: 'dias', factor: 24, toU: 'h' },
    ];
    var c = convs[_randInt(0, convs.length - 1)];
    var ans = Math.round(c.from * c.factor * 100) / 100;
    return { statement: 'Converta ' + c.from + ' ' + c.fromU + ' para ' + c.toU + '.', equation: c.from + ' ' + c.fromU + ' = ? ' + c.toU,
      answer: String(ans) + ' ' + c.toU, measType: 'time',
      hints: ['1 h = 60 min  |  1 dia = 24 h', c.from + ' × ' + c.factor, String(ans) + ' ' + c.toU] };
  }
  // scientific notation
  var mantissa = (_randInt(10, 99) / 10);
  var exp = _randInt(2, 8) * (_randInt(0,1) === 0 ? 1 : -1);
  var val = mantissa * Math.pow(10, exp);
  // ask to write in sci notation
  var bigNums = [
    { val: 300000, ans: '3 × 10⁵' }, { val: 0.00045, ans: '4,5 × 10⁻⁴' },
    { val: 1500000, ans: '1,5 × 10⁶' }, { val: 0.0002, ans: '2 × 10⁻⁴' },
    { val: 670000, ans: '6,7 × 10⁵' },
  ];
  var n = bigNums[_randInt(0, bigNums.length - 1)];
  return { statement: 'Escreva ' + n.val + ' em notação científica (a × 10ⁿ).', equation: n.val + ' = ?',
    answer: n.ans, measType: 'sci',
    hints: ['Mova a vírgula até ter 1 ≤ a < 10. Conte as casas.', 'Desloque a vírgula até obter um número entre 1 e 10.', n.ans] };
}

  // ── angles ─────────────────────────────────────────────
  MathGenerators['angles'] = function _genAngles(difficulty) {
  _reseed();
  var types = ['angle_type','triangle_angle','polygon_sum','tales','exterior'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'angle_type') {
    var angles = [
      { val: _randInt(1, 89), type: 'agudo' },
      { val: 90, type: 'reto' },
      { val: _randInt(91, 179), type: 'obtuso' },
      { val: 180, type: 'raso' },
    ];
    var a = angles[_randInt(0, angles.length - 1)];
    return { statement: 'Classifique o ângulo de ' + a.val + '°.', equation: a.val + '° → tipo?',
      answer: a.type, angType: 'type',
      hints: ['< 90° = agudo  |  = 90° = reto  |  90°–180° = obtuso  |  = 180° = raso', 'Compare ' + a.val + '° com 90°.', a.type] };
  }
  if (type === 'triangle_angle') {
    var a = _randInt(30, 80), b = _randInt(30, 80);
    while (a + b >= 180) b = _randInt(20, 60);
    var c = 180 - a - b;
    return { statement: 'Um triângulo tem ângulos de ' + a + '° e ' + b + '°. Qual é o terceiro ângulo?', equation: a + '° + ' + b + '° + x = 180°',
      answer: c + '°', angType: 'triangle',
      hints: ['A soma dos ângulos internos de qualquer triângulo é 180°.', 'x = 180° − ' + a + '° − ' + b + '°', c + '°'] };
  }
  if (type === 'polygon_sum') {
    var sides = [4, 5, 6, 7, 8];
    var n = sides[_randInt(0, sides.length - 1)];
    var sum = (n - 2) * 180;
    var names = { 4: 'quadrilátero', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono' };
    return { statement: 'Qual é a soma dos ângulos internos de um ' + names[n] + ' (' + n + ' lados)?', equation: 'S = (n−2)×180°  com n = ' + n,
      answer: sum + '°', angType: 'polygon',
      hints: ['Fórmula: S = (n−2)×180°', '(' + n + '−2)×180° = ' + (n-2) + '×180°', sum + '°'] };
  }
  if (type === 'tales') {
    // Thales: parallel lines cut transversals proportionally
    var a = _randInt(2, 8), b = _randInt(2, 8), c = _randInt(2, 8);
    var d = b * c / a;
    return { statement: 'Pelo Teorema de Tales: segmentos a=' + a + ', b=' + b + ', c=' + c + '. Determine d tal que a/b = c/d.',
      equation: a + '/' + b + ' = ' + c + '/d',
      answer: String(d), angType: 'tales',
      hints: ['Produto cruzado: a×d = b×c.', 'd = b×c/a = ' + b + '×' + c + '/' + a, String(d)] };
  }
  // exterior angle
  var a = _randInt(30, 80), b = _randInt(30, 80);
  while (a + b >= 180) b = _randInt(20, 60);
  var ext = a + b; // exterior = sum of non-adjacent internals
  return { statement: 'Um triângulo tem dois ângulos internos de ' + a + '° e ' + b + '°. Qual é o ângulo externo ao terceiro vértice?',
    equation: 'Ângulo externo = ?',
    answer: ext + '°', angType: 'exterior',
    hints: ['Ângulo externo = soma dos dois ângulos internos não adjacentes.', a + '° + ' + b + '° = ' + ext + '°', ext + '°'] };
}

  // ── similarity ─────────────────────────────────────────────
  MathGenerators['similarity'] = function _genSimilarity(difficulty) {
  _reseed();
  var types = ['similar_sides','scale','pyth_apply','congruence_crit','area_scale'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'similar_sides') {
    var k = _randInt(2, 5);
    var a = _randInt(3, 8), b = _randInt(3, 8), c = _randInt(3, 8);
    return { statement: 'Dois triângulos são semelhantes com razão k=' + k + '. Se o menor tem lados ' + a + ', ' + b + ', ' + c + ', quais são os lados do maior?',
      equation: 'Lados = ' + a + '×' + k + ', ' + b + '×' + k + ', ' + c + '×' + k,
      answer: a*k + ', ' + b*k + ', ' + c*k, simType: 'sides',
      hints: ['Em triângulos semelhantes, lados correspondentes têm razão k.', 'Multiplique cada lado por ' + k + '.', a*k + ', ' + b*k + ', ' + c*k] };
  }
  if (type === 'scale') {
    var scale_num = _randInt(1, 4), scale_den = _randInt(5, 20) * 5;
    var real = _randInt(2, 8) * scale_den;
    var drawn = real * scale_num / scale_den;
    return { statement: 'Escala 1:' + scale_den + '/1 = 1/' + scale_den + '. Uma distância real de ' + real + ' m, qual é no mapa (em cm)?',
      equation: 'Mapa = real / ' + scale_den,
      answer: String(drawn) + ' cm', simType: 'scale',
      hints: ['Escala 1:' + scale_den + ' → divida a distância real por ' + scale_den + '.', real + ' / ' + scale_den + ' = ' + drawn, drawn + ' cm'] };
  }
  if (type === 'pyth_apply') {
    var triples = [[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
    var t = triples[_randInt(0, triples.length - 1)];
    var missing = _randInt(0, 2);
    var sides = [t[0], t[1], t[2]];
    var ans = sides[missing];
    var known = sides.filter(function(_,i){return i!==missing;});
    var isHyp = missing === 2;
    var stmt = isHyp ? 'Catetos ' + known[0] + ' e ' + known[1] + '. Calcule a hipotenusa.' :
                       'Hipotenusa ' + t[2] + ' e cateto ' + (missing===0?t[1]:t[0]) + '. Calcule o outro cateto.';
    return { statement: stmt, equation: 'a² + b² = c²',
      answer: String(ans), simType: 'pyth',
      hints: ['Teorema de Pitágoras: a² + b² = c² (c = hipotenusa).', isHyp ? known[0]+'² + '+known[1]+'² = ?' : t[2]+'² − '+(missing===0?t[1]:t[0])+'² = ?', String(ans)] };
  }
  if (type === 'congruence_crit') {
    var crits = [
      { name: 'LAL (Lado-Ângulo-Lado)', q: 'Dois triângulos têm dois lados iguais e o ângulo entre eles igual. Qual critério de congruência se aplica?' },
      { name: 'ALA (Ângulo-Lado-Ângulo)', q: 'Dois triângulos têm dois ângulos iguais e o lado entre eles igual. Qual critério?' },
      { name: 'LLL (Lado-Lado-Lado)', q: 'Dois triângulos têm os três lados correspondentes iguais. Qual critério?' },
      { name: 'LAAo (Lado-Ângulo-Ângulo oposto)', q: 'Dois triângulos têm um lado e dois ângulos (um oposto ao lado) iguais. Qual critério?' },
    ];
    var c = crits[_randInt(0, crits.length - 1)];
    return { statement: c.q, equation: 'Critério = ?',
      answer: c.name, simType: 'congruence',
      hints: ['Os critérios clássicos são: LLL, LAL, ALA, LAAo.', 'Analise quais elementos (lados ou ângulos) são dados.', c.name] };
  }
  // area scale
  var k = _randInt(2, 5);
  var a1 = _randInt(4, 20);
  var a2 = a1 * k * k;
  return { statement: 'Duas figuras semelhantes com razão de semelhança k=' + k + '. Se a menor tem área ' + a1 + ' cm², qual é a área da maior?',
    equation: 'Área maior = Área menor × k²',
    answer: String(a2) + ' cm²', simType: 'area',
    hints: ['Razão das áreas = k² (quadrado da razão de semelhança).', a1 + ' × ' + k + '² = ' + a1 + ' × ' + k*k, a2 + ' cm²'] };
}

  // ── rationals ─────────────────────────────────────────────
  MathGenerators['rationals'] = function _genRationals(difficulty) {
  _reseed();
  var types = ['locate','density','ops_neg','compare','mixed_neg'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'locate') {
    var n = _randInt(1, 7), d = _randInt(2, 8);
    while (d <= n) d = _randInt(2, 8);
    var dec = Math.round(n / d * 1000) / 1000;
    return { statement: 'Converta ' + n + '/' + d + ' para decimal e diga se é periódico ou exato.',
      equation: n + '/' + d + ' = ?', answer: String(dec) + (Number.isInteger(n/d) ? ' (exato)' : ' (periódico ou exato)'),
      ratType: 'locate',
      hints: ['Divida numerador pelo denominador.', n + ' ÷ ' + d + ' ≈ ' + dec, String(dec)] };
  }
  if (type === 'density') {
    var a = _randInt(-5, 4), b = a + _randInt(1, 3);
    var mid = (a + b) / 2;
    return { statement: 'Cite um número racional entre ' + a + ' e ' + b + '.',
      equation: a + ' < ? < ' + b, answer: String(mid), ratType: 'density',
      hints: ['Entre quaisquer dois racionais há infinitos outros racionais.', 'A média é sempre um racional entre eles.', String(mid)] };
  }
  if (type === 'ops_neg') {
    var a = _randInt(-6, -1), b = _randInt(-6, -1);
    var ops = [
      { op: '+', ans: a + b },
      { op: '×', ans: a * b },
      { op: '−', ans: a - b },
    ];
    var op = ops[_randInt(0, ops.length - 1)];
    return { statement: 'Calcule: (' + a + ') ' + op.op + ' (' + b + ').', equation: '(' + a + ') ' + op.op + ' (' + b + ')',
      answer: String(op.ans), ratType: 'ops_neg',
      hints: ['Lembre: (−)×(−)=+  |  (−)+(−)=soma negativa', a + ' ' + op.op + ' ' + b, String(op.ans)] };
  }
  if (type === 'compare') {
    var pairs = [[-1/3,-1/4],[-2/3,-3/4],[1/2,-1/2],[-3/5,-2/3]];
    var p = pairs[_randInt(0, pairs.length - 1)];
    var r = p[0] < p[1] ? '<' : p[0] > p[1] ? '>' : '=';
    function toFrac(x) {
      var fracs = {[1/2]:'1/2',[-1/2]:'-1/2',[-1/3]:'-1/3',[-1/4]:'-1/4',[-2/3]:'-2/3',[-3/4]:'-3/4',[-3/5]:'-3/5',[-2/3]:'-2/3'};
      return fracs[x] || String(Math.round(x*100)/100);
    }
    return { statement: 'Compare: ' + toFrac(p[0]) + ' ○ ' + toFrac(p[1]) + '  (use <, > ou =)',
      equation: toFrac(p[0]) + ' ___ ' + toFrac(p[1]), answer: r, ratType: 'compare',
      hints: ['Converta para decimal ou iguale os denominadores.', String(Math.round(p[0]*1000)/1000) + ' vs ' + String(Math.round(p[1]*1000)/1000), r] };
  }
  // mixed negative
  var a = _randInt(-5, 5), b = _randInt(1, 4), c = _randInt(-4, 4);
  var ans = a * b + c;
  return { statement: 'Simplifique: ' + a + ' × ' + b + ' + (' + c + ').',
    equation: a + ' × ' + b + ' + ' + c, answer: String(ans), ratType: 'mixed',
    hints: ['Primeiro a multiplicação, depois a adição.', a + ' × ' + b + ' = ' + (a*b), String(ans)] };
}
})();
