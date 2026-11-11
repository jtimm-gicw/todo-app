/**
 * FILE: main.jsx
 * PURPOSE: This is the starting point of the React app.
 *
 * CLASS 31 IMPORTANT IDEA:
 * SettingsProvider WRAPS App, so EVERY component inside App can
 * read the same settings. We do not have to pass the settings
 * through every component by hand.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.scss';

import SettingsProvider from './Context/Settings/Settings.jsx';
import App from './App.jsx';

// STEP 1: Choose a friendly color theme for Mantine components.
// Mantine provides ready-made buttons, cards, inputs, and pagination.
const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'system-ui, Arial, sans-serif',
});

// STEP 2: Find the empty <div id="root"> inside index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// STEP 3: Display the app.
// - MantineProvider gives the app its shared design.
// - SettingsProvider shares Phase 1 display rules.
// - App is the main screen the user sees.
// Think: PROVIDER (settings) → APP → TO DO → LIST.
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MantineProvider>
  </React.StrictMode>
);
