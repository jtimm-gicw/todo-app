/**
 * FILE: List.test.jsx
 * PURPOSE: Test List by itself using known task data.
 * This checks Context filtering and sorting independently of the form.
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import List from './List.jsx';
import SettingsProvider from '../../Context/Settings/Settings.jsx';

// STEP 1: Pretend we already have tasks with different difficulty values.
const sampleTasks = [
  { id: '1', text: 'Easy task', assignee: 'Lee', difficulty: 1, complete: false },
  { id: '2', text: 'Hard task', assignee: 'Jo', difficulty: 5, complete: false },
  { id: '3', text: 'Completed task', assignee: 'Sam', difficulty: 4, complete: true },
  { id: '4', text: 'Medium task', assignee: 'Pat', difficulty: 3, complete: false },
  { id: '5', text: 'Another task', assignee: 'Kim', difficulty: 2, complete: false },
];

// STEP 2: Wrap List in the settings Provider and the Mantine Provider.
function renderList() {
  return render(
    <MantineProvider env="test">
      <SettingsProvider>
        <List list={sampleTasks} toggleComplete={vi.fn()} deleteItem={vi.fn()} />
      </SettingsProvider>
    </MantineProvider>
  );
}

describe('List with Context', () => {
  it('hides completed tasks and shows only three cards', () => {
    renderList();
    const cards = within(screen.getByTestId('todo-list')).getAllByTestId('todo-card');
    expect(cards).toHaveLength(3);
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
  });

  it('sorts tasks hardest-first using the default difficulty word', () => {
    renderList();
    const cards = within(screen.getByTestId('todo-list')).getAllByTestId('todo-card');
    // Difficulty 5 first, then 3, then 2.
    expect(within(cards[0]).getByText('Hard task')).toBeInTheDocument();
    expect(within(cards[1]).getByText('Medium task')).toBeInTheDocument();
    expect(within(cards[2]).getByText('Another task')).toBeInTheDocument();
  });

  it('does not change the original tasks while sorting', () => {
    renderList();
    expect(sampleTasks[0].text).toBe('Easy task');
  });
});
