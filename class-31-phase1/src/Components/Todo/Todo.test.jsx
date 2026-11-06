/**
 * FILE: Todo.test.jsx
 * PURPOSE: Check the behavior of the FULL app, including child components.
 *
 * "Deep mount" means we render:
 * MantineProvider → SettingsProvider → App → Todo → List.
 *
 * We test context, adding, pagination, hiding completed items, and deletion.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from '../../App.jsx';
import SettingsProvider from '../../Context/Settings/Settings.jsx';

// STEP 1: Build the same Provider structure used in main.jsx.
function renderApp() {
  return render(
    <MantineProvider env="test">
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MantineProvider>
  );
}

// STEP 2: Type and submit one task just as a student would.
function addTask(name) {
  fireEvent.change(screen.getByRole('textbox', { name: 'To Do Item' }), {
    target: { value: name },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
}

describe('Class 31 Todo app', () => {
  it('shows the starter header and the Context page size', () => {
    renderApp();
    expect(screen.getByTestId('todo-header')).toBeInTheDocument();
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('To Do List: 0 items pending');
    expect(screen.getByText(/Showing up to 3 unfinished tasks per page/)).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('adds tasks and displays no more than 3 on the first page', () => {
    renderApp();
    ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'].forEach(addTask);
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('5 items pending');
    const cards = within(screen.getByTestId('todo-list')).getAllByTestId('todo-card');
    expect(cards).toHaveLength(3);
    expect(screen.getByText('Task A')).toBeInTheDocument();
    expect(screen.queryByText('Task E')).not.toBeInTheDocument();
  });

  it('shows remaining items when the student goes to page 2', () => {
    renderApp();
    ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'].forEach(addTask);
    // STEP 3: Select page 2 in Mantine Pagination.
    fireEvent.click(screen.getByRole('button', { name: /2/ }));
    const cards = within(screen.getByTestId('todo-list')).getAllByTestId('todo-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Task D')).toBeInTheDocument();
    expect(screen.getByText('Task E')).toBeInTheDocument();
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
  });

  it('hides completed tasks automatically', () => {
    renderApp();
    addTask('Finish homework');
    // STEP 4: Completed cards disappear because showCompleted=false.
    fireEvent.click(screen.getByRole('button', { name: 'Mark Finish homework complete' }));
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('0 items pending');
    expect(screen.queryByText('Finish homework')).not.toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('deletes a task', () => {
    renderApp();
    addTask('Practice React');
    fireEvent.click(screen.getByRole('button', { name: 'Delete Practice React' }));
    expect(screen.getByTestId('todo-h1')).toHaveTextContent('0 items pending');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
