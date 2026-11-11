# 👨‍🏫 Class 31 — Context API, List Refactor, and Pagination

**Instructor demonstration plan — 45 minutes**

> Goal: Students can explain *why* Context exists and show exactly where filtering and pagination happen.

## Preparation — before class

- Open the class-31-phase1 folder in VS Code.
- Run `npm install`, then `npm run dev`.
- Keep `docs/UML.md` open for the diagram.
- Prepare a second terminal for `npm test`.
- Explain that this is **only Phase 1**: no editable settings, API, or authentication.
- Refresh the browser before the demo to clear the in-memory tasks.

## 🎯 STEP 1 — What problem are we solving? (5 min)

📂 **[FILE TO OPEN]** `src/Components/Todo/Todo.jsx`

📢 **SAY:** "Our starter Todo component was doing almost everything itself. Today we separate the rules for *how to display tasks* from the tasks themselves."

👉 **SHOW:** The list lives in `useState([])`. Explain that tasks change when we add, complete, or delete them.

❓ **ASK:** "Should the number of tasks per page belong to one task or the entire app?" Answer: the whole app.

## 🎯 STEP 2 — Create shared settings (8 min)

📂 **[FILE TO OPEN]** `src/Context/Settings/Settings.jsx`

👉 **SHOW STEP 1:** `createContext(null)` creates a shared place for values.

👉 **SHOW STEP 2:** `DEFAULT_SETTINGS` holds these fixed values:

~~~js
{
  pageItems: 3,
  showCompleted: false,
  sort: 'difficulty'
}
~~~

📢 **SAY:** "Three task cards at a time, completed ones hidden, and difficulty as the default sort word."

👉 **SHOW STEP 3:** SettingsProvider gives those rules to its children.

⚠️ **REMINDER:** Do not add a settings editor yet. That is Phase 2.

## 🎯 STEP 3 — Give the app access to the settings (5 min)

📂 **[FILE TO OPEN]** `src/main.jsx`

👉 Show the Provider wrapping App:

~~~jsx
<SettingsProvider>
  <App />
</SettingsProvider>
~~~

📢 **SAY:** "Components inside the Provider can read settings. No need to pass these values through many layers."

❓ **ASK:** "Can a component outside the Provider read these settings?" Answer: not from that Provider.

## 🎯 STEP 4 — Separate Todo and List (7 min)

📂 **[FILE TO OPEN]** `src/Components/Todo/Todo.jsx`

👉 Show `addItem()`, `toggleComplete()`, and `deleteItem()`.

👉 Show the `<List />` component receiving the task array and click functions.

📢 **SAY:** "Todo remembers *what tasks exist*. List decides *which ones are visible*."

⚠️ **REMINDER:** When changing a task, create a NEW object. Do not change `item.complete` directly.

## 🎯 STEP 5 — Filter, paginate, and sort (10 min)

📂 **[FILE TO OPEN]** `src/Components/List/List.jsx`

👉 **SHOW THESE STEPS IN ORDER:**

1. `useContext()` reads the shared rules.
2. `filter()` hides completed tasks.
3. `sort()` orders tasks by difficulty (stretch goal).
4. `Math.ceil(length / pageItems)` calculates page count.
5. `slice(start, end)` gets one page of tasks.
6. `<Pagination />` draws the page buttons.

~~~text
7 unfinished tasks, 3 per page

Page 1: [ A | B | C ]
Page 2: [ D | E | F ]
Page 3: [ G ]
~~~

📢 **SAY:** "We do not hide extra cards with CSS. We select only the array items for the active page."

❓ **ASK:** "Why use Math.ceil() instead of Math.floor()?" Answer: a leftover task still needs its own page.

## 🎯 STEP 6 — Verify the behavior (10 min)

📂 **[FILES TO OPEN]** `src/Components/Todo/Todo.test.jsx` and `src/Components/List/List.test.jsx`

👉 Run `npm test`.

👉 Add five tasks in the browser; click page 2.

👉 Complete one task; it disappears.

👉 Point to tests verifying Context access, three tasks per page, page 2, hidden completed tasks, and sorting.

📢 **WRAP-UP:** "React state stores the task data. Context shares display rules. List combines both to decide what the user sees."

## What comes later?

- **Phase 2:** Edit settings and save preferences in Local Storage.
- **Phase 3:** Login and access controls.
- **Phase 4:** Server requests and database storage.

For today, keep the focus on **Context, props, array methods, pagination, and testing**.
