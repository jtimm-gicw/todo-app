/**
 * Phase 1 tests: sorting, completed filtering, search, and pagination.
 */
import { describe, expect, it } from 'vitest';
import { getVisibleTasks, paginate } from './tasks';

const tasks = [
  { id: 'a', text: 'Write tests', assignee: 'Zoe', difficulty: 2, complete: false },
  { id: 'b', text: 'Build UI', assignee: 'Amy', difficulty: 5, complete: false },
  { id: 'c', text: 'Deploy API', assignee: 'Bob', difficulty: 4, complete: true },
  { id: 'd', text: 'Read docs', assignee: 'Eli', difficulty: 1, complete: false },
  { id: 'e', text: 'Fix styling', assignee: 'Jay', difficulty: 3, complete: false },
];

describe('task display logic', () => {
  it('hides completed items by default and sorts hardest first', () => {
    expect(getVisibleTasks(tasks).map((task) => task.id)).toEqual(['b', 'e', 'a', 'd']);
    expect(tasks[0].id).toBe('a'); // The original list was not mutated.
  });

  it('can display completed items when the setting is enabled', () => {
    expect(getVisibleTasks(tasks, { showCompleted: true }).length).toBe(5);
  });

  it('sorts by assignee and searches task text', () => {
    const sorted = getVisibleTasks(tasks, { sort: 'assignee' });
    expect(sorted[0].assignee).toBe('Amy');
    expect(getVisibleTasks(tasks, { query: 'STYLE' }).map((item) => item.id)).toEqual(['e']);
  });

  it('supports 3 per page and clamps invalid pages', () => {
    const visible = getVisibleTasks(tasks);
    expect(paginate(visible, 1, 3).items.length).toBe(3);
    expect(paginate(visible, 2, 3).items.length).toBe(1);
    expect(paginate(visible, 200, 3).currentPage).toBe(2);
    expect(paginate([], 1, 3).totalPages).toBe(1);
    expect(paginate(visible, 1, 0).items.length).toBe(3);
  });
});
