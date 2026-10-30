/**
 * Pure task utilities.
 * These functions have no React dependencies, which makes them easy to test.
 */

// FILTER / SORT: never mutate the original array supplied by React state.
// Completed tasks stay hidden when the user has disabled them in settings.
export function getVisibleTasks(tasks, { showCompleted = false, sort = 'difficulty', query = '', status = 'all' } = {}) {
  const search = query.trim().toLowerCase();
  const visible = tasks.filter((task) => {
    if (!showCompleted && task.complete) return false;
    if (status === 'open' && task.complete) return false;
    if (status === 'complete' && !task.complete) return false;
    return !search || [task.text, task.assignee].some((value) => String(value || '').toLowerCase().includes(search));
  });

  // SORT ORDER: highest difficulty first; text and assignee alphabetically.
  return [...visible].sort((a, b) => {
    if (sort === 'difficulty') return Number(b.difficulty) - Number(a.difficulty) || String(a.text).localeCompare(String(b.text));
    if (sort === 'assignee') return String(a.assignee || '').localeCompare(String(b.assignee || ''));
    return String(a.text).localeCompare(String(b.text));
  });
}

// PAGINATION: safe even if there are zero tasks or the current page is too high.
export function paginate(items, page, pageItems) {
  const size = Number.isInteger(Number(pageItems)) && Number(pageItems) > 0 ? Number(pageItems) : 3;
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    currentPage,
    totalPages,
    items: items.slice((currentPage - 1) * size, currentPage * size),
  };
}
