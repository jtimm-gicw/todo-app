/**
 * FILE: Settings.test.jsx
 * PURPOSE: Check that a child component receives the fixed Context values.
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SettingsProvider, { DEFAULT_SETTINGS, SettingsContext } from './Settings.jsx';

describe('Phase 1 Settings Context', () => {
  // TEST 1: Verify all three lab defaults.
  it('has three fixed display rules', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      pageItems: 3,
      showCompleted: false,
      sort: 'difficulty',
    });
  });

  // TEST 2: Mount a child inside the Provider.
  // That child sees Context without receiving settings as props.
  it('shares defaults with a child component', () => {
    render(
      <SettingsProvider>
        <SettingsContext.Consumer>
          {(settings) => (
            <div>
              <span data-testid="per-page">{settings.pageItems}</span>
              <span data-testid="completed-visible">{String(settings.showCompleted)}</span>
              <span data-testid="sort-word">{settings.sort}</span>
            </div>
          )}
        </SettingsContext.Consumer>
      </SettingsProvider>
    );

    expect(screen.getByTestId('per-page')).toHaveTextContent('3');
    expect(screen.getByTestId('completed-visible')).toHaveTextContent('false');
    expect(screen.getByTestId('sort-word')).toHaveTextContent('difficulty');
  });
});
