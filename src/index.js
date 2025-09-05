// Core React imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// MantineProvider gives access to Mantine's design system (theme, global styles, etc.)
import { MantineProvider } from '@mantine/core';

// Custom Context provider for global app settings
import SettingsProvider from './Context/Settings/Settings';

// Main App component
import App from './App.js';

// Create a root to render the React app (React 18+ API)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root
root.render(
  // StrictMode helps catch potential problems in development
  <React.StrictMode>
    
    {/* MantineProvider wraps the app to apply Mantine UI theme + styles */}
    {/* withGlobalStyles = reset + normalize styling */}
    {/* withNormalizeCSS = consistent base styling across browsers */}
    <MantineProvider withGlobalStyles withNormalizeCSS>
      
      {/* SettingsProvider makes global settings available 
          (like showCompleted, pageItems, etc.) 
          to any component that calls useContext(SettingsContext) */}
      <SettingsProvider>
        
        {/* The main app component that contains all routes, components, etc. */}
        <App />

      </SettingsProvider>
    </MantineProvider>
  </React.StrictMode>
);
