# Class 32 — Todo App, Phase 2: Context API Behaviors

**Beginner-friendly teaching app continued from the Class 31 starter project.** The original Phase 1 version remains in `class-31-phase1/`. This Phase 2 version lives in `class-32-phase2/` and is developed on the new `context-methods` branch.

## 🎯 Goal

Allow users to change two display settings, save them in Local Storage, and have their choices appear after refreshing the page.

- **Tasks per page:** Change the default of 3 to any whole number between 1 and 20.
- **Show completed tasks:** Turn finished tasks ON or OFF.
- **Sort word:** Keep `difficulty` as the default (sorting is a stretch goal).
- **Settings form:** Show editable choices on the left and SAVED choices on the right.
- **Context method:** Share a function called `saveSettings()`.
- **Storage:** Save settings with `JSON.stringify()` and restore them with `JSON.parse()` in `useEffect()`.
- **Tests:** Confirm the settings editor, Context, saved settings, and pagination all behave correctly.

**Not in Phase 2:** Login, permissions, backend server, Postgres, or storing todo tasks. Actual tasks are still temporary React state.

## STEP 1 — Start the right project

From your existing `todo-app` repository root:

~~~bash
git fetch origin
git switch context-methods
cd class-32-phase2
npm install
npm run dev
~~~

Open the local Vite address, usually http://localhost:5173.

This mini-app is separate from the existing root full-stack Todo app, so **do not start the backend** for this lesson.

**For students using their own repository:** Continue your Phase 1 code on a new branch called `context-methods`, as the original lab requires.

## STEP 2 — Find the important files

~~~text
class-32-phase2/
├── package.json                   npm scripts and packages
├── package-lock.json              Exact installed versions
├── index.html                     Where React begins
├── .env.example                   Optional public Vite title
├── .eslintrc.cjs                  Linter settings
├── vite.config.js                 Vite and Vitest settings
├── README.md
├── docs/
│   ├── UML.md                     Diagrams and data flow
│   └── INSTRUCTOR_GUIDE.md        Instructor lesson sequence
└── src/
    ├── main.jsx                   Wrap App in SettingsProvider
    ├── App.jsx                    Navigate Tasks / Settings
    ├── styles.scss                Visual styles
    ├── Context/Settings/
    │   ├── Settings.jsx           Shared settings + saveSettings
    │   └── Settings.test.jsx      Context and storage tests
    ├── Components/
    │   ├── Todo/
    │   │   ├── Todo.jsx           Task data, add/complete/delete
    │   │   └── Todo.test.jsx      Full-app behavior tests
    │   ├── List/
    │   │   ├── List.jsx           Filter, sort, pagination
    │   │   └── List.test.jsx      Individual List tests
    │   └── SettingsForm/
    │       ├── SettingsForm.jsx   NEW settings editor and preview
    │       └── SettingsForm.test.jsx
    ├── hooks/form.js              Existing useForm hook
    └── test/setup.js              Test browser stand-ins
~~~

**Every JavaScript/JSX file has numbered STEP comments.** JSON files cannot contain comments, so this README explains their purpose.

## STEP 3 — What changed from Phase 1?

| Topic | Phase 1 | Phase 2 |
| --- | --- | --- |
| Tasks per page | Always 3 | User chooses 1–20 |
| Completed tasks | Always hidden | User can show or hide them |
| Sorting | Default difficulty | Same default, optional extra sorting |
| Context | Share fixed values | Share values AND `saveSettings()` |
| Settings screen | None | New editable form |
| Save preferences | None | Browser Local Storage |
| Refresh | Rules reset | Saved rules return |
| Tasks themselves | React state | Still React state |

## STEP 4 — Read and change Context

Open `src/Context/Settings/Settings.jsx`.

A **Context Provider** is like a classroom whiteboard: every component inside it can read the shared rules. Phase 2 adds a shared **method** (a function).

~~~jsx
// SettingsForm.jsx can ask Context to save new settings.
const { pageItems, showCompleted, sort, saveSettings } =
  useContext(SettingsContext);

// Example of calling the shared function:
saveSettings({
  pageItems: 2,
  showCompleted: true,
  sort: 'difficulty',
});
~~~

- `pageItems`: how many cards per page.
- `showCompleted`: true or false; show or hide finished tasks.
- `sort`: the default word used for ordering the cards.
- `saveSettings`: a function that checks, saves, and shares the new values.

## STEP 5 — Save a preference using Local Storage

The Provider uses these two tools:

~~~js
// Turn the object into text BEFORE saving:
window.localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(updatedSettings)
);

// Turn the saved text BACK into an object when starting:
const savedObject = JSON.parse(savedText);
~~~

**Remember:** `JSON.stringify` = object → text. `JSON.parse` = text → object.

The Provider uses `useEffect()` to read Local Storage when the app starts. If no preference was saved (or the text is broken), it uses the default settings instead.

## STEP 6 — Try the app

1. Open **Tasks** and add five tasks.
2. See that the list shows three at a time.
3. Open **Settings**.
4. Change **Tasks per page** from 3 to 2.
5. Turn on **Show completed tasks**.
6. Look at **Active settings** on the RIGHT: they still show the saved values, not your unfinished edits.
7. Click **Save preferences**. The right card now shows the new values.
8. Return to Tasks. Your five tasks are still there, now two per page.
9. Complete a task. It stays visible because Show completed is ON; use **Undo** to make it incomplete again.
10. Return to Settings and click **Reset defaults**.
11. Refresh the browser. The settings remain saved, but the TASKS disappear (their database is a later lab).

**Important coding detail:** `App.jsx` keeps `Todo.jsx` mounted while the Settings page opens. This stops the in-memory task array from resetting when you switch screens.

## STEP 7 — How List uses the choices

~~~js
const { pageItems, showCompleted } =
  useContext(SettingsContext);

const filteredItems = showCompleted
  ? [...list]
  : list.filter(item => !item.complete);

const totalPages = Math.ceil(filteredItems.length / pageItems);
const start = (currentPage - 1) * pageItems;
const visiblePageItems = filteredItems.slice(start, start + pageItems);
~~~

Example with five tasks and two per page:

~~~text
Page 1: Task A, Task B
Page 2: Task C, Task D
Page 3: Task E
~~~

## STEP 8 — Run the tests

~~~bash
npm test
npm run build
npm run lint
~~~

The tests cover:
- Context values and the shared save function.
- Saving and reading browser storage.
- Safe defaults for invalid stored settings.
- Updated saved-values preview.
- Page size changes that really change List.
- Show/hide completed tasks and Undo.
- Task data surviving a switch between Tasks and Settings.
- Resetting and saving defaults.
- Phase 1 behavior and difficulty sorting.

## STEP 9 — UML and instructor materials

- [Detailed diagrams](docs/UML.md)
- [Instructor lesson sequence](docs/INSTRUCTOR_GUIDE.md)

## Lab checklist

- [x] New `context-methods` branch
- [x] Context at application level
- [x] Editable page size and show-completed switch
- [x] Default sort word remains a string
- [x] Settings form in its own component
- [x] Saved settings displayed to the right using Mantine Grid/Card
- [x] Context function to save new choices
- [x] JSON.stringify when storing settings
- [x] useEffect and JSON.parse to restore them at startup
- [x] Correct pagination after saved settings change
- [x] Completed items show/hide as chosen
- [x] Deep-mount and storage tests
- [x] Difficulty sorting stretch goal from Phase 1
- [ ] Optional useReducer stretch goal — intentionally skipped to keep Phase 2 focused

## Required AI-use documentation (instructor example)

**AI contribution:** ChatGPT compared the Class 31 Phase 1 project with the Class 32 curriculum, created the settings form, new Context saving/restoring behavior, navigation, list updates, tests, diagrams, and comments labeled STEP.

**Actual user prompt excerpt:** "/eli10 Act as a coding instructor and developer to help me create the first phase of a todo app based off of my students lab instructions and starter code. For each file add detailed comments that explain the code block and the steps it use based on the lab's instructions in simple terms."

The user included the complete "LAB: Context API - Behaviors" requirements and links to the Class 32 reference.

**Student tip:** Record the exact prompt you personally used and what AI did; do not copy this instructor disclosure into a student's submission.

## References

- [Class 32 reference code](https://github.com/jtimm-gicw/Code-401-PDX/tree/main/class-32/todo)
- [Class 32 lab examples](https://github.com/jtimm-gicw/Code-401-PDX/tree/main/class-32/lab)
- [React Context](https://react.dev/reference/react/useContext)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [Mantine Grid](https://mantine.dev/core/grid/)
- [Mantine NumberInput](https://mantine.dev/core/number-input/)
- [Mantine Switch](https://mantine.dev/core/switch/)
- [Mantine Pagination](https://mantine.dev/core/pagination/)
