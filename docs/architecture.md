# Architecture

This document describes the high-level architecture and design decisions of the Starz Cosmic Oracle application.

## Overview

Starz Cosmic Oracle is a single-page application (SPA) built with modern web technologies. It follows a component-based architecture with clear separation of concerns.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | CSS with CSS variables |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |

## Project Structure

```
src/
├── components/      # Reusable UI components
│   └── Each component in its own folder with .tsx, .css, and test files
├── hooks/           # Custom React hooks
│   └── useLocalStorage.ts
│   └── useCosmicData.ts
├── utils/           # Pure helper functions
│   └── formatters.ts
│   └── validators.ts
├── types/           # Shared TypeScript types
│   └── index.ts
├── App.tsx          # Root component
├── App.css          # Root styles
├── main.tsx         # Application entry point
└── index.css        # Global styles and CSS variables
```

## Design Decisions

### React with Hooks
We use functional components with hooks for all new code. This provides a cleaner API and better composability compared to class components.

### CSS Variables for Theming
The application uses CSS custom properties (variables) defined in `index.css` for theming. This allows easy customization and supports future dark/light mode toggles.

### Vite for Build Tooling
Vite was chosen over Create React App for its faster development server and optimized production builds. It also has first-class TypeScript support.

### Vitest for Testing
Vitest provides a Jest-compatible API with native ESM support and faster execution through Vite's transform pipeline.

## Data Flow

```
User Interaction → Component → Hook/State → UI Update
                        ↓
                    API Call (future)
                        ↓
                   External Service
```

Currently, the application uses local state. As features grow, consider:
- React Context for global state
- React Query for server state management
- Zustand or Redux Toolkit for complex client state

## Future Architecture Considerations

### Backend Integration
When adding a backend API:
- Use `fetch` or a library like `axios`
- Implement error handling and loading states
- Add request/response interceptors for auth tokens

### Routing
For multi-page navigation, add `react-router-dom`:
```bash
npm install react-router-dom
```

### State Management
If global state grows complex:
- Start with React Context
- Migrate to Zustand for simplicity
- Use Redux Toolkit only for very complex state

## Performance

- Use `React.memo` for expensive components
- Lazy load routes with `React.lazy()` and `Suspense`
- Optimize images and assets
- Use `useMemo` and `useCallback` where beneficial
