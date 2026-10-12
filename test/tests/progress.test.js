/** Progress state migration and persistence behavior. */
'use strict';

describe('progress — migration and reset', () => {
  beforeEach(() => localStorage.clear());

  it('migrates legacy topic progress without loss', () => {
    localStorage.setItem('euclides_progress', JSON.stringify({
      equations1: { conceptDone: true, exampleDone: true, practiceCount: 4, practiceCorrect: 3 },
    }));
    Progress.init();
    assert.equal(Progress.get('equations1').practiceCount, 4);
    assert.equal(Progress.accuracy('equations1'), 75);
    assert.equal(Progress.state().version, 2);
  });

  it('recovers safely from invalid JSON', () => {
    localStorage.setItem('euclides_progress', '{broken');
    Progress.init();
    assert.equal(Progress.state().version, 2);
    assert.equal(Progress.get('functions').practiceCount, 0);
  });

  it('resets progress while preserving preferences', () => {
    Progress.init();
    Progress.setPreference('reducedMotion', true);
    Progress.recordAttempt('functions', true, ['interpretar-funcao']);
    Progress.resetProgress();
    assert.equal(Progress.getPreference('reducedMotion'), true);
    assert.equal(Progress.get('functions').practiceCount, 0);
  });

  it('tracks resume position, favorites and mastery', () => {
    Progress.init();
    Progress.rememberTopic('functions', 'practice');
    Progress.toggleFavorite('functions');
    for (let i = 0; i < 8; i++) Progress.recordAttempt('functions', i < 7, ['funcoes']);
    assert.equal(Progress.state().lastTopic, 'functions');
    assert.equal(Progress.state().lastStep, 'practice');
    assert.ok(Progress.isFavorite('functions'));
    assert.equal(Progress.mastery('functions'), 'dominado');
  });
});
