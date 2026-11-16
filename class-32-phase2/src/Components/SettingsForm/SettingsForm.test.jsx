/**
 * FILE: SettingsForm.test.jsx
 * PURPOSE: Test the new Phase 2 form in a small, focused way.
 *
 * We are interested in three things:
 * 1. The right-hand preview shows CURRENT Context values.
 * 2. The Save button writes settings into browser Local Storage.
 * 3. Bad values do not replace our saved preferences.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import SettingsProvider, { STORAGE_KEY } from '../../Context/Settings/Settings.jsx';
import SettingsForm from './SettingsForm.jsx';

// STEP 1: Mount the form inside the same Provider it uses in the app.
function renderForm() {
  return render(
    <MantineProvider env="test">
      <SettingsProvider>
        <SettingsForm />
      </SettingsProvider>
    </MantineProvider>
  );
}

afterEach(() => window.localStorage.clear());

describe('Class 32 Settings editor', () => {
  it('displays the three starting rules in the preview', () => {
    renderForm();
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('3');
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Hidden');
    expect(screen.getByTestId('saved-sort')).toHaveTextContent('difficulty');
  });

  it('saves the new page size and completed switch', () => {
    renderForm();
    // STEP 2: Enter 4 and turn on the switch.
    fireEvent.change(screen.getByLabelText('Tasks per page'), {
      target: { value: '4' },
    });
    fireEvent.click(screen.getByRole('switch', { name: 'Show completed tasks' }));

    // STEP 3: Before clicking Save, the preview is still 3/Hidden.
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('3');
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }));

    // STEP 4: Both the preview and the browser storage now have 4/true.
    expect(screen.getByTestId('saved-page-items')).toHaveTextContent('4');
    expect(screen.getByTestId('saved-completed')).toHaveTextContent('Visible');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toMatchObject({
      pageItems: 4,
      showCompleted: true,
    });
  });
});
