/** Topic catalog contract and prerequisite graph. */
'use strict';

const fs = require('fs');
const path = require('path');
const topics = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'topics.json'), 'utf8'));
const ids = new Set(topics.map(topic => topic.id));

describe('catalog — editorial contract', () => {
  it('preserves 84 unique topics', () => {
    assert.equal(topics.length, 84);
    assert.equal(ids.size, 84);
  });

  it('declares required learning metadata for every topic', () => {
    const required = ['module','area','prerequisites','learningObjectives','estimatedMinutes','tags','misconceptions','lastReviewed','reviewStatus','references'];
    for (const topic of topics) for (const field of required) assert.ok(topic[field] !== undefined, topic.id + ' missing ' + field);
  });

  it('references existing prerequisites without cycles', () => {
    function visit(id, trail) {
      assert.notOk(trail.includes(id), 'cycle: ' + trail.concat(id).join(' -> '));
      const topic = topics.find(item => item.id === id);
      for (const dependency of topic.prerequisites) {
        assert.ok(ids.has(dependency), topic.id + ' unknown prerequisite ' + dependency);
        visit(dependency, trail.concat(id));
      }
    }
    for (const id of ids) visit(id, []);
  });
});
