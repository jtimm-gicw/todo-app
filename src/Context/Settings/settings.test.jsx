/**
 * Phase 2 tests: defaults, malformed settings, and Local Storage recovery.
 */
import { describe, expect, beforeEach, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SettingsProvider, { DEFAULT_SETTINGS, normalizeSettings, SettingsContext } from './Settings';

beforeEach(() => {
  localStorage.clear();
});

describe('Settings Context', () => {
  it('uses required lab defaults', () => {
    expect(DEFAULT_SETTINGS).toEqual({ showCompleted: false, pageItems: 3, sort: 'difficulty' });
    expect(normalizeSettings({ pageItems: 0, sort: 'unknown' })).toEqual(DEFAULT_SETTINGS);
  });

  it('restores saved preferences from Local Storage', () => {
    localStorage.setItem('todo:settings:v2', JSON.stringify({ showCompleted: true, pageItems: 5, sort: 'text' }));
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {(settings) => <p data-testid="settings">{String(settings.showCompleted)}-{settings.pageItems}-{settings.sort}</p>}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );
    expect(screen.getByTestId('settings')).toHaveTextContent('true-5-text');
  });

  it('saves and publishes changes across the app', () => {
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {(settings) => (
            <>
              <button onClick={() => settings.saveSettings({ showCompleted: true, pageItems: 8, sort: 'assignee' })}>Save</button>
              <p data-testid="count">{settings.pageItems}</p>
            </>
          )}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByTestId('count')).toHaveTextContent('8');
    expect(JSON.parse(localStorage.getItem('todo:settings:v2')).sort).toBe('assignee');
  });
});
