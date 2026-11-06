/**
 * FILE: test/setup.js
 * PURPOSE: Prepare a fake browser so React components can be tested.
 * Mantine needs matchMedia and ResizeObserver; jsdom does not include them.
 * This follows Mantine's official Vitest testing guide.
 */
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// STEP 1: Give the tests a stand-in for the browser's screen-size checker.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// STEP 2: Give Mantine a stand-in for detecting changing element sizes.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// STEP 3: Some Mantine controls try to scroll into view.
// Fake that action because tests do not have a real page.
window.HTMLElement.prototype.scrollIntoView = () => {};
