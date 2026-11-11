/**
 * FILE: Context/Settings/Settings.jsx
 * PURPOSE: Store the SAME display settings for our entire app.
 *
 * Simple explanation of Context:
 * Context is like a classroom whiteboard.
 * The teacher writes one rule on the board, and every student can read it.
 * In React, the Provider holds the shared rules, and components use
 * useContext() to read those rules.
 *
 * CLASS 31 RULE: These values are FIXED for Phase 1.
 * We do NOT create settings forms or change these rules yet.
 */
import { createContext, useState } from 'react';

// STEP 1: Create the shared place where display settings will live.
// createContext(null) makes the Context object.
// The Provider later fills it with our actual settings.
export const SettingsContext = createContext(null);

// STEP 2: Write the Phase 1 defaults in one place.
// pageItems: 3         → show up to three tasks on one page.
// showCompleted: false → completed tasks should be hidden.
// sort: 'difficulty'   → default field used for sorting (stretch goal).
export const DEFAULT_SETTINGS = {
  pageItems: 3,
  showCompleted: false,
  sort: 'difficulty',
};

// STEP 3: Build the Provider component.
// The "children" parameter means all components placed between
// <SettingsProvider> and </SettingsProvider>.
export default function SettingsProvider({ children }) {
  // STEP 4: Keep the default settings in React state.
  // We do not need a setter in Phase 1 because the rules cannot change.
  // In Phase 2, students will learn how to edit these settings.
  const [settings] = useState(DEFAULT_SETTINGS);

  // STEP 5: Share the settings with every child component.
  // List.jsx reads pageItems, showCompleted, and sort from here.
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
