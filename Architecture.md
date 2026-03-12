# Frontend Architecture -- Team Workflow Board

## 1. Overview

The Team Workflow Board is a ** React Single Page
Application (SPA)** that allows users to manage tasks in a Kanban-style
workflow.

Primary workflow:

Backlog → In Progress → Done

The application stores data locally in the browser using **LocalStorage**, with a clean separation between UI, state management,
and persistence logic.

Goals:

-   Maintainable component architecture
-   Predictable state management
-   Efficient rendering for large task lists
-   Simple browser persistence
-   Accessibility and usability

------------------------------------------------------------------------

# 2. High-Level Architecture

Browser │ ├── React Application │ ├── UI Layer (Design System
Components) │ ├── Feature Layer (Board / Tasks / Filters) │ ├── State
Layer (Context + Hooks) │ └── Data Layer (Storage Adapter) │ └── Local
Storage

Layer Responsibilities:

UI Layer\
Reusable visual components.

Feature Layer\
Implements business features such as task board, task creation,
filtering.

State Layer\
Centralized application state using React Context and custom hooks.

Data Layer\
Handles persistence logic and storage interaction.

------------------------------------------------------------------------

## 3. Component Hierarchy

```
App
└── Index (page)
    ├── Header (inline)
    │   └── Button ("New Task")
    ├── FilterBar
    │   ├── Input (search)
    │   ├── Select (status filter)
    │   ├── Select (priority filter)
    │   ├── Select (sort field)
    │   └── Button (reset filters)
    ├── Dashboard Page
    │   ├── BoardColumn (Backlog / In Progress / Done)
    │      └── TaskCards (any number per column)
    │           ├── Badge (high/ medium/ low)
    │           ├── Badge[] (additional tags)
    │           └── Other Action buttons (edit / move (dropdown) / delete)
    |           |__ Task Title
    |           |__ Task Description
    └── Modals
        ├── Dialog (create/edit form)
        └── AlertDialog (discard confirmation modal for Dirty state handling)

```

------------------------------------------------------------------------

# 4. Core Domain Model

Task Status

backlog \| in-progress \| done

Priority

low \| medium \| high

Example Task Interface

interface Task { id: string title: string description: string status:
"backlog" \| "in-progress" \| "done" priority: "low" \| "medium" \|
"high" tags?: string\[\] createdAt: string updatedAt: string }

------------------------------------------------------------------------

# 6. State Management

The application uses **React Context with custom hooks**.

TaskContext

Provides:

tasks\
createTask()\
updateTask()\
deleteTask()\
moveTask()

Example flow:

User action\
→ UI component\
→ Custom hook\
→ Context state update\
→ Persist to storage\
→ React re-render

------------------------------------------------------------------------

# 7. Data Persistence

All task data is stored in the browser.

Option 1: LocalStorage\
Best for small datasets.

Option 2: IndexedDB\
Better for larger boards.

Using Local storage structure in this project

Example LocalStorage structure:

workflow_board = { schemaVersion: 1, tasks: \[\] }

Storage Service

loadTasks()

saveTasks()

clearTasks()

------------------------------------------------------------------------

# 9. Filtering and Sorting

Filtering is implemented as **derived state**.

tasks\
↓\
applyFilters()\
↓\
applySorting()\
↓\
renderBoard()

Filters:

status\
priority\
text search

------------------------------------------------------------------------

# 10. Performance Strategy

Techniques that can be used:

React.memo for task cards

useMemo for filtered task lists

useCallback for handlers

Avoid unnecessary context re-renders

Future improvements:

virtualized task lists

IndexedDB for large datasets

------------------------------------------------------------------------

# 11. Accessibility

Accessibility considerations:

Keyboard navigation

ARIA roles for modals

Focus management

Semantic HTML elements

Example:

role="dialog"\
aria-modal="true"

------------------------------------------------------------------------

# 12. Error and Empty States

States to be handled in this project:

No tasks created

Filters returning zero results

Storage unavailable - (will be implemented if based on time availability)

Validation errors

Example UI messages:

"No tasks yet"

"No tasks match current filters"

------------------------------------------------------------------------

# 13. Testing Strategy

Tools:

Jest\
React Testing Library

Test Types:

Component rendering tests

Hook logic tests

User interaction tests

Example:

Create task\
→ Task appears in board

------------------------------------------------------------------------

# 14. Trade-offs

LocalStorage vs IndexedDB\
LocalStorage is simpler but limited in size.

Context vs Redux\
Context reduces complexity for small applications.

Client-only architecture\
No backend required for this use case.

------------------------------------------------------------------------

# 15. Summary

This frontend architecture prioritizes:

Clear component structure

Predictable state management

Efficient rendering

Simple browser-based persistence

The architecture will allow the application to evolve easily if a backend or
real-time collaboration is introduced later.


