# Class 32 — UML Diagrams: Settings Behaviors

## 1. Which component handles each job?

~~~mermaid
flowchart TD
    MAIN["main.jsx"] --> MANTINE["MantineProvider — design"]
    MANTINE --> PROVIDER["SettingsProvider — values + saveSettings()"]
    PROVIDER --> APP["App.jsx — Tasks and Settings buttons"]
    APP --> TODO["Todo.jsx — holds the task array"]
    APP --> FORM["SettingsForm.jsx — edits preferences"]
    TODO --> LIST["List.jsx — filters, sorts, paginates"]
    TODO --> HOOK["useForm() — remembers task form values"]
    STORAGE[("Browser Local Storage — preferences only")]
    PROVIDER <-->|"Save and restore JSON text"| STORAGE
    PROVIDER -. "Context values" .-> LIST
    PROVIDER -. "Context + saveSettings()" .-> FORM
~~~

## 2. Props vs Context vs Local Storage

| Word | In simple language | Our example |
| --- | --- | --- |
| Props | A note one component hands to another | Todo passes task list to List |
| Context | Shared classroom whiteboard | List reads pageItems |
| State | Information React remembers while open | Todo's tasks, Settings preferences |
| Context method | Shared function a component may call | SettingsForm calls saveSettings |
| Local Storage | Small saved text for one browser | Preferences survive a refresh |
| JSON.stringify | Object → text | Save settings |
| JSON.parse | Text → object | Restore settings |

## 3. Sequence: save the preferences

~~~mermaid
sequenceDiagram
    actor Student
    participant Form as SettingsForm
    participant Provider as SettingsProvider
    participant Storage as Local Storage
    participant List
    Student->>Form: Change page size from 3 to 2
    Form->>Form: Update draft (not saved yet)
    Student->>Form: Click Save
    Form->>Provider: saveSettings(draft)
    Provider->>Provider: Check values
    Provider->>Storage: JSON.stringify + setItem
    Provider->>Provider: setSettings
    Provider-->>Form: Show new saved values
    Provider-->>List: New page size
    List-->>Student: Display 2 task cards per page
~~~

## 4. Sequence: start the app again

~~~mermaid
sequenceDiagram
    actor Student
    participant Browser
    participant Provider as SettingsProvider
    participant Storage as Local Storage
    Student->>Browser: Refresh browser
    Browser->>Provider: Mount Provider
    Provider->>Provider: Begin with defaults
    Provider->>Storage: getItem(key)
    Storage-->>Provider: Return saved JSON text
    Provider->>Provider: JSON.parse and check values
    Provider-->>Student: Apply saved preferences
~~~

**Important:** Task data does not survive a full refresh in Phase 2.

## 5. Why switching to Settings does not remove tasks

~~~text
App.jsx
├── Tasks navigation button
├── Settings navigation button
├── Todo.jsx         ← stays mounted but hidden on Settings
│   ├── task useState([])
│   └── List.jsx
└── SettingsForm.jsx ← shown when Settings is selected
~~~

The saved preferences update immediately after Save; the tasks stay in React memory until the browser page is refreshed.

## 6. Pagination example

~~~text
pageItems = 2
5 visible tasks

Page 1: [ A | B ]
Page 2: [ C | D ]
Page 3: [ E ]
~~~

Math.ceil(5 / 2) = 3 pages.

## 7. Files to open in teaching order

1. src/main.jsx
2. src/Context/Settings/Settings.jsx
3. src/App.jsx
4. src/Components/SettingsForm/SettingsForm.jsx
5. src/Components/List/List.jsx
6. src/Components/Todo/Todo.test.jsx
