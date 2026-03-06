/**
 * ui.js
 * Single responsibility: build and update DOM components.
 * No math logic. No routing. No Canvas.
 */

var UI = (function () {

  // Cache the topics list loaded at boot
  var _topics = [];

  return {

    setTopics: function(topics) { _topics = topics; },

    // Render overall progress bar (above nav)
    renderProgressBar: function() {
      var wrap = document.getElementById('progress-bar-wrap');
      if (!wrap) return;
      var total     = _topics.filter(function(t){ return t.status === 'available'; }).length;
      var practiced = _topics.filter(function(t){
        return t.status === 'available' && Progress.get(t.id).practiceCount > 0;
      }).length;
      var pct = total ? Math.round(practiced / total * 100) : 0;
      wrap.innerHTML =
        '<div class="prog-bar-row">' +
          '<span class="prog-label">Progresso</span>' +
          '<span class="prog-value">' + practiced + '\u200a/\u200a' + total + '</span>' +
        '</div>' +
        '<div class="prog-bar-track">' +
          '<div class="prog-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>';
    },

    // Render sidebar navigation from topics array
    renderSidebar: function(activeId) {
      var nav = document.getElementById('topic-nav');
      if (!nav) return;
      this.renderProgressBar();

      var levels = [
        { key: 'EFI',  label: 'Fundamental I'  },
        { key: 'EFII', label: 'Fundamental II' },
        { key: 'EM',   label: 'Ensino Médio'   },
        { key: 'ES',   label: 'Ensino Superior' },
      ];

      function renderItem(t) {
        var cls = 'nav-item';
        if (t.id === activeId) cls += ' active';
        if (t.status === 'coming-soon') cls += ' coming-soon';
        var onclick = t.status === 'available'
          ? 'onclick="Router.navigate(\'topic/' + t.id + '/concept\')"'
          : '';
        var badge = t.status === 'coming-soon' ? '<span class="nav-badge">em breve</span>' : '';
        var acc = Progress.accuracy(t.id);
        if (acc >= 0 && t.status === 'available') {
          badge = '<span class="nav-badge">' + acc + '%</span>';
        }
        return '<button class="' + cls + '" ' + onclick + '>'
          + '<span class="text-mono text-gold" style="width:22px;text-align:center;font-size:11px">' + t.symbol + '</span>'
          + '<span>' + t.title + '</span>'
          + badge
          + '</button>';
      }

      var html = '';
      levels.forEach(function(lv) {
        var group = _topics.filter(function(t) { return t.level === lv.key; });
        if (!group.length) return;
        html += '<div class="nav-section-label">' + lv.label + '</div>';

        if (lv.key === 'ES') {
          // Group ES topics by their 'group' field
          var subgroups = [];
          var seen = {};
          group.forEach(function(t) {
            var g = t.group || 'Outros';
            if (!seen[g]) { seen[g] = true; subgroups.push(g); }
          });
          subgroups.forEach(function(sg) {
            html += '<div class="nav-subgroup-label">' + sg + '</div>';
            group.filter(function(t){ return (t.group||'Outros') === sg; })
              .forEach(function(t){ html += renderItem(t); });
          });
        } else {
          group.forEach(function(t){ html += renderItem(t); });
        }
      });

      nav.innerHTML = html;
    },

    // Render phase bar (Conceito / Exemplo / Prática)
    renderPhaseBar: function(topicId, activePhase) {
      var phases = [
        { id: 'concept',  label: 'Conceito'  },
        { id: 'example',  label: 'Exemplo'   },
        { id: 'practice', label: 'Prática'   }
      ];
      var p = Progress.get(topicId);
      var html = '<div class="phase-bar">';
      phases.forEach(function(ph) {
        var cls = 'phase-step';
        if (ph.id === activePhase) cls += ' active';
        else if (
          (ph.id === 'example'  && p.conceptDone) ||
          (ph.id === 'practice' && p.exampleDone)
        ) cls += ' done';
        html += '<div class="' + cls + '" onclick="Router.navigate(\'topic/' + topicId + '/' + ph.id + '\')">'
          + ph.label + '</div>';
      });
      html += '</div>';
      return html;
    },

    // Render a simple breadcrumb
    renderBreadcrumb: function(parts) {
      // parts: [{label, href?}]
      var html = '<div class="breadcrumb">';
      parts.forEach(function(p, i) {
        if (i > 0) html += '<span class="sep">/</span>';
        if (p.href) html += '<span onclick="Router.navigate(\'' + p.href + '\')">' + p.label + '</span>';
        else html += '<span class="current">' + p.label + '</span>';
      });
      html += '</div>';
      return html;
    },

    // Show a status message in #view (used by router when topic not found)
    showError: function(msg) {
      var v = document.getElementById('view');
      if (v) v.innerHTML = '<div style="padding:48px 32px;color:var(--text-dim);font-family:var(--font-mono)">' + msg + '</div>';
    }

  };
})();
