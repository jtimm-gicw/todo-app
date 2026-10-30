/**
 * Phase 3 and 4: sign-in and account-registration screen.
 * Credentials are sent to the API, never compared in the browser.
 */
import { useContext, useState } from 'react';
import { Alert, Badge, Button, Group, Paper, PasswordInput, SegmentedControl, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconArrowRight, IconLock, IconShieldCheck, IconSparkles } from '@tabler/icons-react';
import { AuthContext } from '../../Context/Auth/Auth';

export default function Login() {
  const { login, register, error } = useContext(AuthContext);
  const [mode, setMode] = useState('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  // SUBMIT: registration creates an account, then signs the user in.
  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    try {
      await (mode === 'signup' ? register(username.trim(), password) : login(username.trim(), password));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-feature">
        <Badge size="lg" variant="light" color="yellow" leftSection={<IconSparkles size={14} />}>MAKE EVERY DAY A LITTLE BRIGHTER</Badge>
        <Title order={1} className="auth-title">A happy place<br />for <span>big ideas.</span></Title>
        <Text className="auth-description">Turn busy days into brighter ones. Plan your tasks, build momentum, and celebrate every checkmark.</Text>
        <div className="auth-example">
          <div className="example-check">✓</div>
          <div><strong>Small steps. Big progress.</strong><p>Organize · Prioritize · Complete</p></div>
        </div>
        <Group gap="xs" className="auth-trust"><IconShieldCheck size={18} /> Accounts and permissions verified by the API</Group>
      </div>
      <Paper radius="xl" p="xl" className="auth-card" shadow="sm">
        <Stack gap="lg">
          <div>
            <Text size="sm" fw={700} c="indigo">WELCOME TO DAYMARK</Text>
            <Title order={2} mt="xs">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</Title>
            <Text c="dimmed" size="sm" mt="xs"> {mode === 'signup' ? 'Start organizing your workspace.' : 'Sign in to view your private workspace.'} </Text>
          </div>
          <SegmentedControl
            fullWidth
            value={mode}
            onChange={setMode}
            data={[{ label: 'Sign in', value: 'signin' }, { label: 'Create account', value: 'signup' }]}
          />
          {error && <Alert color="red" title="Unable to continue">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput label="Username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} required minLength={3} maxLength={30} autoComplete="username" />
              <PasswordInput label="Password" placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'} value={password} onChange={(e) => setPassword(e.currentTarget.value)} required minLength={mode === 'signup' ? 8 : 1} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
              {mode === 'signup' && <Text size="xs" c="dimmed">New accounts receive the Editor role (read, create, update). Delete access is limited to admins.</Text>}
              <Button className="auth-submit-button" size="md" type="submit" fullWidth loading={pending} rightSection={<IconArrowRight size={18} />}>
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </Button>
            </Stack>
          </form>
          <Group justify="center" gap="xs">
            <IconLock size={15} color="var(--mantine-color-gray-6)" />
            <Text size="xs" c="dimmed">Your tasks require a verified login.</Text>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}
