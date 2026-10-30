/**
 * Phase 1 + Phase 2: global display preferences using the Context API.
 * Defaults: show 3 tasks, hide completed tasks, sort by difficulty.
 * Saved preferences are read from Local Storage when the app opens.
 */
import { createContext, useEffect, useState } from 'react';

export const SettingsContext = createContext(null);
export const DEFAULT_SETTINGS = { showCompleted: false, pageItems: 3, sort: 'difficulty' };
const STORAGE_KEY = 'todo:settings:v2';

// VALIDATION: ignore malformed or unsupported saved preferences.
export function normalizeSettings(value = {}) {
  const count = Number(value.pageItems);
  return {
    showCompleted: typeof value.showCompleted === 'boolean' ? value.showCompleted : false,
    pageItems: Number.isInteger(count) && count >= 1 && count <= 20 ? count : 3,
    sort: ['difficulty', 'text', 'assignee'].includes(value.sort) ? value.sort : 'difficulty',
  };
}

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // RESTORE: try the new storage key, then the original lab's "todo" key.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('todo');
      if (saved) setSettings(normalizeSettings(JSON.parse(saved)));
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // SAVE: update context and browser storage together after the user submits.
  function saveSettings(nextValues) {
    const next = normalizeSettings(nextValues);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSettings(next);
  }

  // CONTEXT: child components read display settings without prop drilling.
  return (
    <SettingsContext.Provider value={{ ...settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
