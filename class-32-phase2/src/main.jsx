/**
 * FILE: main.jsx — CLASS 32 APPLICATION STARTUP
 *
 * Phase 1 shared fixed settings using Context.
 * Phase 2 shares both settings AND a saveSettings() function.
 *
 * MantineProvider = shared colors and visual components.
 * SettingsProvider = shared settings + saving/restoring.
 * App = Tasks and Settings screens.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.scss';
import SettingsProvider from './Context/Settings/Settings.jsx';
import App from './App.jsx';

// STEP 1: Choose a shared Mantine theme.
const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'system-ui, Arial, sans-serif',
});

// STEP 2: Find the empty root div inside index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// STEP 3: Wrap the entire app with SettingsProvider.
// Todo, List, and SettingsForm can all access the Context values.
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MantineProvider>
  </React.StrictMode>
);
