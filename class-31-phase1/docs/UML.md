# Class 31 — Detailed UML and Data Flow

This is **Phase 1 only**. There is no login, API, database, settings editor, or saved task list.

## 1. Component diagram — who contains whom?

The arrows mean **contains**.

~~~mermaid
flowchart TD
    HTML["index.html — React root"]
    MAIN["main.jsx — starts the React app"]
    MANTINE["MantineProvider — shared design"]
    SETTINGS["SettingsProvider — fixed rules"]
    APP["App.jsx — main page"]
    TODO["Todo.jsx — stores all tasks"]
    LIST["List.jsx — shows filtered tasks"]
    FORM["useForm() — remembers form inputs"]
    PAGINATION["Mantine Pagination — page buttons"]

    HTML --> MAIN
    MAIN --> MANTINE
    MANTINE --> SETTINGS
    SETTINGS --> APP
    APP --> TODO
    TODO --> LIST
    TODO --> FORM
    LIST --> PAGINATION
~~~

**Teaching point:** SettingsProvider wraps the app, so both Todo and List can read its values.

## 2. Responsibilities and data

| File | Receives | Stores / Does | Sends |
| --- | --- | --- | --- |
| Settings.jsx | children | Fixed values: pageItems=3, showCompleted=false, sort='difficulty' | Context value to descendants |
| Todo.jsx | appTitle prop | Task array; add, toggle and delete; unfinished count | Task array and functions to List |
| List.jsx | list, toggleComplete, deleteItem props | Current page; filter, sort, slice | Visible task cards |
| form.js | callback, defaultValues | Form values | handleChange, handleSubmit, values |
| App.jsx | Vite title | Main layout | Todo component |

## 3. How Context and props are different

~~~mermaid
flowchart LR
    SP["SettingsProvider"] -- "Context: 3, false, difficulty" --> LIST["List.jsx"]
    TODO["Todo.jsx"] -- "Props: tasks + click functions" --> LIST
    LIST -- "Render" --> SCREEN["3 incomplete task cards"]
~~~

- **Props**: a note passed from one component to another.
- **Context**: a shared classroom whiteboard every child component can read.
- **State**: information React remembers between screen updates.

## 4. When the student clicks Add Item

~~~mermaid
sequenceDiagram
    actor Student
    participant Form as useForm()
    participant Todo as Todo.jsx
    participant List as List.jsx
    participant Settings as Settings Context
    Student->>Form: Type a task and click Add Item
    Form->>Todo: Call addItem(task)
    Todo->>Todo: Make ID, complete=false, setList()
    Todo->>List: Pass updated task array
    Settings->>List: Give 3 / false / difficulty
    List->>List: Filter, sort, slice
    List-->>Student: Show up to 3 unfinished tasks
~~~

## 5. Pagination example: 7 unfinished tasks

**Settings:** 3 items per page.

| Page | Start | End (not included) | Array indexes shown |
| --- | ---: | ---: | --- |
| 1 | 0 | 3 | 0, 1, 2 |
| 2 | 3 | 6 | 3, 4, 5 |
| 3 | 6 | 9 | 6 |

~~~js
const start = (page - 1) * pageItems;
const end = start + pageItems;
const currentTasks = filteredItems.slice(start, end);
~~~

**Why filtering first matters:** If five tasks exist but two are complete, we page through the **three unfinished tasks**, not blank spaces.

## 6. Student implementation checklist

1. main.jsx wraps App with SettingsProvider.
2. Settings.jsx exports SettingsContext and SettingsProvider.
3. Todo.jsx keeps task data in useState().
4. Todo.jsx passes list and click handlers to List.
5. List.jsx calls useContext(SettingsContext).
6. List.jsx filters, sorts, calculates pages, and slices.
7. Mantine Pagination receives value, onChange, and total.
8. Tests mount Providers and verify visible task cards.
