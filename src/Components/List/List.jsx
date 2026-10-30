/**
 * Phase 1 + 2 + 3: filtered, sorted, paginated task cards.
 * Reads global display settings and protects update/delete actions by role.
 */
import { useContext, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Badge, Group, Pagination, Paper, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconClipboardList, IconRotate, IconTrash } from '@tabler/icons-react';
import { SettingsContext } from '../../Context/Settings/Settings';
import { getVisibleTasks, paginate } from '../../utils/tasks';
import Auth from '../Auth/Auth';

// BADGE COLORS: quick visual indication of the item's difficulty.
function difficultyColor(level) {
  return level >= 5 ? 'pink' : level >= 4 ? 'violet' : level >= 3 ? 'yellow' : level >= 2 ? 'cyan' : 'teal';
}

export default function List({ list, query, status, toggleComplete, deleteItem, busy }) {
  const { showCompleted, pageItems, sort } = useContext(SettingsContext);
  const [page, setPage] = useState(1);

  // FILTER / SORT: derive what to show; never change original task state.
  const visible = useMemo(() => getVisibleTasks(list, { showCompleted, sort, query, status }), [list, showCompleted, sort, query, status]);
  const { items, currentPage, totalPages } = paginate(visible, page, pageItems);

  // RESET PAGINATION: changes to settings/search start again at page 1.
  useEffect(() => { setPage(1); }, [pageItems, showCompleted, sort, query, status]);

  // EMPTY STATE: encouragement depends on whether tasks are done or filtered out.
  if (!visible.length) {
    const allDone = list.length > 0 && list.every((item) => item.complete);
    return (
      <Paper className="empty-state" radius="xl" p="xl" withBorder>
        <div className="empty-icon"><IconClipboardList size={34} /></div>
        <Title order={3}>{allDone ? 'You cleared the board! 🎉' : list.length ? 'No matches this time' : 'A fresh page for great ideas'}</Title>
        <Text c="dimmed" mt="xs">
          {allDone ? 'Every task is finished. Nice work!' : list.length ? 'Try another search or filter to find your tasks.' : 'Add your first task and watch the progress begin.'}
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text c="dimmed" size="sm">{visible.length} matching task{visible.length === 1 ? '' : 's'}</Text>
        <Text c="dimmed" size="sm">Page {currentPage} of {totalPages}</Text>
      </Group>
      {items.map((item) => (
        <Paper key={item.id} withBorder radius="lg" p="md" className={'task-card task-difficulty-' + item.difficulty + (item.complete ? ' task-done' : '')}>
          <Group justify="space-between" gap="xs" align="flex-start" wrap="nowrap">
            <Group align="flex-start" gap="md" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
              <Auth capability="update" fallback={<span className="task-dot" aria-hidden="true" />}>
                <ActionIcon
                  variant={item.complete ? 'filled' : 'light'}
                  color={item.complete ? 'teal' : 'indigo'}
                  radius="xl" size="lg" mt={2}
                  disabled={busy}
                  aria-label={(item.complete ? 'Mark incomplete: ' : 'Mark complete: ') + item.text}
                  title={item.complete ? 'Mark task incomplete' : 'Mark task complete'}
                  onClick={() => toggleComplete(item)}
                >
                  {item.complete ? <IconCheck size={18} /> : <IconRotate size={17} />}
                </ActionIcon>
              </Auth>
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text fw={700} className="task-name">{item.text}</Text>
                <Group gap="xs" mt="sm">
                  <Badge variant="light" color={item.complete ? 'teal' : 'grape'}>{item.complete ? 'Completed' : 'In progress'}</Badge>
                  <Badge variant="dot" color={difficultyColor(Number(item.difficulty))}>Difficulty {item.difficulty}/5</Badge>
                </Group>
                <Text size="xs" c="dimmed" mt="md">Assigned to <strong>{item.assignee || 'Unassigned'}</strong></Text>
              </div>
            </Group>
            <Auth capability="delete">
              <ActionIcon color="red" variant="subtle" aria-label={'Delete ' + item.text} title="Delete task" disabled={busy} onClick={() => deleteItem(item.id)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Auth>
          </Group>
        </Paper>
      ))}
      {totalPages > 1 && (
        <Group justify="center" mt="sm">
          <Pagination value={currentPage} onChange={setPage} total={totalPages} radius="md" withEdges />
        </Group>
      )}
    </Stack>
  );
}
