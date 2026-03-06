/**
 * renderer.js
 * Single responsibility: draw mathematical objects on Canvas 2D.
 * No DOM manipulation outside the canvas. No math logic. No routing.
 *
 * Coordinate convention: canvas centre = (0, 0) in math space.
 * Pixel = math * scale + origin.
 */

var Renderer = (function () {

  // ── State ────────────────────────────────────────────────────────
  var _canvas = null;
  var _ctx    = null;

  // Viewport transform: maps math coords → canvas pixels
  var _origin = { x: 0, y: 0 };  // canvas pixel at math (0, 0)
  var _scale  = 40;               // pixels per unit

  // Pan state
  var _panStart  = null;
  var _originAtPanStart = null;

  // Colours imported from CSS tokens (duplicated here for canvas use)
  var C = {
    bg:       '#0c0c10',
    surface:  '#13131c',
    grid:     '#22223a',
    gridMaj:  '#2e2e4a',
    axis:     '#3e3e58',
    axisNum:  '#72728c',
    gold:     '#c8a44a',
    teal:     '#4ab8b2',
    text:     '#e8e8f2',
    muted:    '#72728c',
    green:    '#4e9e70',
    red:      '#c45252',
    blue:     '#5a8fd2',
  };

  // ── Init ─────────────────────────────────────────────────────────

  function init(canvasEl) {
    _canvas = canvasEl;
    _ctx    = canvasEl.getContext('2d');
    _origin = { x: canvasEl.width / 2, y: canvasEl.height / 2 };
    _scale  = 40;
    _attachPan();
  }

  // ── Coordinate helpers ───────────────────────────────────────────

  function mathToPixel(mx, my) {
    return {
      x: _origin.x + mx * _scale,
      y: _origin.y - my * _scale,   // Y axis is inverted in canvas
    };
  }

  function pixelToMath(px, py) {
    return {
      x: (px - _origin.x) / _scale,
      y: -((py - _origin.y) / _scale),
    };
  }

  // ── Pan interaction ──────────────────────────────────────────────

  function _attachPan() {
    _canvas.addEventListener('mousedown', function (e) {
      _panStart = { x: e.clientX, y: e.clientY };
      _originAtPanStart = { x: _origin.x, y: _origin.y };
      _canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!_panStart) return;
      _origin.x = _originAtPanStart.x + (e.clientX - _panStart.x);
      _origin.y = _originAtPanStart.y + (e.clientY - _panStart.y);
      // Redraw is caller's responsibility (module calls draw in RAF)
    });

    window.addEventListener('mouseup', function () {
      _panStart = null;
      if (_canvas) _canvas.style.cursor = 'grab';
    });

    _canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.1 : 0.9;
      // Zoom toward mouse position
      var rect = _canvas.getBoundingClientRect();
      var mx   = e.clientX - rect.left;
      var my   = e.clientY - rect.top;
      _origin.x = mx + (_origin.x - mx) * factor;
      _origin.y = my + (_origin.y - my) * factor;
      _scale   *= factor;
    }, { passive: false });

    _canvas.style.cursor = 'grab';
  }

  // ── Core drawing ─────────────────────────────────────────────────

  function clear() {
    _ctx.fillStyle = C.bg;
    _ctx.fillRect(0, 0, _canvas.width, _canvas.height);
  }

  /**
   * Draw X and Y axes with numeric labels and grid lines.
   * @param {boolean} showGrid - draw minor grid lines
   * @param {boolean} showLabels - draw unit numbers on axes
   */
  function drawAxes(showGrid, showLabels) {
    var W = _canvas.width, H = _canvas.height;
    var ox = _origin.x, oy = _origin.y;

    // Determine visible math range
    var mathLeft   = pixelToMath(0,   0).x;
    var mathRight  = pixelToMath(W,   0).x;
    var mathTop    = pixelToMath(0,   0).y;
    var mathBottom = pixelToMath(0,   H).y;

    // Choose grid step that keeps ~8–12 lines visible
    var rawStep = (mathRight - mathLeft) / 10;
    var step    = Math.pow(10, Math.floor(Math.log10(rawStep)));
    if (rawStep / step > 5) step *= 5;
    else if (rawStep / step > 2) step *= 2;

    var minorStep = step / 5;

    // Minor grid
    if (showGrid) {
      _ctx.strokeStyle = C.grid;
      _ctx.lineWidth   = 0.5;
      _ctx.beginPath();
      for (var mx = Math.ceil(mathLeft / minorStep) * minorStep; mx <= mathRight; mx += minorStep) {
        var px = mathToPixel(mx, 0).x;
        _ctx.moveTo(px, 0); _ctx.lineTo(px, H);
      }
      for (var my = Math.ceil(mathBottom / minorStep) * minorStep; my <= mathTop; my += minorStep) {
        var py = mathToPixel(0, my).y;
        _ctx.moveTo(0, py); _ctx.lineTo(W, py);
      }
      _ctx.stroke();
    }

    // Major grid
    _ctx.strokeStyle = C.gridMaj;
    _ctx.lineWidth   = 0.5;
    _ctx.beginPath();
    for (var mx2 = Math.ceil(mathLeft / step) * step; mx2 <= mathRight; mx2 += step) {
      var px2 = mathToPixel(mx2, 0).x;
      _ctx.moveTo(px2, 0); _ctx.lineTo(px2, H);
    }
    for (var my2 = Math.ceil(mathBottom / step) * step; my2 <= mathTop; my2 += step) {
      var py2 = mathToPixel(0, my2).y;
      _ctx.moveTo(0, py2); _ctx.lineTo(W, py2);
    }
    _ctx.stroke();

    // Axes
    _ctx.strokeStyle = C.axis;
    _ctx.lineWidth   = 1.5;
    _ctx.beginPath();
    // X axis
    _ctx.moveTo(0, oy); _ctx.lineTo(W, oy);
    // Y axis
    _ctx.moveTo(ox, 0); _ctx.lineTo(ox, H);
    _ctx.stroke();

    // Axis arrows
    _ctx.fillStyle = C.axis;
    _arrowHead(W - 6, oy, 'right');
    _arrowHead(ox, 6, 'up');

    // Axis labels
    _ctx.fillStyle = C.muted;
    _ctx.font = '12px JetBrains Mono, monospace';
    _ctx.fillText('x', W - 20, oy - 8);
    _ctx.fillText('y', ox + 8, 18);

    // Numeric labels
    if (showLabels) {
      _ctx.fillStyle = C.axisNum;
      _ctx.font      = '11px JetBrains Mono, monospace';
      _ctx.textAlign = 'center';

      for (var lx = Math.ceil(mathLeft / step) * step; lx <= mathRight; lx += step) {
        if (Math.abs(lx) < step * 0.01) continue; // skip 0
        var lxPx = mathToPixel(lx, 0);
        _ctx.fillText(_fmtNum(lx), lxPx.x, oy + 16);
      }

      _ctx.textAlign = 'right';
      for (var ly = Math.ceil(mathBottom / step) * step; ly <= mathTop; ly += step) {
        if (Math.abs(ly) < step * 0.01) continue;
        var lyPx = mathToPixel(0, ly);
        _ctx.fillText(_fmtNum(ly), ox - 6, lyPx.y + 4);
      }

      // Origin label
      _ctx.textAlign = 'right';
      _ctx.fillText('0', ox - 6, oy + 15);
    }

    _ctx.textAlign = 'left'; // reset
  }

  /**
   * Plot a function f(x) as a continuous line.
   * @param {function} f - f(x) → y in math units
   * @param {string}   color
   * @param {number}   lineWidth
   */
  function plotFunction(f, color, lineWidth) {
    var W     = _canvas.width;
    var steps = W * 2; // sub-pixel precision
    var dx    = _canvas.width / steps;

    _ctx.strokeStyle = color || C.gold;
    _ctx.lineWidth   = lineWidth || 2;
    _ctx.beginPath();

    var started = false;
    for (var i = 0; i <= steps; i++) {
      var px = i * dx;
      var mx = pixelToMath(px, 0).x;
      var my = f(mx);

      if (!isFinite(my) || Math.abs(my) > 1e6) { started = false; continue; }

      var py = mathToPixel(mx, my).y;
      if (!started) { _ctx.moveTo(px, py); started = true; }
      else           { _ctx.lineTo(px, py); }
    }
    _ctx.stroke();
  }

  /**
   * Draw a point (dot) at math coords.
   */
  function drawPoint(mx, my, color, radius, label) {
    var p = mathToPixel(mx, my);
    _ctx.beginPath();
    _ctx.arc(p.x, p.y, radius || 5, 0, Math.PI * 2);
    _ctx.fillStyle   = color || C.gold;
    _ctx.fill();
    _ctx.strokeStyle = C.bg;
    _ctx.lineWidth   = 1.5;
    _ctx.stroke();

    if (label) {
      _ctx.fillStyle = color || C.gold;
      _ctx.font      = '11px JetBrains Mono, monospace';
      _ctx.fillText(label, p.x + 8, p.y - 8);
    }
  }

  /**
   * Draw a number-line on the horizontal axis showing a root (zero crossing).
   * Used for visualising equation solutions.
   * @param {number[]} roots
   */
  function drawRootsOnAxis(roots, color) {
    roots.forEach(function (r) {
      var p = mathToPixel(r, 0);
      // Tick mark
      _ctx.strokeStyle = color || C.teal;
      _ctx.lineWidth   = 2;
      _ctx.beginPath();
      _ctx.moveTo(p.x, p.y - 8);
      _ctx.lineTo(p.x, p.y + 8);
      _ctx.stroke();

      // Label
      _ctx.fillStyle = color || C.teal;
      _ctx.font      = '12px JetBrains Mono, monospace';
      _ctx.textAlign = 'center';
      _ctx.fillText('x = ' + _fmtNum(r), p.x, p.y + 24);
      _ctx.textAlign = 'left';
    });
  }

  /**
   * Highlight a vertical region between two x values (e.g., between roots).
   */
  function drawXRegion(x1, x2, color) {
    var p1 = mathToPixel(x1, 0).x;
    var p2 = mathToPixel(x2, 0).x;
    _ctx.fillStyle = color || 'rgba(200,164,74,0.08)';
    _ctx.fillRect(Math.min(p1, p2), 0, Math.abs(p2 - p1), _canvas.height);
  }

  /**
   * Draw a text label at math coordinates.
   */
  function drawLabel(mx, my, text, color, size) {
    var p = mathToPixel(mx, my);
    _ctx.fillStyle = color || C.text;
    _ctx.font      = (size || 13) + 'px JetBrains Mono, monospace';
    _ctx.fillText(text, p.x, p.y);
  }

  /**
   * Draw a dashed vertical line at x = mx.
   */
  function drawVerticalLine(mx, color) {
    var px = mathToPixel(mx, 0).x;
    _ctx.save();
    _ctx.setLineDash([4, 4]);
    _ctx.strokeStyle = color || C.muted;
    _ctx.lineWidth   = 1;
    _ctx.beginPath();
    _ctx.moveTo(px, 0);
    _ctx.lineTo(px, _canvas.height);
    _ctx.stroke();
    _ctx.restore();
  }

  // ── Equation step renderer (no axes — pure text layout) ─────────

  /**
   * Render a step-by-step equation transformation on a blank canvas.
   * steps: [{ equation: string, note: string }]
   * activeIdx: which step is currently highlighted
   */
  /**
   * Render step-by-step equation walkthrough on a blank canvas.
   * lineH is computed dynamically so all steps fit the canvas height.
   * Note sits on its own sub-row below the equation.
   */
  /**
   * Render step-by-step equation walkthrough.
   * Font size auto-shrinks so no equation ever overflows the canvas width.
   * Note sits on its own sub-row below the equation.
   */
  function drawEquationSteps(steps, activeIdx) {
    clear();
    if (!steps || steps.length === 0) return;

    var n       = steps.length;
    var margin  = 14;
    var lineH   = Math.max(40, Math.floor((_canvas.height - margin * 2) / n));
    var eqOff   = Math.round(lineH * 0.40);
    var noteOff = Math.round(lineH * 0.72);
    var startY  = margin;
    var maxW    = _canvas.width - 16;  // max usable width for equation text
    var cx      = _canvas.width / 2;

    // Helper: pick the largest font size (from sizeMax down) at which text fits maxW.
    function _fitFont(text, sizeMax, bold) {
      for (var sz = sizeMax; sz >= 8; sz--) {
        _ctx.font = (bold ? 'bold ' : '') + sz + 'px JetBrains Mono, monospace';
        if (_ctx.measureText(text).width <= maxW) return sz;
      }
      return 8;
    }

    steps.forEach(function (step, i) {
      var top    = startY + i * lineH;
      var active = (i === activeIdx);
      var done   = (i <  activeIdx);

      // Active row background + accent bar
      if (active) {
        _ctx.fillStyle = 'rgba(200,164,74,0.07)';
        _ctx.fillRect(0, top, _canvas.width, lineH);
        _ctx.fillStyle = C.gold;
        _ctx.fillRect(0, top, 3, lineH);
      }

      // Equation — auto-sized, centred
      var eqSize = _fitFont(step.equation, active ? 14 : 12, false);
      _ctx.font      = eqSize + 'px JetBrains Mono, monospace';
      _ctx.fillStyle = active ? C.gold : (done ? C.green : C.muted);
      _ctx.textAlign = 'center';
      _ctx.fillText(step.equation, cx, top + eqOff);

      // Note — fixed small size, left-aligned, clipped if needed
      if (step.note) {
        var noteSize = _fitFont(step.note, 10, false);
        _ctx.font      = noteSize + 'px JetBrains Mono, monospace';
        _ctx.fillStyle = active ? C.muted : C.axisNum;
        _ctx.textAlign = 'left';
        _ctx.fillText(step.note, 10, top + noteOff);
      }
    });

    _ctx.textAlign = 'left';
  }

  // ── Internal utilities ───────────────────────────────────────────

  function _arrowHead(px, py, dir) {
    var s = 6;
    _ctx.beginPath();
    if (dir === 'right') {
      _ctx.moveTo(px, py - s / 2);
      _ctx.lineTo(px + s, py);
      _ctx.lineTo(px, py + s / 2);
    } else if (dir === 'up') {
      _ctx.moveTo(px - s / 2, py);
      _ctx.lineTo(px, py - s);
      _ctx.lineTo(px + s / 2, py);
    }
    _ctx.closePath();
    _ctx.fill();
  }

  function _fmtNum(n) {
    // Show integers without decimals, round floats to 2dp
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');
  }

  /**
   * Draw a vector arrow from math coords (x1,y1) to (x2,y2). Arrowhead at tip.
   */
  function drawArrow(x1, y1, x2, y2, color) {
    var p1 = mathToPixel(x1, y1), p2 = mathToPixel(x2, y2);
    color = color || '#c8a44a';
    _ctx.strokeStyle = color; _ctx.lineWidth = 2;
    _ctx.beginPath(); _ctx.moveTo(p1.x, p1.y); _ctx.lineTo(p2.x, p2.y); _ctx.stroke();
    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x), size = 9;
    _ctx.fillStyle = color;
    _ctx.beginPath();
    _ctx.moveTo(p2.x, p2.y);
    _ctx.lineTo(p2.x - size*Math.cos(angle - Math.PI/6), p2.y - size*Math.sin(angle - Math.PI/6));
    _ctx.lineTo(p2.x - size*Math.cos(angle + Math.PI/6), p2.y - size*Math.sin(angle + Math.PI/6));
    _ctx.closePath(); _ctx.fill();
  }

    // ── Public API ───────────────────────────────────────────────────

  return {
    init:              init,
    clear:             clear,
    drawAxes:          drawAxes,
    plotFunction:      plotFunction,
    drawPoint:         drawPoint,
    drawRootsOnAxis:   drawRootsOnAxis,
    drawXRegion:       drawXRegion,
    drawLabel:         drawLabel,
    drawVerticalLine:  drawVerticalLine,
    drawArrow:         drawArrow,
    drawEquationSteps: drawEquationSteps,
    mathToPixel:       mathToPixel,
    pixelToMath:       pixelToMath,
    canvas:            function() { return _canvas; },
    ctx:               function() { return _ctx; },
    width:             function() { return _canvas ? _canvas.width  : 0; },
    height:            function() { return _canvas ? _canvas.height : 0; },
  };

})();
