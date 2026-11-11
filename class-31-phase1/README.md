# Class 31 — Todo App, Phase 1: Context API

**Instructor-ready teaching version based on the actual Code-401-PDX Class 31 starter code.**

This is a **separate mini-app** inside the existing todo-app repository. It does NOT replace or interfere with the existing full-stack Daymark app at the repository root.

## 🎯 Today's goals

By the end of Phase 1, students should be able to:

- Explain Context using simple language.
- Make a Settings Context Provider.
- Use the fixed defaults: **3 per page**, **hide completed**, **sort field "difficulty"**.
- Move the task cards out of Todo.jsx into List.jsx.
- Filter incomplete tasks, calculate pages, and use Mantine Pagination.
- Write tests that check what a user can see and do.

**Not included in Phase 1:** login, accounts, API calls, database storage, editable settings, or Local Storage (optional stretch goal reserved for later).

## STEP 1 — Set up the classroom project

From the **todo-app repository root**:

~~~bash
git fetch origin
git switch teaching/class31-context-api-phase1
cd class-31-phase1
npm install
npm run dev
~~~

Open the local Vite address shown in your terminal, usually **http://localhost:5173**.

The original lab calls this a new app named `todo-app` and a branch named `context-settings`. Because your existing repository already has a separate full-stack app and an existing `context-settings` branch, this version lives safely in `class-31-phase1/` on its own teaching branch.

For a **student's own new repository**, they should follow the original setup instructions and work on their own `context-settings` branch.

## STEP 2 — Know the file structure

~~~text
class-31-phase1/
├── .env.example
├── .eslintrc.cjs
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── docs/
│   ├── UML.md
│   └── INSTRUCTOR_GUIDE.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.scss
    ├── Context/
    │   └── Settings/
    │       ├── Settings.jsx
    │       └── Settings.test.jsx
    ├── Components/
    │   ├── Todo/
    │   │   ├── Todo.jsx
    │   │   └── Todo.test.jsx
    │   └── List/
    │       ├── List.jsx
    │       └── List.test.jsx
    ├── hooks/
    │   └── form.js
    └── test/
        └── setup.js
~~~

**Every app source file includes its purpose and numbered STEP comments.** The original starter had `App.jsx`, `main.jsx`, `Components/Todo/index.jsx`, a Todo header test, and `hooks/form.js`. This version builds directly on those ideas.

## STEP 3 — Understand Context

Think of Context as a **shared classroom whiteboard**.

- SettingsProvider puts the same three rules on the board.
- Todo and List can read the rules using `useContext(SettingsContext)`.
- The settings are **NOT passed through props**.
- Task data and action functions are passed from Todo to List **as props**.

~~~jsx
// In main.jsx:
<SettingsProvider>
  <App />
</SettingsProvider>

// In List.jsx:
const { pageItems, showCompleted, sort } = useContext(SettingsContext);
~~~

## STEP 4 — Understand useForm()

The reusable `useForm(callback, defaultValues)` hook remembers what the user types.

| Name | Simple meaning |
| --- | --- |
| `callback` | A function that runs after the user submits the form. Here it is `addItem`. |
| `defaultValues` | Starting values for text, assignee, and difficulty. |
| `values` | Current form information stored with `useState`. |
| `handleChange` | Updates the correct form field when the user types or moves the slider. |
| `handleSubmit` | Prevents a page reload, calls `addItem(values)`, and resets the form. |

**Important:** Mantine Slider sends a NUMBER to its onChange handler. TextInput sends an event object. `handleChange` understands both forms.

## STEP 5 — How pagination works

List.jsx does the steps in this order:

1. Read Context.
2. Filter out completed tasks.
3. Sort tasks by difficulty (**implemented stretch goal**).
4. Calculate pages with `Math.ceil()`.
5. Select the current page with `slice(start, end)`.
6. Show the Mantine `Pagination` buttons if more than one page is needed.

~~~js
const start = (currentPage - 1) * pageItems;
const end = start + pageItems;
const visiblePageItems = filteredItems.slice(start, end);
~~~

With five unfinished tasks and three per page, page 1 shows three tasks; page 2 shows two.

## STEP 6 — Run the tests

~~~bash
npm test
~~~

Or keep tests running while students edit:

~~~bash
npm run test:watch
~~~

Tests check the Context defaults, whether a child can read Context, initial header, adding tasks, three per page, page navigation, filtering completed tasks, deletion, and difficulty sorting.

For a production build:

~~~bash
npm run build
~~~

To check React JSX syntax and the ESLint setting required by the original lab:

~~~bash
npm run lint
~~~

## STEP 7 — Demonstrate the app

1. Start with zero tasks.
2. Add five example tasks, leaving difficulty at 4.
3. Show that only three appear.
4. Click **page 2** and show the other two.
5. Click **Done** on one task; it disappears by default.
6. Explain that completion changes the array, not the Settings Context.
7. Refresh the browser: tasks disappear because Phase 1 only stores them in React state.

## STEP 8 — Explain the diagram

See **[docs/UML.md](docs/UML.md)** for:
- Component relationships.
- Props vs Context vs state.
- What happens after adding a task.
- How slice() calculates each page.

See **[docs/INSTRUCTOR_GUIDE.md](docs/INSTRUCTOR_GUIDE.md)** for a timed 45-minute live demonstration.

## STEP 9 — Lab checklist

- [x] Vite / React application.
- [x] Mantine components for layout and pagination.
- [x] New Settings Context provided at the app level.
- [x] Fixed values: pageItems=3, showCompleted=false, sort='difficulty'.
- [x] List modularized into a separate component.
- [x] Completed items hidden.
- [x] Three unfinished tasks maximum per page.
- [x] Mantine Pagination controls page changes.
- [x] Difficulty sorting (stretch).
- [x] Deep-mounted React tests and Context tests.
- [x] Detailed UML diagrams and useForm explanation.
- [x] ESLint `react/prop-types` off, as in the lab.
- [ ] Optional Local Storage stretch goal — intentionally NOT included.

## AI-use documentation (instructor example)

**AI contribution:** ChatGPT compared the actual Class 31 starter files with the lab, created a modular Phase 1 example, wrote explanatory STEP comments, designed Mantine components, developed tests, and drafted diagrams and instructor documentation.

**Actual user prompt (opening request):**

> "Act as a coding instructor and developer to help me create the first phase of a todo app based off of my students lab instructions and starter code. For each file add detailed comments that explain the code block and the steps it use based on the lab's instructions. The comments should be easy to understand and use as little tech jargon as possible. The STEPS should be clearly labeled and should explain what to do in a simple manner."

The user supplied the full **LAB - Context API** Phase 1 instructions and the linked starter-code repository in the same request.

**Student reminder:** If you use AI for your own work, record the exact prompt YOU used and what the AI helped you do, rather than copying this instructor example as your own contribution.

## Reference links

- [Original Class 31 starter](https://github.com/jtimm-gicw/Code-401-PDX/tree/main/class-31/lab/starter-code/src)
- [Mantine Pagination](https://mantine.dev/core/pagination/)
- [Mantine + Vitest guide](https://mantine.dev/guides/vitest/)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Class 31 Lab Submission Instructions](https://codefellows.github.io/code-401-javascript-guide/reference/submission-instructions/labs/react-apps.html)

**IMPORTANT:** Classroom exercises are for learning React Context. Task data is intentionally kept in browser memory. The app does not connect to PostgreSQL or use the backend from the separate full-stack project.
