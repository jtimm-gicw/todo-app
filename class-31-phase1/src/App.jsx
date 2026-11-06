/**
 * FILE: App.jsx
 * PURPOSE: The outer layout of our starter-based Todo application.
 *
 * In the starter code, App was a class component.
 * We use a function component here because it is shorter and
 * students are practicing modern React function components.
 */
import { Container } from '@mantine/core';
import Todo from './Components/Todo/Todo.jsx';

export default function App() {
  // STEP 1: Read the optional Vite environment variable.
  // Example .env: VITE_APP_TITLE=Class 31 To Do Lab
  // If no .env is present, we use the fallback text below.
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Class 31 To Do Lab';

  // STEP 2: Render the Todo component inside a centered container.
  // Notice we do NOT pass pageItems or showCompleted as props.
  // The Todo/List components can get settings from Context directly.
  return (
    <main>
      <Container size="lg" py="xl">
        <Todo appTitle={appTitle} />
      </Container>
    </main>
  );
}
