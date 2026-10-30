/**
 * Phase 2: editable global display preferences.
 * Preferences are saved to Local Storage only when Save is clicked.
 * The card on the right previews the saved, currently active values.
 */
import { useContext, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Grid, Group, NumberInput, Select, Stack, Switch, Text, Title } from '@mantine/core';
import { IconAdjustments, IconCheck, IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';
import { DEFAULT_SETTINGS, SettingsContext } from '../../Context/Settings/Settings';

export default function SettingsForm() {
  const settings = useContext(SettingsContext);
  const [draft, setDraft] = useState({ showCompleted: settings.showCompleted, pageItems: settings.pageItems, sort: settings.sort });
  const [saved, setSaved] = useState(false);

  // SYNC: update form when context restores saved preferences at startup.
  useEffect(() => {
    setDraft({ showCompleted: settings.showCompleted, pageItems: settings.pageItems, sort: settings.sort });
  }, [settings.showCompleted, settings.pageItems, settings.sort]);

  // SAVE: values are validated by the Context Provider before storage.
  function handleSave(event) {
    event.preventDefault();
    settings.saveSettings(draft);
    setSaved(true);
  }

  function handleReset() {
    setDraft(DEFAULT_SETTINGS);
    settings.saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
  }

  return (
    <div className="page-content">
      <div className="page-heading settings-heading">
        <Badge variant="light" color="pink" leftSection={<IconAdjustments size={14} />}>PERSONALIZE</Badge>
        <Title order={1} mt="sm">Make it feel <span>yours.</span> ✨</Title>
        <Text c="dimmed" mt="xs">Choose how your task list is displayed. Changes follow you on this browser.</Text>
      </div>
      <Grid gutter="xl" align="stretch">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card className="panel-card" radius="xl" padding="xl" withBorder>
            <Title order={3} mb="lg">Display preferences</Title>
            <form onSubmit={handleSave}>
              <Stack gap="xl">
                <Switch
                  label="Show completed tasks"
                  description="Include finished tasks when browsing the list"
                  checked={draft.showCompleted}
                  onChange={(e) => { setDraft({ ...draft, showCompleted: e.currentTarget.checked }); setSaved(false); }}
                />
                <NumberInput
                  label="Tasks per page"
                  description="How many cards to display before pagination"
                  min={1}
                  max={20}
                  allowDecimal={false}
                  clampBehavior="strict"
                  value={draft.pageItems}
                  onChange={(value) => { setDraft({ ...draft, pageItems: value }); setSaved(false); }}
                />
                <Select
                  label="Sort tasks by"
                  description="Choose an ordering for the task list"
                  data={[
                    { value: 'difficulty', label: 'Difficulty (hardest first)' },
                    { value: 'text', label: 'Task name (A–Z)' },
                    { value: 'assignee', label: 'Assignee (A–Z)' },
                  ]}
                  value={draft.sort}
                  allowDeselect={false}
                  onChange={(value) => { setDraft({ ...draft, sort: value }); setSaved(false); }}
                />
                <Group>
                  <Button className="save-settings-button" type="submit" leftSection={<IconDeviceFloppy size={18} />}>Save preferences</Button>
                  <Button variant="subtle" color="gray" leftSection={<IconRefresh size={17} />} onClick={handleReset}>Reset defaults</Button>
                </Group>
                {saved && <Alert color="teal" icon={<IconCheck size={18} />}>Preferences saved to this browser.</Alert>}
              </Stack>
            </form>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card className="panel-card settings-preview" radius="xl" padding="xl" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={3}>Active settings</Title>
              <Badge color="teal" variant="light">Saved</Badge>
            </Group>
            <Stack gap="md">
              <div className="setting-line"><Text c="dimmed" size="sm">Completed tasks</Text><Text fw={700}>{settings.showCompleted ? 'Visible' : 'Hidden'}</Text></div>
              <div className="setting-line"><Text c="dimmed" size="sm">Tasks per page</Text><Text fw={700}>{settings.pageItems}</Text></div>
              <div className="setting-line"><Text c="dimmed" size="sm">Sort order</Text><Text fw={700} tt="capitalize">{settings.sort}</Text></div>
            </Stack>
            <Text size="sm" c="dimmed" mt="xl">These settings are stored locally in your browser, not in the shared task database.</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
