/**
 * math/generators/geometry.js
 * Geometry generators (cartesian, vectors, conics, spatial, analytic).
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;
  function _gcd(a, b) { return b === 0 ? a : _gcd(b, a % b); }

  // ── File-scoped helpers ──────────────────────────────────────────
  var _vecTypes = ['add', 'modulus', 'dot_product', 'line_eq', 'circle_eq'];
  
  function _genVectors(difficulty) {
    _reseed();
    var type = _vecTypes[Math.min(difficulty - 1, _vecTypes.length - 1)];
  
    if (type === 'add') {
      var ax=_randInt(-5,5),ay=_randInt(-5,5),bx=_randInt(-5,5),by=_randInt(-5,5);
      return {
        statement: 'Calcule a soma dos vetores u = (' + ax + ', ' + ay + ') e v = (' + bx + ', ' + by + ').',
        equation:  'u + v = (ax+bx, ay+by)',
        answer:    '(' + (ax+bx) + ', ' + (ay+by) + ')',
        vecType:   'add', ax:ax,ay:ay,bx:bx,by:by,
        hints: ['Some as componentes: x com x, y com y.',
                '(' + ax + '+' + bx + ', ' + ay + '+' + by + ')',
                'u + v = (' + (ax+bx) + ', ' + (ay+by) + ')'],
      };
    }
  
    if (type === 'modulus') {
      var x=_randInt(-6,6),y=_randInt(-6,6);
      var mod=Math.sqrt(x*x+y*y);
      var ans=Number.isInteger(mod)?String(mod):'√'+(x*x+y*y);
      return {
        statement: 'Calcule o módulo do vetor v = (' + x + ', ' + y + ').',
        equation:  '|v| = √(x² + y²)',
        answer:    ans,
        vecType:   'mod', x:x,y:y,
        hints:['|v| = √(x² + y²)','|v| = √(' + x + '² + ' + y + '²) = √' + (x*x+y*y),'|v| = ' + ans],
      };
    }
  
    if (type === 'dot_product') {
      var ax=_randInt(-5,5),ay=_randInt(-5,5),bx=_randInt(-5,5),by=_randInt(-5,5);
      var dot=ax*bx+ay*by;
      return {
        statement: 'Calcule o produto escalar u·v, com u=(' + ax + ',' + ay + ') e v=(' + bx + ',' + by + ').',
        equation:  'u·v = ax×bx + ay×by',
        answer:    String(dot),
        vecType:   'dot', ax:ax,ay:ay,bx:bx,by:by,
        hints:['u·v = ax×bx + ay×by',ax+'×'+bx+' + '+ay+'×'+by+' = '+(ax*bx)+' + '+(ay*by),'u·v = '+dot],
      };
    }
  
    if (type === 'line_eq') {
      // Line through two points
      var x1=_randInt(-4,4),y1=_randInt(-4,4),x2=_randInt(-4,4),y2=_randInt(-4,4);
      while(x1===x2&&y1===y2){x2=_randInt(-4,4);y2=_randInt(-4,4);}
      var dx=x2-x1,dy=y2-y1;
      // General form: dy(x-x1) - dx(y-y1)=0 → dy*x - dx*y + (dx*y1 - dy*x1)=0
      var A=dy,B=-dx,C=dx*y1-dy*x1;
      var g=_gcd(_gcd(Math.abs(A),Math.abs(B)),Math.abs(C)||1);
      A/=g;B/=g;C/=g;
      if(A<0){A=-A;B=-B;C=-C;}
      var ans=(A===1?'':A)+'x '+(B>=0?'+ '+B:'- '+Math.abs(B))+'y '+(C>=0?'+ '+C:'- '+Math.abs(C))+' = 0';
      return {
        statement:'Encontre a equação da reta que passa por P1('+x1+','+y1+') e P2('+x2+','+y2+').',
        equation: 'A(x-x1) + B(y-y1) = 0',
        answer:   ans,
        vecType:  'line', x1:x1,y1:y1,x2:x2,y2:y2,
        hints:['Vetor diretor: d = P2-P1 = ('+dx+','+dy+')',
               'Normal: n = ('+dy+', '+(-dx)+')  →  '+dy+'(x-'+x1+') '+(-dx<0?'- '+Math.abs(-dx):'+'+(-dx))+'(y-'+y1+')=0',
               ans],
      };
    }
  
    // circle
    var cx=_randInt(-4,4),cy=_randInt(-4,4),r=_randInt(1,6);
    return {
      statement:'Escreva a equação da circunferência de centro ('+cx+','+cy+') e raio '+r+'.',
      equation: '(x-cx)² + (y-cy)² = r²',
      answer:   '(x'+(cx>=0?' - '+cx:' + '+Math.abs(cx))+')² + (y'+(cy>=0?' - '+cy:' + '+Math.abs(cy))+')² = '+r*r,
      vecType:  'circle', cx:cx,cy:cy,r:r,
      hints:['(x - h)² + (y - k)² = r²  onde (h,k) é o centro.',
             '(x - ('+cx+'))² + (y - ('+cy+'))² = '+r+'²',
             '(x'+(cx>=0?' - '+cx:' + '+Math.abs(cx))+')² + (y'+(cy>=0?' - '+cy:' + '+Math.abs(cy))+')² = '+r*r],
    };
  }


  // ── cartesian ─────────────────────────────────────────────
  MathGenerators['cartesian'] = function _genCartesian(difficulty) {
  _reseed();
  var type = difficulty <= 2 ? 'point' : difficulty <= 4 ? 'slope' : 'intercept';

  if (type === 'point') {
    var x = _randInt(-8, 8), y = _randInt(-8, 8);
    var quad = x >= 0 && y >= 0 ? '1º' : x < 0 && y >= 0 ? '2º' : x < 0 && y < 0 ? '3º' : '4º';
    return {
      statement: 'Em qual quadrante está o ponto P(' + x + ', ' + y + ')?',
      equation:  'P(' + x + ', ' + y + ')',
      answer:    quad,
      plotX: x, plotY: y,
      hints: [
        'x ' + (x >= 0 ? '≥ 0 (direita)' : '< 0 (esquerda)') + ', y ' + (y >= 0 ? '≥ 0 (cima)' : '< 0 (baixo)') + '.',
        '1º: (+,+)  2º: (-,+)  3º: (-,-)  4º: (+,-)',
        'Resposta: ' + quad + ' quadrante.',
      ],
    };
  }

  if (type === 'slope') {
    var x1 = _randInt(-5, 5), y1 = _randInt(-5, 5);
    var x2 = _randInt(-5, 5);
    while (x2 === x1) x2 = _randInt(-5, 5);
    var a = _randInt(-4, 4);
    while (a === 0) a = _randInt(-4, 4);
    var y2 = y1 + a * (x2 - x1);
    var g  = _gcd(Math.abs(a), 1);
    return {
      statement: 'Calcule o coeficiente angular (inclinação) da reta que passa por P1(' + x1 + ',' + y1 + ') e P2(' + x2 + ',' + y2 + ').',
      equation:  'P1(' + x1 + ', ' + y1 + ')  P2(' + x2 + ', ' + y2 + ')',
      answer:    String(a),
      plotX: x1, plotY: y1, plotX2: x2, plotY2: y2,
      hints: [
        'Coeficiente angular: m = (y2 - y1) / (x2 - x1).',
        'm = (' + y2 + ' - ' + y1 + ') / (' + x2 + ' - ' + x1 + ') = ' + (y2-y1) + '/' + (x2-x1) + '.',
        'm = ' + a,
      ],
    };
  }

  // intercept: find where f(x) = ax + b crosses x-axis
  var a = _randInt(-4, 4); while (a === 0) a = _randInt(-4, 4);
  var b = _randInt(-8, 8);
  var xInt = -b / a;
  var ans  = Number.isInteger(xInt) ? String(xInt) : xInt.toFixed(2);
  return {
    statement: 'Encontre o zero (raiz) da função f(x) = ' + (a === 1 ? '' : a === -1 ? '-' : a) + 'x' + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b)) + '.',
    equation:  (a === 1 ? '' : a === -1 ? '-' : a) + 'x' + (b >= 0 ? ' + ' + b : ' - ' + Math.abs(b)) + ' = 0',
    answer:    ans,
    a: a, b: b,
    hints: [
      'Iguale f(x) = 0 e resolva para x.',
      (a === 1 ? 'x' : a + 'x') + ' = ' + (-b),
      'x = ' + ans,
    ],
  };
}

  // ── vectors ─────────────────────────────────────────────
  MathGenerators['vectors'] = function _genVectors(difficulty) {
  _reseed();
  var type = _vecTypes[Math.min(difficulty - 1, _vecTypes.length - 1)];

  if (type === 'add') {
    var ax=_randInt(-5,5),ay=_randInt(-5,5),bx=_randInt(-5,5),by=_randInt(-5,5);
    return {
      statement: 'Calcule a soma dos vetores u = (' + ax + ', ' + ay + ') e v = (' + bx + ', ' + by + ').',
      equation:  'u + v = (ax+bx, ay+by)',
      answer:    '(' + (ax+bx) + ', ' + (ay+by) + ')',
      vecType:   'add', ax:ax,ay:ay,bx:bx,by:by,
      hints: ['Some as componentes: x com x, y com y.',
              '(' + ax + '+' + bx + ', ' + ay + '+' + by + ')',
              'u + v = (' + (ax+bx) + ', ' + (ay+by) + ')'],
    };
  }

  if (type === 'modulus') {
    var x=_randInt(-6,6),y=_randInt(-6,6);
    var mod=Math.sqrt(x*x+y*y);
    var ans=Number.isInteger(mod)?String(mod):'√'+(x*x+y*y);
    return {
      statement: 'Calcule o módulo do vetor v = (' + x + ', ' + y + ').',
      equation:  '|v| = √(x² + y²)',
      answer:    ans,
      vecType:   'mod', x:x,y:y,
      hints:['|v| = √(x² + y²)','|v| = √(' + x + '² + ' + y + '²) = √' + (x*x+y*y),'|v| = ' + ans],
    };
  }

  if (type === 'dot_product') {
    var ax=_randInt(-5,5),ay=_randInt(-5,5),bx=_randInt(-5,5),by=_randInt(-5,5);
    var dot=ax*bx+ay*by;
    return {
      statement: 'Calcule o produto escalar u·v, com u=(' + ax + ',' + ay + ') e v=(' + bx + ',' + by + ').',
      equation:  'u·v = ax×bx + ay×by',
      answer:    String(dot),
      vecType:   'dot', ax:ax,ay:ay,bx:bx,by:by,
      hints:['u·v = ax×bx + ay×by',ax+'×'+bx+' + '+ay+'×'+by+' = '+(ax*bx)+' + '+(ay*by),'u·v = '+dot],
    };
  }

  if (type === 'line_eq') {
    // Line through two points
    var x1=_randInt(-4,4),y1=_randInt(-4,4),x2=_randInt(-4,4),y2=_randInt(-4,4);
    while(x1===x2&&y1===y2){x2=_randInt(-4,4);y2=_randInt(-4,4);}
    var dx=x2-x1,dy=y2-y1;
    // General form: dy(x-x1) - dx(y-y1)=0 → dy*x - dx*y + (dx*y1 - dy*x1)=0
    var A=dy,B=-dx,C=dx*y1-dy*x1;
    var g=_gcd(_gcd(Math.abs(A),Math.abs(B)),Math.abs(C)||1);
    A/=g;B/=g;C/=g;
    if(A<0){A=-A;B=-B;C=-C;}
    var ans=(A===1?'':A)+'x '+(B>=0?'+ '+B:'- '+Math.abs(B))+'y '+(C>=0?'+ '+C:'- '+Math.abs(C))+' = 0';
    return {
      statement:'Encontre a equação da reta que passa por P1('+x1+','+y1+') e P2('+x2+','+y2+').',
      equation: 'A(x-x1) + B(y-y1) = 0',
      answer:   ans,
      vecType:  'line', x1:x1,y1:y1,x2:x2,y2:y2,
      hints:['Vetor diretor: d = P2-P1 = ('+dx+','+dy+')',
             'Normal: n = ('+dy+', '+(-dx)+')  →  '+dy+'(x-'+x1+') '+(-dx<0?'- '+Math.abs(-dx):'+'+(-dx))+'(y-'+y1+')=0',
             ans],
    };
  }

  // circle
  var cx=_randInt(-4,4),cy=_randInt(-4,4),r=_randInt(1,6);
  return {
    statement:'Escreva a equação da circunferência de centro ('+cx+','+cy+') e raio '+r+'.',
    equation: '(x-cx)² + (y-cy)² = r²',
    answer:   '(x'+(cx>=0?' - '+cx:' + '+Math.abs(cx))+')² + (y'+(cy>=0?' - '+cy:' + '+Math.abs(cy))+')² = '+r*r,
    vecType:  'circle', cx:cx,cy:cy,r:r,
    hints:['(x - h)² + (y - k)² = r²  onde (h,k) é o centro.',
           '(x - ('+cx+'))² + (y - ('+cy+'))² = '+r+'²',
           '(x'+(cx>=0?' - '+cx:' + '+Math.abs(cx))+')² + (y'+(cy>=0?' - '+cy:' + '+Math.abs(cy))+')² = '+r*r],
  };
}

  // ── conics ─────────────────────────────────────────────
  MathGenerators['conics'] = function _genConics(difficulty) {
  _reseed();
  var types=['parabola_vertex','ellipse_axes','hyperbola_vertices','circle_center','identify'];
  var type=types[Math.min(difficulty-1,4)];
  if(type==='parabola_vertex'){
    var a=_randInt(1,4),h=_randInt(-4,4),k=_randInt(-4,4);
    var hs=h>0?' − '+h:h<0?' + '+Math.abs(h):'';
    var ks=k>=0?' + '+k:' − '+Math.abs(k);
    var eq='y = '+a+'(x'+hs+')²'+ks;
    return{statement:'Vértice da parábola: '+eq,equation:eq,answer:'('+h+', '+k+')',conicType:'parabola',h:h,k:k,
      hints:['Forma y = a(x−h)²+k: vértice em (h,k).','h='+h+', k='+k,'('+h+', '+k+')']};
  }
  if(type==='ellipse_axes'){
    var a2=_randInt(5,16),b2=_randInt(2,a2-1);
    return{statement:'Semi-eixos da elipse x²/'+a2+' + y²/'+b2+' = 1.',
      equation:'x²/'+a2+' + y²/'+b2+' = 1',answer:'a=√'+a2+', b=√'+b2,conicType:'ellipse',
      hints:['x²/a² + y²/b² = 1: semi-eixos a e b.','a²='+a2+', b²='+b2,'a=√'+a2+', b=√'+b2]};
  }
  if(type==='hyperbola_vertices'){
    var a2=_randInt(4,16),b2=_randInt(2,12);
    var a=Math.sqrt(a2),ans=Number.isInteger(a)?'(±'+a+', 0)':'(±√'+a2+', 0)';
    return{statement:'Vértices reais da hipérbole x²/'+a2+' − y²/'+b2+' = 1.',
      equation:'x²/'+a2+' − y²/'+b2+' = 1',answer:ans,conicType:'hyperbola',
      hints:['Vértices em (±a, 0) onde a²='+a2,'a=√'+a2,ans]};
  }
  if(type==='circle_center'){
    var h=_randInt(-5,5),k=_randInt(-5,5),r=_randInt(1,6);
    var hs=h>0?' − '+h:h<0?' + '+Math.abs(h):'';
    var ks=k>0?' − '+k:k<0?' + '+Math.abs(k):'';
    var eq='(x'+hs+')² + (y'+ks+')² = '+r*r;
    return{statement:'Centro e raio da circunferência: '+eq,equation:eq,answer:'C=('+h+','+k+'), r='+r,conicType:'circle',
      hints:['(x−h)²+(y−k)²=r²: centro (h,k), raio r.','h='+h+', k='+k+', r²='+r*r,'C=('+h+','+k+'), r='+r]};
  }
  var forms=[
    {eq:'x² + y² = 16',type:'circunferência'},
    {eq:'x²/9 + y²/4 = 1',type:'elipse'},
    {eq:'x²/4 − y²/9 = 1',type:'hipérbole'},
    {eq:'y = 3x²',type:'parábola'},
  ];
  var f=forms[_randInt(0,forms.length-1)];
  return{statement:'Identifique a cônica: '+f.eq+'.',equation:f.eq,answer:f.type,conicType:'identify',
    hints:['Observe os sinais: + ambos → elipse/círculo; sinais opostos → hipérbole; um quadrático → parábola.',
           'Círculo: a²=b². Elipse: a²≠b².',f.type]};
}

  // ── spatial ─────────────────────────────────────────────
  MathGenerators['spatial'] = function _genSpatialGeometry(difficulty) {
  _reseed();
  var shapes=['cube','box','cylinder','cone','sphere'];
  var shape=shapes[Math.min(difficulty-1,4)];

  var PI=Math.PI;
  if(shape==='cube') {
    var a=_randInt(2,10);
    var vol=a*a*a, area=6*a*a;
    var ask=Math.random()<0.5;
    return {
      statement:ask?'Calcule o volume do cubo de aresta '+a+'.':'Calcule a área total do cubo de aresta '+a+'.',
      equation:ask?'V = a³  |  a='+a:'At = 6a²  |  a='+a,
      answer:String(ask?vol:area),
      geoShape:'cube', a:a, ask:ask?'vol':'area',
      hints:ask?['V = a³','V = '+a+'³ = '+a*a+' × '+a,'V = '+vol]:['At = 6a²','At = 6 × '+a+'² = 6 × '+a*a,'At = '+area],
    };
  }
  if(shape==='box') {
    var l=_randInt(2,10),w=_randInt(2,8),h=_randInt(2,6);
    var vol=l*w*h;
    return {
      statement:'Calcule o volume do paralelepípedo '+l+'×'+w+'×'+h+'.',
      equation:'V = l×w×h  |  '+l+'×'+w+'×'+h,
      answer:String(vol),
      geoShape:'box', l:l,w:w,h:h,
      hints:['V = comprimento × largura × altura','V = '+l+' × '+w+' × '+h+' = '+(l*w)+' × '+h,'V = '+vol],
    };
  }
  if(shape==='cylinder') {
    var r=_randInt(2,8),h=_randInt(2,10);
    var vol=Math.round(3.14*r*r*h*100)/100;
    return {
      statement:'Calcule o volume do cilindro com raio '+r+' e altura '+h+'. Use π ≈ 3,14.',
      equation:'V = πr²h  |  r='+r+', h='+h,
      answer:String(vol),
      geoShape:'cylinder', r:r,h:h,
      hints:['V = π × r² × h','V = 3,14 × '+r+'² × '+h+' = 3,14 × '+r*r+' × '+h,'V = '+vol],
    };
  }
  if(shape==='cone') {
    var r=_randInt(2,7),h=_randInt(2,9);
    var vol=Math.round(3.14*r*r*h/3*100)/100;
    return {
      statement:'Calcule o volume do cone com raio '+r+' e altura '+h+'. Use π ≈ 3,14.',
      equation:'V = πr²h/3  |  r='+r+', h='+h,
      answer:String(vol),
      geoShape:'cone', r:r,h:h,
      hints:['V = (1/3) × π × r² × h','V = 3,14 × '+r*r+' × '+h+' / 3','V = '+vol],
    };
  }
  // sphere
  var r=_randInt(2,8);
  var vol=Math.round(4/3*3.14*r*r*r*100)/100;
  return {
    statement:'Calcule o volume da esfera de raio '+r+'. Use π ≈ 3,14.',
    equation:'V = (4/3)πr³  |  r='+r,
    answer:String(vol),
    geoShape:'sphere', r:r,
    hints:['V = (4/3) × π × r³','V = (4/3) × 3,14 × '+r+'³ = (4/3) × 3,14 × '+r*r*r,'V = '+vol],
  };
}

  // ── analytic_geo ─────────────────────────────────────────────
  MathGenerators['analytic_geo'] = function _genAnalyticGeo(difficulty) {
  _reseed();
  var types = ['general_line','pt_line_dist','relative_pos','area_coords','circle_line'];
  var type = types[Math.min(difficulty - 1, 4)];

  if (type === 'general_line') {
    var a = _randInt(1, 5), b = _randInt(1, 5), c = _randInt(-8, 8);
    // Ax + By + C = 0 → find point on line
    // y = (-Ax - C) / B  for x=0
    var y0 = -c / b;
    return { statement: 'Qual ponto (com x=0) pertence à reta ' + a + 'x + ' + b + 'y + ' + c + ' = 0?',
      equation: a + 'x + ' + b + 'y + ' + c + ' = 0  (x=0)',
      answer: '(0, ' + (-c/b) + ')', agType: 'general',
      hints: ['Substitua x=0 e resolva para y.', b + 'y + ' + c + ' = 0 → y = ' + (-c) + '/' + b, '(0, ' + (-c/b) + ')'] };
  }
  if (type === 'pt_line_dist') {
    var a = _randInt(1, 4), b = _randInt(1, 4), c = _randInt(-6, 6);
    var x0 = _randInt(-3, 3), y0 = _randInt(-3, 3);
    var d = Math.abs(a*x0 + b*y0 + c) / Math.sqrt(a*a + b*b);
    d = Math.round(d * 100) / 100;
    return { statement: 'Distância do ponto (' + x0 + ', ' + y0 + ') à reta ' + a + 'x + ' + b + 'y + ' + c + ' = 0.',
      equation: 'd = |' + a + 'x₀ + ' + b + 'y₀ + ' + c + '| / √(' + (a*a) + '+' + (b*b) + ')',
      answer: String(d), agType: 'dist',
      hints: ['d = |Ax₀ + By₀ + C| / √(A²+B²)', '|' + (a*x0+b*y0+c) + '| / √' + (a*a+b*b), String(d)] };
  }
  if (type === 'relative_pos') {
    var a = _randInt(1, 4), b = _randInt(1, 4), c1 = _randInt(-4, 4);
    var configs = [
      { c2: c1, label: 'coincidentes', m2a: a, m2b: b, note: 'mesma equação' },
      { c2: c1 + _randInt(1, 5), label: 'paralelas', m2a: a, m2b: b, note: 'mesmo coef, C diferente' },
      { c2: c1, label: 'concorrentes', m2a: b, m2b: -a, note: 'coeficientes diferentes' },
    ];
    var cfg = configs[_randInt(0, configs.length - 1)];
    return { statement: 'Retas r: ' + a + 'x + ' + b + 'y + ' + c1 + ' = 0 e s: ' + cfg.m2a + 'x + ' + cfg.m2b + 'y + ' + cfg.c2 + ' = 0. Posição relativa?',
      equation: 'r ? s', answer: cfg.label, agType: 'relpos',
      hints: ['Paralelas: mesmo A/B, C diferente. Coincidentes: mesma equação. Concorrentes: A/B diferentes.', cfg.note, cfg.label] };
  }
  if (type === 'area_coords') {
    var ax = 0, ay = 0, bx = _randInt(2, 6), by = 0, cx = _randInt(1, 4), cy = _randInt(2, 6);
    var area = Math.abs((bx - ax)*(cy - ay) - (cx - ax)*(by - ay)) / 2;
    return { statement: 'Área do triângulo com vértices A(0,0), B(' + bx + ',0), C(' + cx + ',' + cy + ').',
      equation: 'A = |det[AB, AC]| / 2', answer: String(area) + ' u²', agType: 'area',
      hints: ['Fórmula: A = |x_A(y_B−y_C) + x_B(y_C−y_A) + x_C(y_A−y_B)| / 2', 'Ou: base×altura/2 (base no eixo x = ' + bx + ', altura = ' + cy + ')', String(area) + ' u²'] };
  }
  // circle ↔ line
  var h = _randInt(-2, 2), k = _randInt(-2, 2), r = _randInt(2, 5);
  var dist = _randInt(0, r + 2);
  var rel = dist < r ? 'secante' : dist === r ? 'tangente' : 'externa';
  return { statement: 'Circunferência centro (' + h + ',' + k + ') raio ' + r + '. Reta a distância ' + dist + ' do centro. Posição?',
    equation: 'd = ' + dist + ',  r = ' + r, answer: rel, agType: 'circle_line',
    hints: ['Compare d (distância centro-reta) com r.', 'd < r → secante  |  d = r → tangente  |  d > r → externa', rel] };
}
})();
