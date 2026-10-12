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
});
