/**
 * math/generators/trig.js
 * Trigonometry generators.
 * Depends on: math/rng.js (MathRNG)
 * Registers into: window.MathGenerators
 */
(function () {
  var _reseed    = MathRNG.reseed;
  var _randInt   = MathRNG.randInt;

  // ── File-scoped helpers ──────────────────────────────────────────
  var _trigTable = {
    0:   { sin: 0,      cos: 1,      tan: 0,           sinStr: '0',        cosStr: '1',        tanStr: '0'        },
    30:  { sin: 0.5,    cos: 0.866,  tan: 0.5774,      sinStr: '1/2',      cosStr: '√3/2',     tanStr: '√3/3'     },
    45:  { sin: 0.7071, cos: 0.7071, tan: 1,           sinStr: '√2/2',     cosStr: '√2/2',     tanStr: '1'        },
    60:  { sin: 0.866,  cos: 0.5,    tan: 1.7321,      sinStr: '√3/2',     cosStr: '1/2',      tanStr: '√3'       },
    90:  { sin: 1,      cos: 0,      tan: null,         sinStr: '1',        cosStr: '0',        tanStr: 'indefinida'},
  };
  var _trigAngles = [0, 30, 45, 60, 90];
  var _trigFns    = ['sin', 'cos', 'tan'];
  
  function _genTrig(difficulty) {
    _reseed();
    var angle = _trigAngles[_randInt(0, difficulty <= 3 ? 3 : 4)];
    var fn    = _trigFns[_randInt(0, difficulty <= 2 ? 1 : 2)];
    var row   = _trigTable[angle];
  
    // Skip tan(90°) for difficulty < 4
    if (fn === 'tan' && angle === 90 && difficulty < 4) fn = 'sin';
  
    var ansStr = fn === 'sin' ? row.sinStr : fn === 'cos' ? row.cosStr : row.tanStr;
    var ansNum = fn === 'sin' ? row.sin    : fn === 'cos' ? row.cos    : row.tan;
  
    return {
      statement: 'Calcule ' + fn + '(' + angle + '°) usando os valores notáveis.',
      equation:  fn + '(' + angle + '°) = ?',
      answer:    ansStr,
      answerNum: ansNum,
      angle: angle, fn: fn,
      hints: [
        'Consulte a tabela de valores notáveis: 0°, 30°, 45°, 60°, 90°.',
        fn === 'tan' ? 'tan(θ) = sin(θ) / cos(θ)' : (fn + '(' + angle + '°) vem da tabela.'),
        fn + '(' + angle + '°) = ' + ansStr,
      ],
    };
  }
  
  // ── Functions generators ────────────────────────────────────────
  
  var _funcTypes = ['linear', 'quadratic', 'exponential', 'logarithmic'];


  // ── trig ─────────────────────────────────────────────
  MathGenerators['trig'] = function _genTrig(difficulty) {
  _reseed();
  var angle = _trigAngles[_randInt(0, difficulty <= 3 ? 3 : 4)];
  var fn    = _trigFns[_randInt(0, difficulty <= 2 ? 1 : 2)];
  var row   = _trigTable[angle];

  // Skip tan(90°) for difficulty < 4
  if (fn === 'tan' && angle === 90 && difficulty < 4) fn = 'sin';

  var ansStr = fn === 'sin' ? row.sinStr : fn === 'cos' ? row.cosStr : row.tanStr;
  var ansNum = fn === 'sin' ? row.sin    : fn === 'cos' ? row.cos    : row.tan;

  return {
    statement: 'Calcule ' + fn + '(' + angle + '°) usando os valores notáveis.',
    equation:  fn + '(' + angle + '°) = ?',
    answer:    ansStr,
    answerNum: ansNum,
    angle: angle, fn: fn,
    hints: [
      'Consulte a tabela de valores notáveis: 0°, 30°, 45°, 60°, 90°.',
      fn === 'tan' ? 'tan(θ) = sin(θ) / cos(θ)' : (fn + '(' + angle + '°) vem da tabela.'),
      fn + '(' + angle + '°) = ' + ansStr,
    ],
  };
}

  // ── trig_circle ─────────────────────────────────────────────
  MathGenerators['trig_circle'] = function _genTrigCircle(difficulty) {
  _reseed();
  var types=['unit_circle','identity','double_angle','inverse','radians'];
  var type=types[Math.min(difficulty-1,4)];
  var angles=[
    {deg:0,rad:'0',sin:0,cos:1,tan:'0'},
    {deg:30,rad:'π/6',sin:'1/2',cos:'√3/2',tan:'√3/3'},
    {deg:45,rad:'π/4',sin:'√2/2',cos:'√2/2',tan:'1'},
    {deg:60,rad:'π/3',sin:'√3/2',cos:'1/2',tan:'√3'},
    {deg:90,rad:'π/2',sin:'1',cos:'0',tan:'indef.'},
    {deg:120,rad:'2π/3',sin:'√3/2',cos:'-1/2',tan:'-√3'},
    {deg:135,rad:'3π/4',sin:'√2/2',cos:'-√2/2',tan:'-1'},
    {deg:150,rad:'5π/6',sin:'1/2',cos:'-√3/2',tan:'-√3/3'},
    {deg:180,rad:'π',sin:'0',cos:'-1',tan:'0'},
  ];
  if(type==='unit_circle'){
    var a=angles[_randInt(0,angles.length-1)];
    var fns=['sen','cos','tan'],fn=fns[_randInt(0,2)];
    var val=fn==='sen'?a.sin:fn==='cos'?a.cos:a.tan;
    return{statement:'Calcule '+fn+'('+a.deg+'°) usando o círculo trigonométrico.',
      equation:fn+'('+a.deg+'°)',answer:String(val),tcType:'unit',fn:fn,deg:a.deg,
      hints:['Ângulo '+a.deg+'° = '+a.rad+' rad.','Ponto no círculo unitário.',String(val)]};
  }
  if(type==='identity'){
    var ids=[
      {stmt:'Simplifique sen²(x) + cos²(x).',ans:'1',h:['Identidade fundamental.','sen²+cos²=1','1']},
      {stmt:'Se sen(x)=3/5 (1º quad.), calcule cos(x).',ans:'4/5',h:['sen²+cos²=1','cos²=1−9/25=16/25','cos(x)=4/5']},
      {stmt:'Se tan(x)=1 (0°<x<90°), qual é x?',ans:'45°',h:['tan(45°)=1','Ângulo de referência: 45°','45°']},
    ];
    var id=ids[_randInt(0,ids.length-1)];
    return{statement:id.stmt,equation:'?',answer:id.ans,tcType:'identity',hints:id.h};
  }
  if(type==='double_angle'){
    var degs=[30,45,60],deg=degs[_randInt(0,2)];
    var s2=Math.round(Math.sin(deg*2*Math.PI/180)*1000)/1000;
    return{statement:'Calcule sen('+deg*2+'°) pela fórmula do ângulo duplo.',
      equation:'sen(2α)=2·sen(α)·cos(α)',answer:String(s2),tcType:'double',deg:deg,
      hints:['sen(2α)=2·sen(α)·cos(α)','Consulte sen('+deg+'°) e cos('+deg+'°).',String(s2)]};
  }
  if(type==='inverse'){
    var ps=[{v:'1/2',f:'arcsen',a:'30°'},{v:'1',f:'arccos',a:'0°'},{v:'1',f:'arctan',a:'45°'}];
    var p=ps[_randInt(0,ps.length-1)];
    return{statement:'Calcule '+p.f+'('+p.v+').',equation:p.f+'('+p.v+')',answer:p.a,tcType:'inverse',
      hints:['Função inversa: retorna o ângulo.','Qual ângulo tem '+p.f.replace('arc','')+' = '+p.v+'?',p.a]};
  }
  var degsR=[0,30,45,60,90,180],dr=degsR[_randInt(0,degsR.length-1)];
  var rads=['0','π/6','π/4','π/3','π/2','π'];
  var idx=degsR.indexOf(dr);
  return{statement:'Converta '+dr+'° para radianos.',equation:dr+'° × (π/180°)',answer:rads[idx],tcType:'radians',
    hints:['Radianos = graus × π/180',dr+' × π/180',rads[idx]]};
}

  // ── trig_graphs ─────────────────────────────────────────────
  MathGenerators['trig_graphs'] = function _genTrigGraphs(difficulty) {
  _reseed();
  var types=['amplitude','period','phase','identify_params','compose'];
  var type=types[Math.min(difficulty-1,4)];

  if(type==='amplitude'){
    var A=_randInt(1,6),fn=['sen','cos'][_randInt(0,1)];
    return{statement:'Qual a amplitude de y = '+A+'·'+fn+'(x)?',
      equation:'y = '+A+'·'+fn+'(x)',answer:String(A),tgType:'amp',fn:fn,A:A,B:1,C:0,D:0,
      hints:['Amplitude = |A| na forma y=A·f(Bx+C)+D.','A = '+A,'Amplitude = '+A]};
  }
  if(type==='period'){
    var B=_randInt(2,6),fn=['sen','cos'][_randInt(0,1)];
    var T=Math.round(360/B*100)/100;
    return{statement:'Qual o período de y = '+fn+'('+B+'x)?',
      equation:'y = '+fn+'('+B+'x)',answer:T+'°',tgType:'per',fn:fn,A:1,B:B,C:0,D:0,
      hints:['Período = 360°/B para seno/cosseno.','B = '+B,'T = 360°/'+B+' = '+T+'°']};
  }
  if(type==='phase'){
    var C=_randInt(1,4)*30,fn=['sen','cos'][_randInt(0,1)];
    return{statement:'Qual o deslocamento horizontal (fase) de y = '+fn+'(x − '+C+'°)?',
      equation:'y = '+fn+'(x − '+C+'°)',answer:C+'° à direita',tgType:'phase',fn:fn,A:1,B:1,C:-C,D:0,
      hints:['y=f(x−C): desloca C unidades à direita quando C>0.','C = '+C+'°','Fase = '+C+'° à direita']};
  }
  if(type==='identify_params'){
    var A=_randInt(2,5),B=_randInt(2,4),D=_randInt(-3,3);
    var fn=['sen','cos'][_randInt(0,1)];
    return{statement:'Em y = '+A+'·'+fn+'('+B+'x) + '+D+', identifique amplitude, período e deslocamento vertical.',
      equation:'y = '+A+'·'+fn+'('+B+'x) + '+D,
      answer:'A='+A+', T='+Math.round(360/B)+'°, D='+D,tgType:'identify',fn:fn,A:A,B:B,C:0,D:D,
      hints:['Forma y=A·f(Bx+C)+D.','Amplitude=|A|='+A+'. Período=360°/B='+Math.round(360/B)+'°. Deslocamento=D='+D,'A='+A+', T='+Math.round(360/B)+'°, D='+D]};
  }
  // compose: given graph description, write equation
  var A=_randInt(2,5),T=_randInt(1,4)*90,fn=['sen','cos'][_randInt(0,1)];
  var B=360/T;
  return{statement:'Escreva a equação de um '+fn+' com amplitude '+A+' e período '+T+'°.',
    equation:'y = A·'+fn+'(Bx)',answer:'y = '+A+'·'+fn+'('+B+'x)',tgType:'compose',fn:fn,A:A,B:B,C:0,D:0,
    hints:['B = 360°/T = 360/'+T+' = '+B,'y = A·'+fn+'(Bx)','y = '+A+'·'+fn+'('+B+'x)']};
}
})();
