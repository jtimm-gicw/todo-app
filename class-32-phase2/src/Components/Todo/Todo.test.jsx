/**
 * FILE: Todo.test.jsx
 * CLASS 32: Test the FULL app as the student uses it.
 *
 * "Deep mounting" means we render the Providers, App, Todo, List,
 * and the new SettingsForm together, not just one isolated function.
 *
 * PHASE 2 BEHAVIORS WE CHECK:
 * - App still adds and deletes tasks.
 * - Default page size is 3.
 * - Changing page size in Settings affects the task list.
 * - Switching to Settings does NOT erase tasks already added.
 * - Completed tasks can be hidden, shown, and marked unfinished again.
 * - A saved choice can be restored on the next app start.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from '../../App.jsx';
import SettingsProvider, { STORAGE_KEY } from '../../Context/Settings/Settings.jsx';

// STEP 1: The same Provider structure used by main.jsx.
// The real settings form and task list are part of this test.
function renderApp() {
  return render(
    <MantineProvider env="test">
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MantineProvider>
  );
}

// STEP 2: Simulate adding a task from the screen.
function addTask(name) {
  fireEvent.change(screen.getByRole('textbox', { name: 'To Do Item' }), {
    target: { value: name },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
}

// STEP 3: Click the top navigation to open the settings screen.
function openSettings() {
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
}

// STEP 4: Only return to Tasks after preferences are saved.
function openTasks() {
  fireEvent.click(screen.getByRole('button', { name: 'Tasks' }));
}

afterEach(() => {
  // STEP 5: Prevent one test's browser preferences affecting another.
  window.localStorage.clear();
});

describe('Class 32: Todo + editable Context settings', () => {
  it('starts with three tasks per page and hides completed tasks', () => {
    renderApp();
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('To Do List: 0 items pending');
    expect(screen.getByText(/Showing up to 3 tasks per page/)).toBeInTheDocument();

    ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'].forEach(addTask);
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('5 items pending');
    expect(within(screen.getByTestId('todo-list')).getAllByTestId('todo-card')).toHaveLength(3);

    // STEP 6: Pagination still works before the settings are changed.
    fireEvent.click(screen.getByRole('button', { name: /2/ }));
    expect(within(screen.getByTestId('todo-list')).getAllByTestId('todo-card')).toHaveLength(2);
  });

  it('keeps tasks and changes the number shown after saving page size', () => {
    renderApp();
    ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'].forEach(addTask);

    openSettings();

    // STEP 7: Update the new Mantine NumberInput from 3 to 2.
    fireEvent.change(screen.getByLabelText('Tasks per page'), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));

    // STEP 8: The preview reads the NEW saved Context value.
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('2');

    // STEP 9: Return to Tasks. The five existing tasks must remain.
    openTasks();
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('5 items pending');
    expect(within(screen.getByTestId('todo-list')).getAllByTestId('todo-card')).toHaveLength(2);
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });

  it('does not change the active settings before Save is clicked', () => {
    renderApp();
    openSettings();

    fireEvent.change(screen.getByLabelText('Tasks per page'), {
      target: { value: '6' },
    });

    // STEP 10: The form is only a DRAFT until Save is clicked.
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('3');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('shows completed tasks when the switch is enabled, then allows Undo', () => {
    renderApp();
    addTask('Complete this task');

    // STEP 11: First complete the task while showCompleted is false.
    fireEvent.click(screen.getByRole('button', { name: 'Mark Complete this task complete' }));
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('0 items pending');

    openSettings();

    // STEP 12: Switch the setting on and save it.
    fireEvent.click(screen.getByRole('switch', { name: /Show completed tasks/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Visible');

    openTasks();

    // STEP 13: The completed card is visible, even though none are pending.
    expect(screen.getByText('Complete this task')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // STEP 14: Click Undo to make the task incomplete again.
    fireEvent.click(screen.getByRole('button', { name: 'Mark Complete this task incomplete' }));
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('1 items pending');
  });

  it('restores previously saved settings when the app starts', () => {
    // STEP 15: Pretend the user saved settings yesterday.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pageItems: 2,
      showCompleted: true,
      sort: 'difficulty',
    }));
    renderApp();
    expect(screen.getByText(/Showing up to 2 tasks per page/)).toBeInTheDocument();

    ['A', 'B', 'C'].forEach(addTask);
    expect(within(screen.getByTestId('todo-list')).getAllByTestId('todo-card')).toHaveLength(2);
    openSettings();
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('2');
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Visible');
  });

  it('restores the defaults when Reset defaults is clicked', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pageItems: 6,
      showCompleted: true,
      sort: 'difficulty',
    }));

    renderApp();
    openSettings();
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('6');

    // STEP 16: Reset also saves the original preferences in Local Storage.
    fireEvent.click(screen.getByRole('button', { name: 'Reset defaults' }));
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('3');
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Hidden');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)).pageItems).toBe(3);
  });

  it('still deletes tasks from the list', () => {
    renderApp();
    addTask('Review Context');
    fireEvent.click(screen.getByRole('button', { name: 'Delete Review Context' }));
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('0 items pending');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
