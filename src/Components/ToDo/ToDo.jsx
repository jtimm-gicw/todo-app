/**
 * Phase 4 task workspace.
 * Loads tasks from PostgreSQL through the authenticated API.
 * Every create/update/delete operation is followed by a fresh GET /todo.
 * React state is a view of server data, not permanent storage.
 */
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Grid, Group, Loader, Progress, Select, SimpleGrid, Slider, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconCircleCheck, IconConfetti, IconListCheck, IconMoodSmile, IconPlus, IconSearch, IconSparkles, IconTargetArrow } from '@tabler/icons-react';
import Auth from '../Auth/Auth';
import List from '../List/List';
import { AuthContext } from '../../Context/Auth/Auth';
import { SettingsContext } from '../../Context/Settings/Settings';
import { apiRequest } from '../../services/api';

export default function ToDo() {
  const { token, can, logout } = useContext(AuthContext);
  const { showCompleted } = useContext(SettingsContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [text, setText] = useState('');
  const [assignee, setAssignee] = useState('');
  const [difficulty, setDifficulty] = useState(3);

  // FETCH TASKS: read the database whenever the page opens or data changes.
  const refresh = useCallback(async () => {
    try {
      const data = await apiRequest('/todo', { token });
      setList(data.items);
      setError('');
    } catch (err) {
      if (err.status === 401) logout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => { refresh(); }, [refresh]);

  // MUTATIONS: the backend is the source of truth; re-fetch after each change.
  async function changeTask(path, method, body) {
    setBusy(true);
    setError('');
    try {
      await apiRequest(path, { method, body, token });
      await refresh();
      return true;
    } catch (err) {
      if (err.status === 401) logout();
      else setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  // CREATE: form is controlled so the slider always supplies a valid value.
  async function addItem(event) {
    event.preventDefault();
    if (!can('create') || !text.trim()) return;
    const success = await changeTask('/todo', 'POST', { text: text.trim(), assignee: assignee.trim(), difficulty });
    if (success) { setText(''); setAssignee(''); setDifficulty(3); }
  }

  // UPDATE: no direct array mutation; the server updates the database.
  function toggleComplete(item) {
    if (!can('update')) return;
    changeTask('/todo/' + item.id, 'PUT', { complete: !item.complete });
  }

  // DELETE: ask before making an irreversible server request.
  function deleteItem(id) {
    if (!can('delete') || !window.confirm('Delete this task permanently?')) return;
    changeTask('/todo/' + id, 'DELETE');
  }

  // SUMMARY: derived metrics update instantly when the refreshed list arrives.
  const metrics = useMemo(() => {
    const complete = list.filter((item) => item.complete).length;
    return { total: list.length, complete, open: list.length - complete, progress: list.length ? Math.round((complete / list.length) * 100) : 0 };
  }, [list]);

  // ENCOURAGEMENT: change the message automatically as task progress changes.
  const cheer = metrics.total === 0
    ? 'A fresh start — your next win begins here!'
    : metrics.progress === 100
      ? 'You finished everything. Time to celebrate!'
      : metrics.complete > 0
        ? 'Look at you go! Keep that momentum.'
        : 'Big wins begin with little steps. You have got this!';

  useEffect(() => { document.title = metrics.open + ' to do · Daymark'; }, [metrics.open]);

  return (
    <div className="page-content">
      <div className={'hero-panel' + (metrics.total > 0 && metrics.progress === 100 ? ' hero-celebration' : '')}>
        {/* DECORATION: playful icons do not interfere with keyboard or screen-reader navigation. */}
        <IconSparkles className="hero-spark hero-spark-one" size={31} aria-hidden="true" />
        <IconSparkles className="hero-spark hero-spark-two" size={24} aria-hidden="true" />
        <div>
          <Badge variant="light" color="yellow" leftSection={<IconSparkles size={14} />}>A LITTLE PROGRESS EVERY DAY</Badge>
          <Title order={1} mt="md">Your day, <span>full of wins.</span></Title>
          <Text mt="xs" className="hero-subtitle">Plan something great. Check things off. Celebrate the little victories.</Text>
          <div className="hero-motto"><IconMoodSmile size={18} aria-hidden="true" />{cheer}</div>
        </div>
        <div className="hero-progress">
          <Group gap="xs"><IconConfetti size={17} aria-hidden="true" /><Text size="xs" fw={800}>YOUR PROGRESS</Text></Group>
          <Title order={2}>{metrics.progress}%</Title>
          <Progress value={metrics.progress} color="teal" size="sm" radius="xl" mt="sm" aria-label="Overall completion progress" />
          <Text className="progress-note">{metrics.complete} of {metrics.total} tasks complete</Text>
        </div>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="lg">
        {[
          { label: 'Total tasks', number: metrics.total, icon: <IconListCheck size={22} />, color: 'indigo' },
          { label: 'Still to do', number: metrics.open, icon: <IconTargetArrow size={22} />, color: 'orange' },
          { label: 'Completed', number: metrics.complete, icon: <IconCircleCheck size={22} />, color: 'teal' },
        ].map((metric) => (
          <Card key={metric.label} className={'metric-card metric-' + metric.color} radius="lg" p="lg" withBorder>
            <Group justify="space-between">
              <div><Text size="sm" c="dimmed">{metric.label}</Text><Title order={2} mt={4}>{metric.number}</Title></div>
              <div className="metric-icon">{metric.icon}</div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {error && <Alert color="red" title="Couldn't update tasks" mt="lg">{error}. Check that the API and database are running.</Alert>}

      <Grid gutter="xl" mt="md" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Auth capability="create" fallback={
            <Card className="panel-card" withBorder radius="xl" padding="xl">
              <Title order={3}>Read-only access</Title>
              <Text size="sm" c="dimmed" mt="sm">Your account can view tasks but cannot create them.</Text>
            </Card>
          }>
            <Card className="panel-card create-task-panel" withBorder radius="xl" padding="xl">
              <Group gap="xs" mb="lg"><span className="section-icon"><IconPlus size={19} /></span><Title order={3}>Add a little win ✨</Title></Group>
              <form onSubmit={addItem}>
                <Stack gap="lg">
                  <TextInput label="Task name" placeholder="What needs to get done?" value={text} maxLength={160} onChange={(e) => setText(e.currentTarget.value)} required />
                  <TextInput label="Assigned to" placeholder="Who is responsible?" value={assignee} maxLength={80} onChange={(e) => setAssignee(e.currentTarget.value)} />
                  <div>
                    <Group justify="space-between" mb="sm"><Text size="sm" fw={600}>Difficulty</Text><Badge color="indigo" variant="light">{difficulty} / 5</Badge></Group>
                    <Slider value={difficulty} onChange={setDifficulty} min={1} max={5} step={1} marks={[{ value: 1, label: 'Easy' }, { value: 3, label: 'Medium' }, { value: 5, label: 'Hard' }]} mb="xl" />
                  </div>
                  <Button className="add-task-button" fullWidth size="md" leftSection={<IconPlus size={19} />} type="submit" loading={busy}>Add new task</Button>
                </Stack>
              </form>
            </Card>
          </Auth>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card className="panel-card task-board-panel" withBorder radius="xl" padding="lg">
            <Group justify="space-between" mb="md" align="center">
              <div><Title order={3}>Your task board 🌈</Title><Text size="sm" c="dimmed">A home for everything on your mind</Text></div>
              <Badge variant="light" color="indigo">{metrics.open} open</Badge>
            </Group>
            <Group grow align="flex-end" mb="lg">
              <TextInput aria-label="Search tasks" leftSection={<IconSearch size={18} />} placeholder="Search tasks..." value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
              <Select aria-label="Filter by status" value={status} onChange={setStatus} allowDeselect={false} data={[
                { label: 'All available', value: 'all' },
                { label: 'In progress', value: 'open' },
                ...(showCompleted ? [{ label: 'Completed', value: 'complete' }] : []),
              ]} />
            </Group>
            {loading ? <Group justify="center" p="xl"><Loader aria-label="Loading tasks" /></Group> : (
              <Auth capability="read">
                <List list={list} query={query} status={showCompleted ? status : (status === 'complete' ? 'all' : status)} toggleComplete={toggleComplete} deleteItem={deleteItem} busy={busy} />
              </Auth>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
