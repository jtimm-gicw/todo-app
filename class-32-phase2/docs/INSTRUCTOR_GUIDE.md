# Class 32 — Context API Behaviors: Instructor Guide

🎯 **Goal:** Students should understand how a Context Provider shares both VALUES and a FUNCTION, so users can edit, save, and restore two Todo display settings.

## Prep

📂 **[FILE TO OPEN]** README.md

👉 **DO:** Run the following from the repository root:

~~~bash
git fetch origin
git switch context-methods
cd class-32-phase2
npm install
npm run dev
~~~

**💡 [EXPLAIN]** npm install downloads the React/Mantine/Vite packages this app needs; npm run dev starts the Vite development site. No PostgreSQL server needed.

➡️ **NEXT FILE:** src/Context/Settings/Settings.jsx

## STEP 1 — Review the fixed settings from Phase 1

📂 **[FILE TO OPEN]** src/Context/Settings/Settings.jsx

📢 **[TELL]** "Last class, our settings were fixed. Now the user gets to change two values: how many tasks fit on a page, and whether completed tasks are shown."

👉 **DO:** Point to DEFAULT_SETTINGS and createContext().

💡 **[EXPLAIN]** Context is like a shared classroom whiteboard. The Provider writes the rules, and components inside can read them.

➡️ **NEXT FILE:** src/main.jsx

## STEP 2 — Connect the Provider to the app

📂 **[FILE TO OPEN]** src/main.jsx

👉 **DO:** Show SettingsProvider wrapping App.

💡 **[EXPLAIN]** This is why both Todo and SettingsForm get the same information without sending props through every component.

➡️ **NEXT FILE:** src/App.jsx

## STEP 3 — Switch between Tasks and Settings

📂 **[FILE TO OPEN]** src/App.jsx

👉 **DO:** Find view, setView, and the Tasks/Settings buttons.

⚠️ **!! [IMPORTANT]** Todo remains mounted (hidden while on Settings) so switching views does not erase the tasks in React memory.

➡️ **NEXT FILE:** src/Components/SettingsForm/SettingsForm.jsx

## STEP 4 — Edit two preferences

📂 **[FILE TO OPEN]** src/Components/SettingsForm/SettingsForm.jsx

👉 **DO:** Show NumberInput for tasks per page, Switch for completed tasks, and the Save button.

💡 **[EXPLAIN]** The form holds a "draft"; the right-hand card shows SAVED settings.

❓ **[CHECK-IN QUESTIONS]** "If I type 2 but do not save, should the right-hand preview change?" Answer: No.

➡️ **NEXT FILE:** src/Context/Settings/Settings.jsx

## STEP 5 — Save and restore preferences

📂 **[FILE TO OPEN]** src/Context/Settings/Settings.jsx

👉 **DO:** Show saveSettings() and the useEffect() near the top of the Provider.

💡 **[EXPLAIN]** JSON.stringify turns settings into text for storage. JSON.parse turns that text back into an object when the app restarts.

[STUDENT TIP] Use the browser developer tools to inspect Local Storage, then try refreshing the page.

➡️ **NEXT FILE:** src/Components/List/List.jsx

## STEP 6 — Let List react to the new values

📂 **[FILE TO OPEN]** src/Components/List/List.jsx

👉 **DO:** Point to useContext(), filter(), Math.ceil(), slice(), and Mantine Pagination.

💡 **[EXPLAIN]** When settings change, List uses the latest shared values automatically.

❓ **[CHECK-IN QUESTIONS]** "If we have five visible tasks and show two per page, how many pages?" Answer: Three.

➡️ **NEXT FILE:** src/Components/Todo/Todo.test.jsx

## STEP 7 — Run the tests

📂 **[FILE TO OPEN]** src/Components/Todo/Todo.test.jsx

👉 **DO:** Run npm test.

👨‍🏫 **[TEACHER NOTE]** These tests render the complete app inside SettingsProvider, which proves that children can read Context and that the form changes the list.

➡️ **NEXT FILE:** docs/UML.md

## STEP 8 — Wrap up

📂 **[FILE TO OPEN]** docs/UML.md

📢 **[TELL]** "Todo owns task data. SettingsContext owns settings. SettingsForm changes them. List uses them."

⚠️ **!! [IMPORTANT]** useReducer is a stretch goal; skip it if students are still learning Context or need more practice with Local Storage.

**Final reminder:** Settings survive a browser refresh. Tasks do not (yet).
