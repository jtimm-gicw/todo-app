/**
 * FILE: Components/List/List.jsx
 * CLASS 32 — PHASE 2: RESPOND TO USER DISPLAY SETTINGS
 *
 * WHAT CHANGED FROM PHASE 1?
 * Phase 1 read FIXED settings from Context.
 * Phase 2 reads EDITABLE settings from the same Context.
 * As soon as the student saves new settings, the visible list changes.
 *
 * SIMPLE DEFINITIONS:
 * - Props = information Todo hands directly to List.
 * - Context = shared settings List can read without props.
 * - filter() = keep only items that match a rule.
 * - slice() = take one section of an array.
 * - Pagination = numbered buttons used to move between pages.
 */
import { useContext, useEffect, useState } from 'react';
import {
  ActionIcon, Badge, Button, Group, Pagination,
  Paper, Stack, Text,
} from '@mantine/core';
import { IconCheck, IconClipboardList, IconRotate, IconTrash } from '@tabler/icons-react';
import { SettingsContext } from '../../Context/Settings/Settings.jsx';

// STEP 1: Receive TASK DATA and CLICK FUNCTIONS from Todo.
// These are props; settings themselves are NOT passed as props.
export default function List({ list, toggleComplete, deleteItem }) {
  // STEP 2: Read the LATEST shared settings from Context.
  // React will redraw List whenever the Provider saves new values.
  const { pageItems, showCompleted, sort } = useContext(SettingsContext);

  // STEP 3: Remember which page the user is on.
  // We start on page 1.
  const [page, setPage] = useState(1);

  // STEP 4: Decide whether completed tasks should be included.
  // If the switch is ON (true), copy all tasks.
  // If it is OFF (false), keep only tasks that are NOT complete.
  // We always work on a NEW array instead of changing React state.
  const filteredItems = showCompleted
    ? [...list]
    : list.filter((item) => !item.complete);

  // STEP 5: OPTIONAL SORTING STRETCH GOAL.
  // "difficulty" is still the default sort word in Phase 2.
  // Highest difficulty comes first. A copy avoids changing list.
  if (sort === 'difficulty') {
    filteredItems.sort((a, b) => b.difficulty - a.difficulty);
  } else if (sort === 'text') {
    filteredItems.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sort === 'assignee') {
    filteredItems.sort((a, b) => a.assignee.localeCompare(b.assignee));
  }

  // STEP 6: Count the number of pages we need.
  // Example: 5 tasks / 2 per page = 2.5.
  // Math.ceil() rounds UP so we have 3 pages.
  const totalPages = Math.ceil(filteredItems.length / pageItems);

  // STEP 7: Change back to page 1 when the user saves NEW settings.
  // Example: the user was on page 3 but changed the size to 5.
  // Starting again on page 1 keeps the result easy to understand.
  useEffect(() => {
    setPage(1);
  }, [pageItems, showCompleted]);

  // STEP 8: If items are completed or deleted, an old page might
  // no longer exist. Stay on the final available page instead.
  const lastValidPage = Math.max(1, totalPages);
  const currentPage = Math.min(page, lastValidPage);

  useEffect(() => {
    if (page > lastValidPage) setPage(lastValidPage);
  }, [page, lastValidPage]);

  // STEP 9: Find the part of the array for the chosen page.
  // With 2 per page:
  // Page 1 → start 0, end 2 (items 0 and 1).
  // Page 2 → start 2, end 4 (items 2 and 3).
  const start = (currentPage - 1) * pageItems;
  const end = start + pageItems;

  // STEP 10: Take just the tasks that belong on this page.
  const visiblePageItems = filteredItems.slice(start, end);

  // STEP 11: Display a friendly message if the list has no matches.
  // For example, the user finished every task and hides completed ones.
  if (filteredItems.length === 0) {
    return (
      <Paper className="empty-state" p="xl" radius="lg" withBorder data-testid="empty-state">
        <IconClipboardList size={35} color="#7b56c8" aria-hidden="true" />
        <Text fw={700} mt="sm">
          {list.length > 0 ? 'All caught up!' : 'No tasks yet'}
        </Text>
        <Text size="sm" c="dimmed" mt="xs">
          {list.length > 0
            ? 'Turn on Show completed tasks in Settings to see your finished work.'
            : 'Add a new task to get started.'}
        </Text>
      </Paper>
    );
  }

  // STEP 12: Show one card for each task in the current page.
  return (
    <div data-testid="todo-list">
      <Text size="sm" c="dimmed" mb="md">
        {filteredItems.length} {showCompleted ? 'visible' : 'unfinished'} task
        {filteredItems.length === 1 ? '' : 's'}
        {' · '}Page {currentPage} of {totalPages}
      </Text>

      <Stack gap="md">
        {visiblePageItems.map((item) => (
          <Paper
            key={item.id}
            className={'task-card' + (item.complete ? ' task-done' : '')}
            withBorder
            p="md"
            radius="lg"
            data-testid="todo-card"
          >
            <Group align="flex-start" justify="space-between" wrap="nowrap" gap="sm">
              <div className="task-details">
                <Text fw={750} className="task-name">{item.text}</Text>
                <Group gap="xs" mt="sm">
                  {/* STEP 13: A completed task looks different from an open task. */}
                  <Badge color={item.complete ? 'teal' : 'blue'} variant="light">
                    {item.complete ? 'Completed' : 'Pending'}
                  </Badge>
                  <Badge color={item.difficulty >= 4 ? 'pink' : 'grape'} variant="light">
                    Difficulty: {item.difficulty}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" mt="sm">
                  Assigned to: {item.assignee || 'Unassigned'}
                </Text>
              </div>

              <Group gap="xs" wrap="nowrap">
                {/*
                  STEP 14: The button toggles the completed flag.
                  If the task is complete and visible, offer Undo.
                  If the task is open, offer Done.
                */}
                <Button
                  size="xs"
                  variant="light"
                  color={item.complete ? 'grape' : 'teal'}
                  leftSection={item.complete
                    ? <IconRotate size={15} />
                    : <IconCheck size={15} />}
                  aria-label={
                    'Mark ' + item.text + (item.complete ? ' incomplete' : ' complete')
                  }
                  onClick={() => toggleComplete(item.id)}
                >
                  {item.complete ? 'Undo' : 'Done'}
                </Button>

                {/* STEP 15: Delete the selected task using its unique ID. */}
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
        STEP 16: Mantine Pagination draws the page buttons.
        value = current page; onChange changes it; total = page count.
        The page count now updates when the settings form saves.
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
