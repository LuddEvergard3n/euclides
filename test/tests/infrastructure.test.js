/** Static delivery, lazy-loading and known-content regression checks. */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');

function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }

describe('delivery — static and lazy', () => {
  it('does not load topic modules in the initial document', () => {
    const html = read('index.html');
    assert.notOk(/<script[^>]+src=["']modules\//i.test(html), 'topic module loaded eagerly');
    assert.ok(/modules\/['"]?\s*\+\s*topicId/.test(read('js/router.js')), 'native lazy loader missing');
  });

  it('keeps initial application JavaScript below 250 KB', () => {
    const html = read('index.html');
    const sources = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1].split('?')[0]);
    const bytes = sources.reduce((sum, source) => sum + fs.statSync(path.join(root, source)).size, 0);
    assert.ok(bytes < 250 * 1024, 'initial JavaScript is ' + Math.round(bytes / 1024) + ' KB');
  });

  it('loads generator files on demand', () => {
    const html = read('index.html');
    assert.notOk(/<script[^>]+src=["']math\/generators\//i.test(html), 'generator loaded eagerly');
    assert.ok(read('js/generator-loader.js').includes("'batch4'"), 'generator catalog incomplete');
  });

  it('precache entries exist and exclude topic modules', () => {
    const source = read('sw.js');
    const urls = [...source.matchAll(/['"](\.\/[^'"]+)['"]/g)].map(match => match[1]);
    for (const url of urls) assert.ok(fs.existsSync(path.join(root, url.slice(2))), 'missing precache asset ' + url);
    assert.notOk(urls.some(url => url.startsWith('./modules/')), 'topic modules must be cached on demand');
  });

  it('keeps hash routes for the public application areas', () => {
    const source = read('js/router.js');
    for (const route of ['catalog','practice','exam','progress','reference']) assert.ok(source.includes("route === '" + route + "'") || source.includes("route === 'review' || route === 'practice'"), 'missing route ' + route);
  });

  it('uses the central validator for learner answers', () => {
    for (const directory of ['js', 'modules']) {
      for (const name of fs.readdirSync(path.join(root, directory)).filter(file => file.endsWith('.js'))) {
        const source = read(directory + '/' + name);
        const permissive = source.split(/\r?\n/).some(line => line.includes('parseFloat(') && (line.includes('answer-input') || line.includes('.value')));
        assert.notOk(permissive, directory + '/' + name + ' parses learner input permissively');
      }
    }
  });
});

describe('content — known notation regressions', () => {
  it('contains none of the audited notation and spelling errors', () => {
    const files = fs.readdirSync(path.join(root, 'modules')).filter(name => name.endsWith('.js'))
      .concat(fs.readdirSync(path.join(root, 'math', 'generators')).filter(name => name.endsWith('.js')).map(name => '../math/generators/' + name));
    const banned = ['∯', '\\u222f', '0≤1≤1', 'probaüilidade', 'solucão', 'post(A)', 'Aeˣ²/²'];
    for (const file of files) {
      const source = file.startsWith('../') ? read(file.slice(3)) : read('modules/' + file);
      for (const token of banned) assert.notOk(source.includes(token), file + ' contains ' + token);
    }
  });

  it('keeps discrete Poisson content out of the continuous-distributions topic', () => {
    assert.notOk(/Poisson/.test(read('modules/distributions.js')), 'continuous lesson contains Poisson');
    const source = read('math/generators/ode_prob.js');
    const section = source.slice(source.indexOf("MathGenerators['distributions']"), source.indexOf("MathGenerators['inference']"));
    assert.notOk(/poisson/i.test(section), 'continuous generator contains Poisson');
  });
});
