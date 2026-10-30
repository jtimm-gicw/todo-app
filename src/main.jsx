/**
 * App entry point.
 * Mounts React and provides Mantine styling, authentication, and user settings
 * to every component below them in the component tree.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import SettingsProvider from './Context/Settings/Settings';
import AuthProvider from './Context/Auth/Auth';
import App from './App';

// THEME: colors and typography shared throughout the app.
const theme = createTheme({
  // Violet matches the colorful design while preserving Mantine's accessible states.
  primaryColor: 'violet',
  defaultRadius: 'lg',
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
  headings: { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' },
});

// PROVIDERS: their order makes authentication and settings available to App.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);
