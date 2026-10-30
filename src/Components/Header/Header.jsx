/**
 * Navigation header.
 * Logged-in users can switch between Tasks and Settings and sign out.
 */
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Button, Container, Group, Text } from '@mantine/core';
import { IconCheck, IconLayoutDashboard, IconLogout, IconSettings } from '@tabler/icons-react';
import { AuthContext } from '../../Context/Auth/Auth';

export default function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  // NAVIGATION: routes are visible only once an account is verified.
  return (
    <header className="site-header" data-testid="todo-header">
      <Container size="xl">
        <Group justify="space-between" gap="sm" wrap="wrap" className="header-inner">
          <NavLink to="/" className="brand">
            <span className="brand-symbol"><IconCheck size={22} stroke={3} /></span>
            <span>daymark<span className="brand-dot">.</span></span>
          </NavLink>
          {isLoggedIn && (
            <Group gap="sm" wrap="wrap">
              <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}>
                <IconLayoutDashboard size={17} /> Tasks
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}>
                <IconSettings size={17} /> Settings
              </NavLink>
              <Badge color="indigo" variant="light" radius="sm">{user?.role || 'member'}</Badge>
              <Text size="sm" className="username-label">{user?.username}</Text>
              <Button size="xs" variant="subtle" color="gray" leftSection={<IconLogout size={16} />} onClick={logout}>
                Log out
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </header>
  );
}
