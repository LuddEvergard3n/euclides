/** Euclides 5 task contract. */
'use strict';

describe('task engine — legacy compatibility', () => {
  it('normalises a generated exercise into the shared task contract', () => {
    const task = MathCore.generateExercise('functions', 3);
    ['id','type','prompt','data','answer','validation','difficulty','skills','misconceptionId','hintSteps','solutionSteps'].forEach(field => {
      assert.ok(Object.prototype.hasOwnProperty.call(task, field), 'missing ' + field);
    });
    assert.equal(task.difficulty, 3);
    assert.ok(task.skills.includes('functions'));
  });

  it('infers common answer types deterministically', () => {
    assert.equal(TaskEngine.inferType('12'), 'number');
    assert.equal(TaskEngine.inferType('3/4'), 'fraction');
    assert.equal(TaskEngine.inferType('25%'), 'percentage');
    assert.equal(TaskEngine.inferType('2 ou -2'), 'multiple-answer');
    assert.equal(TaskEngine.inferType('2x + 1'), 'symbolic');
  });

  it('preserves single-choice tasks and renders native radio controls', () => {
    const task = TaskEngine.normalise({ statement: 'Escolha.', answer: '2', choices: ['1', '2', '<3>'], hints: [] }, 'sample', 1);
    assert.equal(task.type, 'single-choice');
    assert.deepEqual(task.choices, ['1', '2', '<3>']);
    const html = TaskInput.render(task, 'sample-input');
    assert.match(html, /type="radio"/);
    assert.match(html, /&lt;3&gt;/);
    assert.notOk(html.includes('<3>'), 'choice labels must be escaped');
  });
});
