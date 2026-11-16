/**
 * FILE: Settings.test.jsx
 * CLASS 32: Verify shared settings, saving, and browser restoration.
 *
 * A child inside SettingsProvider can read both shared VALUES
 * and the shared saveSettings FUNCTION.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SettingsProvider, {
  DEFAULT_SETTINGS,
  SettingsContext,
  STORAGE_KEY,
} from './Settings.jsx';

// STEP 1: A small pretend child reads Context and offers a Save button.
function ContextReader() {
  return (
    <SettingsContext.Consumer>
      {(settings) => (
        <div>
          <span data-testid="page-value">{settings.pageItems}</span>
          <span data-testid="show-value">{String(settings.showCompleted)}</span>
          <span data-testid="sort-value">{settings.sort}</span>
          <button
            onClick={() => settings.saveSettings({
              pageItems: 5,
              showCompleted: true,
              sort: 'difficulty',
            })}
          >
            Save sample preferences
          </button>
        </div>
      )}
    </SettingsContext.Consumer>
  );
}

function renderReader() {
  return render(
    <SettingsProvider>
      <ContextReader />
    </SettingsProvider>
  );
}

// STEP 2: Clear Local Storage between tests so tests do not affect each other.
afterEach(() => {
  window.localStorage.clear();
});

describe('Phase 2 Settings Context', () => {
  it('starts with the required Phase 1 defaults', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      pageItems: 3,
      showCompleted: false,
      sort: 'difficulty',
    });
    renderReader();
    expect(screen.getByTestId('page-value')).toHaveTextContent('3');
    expect(screen.getByTestId('show-value')).toHaveTextContent('false');
    expect(screen.getByTestId('sort-value')).toHaveTextContent('difficulty');
  });

  it('shares a save method and immediately updates child components', () => {
    renderReader();
    fireEvent.click(screen.getByRole('button', { name: 'Save sample preferences' }));

    expect(screen.getByTestId('page-value')).toHaveTextContent('5');
    expect(screen.getByTestId('show-value')).toHaveTextContent('true');

    // JSON.stringify stores the object as a string in the browser.
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toEqual({
      pageItems: 5,
      showCompleted: true,
      sort: 'difficulty',
    });
  });

  it('restores saved settings when the Provider starts again', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pageItems: 2, showCompleted: true, sort: 'difficulty',
    }));
    renderReader();
    // React Testing Library's render() flushes the Provider's useEffect().
    expect(screen.getByTestId('page-value')).toHaveTextContent('2');
    expect(screen.getByTestId('show-value')).toHaveTextContent('true');
  });

  it('uses defaults instead of crashing when stored JSON is broken', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json');
    renderReader();
    expect(screen.getByTestId('page-value')).toHaveTextContent('3');
    expect(screen.getByTestId('show-value')).toHaveTextContent('false');
  });

  it('checks invalid stored values and uses safe defaults', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pageItems: -200,
      showCompleted: 'yes',
      sort: null,
    }));
    renderReader();
    expect(screen.getByTestId('page-value')).toHaveTextContent('3');
    expect(screen.getByTestId('show-value')).toHaveTextContent('false');
    expect(screen.getByTestId('sort-value')).toHaveTextContent('difficulty');
  });
});
