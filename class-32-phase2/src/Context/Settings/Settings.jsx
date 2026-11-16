/**
 * FILE: Context/Settings/Settings.jsx
 * CLASS 32 — PHASE 2: EDITABLE SHARED SETTINGS
 *
 * WHAT CHANGED SINCE PHASE 1?
 * Phase 1: Context ONLY shared fixed display rules.
 * Phase 2: Context ALSO shares saveSettings(), a function that lets
 * users change the rules and remember them after a browser refresh.
 *
 * SIMPLE WORDS:
 * - Context = a classroom whiteboard everyone in the app can read.
 * - Provider = the person who writes settings on the whiteboard.
 * - State = information React remembers while the app is open.
 * - Local Storage = a small saved note in THIS browser.
 * - JSON = a way to turn an object into text and back again.
 *
 * The tasks themselves are STILL only in React state in this lab.
 * We save SETTINGS, not the actual todo tasks.
 */
import { createContext, useEffect, useState } from 'react';

// STEP 1: Create the Context object.
// Other components use useContext(SettingsContext) to read its values.
export const SettingsContext = createContext(null);

// STEP 2: Define our starting settings in one place.
// Only TWO are editable in Phase 2: pageItems and showCompleted.
// The difficulty sort field remains available but has no editor yet.
export const DEFAULT_SETTINGS = {
  pageItems: 3,           // Show 3 tasks at once.
  showCompleted: false,   // Hide completed tasks.
  sort: 'difficulty',     // Default sorting word (stretch goal).
};

// STEP 3: Give browser storage one clear key/name.
// This helps us find the same saved settings after a refresh.
export const STORAGE_KEY = 'code401-todo-phase2-settings';

// STEP 4: Check saved values before using them.
// This protects us from broken or unexpected saved data.
// Example: pageItems must be a WHOLE NUMBER between 1 and 20.
function cleanSettings(input) {
  const raw = input && typeof input === 'object' ? input : {};

  return {
    pageItems: Number.isInteger(raw.pageItems) &&
      raw.pageItems >= 1 && raw.pageItems <= 20
      ? raw.pageItems
      : DEFAULT_SETTINGS.pageItems,

    showCompleted: typeof raw.showCompleted === 'boolean'
      ? raw.showCompleted
      : DEFAULT_SETTINGS.showCompleted,

    sort: ['difficulty', 'text', 'assignee'].includes(raw.sort)
      ? raw.sort
      : DEFAULT_SETTINGS.sort,
  };
}

// STEP 5: This component WRAPS the application in main.jsx.
// "children" represents everything inside the Provider tags.
export default function SettingsProvider({ children }) {
  // STEP 6: Store the current settings in state.
  // At first, we show the default Phase 1 values.
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  // STEP 7: On startup, look for settings saved in this browser.
  // useEffect runs after React displays the component for the first time.
  // [] means this reading step runs when the Provider starts.
  useEffect(() => {
    try {
      // STEP 7A: Read the string from Local Storage.
      const savedText = window.localStorage.getItem(STORAGE_KEY);

      // STEP 7B: Nothing saved yet? Keep the defaults.
      if (!savedText) return;

      // STEP 7C: JSON.parse turns saved text BACK into an object.
      const savedObject = JSON.parse(savedText);

      // STEP 7D: Check the values, then update shared React state.
      // All components using Context will automatically update.
      setSettings(cleanSettings(savedObject));
    } catch (error) {
      // STEP 7E: Bad JSON or blocked storage should not crash the app.
      // Let students know that the app will continue with defaults.
      console.warn('Saved settings could not be loaded; using defaults.', error);
    }
  }, []);

  // STEP 8: Share a FUNCTION that the settings form can call.
  // The form passes an object such as:
  // { pageItems: 5, showCompleted: true, sort: 'difficulty' }
  function saveSettings(nextValues) {
    // STEP 8A: Make sure the values are safe before we save them.
    const updatedSettings = cleanSettings(nextValues);

    try {
      // STEP 8B: Local Storage holds strings, NOT JavaScript objects.
      // JSON.stringify turns our settings object into text.
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSettings)
      );

      // STEP 8C: Update React state so the screen changes immediately.
      setSettings(updatedSettings);

      // STEP 8D: Tell the form that saving worked.
      return true;
    } catch (error) {
      // STEP 8E: If browser storage is unavailable, show an error
      // in the settings form rather than falsely claiming it saved.
      console.warn('Settings could not be saved.', error);
      return false;
    }
  }

  // STEP 9: Provide BOTH the settings and the save function.
  // List.jsx needs the settings.
  // SettingsForm.jsx needs both the settings AND saveSettings().
  const sharedValues = {
    ...settings,
    saveSettings,
  };

  return (
    <SettingsContext.Provider value={sharedValues}>
      {children}
    </SettingsContext.Provider>
  );
}
