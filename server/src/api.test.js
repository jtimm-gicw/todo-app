/**
 * Lightweight backend tests that run without a live database.
 * These test the most important permission and input validation rules.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROLE_CAPABILITIES, canRole } from './auth.js';
import { validateSignup, validateTask, validId } from './validation.js';

test('reader can only read tasks', () => {
  assert.deepEqual(ROLE_CAPABILITIES.reader, ['read']);
  assert.equal(canRole('reader', 'create'), false);
  assert.equal(canRole('reader', 'delete'), false);
});
test('editor can add and update but cannot delete', () => {
  assert.equal(canRole('editor', 'create'), true);
  assert.equal(canRole('editor', 'update'), true);
  assert.equal(canRole('editor', 'delete'), false);
});
test('only admin has all four capabilities', () => {
  for (const capability of ['read', 'create', 'update', 'delete']) assert.equal(canRole('admin', capability), true);
});
test('registration requires a strong-enough password and valid username', () => {
  assert.equal(validateSignup('student', 'long-password'), null);
  assert.ok(validateSignup('x', 'long-password'));
  assert.ok(validateSignup('student', 'short'));
});
test('tasks reject empty names and out-of-range difficulty', () => {
  assert.equal(validateTask({ text: 'Practice Context', assignee: '', difficulty: 3 }), null);
  assert.ok(validateTask({ text: ' ', assignee: '', difficulty: 3 }));
  assert.ok(validateTask({ text: 'Practice', difficulty: 8 }));
  assert.ok(validateTask({ text: 'Practice', difficulty: '3' }));
});
test('route IDs must be UUIDs', () => {
  assert.equal(validId('28d1df66-92a4-4562-ad54-9b047ebf3260'), true);
  assert.equal(validId('abc'), false);
});
