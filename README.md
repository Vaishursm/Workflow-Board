# Workflow Board

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. Features drag-and-drop functionality for organizing tasks across different status columns.

## How to Run the Project

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Architecture Overview

### App Structure
The application follows a component-based architecture with clear separation of concerns:

- **Pages**: Main application views (e.g., `Index.tsx` - the main board view)
- **Components**:
  - `board/`: Board-specific components (BoardColumn, TaskCard, TaskFormModal, FilterBar)
  - `ui/`: Reusable UI components (buttons, dialogs, etc. - using shadcn/ui)
- **Hooks**: Custom hooks for state management (`useTaskStore`, `useFilters`)
- **Lib**: Utility functions and data persistence (`storage.ts`, `utils.ts`)
- **Types**: TypeScript type definitions (`task.ts`)

### Key Decisions

#### State Management
- **Choice**: Custom hook (`useTaskStore`) with React's `useState` and `useCallback`
- **Rationale**: For a client-side task management app, a full state management library like Redux or Zustand would be overkill. The custom hook provides centralized state management with proper TypeScript typing, while keeping the API simple and React-native. Local storage integration is handled within the hook for automatic persistence.

#### Component Design
- **Choice**: Functional components with hooks, memoization for performance
- **Rationale**: Modern React patterns with functional components provide better performance and are easier to test. `React.memo` is used on frequently re-rendering components like `TaskCard` to prevent unnecessary re-renders. Components are designed to be reusable and composable, with clear prop interfaces.

#### Data Layer
- **Choice**: LocalStorage with versioning and migration support
- **Rationale**: Provides client-side persistence without requiring a backend. The versioning system allows for schema changes while maintaining backward compatibility. Migration functions handle data transformation when the data structure evolves, ensuring users don't lose their data during updates.

### Technologies Used
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Drag & Drop**: @dnd-kit/core
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

## Known Limitations and Trade-offs

### Limitations
- **Storage**: Relies on browser localStorage (typically 5-10MB limit)
- **Persistence**: Data is stored locally and not synchronized across devices
- **Offline**: No offline-first architecture - requires internet for initial load
- **Performance**: No virtualization for large task lists (suitable for <1000 tasks)
- **Accessibility**: Basic accessibility support, could be enhanced further

### Trade-offs
- **No Backend**: Simpler deployment and development, but limits multi-device sync
- **Client-side Only**: Faster development iteration, but data is not backed up
- **LocalStorage**: Simple persistence, but vulnerable to browser data clearing
- **No Real-time Updates**: Suitable for personal use, not collaborative workflows

## AI Assistance Documentation

This project was developed with assistance from GitHub Copilot (Grok Code Fast 1 model). AI was used extensively throughout the development process for:

### Where AI Was Used
- **Initial Project Setup**: Generated initial component structure and file organization
- **Component Implementation**: Created reusable UI components using shadcn/ui patterns
- **TypeScript Types**: Defined and refined type interfaces for tasks and components
- **State Management**: Implemented the custom `useTaskStore` hook with persistence
- **Drag & Drop Logic**: Integrated @dnd-kit for task movement between columns
- **Styling**: Applied Tailwind CSS classes and responsive design patterns
- **Error Handling**: Added try-catch blocks and validation logic
- **Code Refactoring**: Improved code organization and performance optimizations

### Changes from AI Suggestions
- **Component Structure**: Adapted AI-generated components to match the specific board layout and requirements
- **State Management**: Modified the suggested Zustand implementation to a custom hook for simpler API
- **Data Persistence**: Enhanced AI's basic localStorage approach with versioning and migration support
- **Error Handling**: Added more robust error boundaries and user feedback for storage issues
- **Performance**: Implemented `React.memo` and optimized re-renders based on actual performance profiling
- **Type Safety**: Strengthened TypeScript usage with stricter type checking and validation
- **UI/UX**: Customized the design system and component styling to match the workflow board theme
- **Accessibility**: Added ARIA labels and keyboard navigation that weren't in initial AI suggestions

The AI assistance significantly accelerated development, but all code was reviewed, tested, and modified to ensure it met the project's specific requirements and quality standards.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
