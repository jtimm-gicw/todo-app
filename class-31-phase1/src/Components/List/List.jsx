/**
 * FILE: Components/List/List.jsx
 * PURPOSE: Decide which tasks are visible and show them as cards.
 *
 * CLASS 31 MAIN LAB:
 * - Read fixed display settings from Context.
 * - Hide completed tasks by default.
 * - Show THREE tasks per page.
 * - Use Mantine Pagination to move between pages.
 *
 * SPECIAL NOTE:
 * "list" is TASK DATA sent from Todo through props.
 * "pageItems", "showCompleted", and "sort" are DISPLAY SETTINGS
 * read from Context. They come from different places on purpose!
 */
import { useContext, useEffect, useState } from 'react';
import { ActionIcon, Badge, Button, Group, Pagination, Paper, Stack, Text } from '@mantine/core';
import { IconCheck, IconClipboardList, IconTrash } from '@tabler/icons-react';
import { SettingsContext } from '../../Context/Settings/Settings.jsx';

// STEP 1: Receive the task list and action functions from Todo.
// Props answer "What tasks do we have?" and "What happens on click?"
export default function List({ list, toggleComplete, deleteItem }) {
  // STEP 2: Read the display settings shared by SettingsProvider.
  // useContext() lets this component read settings directly.
  // No need to send these values through several other components.
  const { pageItems, showCompleted, sort } = useContext(SettingsContext);

  // STEP 3: Remember which page the user is viewing.
  // The first page is number 1, not number 0.
  const [page, setPage] = useState(1);

  // STEP 4: Filter the list BEFORE we split it into pages.
  // When showCompleted is false, only incomplete items remain.
  // filter() creates a NEW array and does not change list.
  const filteredItems = showCompleted
    ? [...list]
    : list.filter((item) => !item.complete);

  // STEP 5: OPTIONAL SORT STRETCH GOAL.
  // Our default sort setting is the word "difficulty".
  // Highest difficulty comes first. sort() changes an array,
  // so we sort filteredItems (a COPY), never React's original list.
  if (sort === 'difficulty') {
    filteredItems.sort((a, b) => b.difficulty - a.difficulty);
  }

  // STEP 6: Work out how many pages are needed.
  // Example: 7 incomplete tasks / 3 per page = 2.33.
  // Math.ceil() rounds UP, so we need 3 pages.
  const totalPages = Math.ceil(filteredItems.length / pageItems);

  // STEP 7: Keep the current page within the available range.
  // Example: the user is on page 2 but completes several tasks.
  // If page 2 no longer exists, switch back to the last valid page.
  const lastValidPage = Math.max(1, totalPages);
  const currentPage = Math.min(page, lastValidPage);

  useEffect(() => {
    if (page > lastValidPage) {
      setPage(lastValidPage);
    }
  }, [page, lastValidPage]);

  // STEP 8: Find the starting and ending positions in the array.
  // Page 1: start = 0, end = 3  → indexes 0, 1, 2.
  // Page 2: start = 3, end = 6  → indexes 3, 4, 5.
  const start = (currentPage - 1) * pageItems;
  const end = start + pageItems;

  // STEP 9: slice() keeps ONLY the tasks for the current page.
  // It does not change filteredItems.
  const visiblePageItems = filteredItems.slice(start, end);

  // STEP 10: Show a helpful message when no incomplete tasks remain.
  if (filteredItems.length === 0) {
    return (
      <Paper className="empty-state" p="xl" radius="lg" withBorder data-testid="empty-state">
        <IconClipboardList size={35} color="#7b56c8" aria-hidden="true" />
        <Text fw={700} mt="sm">No unfinished tasks right now!</Text>
        <Text size="sm" c="dimmed">
          Add a new task, or enjoy having a clear list.
        </Text>
      </Paper>
    );
  }

  // STEP 11: Make a card for each task on this page.
  return (
    <div data-testid="todo-list">
      <Text size="sm" c="dimmed" mb="md">
        {filteredItems.length} incomplete task{filteredItems.length === 1 ? '' : 's'}
        {' · '}Page {currentPage} of {totalPages}
      </Text>

      <Stack gap="md">
        {visiblePageItems.map((item) => (
          <Paper key={item.id} className="task-card" withBorder p="md" radius="lg" data-testid="todo-card">
            <Group align="flex-start" justify="space-between" wrap="nowrap" gap="sm">
              <div className="task-details">
                <Text fw={750} className="task-name">{item.text}</Text>
                <Group gap="xs" mt="sm">
                  <Badge color="teal" variant="light">Pending</Badge>
                  <Badge color={item.difficulty >= 4 ? 'pink' : 'blue'} variant="light">
                    Difficulty: {item.difficulty}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" mt="sm">
                  Assigned to: {item.assignee || 'Unassigned'}
                </Text>
              </div>

              <Group gap="xs" wrap="nowrap">
                {/*
                  STEP 12: The Complete button calls a function in Todo.jsx.
                  Once marked complete, this card disappears because the
                  Context setting showCompleted is false.
                */}
                <Button
                  size="xs"
                  variant="light"
                  color="teal"
                  leftSection={<IconCheck size={15} />}
                  aria-label={'Mark ' + item.text + ' complete'}
                  onClick={() => toggleComplete(item.id)}
                >
                  Done
                </Button>

                {/* STEP 13: Delete removes an item from Todo's array. */}
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  color="red"
                  aria-label={'Delete ' + item.text}
                  title={'Delete ' + item.text}
                  onClick={() => deleteItem(item.id)}
                >
                  <IconTrash size={17} />
                </ActionIcon>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>

      {/*
        STEP 14: Mantine Pagination draws the page buttons.
        It only appears when we have MORE than one page.
        value = current page number.
        onChange = tells React which page number was clicked.
        total = how many pages exist.
        The first/previous/next/last buttons are handled by Mantine.
      */}
      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={currentPage}
            onChange={setPage}
            total={totalPages}
            withEdges
            aria-label="Task pages"
          />
        </Group>
      )}
    </div>
  );
}
