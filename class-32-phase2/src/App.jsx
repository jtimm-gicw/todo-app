/**
 * FILE: App.jsx
 * CLASS 32 — PHASE 2: TASKS AND SETTINGS NAVIGATION
 *
 * Phase 1 had only a Todo screen.
 * Phase 2 adds a separate settings page without installing a router.
 *
 * "Navigation" here means two buttons that change which component appears.
 * We use one state value ('tasks' or 'settings') to choose the screen.
 */
import { useState } from 'react';
import { Badge, Button, Container, Group, Text } from '@mantine/core';
import { IconAdjustments, IconChecklist } from '@tabler/icons-react';
import Todo from './Components/Todo/Todo.jsx';
import SettingsForm from './Components/SettingsForm/SettingsForm.jsx';

export default function App() {
  // STEP 1: Get the optional public page title from Vite.
  // If there is no VITE_APP_TITLE in .env, use this default.
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Class 32 Todo Lab';

  // STEP 2: Remember which screen the user is viewing.
  // We start with the tasks screen.
  const [view, setView] = useState('tasks');

  // STEP 3: Show the navigation buttons and ONE selected screen.
  return (
    <main>
      <Container size="lg" py="xl">
        <header className="phase2-nav">
          <Group justify="space-between" align="center" wrap="wrap">
            <div>
              <Text size="sm" fw={800} c="violet">CLASS 32 • CONTEXT API</Text>
              <Text size="xl" fw={900}>Todo Lab — Phase 2</Text>
            </div>

            <Group gap="xs" aria-label="Main navigation">
              {/* STEP 4: Click Tasks to display Todo.jsx. */}
              <Button
                variant={view === 'tasks' ? 'filled' : 'light'}
                leftSection={<IconChecklist size={18} />}
                aria-pressed={view === 'tasks'}
                onClick={() => setView('tasks')}
              >
                Tasks
              </Button>

              {/* STEP 5: Click Settings to display SettingsForm.jsx. */}
              <Button
                variant={view === 'settings' ? 'filled' : 'light'}
                leftSection={<IconAdjustments size={18} />}
                aria-pressed={view === 'settings'}
                onClick={() => setView('settings')}
              >
                Settings
              </Button>
            </Group>
          </Group>

          <Badge variant="light" color="grape" mt="md">
            Changes to settings are saved in this browser
          </Badge>
        </header>

        {/* STEP 6: Decide which component to show.
            The SettingsProvider still WRAPS App in main.jsx,
            so both screens can read the same Context values. */}
        {/*
          STEP 6: Keep Todo mounted when Settings opens.
          If we removed Todo from the screen tree completely,
          its useState task list would reset to [] each time.
          "hidden" keeps the tasks in memory while hiding the view.
        */}
        <div hidden={view !== 'tasks'}>
          <Todo appTitle={appTitle} />
        </div>

        {/* STEP 7: Only show the settings editor when requested. */}
        {view === 'settings' && <SettingsForm />}
      </Container>
    </main>
  );
}
