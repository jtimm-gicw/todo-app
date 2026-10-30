/**
 * Footer with app name and current year.
 * This is presentation only: no application state lives here.
 */
import { Container, Group, Text } from '@mantine/core';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container size="xl">
        <Group justify="space-between" gap="xs">
          <Text size="xs" c="dimmed">Daymark · React Context + Mantine + PostgreSQL</Text>
          <Text size="xs" c="dimmed">© {new Date().getFullYear()} · Built for Code 401</Text>
        </Group>
      </Container>
    </footer>
  );
}
