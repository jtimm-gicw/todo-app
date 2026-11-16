/**
 * FILE: Components/SettingsForm/SettingsForm.jsx
 * CLASS 32 — NEW IN PHASE 2: THE SETTINGS EDITOR
 *
 * The user chooses TWO display preferences:
 * 1. How many todo cards appear on one page.
 * 2. Whether to show finished tasks.
 *
 * This form does not own the final saved settings.
 * The Context Provider owns them; this component just asks it to save.
 *
 * The right-hand card shows the SAVED values, not unfinished edits.
 */
import { useContext, useEffect, useState } from 'react';
import {
  Alert, Badge, Button, Card, Grid, Group, NumberInput,
  Stack, Switch, Text, Title,
} from '@mantine/core';
import {
  IconAdjustments, IconCheck, IconDeviceFloppy,
  IconRefresh, IconSettings,
} from '@tabler/icons-react';
import { DEFAULT_SETTINGS, SettingsContext } from '../../Context/Settings/Settings.jsx';

export default function SettingsForm() {
  // STEP 1: Read the saved rules AND the save function from Context.
  // We do NOT pass these in as props from App.
  const { pageItems, showCompleted, sort, saveSettings } =
    useContext(SettingsContext);

  // STEP 2: Store a DRAFT of the form values.
  // A draft is what the user is currently editing.
  // The saved Context values change only after Save is clicked.
  const [draft, setDraft] = useState({
    pageItems,
    showCompleted,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // STEP 3: Update the form if Context loads saved preferences on startup.
  // This matters because the Provider reads Local Storage in useEffect().
  useEffect(() => {
    setDraft({ pageItems, showCompleted });
  }, [pageItems, showCompleted]);

  // STEP 4: Save the draft settings when the button is clicked.
  function handleSave(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    // STEP 4A: Only accept whole numbers from 1 to 20.
    // Mantine NumberInput might briefly return a string while typing.
    if (!Number.isInteger(draft.pageItems) ||
        draft.pageItems < 1 || draft.pageItems > 20) {
      setError('Choose a whole number from 1 to 20.');
      return;
    }

    // STEP 4B: Call the function from the Context Provider.
    // We also pass "sort" so its default word is kept.
    const saved = saveSettings({
      pageItems: draft.pageItems,
      showCompleted: draft.showCompleted,
      sort,
    });

    // STEP 4C: Give the user clear feedback.
    if (saved) setMessage('Your settings were saved in this browser!');
    else setError('Your browser did not save the settings. Please try again.');
  }

  // STEP 5: Reset everything to the Phase 1 default settings.
  // The reset button ALSO saves those defaults to Local Storage.
  function handleReset() {
    setMessage('');
    setError('');
    const saved = saveSettings(DEFAULT_SETTINGS);
    if (saved) {
      setDraft({
        pageItems: DEFAULT_SETTINGS.pageItems,
        showCompleted: DEFAULT_SETTINGS.showCompleted,
      });
      setMessage('Default settings restored and saved.');
    } else {
      setError('Could not save the default settings.');
    }
  }

  // STEP 6: Show the form on the LEFT and the saved values on the RIGHT.
  // Mantine Grid stacks the cards on narrow screens.
  return (
    <section className="settings-screen">
      <div className="settings-intro">
        <Badge color="pink" variant="light" leftSection={<IconAdjustments size={16} />}>
          YOUR PREFERENCES
        </Badge>
        <Title order={1} mt="sm">Make your task list your own</Title>
        <Text c="dimmed" mt="xs">
          Change two display settings. Save them to keep them after a refresh.
        </Text>
      </div>

      <Grid gutter="xl" align="stretch">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card className="panel settings-editor" radius="xl" padding="xl" withBorder>
            <Group gap="xs" mb="xl">
              <IconSettings size={26} color="#6e41c8" aria-hidden="true" />
              <Title order={2} size="h3">Edit settings</Title>
            </Group>

            {/* STEP 7: Submit this form to save both preferences together. */}
            <form onSubmit={handleSave}>
              <Stack gap="xl">
                {/*
                  STEP 8: NumberInput lets a student choose page size.
                  The old pageItems value was fixed at 3.
                  The user can now change it to 1, 2, 5, etc.
                */}
                <NumberInput
                  label="Tasks per page"
                  description="How many task cards should appear at once?"
                  min={1}
                  max={20}
                  allowDecimal={false}
                  clampBehavior="strict"
                  value={draft.pageItems}
                  onChange={(value) => {
                    setDraft((previous) => ({
                      ...previous,
                      pageItems: value,
                    }));
                    setMessage('');
                  }}
                />

                {/*
                  STEP 9: Switch is an on/off setting.
                  true = show completed tasks.
                  false = hide completed tasks.
                */}
                <Switch
                  label="Show completed tasks"
                  description="Include finished tasks in your list"
                  checked={draft.showCompleted}
                  onChange={(event) => {
                    // STEP 9A: Read the checked value immediately.
                    // Do not keep the browser event for later.
                    const checked = event.currentTarget.checked;
                    setDraft((previous) => ({
                      ...previous,
                      showCompleted: checked,
                    }));
                    setMessage('');
                  }}
                />

                <Group gap="sm">
                  <Button
                    type="submit"
                    leftSection={<IconDeviceFloppy size={18} />}
                    className="settings-save"
                  >
                    Save preferences
                  </Button>
                  <Button
                    type="button"
                    variant="light"
                    color="gray"
                    leftSection={<IconRefresh size={18} />}
                    onClick={handleReset}
                  >
                    Reset defaults
                  </Button>
                </Group>

                {/* STEP 10: Let the user know whether saving worked. */}
                {message && <Alert color="teal" icon={<IconCheck size={18} />}>{message}</Alert>}
                {error && <Alert color="red" title="Check your settings">{error}</Alert>}
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          {/* STEP 11: This preview reads from CONTEXT, not the form draft.
              It updates after Save and remains after a browser refresh. */}
          <Card className="panel settings-preview" radius="xl" padding="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={2} size="h3">Active settings</Title>
              <Badge color="teal" variant="light">Saved</Badge>
            </Group>
            <Stack gap="lg">
              <div className="setting-row">
                <Text size="sm" c="dimmed">Tasks per page</Text>
                <Text data-testid="saved-page-items" fw={800}>{pageItems}</Text>
              </div>
              <div className="setting-row">
                <Text size="sm" c="dimmed">Completed tasks</Text>
                <Text data-testid="saved-completed" fw={800}>
                  {showCompleted ? 'Visible' : 'Hidden'}
                </Text>
              </div>
              <div className="setting-row">
                <Text size="sm" c="dimmed">Sort field</Text>
                <Text data-testid="saved-sort" fw={800}>{sort}</Text>
              </div>
            </Stack>
            <Text size="sm" c="dimmed" mt="xl">
              These settings are saved in this browser. Your tasks are
              still temporary in Phase 2.
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </section>
  );
}
